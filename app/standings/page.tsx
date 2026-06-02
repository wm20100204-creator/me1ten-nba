'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
  };

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      try {
        // 先尝试获取 2024 赛季，这是目前数据最完整的年份
        const url = 'https://tank01-fantasy-stats.p.rapidapi.com/getNBALeaderBoard?season=2024&resultsToReturn=10';
        const res = await fetch(url, { headers: HEADERS });
        const data = await res.json();
        
        console.log("领袖榜原始数据:", data); // 你可以按 F12 在控制台查看

        if (data && data.body) {
          setLeaders(data.body);
        } else {
          setError('API 暂时没有返回数据，可能是额度用尽或赛季结算中');
        }
      } catch (e) {
        setError('网络连接失败，请检查网络');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const LeaderSection = ({ title, data, statKey, unit }: any) => {
    // 防御性编程：如果该项没数据，不渲染
    if (!data || !Array.isArray(data)) return null;

    return (
      <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl transition-all hover:border-blue-500/50">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-blue-500 mb-8 flex items-center gap-3">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          {title}
        </h3>
        <div className="space-y-4">
          {data.map((player: any, index: number) => (
            <div key={index} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${index === 0 ? 'bg-blue-600/10 border border-blue-500/30' : 'hover:bg-zinc-900'}`}>
              <div className="flex items-center gap-4">
                <span className={`font-mono text-xs ${index === 0 ? 'text-blue-500 font-bold' : 'text-zinc-600'}`}>
                  {index + 1}
                </span>
                <div>
                  <p className={`font-black italic uppercase leading-none ${index === 0 ? 'text-white text-lg' : 'text-zinc-300 text-sm'}`}>
                    {player.longName || player.name || 'Unknown'}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">{player.team || 'NBA'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black italic ${index === 0 ? 'text-blue-500 text-2xl' : 'text-white text-lg'}`}>
                  {player[statKey] || '0.0'}
                </p>
                <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">{unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <Link href="/standings" className="text-blue-500 underline underline-offset-8">Leaders</Link>
           <Link href="/players" className="hover:text-white transition-colors">Players</Link>
           <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
            League <span className="text-blue-500">Leaders</span>
          </h2>
          <p className="text-zinc-500 tracking-[0.5em] uppercase text-[10px] font-bold">2024-25 Season Performance Data</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Accessing Satellite Data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-[3rem]">
            <p className="text-zinc-500 uppercase font-black italic tracking-widest">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LeaderSection title="Points (PPG)" data={leaders?.pts} statKey="pts" unit="Points" />
            <LeaderSection title="Rebounds (RPG)" data={leaders?.reb} statKey="reb" unit="Rebounds" />
            <LeaderSection title="Assists (APG)" data={leaders?.ast} statKey="ast" unit="Assists" />
            <LeaderSection title="Blocks (BPG)" data={leaders?.blk} statKey="blk" unit="Blocks" />
          </div>
        )}
      </div>
    </div>
  );
}