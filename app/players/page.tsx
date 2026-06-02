'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const RAPID_HEADERS = {
    'x-rapidapi-key': '你的_RAPID_API_KEY_粘贴在这里',
    'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
  };

  const fetchPlayers = async (name: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api-nba-v1.p.rapidapi.com/players?search=${name}`, { headers: RAPID_HEADERS });
      const data = await res.json();
      setPlayers(data.response || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchStats = async (playerId: number) => {
    try {
      const res = await fetch(`https://api-nba-v1.p.rapidapi.com/players/statistics?id=${playerId}&season=2023`, { headers: RAPID_HEADERS });
      const data = await res.json();
      // API-NBA 返回的是每场比赛的数据，我们简单计算一下平均值
      const allStats = data.response || [];
      if (allStats.length > 0) {
        const avg = {
          pts: (allStats.reduce((acc: any, s: any) => acc + (s.points || 0), 0) / allStats.length).toFixed(1),
          reb: (allStats.reduce((acc: any, s: any) => acc + (s.totReb || 0), 0) / allStats.length).toFixed(1),
          ast: (allStats.reduce((acc: any, s: any) => acc + (s.assists || 0), 0) / allStats.length).toFixed(1),
        };
        setStats(avg);
      }
    } catch (e) { setStats(null); }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative font-sans">
      <nav className="max-w-7xl mx-auto mb-12 border-b border-zinc-800 pb-6 flex justify-between items-center">
        <Link href="/"><h1 className="text-2xl font-black italic">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Home</Link>
      </nav>

      <div className="max-w-7xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); fetchPlayers(search); }} className="flex gap-3 mb-12">
          <input 
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-white text-lg"
            placeholder="搜索球员 (如: James, Curry, Durant)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-10 py-5 rounded-3xl font-black">SEARCH</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-6 rounded-3xl hover:border-blue-500 transition-all cursor-pointer group">
              <h3 className="text-xl font-black uppercase italic leading-tight">{p.firstname} {p.lastname}</h3>
              <p className="text-zinc-500 text-xs mt-1">ID: {p.id}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl relative">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-8 text-white text-3xl">×</button>
            <div className="text-center mb-8">
               <h2 className="text-4xl font-black uppercase italic tracking-tighter">{selectedPlayer.firstname} {selectedPlayer.lastname}</h2>
               <p className="text-blue-500 font-bold uppercase tracking-widest text-xs mt-2">Professional NBA Profile</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Height</p>
                  <p className="text-lg font-black text-white">{selectedPlayer.height.feets ? `${selectedPlayer.height.feets}'${selectedPlayer.height.inches}"` : '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Weight</p>
                  <p className="text-lg font-black text-white">{selectedPlayer.weight.pounds ? `${selectedPlayer.weight.pounds} lbs` : '--'}</p>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 text-center">
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">2023-24 Season Averages</h4>
                {stats ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-5xl font-black italic">{stats.pts}</p><p className="text-blue-500 text-[10px] font-bold mt-2">PTS</p></div>
                    <div><p className="text-5xl font-black italic">{stats.reb}</p><p className="text-blue-500 text-[10px] font-bold mt-2">REB</p></div>
                    <div><p className="text-5xl font-black italic">{stats.ast}</p><p className="text-blue-500 text-[10px] font-bold mt-2">AST</p></div>
                  </div>
                ) : <p className="text-zinc-600 italic">正在计算实时数据...</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}