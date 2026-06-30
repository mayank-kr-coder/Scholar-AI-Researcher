import { useState } from "react";
import { Sparkles, FileText, AlertCircle, BookOpen, RefreshCw, MessageSquare } from "lucide-react";
import { AnalysisResult, ChatMessage, SamplePaper } from "./types";
import FileUploader from "./components/FileUploader";
import Loader from "./components/Loader";
import Dashboard from "./components/Dashboard";
import ChatInterface from "./components/ChatInterface";

type AppStatus = "idle" | "parsing" | "analyzing" | "ready" | "error";

export default function App() {
  const [status, setStatus] = useState<AppStatus>("idle");
  const [parsingProgress, setParsingProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [paperText, setPaperText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Actions
  const handleStartParsing = () => {
    setStatus("parsing");
    setParsingProgress(0);
    setErrorMessage(null);
  };

  const handleParsingProgress = (percent: number) => {
    setParsingProgress(percent);
  };

  const handleStartAnalyzing = () => {
    setStatus("analyzing");
  };

  const handleAnalysisSuccess = (result: AnalysisResult, text: string) => {
    setAnalysisResult(result);
    setPaperText(text);
    setChatMessages([]);
    setStatus("ready");
  };

  const handleAnalysisError = (errMessage: string) => {
    setErrorMessage(errMessage);
    setStatus("error");
  };

  const handleSelectSample = (sample: SamplePaper) => {
    setStatus("ready");
    setAnalysisResult(sample.analysis);
    setPaperText(sample.textSnippet);
    setChatMessages([]);
    setErrorMessage(null);
  };

  const handleReset = () => {
    setStatus("idle");
    setAnalysisResult(null);
    setPaperText("");
    setChatMessages([]);
    setErrorMessage(null);
    setParsingProgress(0);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !analysisResult || isSendingMessage) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsSendingMessage(true);

    try {
      // Format chat history for the API
      const historyPayload = chatMessages.map((msg) => ({
        role: msg.role,
        text: msg.text,
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: historyPayload,
          paperTitle: analysisResult.title,
          paperText: paperText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to receive response from AI model.");
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "model",
        text: data.text || "No response text found.",
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        text: "⚠️ Sorry, I encountered an issue generating a response. Please verify your connection or try again.",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleReset}>
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/10">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">
                Scholar <span className="text-indigo-600">AI Researcher</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {status === "ready" && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors px-3 py-2 hover:bg-slate-50 rounded-xl"
                title="Clears all state and starts clean"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset Application</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        
        {/* IDLE STATE: Upload file or select sample */}
        {status === "idle" && (
          <div className="flex-1 flex items-center justify-center">
            <FileUploader
              onStartParsing={handleStartParsing}
              onParsingProgress={handleParsingProgress}
              onStartAnalyzing={handleStartAnalyzing}
              onAnalysisSuccess={handleAnalysisSuccess}
              onAnalysisError={handleAnalysisError}
              onSelectSample={handleSelectSample}
            />
          </div>
        )}

        {/* LOADING STATES: OCR Parsing or AI Analyzing */}
        {(status === "parsing" || status === "analyzing") && (
          <div className="flex-1 flex items-center justify-center bg-slate-50/20">
            <Loader
              stage={status === "parsing" ? "parsing" : "analyzing"}
              progress={status === "parsing" ? parsingProgress : undefined}
            />
          </div>
        )}

        {/* READY STATE: Split View Workspace */}
        {status === "ready" && analysisResult && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl w-full mx-auto h-[calc(100vh-73px)] overflow-hidden">
            {/* Left Column: Analysis Results */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <Dashboard analysis={analysisResult} onReset={handleReset} />
            </div>

            {/* Right Column: Grounded Chat Interface */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <ChatInterface
                analysis={analysisResult}
                paperText={paperText}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                isSending={isSendingMessage}
              />
            </div>
          </div>
        )}

        {/* ERROR STATE: Show error summary with simple back-action */}
        {status === "error" && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white border border-rose-100 rounded-3xl p-8 text-center shadow-xl shadow-rose-50/50">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-50 text-rose-500 border border-rose-100/50 mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Analysis Interrupted
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                {errorMessage || "We had trouble extracting text from this research paper. Please check that the PDF is valid, not password protected, and contains selectable text streams."}
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm shadow-indigo-600/10 cursor-pointer"
              >
                Return to Document Upload
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
