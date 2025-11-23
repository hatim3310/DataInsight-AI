import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to get AI instance safely
const getAI = () => {
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) {
    throw new Error("API Key not found in local storage. Please set it in the settings.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeDataset = async (csvSample: string): Promise<AnalysisResult> => {
  const ai = getAI();
  
  const prompt = `
    You are an expert Data Scientist specializing in Data Visualization. 
    Analyze the following CSV dataset sample and create a configuration for a dashboard.
    
    Prioritize creating 4 distinct charts that tell a story about the data.
    Do NOT provide long text summaries. Keep insights concise.
    
    For the charts, strictly follow the allowed types: 'bar', 'line', 'area', 'pie', 'scatter'.
    Ensure 'dataKeys' is ALWAYS an array of strings representing the numeric columns to plot.
    Ensure 'xAxisKey' is a string representing the category or time column.

    Dataset Sample:
    ${csvSample}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          columnAnalysis: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          },
          keyInsights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          recommendedCharts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['bar', 'line', 'area', 'pie', 'scatter'] },
                xAxisKey: { type: Type.STRING },
                dataKeys: { type: Type.ARRAY, items: { type: Type.STRING } },
                description: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  if (response.text) {
    try {
      let cleanText = response.text.trim();
      if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?/, "").replace(/```$/, "");
      }
      
      const parsed = JSON.parse(cleanText) as AnalysisResult;
      
      // ROBUST SANITIZATION
      // Ensure recommendedCharts exists and is an array
      const charts = Array.isArray(parsed.recommendedCharts) ? parsed.recommendedCharts : [];
      
      // Ensure each chart has a valid dataKeys array
      const sanitizedCharts = charts.map(chart => ({
        ...chart,
        dataKeys: Array.isArray(chart.dataKeys) ? chart.dataKeys : [],
        xAxisKey: chart.xAxisKey || '',
        title: chart.title || 'Untitled Chart',
        type: chart.type || 'bar',
        description: chart.description || ''
      }));

      return {
        summary: parsed.summary || "Analysis complete.",
        columnAnalysis: Array.isArray(parsed.columnAnalysis) ? parsed.columnAnalysis : [],
        keyInsights: Array.isArray(parsed.keyInsights) ? parsed.keyInsights : [],
        recommendedCharts: sanitizedCharts
      };
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      // Fallback for parsing errors
      return {
        summary: "Error generating analysis. Displaying raw data.",
        columnAnalysis: [],
        keyInsights: ["Could not generate automated insights."],
        recommendedCharts: []
      };
    }
  }
  
  throw new Error("Failed to analyze data");
};

export const chatWithData = async (csvSample: string, question: string, history: {role: string, parts: {text: string}[]}[] = []) => {
  const ai = getAI();
  
  const systemInstruction = `
    You are DataInsight AI. You have access to a sample of a dataset.
    Answer questions based on this sample. Be concise.
    Dataset:
    ${csvSample}
  `;

  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: { systemInstruction },
    history: history as any, 
  });

  const response = await chat.sendMessage({ message: question });
  return response.text;
};