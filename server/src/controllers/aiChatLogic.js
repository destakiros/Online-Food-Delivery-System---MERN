import { GoogleGenAI } from "@google/genai";

export const processChatRequest = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ reply: "I'm listening! What can I help you with?" });
  }

  // Always use { apiKey: process.env.API_KEY } named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Generate content using gemini-3-flash-preview for simple text interaction
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the friendly AI assistant for "In-N-Out Eats". 
      Help the user with menu questions, delivery times (20-45 mins), or just be appetizing!
      Keep it short (max 2 sentences).
      
      User says: "${prompt}"`,
    });

    // Directly access .text property from GenerateContentResponse
    res.json({ reply: response.text });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ reply: "I'm having a bit of a brain freeze. Try asking again?" });
  }
};