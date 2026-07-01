import * as FileSystem from "expo-file-system/legacy";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { imageToBase64 } from "../lib/gemini";

export default function PreviewScreen() {
  const { fileName } = useLocalSearchParams<{ fileName: string }>();
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!fileName) {
      router.replace("/");
    }
  }, [fileName]);

  if (!fileName) {
    return <View style={styles.container} />;
  }

  const photoUri = FileSystem.documentDirectory + fileName;

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const base64Image = await imageToBase64(photoUri);
      console.log("Converted to base64, length:", base64Image.length);
      router.push({ pathname: "/result", params: { base64Image, fileName } });
    } catch (err) {
      console.log("Error converting image:", err);
      setAnalyzing(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: photoUri }}
        style={styles.preview}
        resizeMode="contain"
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
          onPress={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Analyze</Text>
          )}
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
  analyzeButton: {
    backgroundColor: "#5B3FA3",
    padding: 14,
    borderRadius: 8,
    minWidth: 90,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
