import { GoogleGenAI } from "@google/genai";
import { Lead, Source } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Parses a JSON string that might be wrapped in Markdown code blocks.
 */
function cleanAndParseJSON(text: string): any {
  let cleanText = text.trim();
  // Remove markdown wrapping if present
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```/, '').replace(/```$/, '');
  }
  
  try {
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini response", e);
    return null;
  }
}

/**
 * Searches for importers based on product and region.
 * Uses gemini-2.5-flash with googleSearch and googleMaps tools.
 */
export const searchImporters = async (
  product: string, 
  region: string,
  limit: number,
  onProgress: (status: string) => void
): Promise<Lead[]> => {
  
  onProgress(`Initializing search agents for ${limit} leads...`);

  const prompt = `
    I need to find real companies that import ${product} in ${region}. 
    
    Perform a deep search to find at least ${limit} specific companies.
    For each company, I need:
    1. The exact Company Name.
    2. A brief summary of what they do (verify they are importers/distributors).
    3. Their Website URL.
    4. Contact Email addresses (look for 'contact', 'about', or footer information).
    5. Phone Numbers.
    6. Physical Address.
    7. Approximate Latitude and Longitude for the address (important for mapping).
    8. Social Media links (LinkedIn is priority).

    Use Google Search to find this information. 
    Use Google Maps to verify the address if possible.

    Format the output as a strictly valid JSON array of objects. Do not include markdown formatting outside the JSON.
    The structure should be:
    [
      {
        "companyName": "Name",
        "summary": "Description...",
        "website": "URL",
        "emails": ["email1", "email2"],
        "phones": ["phone1"],
        "address": "Full Address",
        "coordinates": {
           "lat": 12.345,
           "lng": 67.890
        },
        "socialLinks": {
          "linkedin": "url",
          "twitter": "url"
        },
        "confidenceScore": 85 (integer based on data completeness)
      }
    ]
  `;

  try {
    onProgress("Querying Gemini (Search & Maps)...");
    
    // Using gemini-2.5-flash as requested for efficiency + tools
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [
          { googleSearch: {} },
          { googleMaps: {} }
        ],
        // Note: responseMimeType: 'application/json' is NOT used here 
        // because it conflicts with search tools in some SDK versions/models.
        // We rely on the prompt to get JSON.
        temperature: 0.1, 
      }
    });

    onProgress("Processing intelligence...");

    const text = response.text || "[]";
    const rawData = cleanAndParseJSON(text);

    // Extract grounding metadata to attribute sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = [];
    
    // Extract web sources
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({
          title: chunk.web.title || "Web Source",
          uri: chunk.web.uri
        });
      }
    });

    if (!Array.isArray(rawData)) {
      console.warn("Gemini did not return an array", rawData);
      throw new Error("Invalid data format received from intelligence agent.");
    }

    // Map raw data to our Lead interface
    const leads: Lead[] = rawData.map((item: any) => ({
      id: uuidv4(),
      companyName: item.companyName || "Unknown Company",
      summary: item.summary || "No summary available.",
      website: item.website,
      emails: Array.isArray(item.emails) ? item.emails : [],
      phones: Array.isArray(item.phones) ? item.phones : [],
      address: item.address,
      coordinates: (item.coordinates && typeof item.coordinates.lat === 'number') ? item.coordinates : undefined,
      socialLinks: {
        linkedin: item.socialLinks?.linkedin,
        twitter: item.socialLinks?.twitter,
        facebook: item.socialLinks?.facebook
      },
      region: region,
      category: product,
      confidenceScore: item.confidenceScore || 50,
      sources: sources.slice(0, 5), // Attach top sources to all for now (simplification)
      dateFound: new Date().toISOString()
    }));

    onProgress("Complete");
    return leads;

  } catch (error) {
    console.error("Search failed:", error);
    onProgress("Error occurred during search.");
    throw error;
  }
};

/**
 * Generate an n8n workflow JSON based on current search parameters
 */
export const generateN8nWorkflow = (product: string, region: string, limit: number, webhookUrl: string) => {
  // This is a simplified n8n workflow JSON structure that mimics the logic
  return JSON.stringify({
    "name": `Importer Scout: ${product} in ${region}`,
    "nodes": [
      {
        "parameters": {
          "rule": {
            "interval": [
              {
                "field": "hours",
                "hoursInterval": 24
              }
            ]
          }
        },
        "name": "Schedule (Daily)",
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.1,
        "position": [0, 0]
      },
      {
        "parameters": {
          "prompt": `Find ${limit} importers of ${product} in ${region}. Return JSON with companyName, email, phone, website, and geolocation coordinates.`,
          "model": "gemini-2.5-flash",
          "options": {}
        },
        "name": "Gemini Agent",
        "type": "n8n-nodes-base.googleGemini",
        "typeVersion": 1,
        "position": [200, 0]
      },
      {
        "parameters": {
          "httpMethod": "POST",
          "path": webhookUrl || "YOUR_WEBHOOK_URL",
          "options": {}
        },
        "name": "Send to CRM/Webhook",
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 3,
        "position": [400, 0]
      }
    ],
    "connections": {
      "Schedule (Daily)": {
        "main": [
          [
            {
              "node": "Gemini Agent",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Gemini Agent": {
        "main": [
          [
            {
              "node": "Send to CRM/Webhook",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    }
  }, null, 2);
};