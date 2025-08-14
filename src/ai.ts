import { GoogleGenerativeAI } from "@google/generative-ai";

// ❗ Em produção, evite expor a chave no app. Use servidor/edge. Aqui é didático.
const KEY_GEMINI = "AIzaSyBRqrzYcKuST6rgmgbRBDqCWS3VxlMzIak";

const genAI = new GoogleGenerativeAI(KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 700,
  responseMimeType: "text/plain",
};

export async function askGemini(prompt: string): Promise<string> {
  const chat = model.startChat({ generationConfig, history: [] });
  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

// Tenta achar um título no texto (H1 markdown, "Título:", ou 1ª linha não-vazia)
export function extractTitle(text: string): string {
  const h1 = text.match(/^\s*#\s*(.+)$/m);
  if (h1) return h1[1].trim();

  const label = text.match(/t[ií]tulo[:\-]\s*(.+)/i);
  if (label) return label[1].trim();

  const first = text.split(/\r?\n/).find((l) => l.trim().length > 0);
  return first ? first.replace(/^[#>*\-\s]+/, "").trim() : "Receita";
}
