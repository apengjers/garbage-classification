import { ScrollView, StyleSheet, View } from "react-native";
import Home from "../src/components/home";

export default function Index() {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Home />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
});
