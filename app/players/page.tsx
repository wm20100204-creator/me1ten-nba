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

  // 1. 搜索球员列表
  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    setPlayers([]);
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${search}`, { headers: PRO_HEADERS });
      const data = await res.json();
      setPlayers(data.data || []);
    } catch (e) {
      console.error("搜索失败:", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. 抓取场均数据（带回溯逻辑：2025 -> 2024 -> 2023）
  const fetchStats = async (playerId: number) => {
    setLoadingStats(true);
    setStats(null);
    
    const seasonsToTry = [2025, 2024, 2023]; 
    let foundStats = null;

    for (const season of seasonsToTry) {
      try {
        const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=${season}&player_ids[]=${playerId}`, { 
          headers: PRO_HEADERS 
        });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          foundStats = { ...data.data[0], displaySeason: season };
          break; // 只要查到一个年份有数据，就停止循环
        }
      } catch (err) {
        console.error(`查询 ${season} 赛季失败`, err);
      }
    }
    setStats(foundStats);
    setLoadingStats(false);
  };

  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '--';

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      {/* 顶部导航 */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all text-zinc-400">Back to Terminal</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        {/* 搜索框 */}
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索球员 (例如: Stephen Curry, Kevin Durant)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2rem] outline-none text-white text-lg focus:border-blue-500 shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
          />
          <button 
            onClick={fetchPlayers} 
            disabled={loading}
            className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* 球员列表网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity font-black text-5xl italic">{p.team.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">{p.team.full_name}</p>
              <div className="mt-8 flex justify-between items-center text-zinc-600 text-[10px] font-black uppercase">
                 <span>{p.position || 'Forward-Guard'}</span>
                 <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">View Identity →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 球员详情弹窗 */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden border-b border-white/10">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl font-light z-20">×</button>
              
              {/* 高清头像逻辑 */}
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

              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{selectedPlayer.first_name} <br/> {selectedPlayer.last_name}</h2>
              <div className="flex justify-center items-center gap-3 relative z-10">
                <img src={`https://cdn.nba.com/logos/nba/${selectedPlayer.team.id}/primary/L/logo.svg`} className="w-8 h-8 object-contain" />
                <p className="font-bold tracking-[0.2em] text-[10px] uppercase opacity-80">{selectedPlayer.team.full_name}</p>
              </div>
            </div>

            <div className="p-10">
              {/* 物理属性 */}
              <div className="grid grid-cols-3 gap-4 mb-10 text-center text-sm font-bold uppercase tracking-widest">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Position</p>
                  <p className="text-xl font-black text-blue-500 italic">{selectedPlayer.position || 'F-G'}</p>
                </div>
              </div>

              {/* 赛季统计数据区 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-10 text-center">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">
                     {stats ? `${stats.displaySeason}-${stats.displaySeason + 1}` : '2025-26'} Season Statistics
                   </h4>
                   <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black italic tracking-widest">PRO DATA</span>
                </div>

                {loadingStats ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : stats ? (
                  <div className="space-y-10">
                    <div className="grid grid-cols-3 gap-4">
                      <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.pts}</p><p className="text-zinc-600 text-[9px] font-black mt-2 uppercase">Points</p></div>
                      <div className="border-x border-zinc-800"><p className="text-5xl font-black italic tracking-tighter text-white">{stats.reb}</p><p className="text-zinc-600 text-[9px] font-black mt-2 uppercase">Rebounds</p></div>
                      <div><p className="text-5xl font-black italic tracking-tighter text-white">{stats.ast}</p><p className="text-zinc-600 text-[9px] font-black mt-2 uppercase">Assists</p></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-zinc-800/50">
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">FG%</p><p className="text-lg font-bold">{formatPct(stats.fg_pct)}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">3P%</p><p className="text-lg font-bold">{formatPct(stats.fg3_pct)}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">GP</p><p className="text-lg font-bold">{stats.games_played}</p></div>
                       <div><p className="text-zinc-500 text-[9px] font-black uppercase mb-1">MIN</p><p className="text-lg font-bold">{stats.min || '--'}</p></div>
                    </div>
                  </div>
                ) : (
                  <div className="py-10 text-zinc-700 font-black uppercase text-xs tracking-widest border border-dashed border-zinc-800 rounded-3xl">
                    No stats found for recent seasons
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full mt-10 bg-zinc-800 text-white py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-zinc-700 transition-all"
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