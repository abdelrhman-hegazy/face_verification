import {
  detectFaceAndCrop,
  getEmbedding,
  compareEmbeddings,
} from "./face.sevices.js";
import { saveEmbedding, getUserEmbedding } from "./face.model.js";
import { CONFIG } from "../../config/env.js";

export async function encode(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No image provided" });

    const faceBuffer = await detectFaceAndCrop(req.file.buffer);
    const embedding = await getEmbedding(faceBuffer);

    if (req.body.username) {
      await saveEmbedding(req.body.username, embedding);
    }

    res.json({ success: true, embedding });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
export async function compare(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, error: "No image provided" });
    if (!req.body.username)
      return res
        .status(400)
        .json({ success: false, error: "No username provided" });


    const storedEmbedding = await getUserEmbedding(req.body.username);
    console.log(req.body.username);
    
    if (!storedEmbedding) {
      console.log("User not found");
      return res.status(404).json({ success: false, error: "User not found" });
    }


    const faceBuffer = await detectFaceAndCrop(req.file.buffer);
    const newEmbedding = await getEmbedding(faceBuffer);


    const { isMatch, similarity } = compareEmbeddings(
      newEmbedding,
      storedEmbedding,
      CONFIG.SIMILARITY_THRESHOLD
    );

    res.json({ success: true, isMatch, similarity });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
