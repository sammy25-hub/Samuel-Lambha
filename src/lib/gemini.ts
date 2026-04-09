import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DetectionResult {
  label: string;
  confidence: number;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  description: string;
  material: string;
  impact_score: number; // 1-10
}

export interface AnalysisResponse {
  detections: DetectionResult[];
  summary: string;
  methodology_note: string;
  explainability_heatmap_data: { x: number; y: number; intensity: number }[];
}

export async function analyzeMarineDebris(imageData: string, mimeType: string): Promise<AnalysisResponse> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are a state-of-the-art Marine Debris Detection System. 
    Analyze the provided image for marine debris (plastic, metal, fishing nets, glass, rubber, etc.).
    
    For each detected object, provide:
    1. Label (e.g., "Plastic Bottle", "Ghost Net")
    2. Confidence score (0.0 to 1.0)
    3. Bounding box [ymin, xmin, ymax, xmax] in normalized coordinates (0-1000)
    4. A brief description of the object
    5. Material type
    6. Environmental impact score (1-10)
    
    Also provide a summary of the findings and a note on the methodology used for detection.
    Include simulated "heatmap" data points (x, y, intensity) that represent areas of high visual influence for the detections.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { data: imageData.split(',')[1], mimeType } }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                box_2d: { 
                  type: Type.ARRAY, 
                  items: { type: Type.NUMBER },
                  minItems: 4,
                  maxItems: 4
                },
                description: { type: Type.STRING },
                material: { type: Type.STRING },
                impact_score: { type: Type.NUMBER }
              },
              required: ["label", "confidence", "box_2d", "description", "material", "impact_score"]
            }
          },
          summary: { type: Type.STRING },
          methodology_note: { type: Type.STRING },
          explainability_heatmap_data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                intensity: { type: Type.NUMBER }
              }
            }
          }
        },
        required: ["detections", "summary", "methodology_note", "explainability_heatmap_data"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}
