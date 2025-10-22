import * as ort from 'onnxruntime-node';
let detectorSession = null;
let embedSession = null;

export async function loadModels() {
  detectorSession = await ort.InferenceSession.create('./src/models/blazeface.onnx');
  embedSession = await ort.InferenceSession.create('./src/models/arcface.onnx');
  console.log('ONNX Models loaded successfully');
}

export function getSessions() {
  return { detectorSession, embedSession };
}
