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
        className="fixed top-0 left-0 w-[1080px] h-[1350px] p-20 flex flex-col justify-between text-white font-sans overflow-hidden -z-[500] opacity-0 pointer-events-none"
        style={{ backgroundColor: theme.bg }}
      >
        {/* Theme-specific Overlays */}
        {vibe === 'recruiter' && (
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        )}
        {vibe === 'chaos' && (
          <div className="absolute inset-0 opacity-10 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 via-transparent to-zinc-900/10" />

        {/* Header */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Zap size={32} style={{ color: theme.accent, fill: theme.accent }} />
              <h2 className="text-4xl font-black tracking-tighter uppercase italic">RoastMyGitHub</h2>
            </div>
            <p className="text-zinc-600 text-xl font-bold tracking-[0.4em] uppercase">{theme.label}</p>
          </div>
          <div className="flex items-center gap-6">
            {user?.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={username} 
                crossOrigin="anonymous"
                className="w-24 h-24 rounded-full border-4 grayscale shadow-2xl"
                style={{ borderColor: theme.accent }}
              />
            )}
            <div className="text-right">
              <p className="text-zinc-500 text-sm font-black uppercase tracking-widest mb-1">Subject:</p>
              <p className="text-3xl font-black uppercase italic">@{username}</p>
            </div>
          </div>
        </div>

        {/* DNA Traits Section */}
        <div className="relative z-10 grid grid-cols-3 gap-12 mt-12">
          {dnaTraits.map((trait: any, i: number) => (
            <div key={i} className="space-y-4">
              <div className="flex justify-between items-end">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{trait.name}</p>
                <p className="text-xl font-black italic" style={{ color: theme.accent }}>{trait.value}%</p>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 relative overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 transition-all duration-1000"
                  style={{ width: `${trait.value}%`, backgroundColor: theme.accent }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Grade Section */}
        <div className="relative z-10 flex flex-col items-center justify-center py-12">
          <div className="relative">
            <h1 
              className="text-[520px] font-black leading-none tracking-tighter italic drop-shadow-[0_0_80px_rgba(255,255,255,0.05)]"
              style={{ color: theme.accent }}
            >
              {grade}
            </h1>
          </div>
        </div>

        {/* Verdict Section */}
        <div className="relative z-10 space-y-12">
          <div className="h-[2px] w-full bg-zinc-900 relative">
             <div className="absolute inset-0 w-1/4" style={{ backgroundColor: theme.accent }} />
          </div>
          <div className="space-y-6">
            <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.5em]">The_Final_Verdict</p>
            <p className="text-5xl font-black italic uppercase leading-tight text-white/90 break-words">
              {verdict}
              <span style={{ color: theme.accent }} className="not-italic">.</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between items-end border-t border-zinc-900 pt-12">
          <div className="space-y-2 text-zinc-500">
             <p className="text-[10px] font-black uppercase tracking-widest">Verify_Authenticity:</p>
             <p className="text-white text-xl font-bold tracking-tight lowercase">roastmygithub.com</p>
          </div>
          <div className="text-right">
             <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest mb-1">Generated_Via:</p>
             <p className="text-zinc-400 text-xl font-black uppercase tracking-widest italic">Vibe_Protocol_v2.0</p>
          </div>
        </div>
      </div>
    );
  }
);

ReportCard.displayName = "ReportCard";
