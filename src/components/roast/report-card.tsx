"use client";

import { forwardRef } from "react";
import { GitHubUser } from "@/types/github";
import { Zap } from "lucide-react";

interface ReportCardProps {
  user?: GitHubUser;
  roast: any;
  vibe: string;
}

export const ReportCard = forwardRef<HTMLDivElement, ReportCardProps>(
  ({ user, roast, vibe }, ref) => {
    const grade = roast?.grade || "F";
    const verdict = roast?.verdict || "No judgment rendered.";
    const username = user?.login || "Unknown_Subject";

    return (
      <div
        ref={ref}
        className="fixed top-0 left-0 w-[1080px] h-[1350px] bg-black p-20 flex flex-col justify-between text-white font-sans overflow-hidden -z-[500] opacity-0 pointer-events-none"
      >
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 via-black to-zinc-900/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-3xl rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-800/10 blur-3xl rounded-full -ml-48 -mb-48" />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Zap size={32} className="fill-white" />
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">RoastMyGitHub</h2>
            </div>
            <p className="text-zinc-600 text-xl font-bold tracking-[0.4em] uppercase">Technical_Audit_v2.0</p>
          </div>
          <div className="flex items-center gap-6">
            {user?.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={username} 
                crossOrigin="anonymous"
                className="w-24 h-24 rounded-full border-4 border-zinc-900 grayscale"
              />
            )}
            <div className="text-right">
              <p className="text-zinc-500 text-sm font-black uppercase tracking-widest mb-1">Identified_As:</p>
              <p className="text-3xl font-black uppercase italic">@{username}</p>
            </div>
          </div>
        </div>

        {/* Grade Section */}
        <div className="relative z-10 flex flex-col items-center justify-center py-20">
          <p className="text-zinc-700 text-2xl font-black uppercase tracking-[1em] mb-8">Overall_Technical_Grade</p>
          <div className="relative">
            <h1 className="text-[450px] font-black leading-none tracking-tighter italic text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              {grade}
            </h1>
            <div className="absolute inset-0 flex items-center justify-center mix-blend-difference opacity-20">
               <h1 className="text-[460px] font-black leading-none tracking-tighter italic text-zinc-900 blur-sm">
                {grade}
              </h1>
            </div>
          </div>
        </div>

        {/* Verdict Section */}
        <div className="relative z-10 space-y-12">
          <div className="h-1 w-full bg-zinc-900 relative">
             <div className="absolute inset-0 bg-white/20 w-1/3" />
          </div>
          <div className="space-y-6">
            <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.5em]">The_Final_Verdict</p>
            <p className="text-5xl font-black italic uppercase leading-tight text-white/90 break-words">
              {verdict}
              <span className="text-zinc-800 not-italic">.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end border-t border-zinc-900 pt-12">
          <div className="space-y-2">
             <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Persona_Protocol:</p>
             <p className="text-zinc-400 text-xl font-black uppercase tracking-widest italic">{vibe}</p>
          </div>
          <div className="text-right space-y-2">
            <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Verify_At:</p>
            <p className="text-white text-xl font-bold tracking-tight lowercase">roastmygithub.com</p>
          </div>
        </div>
      </div>
    );
  }
);

ReportCard.displayName = "ReportCard";
