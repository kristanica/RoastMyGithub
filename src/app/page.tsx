"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { RoastDisplay } from "@/components/roast/roast-display";
import { GitHubUser } from "@/types/github";
import { Info, X, Zap } from "lucide-react";
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
    <div className="min-h-screen selection:bg-white selection:text-black overflow-x-hidden">
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
                    Zero manual logic, zero design specs—just pure intent.
                  </p>
                </div>
                <button onClick={() => setShowInfo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} className="text-zinc-500 hover:text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`${roastData ? 'narrative-container' : 'max-w-4xl mx-auto px-6 h-screen flex flex-col justify-center'}`}>
        {!roastMutation.isPending && !roastData && (
          <div className="space-y-12 py-12">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] uppercase tracking-[0.4em] text-muted font-black">Project_Core_V2</motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-zinc-600 text-sm italic">Every repository tells a story. Most are tragedies.</motion.p>
              </div>
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} whileHover={{ opacity: 1 }} onClick={() => setShowInfo(true)} className="p-1.5 border border-zinc-900 rounded-full hover:border-white transition-all"><Info size={14} /></motion.button>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
                Roast <br /> My GitHub<span className="text-zinc-900">.</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="max-w-sm">
              <form onSubmit={handleRoast} className="space-y-6">
                <div className="group">
                  <p className="text-zinc-600 text-xs mb-3 font-medium uppercase tracking-widest">Identify Subject:</p>
                  <Input
                    type="text"
                    placeholder="username or owner/repo"
                    className="bg-transparent border-0 border-b border-zinc-800 rounded-none h-12 text-2xl font-medium focus-visible:ring-0 focus-visible:border-white transition-all p-0 placeholder:text-zinc-900"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <button type="submit" className="text-[9px] uppercase tracking-[0.4em] font-black text-muted hover:text-white transition-colors flex items-center gap-3 group">
                  <span>Initiate</span>
                  <div className="w-8 h-[1px] bg-zinc-900 group-hover:w-12 group-hover:bg-white transition-all" />
                </button>
              </form>
              {roastMutation.isError && <p className="mt-8 text-red-500 text-[10px] font-mono uppercase tracking-widest">Error: {(roastMutation.error as Error).message}</p>}
            </motion.div>
          </div>
        )}

        {roastMutation.isPending && !roastData?.introduction && (
          <div className="h-screen flex flex-col items-center justify-center text-center">
            <p className="text-xl italic text-muted animate-pulse font-medium">{loadingStep}</p>
          </div>
        )}

        {roastData && (
          <div className="space-y-32">
            {user && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
                <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full grayscale" />
                <div className="flex flex-col"><span className="text-[10px] font-black uppercase text-white">@{user.login}</span></div>
              </motion.div>
            )}
            <RoastDisplay roast={roastData} user={user || undefined} isStreaming={roastMutation.isPending} />
            {!roastMutation.isPending && (
              <div className="pt-32 pb-24 text-center">
                <button onClick={() => { setRoastData(null); setUser(null); setQuery(""); roastMutation.reset(); }} className="text-[10px] uppercase tracking-[0.4em] font-black text-muted hover:text-white transition-colors">Reset_Narrative</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
