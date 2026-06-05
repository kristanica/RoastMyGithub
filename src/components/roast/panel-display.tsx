"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import {
  Loader2,
  Terminal,
  ShieldAlert,
  Cpu,
  HardDrive,
  Network,
} from "lucide-react";

interface PanelDisplayProps {
  panelData: any;
  user?: GitHubUser;
  isStreaming?: boolean;
}

const JUDGE_CONFIG: Record<
  string,
  { label: string; accent: string; icon: any }
> = {
  elitist: {
    label: "THE GATEKEEPER",
    accent: "#ffffff",
    icon: <ShieldAlert size={14} />,
  },
  brogrammer: {
    label: "THE HYPE BEAST",
    accent: "#a1a1aa",
    icon: <Cpu size={14} />,
  },
  chaos: {
    label: "THE CHAOS GREMLIN",
    accent: "#a1a1aa",
    icon: <HardDrive size={14} />,
  },
  recruiter: {
    label: "THE SOUL CRUSHER",
    accent: "#a1a1aa",
    icon: <Network size={14} />,
  },
};

export function PanelDisplay({
  panelData,
  user,
  isStreaming,
}: PanelDisplayProps) {
  const dialogue = panelData?.dialogue || [];
  const [visibleDialogue, setVisibleDialogue] = useState<any[]>([]);
  const [isJudgeTyping, setIsJudgeTyping] = useState(false);
  const [currentTypingJudge, setCurrentTypingJudge] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sequential reveal logic
  useEffect(() => {
    if (dialogue.length > visibleDialogue.length && !isJudgeTyping) {
      const nextMessage = dialogue[visibleDialogue.length];
      if (!nextMessage) return;

      setIsJudgeTyping(true);
      setCurrentTypingJudge(nextMessage.judge?.toLowerCase());

      const textLength = nextMessage.text?.length || 0;
      const duration = Math.min(Math.max(textLength * 15, 600), 1800);

      typingTimerRef.current = setTimeout(() => {
        setVisibleDialogue((prev) => [...prev, nextMessage]);
        setIsJudgeTyping(false);
        setCurrentTypingJudge(null);
        typingTimerRef.current = null;
      }, duration);
    }
  }, [dialogue.length, visibleDialogue.length, isJudgeTyping]);

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

  const allDialogueRevealed =
    dialogue.length > 0 && visibleDialogue.length === dialogue.length;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 pb-[20vh] text-left">
      {/* Hearing Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center space-y-12 pt-[10vh]"
      >
        <div className="relative flex items-center">
          <div className="h-[1px] w-full bg-white/10" />
          <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
            Official Hearing
          </span>
        </div>

        <h1 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter text-white leading-[1.1]">
          {panelData?.hearing_title || "Technical Judgment In Session"}
        </h1>
      </motion.div>

      {/* Chat Terminal / Transcript */}
      <div ref={scrollRef} className="min-h-[50vh] space-y-10 scroll-smooth">
        <AnimatePresence mode="popLayout">
          {visibleDialogue.map((msg: any, i: number) => {
            const judgeKey = msg.judge?.toLowerCase() || "elitist";
            const config = JUDGE_CONFIG[judgeKey] || JUDGE_CONFIG.elitist;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-3 border-l border-zinc-900 pl-8 ml-2"
              >
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">
                    {config.label}
                  </span>
                  {msg.meta && (
                    <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">
                      [{msg.meta}]
                    </span>
                  )}
                </div>
                <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed italic max-w-4xl">
                  {msg.text}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Dynamic Typing Indicator */}
        {isJudgeTyping && currentTypingJudge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 pl-10"
          >
            <div className="flex gap-1">
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1 h-1 rounded-full bg-zinc-800"
              />
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                className="w-1 h-1 rounded-full bg-zinc-800"
              />
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                className="w-1 h-1 rounded-full bg-zinc-800"
              />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-zinc-900 italic">
              {JUDGE_CONFIG[currentTypingJudge]?.label || "JUDGE"} is entering
              the transcript...
            </span>
          </motion.div>
        )}

        {isStreaming &&
          !isJudgeTyping &&
          dialogue.length === visibleDialogue.length && (
            <div className="flex items-center gap-4 text-zinc-900 pl-10 italic">
              <Loader2 className="animate-spin" size={10} />
              <span className="text-[8px] font-black uppercase tracking-widest animate-pulse">
                Awaiting cross-examination...
              </span>
            </div>
          )}
      </div>

      {/* Final Consensus */}
      {panelData?.final_consensus && allDialogueRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-24 space-y-16"
        >
          <div className="relative flex items-center">
            <div className="h-[1px] w-full bg-white/10" />
            <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
              The Verdict
            </span>
          </div>

          <div className="space-y-10">
            <p className="text-2xl md:text-4xl text-white font-black italic uppercase tracking-tighter leading-tight max-w-4xl">
              "{panelData.final_consensus}"
            </p>
            <div className="flex items-baseline gap-4">
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-800">
                Official Grade
              </span>
              <h2 className="text-6xl md:text-9xl font-black italic text-white leading-none">
                {panelData.overall_grade}
              </h2>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
