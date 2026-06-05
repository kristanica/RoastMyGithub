"use client";

import { forwardRef } from "react";
import { GitHubUser } from "@/types/github";
import { Zap } from "lucide-react";

interface ReportCardProps {
  user?: GitHubUser;
  roast: any;
  vibe: string;
}

const THEMES: Record<string, { accent: string; bg: string; text: string; label: string }> = {
  elitist: { accent: "white", bg: "black", text: "white", label: "ELITIST_PROTOCOL" },
  brogrammer: { accent: "#00f2ff", bg: "#000", text: "white", label: "BRO_TECH_V1" },
  chaos: { accent: "#ff003c", bg: "#000", text: "white", label: "CHAOS_ENGINE" },
  recruiter: { accent: "#3b82f6", bg: "#050505", text: "white", label: "HR_AUDIT_TOOL" },
};

export const ReportCard = forwardRef<HTMLDivElement, ReportCardProps>(
  ({ user, roast, vibe }, ref) => {
    const theme = THEMES[vibe] || THEMES.elitist;
    const grade = roast?.grade || "F";
    const verdict = roast?.verdict || "No judgment rendered.";
    const dnaTraits = roast?.dna_traits || [];
    const username = user?.login || "Unknown_Subject";

    return (
      <div
        ref={ref}
        className="fixed top-0 left-0 w-[1080px] h-[1350px] p-24 flex flex-col justify-between text-white font-sans overflow-hidden -z-[500] opacity-0 pointer-events-none"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Background Textures */}
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none" 
             style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }} />
        
        {/* Dynamic Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] blur-[150px] rounded-full opacity-20 -mr-96 -mt-96" 
             style={{ backgroundColor: theme.accent }} />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] blur-[120px] rounded-full opacity-10 -ml-48 -mb-48" 
             style={{ backgroundColor: theme.accent }} />

        {/* Top Section: Branding & Identity */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <Zap size={48} style={{ color: theme.accent, fill: theme.accent }} />
              <div className="h-10 w-[2px] bg-zinc-800" />
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">RoastMyGitHub</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                {theme.label}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Audit_Protocol_v2.0</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-6">
             <div className="relative">
                <img 
                  src={user?.avatar_url} 
                  alt={username} 
                  crossOrigin="anonymous"
                  className="w-32 h-32 rounded-2xl border-2 grayscale filter contrast-125"
                  style={{ borderColor: theme.accent }}
                />
                <div className="absolute -bottom-3 -right-3 px-4 py-2 bg-white text-black font-black text-xs uppercase italic tracking-widest skew-x-[-10deg]">
                  @{username}
                </div>
             </div>
          </div>
        </div>

        {/* Center Section: The Grade (Asymmetric Layout) */}
        <div className="relative z-10 flex items-center gap-12 py-12">
          <div className="flex-1 flex flex-col items-start gap-8">
             <div className="space-y-2">
                <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.5em]">Analysis_Result</p>
                <h3 className="text-6xl font-black italic uppercase tracking-tighter leading-none">Overall <br/> Technical <br/> Status<span style={{ color: theme.accent }}>.</span></h3>
             </div>
             
             <div className="grid grid-cols-1 gap-8 w-full max-w-sm">
                {dnaTraits.map((trait: any, i: number) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{trait.name}</p>
                      <p className="text-sm font-black italic" style={{ color: theme.accent }}>{trait.value}%</p>
                    </div>
                    <div className="h-[2px] w-full bg-zinc-900 relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0" style={{ width: `${trait.value}%`, backgroundColor: theme.accent }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="relative flex items-center justify-center pr-12">
            <h1 
              className="text-[650px] font-black leading-none tracking-tighter italic drop-shadow-[0_0_100px_rgba(255,255,255,0.05)] select-none"
              style={{ color: theme.accent }}
            >
              {grade}
            </h1>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 mix-blend-overlay">
               <h1 className="text-[680px] font-black leading-none tracking-tighter italic blur-xl" style={{ color: theme.accent }}>
                {grade}
              </h1>
            </div>
          </div>
        </div>

        {/* Bottom Section: The Verdict */}
        <div className="relative z-10 space-y-12">
          <div className="space-y-8 max-w-5xl">
            <div className="flex items-center gap-6">
              <span className="text-zinc-600 text-xs font-black uppercase tracking-[0.8em]">Final_Judgment</span>
              <div className="h-[1px] flex-1 bg-zinc-900" />
            </div>
            <p className="text-6xl font-black italic uppercase leading-[0.95] text-white break-words drop-shadow-2xl">
              "{verdict}"
            </p>
          </div>

          <div className="flex justify-between items-end pt-12 border-t border-zinc-900">
             <div className="flex items-center gap-12">
                <div className="space-y-2">
                  <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Verify_Authenticity</p>
                  <p className="text-white text-2xl font-bold tracking-tighter lowercase">roastmygithub.com</p>
                </div>
                <div className="h-10 w-[1px] bg-zinc-900" />
                <div className="space-y-2">
                  <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">Protocol</p>
                  <p className="text-zinc-500 text-xl font-black uppercase tracking-widest italic">Vibe_v2.0</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-zinc-800 text-[8px] font-black uppercase tracking-[1em] mb-2">Automated_Technical_Audit</p>
                <div className="flex gap-1 justify-end">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-6 bg-zinc-900" />)}
                   <div className="w-6 h-6" style={{ backgroundColor: theme.accent }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }
);

ReportCard.displayName = "ReportCard";
