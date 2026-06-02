'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const RAPID_HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // 注意：这个 API 的球员搜索端点
      const res = await fetch(`https://nba-api-free-data.p.rapidapi.com/nba-player-details?playerName=${search}`, { 
        headers: RAPID_HEADERS 
      });
      const data = await res.json();
      // 根据 API 返回的结构，如果返回的是单个对象，转为数组
      setPlayers(Array.isArray(data) ? data : [data]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold uppercase">Home</Link>
      </nav>

      <div className="max-w-7xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); fetchPlayers(); }} className="flex gap-3 mb-12">
          <input 
            type="text"
            placeholder="请输入球员全名 (如: Kevin Durant, Stephen Curry)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-10 py-5 rounded-3xl font-black hover:bg-blue-700 transition-all">
            {loading ? '查询中...' : 'SEARCH'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {players.map((p: any, idx: number) => (
            p && p.player_name ? (
              <div key={idx} onClick={() => setSelectedPlayer(p)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all cursor-pointer">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{p.player_name}</h3>
                <p className="text-blue-500 font-bold mt-2">{p.team_name}</p>
                <div className="mt-6 flex justify-between items-center text-zinc-500 font-mono text-xs">
                   <span>{p.position}</span>
                   <span>点击查看详情 →</span>
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-10 text-center">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-8 text-white text-3xl">×</button>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedPlayer.player_name}</h2>
              <p className="mt-2 font-bold tracking-widest text-xs uppercase opacity-80">{selectedPlayer.team_name}</p>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Height</p>
                  <p className="text-xl font-black">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Weight</p>
                  <p className="text-xl font-black">{selectedPlayer.weight || '--'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full bg-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}