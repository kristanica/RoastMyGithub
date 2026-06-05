"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { X, ChevronRight, ChevronLeft, Zap, Award, Ghost, Flame, Target, Clock, TrendingDown } from "lucide-react";

interface WrappedDisplayProps {
  user?: GitHubUser;
  roast: any;
  vibe: string;
  onClose: () => void;
}

export function WrappedDisplay({ user, roast, vibe, onClose }: WrappedDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const wrapped = roast?.wrapped || {};
  const regression = wrapped.regression || {};

  const themeGradients: Record<string, string> = {
    elitist: "from-zinc-900 via-black to-zinc-900",
    brogrammer: "from-blue-950 via-black to-zinc-900",
    chaos: "from-red-950 via-black to-zinc-900",
    recruiter: "from-slate-900 via-black to-zinc-900",
  };

  const accentColors: Record<string, string> = {
    elitist: "white",
    brogrammer: "#00f2ff",
    chaos: "#ff003c",
    recruiter: "#3b82f6",
  };

  const currentTheme = themeGradients[vibe] || themeGradients.elitist;
  const accent = accentColors[vibe] || accentColors.elitist;
  
  const slides = [
    {
      title: "The Narrative Begins",
      content: roast?.introduction,
      icon: <Zap size={32} />,
    },
    {
      title: "The Regression",
      isRegression: true,
      then: regression.then,
      now: regression.now,
      finalVerdict: regression.verdict,
      icon: <Clock size={32} />,
    },
    {
      title: "Your Spirit Language",
      main: wrapped.spirit_language?.name,
      sub: wrapped.spirit_language?.reason,
      icon: <Award size={32} />,
    },
    {
      title: "The Fatal Flaw",
      main: wrapped.worst_habit?.name,
      sub: wrapped.worst_habit?.description,
      icon: <Ghost size={32} />,
    },
    {
      title: "Peak Performance",
      main: wrapped.best_moment?.name,
      sub: wrapped.best_moment?.description,
      icon: <Flame size={32} />,
    },
    {
      title: "Final Identification",
      main: wrapped.coding_persona?.title,
      sub: wrapped.coding_persona?.description,
      icon: <Target size={32} />,
    }
  ];

  // Animation duration for each slide in seconds
  const DURATION = 6;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(nextSlide, DURATION * 1000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed top-0 left-0 right-0 bottom-0 w-screen h-screen z-[9999] bg-black bg-gradient-to-br ${currentTheme} flex flex-col items-center justify-between p-8 md:p-16 overflow-hidden`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 blur-[120px] rounded-full" style={{ backgroundColor: accent }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[120px] rounded-full opacity-20" style={{ backgroundColor: accent }} />
      </div>

      {/* Progress Bars */}
      <div className="absolute top-10 left-8 right-8 flex gap-2 z-[10000]">
        {slides.map((_, i) => (
          <div key={i} className="h-[2px] flex-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ 
                width: i === currentSlide ? "100%" : i < currentSlide ? "100%" : "0%" 
              }}
              transition={{ 
                duration: i === currentSlide ? DURATION : 0, 
                ease: "linear" 
              }}
              className="h-full"
              style={{ backgroundColor: accent }}
            />
          </div>
        ))}
      </div>

      {/* Header Info */}
      <div className="relative z-50 w-full flex justify-between items-center mt-6">
        <div className="flex items-center gap-4">
          <div className="p-1 rounded-full border border-white/10">
            <img src={user?.avatar_url} className="w-8 h-8 rounded-full grayscale" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">@{user?.login}</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-500">Technical_Wrapped_2024</span>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white group">
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-40 flex-1 w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl flex flex-col items-center text-center space-y-12"
          >
            <motion.div 
              initial={{ rotate: -10, y: 20 }}
              animate={{ rotate: 0, y: 0 }}
              className="p-10 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
              style={{ color: accent }}
            >
              {slides[currentSlide].icon}
            </motion.div>

            <div className="space-y-8">
              <span className="text-[10px] uppercase tracking-[0.8em] text-zinc-500 font-black block" style={{ color: `${accent}88` }}>
                {slides[currentSlide].title}
              </span>
              
              {slides[currentSlide].isRegression ? (
                <div className="space-y-12 w-full max-w-3xl mx-auto">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-left">
                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-zinc-500">
                            <Clock size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Then_Early_Days</span>
                         </div>
                         <p className="text-xl md:text-2xl text-white font-medium italic leading-tight">
                            "{slides[currentSlide].then}"
                         </p>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3" style={{ color: accent }}>
                            <TrendingDown size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Now_The_Downfall</span>
                         </div>
                         <p className="text-xl md:text-2xl text-white font-medium italic leading-tight">
                            "{slides[currentSlide].now}"
                         </p>
                      </div>
                   </div>
                   <div className="pt-8 border-t border-white/5">
                      <p className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white leading-tight">
                         {slides[currentSlide].finalVerdict}
                      </p>
                   </div>
                </div>
              ) : slides[currentSlide].content ? (
                <p className="text-3xl md:text-6xl font-black italic tracking-tighter leading-[1] text-white uppercase max-w-3xl">
                  {slides[currentSlide].content}
                </p>
              ) : (
                <div className="space-y-6">
                  <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
                    {slides[currentSlide].main}
                  </h2>
                  <p className="text-xl md:text-3xl text-zinc-400 font-medium leading-tight max-w-2xl mx-auto italic">
                    "{slides[currentSlide].sub}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Hints */}
      <div className="relative z-50 w-full flex flex-col items-center gap-6 mb-4">
        <div className="flex items-center gap-12 text-zinc-600">
           <button onClick={prevSlide} className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">Prev</button>
           <div className="h-4 w-[1px] bg-zinc-800" />
           <button onClick={nextSlide} className="text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">Next</button>
        </div>
        <div className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-800">
          AUTO_ADVANCING_SYSTEM
        </div>
      </div>

      {/* Invisible Interactive Zones */}
      <div className="absolute inset-0 flex z-30">
        <div className="h-full w-1/2 cursor-w-resize" onClick={prevSlide} />
        <div className="h-full w-1/2 cursor-e-resize" onClick={nextSlide} />
      </div>
    </motion.div>
  );
}
