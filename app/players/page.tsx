'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [playerStats, setPlayerStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchPlayers = async (searchName = '', pageNum = 1) => {
    setLoading(true);
    try {
      const url = `https://api.balldontlie.io/v1/players?search=${searchName}&page=${pageNum}&per_page=50`;
      const res = await fetch(url, {
        headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
      });
      const data = await res.json();
      if (pageNum === 1) setPlayers(data.data || []);
      else setPlayers((prev: any[]) => [...prev, ...(data.data || [])]);
    } catch (error) {
      console.error("加载失败", error);
    }
    setLoading(false);
  };

  const fetchPlayerStats = async (playerId: number) => {
    setLoadingStats(true);
    // 尝试获取 2023 赛季，这是该 API 最稳的年份
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=${playerId}`, {
        headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
      });
      const data = await res.json();
      setPlayerStats(data.data[0] || null);
    } catch (error) {
      setPlayerStats(null);
    }
    setLoadingStats(false);
  };

  useEffect(() => { fetchPlayers(); }, []);

  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter hover:text-blue-500">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold">HOME</Link>
      </nav>

      <div className="max-w-7xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchPlayers(search, 1); }} className="flex gap-3 mb-12">
          <input 
            type="text"
            placeholder="搜索球员 (如: James, Curry, Durant)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-base text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">Search</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchPlayerStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-6 rounded-3xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
              <p className="text-blue-500 text-[10px] font-bold uppercase mb-2">{p.position || 'N/A'}</p>
              <h3 className="text-xl font-black group-hover:text-blue-400 uppercase italic">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-500 text-xs mt-1">{p.team?.full_name}</p>
              <div className="mt-6 text-[10px] font-bold text-zinc-600">ID: {p.id}</div>
            </div>
          ))}
        </div>
        
        {players.length > 0 && (
          <div className="mt-16 text-center pb-20">
            <button onClick={() => { const next = page + 1; setPage(next); fetchPlayers(search, next); }} disabled={loading} className="bg-zinc-900 border border-zinc-800 px-12 py-4 rounded-full text-xs font-black uppercase tracking-widest">
              {loading ? 'Processing...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedPlayer(null)}></div>
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            
            <div className="bg-blue-600 p-10 text-center relative">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-8 text-white text-3xl font-light">×</button>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
              <p className="text-white/80 font-bold uppercase tracking-widest text-xs">{selectedPlayer.team.full_name}</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Position</p>
                  <p className="text-lg font-black text-blue-500">{selectedPlayer.position || 'N/A'}</p>
                </div>
                {/* 物理数据显示逻辑修正：兼容多种返回格式 */}
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-lg font-black text-white">
                    {selectedPlayer.height_feet ? `${selectedPlayer.height_feet}'${selectedPlayer.height_inches}"` : (selectedPlayer.height ? selectedPlayer.height : '--')}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-lg font-black text-white">
                    {selectedPlayer.weight_pounds ? `${selectedPlayer.weight_pounds} lbs` : (selectedPlayer.weight ? selectedPlayer.weight : '--')}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 text-center">
                <div className="flex justify-between items-center mb-8 px-2">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">Season Statistics</h4>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-bold italic uppercase tracking-widest">Live Stats</span>
                </div>

                {loadingStats ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : playerStats ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-3 gap-4 px-2">
                      <div><p className="text-5xl font-black italic tracking-tighter">{playerStats.pts}</p><p className="text-[10px] text-blue-500 font-bold uppercase mt-2">PTS</p></div>
                      <div className="border-x border-zinc-800 px-4"><p className="text-5xl font-black italic tracking-tighter">{playerStats.reb}</p><p className="text-[10px] text-blue-500 font-bold uppercase mt-2">REB</p></div>
                      <div><p className="text-5xl font-black italic tracking-tighter">{playerStats.ast}</p><p className="text-[10px] text-blue-500 font-bold uppercase mt-2">AST</p></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-zinc-800/50">
                      <div><p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">FG%</p><p className="text-xl font-bold">{formatPct(playerStats.fg_pct)}</p></div>
                      <div><p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">3P%</p><p className="text-xl font-bold">{formatPct(playerStats.fg3_pct)}</p></div>
                      <div><p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">GP</p><p className="text-xl font-bold">{playerStats.games_played}</p></div>
                      <div><p className="text-zinc-500 text-[10px] font-bold uppercase mb-1 tracking-widest">MIN</p><p className="text-xl font-bold">{playerStats.min}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-zinc-800 rounded-3xl">
                    <p className="text-zinc-500 text-sm font-medium">该 ID 无赛季统计数据</p>
                    <p className="text-zinc-700 text-[10px] mt-2 uppercase tracking-widest">Free API Limitation</p>
                  </div>
                )}
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full mt-8 bg-zinc-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all hover:bg-zinc-700">CLOSE DATA TERMINAL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}