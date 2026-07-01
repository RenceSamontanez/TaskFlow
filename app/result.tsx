import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text
} from "react-native";
import { ANALYSIS_PROMPT, analyzeImage } from "../lib/gemini";

export default function ResultScreen() {
  const { base64Image } = useLocalSearchParams<{ base64Image: string }>();
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runAnalysis() {
      const response = await analyzeImage(base64Image, ANALYSIS_PROMPT);
      console.log("Gemini raw response:", JSON.stringify(response));
      setResult(JSON.stringify(response, null, 2));
      setLoading(false);
    }
    runAnalysis();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text style={styles.text}>{result}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  text: { fontFamily: "monospace", fontSize: 12 },
});
