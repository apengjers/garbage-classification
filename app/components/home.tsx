import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import TPA from "./tpa";

export default function Home() {
  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("izin kamera diperlukan");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      router.push({
        pathname: "/result",
        params: {
          image: uri,
        },
      });
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("izin galeri diperlukan");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      router.push({
        pathname: "/result",
        params: {
          image: uri,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Klasifikasi Sampah</Text>
      <Image
        source={require("../../assets/images/pictHome.png")}
        style={styles.imagesHome}
      />
      <Text style={styles.teks}>
        Aplikasi ini dibuat dengan menggunakan teknologi machine learning untuk
        membantu mengelompokkan sampah, saya berharap dapat mempermudah
        pengelompokan sampah dengan benar agar dapat menjaga lingkungan sekitar
      </Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "500",
        }}
      >
        Scan atau Upload Sampah
      </Text>

      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.image}
      />

      <View style={styles.buttonSpacing}>
        <Button title="Buka Kamera" onPress={openCamera} />
      </View>

      <View style={styles.buttonSpacing}>
        <Button title="Upload dari Gallery" onPress={openGallery} />
      </View>

      <TPA />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 100,
    height: 150,
    marginTop: 20,
  },

  buttonSpacing: {
    marginTop: 20,
    width: 200,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  teks: {
    fontSize: 14,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    textAlign: "justify",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  imagesHome: {
    width: 300,
    height: 220,
    marginBottom: 20,
  },
});
