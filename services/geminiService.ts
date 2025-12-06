import { GoogleGenAI, Type } from "@google/genai";
import { ExperienceType, Place, DayPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to map generic strings to types
const mapType = (input: string): ExperienceType => {
  const lower = input.toLowerCase();
  if (lower.includes('food') || lower.includes('eat')) return ExperienceType.FOOD;
  if (lower.includes('nature') || lower.includes('hike')) return ExperienceType.NATURE;
  if (lower.includes('culture') || lower.includes('art') || lower.includes('history')) return ExperienceType.CULTURE;
  if (lower.includes('relax')) return ExperienceType.RELAX;
  return ExperienceType.ADVENTURE;
};

export const searchHiddenGems = async (
  location: string, 
  mood: string
): Promise<{ places: Place[], events: string[] }> => {
  
  const model = "gemini-2.5-flash";
  
  try {
    // 1. Search for places using Maps Grounding
    const prompt = `Find 5 authentic, non-touristy, hidden-gem places in ${location} for a traveler who likes ${mood}. 
    Provide the name and a short description explaining why it is a hidden gem.
    Also, find 3 local events or pop-ups happening this week in ${location} that are off the beaten path.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              // Defaulting to SF coordinates if geolocation fails or isn't passed, 
              // but ideally this comes from device.
              latitude: 37.7749, 
              longitude: -122.4194
            }
          }
        }
      }
    });

    const places: Place[] = [];
    const events: string[] = [];

    // Parse Grounding Chunks for Maps
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.maps) {
          places.push({
            name: chunk.maps.title || "Unknown Place",
            description: "A recommended local spot.", // The actual description is in the text, simplified here for grounding structure
            address: chunk.maps.placeId, // Simplified
            uri: chunk.maps.uri,
            type: mapType(mood)
          });
        }
        if (chunk.web) {
           events.push(`${chunk.web.title}: ${chunk.web.uri}`);
        }
      });
    }

    // Fallback parsing if grounding is sparse but text is rich
    // In a real app, we would process response.text more robustly.
    // For this demo, if grounding fails, we return a mock based on the text to ensure UI doesn't break
    if (places.length === 0) {
       // Allow the UI to at least show the text response if needed, 
       // but here we will just push a generic one from the text if possible.
       places.push({
         name: "Explore the text results",
         description: response.text.slice(0, 150) + "...",
         type: mapType(mood),
         uri: "https://maps.google.com"
       });
    }

    return { places, events };

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return { places: [], events: [] };
  }
};

export const generateItinerary = async (
  location: string,
  days: number,
  interests: string
): Promise<DayPlan[]> => {
  
  const prompt = `Create a ${days}-day itinerary for a trip to ${location}. 
  Focus on: ${interests}. 
  Avoid tourist traps. Suggest authentic local experiences.
  Return a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.NUMBER },
              theme: { type: Type.STRING },
              activities: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    location: { type: Type.STRING },
                    notes: { type: Type.STRING }
                  },
                  required: ["time", "activity", "location", "notes"]
                }
              }
            },
            required: ["day", "theme", "activities"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as DayPlan[];

  } catch (error) {
    console.error("Itinerary Gen Error:", error);
    return [];
  }
};

export const getGuideRecommendation = async (location: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, welcoming message from a local guide in ${location}. They should sound enthusiastic about showing hidden gems. Keep it under 30 words.`
        });
        return response.text || "Ready to show you the hidden side of the city!";
    } catch (e) {
        return "Let's explore the unseen together.";
    }
}
