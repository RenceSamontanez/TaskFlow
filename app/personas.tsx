import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    analyzeImage,
    parseGeminiResponse,
    PERSONA_PROMPTS,
} from "../lib/gemini";

const PERSONAS = [
  { key: "academic", label: "Academic" },
  { key: "safety", label: "Safety Inspector" },
  { key: "inventory", label: "Inventory Clerk" },
];

export default function PersonasScreen() {
  const { base64Image } = useLocalSearchParams<{ base64Image: string }>();
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function runPersona(key: string) {
    setActivePersona(key);
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await analyzeImage(base64Image, PERSONA_PROMPTS[key]);
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
    } catch (err) {
      console.log("Persona analysis error:", err);
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
    >
      <Text style={styles.title}>Compare Personas</Text>
      <Text style={styles.subtitle}>
        Same photo, different instructions — tap a persona to see how the
        response changes.
      </Text>

      <View style={styles.personaRow}>
        {PERSONAS.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.personaButton,
              activePersona === p.key && styles.personaButtonActive,
            ]}
            onPress={() => runPersona(p.key)}
          >
            <Text
              style={[
                styles.personaButtonText,
                activePersona === p.key && styles.personaButtonTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#5B3FA3" />
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {result && !loading && (
        <View style={styles.resultBox}>
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
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2A44",
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 20 },
  personaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  personaButton: {
    borderWidth: 1,
    borderColor: "#5B3FA3",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  personaButtonActive: { backgroundColor: "#5B3FA3" },
  personaButtonText: { color: "#5B3FA3", fontWeight: "600" },
  personaButtonTextActive: { color: "#fff" },
  centered: { alignItems: "center", padding: 20 },
  errorText: { color: "#B3261E", textAlign: "center", marginTop: 10 },
  resultBox: { marginTop: 10 },
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
});
