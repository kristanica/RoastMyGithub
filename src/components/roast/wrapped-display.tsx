"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { X, ChevronRight, ChevronLeft, Zap, Award, Ghost, Flame, Target } from "lucide-react";

interface WrappedDisplayProps {
  user?: GitHubUser;
  roast: any;
  vibe: string;
  onClose: () => void;
}

export function WrappedDisplay({ user, roast, vibe, onClose }: WrappedDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const wrapped = roast?.wrapped || {};
  
  const slides = [
    {
      title: "The Beginning",
      content: roast?.introduction,
      icon: <Zap className="text-white" size={48} />,
      bg: "bg-black"
    },
    {
      title: "Your Spirit Language",
      main: wrapped.spirit_language?.name,
      sub: wrapped.spirit_language?.reason,
      icon: <Award className="text-white" size={48} />,
      bg: "bg-zinc-950"
    },
    {
      title: "The Worst Habit",
      main: wrapped.worst_habit?.name,
      sub: wrapped.worst_habit?.description,
      icon: <Ghost className="text-white" size={48} />,
      bg: "bg-black"
    },
    {
      title: "The Best Moment",
      main: wrapped.best_moment?.name,
      sub: wrapped.best_moment?.description,
      icon: <Flame className="text-white" size={48} />,
      bg: "bg-zinc-950"
    },
    {
      title: "The Persona",
      main: wrapped.coding_persona?.title,
      sub: wrapped.coding_persona?.description,
      icon: <Target className="text-white" size={48} />,
      bg: "bg-black"
    }
  ];

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
    const timer = setTimeout(nextSlide, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden"
    >
      {/* Progress Bars */}
      <div className="absolute top-8 left-6 right-6 flex gap-2 z-20">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: i === currentSlide ? "100%" : i < currentSlide ? "100%" : "0%" }}
              transition={{ duration: i === currentSlide ? 6 : 0, ease: "linear" }}
              className="h-full bg-white"
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-16 left-6 right-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <img src={user?.avatar_url} className="w-8 h-8 rounded-full border border-zinc-800 grayscale" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">@{user?.login} / Wrapped</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center space-y-12"
        >
          <div className="p-8 rounded-full bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 shadow-2xl">
            {slides[currentSlide].icon}
          </div>

          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.6em] text-zinc-600 font-black block">{slides[currentSlide].title}</span>
            {slides[currentSlide].content ? (
              <p className="text-3xl md:text-5xl font-bold italic leading-tight text-white/90">
                {slides[currentSlide].content}
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white">
                  {slides[currentSlide].main}
                </h2>
                <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed max-w-lg mx-auto">
                  {slides[currentSlide].sub}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Areas */}
      <div className="absolute inset-0 flex z-10">
        <div className="h-full w-1/3 cursor-pointer" onClick={prevSlide} />
        <div className="h-full w-2/3 cursor-pointer" onClick={nextSlide} />
      </div>

      <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">
        Click_To_Advance
      </div>
    </motion.div>
  );
}
