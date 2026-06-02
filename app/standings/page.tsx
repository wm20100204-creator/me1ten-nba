'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        // 请求 2025 赛季的数据领袖榜
        const res = await fetch('https://tank01-fantasy-stats.p.rapidapi.com/getNBALeaderBoard?season=2025&resultsToReturn=10', { headers: HEADERS });
        const data = await res.json();
        
        // 如果 2025 没数据（休赛期），自动回退到 2024
        if (!data.body || Object.keys(data.body).length === 0) {
          const fallback = await fetch('https://tank01-fantasy-stats.p.rapidapi.com/getNBALeaderBoard?season=2024&resultsToReturn=10', { headers: HEADERS });
          const fallbackData = await fallback.json();
          setLeaders(fallbackData.body);
        } else {
          setLeaders(data.body);
        }
      } catch (e) {
        console.error("获取领袖榜失败", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const LeaderSection = ({ title, data, statKey, unit }: any) => (
    <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
      <h3 className="text-xl font-black italic uppercase tracking-tighter text-blue-500 mb-8 flex items-center gap-3">
        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
        {title}
      </h3>
      <div className="space-y-4">
        {data?.slice(0, 10).map((player: any, index: number) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${index === 0 ? 'bg-blue-600/10 border border-blue-500/30' : 'hover:bg-zinc-900'}`}>
            <div className="flex items-center gap-4">
              <span className={`font-mono text-xs ${index === 0 ? 'text-blue-500 font-bold' : 'text-zinc-600'}`}>
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              <div>
                <p className={`font-black italic uppercase leading-none ${index === 0 ? 'text-white text-lg' : 'text-zinc-300 text-sm'}`}>
                  {player.longName}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{player.team}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-black italic ${index === 0 ? 'text-blue-500 text-2xl' : 'text-white text-lg'}`}>
                {player[statKey]}
              </p>
              <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{unit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <Link href="/standings" className="text-blue-500">Leaders</Link>
           <Link href="/players" className="hover:text-white transition-colors">Players</Link>
           <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            League <span className="text-blue-500">Leaders</span>
          </h2>
          <p className="text-zinc-500 tracking-[0.5em] uppercase text-[10px] font-bold">NBA Statistical Intelligence Terminal</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Decrypting Data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaderSection title="Points Per Game" data={leaders?.pts} statKey="pts" unit="PPG" />
            <LeaderSection title="Rebounds Per Game" data={leaders?.reb} statKey="reb" unit="RPG" />
            <LeaderSection title="Assists Per Game" data={leaders?.ast} statKey="ast" unit="APG" />
            <LeaderSection title="Blocks Per Game" data={leaders?.blk} statKey="blk" unit="BPG" />
          </div>
        )}
      </div>

      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 text-center">
         <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.3em]">Data provided by Tank01 Fantasy Engine • Me1ten Terminal</p>
      </footer>
    </div>
  );
}