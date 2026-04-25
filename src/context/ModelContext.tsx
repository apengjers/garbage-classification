import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import { createContext, useContext, useEffect, useState } from "react";

type ModelContextType = {
  model: any;
  loading: boolean;
};

const ModelContext = createContext<ModelContextType | null>(null);

export const ModelProvider = ({ children }: { children: any }) => {
  console.log("provider mounted");
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      await tf.ready();
      await tf.setBackend("rn-webgl");
      const loadedModel = await tf.loadLayersModel(
        bundleResourceIO(
          require("../../assets/model/model.json"),
          require("../../assets/model/weights.bin"),
        ),
      );
      setModel(loadedModel);
    } catch (error) {
      console.error("Error loading model:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModelContext.Provider value={{ model, loading }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const ctx = useContext(ModelContext);

  if (!ctx) {
    throw new Error("useModel must be inside ModelProvider");
  }

  return ctx;
};
