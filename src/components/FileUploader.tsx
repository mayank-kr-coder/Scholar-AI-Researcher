import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, Sparkles } from "lucide-react";
import { extractTextFromPdf } from "../utils/pdfExtractor";
import { SamplePaper, AnalysisResult } from "../types";

interface FileUploaderProps {
  onStartParsing: () => void;
  onParsingProgress: (percent: number) => void;
  onStartAnalyzing: () => void;
  onAnalysisSuccess: (result: AnalysisResult, text: string) => void;
  onAnalysisError: (errorMessage: string) => void;
  onSelectSample: (sample: SamplePaper) => void;
}

export default function FileUploader({
  onStartParsing,
  onParsingProgress,
  onStartAnalyzing,
  onAnalysisSuccess,
  onAnalysisError,
  onSelectSample,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setUploadError("Only PDF files are supported. Please select a valid research paper in PDF format.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError("This file is too large (max 15MB). Please select a standard size research paper PDF.");
      return;
    }

    try {
      // 1. Start parsing text from PDF on the client
      onStartParsing();
      const extractedText = await extractTextFromPdf(file, (percent) => {
        onParsingProgress(percent);
      });

      // 2. Start analyzing the extracted text on the server using Gemini
      onStartAnalyzing();
      
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: extractedText,
          filename: file.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server failed to analyze the document.");
      }

      const analysisResult: AnalysisResult = await response.json();
      
      // 3. Complete analysis successfully
      onAnalysisSuccess(analysisResult, extractedText);
    } catch (err: any) {
      console.error(err);
      onAnalysisError(err.message || "An error occurred while analyzing the paper.");
    }
  };

  return (
    <div id="file-uploader" className="w-full max-w-4xl mx-auto py-8 px-4 animate-fade-in">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold mb-3 border border-indigo-100">
          <Sparkles className="w-3.5 h-3.5" />
          Design by Mayank
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          AI Research Paper Analyzer
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          Upload any scientific paper PDF to automatically synthesize its summary, extract exact methodology details, and ask specific questions.
        </p>
      </div>

      {/* Main Drag-Drop Box */}
      <div
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-12 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 group ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]"
            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf"
          className="hidden"
        />

        <div className="relative mb-6">
          <div className="absolute inset-0 bg-slate-50 rounded-full group-hover:scale-110 transition-transform duration-300" />
          <div className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-colors ${
            isDragging ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600"
          }`}>
            <Upload className="w-7 h-7" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Drag & drop paper PDF here
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          or <span className="text-indigo-600 font-semibold underline">browse your device</span> (supports files up to 15MB)
        </p>

        {uploadError && (
          <div className="mt-4 px-4 py-2.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-lg">
            {uploadError}
          </div>
        )}
      </div>
    </div>
  );
}
