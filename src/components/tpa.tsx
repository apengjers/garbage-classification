import { StyleSheet, Text, View } from "react-native";
import Minimap from "./minimap";

const data = [
  {
    id: "1",
    name: "TPA Bantar Gebang - Jakarta",
    latitude: -6.34809965424758,
    longitude: 106.99769696441774,
  },
  {
    id: "2",
    name: "TPA Cipayung - Depok",
    latitude: -6.4212697476226595,
    longitude: 106.78767637526448,
  },
  {
    id: "3",
    name: "TPA Rawa Kucing - Tangerang",
    latitude: -6.139414047843199,
    longitude: 106.6169848794363,
  },
  {
    id: "4",
    name: "TPA Galuga - Bogor",
    latitude: -6.557879431832811,
    longitude: 106.6432049652811,
  },
  {
    id: "5",
    name: "TPA Burangkeng - Bekasi",
    latitude: -6.348361538285542,
    longitude: 107.01918291088715,
  },
];

export default function TPA() {
  return (
    <View style={[styles.container, { marginBottom: 50 }]}>
      <Text style={styles.title}>TPA</Text>
      <Text style={styles.teks}>
        Berikut adalah list Atau Kumpulan Lokasi TPA yang ada di Jabodetabek
      </Text>
      {data.map((item) => (
        <View
          style={{
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            alignItems: "center",
          }}
          key={item.id}
        >
          <Minimap latitude={item.latitude} longitude={item.longitude} />
          <Text>{item.name}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
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
});
