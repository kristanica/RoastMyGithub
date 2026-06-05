"use client";

import { forwardRef } from "react";
import { GitHubUser } from "@/types/github";

interface ReportCardProps {
  user?: GitHubUser;
  roast: any;
  vibe: string;
}

const THEMES: Record<string, { accent: string; bg: string; text: string; label: string }> = {
  elitist: { accent: "white", bg: "black", text: "white", label: "The Gatekeeper" },
  brogrammer: { accent: "#FFFFFF", bg: "#000", text: "white", label: "The Hype Beast" },
  chaos: { accent: "#FFFFFF", bg: "#000", text: "white", label: "The Chaos Gremlin" },
  recruiter: { accent: "#FFFFFF", bg: "#050505", text: "white", label: "The Soul Crusher" },
};

export const ReportCard = forwardRef<HTMLDivElement, ReportCardProps>(
  ({ user, roast, vibe }, ref) => {
    const theme = THEMES[vibe] || THEMES.elitist;
    const grade = roast?.grade || "F";
    const verdict = roast?.verdict || "No judgment rendered.";
    const dnaTraits = roast?.dna_traits || [];
    const username = user?.login || "Unknown User";

    return (
      <div
        ref={ref}
        className="fixed top-0 left-0 w-[1080px] h-[1350px] p-24 flex flex-col justify-between text-white font-sans overflow-hidden -z-[500] opacity-0 pointer-events-none"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Editorial Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/[0.02] blur-[150px] rounded-full -mr-96 -mt-96" />
        
        {/* Top Section */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-8">
             <h2 className="text-4xl font-bold tracking-tighter uppercase italic leading-none">Judgment.</h2>
             <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Legacy Code Autopsy</span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Audited by {theme.label}</span>
             </div>
          </div>
          
          <div className="flex flex-col items-end gap-6">
             <div className="relative">
                <img 
                  src={user?.avatar_url} 
                  alt={username} 
                  crossOrigin="anonymous"
                  className="w-40 h-40 rounded-full border border-white/10 grayscale"
                />
                <div className="absolute -bottom-2 right-0 px-6 py-2 bg-white text-black font-black text-sm uppercase italic tracking-widest">
                  @{username}
                </div>
             </div>
          </div>
        </div>

        {/* Center Section */}
        <div className="relative z-10 flex flex-col items-start gap-20">
           <div className="space-y-4">
              <div className="h-[1px] w-32 bg-white/20" />
              <h3 className="text-8xl font-bold italic uppercase tracking-tighter leading-none">Technical <br/> Integrity<span className="text-zinc-800">.</span></h3>
           </div>
           
           <div className="grid grid-cols-1 gap-12 w-full max-w-md">
              {dnaTraits.map((trait: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{trait.name}</p>
                    <p className="text-xl font-bold italic">{trait.value}%</p>
                  </div>
                  <div className="h-[1px] w-full bg-zinc-900 relative">
                    <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${trait.value}%` }} />
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* The Grade - Absolute Positioned Background */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] select-none">
           <h1 className="text-[900px] font-black leading-none tracking-tighter italic">{grade}</h1>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10 space-y-12">
          <div className="space-y-10">
            <div className="relative flex items-center">
               <div className="h-[1px] w-full bg-white/10" />
               <span className="absolute left-0 bg-black pr-6 text-[10px] uppercase tracking-[0.8em] font-black text-zinc-600">Final Verdict</span>
            </div>
            <p className="text-7xl font-bold italic uppercase leading-[1] text-white break-words">
              "{verdict}"
            </p>
          </div>

          <div className="flex justify-between items-end pt-16 border-t border-zinc-900">
             <p className="text-white text-3xl font-bold tracking-tighter lowercase">roastmygithub.com</p>
             <div className="text-right space-y-2">
                <p className="text-zinc-800 text-[10px] font-black uppercase tracking-[0.6em]">Judgment Rendered Permanently</p>
                <div className="h-[1px] w-24 bg-zinc-900 ml-auto" />
             </div>
          </div>
        </div>
      </div>
    );
  }
);

ReportCard.displayName = "ReportCard";
