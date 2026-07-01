import * as FileSystem from "expo-file-system/legacy";

const GEMINI_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

export async function imageToBase64(uri) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return base64;
}

export async function analyzeImage(base64Image, prompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image,
              },
            },
          ],
        },
      ],
    }),
  });

  const json = await response.json();
  return json;
}

export const ANALYSIS_PROMPT = `
Analyze this image. Identify:
1. Objects - list the distinct physical objects you see
2. Context - briefly describe the setting or scene
3. Activities - what activity appears to be happening, if any
4. Recommendations - one practical suggestion based on the scene

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`;

export function parseGeminiResponse(response) {
  try {
    const rawText = response.candidates[0].content.parts[0].text;
    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.log("Failed to parse Gemini response:", err);
    return null;
  }
}

export const PERSONA_PROMPTS = {
  academic: `
You are a research assistant analyzing a photo for an academic case study.
Describe the scene using precise, objective, analytical language suitable for a report.
Identify notable objects, the setting, and any inferred activity, using formal academic tone.

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,

  safety: `
You are a workplace safety inspector reviewing this photo for potential hazards.
Identify any objects or conditions that could pose safety risks, note the setting,
describe what activity seems to be happening, and give one concrete safety recommendation.
Use a cautious, safety-first tone.

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,

  inventory: `
You are an inventory clerk cataloging items visible in this photo for a stock log.
List every distinct physical object you can identify as if creating an inventory checklist.
Briefly describe the setting, note any relevant activity, and recommend one inventory-related action
(e.g. restocking, organizing, labeling).
Use a terse, list-oriented tone.

Respond ONLY with valid JSON in this exact shape, no extra text:
{
  "objects": ["...", "..."],
  "context": "...",
  "activities": "...",
  "recommendations": "..."
}
`,
};
