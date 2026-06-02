'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const RAPID_HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
  };

  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayers([]);

    try {
      // 自动格式化名字：把 LEBRON JAMES 转成 LeBron James
      const formattedName = search.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      const url = `https://nba-api-free-data.p.rapidapi.com/nba-player-stats?playerName=${encodeURIComponent(formattedName)}`;
      const res = await fetch(url, { headers: RAPID_HEADERS });
      const data = await res.json();

      // 调试：在浏览器控制台打印出来，看看 API 到底给了什么
      console.log("API返回数据:", data);

      if (data && (data.player_name || data.Name)) {
        setPlayers([data]);
      } else {
        setErrorMsg('未找到该球员。提示：请确保输入全名（如 LeBron James）');
      }
    } catch (e: any) {
      setErrorMsg(`查询出错: API限流或网络问题`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-10">
          <input 
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-white text-lg focus:border-blue-500"
            placeholder="输入全名，如 LeBron James"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={fetchPlayers} className="bg-blue-600 px-10 py-5 rounded-3xl font-black">{loading ? '...' : 'SEARCH'}</button>
        </div>
        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-4 font-bold">{errorMsg}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {players.map((p, i) => (
            <div key={i} onClick={() => setSelectedPlayer(p)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 cursor-pointer transition-all">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter">{p.player_name || p.Name}</h3>
              <p className="text-blue-500 font-bold mt-2">{p.team_name || p.Team}</p>
              <p className="text-[10px] text-zinc-600 mt-4 uppercase">Click for Statistics →</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-xl rounded-[2.5rem] p-10 relative shadow-2xl">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white text-3xl">×</button>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">{selectedPlayer.player_name || selectedPlayer.Name}</h2>
            <p className="text-blue-500 font-bold uppercase text-xs mb-8 tracking-widest">{selectedPlayer.team_name || selectedPlayer.Team}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-xl font-black">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-xl font-black">{selectedPlayer.weight || '--'}</p>
                </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 text-center">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8">Career Performance</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-4xl font-black italic">{selectedPlayer.pts || selectedPlayer.points || '0'}</p><p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Points</p></div>
                  <div><p className="text-4xl font-black italic">{selectedPlayer.reb || selectedPlayer.rebounds || '0'}</p><p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Rebounds</p></div>
                  <div><p className="text-4xl font-black italic">{selectedPlayer.ast || selectedPlayer.assists || '0'}</p><p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Assists</p></div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}