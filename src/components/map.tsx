import React from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";

export default function Map() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: -6.34809965424758,
          longitude: 106.99769696441774,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: 200,
    height: 200,
  },
});
