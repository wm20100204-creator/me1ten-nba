'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayoffsPage() {
  const [seriesScores, setSeriesScores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  useEffect(() => {
    async function fetchPlayoffData() {
      setLoading(true);
      try {
        // 【核心修正】：抓取 2026 年季后赛期间（4月15日-6月15日）的所有比赛
        // 使用开始日期和结束日期，比只用 postseason 标签更准确
        const res = await fetch(
          `https://api.balldontlie.io/v1/games?seasons[]=2025&start_date=2026-04-15&end_date=2026-06-15&per_page=100`, 
          { headers: PRO_HEADERS }
        );
        const data = await res.json();
        const games = data.data || [];

        const matchups: Record<string, any> = {};

        // 算法：迭代所有比赛记录，统计对阵胜负
        games.forEach((game: any) => {
          if (game.status === 'Final') {
            const teams = [game.home_team.abbreviation, game.visitor_team.abbreviation].sort();
            const pairKey = `${teams[0]}-${teams[1]}`;
            
            if (!matchups[pairKey]) matchups[pairKey] = {};
            
            const winner = game.home_team_score > game.visitor_team_score 
              ? game.home_team.abbreviation 
              : game.visitor_team.abbreviation;

            matchups[pairKey][winner] = (matchups[pairKey][winner] || 0) + 1;
          }
        });

        const finalScores: Record<string, string> = {};
        Object.keys(matchups).forEach(key => {
          const [t1, t2] = key.split('-');
          finalScores[key] = `${matchups[key][t1] || 0}-${matchups[key][t2] || 0}`;
        });

        setSeriesScores(finalScores);
      } catch (e) {
        console.error("Data Sync Error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayoffData();
  }, []);

  // 获取比分辅助函数
  const getScore = (t1: string, t2: string) => {
    const pair = [t1, t2].sort();
    const key = `${pair[0]}-${pair[1]}`;
    const score = seriesScores[key] || "0-0";
    return pair[0] === t1 ? score : score.split('-').reverse().join('-');
  };

  const SeriesBox = ({ t1, t2, side }: any) => {
    const score = getScore(t1, t2);
    const [s1, s2] = score.split('-');
    const isT1Winner = parseInt(s1) >= 4;
    const isT2Winner = parseInt(s2) >= 4;

    return (
      <div className="relative flex flex-col w-44 bg-[#16191d] border border-zinc-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 group">
        <div className={`flex justify-between items-center p-3 ${isT1Winner ? 'bg-blue-500/10' : ''}`}>
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t1.toLowerCase()}.png`} className="w-5 h-5" />
            <span className={`text-xs font-black italic ${isT1Winner ? 'text-blue-400' : 'text-zinc-200'}`}>{t1}</span>
          </div>
          <span className={`font-mono text-sm font-black ${isT1Winner ? 'text-blue-500' : 'text-zinc-500'}`}>{s1}</span>
        </div>
        <div className="h-[1px] bg-zinc-800 w-full"></div>
        <div className={`flex justify-between items-center p-3 ${isT2Winner ? 'bg-blue-500/10' : ''}`}>
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t2.toLowerCase()}.png`} className="w-5 h-5" />
            <span className={`text-xs font-black italic ${isT2Winner ? 'text-blue-400' : 'text-zinc-200'}`}>{t2}</span>
          </div>
          <span className={`font-mono text-sm font-black ${isT2Winner ? 'text-blue-500' : 'text-zinc-500'}`}>{s2}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans overflow-x-auto">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 sticky left-0">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter uppercase">ME1TEN<span className="text-blue-500">.BRACKET</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 underline underline-offset-8 decoration-2">Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-w-[1200px]">
        <div className="text-center mb-24">
            <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">2026 <span className="text-blue-500">NBA</span> Playoffs</h2>
            <p className="text-zinc-600 font-bold uppercase tracking-[0.5em] text-[10px]">Official League Statistics Node • All-Star Access</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40">
             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="text-zinc-600 font-mono text-[9px] uppercase tracking-widest animate-pulse">Syncing Official Game-Logs...</p>
          </div>
        ) : (
          <div className="flex justify-between items-center gap-4 relative">
            
            {/* EASTERN CONFERENCE - Path to NYK */}
            <div className="flex items-center gap-10">
               <div className="space-y-6">
                  <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">R1</p>
                  <SeriesBox t1="NYK" t2="PHI" />
                  <SeriesBox t1="MIL" t2="IND" />
                  <SeriesBox t1="BOS" t2="MIA" />
                  <SeriesBox t1="CLE" t2="ORL" />
               </div>
               <div className="space-y-36">
                  <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">Semis</p>
                  <SeriesBox t1="NYK" t2="IND" />
                  <SeriesBox t1="BOS" t2="CLE" />
               </div>
               <div className="space-y-0">
                  <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">ECF</p>
                  <SeriesBox t1="NYK" t2="BOS" />
               </div>
            </div>

            {/* --- THE FINALS: NYK VS SAS --- */}
            <div className="flex flex-col items-center px-12 relative">
               <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full"></div>
               <div className="relative border-2 border-white/5 p-2 rounded-[3.5rem] bg-zinc-900/50 shadow-2xl">
                  <div className="bg-[#0b0e11] p-12 rounded-[3rem] text-center w-80 border border-white/10 relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 text-6xl font-black italic text-white/[0.03]">2026</div>
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">NBA Finals</p>
                     <div className="flex flex-col gap-10">
                        <div className="flex items-center justify-between">
                           <img src="https://a.espncdn.com/i/teamlogos/nba/500/nyk.png" className="w-16 h-16 object-contain" />
                           <span className="text-6xl font-black italic text-white">{getScore("NYK", "SAS").split('-')[0]}</span>
                        </div>
                        <div className="h-[1px] bg-zinc-800 w-full relative">
                           <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b0e11] px-4 font-black italic text-zinc-700 italic">FINAL SERIES</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <img src="https://a.espncdn.com/i/teamlogos/nba/500/sas.png" className="w-16 h-16 object-contain" />
                           <span className="text-6xl font-black italic text-white">{getScore("NYK", "SAS").split('-')[1]}</span>
                        </div>
                     </div>
                     <div className="mt-12 pt-8 border-t border-zinc-900">
                        <span className="bg-white text-black px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl">Live Terminal</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* WESTERN CONFERENCE - Path to SAS */}
            <div className="flex items-center gap-10">
               <div className="space-y-0">
                  <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">WCF</p>
                  <SeriesBox t1="SAS" t2="OKC" />
               </div>
               <div className="space-y-36">
                  <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">Semis</p>
                  <SeriesBox t1="OKC" t2="DEN" />
                  <SeriesBox t1="SAS" t2="MIN" />
               </div>
               <div className="space-y-6">
                  <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">R1</p>
                  <SeriesBox t1="OKC" t2="NOP" />
                  <SeriesBox t1="DEN" t2="LAL" />
                  <SeriesBox t1="MIN" t2="PHX" />
                  <SeriesBox t1="SAS" t2="LAC" />
               </div>
            </div>

          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto mt-40 pt-8 border-t border-zinc-900 text-center flex justify-between items-center opacity-30">
        <p className="text-[9px] font-bold uppercase tracking-widest italic">Me1ten Data Terminal</p>
        <p className="text-[9px] font-bold uppercase tracking-widest">Engineered for 2026 Postseason</p>
      </footer>
    </div>
  );
}