"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { X, ArrowRight, ArrowLeft } from "lucide-react";

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

  const slides = [
    {
      label: "THE START",
      title: "The Narrative Begins",
      content: roast?.introduction,
    },
    {
      label: "THE EVOLUTION",
      title: "The Regression",
      isRegression: true,
      then: regression.then,
      now: regression.now,
      finalVerdict: regression.verdict,
    },
    {
      label: "THE LANGUAGE",
      title: "Your Spirit Language",
      main: wrapped.spirit_language?.name,
      sub: wrapped.spirit_language?.reason,
    },
    {
      label: "THE SIN",
      title: "The Fatal Flaw",
      main: wrapped.worst_habit?.name,
      sub: wrapped.worst_habit?.description,
    },
    {
      label: "THE IDENTITY",
      title: "Final Identification",
      main: wrapped.coding_persona?.title,
      sub: wrapped.coding_persona?.description,
    },
    {
       label: "THE VERDICT",
       title: "The Permanent Record",
       main: roast.verdict,
       sub: "This audit is complete. Your technical status is now public knowledge.",
    }
  ].filter(s => s.main || s.content || s.isRegression);

  const DURATION = 7;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(prev => prev + 1);
    else onClose();
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
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
      className="fixed inset-0 z-[9999] bg-black w-screen h-screen flex flex-col items-center justify-center p-8 md:p-24 overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />

      {/* Editorial Progress System */}
      <div className="absolute top-10 left-8 right-8 flex gap-3 z-[10000]">
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
              className="h-full bg-white"
            />
          </div>
        ))}
      </div>

      {/* Identity Header */}
      <div className="absolute top-20 left-10 flex items-center gap-6 z-[10001] opacity-40">
        <img src={user?.avatar_url} className="w-8 h-8 rounded-full grayscale" />
        <div className="flex flex-col">
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">Judgment.2024</span>
           <span className="text-[9px] font-bold uppercase tracking-[0.2em]">@{user?.login}</span>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-20 right-10 p-3 hover:bg-white/5 rounded-full transition-all text-white z-[10002]"
      >
        <X size={24} />
      </button>

      {/* Narrative Content */}
      <div className="max-w-4xl w-full relative z-[10000]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12"
          >
            <div className="space-y-4">
               <div className="flex items-center gap-6">
                  <span className="text-[9px] font-black uppercase tracking-[0.8em] text-white italic">{slides[currentSlide].label}</span>
                  <div className="h-[1px] w-12 bg-white/10" />
               </div>
               <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">
                 {slides[currentSlide].title}
               </h2>
            </div>

            {slides[currentSlide].isRegression ? (
              <div className="space-y-12">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-4">
                       <span className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-700">The Beginning</span>
                       <p className="text-xl md:text-3xl text-white font-bold italic leading-tight">
                         "{slides[currentSlide].then}"
                       </p>
                    </div>
                    <div className="space-y-4">
                       <span className="text-[8px] font-black uppercase tracking-[0.6em] text-zinc-700">The Downfall</span>
                       <p className="text-xl md:text-3xl text-white font-bold italic leading-tight">
                         "{slides[currentSlide].now}"
                       </p>
                    </div>
                 </div>
                 <div className="pt-8 border-t border-white/5">
                    <p className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
                       {slides[currentSlide].finalVerdict}
                    </p>
                 </div>
              </div>
            ) : slides[currentSlide].content ? (
              <h1 className="text-3xl md:text-5xl font-bold italic uppercase tracking-tighter text-white leading-[1] max-w-3xl">
                 {slides[currentSlide].content}
              </h1>
            ) : (
              <div className="space-y-8">
                 <h1 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9]">
                   {slides[currentSlide].main}
                 </h1>
                 <p className="text-lg md:text-2xl text-zinc-500 leading-relaxed max-w-2xl italic font-medium">
                   "{slides[currentSlide].sub}"
                 </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Controls */}
      <div className="absolute bottom-12 right-12 flex items-center gap-10 z-[10002]">
         <button 
           onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
           className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-all"
         >
            <ArrowLeft size={24} />
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
           className="p-4 bg-white/5 hover:bg-white/10 rounded-full text-zinc-500 hover:text-white transition-all"
         >
            <ArrowRight size={24} />
         </button>
      </div>

      {/* Interactive Zones */}
      <div className="absolute inset-0 flex z-[9998]">
        <div className="h-full w-1/2 cursor-w-resize" onClick={prevSlide} />
        <div className="h-full w-1/2 cursor-e-resize" onClick={nextSlide} />
      </div>
    </motion.div>
  );
}
