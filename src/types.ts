export interface Methodology {
  design: string;
  dataset: string;
  approach: string;
  limitations: string;
}

export interface PythonMetrics {
  wordCount: number;
  sentenceCount: number;
  lexicalDiversity: number;
  estimatedReadingTime: string;
  readabilityGrade: string;
  topKeywords: string[];
  pythonEngineVersion: string;
}

export interface AnalysisResult {
  title: string;
  authors: string;
  summary: string;
  findings: string[];
  methodology: Methodology;
  contributions: string[];
  suggestedQuestions: string[];
  pythonMetrics?: PythonMetrics;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface SamplePaper {
  id: string;
  title: string;
  subtitle: string;
  authors: string;
  textSnippet: string;
  analysis: AnalysisResult;
}
