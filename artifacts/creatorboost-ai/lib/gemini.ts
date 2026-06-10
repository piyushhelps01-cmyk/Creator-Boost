const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

/**
 * Returns the effective API key: prefers the key baked in from the
 * GEMINI_API_KEY Replit secret (forwarded as EXPO_PUBLIC_GEMINI_API_KEY
 * in the dev/build script), and falls back to the user-entered key stored
 * in AsyncStorage / Settings UI.
 */
export function getEffectiveApiKey(userKey: string): string {
  const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? "";
  return envKey.trim() || userKey.trim();
}

/** True when the app was built with a server-side API key — no UI prompt needed. */
export const hasEnvApiKey = !!process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();

export async function callGemini(
  prompt: string,
  userApiKey: string
): Promise<string> {
  const apiKey = getEffectiveApiKey(userApiKey);

  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    if (response.status === 400 && err.includes("API_KEY_INVALID")) {
      throw new Error("INVALID_API_KEY");
    }
    throw new Error(`API_ERROR:${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("EMPTY_RESPONSE");
  return text.trim();
}
