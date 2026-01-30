import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { ComicScene } from "../types";

/**
 * Helper to get a fresh AI instance
 */
export const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts text from an image or file using Gemini.
 * Optimized for high-reliability extraction of storybooks and documents.
 */
export async function extractTextFromMedia(base64Data: string, mimeType: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        },
        {
          text: `ACTÚA COMO UN EXPERTO EN TRANSCRIPCIÓN DE ALTA FIDELIDAD.
Tu tarea es extraer TODO el texto visible en este archivo (PDF o Imagen). 

REGLAS CRÍTICAS:
1. Transcribe de forma LITERAL cada palabra.
2. Mantén la estructura de párrafos y títulos.
3. No resumas, no expliques y no omitas diálogos (ej. "- ¡Ábreme tu puerta!").
4. Ignora elementos decorativos o descripciones de imágenes, solo extrae el TEXTO escrito.
5. Si el texto está en columnas o alrededor de imágenes, ordénalo de forma lógica para la lectura.

Responde ÚNICAMENTE con el texto extraído.`
        }
      ]
    }
  });
  
  const extracted = response.text;
  if (!extracted || extracted.trim().length < 5) {
    throw new Error("No pudimos extraer texto legible. Prueba con una imagen más clara o un PDF no protegido.");
  }
  return extracted.trim();
}

/**
 * Generates context-aware questions based on the text.
 */
export async function generateSuggestedQuestions(text: string): Promise<string[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Basándote en este texto, genera 3 preguntas cortas que un niño podría hacer para entender mejor. Responde solo con un array JSON de strings:\n\n${text.substring(0, 2000)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return ["¿De qué trata la historia?", "¿Quiénes son los personajes?", "¿Qué pasó al final?"];
  }
}

/**
 * Generates a kid-friendly summary.
 */
export async function generateSimpleSummary(text: string): Promise<string[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Resume este texto en 3 puntos clave muy sencillos para un niño pequeño. Responde con un array JSON de strings:\n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return ["Estamos preparando tu resumen mágico..."];
  }
}

/**
 * Creates comic scenes from text.
 */
export async function generateComicScenes(text: string): Promise<ComicScene[]> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Divide este texto en 4 escenas clave para un cómic infantil. Describe cada escena visualmente.\n\nTexto: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            }
          },
          required: ["description", "keywords"]
        }
      }
    }
  });
  
  return JSON.parse(response.text || "[]");
}

/**
 * Generates an image for a comic scene using Flash Image.
 */
export async function generateSceneImage(scene: ComicScene): Promise<string> {
  const ai = getAI();
  const prompt = `Ilustración infantil mágica, estilo Pixar, colores vibrantes, amigable, sin texto: ${scene.description}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  return `https://picsum.photos/seed/${Math.random()}/800/800`;
}

/**
 * Simple Chat implementation.
 */
export async function chatWithDocument(text: string, userMessage: string, history: any[]) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `Eres Claramente, un tutor experto en explicar textos a niños. Tu estilo es divertido, paciente y usas analogías simples. Texto de referencia: "${text}"`,
    }
  });
  
  const result = await chat.sendMessage({ message: userMessage });
  return result.text || "¡Ups! Me distraje. ¿Me lo preguntas otra vez?";
}

/**
 * Generates audio for a single chunk of text.
 */
export async function generateSpeech(textToSpeak: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Lee con voz clara y amigable: ${textToSpeak}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
}

/**
 * Generates a cinematic prompt for Veo.
 */
export async function generateVideoPrompt(text: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crea un prompt visual de animación 3D para un video basado en esta historia: ${text.substring(0, 1000)}`,
  });
  return response.text || "Una aventura mágica animada.";
}

// Audio Utilities
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}