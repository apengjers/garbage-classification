import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

let model: tf.LayersModel | null = null;

export const loadModel = async () => {
  if (model) return model;

  await tf.ready();

  model = await tf.loadLayersModel(
    bundleResourceIO(
      require("../model/model.json"),
      require("../model/weights.bin"),
    ),
  );
  return model;
};

export const predict = async (tensor: tf.Tensor) => {
  if (!model) throw new Error("Model belum diload");

  return tf.tidy(() => {
    const result = model!.predict(tensor) as tf.Tensor;
    return result.dataSync();
  });
};
