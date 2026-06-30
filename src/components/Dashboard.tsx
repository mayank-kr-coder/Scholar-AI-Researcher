import { useState } from "react";
import { BookOpen, CheckCircle2, FlaskConical, Trophy, FileText, ArrowLeft, RefreshCw, Layers, Binary, ShieldAlert, BookOpenCheck } from "lucide-react";
import { AnalysisResult } from "../types";

interface DashboardProps {
  analysis: AnalysisResult;
  onReset: () => void;
}

type TabType = "overview" | "findings" | "methodology" | "python-nlp";

export default function Dashboard({ analysis, onReset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div id="paper-dashboard" className="flex flex-col h-full bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden animate-fade-in">
      
      {/* Dashboard Header */}
      <div className="p-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-4">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            New Document
          </button>
          
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold font-mono px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
              PYTHON NLP ACTIVE
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ANALYSIS ACTIVE
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 leading-snug">
            {analysis.title}
          </h2>
          <p className="text-xs font-semibold text-slate-500 font-mono">
            By {analysis.authors || "Unknown Authors"}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-2xl transition-all ${
            activeTab === "overview"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("findings")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-2xl transition-all ${
            activeTab === "findings"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Findings
        </button>
        <button
          onClick={() => setActiveTab("methodology")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-2xl transition-all ${
            activeTab === "methodology"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Methodology
        </button>
        <button
          onClick={() => setActiveTab("python-nlp")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-bold rounded-2xl transition-all ${
            activeTab === "python-nlp"
              ? "bg-white text-indigo-600 shadow-sm border border-indigo-100"
              : "text-indigo-600/70 hover:text-indigo-600 hover:bg-indigo-50/30"
          }`}
        >
          <Binary className="w-3.5 h-3.5" />
          Python NLP
        </button>
      </div>

      {/* Tab Content Areas */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Executive Summary Card */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                Executive Summary
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100">
                {analysis.summary}
              </p>
            </div>

            {/* Core Scientific Contributions */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                Core Contributions
              </h3>
              <div className="space-y-3">
                {analysis.contributions.map((contribution, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border border-indigo-50/50 bg-indigo-50/10 rounded-2xl"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 mb-1">
                        Contribution #{index + 1}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {contribution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KEY FINDINGS */}
        {activeTab === "findings" && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
              Extracted Discoveries & Key Findings
            </h3>
            
            <div className="space-y-3">
              {analysis.findings.map((finding, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors shadow-sm shadow-slate-100/50"
                >
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <span className="text-xs font-bold font-mono">{index + 1}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1.5">
                    {finding}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: METHODOLOGY EXTRACTION (BENTO GRID) */}
        {activeTab === "methodology" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono mb-2">
              Structured Methodology Breakdown
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Research Design */}
              <div className="p-5 bg-amber-50/10 border border-amber-100/50 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 font-mono">
                  Research Design
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysis.methodology.design}
                </p>
              </div>

              {/* Data Sources / Benchmarks */}
              <div className="p-5 bg-sky-50/10 border border-sky-100/50 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 font-mono">
                  Dataset & Benchmarks
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysis.methodology.dataset}
                </p>
              </div>

              {/* Analytical Approach */}
              <div className="p-5 bg-indigo-50/10 border border-indigo-100/50 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 font-mono">
                  Analytical Approach & Techniques
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysis.methodology.approach}
                </p>
              </div>

              {/* Limitations */}
              <div className="p-5 bg-rose-50/10 border border-rose-100/50 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 font-mono">
                  Acknowledged Limitations
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {analysis.methodology.limitations}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: PYTHON NLP STATISTICAL METRICS */}
        {activeTab === "python-nlp" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                Python NLP Metric Calculations
              </h3>
              <span className="text-[9px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {analysis.pythonMetrics?.pythonEngineVersion || "Python NLP Engine"}
              </span>
            </div>

            {analysis.pythonMetrics ? (
              <div className="space-y-6">
                
                {/* 4-Cell Bento Analytics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                      Word Count
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {analysis.pythonMetrics.wordCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                      Lexical Diversity
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {(analysis.pythonMetrics.lexicalDiversity * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                      Reading Time
                    </span>
                    <span className="text-xl font-black text-slate-800">
                      {analysis.pythonMetrics.estimatedReadingTime}
                    </span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-1">
                      ARI Readability
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 block mt-2 truncate">
                      {analysis.pythonMetrics.readabilityGrade}
                    </span>
                  </div>
                </div>

                {/* Local Python Keyword Extraction */}
                <div className="p-5 bg-indigo-50/10 border border-indigo-100/30 rounded-2xl space-y-3">
                  <span className="block text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest font-mono">
                    Natively Extracted Scientific Keywords
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    Calculated in Python via automated frequency distributions of non-stopword tokens.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.pythonMetrics.topKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-bold font-mono text-indigo-600 bg-white border border-indigo-100 px-3 py-1 rounded-xl shadow-sm"
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Why Python? explanation box */}
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3.5">
                  <BookOpenCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800">Python ML Processing Benefits</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Using a dedicated Python NLP backend provides accurate mathematical feature extraction, lexical counting, and automated document structure analytics, serving as a robust companion to the generative powers of Gemini AI.
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                No local Python metrics found.
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
