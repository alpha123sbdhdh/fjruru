import { GoogleGenAI } from "@google/genai";
import { GENERAL_SYSTEM_INSTRUCTION } from '../constants';

// Initialize the client
// API Key is guaranteed to be available in process.env.API_KEY per instructions
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const sendMessageToGeneral = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const model = 'gemini-3-flash-preview';
    
    // Ensure alternating roles for Gemini API
    const validHistory: { role: string; parts: { text: string }[] }[] = [];
    for (const msg of history) {
      if (validHistory.length === 0 || validHistory[validHistory.length - 1].role !== msg.role) {
        validHistory.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
      } else {
        // Merge consecutive messages from the same role
        validHistory[validHistory.length - 1].parts[0].text += '\n' + msg.parts[0].text;
      }
    }

    const contents = [...validHistory];
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += '\n' + newMessage;
    } else {
      contents.push({ role: 'user', parts: [{ text: newMessage }] });
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: GENERAL_SYSTEM_INSTRUCTION,
        temperature: 0.9, // High creativity/aggression
      },
    });

    return response.text;
  } catch (error) {
    console.error("The General is currently commanding other troops (API Error):", error);
    return "The connection to HQ is jammed. Reload and try again, soldier.";
  }
};