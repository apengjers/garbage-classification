import { ModelProvider } from "@/src/context/ModelContext";
import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <ModelProvider>
      <Stack />
    </ModelProvider>
  );
}
