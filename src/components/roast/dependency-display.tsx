"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Trash2, ShieldCheck, HardDrive } from "lucide-react";

interface DependencyDisplayProps {
  data: any;
  isStreaming?: boolean;
}

export function DependencyDisplay({
  data,
  isStreaming,
}: DependencyDisplayProps) {
  const analysis = data?.analysis || [];
  const ghosts = data?.ghost_dependencies || [];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-24 pb-[20vh] text-left">
      {/* Audit Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-center space-y-12 pt-[10vh]"
      >
        <div className="relative flex items-center">
          <div className="h-[1px] w-full bg-white/10" />
          <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
            The Structural Audit
          </span>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl md:text-7xl font-bold italic uppercase tracking-tighter text-white leading-[1.1]">
            {data?.introduction || "Dependency_Hell_Audit"}
          </h1>
          {data?.bloat_score && (
            <div className="flex items-end gap-4 border-l border-zinc-900 pl-8">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-700">
                  Bloat Index
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-7xl font-black italic text-white">
                    {data.bloat_score}
                  </span>
                  <span className="text-xs font-black text-zinc-900">/100</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Analysis */}
      <div className="space-y-16">
        <div className="relative flex items-center">
          <div className="h-[1px] w-full bg-white/10" />
          <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
            Observation 01
          </span>
        </div>

        <div className="grid gap-10">
          {analysis.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4 max-w-4xl"
            >
              <div className="flex items-center gap-3 text-zinc-200">
                <HardDrive size={12} className="text-zinc-800" />
                <p className="text-lg md:text-2xl font-bold italic tracking-tight">
                  {item.dependency}
                </p>
              </div>
              <div className="space-y-3 border-l border-zinc-900 pl-8 ml-1.5">
                <p className="text-base md:text-xl text-zinc-400 font-medium italic">
                  "{item.verdict}"
                </p>
                <p className="text-[9px] uppercase tracking-widest text-zinc-700 font-black italic">
                  Architect Verdict: {item.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ghost Dependencies */}
      {ghosts.length > 0 && (
        <div className="space-y-16">
          <div className="relative flex items-center">
            <div className="h-[1px] w-full bg-white/10" />
            <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
              Observation 02
            </span>
          </div>

          <div className="grid md:grid-cols-1 gap-10">
            {ghosts.map((ghost: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-3 max-w-3xl"
              >
                <div className="flex items-center gap-4 text-zinc-200 italic">
                  <Trash2 size={14} className="text-zinc-900" />
                  <p className="font-black uppercase tracking-tighter text-xl md:text-3xl">
                    {ghost.name}
                  </p>
                </div>
                <p className="text-base md:text-lg text-zinc-500 italic leading-relaxed pl-8">
                  {ghost.reason}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Summary Remedy Section */}
      {data?.summary_remedy && (
        <div className="space-y-16">
          <div className="relative flex items-center">
            <div className="h-[1px] w-full bg-white/10" />
            <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">
              The Redemption Path
            </span>
          </div>

          <div className="space-y-6">
            <p className="text-2xl md:text-4xl text-white font-bold italic leading-relaxed max-w-4xl">
              "{data.summary_remedy}"
            </p>
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-black italic">
              — Suggested Course Of Action
            </p>
          </div>
        </div>
      )}

      {/* Final Architectural Verdict */}
      {data?.verdict && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-24 text-center space-y-10 min-h-[50vh] flex flex-col justify-center items-center"
        >
          <div className="opacity-10">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h2 className="text-2xl md:text-6xl font-black italic uppercase tracking-tighter text-white max-w-4xl leading-tight">
            {data.verdict}
          </h2>
        </motion.div>
      )}
    </div>
  );
}
