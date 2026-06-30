import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Sparkles, MessageSquare, Copy, Check, Terminal } from "lucide-react";
import { ChatMessage, AnalysisResult } from "../types";

interface ChatInterfaceProps {
  analysis: AnalysisResult;
  paperText: string;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isSending: boolean;
}

export default function ChatInterface({
  analysis,
  paperText,
  messages,
  onSendMessage,
  isSending,
}: ChatInterfaceProps) {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = () => {
    if (!inputText.trim() || isSending) return;
    const textToSend = inputText;
    setInputText("");
    onSendMessage(textToSend);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to parse simple markdown patterns like lists, bold text, and inline code
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      
      // Handle standard lists / bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(2);
        return (
          <ul key={idx} className="list-disc pl-5 mb-1.5 text-xs text-slate-700 leading-relaxed">
            <li>{parseInlineFormatting(content)}</li>
          </ul>
        );
      }
      
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)/);
        const num = match ? match[1] : "";
        const content = match ? match[2] : trimmed;
        return (
          <ol key={idx} className="list-decimal pl-5 mb-1.5 text-xs text-slate-700 leading-relaxed">
            <li>{parseInlineFormatting(content)}</li>
          </ol>
        );
      }

      // Handle standard headers
      if (trimmed.startsWith("### ")) {
        return (
          <h5 key={idx} className="text-xs font-bold text-slate-900 mt-3 mb-1 font-mono uppercase tracking-wider">
            {parseInlineFormatting(trimmed.substring(4))}
          </h5>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h4 key={idx} className="text-sm font-extrabold text-slate-900 mt-4 mb-2">
            {parseInlineFormatting(trimmed.substring(3))}
          </h4>
        );
      }

      // Default paragraph line
      return line === "" ? (
        <div key={idx} className="h-2" />
      ) : (
        <p key={idx} className="text-xs text-slate-600 leading-relaxed mb-2">
          {parseInlineFormatting(line)}
        </p>
      );
    });
  };

  // Helper to parse bold (**text**) and code (`code`) inline
  const parseInlineFormatting = (content: string) => {
    const parts = [];
    let currentStr = content;
    let index = 0;

    // Combined regex for matching **bold** and `code`
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const matchIndex = match.index;
      const matchText = match[0];

      // Push preceding text
      if (matchIndex > index) {
        parts.push(content.substring(index, matchIndex));
      }

      // Format bold or code
      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        parts.push(
          <strong key={matchIndex} className="font-bold text-slate-900">
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        parts.push(
          <code key={matchIndex} className="px-1.5 py-0.5 bg-slate-100 rounded text-[11px] font-mono font-semibold text-indigo-700">
            {matchText.slice(1, -1)}
          </code>
        );
      }

      index = regex.lastIndex;
    }

    // Push remaining string
    if (index < content.length) {
      parts.push(content.substring(index));
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div id="chat-workspace" className="flex flex-col h-full bg-slate-50/50 border border-slate-100 rounded-3xl shadow-sm overflow-hidden animate-fade-in">
      
      {/* Workspace Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 leading-tight">
              Interactive Chat Workspace
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Grounded on document contents
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
            <p className="text-sm font-semibold text-slate-600 mb-1">
              Ask specific questions
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Inquire about math models, dataset details, research hypotheses, or conclusions within the paper.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] group ${
                msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
              }`}
            >
              {/* Message bubble label */}
              <span className="text-[9px] font-bold text-slate-400 font-mono mb-1 px-1 flex items-center gap-1">
                {msg.role === "user" ? "Researcher" : "Gemini AI"}
              </span>

              {/* Message Bubble */}
              <div
                className={`relative p-4 rounded-2xl border text-sm transition-all shadow-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white border-indigo-500 rounded-tr-sm"
                    : "bg-white text-slate-700 border-slate-100 rounded-tl-sm"
                }`}
              >
                {/* Text Content */}
                <div className="space-y-1">
                  {msg.role === "user" ? (
                    <p className="text-xs font-semibold leading-relaxed break-words">{msg.text}</p>
                  ) : (
                    <div className="break-words">{renderMessageContent(msg.text)}</div>
                  )}
                </div>

                {/* Utility Copy Button */}
                {msg.role === "model" && (
                  <button
                    onClick={() => copyToClipboard(msg.text, msg.id)}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-100"
                    title="Copy response to clipboard"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isSending && (
          <div className="flex flex-col items-start max-w-[80%]">
            <span className="text-[9px] font-bold text-slate-400 font-mono mb-1 px-1">
              Gemini AI
            </span>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Formulating scientific answer...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Questions Section */}
      {analysis.suggestedQuestions && analysis.suggestedQuestions.length > 0 && (
        <div className="px-4 py-3 bg-white border-t border-slate-100/50">
          <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
            Suggested Queries:
          </p>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-1">
            {analysis.suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isSending) onSendMessage(question);
                }}
                disabled={isSending}
                className="text-left text-xs bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 hover:border-indigo-100 text-indigo-700 font-semibold px-3 py-1.5 rounded-xl transition-all truncate max-w-full duration-200 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Input Box */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={isSending ? "Gemini is analyzing..." : "Ask Gemini about the research paper..."}
          disabled={isSending}
          className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={!inputText.trim() || isSending}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-sm shadow-indigo-600/20 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
