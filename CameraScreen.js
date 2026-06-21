import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";

export default function CameraScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);

  // 1. Permission state still loading
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Loading camera…</Text>
      </View>
    );
  }

  // 2. Permission not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>We need permission to use the camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    setBusy(true);
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.6,
        base64: true,
      });
      setPhoto(result);
      console.log("Captured. base64 length:", result.base64?.length);
    } catch (e) {
      console.warn("Capture failed", e);
    } finally {
      setBusy(false);
    }
  };

  // 3a. A photo was taken — show the preview
  if (photo) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: photo.uri }}
          style={styles.preview}
          resizeMode="contain"
        />
        <View style={styles.row}>
          <Button title="Retake" onPress={() => setPhoto(null)} />
          <Button
            title="Use photo"
            onPress={() => {
              // NEXT STEP: send photo.base64 to your /verify backend here
              console.log("Would verify this photo now");
            }}
          />
        </View>
      </View>
    );
  }

  // 3b. Live camera with a capture button
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      <View style={styles.controls}>
        <Button
          title={busy ? "Taking…" : "Capture"}
          onPress={takePhoto}
          disabled={busy}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  msg: { textAlign: "center", marginBottom: 16, fontSize: 16 },
  camera: { flex: 1 },
  controls: { padding: 20, backgroundColor: "#000" },
  preview: { flex: 1, backgroundColor: "#000" },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#000",
  },
});
