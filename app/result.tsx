import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { imageToTensor } from "../src/helpers/image";
import { loadModel, predict } from "../src/helpers/model";

const LABELS = [
  "Kaca",
  "Karton",
  "Kertas",
  "Logam",
  "Plastik",
  "sampahCampuran",
];

const LABEL_INFO: Record<
  string,
  {
    category: string;
    description: string;
  }
> = {
  Kaca: {
    category: "Daur Ulang",
    description:
      "Sampah kaca dapat didaur ulang menjadi produk baru seperti botol dan gelas. Pastikan untuk membuangnya di tempat sampah yang sesuai.",
  },
  Karton: {
    category: "Daur Ulang",
    description:
      "Sampah karton dapat didaur ulang menjadi produk baru seperti kotak dan kertas. Pastikan untuk membuangnya di tempat sampah yang sesuai.",
  },
  Kertas: {
    category: "Daur Ulang",
    description:
      "Sampah kertas dapat didaur ulang menjadi produk baru seperti kertas dan koran. Pastikan untuk membuangnya di tempat sampah yang sesuai.",
  },
  Logam: {
    category: "Daur Ulang",
    description:
      "Sampah logam dapat didaur ulang menjadi produk baru seperti alat rumah tangga dan kendaraan. Pastikan untuk membuangnya di tempat sampah yang sesuai.",
  },
  Plastik: {
    category: "Daur Ulang",
    description:
      "Sampah plastik dapat didaur ulang menjadi produk baru seperti kantong dan mainan. Pastikan untuk membuangnya di tempat sampah yang sesuai.",
  },
  sampahCampuran: {
    category: "Residu",
    description:
      "Sampah campuran sulit dipisahkan dan umumnya menjadi limbah residu.",
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
    run();
  }, []);

  const run = async () => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Hasil Scan Sampah</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>{result?.label}</Text>

          <Text style={styles.confidence}>
            Akurasi: {result?.confidence.toFixed(1)}%
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 20,
    color: "#111827",
  },

  image: {
    width: 260,
    height: 260,
    borderRadius: 20,
    marginBottom: 24,
  },

  loading: {
    marginTop: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  label: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  confidence: {
    fontSize: 16,
    marginTop: 8,
    color: "#4B5563",
  },

  badge: {
    marginTop: 14,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },

  badgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
  },

  description: {
    marginTop: 18,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    color: "#374151",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
