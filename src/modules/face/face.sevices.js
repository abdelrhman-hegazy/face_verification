import sharp from "sharp";
import * as ort from "onnxruntime-node";
import { getSessions } from "../../config/modelLoder.js";
import { l2Normalize, cosineSimilarity } from "./face.helper.js";

/**
 * Detects face in an image and crops it to 112x112
 * @param {Buffer} imageBuffer
 * @returns {Promise<Buffer>} Cropped face buffer
 */

export async function detectFaceAndCrop(imageBuffer) {
  const { detectorSession } = getSessions();

  // ✅ Must match the model’s expected input shape
  const detectorInputSize = 128; // Fix from 640 → 128

  // Step 1: Preprocess (resize + normalize)
  const { data, info } = await sharp(imageBuffer)
    .resize(detectorInputSize, detectorInputSize)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Step 2: Normalize to [-1, 1] and convert HWC → CHW
  const chw = new Float32Array(3 * info.height * info.width);
  for (let h = 0; h < info.height; h++) {
    for (let w = 0; w < info.width; w++) {
      const i = (h * info.width + w) * 3;
      chw[0 * info.height * info.width + h * info.width + w] =
        (data[i] - 127.5) / 128.0; // R
      chw[1 * info.height * info.width + h * info.width + w] =
        (data[i + 1] - 127.5) / 128.0; // G
      chw[2 * info.height * info.width + h * info.width + w] =
        (data[i + 2] - 127.5) / 128.0; // B
    }
  }

  // Step 3: Prepare ONNX input tensors
  const inputTensor = new ort.Tensor("float32", chw, [
    1,
    3,
    info.height,
    info.width,
  ]);

  const feeds = {
    image: inputTensor,
    conf_threshold: new ort.Tensor("float32", new Float32Array([0.05])),
    max_detections: new ort.Tensor("int64", new BigInt64Array([BigInt(1)])),
    iou_threshold: new ort.Tensor("float32", new Float32Array([0.4])),
  };

  // Step 4: Run model
  console.log("🔹 Running detector model...");
  const results = await detectorSession.run(feeds);
  const outName = detectorSession.outputNames[0];
  const out = results[outName]?.data;

  console.log(
    "🔹 Detection output:",
    out?.length ? out.slice(0, 10) : "EMPTY",
    "length:",
    out?.length
  );

  if (!out || out.length < 4) {
    throw new Error("No face detected");
  }

  // Step 5: Extract and crop detected region
  const [x1, y1, x2, y2] = out;
  const meta = await sharp(imageBuffer).metadata();
  const origW = meta.width;
  const origH = meta.height;

  const left = Math.max(0, Math.round(x1 * origW));
  const top = Math.max(0, Math.round(y1 * origH));
  const width = Math.min(origW - left, Math.round((x2 - x1) * origW));
  const height = Math.min(origH - top, Math.round((y2 - y1) * origH));

  const faceBuffer = await sharp(imageBuffer)
    .extract({ left, top, width, height })
    .resize(112, 112)
    .toFormat("png")
    .toBuffer();

  console.log("✅ Face cropped successfully");
  return faceBuffer;
}

/**
 * Generates a face embedding (feature vector)
 * @param {Buffer} faceBuffer
 * @returns {Promise<number[]>}
 */
export async function getEmbedding(faceBuffer) {
  const { embedSession } = getSessions();

  const { data, info } = await sharp(faceBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Normalize to [-1, 1]
  const float32 = new Float32Array(data.length);
  for (let i = 0; i < data.length; i++) {
    float32[i] = (data[i] - 127.5) / 128.0;
  }

  // ArcFace typically expects [1, 112, 112, 3]
  const inputTensor = new ort.Tensor("float32", float32, [
    1,
    info.height,
    info.width,
    info.channels,
  ]);

  const feeds = {};
  feeds[embedSession.inputNames[0]] = inputTensor;

  console.log("🔹 Running embedding model...");
  const results = await embedSession.run(feeds);

  const outName = embedSession.outputNames[0];
  const embedding = Array.from(results[outName].data);
  console.log("✅ Embedding generated (length:", embedding.length, ")");

  return l2Normalize(embedding);
}

/**
 * Compare two embeddings and return similarity score
 * @param {number[]} embedding1
 * @param {number[]} embedding2
 * @param {number} threshold
 */
export function compareEmbeddings(embedding1, embedding2, threshold = 0.5) {
  const similarity = cosineSimilarity(embedding1, embedding2);
  return {
    isMatch: similarity >= threshold,
    similarity,
  };
}
