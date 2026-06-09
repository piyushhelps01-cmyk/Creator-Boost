const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export async function callGemini(
  prompt: string,
  apiKey: string
): Promise<string> {
  if (!apiKey || apiKey.trim() === "") {
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
