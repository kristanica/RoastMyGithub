"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { Share2, Loader2, Sparkles, ChevronDown } from "lucide-react";

interface RoastDisplayProps {
  roast: any;
  user?: GitHubUser;
  isStreaming?: boolean;
}

export function RoastDisplay({ roast, user, isStreaming }: RoastDisplayProps) {
  const introduction = roast?.introduction || "";
  const steps = roast?.steps || [];
  const verdict = roast?.verdict || "";
  const [expandedRemedy, setExpandedRemedy] = useState<number | null>(null);

  const handleShare = () => {
    const text = `My GitHub profile was just judged: "${verdict || introduction}". Get roasted at RoastMyGitHub.`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
    );
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
          className="min-h-[60vh] flex flex-col justify-center"
        >
          <p className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-white/90 italic">
            {introduction}
          </p>
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

              {step.remedy && (
                <div className="pt-2">
                  <button
                    onClick={() => setExpandedRemedy(expandedRemedy === i ? null : i)}
                    className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black text-zinc-700 hover:text-white transition-colors group"
                  >
                    <span>{expandedRemedy === i ? "Hide_Remedy" : "Seek_Remedy"}</span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedRemedy === i && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="mt-4 text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-2xl border-l border-zinc-800 pl-4 py-1">
                          {step.remedy}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

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
            className="mt-24"
          >
            <button
              onClick={handleShare}
              className="group flex flex-col items-center gap-4 text-muted hover:text-white transition-all duration-500"
            >
              <div className="p-4 rounded-full border border-zinc-800 group-hover:border-white transition-colors">
                <Share2 size={24} />
              </div>
              <span className="text-[10px] uppercase tracking-[0.4em] font-black">
                Publish Judgment
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
