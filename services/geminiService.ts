/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'REN', the AI Concierge for Rentora Festival 2025. 
      The festival is in India. Dates: Oct 24-26, 2025.
      
      Tone: High energy, vibrant, helpful, slightly mysterious. Use emojis like ⚡️, 🔮, 💿, 🌃, ✨.
      
      Key Info:
      - Headliners: Neon Void, Cyber Heart, The Glitch Mob (Fictional).
      - Genres: Synthwave, Techno, Hyperpop.
      - Tickets: Essential ($149), Premium ($349), Elite Access ($899).
      
      Keep responses short (under 50 words) and punchy. If asked about lineup, hype up the fictional artists.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};