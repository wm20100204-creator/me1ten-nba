'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayoffsPage() {
  const [seriesScores, setSeriesScores] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  useEffect(() => {
    async function fetchAndCalculatePlayoffs() {
      setLoading(true);
      try {
        // 抓取 2025 赛季所有季后赛场次
        const res = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=2025&postseason=true&per_page=100`, { 
          headers: PRO_HEADERS 
        });
        const data = await res.json();
        const games = data.data || [];

        const matchups: Record<string, any> = {};

        games.forEach((game: any) => {
          if (game.status === 'Final' || game.home_team_score > 0) {
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
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchAndCalculatePlayoffs();
  }, []);

  const getScore = (abbr1: string, abbr2: string) => {
    const pair = [abbr1, abbr2].sort();
    const key = `${pair[0]}-${pair[1]}`;
    const rawScore = seriesScores[key] || "0-0";
    return pair[0] === abbr1 ? rawScore : rawScore.split('-').reverse().join('-');
  };

  const SeriesCard = ({ t1, t2, isLive }: any) => {
    const score = getScore(t1, t2);
    const [s1, s2] = score.split('-');
    const isFinished = parseInt(s1) >= 4 || parseInt(s2) >= 4;

    return (
      <div className={`bg-[#16191d] border ${isLive ? 'border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.15)]' : 'border-zinc-800'} p-3 rounded-xl w-40 transition-all hover:border-zinc-500 group relative`}>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t1.toLowerCase()}.png`} className="w-5 h-5" />
            <span className={`font-black italic text-[10px] ${parseInt(s1) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t1}</span>
          </div>
          <span className="font-mono text-xs font-black">{s1}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t2.toLowerCase()}.png`} className="w-5 h-5" />
            <span className={`font-black italic text-[10px] ${parseInt(s2) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t2}</span>
          </div>
          <span className="font-mono text-xs font-black">{s2}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Bracket</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/standings" className="hover:text-white">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 border-b-2 border-blue-500 pb-1">2026 Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-w-[1200px] overflow-x-auto">
        <div className="text-center mb-24">
            <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-2">The <span className="text-blue-500">2026</span> Finals</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.6em] text-[10px]">New York Knicks vs San Antonio Spurs</p>
        </div>

        <div className="flex justify-between items-center relative">
          
          {/* --- EASTERN CONFERENCE (End in NYK) --- */}
          <div className="flex items-center gap-10">
             <div className="space-y-6">
                <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic">Round 1</p>
                <SeriesCard t1="NYK" t2="PHI" />
                <SeriesCard t1="MIL" t2="IND" />
                <SeriesCard t1="BOS" t2="MIA" />
                <SeriesCard t1="CLE" t2="ORL" />
             </div>
             <div className="space-y-36">
                <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic">Semis</p>
                <SeriesCard t1="NYK" t2="IND" />
                <SeriesCard t1="BOS" t2="CLE" />
             </div>
             <div className="space-y-0">
                <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic">ECF</p>
                <SeriesCard t1="NYK" t2="BOS" />
             </div>
          </div>

          {/* --- THE FINALS: NYK VS SAS --- */}
          <div className="flex flex-col items-center px-10 relative">
             <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
             <div className="relative border-4 border-white/5 p-2 rounded-[4rem] bg-zinc-900 shadow-2xl">
                <div className="bg-[#0b0e11] p-12 rounded-[3.5rem] text-center w-80 border border-white/10">
                   <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">NBA Finals</p>
                   <div className="flex flex-col gap-10">
                      <div className="flex items-center justify-between">
                         <img src="https://a.espncdn.com/i/teamlogos/nba/500/nyk.png" className="w-16 h-16 object-contain shadow-2xl" />
                         <span className="text-6xl font-black italic">{getScore("NYK", "SAS").split('-')[0]}</span>
                      </div>
                      <div className="text-zinc-800 font-black italic text-2xl tracking-tighter">VS</div>
                      <div className="flex items-center justify-between">
                         <img src="https://a.espncdn.com/i/teamlogos/nba/500/sas.png" className="w-16 h-16 object-contain shadow-2xl" />
                         <span className="text-6xl font-black italic">{getScore("NYK", "SAS").split('-')[1]}</span>
                      </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-zinc-800">
                      <span className="bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40">Live Terminal</span>
                   </div>
                </div>
             </div>
          </div>

          {/* --- WESTERN CONFERENCE (End in SAS) --- */}
          <div className="flex items-center gap-10 text-right">
             <div className="space-y-0">
                <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic">WCF</p>
                <SeriesCard t1="SAS" t2="OKC" />
             </div>
             <div className="space-y-36">
                <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic">Semis</p>
                <SeriesCard t1="OKC" t2="DEN" />
                <SeriesCard t1="SAS" t2="MIN" />
             </div>
             <div className="space-y-6">
                <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic">Round 1</p>
                <SeriesCard t1="OKC" t2="NOP" />
                <SeriesCard t1="DEN" t2="LAL" />
                <SeriesCard t1="MIN" t2="PHX" />
                <SeriesCard t1="SAS" t2="LAC" />
             </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-40 pt-8 border-t border-zinc-900 text-center flex justify-between items-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-widest italic">Me1ten Data Node</p>
        <p className="text-[10px] font-bold uppercase tracking-widest">Postseason Series Calculation Engine</p>
      </footer>
    </div>
  );
}