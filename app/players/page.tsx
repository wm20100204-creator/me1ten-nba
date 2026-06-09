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

  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${search}`, { headers: PRO_HEADERS });
      const data = await res.json();
      setPlayers(data.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchStats = async (playerId: number) => {
    setLoadingStats(true);
    setStats(null);
    try {
      // 策略：优先查 2025，无果查 2024，再无果查流水并计算
      let res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2025&player_ids[]=${playerId}`, { headers: PRO_HEADERS });
      let data = await res.json();
      if (data.data && data.data.length > 0) {
        setStats({ ...data.data[0], type: '2025-26 Season' });
      } else {
        res = await fetch(`https://api.balldontlie.io/v1/stats?player_ids[]=${playerId}&per_page=15`, { headers: PRO_HEADERS });
        data = await res.json();
        const logs = data.data || [];
        if (logs.length > 0) {
          setStats({
            pts: (logs.reduce((s: any, g: any) => s + (g.pts || 0), 0) / logs.length).toFixed(1),
            reb: (logs.reduce((s: any, g: any) => s + (g.reb || 0), 0) / logs.length).toFixed(1),
            ast: (logs.reduce((s: any, g: any) => s + (g.ast || 0), 0) / logs.length).toFixed(1),
            fg_pct: logs[0].fg_pct, games_played: logs.length, type: 'Recent Match Avg'
          });
        }
      }
    } catch (err) { console.error(err); }
    setLoadingStats(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">Back</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索全名 (例如: Stephen Curry)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2rem] outline-none text-white text-lg focus:border-blue-500 shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
          />
          <button onClick={fetchPlayers} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase hover:bg-blue-700 shadow-xl transition-all disabled:opacity-50">
            {loading ? '...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity font-black text-5xl italic">{p.team.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{p.team.full_name}</p>
              <div className="mt-8 text-[10px] font-black uppercase text-zinc-600">Access Terminal →</div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden border-b border-white/10">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl z-20">×</button>
              
              {/* 球员头像优化版 */}
              <div className="w-36 h-36 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-black border-4 border-white/10 relative overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} // 尝试一种常用的ID偏移逻辑
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center text-5xl opacity-30 italic font-black">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </div>
              </div>

              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{selectedPlayer.first_name} <br/> {selectedPlayer.last_name}</h2>
              <div className="flex justify-center items-center gap-3 relative z-10">
                <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${selectedPlayer.team.abbreviation.toLowerCase()}.png`} className="w-8 h-8 object-contain" />
                <p className="font-bold tracking-[0.2em] text-[10px] uppercase opacity-80">{selectedPlayer.team.full_name}</p>
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Pos</p>
                  <p className="text-xl font-black text-blue-500 italic">{selectedPlayer.position || 'F-G'}</p>
                </div>
              </div>

              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 text-center shadow-inner">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">{stats?.type || 'Pro'} Stats</h4>
                   <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black italic uppercase">Validated Feed</span>
                </div>
                {loadingStats ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : stats ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.pts}</p><p className="text-zinc-600 text-[9px] font-black mt-3 uppercase tracking-widest">PTS</p></div>
                    <div className="border-x border-zinc-800"><p className="text-5xl font-black italic tracking-tighter text-white">{stats.reb}</p><p className="text-zinc-600 text-[9px] font-black mt-3 uppercase tracking-widest">REB</p></div>
                    <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.ast}</p><p className="text-zinc-600 text-[9px] font-black mt-3 uppercase tracking-widest">AST</p></div>
                  </div>
                ) : <div className="py-10 text-zinc-700 font-black uppercase text-xs tracking-widest border border-dashed border-zinc-800 rounded-3xl">Accessing Backup Database...</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}