"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { Loader2, Terminal, ShieldAlert, Cpu, HardDrive, Network } from "lucide-react";

interface PanelDisplayProps {
  panelData: any;
  user?: GitHubUser;
  isStreaming?: boolean;
}

const JUDGE_CONFIG: Record<string, { label: string; accent: string; icon: any }> = {
  elitist: { label: "JUDGE_ELITIST", accent: "#ffffff", icon: <ShieldAlert size={14} /> },
  brogrammer: { label: "JUDGE_BRO", accent: "#00f2ff", icon: <Cpu size={14} /> },
  chaos: { label: "JUDGE_CHAOS", accent: "#ff003c", icon: <HardDrive size={14} /> },
  recruiter: { label: "JUDGE_RECRUITER", accent: "#3b82f6", icon: <Network size={14} /> },
};

export function PanelDisplay({ panelData, user, isStreaming }: PanelDisplayProps) {
  const dialogue = panelData?.dialogue || [];
  const [visibleDialogue, setVisibleDialogue] = useState<any[]>([]);
  const [isJudgeTyping, setIsJudgeTyping] = useState(false);
  const [currentTypingJudge, setCurrentTypingJudge] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastProcessedIndex = useRef(-1);

  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sequential reveal logic
  useEffect(() => {
    // If we have more messages to show and we aren't currently typing one
    if (dialogue.length > visibleDialogue.length && !isJudgeTyping) {
      const nextMessage = dialogue[visibleDialogue.length];
      if (!nextMessage) return;

      setIsJudgeTyping(true);
      setCurrentTypingJudge(nextMessage.judge?.toLowerCase());
      
      const textLength = nextMessage.text?.length || 0;
      const duration = Math.min(Math.max(textLength * 15, 800), 2000);
      
      typingTimerRef.current = setTimeout(() => {
        setVisibleDialogue(prev => [...prev, nextMessage]);
        setIsJudgeTyping(false);
        setCurrentTypingJudge(null);
        typingTimerRef.current = null;
      }, duration);
    }
  }, [dialogue.length, visibleDialogue.length, isJudgeTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleDialogue, isJudgeTyping]);

  const allDialogueRevealed = dialogue.length > 0 && visibleDialogue.length === dialogue.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 pb-[20vh]">
      {/* Hearing Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-4 pt-[10vh]"
      >
        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
           <Terminal size={14} className="text-zinc-500" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">System_Hearing_Active</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
          {panelData?.hearing_title || "Technical_Judgment_In_Session"}
        </h1>
      </motion.div>

      {/* Chat Terminal */}
      <div 
        ref={scrollRef}
        className="min-h-[60vh] space-y-8 scroll-smooth"
      >
        <AnimatePresence mode="popLayout">
          {visibleDialogue.map((msg: any, i: number) => {
            const judgeKey = msg.judge?.toLowerCase() || 'elitist';
            const config = JUDGE_CONFIG[judgeKey] || JUDGE_CONFIG.elitist;
            const isLeftSide = judgeKey === 'elitist' || judgeKey === 'chaos';
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className={`flex flex-col ${isLeftSide ? 'items-start' : 'items-end'} space-y-2`}
              >
                {/* Meta Alert */}
                {msg.meta && (
                  <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-sm mb-2">
                    <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">{msg.meta}</p>
                  </div>
                )}

                <div className={`flex items-start gap-4 max-w-[80%] ${isLeftSide ? 'flex-row' : 'flex-row-reverse text-right'}`}>
                  <div 
                    className="mt-1 p-2 rounded-lg border border-white/10 bg-zinc-900 shadow-xl shrink-0"
                    style={{ color: config.accent }}
                  >
                    {config.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{config.label}</p>
                    <div 
                      className={`p-5 rounded-2xl border ${isLeftSide ? 'rounded-tl-none' : 'rounded-tr-none'} bg-zinc-950 shadow-2xl transition-all duration-500`}
                      style={{ borderColor: `${config.accent}22` }}
                    >
                      <p className="text-sm md:text-lg text-zinc-200 font-medium leading-relaxed italic">
                        "{msg.text}"
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Typing Indicator */}
        {isJudgeTyping && currentTypingJudge && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-4 ${currentTypingJudge === 'elitist' || currentTypingJudge === 'chaos' ? 'pl-12' : 'pr-12 flex-row-reverse text-right'}`}
          >
            <div className="flex gap-1">
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 rounded-full bg-zinc-500" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 rounded-full bg-zinc-500" />
              <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 rounded-full bg-zinc-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">
              {JUDGE_CONFIG[currentTypingJudge]?.label || 'JUDGE'}_Is_Responding...
            </span>
          </motion.div>
        )}

        {isStreaming && !isJudgeTyping && dialogue.length === visibleDialogue.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 text-zinc-700 py-12"
          >
            <Loader2 className="animate-spin" size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest animate-pulse">Waiting_For_Protocol_Uplink...</span>
          </motion.div>
        )}
      </div>

      {/* Final Consensus */}
      {panelData?.final_consensus && allDialogueRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-24 space-y-12"
        >
          <div className="h-[1px] w-full bg-zinc-900 relative">
             <div className="absolute inset-0 bg-white/20 w-1/4 animate-pulse" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="space-y-6 text-left">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Collective_Verdict</span>
                <p className="text-2xl md:text-4xl text-white font-black italic uppercase tracking-tighter leading-tight">
                   "{panelData.final_consensus}"
                </p>
             </div>
             <div className="flex flex-col items-center md:items-end gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Overall_Grade</span>
                <div className="relative">
                   <h2 className="text-9xl font-black italic text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                      {panelData.overall_grade}
                   </h2>
                </div>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
