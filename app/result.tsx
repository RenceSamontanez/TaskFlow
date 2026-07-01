import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    ANALYSIS_PROMPT,
    analyzeImage,
    parseGeminiResponse,
} from "../lib/gemini";

export default function ResultScreen() {
  const { base64Image } = useLocalSearchParams<{ base64Image: string }>();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function runAnalysis() {
      try {
        const response = await analyzeImage(base64Image, ANALYSIS_PROMPT);

        if (response.error) {
          setError(response.error.message || "Gemini API returned an error.");
          setLoading(false);
          return;
        }

        const parsed = parseGeminiResponse(response);
        if (!parsed) {
          setError("Couldn't understand Gemini's response. Try again.");
          setLoading(false);
          return;
        }

        setResult(parsed);
        setLoading(false);
      } catch (err: any) {
        console.log("Analysis error:", err);
        setError("Something went wrong while analyzing the photo.");
        setLoading(false);
      }
    }
    runAnalysis();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B3FA3" />
        <Text style={styles.loadingText}>Analyzing your photo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Analysis Result</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Objects</Text>
        <View style={styles.chipRow}>
          {result.objects?.map((obj: string, i: number) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{obj}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Context</Text>
        <Text style={styles.sectionText}>{result.context}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Activities</Text>
        <Text style={styles.sectionText}>{result.activities}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Recommendations</Text>
        <Text style={styles.sectionText}>{result.recommendations}</Text>
      </View>

      <TouchableOpacity
        style={styles.personasButton}
        onPress={() =>
          router.push({ pathname: "/personas", params: { base64Image } })
        }
      >
        <Text style={styles.personasButtonText}>Compare Personas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: { marginTop: 12, color: "#666", fontSize: 15 },
  errorText: {
    textAlign: "center",
    color: "#B3261E",
    fontSize: 15,
    marginBottom: 16,
  },
  retryButton: { backgroundColor: "#5A6472", padding: 12, borderRadius: 8 },
  retryButtonText: { color: "#fff", fontWeight: "bold" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2A44",
    marginBottom: 20,
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E5BBA",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  sectionText: { fontSize: 15, color: "#333", lineHeight: 22 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: "#EEF1F8",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  chipText: { color: "#2E5BBA", fontSize: 13, fontWeight: "500" },
  personasButton: {
    backgroundColor: "#5B3FA3",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  personasButtonText: { color: "#fff", fontWeight: "bold" },
  doneButton: {
    backgroundColor: "#2E5BBA",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  doneButtonText: { color: "#fff", fontWeight: "bold" },
});
