'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 1. 搜索球员
  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${search}`, { headers: PRO_HEADERS });
      const data = await res.json();
      setPlayers(data.data || []);
    } catch (e) {
      console.error("Search Failed", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. 核心：多重路径抓取场均数据
  const fetchStats = async (playerId: number) => {
    setLoadingStats(true);
    setStats(null);

    try {
      // 路径 A: 尝试 2025 官方场均
      let res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2025&player_ids[]=${playerId}`, { headers: PRO_HEADERS });
      let data = await res.json();

      if (data.data && data.data.length > 0) {
        setStats({ ...data.data[0], type: '2025-26 Season' });
      } else {
        // 路径 B: 尝试 2024 官方场均
        res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${playerId}`, { headers: PRO_HEADERS });
        data = await res.json();
        if (data.data && data.data.length > 0) {
          setStats({ ...data.data[0], type: '2024-25 Season' });
        } else {
          // 路径 C: 【杀手锏】抓取最近 15 场原始比赛数据并手动计算场均
          res = await fetch(`https://api.balldontlie.io/v1/stats?player_ids[]=${playerId}&per_page=15`, { headers: PRO_HEADERS });
          data = await res.json();
          const gameLogs = data.data || [];
          if (gameLogs.length > 0) {
            const count = gameLogs.length;
            const avg = {
              pts: (gameLogs.reduce((s: any, g: any) => s + (g.pts || 0), 0) / count).toFixed(1),
              reb: (gameLogs.reduce((s: any, g: any) => s + (g.reb || 0), 0) / count).toFixed(1),
              ast: (gameLogs.reduce((s: any, g: any) => s + (g.ast || 0), 0) / count).toFixed(1),
              fg_pct: (gameLogs.reduce((s: any, g: any) => s + (g.fg_pct || 0), 0) / count),
              fg3_pct: (gameLogs.reduce((s: any, g: any) => s + (g.fg3_pct || 0), 0) / count),
              games_played: count,
              type: 'Recent Games Average'
            };
            setStats(avg);
          }
        }
      }
    } catch (err) {
      console.error("Stats calculation error", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '--';

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索球员 (例如: Stephen Curry, Kevin Durant)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2rem] outline-none text-white text-lg focus:border-blue-500 shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
          />
          <button onClick={fetchPlayers} disabled={loading} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50">
            {loading ? '...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl italic">{p.team.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{p.team.full_name}</p>
              <div className="mt-8 pt-6 border-t border-zinc-900 text-[10px] font-black uppercase flex justify-between">
                <span>{p.position || 'G-F'}</span>
                <span className="text-blue-500">Terminal Access →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden border-b border-white/10">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl z-20">×</button>
              
              <div className="w-32 h-32 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black italic border-4 border-blue-600/30 relative overflow-hidden shadow-2xl">
                 <img 
                    src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${selectedPlayer.id}.png`} 
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 <span className="absolute inset-0 flex items-center justify-center z-0 text-zinc-700 bg-[#1a1d23]">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </span>
              </div>

              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative text-white">{selectedPlayer.first_name} <br/> {selectedPlayer.last_name}</h2>
              <div className="flex justify-center items-center gap-3 relative z-10">
                <img src={`https://cdn.nba.com/logos/nba/${selectedPlayer.team.id}/primary/L/logo.svg`} className="w-8 h-8 object-contain shadow-lg" />
                <p className="font-bold tracking-[0.2em] text-[10px] uppercase opacity-90">{selectedPlayer.team.full_name}</p>
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Pos</p>
                  <p className="text-xl font-black text-blue-500 italic">{selectedPlayer.position}</p>
                </div>
              </div>

              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 text-center relative shadow-inner">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic leading-tight">
                     {stats?.type || 'Live'} Statistics Feed
                   </h4>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[8px] font-black uppercase text-zinc-500">Real-Time</span>
                   </div>
                </div>

                {loadingStats ? (
                  <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : stats ? (
                  <div className="space-y-12">
                    <div className="grid grid-cols-3 gap-4">
                      <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.pts}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase tracking-widest">PTS</p></div>
                      <div className="border-x border-zinc-800"><p className="text-5xl font-black italic tracking-tighter text-white">{stats.reb}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase tracking-widest">REB</p></div>
                      <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.ast}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase tracking-widest">AST</p></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-zinc-800/50">
                       <div className="text-center"><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">FG%</p><p className="text-lg font-bold">{formatPct(stats.fg_pct)}</p></div>
                       <div className="text-center"><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">3P%</p><p className="text-lg font-bold">{formatPct(stats.fg3_pct)}</p></div>
                       <div className="text-center"><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">GP</p><p className="text-lg font-bold">{stats.games_played || stats.gp}</p></div>
                       <div className="text-center"><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">MIN</p><p className="text-lg font-bold">{stats.min || '--'}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-zinc-700 font-black uppercase text-xs tracking-[0.2em]">Database Synchronizing...</div>
                )}
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full mt-10 bg-zinc-800 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all border border-zinc-700/50">Terminate Access</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}