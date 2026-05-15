import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { imageToTensor } from "../src/helpers/image";
import { loadModel, predict } from "../src/helpers/model";

const LABELS = [
  "Baterai",
  "Besi",
  "Biologis",
  "Kaca Bening",
  "Kaca Coklat",
  "Kaca Hijau",
  "Karton",
  "Kertas",
  "Pakaian",
  "Plastik",
  "Sampah Campuran",
  "Sepatu",
];

const LABEL_INFO: Record<
  string,
  {
    category: string;
    description: string;
  }
> = {
  Baterai: {
    category: "B3",
    description:
      "Baterai termasuk limbah berbahaya dan tidak boleh dibuang sembarangan.",
  },

  Besi: {
    category: "Daur Ulang",
    description: "Besi dapat didaur ulang menjadi berbagai produk logam baru.",
  },

  Biologis: {
    category: "Organik",
    description:
      "Sampah biologis dapat diolah menjadi kompos atau pupuk organik.",
  },

  "Kaca Bening": {
    category: "Daur Ulang",
    description:
      "Kaca bening dapat didaur ulang menjadi botol atau produk kaca baru.",
  },

  "Kaca Coklat": {
    category: "Daur Ulang",
    description:
      "Kaca coklat dapat diproses kembali menjadi kemasan kaca baru.",
  },

  "Kaca Hijau": {
    category: "Daur Ulang",
    description:
      "Kaca hijau dapat didaur ulang untuk mengurangi limbah lingkungan.",
  },

  Karton: {
    category: "Daur Ulang",
    description: "Karton dapat didaur ulang menjadi kemasan atau kertas baru.",
  },

  Kertas: {
    category: "Daur Ulang",
    description: "Kertas dapat diproses kembali menjadi produk kertas baru.",
  },

  Pakaian: {
    category: "Reuse",
    description:
      "Pakaian bekas masih dapat digunakan kembali atau didonasikan.",
  },

  Plastik: {
    category: "Daur Ulang",
    description: "Plastik dapat didaur ulang menjadi berbagai produk baru.",
  },

  "Sampah Campuran": {
    category: "Residu",
    description:
      "Sampah campuran sulit dipisahkan dan biasanya menjadi limbah residu.",
  },

  Sepatu: {
    category: "Reuse",
    description: "Sepatu bekas masih bisa digunakan kembali atau didonasikan.",
  },
};

export default function Result() {
  const { image } = useLocalSearchParams<{ image: string }>();

  const [loading, setLoading] = useState(true);

  const [result, setResult] = useState<{
    label: string;
    confidence: number;
  } | null>(null);

  useEffect(() => {
    runPrediction();
  }, []);

  const runPrediction = async () => {
    try {
      if (!image) return;

      await loadModel();

      const tensor = await imageToTensor(image);

      const probs = await predict(tensor);

      let bestIndex = 0;

      for (let i = 1; i < probs.length; i++) {
        if (probs[i] > probs[bestIndex]) {
          bestIndex = i;
        }
      }

      setResult({
        label: LABELS[bestIndex],
        confidence: probs[bestIndex] * 100,
      });
    } catch (error) {
      console.log(error);

      setResult({
        label: "Error",
        confidence: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const info = result ? LABEL_INFO[result.label] : null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hasil Scan</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>{result?.label}</Text>

          <Text style={styles.confidence}>
            Akurasi {result?.confidence.toFixed(1)}%
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>{info?.category}</Text>
          </View>

          <Text style={styles.description}>{info?.description}</Text>
        </View>
      )}

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Scan Lagi</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  image: {
    width: 280,
    height: 280,
    borderRadius: 24,
    marginBottom: 24,
  },

  loader: {
    marginTop: 40,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 5,
  },

  label: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },

  confidence: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },

  badge: {
    marginTop: 16,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },

  badgeText: {
    color: "#166534",
    fontWeight: "700",
    fontSize: 14,
  },

  description: {
    marginTop: 18,
    textAlign: "center",
    lineHeight: 24,
    fontSize: 15,
    color: "#4B5563",
  },

  button: {
    marginTop: 28,
    backgroundColor: "#22C55E",
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 16,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
