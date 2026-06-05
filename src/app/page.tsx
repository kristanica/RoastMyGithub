"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { RoastDisplay } from "@/components/roast/roast-display";
import { GitHubUser } from "@/types/github";
import { Info, X, Zap, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [roastData, setRoastData] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const loadingMessages = [
    "Reading commit history...",
    "Judging architectural decisions...",
    "Finding evidence of chaos...",
    "Reviewing poorly named variables...",
    "Questioning life choices...",
  ];

  const roastMutation = useMutation({
    mutationFn: async (targetQuery: string) => {
      setUser(null);
      setRoastData(null);
      
      // Cycle through loading messages
      let msgIndex = 0;
      setLoadingStep(loadingMessages[0]);
      const msgInterval = setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setLoadingStep(loadingMessages[msgIndex]);
      }, 2500);

      try {
        let url = `/api/roast?username=${targetQuery}`;
        if (targetQuery.includes("/")) {
          const [username, repo] = targetQuery.split("/");
          url = `/api/roast?username=${username}&repo=${repo}`;
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
            try { setUser(JSON.parse(userDataStr)); } catch (e) {}
            accumulatedRaw += lines.slice(1).join("\n");
          } else {
            accumulatedRaw += chunk;
          }

          try {
            if (accumulatedRaw.trim().endsWith("}")) {
              const data = JSON.parse(accumulatedRaw);
              setRoastData(data);
            } else {
              const introMatch = accumulatedRaw.match(/"introduction":\s*"([^"]*)"?/);
              if (introMatch) {
                setRoastData((prev: any) => ({ ...prev, introduction: introMatch[1] }));
              }
            }
          } catch (e) {}
        }
      } finally {
        clearInterval(msgInterval);
      }
    }
  });

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || roastMutation.isPending) return;
    roastMutation.mutate(query);
  };

  return (
    <div className="min-h-screen selection:bg-white selection:text-black">
      {/* Vibe Coded Info Overlay */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full space-y-12"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white">
                    <Zap size={20} className="fill-white" />
                    <h2 className="text-2xl font-bold tracking-tighter uppercase italic">Vibe_Protocol_Activated</h2>
                  </div>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    This website was built using <span className="text-white font-bold">100% Vibe Coding</span>. 
                    Zero manual logic, zero design specs—just pure intent, natural language, 
                    and a slightly unhinged AI agent fueled by the vibe.
                  </p>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} className="text-zinc-500 hover:text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Methodology</span>
                  <p className="text-sm text-zinc-500 italic">Prompt-driven architecture. Aesthetic by consensus.</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-black">Philosophy</span>
                  <p className="text-sm text-zinc-500 italic">If the vibes are off, the code is wrong.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="narrative-container">
        {/* Scenario 1: The Cinematic Entry */}
        {!roastMutation.isPending && !roastData && (
          <div className="min-h-[80vh] flex flex-col justify-center">
            <div className="flex justify-between items-start mb-12">
              <div className="space-y-2">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                  className="text-xs uppercase tracking-[0.6em] text-muted font-black"
                >
                  Project_Core_V2
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-zinc-500 italic font-medium"
                >
                  Every repository tells a story. Most are tragedies.
                </motion.p>
              </div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                whileHover={{ opacity: 1 }}
                onClick={() => setShowInfo(true)}
                className="p-2 border border-zinc-800 rounded-full hover:border-white transition-all duration-500"
              >
                <Info size={16} />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
            >
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-white leading-[0.85] mb-16">
                Roast <br />
                My GitHub<span className="text-zinc-800">.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="max-w-md"
            >
              <form onSubmit={handleRoast} className="space-y-8">
                <div className="group">
                  <p className="text-zinc-500 mb-4 font-medium">Identify the subject of analysis:</p>
                  <Input
                    type="text"
                    placeholder="Username_or_Repo_Path"
                    className="bg-transparent border-0 border-b-2 border-zinc-800 rounded-none h-16 text-3xl font-medium focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex items-center justify-between pt-4">
                  <button
                    type="submit"
                    className="text-[10px] uppercase tracking-[0.4em] font-black text-muted hover:text-white transition-colors flex items-center gap-4 group"
                  >
                    <span>Initiate Narrative</span>
                    <div className="w-12 h-[1px] bg-zinc-800 group-hover:w-20 group-hover:bg-white transition-all duration-500" />
                  </button>
                </div>
              </form>
              {roastMutation.isError && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-red-500 text-xs font-mono uppercase tracking-widest"
                >
                  Analysis_Error: {(roastMutation.error as Error).message}
                </motion.p>
              )}
            </motion.div>
          </div>
        )}

        {/* Scenario 2: The Narrative Pause (Loading) */}
        {roastMutation.isPending && !roastData?.introduction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[60vh] flex flex-col items-center justify-center text-center"
          >
            <p className="text-2xl italic text-muted animate-pulse font-medium">
              {loadingStep}
            </p>
          </motion.div>
        )}

        {/* Scenario 3: The Story Reveal */}
        {roastData && (
          <div className="space-y-32">
            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-6 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000"
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Analyzing: @{user.login}</span>
                  <span className="text-[10px] text-muted uppercase tracking-tighter italic">{user.public_repos} Repositories found</span>
                </div>
              </motion.div>
            )}

            <RoastDisplay roast={roastData} user={user || undefined} />
            
            {/* The End Scene */}
            {!roastMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="pt-48 pb-32 text-center"
              >
                <button
                  onClick={() => { setRoastData(null); setUser(null); setQuery(""); roastMutation.reset(); }}
                  className="text-[10px] uppercase tracking-[0.5em] font-black text-muted hover:text-white transition-colors border-b border-transparent hover:border-white pb-2"
                >
                  Analyze another repository
                </button>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      {!roastData && (
        <footer className="fixed bottom-12 left-12 right-12 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-1000">
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">RoastMyGitHub_Core</span>
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">2026_Edition</span>
        </footer>
      )}
    </div>
  );
}
