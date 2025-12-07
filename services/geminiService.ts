import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChristmasWish = async (topic: string = "general"): Promise<string> => {
  try {
    const prompt = `
      Write a short, elegant, and warm Christmas wish (maximum 20 words).
      Tone: High-end, magical, sophisticated.
      Context: ${topic === "general" ? "A general holiday greeting" : `A wish specifically about ${topic}`}.
      Do not use emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.9,
      }
    });

    return response.text?.trim() || "May your holidays be filled with light and joy.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Wishing you peace, love, and joy this festive season.";
  }
};