"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { RoastDisplay } from "@/components/roast/roast-display";
import { BattleDisplay } from "@/components/roast/battle-display";
import { PanelDisplay } from "@/components/roast/panel-display";
import { GitHubUser, RoastVibe } from "@/types/github";
import { Info, X, Zap, Terminal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const VIBE_CONFIG: Record<RoastVibe, { label: string; desc: string }> = {
  elitist: { label: "Elitist", desc: "Condescending snob." },
  brogrammer: { label: "Brogrammer", desc: "Obsessed with scale." },
  chaos: { label: "Chaos", desc: "Spaghetti enthusiast." },
  recruiter: { label: "Recruiter", desc: "Soul-crushing HR." },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [query2, setQuery2] = useState("");
  const [mode, setMode] = useState<"solo" | "battle" | "panel">("solo");
  const [vibe, setVibe] = useState<RoastVibe>("elitist");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [user2, setUser2] = useState<GitHubUser | null>(null);
  const [roastData, setRoastData] = useState<any>(null);
  const [loadingLogs, setLoadingLogs] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadingPool = [
    "Reading commit history...",
    "Judging architectural decisions...",
    "Finding evidence of chaos...",
    "Reviewing poorly named variables...",
    "Questioning life choices...",
    "Analyzing README-to-code ratio...",
    "Scanning for 'TODO' comments...",
    "Checking for hardcoded secrets...",
    "Evaluating commit frequency...",
    "Comparing against best practices...",
    "Calculating technical debt...",
    "Detecting copy-pasted StackOverflow code...",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loadingLogs]);

  const roastMutation = useMutation({
    mutationFn: async ({ 
      targetQuery, 
      targetQuery2, 
      targetVibe, 
      type 
    }: { 
      targetQuery: string; 
      targetQuery2?: string; 
      targetVibe: RoastVibe; 
      type: "solo" | "battle" | "panel" 
    }) => {
      setUser(null);
      setUser2(null);
      setRoastData(null);
      setLoadingLogs(["[SYS] Initializing " + (type === "battle" ? "Combat_Protocol" : type === "panel" ? "Hearing_Protocol" : "Judgment_Protocol") + "..."]);

      const logInterval = setInterval(() => {
        const randomMsg = loadingPool[Math.floor(Math.random() * loadingPool.length)];
        setLoadingLogs(prev => [...prev.slice(-10), `[LOG] ${randomMsg}`]);
      }, 1500);

      try {
        let url = `/api/roast?username=${targetQuery}&vibe=${targetVibe}`;
        
        if (type === "battle") {
          url = `/api/battle?u1=${targetQuery}&u2=${targetQuery2}&vibe=${targetVibe}`;
        } else if (type === "panel") {
          url = `/api/roast?username=${targetQuery}&type=panel`;
        } else if (type === "solo" && targetQuery.includes("/")) {
          const [username, repo] = targetQuery.split("/");
          url = `/api/roast?username=${username}&repo=${repo}&vibe=${targetVibe}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to fetch roast");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("ReadableStream not supported");

        const decoder = new TextDecoder();
        let accumulatedRaw = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          if (chunk.startsWith("USER_DATA:")) {
            const lines = chunk.split("\n");
            const userDataStr = lines[0].replace("USER_DATA:", "");
            try { setUser(JSON.parse(userDataStr)); } catch (e) { }
            accumulatedRaw += lines.slice(1).join("\n");
          } else if (chunk.startsWith("USERS_DATA:")) {
            const lines = chunk.split("\n");
            const userDataStr = lines[0].replace("USERS_DATA:", "");
            try { 
              const { user1, user2 } = JSON.parse(userDataStr);
              setUser(user1);
              setUser2(user2);
            } catch (e) { }
            accumulatedRaw += lines.slice(1).join("\n");
          } else {
            accumulatedRaw += chunk;
          }

          try {
            if (accumulatedRaw.trim().endsWith("}")) {
              const data = JSON.parse(accumulatedRaw);
              setRoastData(data);
            } else {
              // Partial parsing for better UX
              const introMatch = accumulatedRaw.match(/"introduction":\s*"([^"]*)"?/);
              const titleMatch = accumulatedRaw.match(/"hearing_title":\s*"([^"]*)"?/);
              
              if (introMatch || titleMatch) {
                setRoastData((prev: any) => {
                  const newData = { ...prev };
                  if (introMatch) newData.introduction = introMatch[1];
                  if (titleMatch) {
                    newData.hearing_title = titleMatch[1];
                    // Ensure we have a dialogue array to trigger PanelDisplay
                    if (!newData.dialogue) newData.dialogue = [];
                  }
                  
                  // Try to extract dialogue items partially
                  if (titleMatch) {
                    const dialogueSection = accumulatedRaw.split('"dialogue":')[1];
                    if (dialogueSection) {
                      const items = [];
                      const itemMatches = dialogueSection.matchAll(/\{\s*"judge":\s*"([^"]*)",\s*"text":\s*"([^"]*)"/g);
                      for (const match of itemMatches) {
                        items.push({ judge: match[1], text: match[2] });
                      }
                      if (items.length > (prev?.dialogue?.length || 0)) {
                        newData.dialogue = items;
                      }
                    }
                  }
                  return newData;
                });
              }
            }
          } catch (e) { }
        }
      } finally {
        clearInterval(logInterval);
      }
    }
  });

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || roastMutation.isPending) return;
    if (mode === "battle" && !query2) return;
    roastMutation.mutate({ 
      targetQuery: query, 
      targetQuery2: query2, 
      targetVibe: vibe,
      type: mode 
    });
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black overflow-hidden bg-black text-white font-sans">
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-zinc-950 border border-zinc-900 p-12 space-y-12 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full -mr-32 -mt-32" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white">
                    <Zap size={24} className="fill-white" />
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">System_Manifesto</h2>
                  </div>
                  <div className="space-y-6 text-zinc-400 text-lg leading-relaxed font-medium">
                    <p>
                      RoastMyGitHub is a high-fidelity experiment in <span className="text-white font-bold italic">Cinematic Technical Auditing</span>.
                    </p>
                    <p>
                      Built using 100% Vibe Coding, this platform bypasses traditional logic in favor of pure intent and AI-driven narrative. Every roast is a unique, data-backed teardown of your technical existence.
                    </p>
                    <div className="pt-6 border-t border-zinc-900 grid grid-cols-2 gap-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Core_Engine</p>
                          <p className="text-sm text-zinc-300 font-bold uppercase tracking-tighter italic">GPT-4o_Optimized</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">UI_Framework</p>
                          <p className="text-sm text-zinc-300 font-bold uppercase tracking-tighter italic">Framer_Motion_v11</p>
                       </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-all group">
                  <X size={24} className="text-zinc-500 group-hover:text-white group-hover:rotate-90 transition-all" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`${roastData ? 'narrative-container' : 'max-w-4xl mx-auto px-6 h-screen flex flex-col justify-center overflow-hidden'}`}>
        {!roastMutation.isPending && !roastData && (
          <div className="space-y-12">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] uppercase tracking-[0.6em] text-muted font-black">Project_Core_V2.5</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-600 text-sm italic leading-relaxed font-medium">Every repository tells a story. Most are tragedies.</motion.p>
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} whileHover={{ opacity: 1 }} onClick={() => setShowInfo(true)} className="p-2 border border-zinc-900 rounded-full hover:border-white transition-all"><Info size={14} /></motion.button>
            </div>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
                <h1 className="text-7xl md:text-[8.5rem] font-black tracking-tighter text-white leading-[0.85] uppercase italic">
                  {mode === "battle" ? "Dual" : mode === "panel" ? "Panel" : "Roast"} <br /> {mode === "battle" ? "Combat" : mode === "panel" ? "Hearing" : "GitHub"}<span className="text-zinc-900 not-italic">.</span>
                </h1>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-8 border-b border-zinc-900 pb-2 max-w-fit">
                <button 
                  onClick={() => setMode("solo")}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${mode === "solo" ? 'text-white' : 'text-zinc-700 hover:text-zinc-500'}`}
                >
                  Solo_Judgment
                  {mode === "solo" && <motion.div layoutId="mode-underline" className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-white" />}
                </button>
                <button 
                  onClick={() => setMode("battle")}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${mode === "battle" ? 'text-white' : 'text-zinc-700 hover:text-zinc-500'}`}
                >
                  Dual_Combat
                  {mode === "battle" && <motion.div layoutId="mode-underline" className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-white" />}
                </button>
                <button 
                  onClick={() => setMode("panel")}
                  className={`text-[10px] font-black uppercase tracking-[0.4em] transition-all relative ${mode === "panel" ? 'text-white' : 'text-zinc-700 hover:text-zinc-500'}`}
                >
                  Panel_Hearing
                  {mode === "panel" && <motion.div layoutId="mode-underline" className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-white" />}
                </button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="grid md:grid-cols-2 gap-16 items-start text-white">
              <form onSubmit={handleRoast} className="space-y-8">
                <div className="space-y-6">
                  <div className="group space-y-3">
                    <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">{mode === "battle" ? "Subject_01:" : "Identify_Subject:"}</p>
                    <Input
                      type="text"
                      placeholder="username or owner/repo"
                      className="bg-transparent border-0 border-b border-zinc-900 rounded-none h-12 text-2xl font-bold focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900 text-white"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                    />
                  </div>

                  {mode === "battle" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="group space-y-3">
                      <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Subject_02:</p>
                      <Input
                        type="text"
                        placeholder="username"
                        className="bg-transparent border-0 border-b border-zinc-900 rounded-none h-12 text-2xl font-bold focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900 text-white"
                        value={query2}
                        onChange={(e) => setQuery2(e.target.value)}
                      />
                    </motion.div>
                  )}
                </div>

                <button type="submit" className="text-[10px] uppercase tracking-[0.6em] font-black text-zinc-500 hover:text-white transition-all flex items-center gap-4 group pt-2">
                  <span>{mode === "battle" ? "Start_Battle" : mode === "panel" ? "Summon_Panel" : "Initiate_Judgment"}</span>
                  <div className="w-12 h-[1px] bg-zinc-900 group-hover:w-20 group-hover:bg-white transition-all duration-700" />
                </button>
              </form>

              <div className="space-y-6">
                <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em]">Persona_Protocol:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(VIBE_CONFIG) as RoastVibe[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      disabled={mode === "panel"}
                      onClick={() => setVibe(v)}
                      className={`text-left p-4 border transition-all duration-500 group relative overflow-hidden ${
                        vibe === v && mode !== "panel"
                          ? "border-white/20 bg-white/5" 
                          : "border-zinc-900 text-zinc-600 hover:border-zinc-800 disabled:opacity-30 disabled:hover:border-zinc-900"
                      }`}
                    >
                      {vibe === v && mode !== "panel" && <motion.div layoutId="vibe-bg" className="absolute inset-0 bg-white/5 -z-10" />}
                      <div className="flex justify-between items-center text-white">
                        <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${vibe === v && mode !== "panel" ? 'text-white' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                          {VIBE_CONFIG[v].label}
                        </p>
                      </div>
                      <p className={`text-[9px] mt-1 leading-relaxed font-medium transition-colors ${vibe === v && mode !== "panel" ? 'text-zinc-500' : 'text-zinc-800'}`}>
                        {VIBE_CONFIG[v].desc}
                      </p>
                    </button>
                  ))}
                  {mode === "panel" && (
                     <div className="col-span-2 p-4 border border-white/10 bg-white/5 rounded-sm">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Panel_Mode_Active</p>
                        <p className="text-[9px] text-zinc-500 leading-relaxed">All judges will be present. Selection protocol bypassed.</p>
                     </div>
                  )}
                </div>
              </div>
            </motion.div>

            {roastMutation.isError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 border border-red-950 bg-red-500/5 max-w-fit">
                <p className="text-red-500 text-[9px] font-mono uppercase tracking-[0.3em] font-black">Error_Signal: {(roastMutation.error as Error).message}</p>
              </motion.div>
            )}
          </div>
        )}

        {roastMutation.isPending && !roastData?.introduction && (
          <div className="h-screen flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg space-y-6">
              <div className="flex items-center gap-3 text-white">
                <Terminal size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processing_Data_Stream</span>
              </div>
              <div 
                ref={scrollRef}
                className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm h-64 overflow-y-auto font-mono text-[11px] space-y-2 scrollbar-none"
              >
                {loadingLogs.map((log, i) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={i} 
                    className={log.startsWith("[SYS]") ? "text-white" : "text-zinc-600"}
                  >
                    <span className="opacity-30 mr-2">{new Date().toLocaleTimeString()}</span>
                    {log}
                  </motion.p>
                ))}
                <div className="w-1.5 h-4 bg-white animate-pulse inline-block align-middle ml-1" />
              </div>
            </div>
          </div>
        )}

        {roastData && (
          <div className="space-y-32">
            {!user2 && user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full grayscale" />
                <div className="flex flex-col"><span className="text-[10px] font-black uppercase text-white">@{user.login}</span></div>
              </motion.div>
            )}
            
            {user2 ? (
              <BattleDisplay battle={roastData} user1={user || undefined} user2={user2} isStreaming={roastMutation.isPending} />
            ) : roastData.dialogue ? (
              <PanelDisplay panelData={roastData} user={user || undefined} isStreaming={roastMutation.isPending} />
            ) : (
              <RoastDisplay roast={roastData} user={user || undefined} isStreaming={roastMutation.isPending} vibe={vibe} />
            )}

            {!roastMutation.isPending && (
              <div className="pt-32 pb-24 text-center">
                <button onClick={() => { setRoastData(null); setUser(null); setUser2(null); setQuery(""); setQuery2(""); roastMutation.reset(); }} className="text-[10px] uppercase tracking-[0.4em] font-black text-muted hover:text-white transition-colors">Reset_Narrative</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
