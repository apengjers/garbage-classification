import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Image,
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
  "Sampah Campuran",
];

export default function Result() {
  const { image } = useLocalSearchParams<{ image: string }>();

  const [loading, setLoading] = useState(true);
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    run();
  }, []);

  const run = async () => {
    try {
      if (!image) return;

      const model = await loadModel();
      const tensor = await imageToTensor(image);

      const probs = await predict(tensor);

      let bestIndex = 0;
      for (let i = 1; i < probs.length; i++) {
        if (probs[i] > probs[bestIndex]) bestIndex = i;
      }

      setResultText(
        `${LABELS[bestIndex]} (${(probs[bestIndex] * 100).toFixed(1)}%)`,
      );
    } catch (err) {
      console.log(err);
      setResultText("error");
    } finally {
      setLoading(false);
    }
  };

  const getDescription = (label: string) => {
    switch (label) {
      case "memproses gambar...":
        return "Model sedang dimuat, harap tunggu...";
      case "Kaca":
        return "Kaca adalah bahan yang dapat didaur ulang dan digunakan kembali untuk membuat berbagai produk seperti botol, jendela, dan peralatan rumah tangga. Daur ulang kaca membantu mengurangi limbah dan konservasi sumber daya alam.";
      case "Kertas":
        return "Kertas adalah bahan yang dapat didaur ulang dan digunakan kembali untuk membuat berbagai produk seperti buku, koran, dan kemasan. Daur ulang kertas membantu mengurangi limbah dan konservasi sumber daya alam.";
      case "Karton":
        return "Karton adalah jenis kertas yang lebih tebal dan kuat, sering digunakan untuk kemasan. Daur ulang karton membantu mengurangi limbah dan konservasi sumber daya alam.";
      case "Logam":
        return "Logam adalah bahan yang dapat didaur ulang dan digunakan kembali untuk membuat berbagai produk seperti kaleng, peralatan, dan kendaraan. Daur ulang logam membantu mengurangi limbah dan konservasi sumber daya alam.";
      case "Plastik":
        return "Plastik adalah bahan yang dapat didaur ulang dan digunakan kembali untuk membuat berbagai produk seperti botol, kantong, dan peralatan rumah tangga. Daur ulang plastik membantu mengurangi limbah dan konservasi sumber daya alam.";
      case "Sampah Campuran":
        return "Sampah campuran adalah jenis limbah yang terdiri dari berbagai bahan yang tidak dapat didaur ulang. Penting untuk memisahkan sampah campuran dari bahan yang dapat didaur ulang untuk mengurangi dampak lingkungan.";
      default:
        return "Tidak ada deskripsi tersedia untuk kategori ini.";
    }
  };

  const getCategory = (label: string) => {
    switch (label) {
      case "Kaca":
      case "Karton":
      case "Kertas":
      case "Logam":
      case "Plastik":
        return "Anorganik";
      case "Sampah Campuran":
        return "Residu";
      case "Sisa Makanan":
      case "Daun":
        return "Organik";
      default:
        return "Tidak Dikenal";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hasil Scan</Text>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : (
        <>
          <Text style={styles.category}>
            Kategori: {getCategory(resultText.split(" (")[0])}
          </Text>
          <Text style={styles.result}>{resultText}</Text>
          <Text style={styles.description}>
            {getDescription(resultText.split(" (")[0])}
          </Text>
        </>
      )}

      <Button title="Scan lagi" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold" },
  image: { width: 250, height: 250, marginTop: 20, borderRadius: 15 },
  result: { fontSize: 18, marginTop: 5 },
  loading: { marginTop: 20, marginBottom: 20 },
  description: { fontSize: 16, textAlign: "justify", marginBottom: 20 },
  category: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
});
