'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    setPlayers([]);
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${search}`, { headers: PRO_HEADERS });
      const data = await res.json();
      setPlayers(data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchStats = async (playerId: number) => {
    try {
      // 这里的 2025 是指 2025-26 赛季
      const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2025&player_ids[]=${playerId}`, { headers: PRO_HEADERS });
      const data = await res.json();
      setStats(data.data[0] || null);
    } catch (e) { setStats(null); }
  };

  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '--';

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Back</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <form onSubmit={(e) => { e.preventDefault(); fetchPlayers(); }} className="flex gap-4 mb-16">
          <input 
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-3xl outline-none text-lg text-white focus:border-blue-500 shadow-inner"
            placeholder="搜索球员姓氏 (如: James, Curry, Durant)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20">
            {loading ? '...' : 'SEARCH'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl">
              <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 block">{p.team.full_name}</span>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-600 font-mono text-[10px] mt-6 uppercase font-bold tracking-widest">Access Bio Terminal →</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl font-light">×</button>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-2">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
              <p className="font-bold tracking-[0.3em] text-[10px] uppercase opacity-80">{selectedPlayer.team.full_name}</p>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Pos</p>
                  <p className="text-xl font-black text-blue-500 italic">{selectedPlayer.position || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-10 text-center">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">2025-26 Season Averages</h4>
                   <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black italic">PRO FEED</span>
                </div>
                
                {stats ? (
                  <div className="space-y-10">
                    <div className="grid grid-cols-3 gap-4">
                      <div><p className="text-5xl font-black italic tracking-tighter">{stats.pts}</p><p className="text-blue-500 text-[9px] font-black mt-2 uppercase">Points</p></div>
                      <div className="border-x border-zinc-800"><p className="text-5xl font-black italic tracking-tighter">{stats.reb}</p><p className="text-blue-500 text-[9px] font-black mt-2 uppercase">Rebounds</p></div>
                      <div><p className="text-5xl font-black italic tracking-tighter">{stats.ast}</p><p className="text-blue-500 text-[9px] font-black mt-2 uppercase">Assists</p></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-zinc-800/50">
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">FG%</p><p className="text-lg font-bold">{formatPct(stats.fg_pct)}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">3P%</p><p className="text-lg font-bold">{formatPct(stats.fg3_pct)}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">GP</p><p className="text-lg font-bold">{stats.games_played}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">MIN</p><p className="text-lg font-bold">{stats.min}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-zinc-600 font-black italic uppercase tracking-widest text-xs">Waiting for Season Stats...</div>
                )}
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full mt-10 bg-zinc-800 py-6 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-700 transition-all">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}