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
        // 抓取 2025 赛季所有的季后赛场次 (一次取 100 场确保全量)
        const res = await fetch(`https://api.balldontlie.io/v1/games?seasons[]=2025&postseason=true&per_page=100`, { 
          headers: PRO_HEADERS 
        });
        const data = await res.json();
        const games = data.data || [];

        // 算法：计算每对球队之间的胜场
        // 键值对格式: "TEAM1-TEAM2": { TEAM1: winCount, TEAM2: winCount }
        const matchups: Record<string, any> = {};

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

        // 格式化比分为 "Win1-Win2"
        const finalScores: Record<string, string> = {};
        Object.keys(matchups).forEach(key => {
          const [t1, t2] = key.split('-');
          const score1 = matchups[key][t1] || 0;
          const score2 = matchups[key][t2] || 0;
          finalScores[key] = `${score1}-${score2}`;
        });

        setSeriesScores(finalScores);
      } catch (e) {
        console.error("季后赛数据解析失败", e);
      } finally {
        setLoading(false);
      }
    }

    fetchAndCalculatePlayoffs();
  }, []);

  // 辅助函数：根据两支球队缩写获取他们之间的系列赛比分
  const getScore = (abbr1: string, abbr2: string) => {
    const pair = [abbr1, abbr2].sort();
    const key = `${pair[0]}-${pair[1]}`;
    const rawScore = seriesScores[key] || "0-0";
    // 确保返回的顺序对应传入的顺序
    if (pair[0] === abbr1) return rawScore;
    return rawScore.split('-').reverse().join('-');
  };

  const SeriesCard = ({ t1, t2, isLive }: any) => {
    const score = getScore(t1, t2);
    const s1 = score.split('-')[0];
    const s2 = score.split('-')[1];

    return (
      <div className={`bg-[#16191d] border ${isLive ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-zinc-800'} p-4 rounded-2xl w-44 transition-all hover:scale-105 group`}>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t1.toLowerCase()}.png`} className="w-6 h-6" />
            <span className={`font-black italic text-xs ${parseInt(s1) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t1}</span>
          </div>
          <span className={`font-mono text-sm font-black ${parseInt(s1) >= 4 ? 'text-blue-500' : 'text-zinc-500'}`}>{s1}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${t2.toLowerCase()}.png`} className="w-6 h-6" />
            <span className={`font-black italic text-xs ${parseInt(s2) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t2}</span>
          </div>
          <span className={`font-mono text-sm font-black ${parseInt(s2) >= 4 ? 'text-blue-500' : 'text-zinc-500'}`}>{s2}</span>
        </div>
        {isLive && <div className="absolute -top-2 -right-2 bg-red-600 text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase">Series Active</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans overflow-x-auto">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 sticky left-0">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Bracket</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/standings" className="hover:text-white">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 underline underline-offset-8">Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-w-[1100px]">
        <div className="text-center mb-24">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-2">2026 <span className="text-blue-500">Playoffs</span> Terminal</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px]">Real-Time Logic-Driven Bracket Engine</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-40">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">Scanning Postseason Game-Logs...</p>
          </div>
        ) : (
          <div className="flex justify-between items-center relative">
            
            {/* EASTERN CONFERENCE */}
            <div className="flex items-center gap-12">
               {/* Round 1 */}
               <div className="space-y-6">
                  <p className="text-[9px] font-black text-blue-500 mb-4 uppercase tracking-[0.3em] text-center italic">Eastern R1</p>
                  <SeriesCard t1="BOS" t2="MIA" />
                  <SeriesCard t1="CLE" t2="ORL" />
                  <SeriesCard t1="MIL" t2="IND" />
                  <SeriesCard t1="NYK" t2="PHI" />
               </div>
               {/* Semis */}
               <div className="space-y-40">
                  <p className="text-[9px] font-black text-blue-500 mb-4 uppercase tracking-[0.3em] text-center italic">East Semis</p>
                  <SeriesCard t1="BOS" t2="CLE" />
                  <SeriesCard t1="NYK" t2="IND" />
               </div>
               {/* Finals */}
               <div className="space-y-0">
                  <p className="text-[9px] font-black text-blue-500 mb-4 uppercase tracking-[0.3em] text-center italic">East Finals</p>
                  <SeriesCard t1="BOS" t2="NYK" />
               </div>
            </div>

            {/* THE NBA FINALS 2026 */}
            <div className="flex flex-col items-center px-8 relative">
               <div className="absolute inset-0 bg-blue-500/10 blur-[80px] rounded-full"></div>
               <div className="relative border-2 border-blue-500/30 p-2 rounded-[3.5rem] bg-[#0b0e11] shadow-2xl">
                  <div className="bg-gradient-to-b from-zinc-900 to-black p-12 rounded-[3rem] text-center w-72 border border-white/5">
                     <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-8">The Finals</p>
                     <div className="flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                           <img src="https://a.espncdn.com/i/teamlogos/nba/500/bos.png" className="w-16 h-16 object-contain" />
                           <span className="text-5xl font-black italic">{getScore("BOS", "DAL").split('-')[0]}</span>
                        </div>
                        <div className="py-2 text-zinc-800 font-black italic tracking-tighter">VS</div>
                        <div className="flex items-center justify-between text-zinc-500">
                           <img src="https://a.espncdn.com/i/teamlogos/nba/500/dal.png" className="w-16 h-16 object-contain grayscale opacity-50" />
                           <span className="text-5xl font-black italic">{getScore("BOS", "DAL").split('-')[1]}</span>
                        </div>
                     </div>
                     <div className="mt-10 pt-6 border-t border-zinc-800">
                        <span className="bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">Live Tracker</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* WESTERN CONFERENCE */}
            <div className="flex items-center gap-12 text-right">
               {/* Finals */}
               <div className="space-y-0">
                  <p className="text-[9px] font-black text-red-600 mb-4 uppercase tracking-[0.3em] text-center italic">West Finals</p>
                  <SeriesCard t1="DAL" t2="MIN" />
               </div>
               {/* Semis */}
               <div className="space-y-40">
                  <p className="text-[9px] font-black text-red-600 mb-4 uppercase tracking-[0.3em] text-center italic">West Semis</p>
                  <SeriesCard t1="OKC" t2="DAL" />
                  <SeriesCard t1="DEN" t2="MIN" />
               </div>
               {/* Round 1 */}
               <div className="space-y-6">
                  <p className="text-[9px] font-black text-red-600 mb-4 uppercase tracking-[0.3em] text-center italic">Western R1</p>
                  <SeriesCard t1="OKC" t2="NOP" />
                  <SeriesCard t1="LAC" t2="DAL" />
                  <SeriesCard t1="DEN" t2="LAL" />
                  <SeriesCard t1="MIN" t2="PHX" />
               </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}