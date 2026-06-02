'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 这里的配置严格对应你提供的截图
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
      // 路径已修正为该 API 正确的端点：/nba-player-stats
      const url = `https://nba-api-free-data.p.rapidapi.com/nba-player-stats?playerName=${encodeURIComponent(search)}`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: RAPID_HEADERS
      });

      if (!res.ok) {
        throw new Error(`API 响应错误: ${res.status}`);
      }

      const data = await res.json();
      console.log("RapidAPI 返回数据:", data);

      // 处理该 API 返回的数据结构
      if (data && (data.player_name || data.Name)) {
        setPlayers([data]); // 该 API 通常返回单个球员对象，我们转为数组
      } else if (Array.isArray(data)) {
        setPlayers(data);
      } else {
        setErrorMsg('未找到该球员。提示：请输入全名，如 LeBron James');
      }
    } catch (e: any) {
      setErrorMsg(`搜索出错: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-500 text-xs font-bold hover:text-white uppercase tracking-widest border border-zinc-800 px-4 py-2 rounded-full">Back to Home</Link>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-16">
          <div className="flex gap-4">
            <input 
              type="text"
              placeholder="请输入球员姓名 (如: Stephen Curry)"
              className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-3xl outline-none text-lg text-white focus:border-blue-500 transition-all shadow-inner"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
            />
            <button 
              onClick={() => fetchPlayers()}
              disabled={loading}
              className="bg-blue-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-900/20"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-xs ml-6 font-bold uppercase tracking-widest">{errorMsg}</p>}
        </div>

        {/* 结果显示 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((p: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setSelectedPlayer(p)}
              className="bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl"
            >
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 block">Player Identification</span>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-blue-400 transition-colors leading-none">
                {p.player_name || p.Name}
              </h3>
              <p className="text-zinc-500 font-bold mt-4 uppercase tracking-widest text-xs">
                {p.team_name || p.Team || 'Active NBA Player'}
              </p>
              <div className="mt-10 flex justify-between items-center text-zinc-600 font-mono text-[10px] uppercase font-bold tracking-widest">
                 <span>Data Sync: 2025-26</span>
                 <span className="group-hover:text-white transition-colors">View Details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl font-light">×</button>
              <div className="w-20 h-20 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-black italic border border-white/20">
                { (selectedPlayer.player_name || selectedPlayer.Name)[0] }
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">
                {selectedPlayer.player_name || selectedPlayer.Name}
              </h2>
              <p className="font-bold tracking-[0.3em] text-xs uppercase opacity-80">{selectedPlayer.team_name || selectedPlayer.Team}</p>
            </div>

            <div className="p-12">
              <div className="grid grid-cols-2 gap-4 mb-10 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-2xl font-black text-white italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-2xl font-black text-white italic">{selectedPlayer.weight || 'N/A'}</p>
                </div>
              </div>

              {/* 此 API 返回的实时统计数据 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-10 text-center">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-10 italic">Performance Index</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter">{selectedPlayer.points || '0'}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Points</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter">{selectedPlayer.rebounds || '0'}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Rebounds</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black italic tracking-tighter">{selectedPlayer.assists || '0'}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Assists</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full mt-10 bg-zinc-800 py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-700 transition-all active:scale-95"
              >
                Close Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}