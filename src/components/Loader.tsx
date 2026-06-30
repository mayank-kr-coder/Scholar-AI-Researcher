import { useState, useEffect } from "react";
import { Loader2, FileText, Cpu, Compass } from "lucide-react";

interface LoaderProps {
  progress?: number;
  stage: "parsing" | "analyzing";
}

const PARSING_MESSAGES = [
  "Opening PDF structure...",
  "Scanning text streams and characters...",
  "Structuring paragraphs and headings...",
  "Resolving page-wise citations...",
];

const ANALYZING_MESSAGES = [
  "Synthesizing paper contents...",
  "Extracting scientific methodology and research design...",
  "Pinpointing quantitative findings & discoveries...",
  "Formulating critical theoretical contributions...",
  "Generating paper-specific exploration questions...",
];

export default function Loader({ progress, stage }: LoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = stage === "parsing" ? PARSING_MESSAGES : ANALYZING_MESSAGES;

  useEffect(() => {
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [stage, messages.length]);

  return (
    <div id="loader-container" className="flex flex-col items-center justify-center p-12 text-center max-w-md mx-auto my-12 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-indigo-50/80 animate-ping" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50">
          {stage === "parsing" ? (
            <FileText className="w-10 h-10 animate-pulse text-indigo-600" />
          ) : (
            <Cpu className="w-10 h-10 animate-spin-slow text-indigo-600" />
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {stage === "parsing" ? "Processing Document" : "Analyzing with Gemini AI"}
      </h3>
      
      <p className="text-sm text-slate-500 h-10 animate-fade-in flex items-center justify-center font-medium">
        {messages[messageIndex]}
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress !== undefined ? progress : 65}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between w-full mt-3 text-xs text-slate-400 font-mono">
        <span>{stage === "parsing" ? "Client OCR & Parsing" : "Deep Analysis"}</span>
        <span>{progress !== undefined ? `${progress}%` : "In progress..."}</span>
      </div>
    </div>
  );
}
