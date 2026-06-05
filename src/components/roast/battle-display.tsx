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
    <div className="space-y-[30vh] pb-[20vh]">
      {/* Introduction */}
      {introduction && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
        >
          <div className="flex items-center gap-8 md:gap-16">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <img src={user1?.avatar_url} className="w-24 h-24 md:w-40 md:h-40 rounded-full grayscale border-2 border-zinc-900" />
              <p className="text-[10px] font-black uppercase tracking-widest">@{user1?.login}</p>
            </motion.div>
            <Swords size={48} className="text-zinc-800 animate-pulse" />
            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-4">
              <img src={user2?.avatar_url} className="w-24 h-24 md:w-40 md:h-40 rounded-full grayscale border-2 border-zinc-900" />
              <p className="text-[10px] font-black uppercase tracking-widest">@{user2?.login}</p>
            </motion.div>
          </div>
          <p className="text-3xl md:text-5xl font-bold italic text-white/90 max-w-3xl leading-tight">
            {introduction}
          </p>
        </motion.div>
      )}

      {/* Rounds */}
      <div className="space-y-[40vh]">
        {rounds.map((round: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase tracking-[0.6em] text-muted font-black">Round 0{i + 1}</span>
              <div className="h-[1px] flex-1 bg-zinc-900" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-white font-black italic">{round.title}</span>
            </div>
            
            <div className="grid md:grid-cols-1 gap-12">
              <p className="text-2xl md:text-4xl font-medium text-zinc-400 leading-relaxed italic">
                {round.analysis}
              </p>
              <div className="flex items-center gap-4 text-white">
                <Trophy size={16} className="text-yellow-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Round_Winner: <span className="text-white">{round.winner_of_round}</span>
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isStreaming && !verdict && (
        <div className="flex flex-col items-center gap-4 py-24">
          <Loader2 className="animate-spin text-zinc-800" />
          <p className="text-[10px] uppercase tracking-widest animate-pulse">Battle_Unfolding...</p>
        </div>
      )}

      {/* Final Result */}
      {verdict && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="min-h-screen flex flex-col items-center justify-center text-center space-y-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-black"
          >
            <Trophy size={48} />
          </motion.div>
          
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[1em] text-zinc-600 font-black">Technical Champion</span>
            <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter text-white">
              {overallWinner}
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl leading-relaxed italic">
            "{verdict}"
          </p>
        </motion.div>
      )}
    </div>
  );
}
