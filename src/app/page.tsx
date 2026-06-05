"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { RoastDisplay } from "@/components/roast/roast-display";
import { BattleDisplay } from "@/components/roast/battle-display";
import { PanelDisplay } from "@/components/roast/panel-display";
import { DependencyDisplay } from "@/components/roast/dependency-display";
import { WrappedDisplay } from "@/components/roast/wrapped-display";
import { GitHubUser, RoastVibe } from "@/types/github";
import { X, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const JUDGMENT_PERSONAS: Record<RoastVibe, { label: string; desc: string }> = {
  elitist: { label: "The Gatekeeper", desc: "A senior dev who hates everything you've ever built." },
  brogrammer: { label: "The Hype Beast", desc: "If it's not the latest framework, it's garbage." },
  chaos: { label: "The Chaos Gremlin", desc: "Someone who actually enjoys your spaghetti code." },
  recruiter: { label: "The Soul Crusher", desc: "Your career is over before it even started." },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");
  const [mode, setMode] = useState<"solo" | "battle" | "panel" | "dependency">("solo");
  const [vibe, setVibe] = useState<RoastVibe>("elitist");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [user2, setUser2] = useState<GitHubUser | null>(null);
  const [roastData, setRoastData] = useState<any>(null);
  const [showWrapped, setShowWrapped] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadingPool = [
    "Sighing at your commit history...",
    "Wondering why you chose this career...",
    "Looking for a single star in this graveyard...",
    "Asking myself if you even test this stuff...",
    "Finding evidence of pure desperation...",
    "Analyzing READMEs that contain more ambition than code...",
    "Checking if you've ever finished a single project...",
    "Counting how many frameworks you've abandoned...",
    "Calculating the carbon footprint of your bad logic...",
    "Wondering if you ever sleep, or just write bugs...",
  ];

  const roastMutation = useMutation({
    mutationFn: async ({ targetQuery, targetQuery2, targetVibe, type }: any) => {
      setUser(null);
      setUser2(null);
      setRoastData(null);
      setLoadingLogs(["Preparing to judge your life choices..."]);

      const logInterval = setInterval(() => {
        const randomMsg = loadingPool[Math.floor(Math.random() * loadingPool.length)];
        setLoadingLogs(prev => [...prev.slice(-10), randomMsg]);
      }, 1500);

      try {
        let url = `/api/roast?username=${targetQuery}&vibe=${targetVibe}`;
        if (type === "battle") url = `/api/battle?u1=${targetQuery}&u2=${targetQuery2}&vibe=${targetVibe}`;
        else if (type === "panel") url = `/api/roast?username=${targetQuery}&type=panel`;
        else if (type === "dependency") {
          const [u, r] = targetQuery.split("/");
          url = `/api/roast?username=${u}&repo=${r}&type=dependency`;
        } else if (type === "solo" && targetQuery.includes("/")) {
          const [u, r] = targetQuery.split("/");
          url = `/api/roast?username=${u}&repo=${r}&vibe=${targetVibe}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Something went wrong. Probably your code.");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Stream failure.");

        const decoder = new TextDecoder();
        let accumulatedRaw = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          if (chunk.startsWith("USER_DATA:")) {
            const lines = chunk.split("\n");
            try { setUser(JSON.parse(lines[0].replace("USER_DATA:", ""))); } catch (e) {}
            accumulatedRaw += lines.slice(1).join("\n");
          } else if (chunk.startsWith("USERS_DATA:")) {
            const lines = chunk.split("\n");
            try { 
              const { user1, user2 } = JSON.parse(lines[0].replace("USERS_DATA:", ""));
              setUser(user1);
              setUser2(user2);
            } catch (e) {}
            accumulatedRaw += lines.slice(1).join("\n");
          } else accumulatedRaw += chunk;

          try {
            if (accumulatedRaw.trim().endsWith("}")) {
              setRoastData(JSON.parse(accumulatedRaw));
            } else {
              const introMatch = accumulatedRaw.match(/"introduction":\s*"([^"]*)"?/);
              const titleMatch = accumulatedRaw.match(/"hearing_title":\s*"([^"]*)"?/);
              const bloatMatch = accumulatedRaw.match(/"bloat_score":\s*("([^"]*)"|(\d+))/);
              
              if (introMatch || titleMatch || bloatMatch) {
                setRoastData((prev: any) => {
                  const newData = { ...prev };
                  if (introMatch) newData.introduction = introMatch[1];
                  if (bloatMatch) {
                    newData.bloat_score = bloatMatch[2] || bloatMatch[3];
                  }
                  if (titleMatch) {
                    newData.hearing_title = titleMatch[1];
                    if (!newData.dialogue) newData.dialogue = [];
                  }
                  if (titleMatch) {
                    const dialogueSection = accumulatedRaw.split('"dialogue":')[1];
                    if (dialogueSection) {
                      const itemMatches = Array.from(dialogueSection.matchAll(/\{\s*"judge":\s*"([^"]*)",\s*"text":\s*"([^"]*)"/g));
                      if (itemMatches.length > (prev?.dialogue?.length || 0)) {
                        newData.dialogue = itemMatches.map(m => ({ judge: m[1], text: m[2] }));
                      }
                    }
                  }
                  return newData;
                });
              }
            }
          } catch (e) {}
        }
      } catch (err: any) {
        setLoadingLogs(prev => [...prev, `[ERR] ${err.message}`]);
        throw err;
      } finally {
        clearInterval(logInterval);
      }
    }
  });

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || roastMutation.isPending) return;

    if (mode === "dependency" && !query.includes("/")) {
      setLoadingLogs(["[ERR] Format must be owner/repo"]);
      return;
    }

    roastMutation.mutate({ targetQuery: query, targetQuery2: query2, targetVibe: vibe, type: mode });
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black bg-black text-white font-sans relative">
      {/* Sidebar Navigation - Only show when roast is active */}
      <AnimatePresence>
        {roastData && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-10 top-1/2 -translate-y-1/2 z-[60] hidden md:flex flex-col gap-6"
          >
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="group relative flex items-center justify-end gap-4">
                <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 border border-white/20`} />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-lg w-full p-8 border border-white/10 bg-black space-y-8">
              <div className="flex justify-between items-start">
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-black">Information</p>
                <button onClick={() => setShowInfo(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={18} /></button>
              </div>
              
              <div className="space-y-6 text-zinc-400 text-sm leading-relaxed font-medium">
                <p>This is a <span className="text-white font-bold">vibe-coded</span> experiment built for speed and sarcasm. Some things might break, and the logic might be unhinged. That's by design.</p>
                <p>Most GitHub profiles are abandoned graveyards of unfinished ideas. We're just here to provide the autopsy.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`${!roastMutation.isPending && roastData ? 'narrative-container' : 'max-w-6xl mx-auto px-10 h-[100dvh] flex flex-col justify-center overflow-hidden'}`}>
        {!roastMutation.isPending && !roastData && (
          <div className="space-y-[4vh] max-w-5xl">
            <header className="flex justify-between items-center">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} className="text-[10px] uppercase tracking-[0.6em] font-black italic">Legacy Code Autopsy</motion.p>
              <button onClick={() => setShowInfo(true)} className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 hover:text-white transition-colors font-bold">The Reality</button>
            </header>

            <div className="space-y-[6vh]">
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="space-y-4 text-left">
                  <div className="h-[12rem] md:h-[10rem] flex flex-col justify-end"> {/* Fixed height for headline */}
                    <h1 className="text-4xl md:text-[4.5rem] font-bold tracking-tighter leading-[1] italic">
                      {mode === "battle" ? "Two developers." : mode === "panel" ? "One profile." : mode === "dependency" ? "One repo." : "Most GitHub profiles"} <br />
                      <span className="text-zinc-800 not-italic">
                        {mode === "battle" ? "One winner." : mode === "panel" ? "Four judges." : mode === "dependency" ? "Zero hope." : "Are forgettable."}
                      </span>
                    </h1>
                  </div>
                  <p className="text-base md:text-lg text-zinc-500 leading-relaxed max-w-2xl font-medium">
                    Abandoned graveyards of unfinished ideas and a dozen frameworks. <br/> We're just here to tell you which one you are.
                  </p>
                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-4 text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600">
                  {[
                    { id: "solo", label: "Single Roast" },
                    { id: "battle", label: "Dual Battle" },
                    { id: "panel", label: "The Hearing" },
                    { id: "dependency", label: "Bloat Audit" }
                  ].map((m) => (
                    <button 
                      key={m.id}
                      onClick={() => setMode(m.id as any)}
                      className={`transition-all relative py-2 ${mode === m.id ? 'text-white' : 'hover:text-zinc-400'}`}
                    >
                      {m.label}
                      {mode === m.id && <motion.div layoutId="mode-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </motion.div>

              <div className="grid md:grid-cols-[1fr_300px] gap-16 items-end">
                <form onSubmit={handleRoast} className="space-y-8">
                   <div className="space-y-3 h-[180px] flex flex-col justify-start"> {/* Fixed height for inputs */}
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] text-zinc-700 font-black">
                          {mode === "battle" ? "First Victim" : mode === "dependency" ? "Target Repository" : "GitHub Username"}
                        </label>
                        <Input
                          type="text"
                          placeholder={mode === "dependency" ? "owner/repo" : "your-username"}
                          className="bg-transparent border-0 border-b border-zinc-900 rounded-none h-12 text-2xl md:text-3xl font-bold focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900 text-white"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          autoFocus
                        />
                      </div>

                      <AnimatePresence>
                        {mode === "battle" && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-3 pt-6"
                          >
                             <label className="text-[9px] uppercase tracking-[0.4em] text-zinc-700 font-black">Second Victim</label>
                             <Input
                               type="text"
                               placeholder="their-username"
                               className="bg-transparent border-0 border-b border-zinc-900 rounded-none h-12 text-2xl md:text-3xl font-bold focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900 text-white"
                               value={query2}
                               onChange={(e) => setQuery2(e.target.value)}
                             />
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>

                   <div className="pt-2">
                      <button type="submit" className="group flex items-center gap-6 text-[10px] uppercase tracking-[0.6em] font-black text-white w-fit">
                        <span>{mode === "battle" ? "Start the Fight" : mode === "panel" ? "Hear Judgment" : "Judge My GitHub"}</span>
                        <div className="w-12 h-[1px] bg-zinc-800 group-hover:w-16 group-hover:bg-white transition-all duration-700" />
                      </button>
                   </div>
                </form>

                <div className="space-y-6 hidden md:block text-left pb-1">
                   <p className="text-[9px] uppercase tracking-[0.4em] text-zinc-700 font-black italic">Choose your Judge</p>
                   <div className="flex flex-col gap-3">
                     {(Object.keys(JUDGMENT_PERSONAS) as RoastVibe[]).map((v) => (
                       <button
                         key={v}
                         type="button"
                         disabled={mode === "panel" || mode === "dependency"}
                         onClick={() => setVibe(v)}
                         className={`text-left group transition-all ${
                           vibe === v && mode !== "panel" && mode !== "dependency"
                             ? "text-white" 
                             : "text-zinc-700 hover:text-zinc-500 disabled:opacity-20"
                         }`}
                       >
                         <p className="text-[10px] font-bold uppercase tracking-[0.2em]">{JUDGMENT_PERSONAS[v].label}</p>
                         <p className="text-[9px] mt-1 italic leading-snug text-zinc-600 group-hover:text-zinc-400 transition-colors">
                           {JUDGMENT_PERSONAS[v].desc}
                         </p>
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {roastMutation.isPending && (
          <div className="h-screen flex flex-col items-center justify-center p-6 text-center space-y-12">
            <div className="space-y-4">
               <div className="flex justify-center mb-12"><div className="w-8 h-[1px] bg-white animate-pulse" /></div>
               <div className="h-20 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.p key={loadingLogs[loadingLogs.length - 1]} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-2xl md:text-3xl font-medium italic text-zinc-400">{loadingLogs[loadingLogs.length - 1]}</motion.p>
                </AnimatePresence>
               </div>
            </div>
          </div>
        )}

        {!roastMutation.isPending && roastData && (
          <div className="space-y-32">
            {!user2 && user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} whileHover={{ opacity: 1 }} className="flex items-center gap-4 transition-all">
                <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full grayscale" />
                <span className="text-[10px] font-black uppercase text-white">@{user.login}</span>
              </motion.div>
            )}
            
            <div className="relative">
              {user2 ? (
                <BattleDisplay battle={roastData} user1={user || undefined} user2={user2} isStreaming={roastMutation.isPending} />
              ) : mode === "dependency" ? (
                <DependencyDisplay data={roastData} isStreaming={roastMutation.isPending} />
              ) : roastData.dialogue ? (
                <PanelDisplay panelData={roastData} user={user || undefined} isStreaming={roastMutation.isPending} />
              ) : (
                <RoastDisplay roast={roastData} user={user || undefined} isStreaming={roastMutation.isPending} vibe={vibe} onShowWrapped={() => setShowWrapped(true)} />
              )}
            </div>

            {!roastMutation.isPending && (
              <div className="pt-32 pb-24 text-center">
                <button onClick={() => { setRoastData(null); setUser(null); setUser2(null); setQuery(""); setQuery2(""); roastMutation.reset(); }} className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-700 hover:text-white transition-colors">Start Again</button>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {showWrapped && (
          <WrappedDisplay 
            user={user || undefined} 
            roast={roastData} 
            vibe={vibe} 
            onClose={() => setShowWrapped(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
