export interface DataRow {
  [key: string]: string | number | null;
}

export interface ChartConfig {
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter';
  xAxisKey: string;
  dataKeys: string[];
  description: string;
}

export interface AnalysisResult {
  summary: string;
  columnAnalysis: {
    name: string;
    type: string;
    description: string;
  }[];
  keyInsights: string[];
  recommendedCharts: ChartConfig[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  UPLOAD = 'UPLOAD',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS'
}