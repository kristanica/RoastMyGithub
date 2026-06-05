"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { Share2, Loader2, Sparkles, ChevronDown, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { ReportCard } from "./report-card";

import { WrappedDisplay } from "./wrapped-display";

interface RoastDisplayProps {
  roast: any;
  user?: GitHubUser;
  isStreaming?: boolean;
  vibe?: string;
}

export function RoastDisplay({ roast, user, isStreaming, vibe = "elitist" }: RoastDisplayProps) {
  const introduction = roast?.introduction || "";
  const steps = roast?.steps || [];
  const verdict = roast?.verdict || "";
  const dnaTraits = roast?.dna_traits || [];
  const hireabilityScore = roast?.hireability_score;
  const portfolioAudit = roast?.portfolio_audit;
  const [expandedReceipt, setExpandedReceipt] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const reportCardRef = useRef<HTMLDivElement>(null);

  const themeColors: Record<string, string> = {
    elitist: "zinc-100",
    brogrammer: "blue-400",
    chaos: "red-500",
    recruiter: "blue-600",
  };

  const accentColor = themeColors[vibe] || themeColors.elitist;

  const handleDownload = async () => {
    if (!reportCardRef.current || isDownloading) return;
    setIsDownloading(true);
    
    // Give the DOM a moment to ensure the off-screen element is ready
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      const options = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
        style: {
          opacity: "1",
          visibility: "visible",
        }
      };

      // Call once to "warm up" and ensure images/fonts are cached
      await toPng(reportCardRef.current, options);
      
      // Call again to get the final high-quality result
      const dataUrl = await toPng(reportCardRef.current, options);
      
      const link = document.createElement("a");
      link.download = `roast-${user?.login || "github"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate report card:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-[30vh] pb-[20vh]">
      {/* Introduction: The Hook */}
      {introduction && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="min-h-[60vh] flex flex-col justify-center gap-12"
        >
          <p className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white/90 italic">
            {introduction}
          </p>

          {hireabilityScore && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="p-8 border border-zinc-900 bg-zinc-950/50 space-y-4 max-w-xl"
            >
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-500">Hireability_Assessment</span>
                <span className="text-4xl font-black text-white">{hireabilityScore}<span className="text-sm text-zinc-700">/100</span></span>
              </div>
              <div className="h-1 bg-zinc-900 w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${hireabilityScore}%` }}
                  transition={{ delay: 1.5, duration: 1 }}
                  className="h-full bg-white"
                />
              </div>
              {portfolioAudit && <p className="text-xs text-zinc-500 italic leading-relaxed">{portfolioAudit}</p>}
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Narrative Steps: The Analysis */}
      <div className="space-y-[40vh]">
        {steps.map((step: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="space-y-12"
          >
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase tracking-[0.6em] text-muted font-black">
                Observation 0{i + 1}
              </span>
              <div className="h-[1px] flex-1 bg-zinc-900" />
            </div>

            <div className="space-y-8">
              <h3 className="text-3xl md:text-5xl font-medium leading-tight text-white tracking-tight">
                {step.content}
              </h3>
              {step.insight && (
                <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-3xl font-normal">
                  {step.insight}
                </p>
              )}

              {step.receipt && (
                <div className="pt-2">
                  <button
                    onClick={() => setExpandedReceipt(expandedReceipt === i ? null : i)}
                    className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black text-zinc-800 hover:text-white transition-colors"
                  >
                    <span>{expandedReceipt === i ? "Hide_Evidence" : "Show_Evidence"}</span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedReceipt === i && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-4 p-4 bg-zinc-950 border border-zinc-900 font-mono text-[10px] text-zinc-500 max-w-lg"
                      >
                        <span className="text-zinc-700 mr-2">SOURCE:</span>
                        {step.receipt}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* DNA Traits Section */}
      {dnaTraits.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-[40vh] flex flex-col justify-center space-y-16"
        >
          <div className="flex items-center gap-6">
            <span className={`text-[10px] uppercase tracking-[0.6em] text-${accentColor} font-black`}>
              Technical_DNA
            </span>
            <div className={`h-[1px] flex-1 bg-zinc-900`} />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {dnaTraits.map((trait: any, i: number) => (
              <div key={i} className="space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{trait.name}</p>
                  <p className={`text-xl font-black italic text-${accentColor}`}>{trait.value}%</p>
                </div>
                <div className="h-1 w-full bg-zinc-900 relative overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${trait.value}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 bg-${accentColor}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary Remedy: The Path to Redemption */}
      {roast?.summary_remedy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="min-h-[40vh] flex flex-col justify-center space-y-12"
        >
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-600 font-black">
              The Path To Redemption
            </span>
            <div className={`h-[1px] flex-1 bg-zinc-900`} />
          </div>
          
          <div className="space-y-6">
            <p className="text-2xl md:text-4xl text-white font-medium leading-relaxed max-w-4xl italic">
              "{roast.summary_remedy}"
            </p>
            <p className="text-sm text-zinc-600 uppercase tracking-widest font-bold">
              — Suggested_Course_Of_Action
            </p>
          </div>
        </motion.div>
      )}

      {/* Progressive Streaming Indicator */}
      {isStreaming && !verdict && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-[10vh] flex flex-col items-center justify-center text-center space-y-4"
        >
          <Loader2 className="animate-spin text-zinc-800" size={24} />
          <p className="text-xs uppercase tracking-[0.4em] text-zinc-600 font-bold animate-pulse">
            Analysis unfolding...
          </p>
        </motion.div>
      )}

      {/* Final Verdict: The Cinematic Conclusion */}
      {verdict && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="min-h-screen flex flex-col items-center justify-center relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent pointer-events-none" />

          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[10px] uppercase tracking-[1em] text-zinc-600 mb-16 block font-black"
          >
            The Final Verdict
          </motion.span>

          <motion.div
            initial={{ scale: 0.95, filter: "blur(10px)" }}
            whileInView={{ scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
            className="text-center px-4"
          >
            <p className="text-2xl md:text-5xl lg:text-[3.5rem] font-black tracking-tighter leading-[1.1] text-white italic uppercase break-words max-w-4xl mx-auto">
              {verdict}
              <span className="text-red-600 not-italic">.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-24 flex flex-col items-center gap-12"
          >
            <button
              onClick={() => setShowWrapped(true)}
              className="group flex flex-col items-center gap-4 text-muted hover:text-white transition-all duration-500"
            >
              <div className="p-4 rounded-full border border-zinc-800 group-hover:border-white transition-colors bg-white/5 animate-pulse group-hover:animate-none">
                <Share2 size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">
                Reveal_My_Story
              </span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] font-black text-zinc-600 hover:text-white transition-all disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
              <span>{isDownloading ? "Generating_Asset..." : "Download_Audit_Card"}</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      <AnimatePresence>
        {showWrapped && (
          <WrappedDisplay 
            user={user} 
            roast={roast} 
            vibe={vibe} 
            onClose={() => setShowWrapped(false)} 
          />
        )}
      </AnimatePresence>

      {/* Off-screen Report Card for Image Generation */}
      <ReportCard ref={reportCardRef} user={user} roast={roast} vibe={vibe} />
    </div>
  );
}
