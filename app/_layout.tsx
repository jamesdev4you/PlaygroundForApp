import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import CameraScreen from "@/CameraScreen";
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CameraScreen />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
