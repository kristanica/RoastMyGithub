"use client";

import { motion } from "framer-motion";
import { GitHubUser } from "@/types/github";
import { Swords, Trophy, Loader2 } from "lucide-react";

interface BattleDisplayProps {
  battle: any;
  user1?: GitHubUser;
  user2?: GitHubUser;
  isStreaming?: boolean;
}

export function BattleDisplay({ battle, user1, user2, isStreaming }: BattleDisplayProps) {
  const introduction = battle?.introduction || "";
  const rounds = battle?.rounds || [];
  const verdict = battle?.verdict || "";
  const overallWinner = battle?.overall_winner;

  return (
    <div className="space-y-[30vh] pb-[20vh] text-left">
      {/* Introduction */}
      {introduction && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-[60vh] flex flex-col justify-center space-y-12 max-w-5xl"
        >
          <div className="relative flex items-center">
             <div className="h-[1px] w-full bg-white/10" />
             <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">The Conflict</span>
          </div>

          <div className="flex items-center gap-8 grayscale opacity-40">
            <div className="space-y-3">
              <img src={user1?.avatar_url} className="w-12 h-12 rounded-full" />
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">@{user1?.login}</p>
            </div>
            <Swords size={18} className="text-zinc-800" />
            <div className="space-y-3">
              <img src={user2?.avatar_url} className="w-12 h-12 rounded-full" />
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">@{user2?.login}</p>
            </div>
          </div>

          <p className="text-3xl md:text-5xl font-bold italic text-white leading-[1.1] tracking-tight max-w-4xl">
            {introduction}
          </p>
        </motion.div>
      )}

      {/* Rounds */}
      <div className="space-y-[30vh]">
        {rounds.map((round: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="space-y-12 max-w-5xl"
          >
            <div className="relative flex items-center">
               <div className="h-[1px] w-full bg-white/10" />
               <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">Observation 0{i + 1}</span>
            </div>
            
            <div className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-600 italic">{round.title}</h3>
              <p className="text-2xl md:text-4xl font-medium text-zinc-400 leading-relaxed italic max-w-4xl">
                {round.analysis}
              </p>
              <div className="flex items-center gap-6 pt-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">
                  Advantage: <span className="text-zinc-400 italic">{round.winner_of_round}</span>
                </span>
                <div className="h-[1px] w-8 bg-zinc-900" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isStreaming && !verdict && (
        <div className="fixed bottom-10 left-10 flex items-center gap-4 text-zinc-700 italic">
          <Loader2 className="animate-spin" size={12} />
          <p className="text-[9px] uppercase tracking-widest font-black">Witnessing the carnage...</p>
        </div>
      )}

      {/* Final Result */}
      {verdict && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <span className="text-[10px] uppercase tracking-[1em] text-zinc-600 font-black">The Technical Victor</span>
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white">
              {overallWinner}
            </h2>
          </div>

          <p className="text-lg md:text-2xl text-zinc-500 max-w-3xl leading-relaxed italic relative z-10 px-6">
            "{verdict}"
          </p>
        </motion.div>
      )}
    </div>
  );
}
