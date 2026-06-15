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

  // 你的 All-Star API Key
  const API_KEY = '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6';
  const HEADERS = { 'Authorization': API_KEY };

  // 1. 搜索球员列表
  const fetchPlayers = async () => {
    if (!search) return;
    setLoading(true);
    setPlayers([]);
    try {
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(search)}`, { headers: HEADERS });
      const data = await res.json();
      setPlayers(data.data || []);
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  // 2. 抓取球员场均统计 (2025赛季优先)
  const fetchPlayerStats = async (playerId: number) => {
    setLoadingStats(true);
    setStats(null);
    try {
      // 尝试抓取 2025 赛季数据
      const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2025&player_ids[]=${playerId}`, { headers: HEADERS });
      const data = await res.json();
      
      if (data.data && data.data.length > 0) {
        setStats(data.data[0]);
      } else {
        // 如果 2025 没数据，回溯到 2024
        const res2 = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${playerId}`, { headers: HEADERS });
        const data2 = await res2.json();
        setStats(data2.data?.[0] || null);
      }
    } catch (e) {
      console.error("Stats failed", e);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Back</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        {/* 搜索框 */}
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索球员 (例如: Stephen Curry)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
          />
          <button 
            onClick={fetchPlayers} 
            disabled={loading}
            className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50 transition-all active:scale-95"
          >
            {loading ? 'SYNCING...' : 'Search'}
          </button>
        </div>

        {/* 球员列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchPlayerStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl italic">{p.team?.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{p.team?.full_name}</p>
              <div className="mt-8 pt-6 border-t border-zinc-900 text-[10px] font-black uppercase text-blue-500">Access Dossier →</div>
            </div>
          ))}
        </div>
      </div>

      {/* 球员详情弹窗 */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden border-b border-white/10">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl z-20 font-light">×</button>
              
              {/* 头像 */}
              <div className="w-40 h-40 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} 
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center text-5xl font-black italic text-white opacity-20">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </div>
              </div>

              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{selectedPlayer.first_name} <br/> {selectedPlayer.last_name}</h2>
              <div className="flex justify-center items-center gap-3 relative z-10">
                <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${selectedPlayer.team?.abbreviation.toLowerCase()}.png`} className="w-8 h-8 object-contain" />
                <p className="font-bold tracking-[0.2em] text-[10px] uppercase opacity-80">{selectedPlayer.team?.full_name}</p>
              </div>
            </div>

            <div className="p-10">
              {/* 身体素质与国籍卡片 */}
              <div className="grid grid-cols-3 gap-4 mb-8 text-center uppercase font-black">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Nationality</p>
                  <p className="text-sm font-black text-blue-500 italic truncate">{selectedPlayer.country || 'USA'}</p>
                </div>
              </div>

              {/* 场均核心数据区 */}
              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 mb-8 shadow-inner text-center">
                 <div className="flex justify-between items-center mb-10 px-2">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Season Performance</h4>
                    <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black italic tracking-widest uppercase">Live Stats</span>
                 </div>
                 
                 {loadingStats ? (
                    <div className="flex justify-center py-10 animate-spin"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
                 ) : stats ? (
                    <div className="space-y-12">
                       {/* 三大主项 */}
                       <div className="grid grid-cols-3 gap-4">
                          <div><p className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.pts}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase">Points</p></div>
                          <div className="border-x border-zinc-800"><p className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.reb}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase">Rebounds</p></div>
                          <div><p className="text-6xl font-black italic tracking-tighter text-white leading-none">{stats.ast}</p><p className="text-blue-500 text-[9px] font-black mt-3 uppercase">Assists</p></div>
                       </div>
                       {/* 两大副项 */}
                       <div className="grid grid-cols-2 pt-10 border-t border-zinc-800/50">
                          <div className="border-r border-zinc-800"><p className="text-3xl font-black italic text-zinc-200">{stats.stl}</p><p className="text-zinc-600 text-[9px] font-black uppercase">Steals</p></div>
                          <div><p className="text-3xl font-black italic text-zinc-200">{stats.blk}</p><p className="text-zinc-600 text-[9px] font-black uppercase">Blocks</p></div>
                       </div>
                    </div>
                 ) : (
                    <div className="py-10 text-zinc-700 font-black uppercase text-xs italic tracking-widest">No stats recorded for current season</div>
                 )}
              </div>

              {/* 历史档案细节 */}
              <div className="grid grid-cols-2 gap-4 px-2 text-left mb-6 font-black italic">
                 <div className="border-l-2 border-zinc-800 pl-4">
                    <p className="text-[8px] text-zinc-500 uppercase mb-1">NBA Draft Entry</p>
                    <p className="text-xs text-white uppercase">{selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}</p>
                 </div>
                 <div className="border-l-2 border-zinc-800 pl-4">
                    <p className="text-[8px] text-zinc-500 uppercase mb-1">Alma Mater</p>
                    <p className="text-xs text-white uppercase">{selectedPlayer.college || 'Direct Entry'}</p>
                 </div>
              </div>

              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full mt-4 bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}