import * as tf from "@tensorflow/tfjs";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";

export const imageToTensor = async (imageUri: string) => {
  const response = await fetch(imageUri);
  const buffer = await response.arrayBuffer();

  const imageTensor = decodeJpeg(new Uint8Array(buffer));
  const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
  const normalized = resized.div(255);
  const batched = normalized.expandDims(0);
  return batched;
};
