import MapView, { Marker } from "react-native-maps";

type Props = {
  latitude: number;
  longitude: number;
};

export default function Minimap({ longitude, latitude }: Props) {
  return (
    <MapView
      style={{ width: 250, height: 150 }}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
    >
      <Marker
        coordinate={{
          latitude: latitude,
          longitude: longitude,
        }}
      />
    </MapView>
  );
}
