"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import {
  Share2,
  Loader2,
  Download,
} from "lucide-react";
import { toPng } from "html-to-image";
import { ReportCard } from "./report-card";
import { WrappedDisplay } from "./wrapped-display";

interface RoastDisplayProps {
  roast: any;
  user?: GitHubUser;
  isStreaming?: boolean;
  vibe?: string;
  onShowWrapped?: () => void;
}

export function RoastDisplay({
  roast,
  user,
  isStreaming,
  vibe = "elitist",
  onShowWrapped,
}: RoastDisplayProps) {
  const introduction = roast?.introduction || "";
  const steps = roast?.steps || [];
  const verdict = roast?.verdict || "";
  const dnaTraits = roast?.dna_traits || [];
  const hireabilityScore = roast?.hireability_score;
  const portfolioAudit = roast?.portfolio_audit;
  const [expandedReceipt, setExpandedReceipt] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const reportCardRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useRef<any[]>([]);

  const scrollToSection = (index: number) => {
    const target = sectionRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute("data-index");
            if (indexStr) setActiveStep(Number(indexStr));
          }
        });
      },
      { threshold: 0.5, rootMargin: "-10% 0px -10% 0px" },
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [steps, verdict, introduction, dnaTraits]);

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
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const options = {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#000",
        style: { opacity: "1", visibility: "visible" },
      };
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

  const navItems = [
    { label: "Intro", index: -1 },
    ...steps.map((_: any, i: number) => ({ label: `0${i + 1}`, index: i })),
    { label: "DNA", index: 100 },
    { label: "Remedy", index: 101 },
    { label: "Final", index: 102 },
  ];

  return (
    <div className="relative space-y-[30vh] pb-[20vh] text-left">
      {/* Sidebar Navigation */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col gap-6">
        {navItems.map((item) => (
          <button
            key={item.index}
            onClick={() => scrollToSection(item.index)}
            className="group relative flex items-center justify-end gap-4"
          >
            {activeStep === item.index && (
               <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {item.index === -1 ? '00' : item.index >= 100 ? item.index - 99 + steps.length : (item.index + 1).toString().padStart(2, '0')}
               </span>
            )}
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${activeStep === item.index ? 'bg-white scale-125' : 'border border-white/20 group-hover:border-white/40'}`} />
          </button>
        ))}
      </div>

      {/* Introduction */}
      {introduction && (
        <motion.div
          ref={(el) => { if (el) sectionRefs.current[-1] = el; }}
          data-index="-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="min-h-[60vh] flex flex-col justify-center gap-16 max-w-5xl"
        >
          <div className="relative flex items-center">
             <div className="h-[1px] w-full bg-white/10" />
             <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">The Hook</span>
          </div>
          <p className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white italic">{introduction}</p>
          <button onClick={() => scrollToSection(0)} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 hover:text-white transition-all text-left group flex items-center gap-6">
             <span>Begin the Audit</span>
             <div className="h-[1px] w-8 bg-zinc-900 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
          </button>
        </motion.div>
      )}

      {/* Steps */}
      <div className="space-y-[40vh]">
        {steps.map((step: any, i: number) => (
          <motion.div
            key={i}
            ref={(el) => { if (el) sectionRefs.current[i] = el; }}
            data-index={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="space-y-16 max-w-5xl"
          >
            <div className="relative flex items-center">
               <div className="h-[1px] w-full bg-white/10" />
               <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">Observation 0{i + 1}</span>
            </div>
            <div className="space-y-10">
              <h3 className="text-3xl md:text-6xl font-bold leading-tight text-white tracking-tight italic">{step.content}</h3>
              {step.insight && <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed max-w-4xl font-normal">{step.insight}</p>}
              
              <div className="pt-4 space-y-6">
                {step.receipt && (
                  <div>
                    <button onClick={() => setExpandedReceipt(expandedReceipt === i ? null : i)} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 hover:text-white transition-colors">
                      {expandedReceipt === i ? "Hide_Evidence" : "Show_Evidence"}
                    </button>
                    <AnimatePresence>
                      {expandedReceipt === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                           <div className="mt-6 p-6 bg-zinc-950/50 border border-white/5 font-mono text-[10px] text-zinc-500 leading-relaxed">
                              <span className="text-zinc-700 mr-4">REPOSITORIES_SIGNAL_ID:</span>{step.receipt}
                           </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
                <button onClick={() => scrollToSection(i === steps.length - 1 ? 100 : i + 1)} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 hover:text-white transition-all group flex items-center gap-6">
                   <span>Next Observation</span>
                   <div className="h-[1px] w-8 bg-zinc-900 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* DNA Traits */}
      {dnaTraits.length > 0 && (
        <motion.div
          ref={(el) => { if (el) sectionRefs.current[100] = el; }}
          data-index="100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-[40vh] flex flex-col justify-center space-y-20 max-w-5xl"
        >
          <div className="relative flex items-center">
             <div className="h-[1px] w-full bg-white/10" />
             <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">Technical DNA</span>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
            {dnaTraits.map((trait: any, i: number) => (
              <div key={i} className="space-y-6">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{trait.name}</p>
                  <p className="text-2xl font-bold italic text-white">{trait.value}%</p>
                </div>
                <div className="h-[1px] w-full bg-zinc-900 relative">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${trait.value}%` }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }} className="absolute inset-y-0 left-0 bg-white" />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => scrollToSection(101)} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 hover:text-white transition-all text-left group flex items-center gap-6">
             <span>The Redemption Path</span>
             <div className="h-[1px] w-8 bg-zinc-900 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
          </button>
        </motion.div>
      )}

      {/* Summary Remedy */}
      {roast?.summary_remedy && (
        <motion.div
          ref={(el) => { if (el) sectionRefs.current[101] = el; }}
          data-index="101"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="min-h-[40vh] flex flex-col justify-center space-y-16 max-w-5xl"
        >
          <div className="relative flex items-center">
             <div className="h-[1px] w-full bg-white/10" />
             <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">The Path To Redemption</span>
          </div>
          <div className="space-y-8">
            <p className="text-2xl md:text-5xl text-white font-bold leading-relaxed max-w-4xl italic">"{roast.summary_remedy}"</p>
            <p className="text-xs text-zinc-600 uppercase tracking-widest font-black">— Suggested_Course_Of_Action</p>
          </div>
          <button onClick={() => scrollToSection(102)} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-800 hover:text-white transition-all text-left group flex items-center gap-6">
             <span>Seal the Judgment</span>
             <div className="h-[1px] w-8 bg-zinc-900 group-hover:w-16 group-hover:bg-white transition-all duration-500" />
          </button>
        </motion.div>
      )}

      {/* System Status */}
      {isStreaming && !verdict && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          <div className="h-[1px] w-full bg-white/5 overflow-hidden">
            <motion.div initial={{ x: "-100%" }} animate={{ x: "0%" }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="h-full w-full bg-white/40" />
          </div>
          <div className="flex justify-end p-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">
              <Loader2 className="animate-spin" size={10} />
              <span>Analyzing_Life_Choices <span className="animate-pulse">...</span></span>
            </motion.div>
          </div>
        </div>
      )}

      {/* Final Verdict */}
      {verdict && (
        <motion.div
          ref={(el) => { if (el) sectionRefs.current[102] = el; }}
          data-index="102"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] pointer-events-none" />
          <motion.span initial={{ opacity: 0, letterSpacing: "1.5em" }} whileInView={{ opacity: 1, letterSpacing: "0.8em" }} viewport={{ once: true }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }} className="text-[10px] uppercase text-zinc-600 mb-16 block font-black">The Final Verdict</motion.span>
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="px-4 relative z-20">
            <h2 className="text-3xl md:text-7xl font-bold tracking-tighter leading-[0.95] text-white italic uppercase break-words max-w-5xl mx-auto">
              {verdict}<span className="text-zinc-800 not-italic">.</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 2.5, duration: 1 }} className="mt-24 flex flex-col items-center gap-12">
            <button onClick={onShowWrapped} className="group flex flex-col items-center gap-4 text-zinc-600 hover:text-white transition-all duration-500">
              <div className="p-4 rounded-full border border-zinc-900 group-hover:border-white transition-colors bg-white/5 animate-pulse group-hover:animate-none"><Share2 size={20} /></div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">Reveal My Story</span>
            </button>
            <button onClick={handleDownload} disabled={isDownloading} className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-700 hover:text-white transition-all disabled:opacity-30">
              {isDownloading ? "Generating Asset..." : "Download Audit Card"}
            </button>
          </motion.div>
        </motion.div>
      )}

      <ReportCard ref={reportCardRef} user={user} roast={roast} vibe={vibe} />
    </div>
  );
}
