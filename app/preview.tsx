import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PreviewScreen() {
  const { fileName } = useLocalSearchParams<{ fileName: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!fileName) {
      router.replace("/");
    }
  }, [fileName]);

  if (!fileName) {
    return <View style={styles.container} />;
  }

  const photoUri = FileSystem.documentDirectory + fileName;

  console.log("Preview screen photoUri:", photoUri);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
        onError={(e) =>
          console.log("Image failed to load:", e.nativeEvent.error)
        }
        onLoad={() => console.log("Image loaded successfully")}
      />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.retakeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.analyzeButton}
          onPress={() => {
            console.log("Analyze tapped with photoUri:", photoUri);
          }}
        >
          <Text style={styles.buttonText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  preview: { flex: 1 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  retakeButton: { backgroundColor: "#5A6472", padding: 14, borderRadius: 8 },
  analyzeButton: { backgroundColor: "#5B3FA3", padding: 14, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
