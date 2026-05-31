'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // 详情弹窗状态
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
    try {
      // 获取 2023 赛季场均数据
      const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2023&player_ids[]=${playerId}`, {
        headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
      });
      const data = await res.json();
      setPlayerStats(data.data[0] || null);
    } catch (error) {
      console.error("获取统计失败", error);
    }
    setLoadingStats(false);
  };

  useEffect(() => { fetchPlayers(); }, []);

  const handlePlayerClick = (player: any) => {
    setSelectedPlayer(player);
    setPlayerStats(null);
    fetchPlayerStats(player.id);
  };

  // 辅助函数：格式化百分比
  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative font-sans text-sm">
      {/* 顶部导航 */}
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/">
          <h1 className="text-2xl font-black italic tracking-tighter hover:text-blue-500 transition-colors">
            ME1TEN<span className="text-blue-500">.STATS</span>
          </h1>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/standings" className="text-zinc-500 hover:text-white transition-colors">联盟排名</Link>
          <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold">返回主页</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Players Database</h2>
          <p className="text-zinc-500 font-medium">查询所有现役与历史球员详细数据终端</p>
        </div>

        {/* 搜索框 */}
        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchPlayers(search, 1); }} className="flex gap-3 mb-12">
          <input 
            type="text"
            placeholder="输入球员姓氏 (例如: James, Curry, Jokic)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
            Search
          </button>
        </form>

        {/* 球员网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {players.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => handlePlayerClick(p)}
              className="bg-[#16191d] border border-zinc-800 p-6 rounded-3xl hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity font-black text-4xl italic">
                {p.team?.abbreviation}
              </div>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{p.position || 'N/A'}</p>
              <h3 className="text-xl font-black group-hover:text-blue-400 transition-colors uppercase italic">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-500 text-xs font-medium mt-1">{p.team?.full_name}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 font-mono">#{p.id}</span>
                <span className="text-[10px] font-bold text-zinc-400 group-hover:text-blue-500 transition-colors">DETAILS →</span>
              </div>
            </div>
          ))}
        </div>

        {/* 加载更多 */}
        {players.length > 0 && (
          <div className="mt-16 text-center pb-20">
            <button 
              onClick={() => { const next = page + 1; setPage(next); fetchPlayers(search, next); }} 
              disabled={loading} 
              className="bg-zinc-900 border border-zinc-800 px-12 py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Load More Players'}
            </button>
          </div>
        )}
      </div>

      {/* 增强版球员详情弹窗 */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedPlayer(null)}></div>
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden relative z-10 shadow-2xl animate-in fade-in zoom-in duration-300">
            
            {/* 弹窗头部 */}
            <div className="bg-blue-600 p-8 text-center relative">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-8 text-white/50 hover:text-white text-3xl font-light">×</button>
              <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-black italic border border-white/20">
                {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-2">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
              <div className="flex justify-center gap-2 items-center">
                <span className="bg-black/20 px-3 py-1 rounded text-[10px] font-bold tracking-widest uppercase">{selectedPlayer.team.conference} CONFERENCE</span>
                <span className="text-white/80 font-bold uppercase tracking-widest text-xs">{selectedPlayer.team.full_name}</span>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="p-8">
              {/* 物理属性卡片 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Position</p>
                  <p className="text-lg font-black text-blue-500">{selectedPlayer.position || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Height</p>
                  <p className="text-lg font-black text-white">{selectedPlayer.height_feet ? `${selectedPlayer.height_feet}'${selectedPlayer.height_inches}"` : 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Weight</p>
                  <p className="text-lg font-black text-white">{selectedPlayer.weight_pounds ? `${selectedPlayer.weight_pounds} lbs` : 'N/A'}</p>
                </div>
              </div>

              {/* 赛季场均数据区 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">2023-24 Season Averages</h4>
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-bold">LIVE STATS</span>
                </div>

                {loadingStats ? (
                  <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : playerStats ? (
                  <div className="space-y-8">
                    {/* 核心三项 */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-5xl font-black text-white italic tracking-tighter">{playerStats.pts}</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-2">Points</p>
                      </div>
                      <div className="text-center border-x border-zinc-800 px-4">
                        <p className="text-5xl font-black text-white italic tracking-tighter">{playerStats.reb}</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-2">Rebounds</p>
                      </div>
                      <div className="text-center">
                        <p className="text-5xl font-black text-white italic tracking-tighter">{playerStats.ast}</p>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-2">Assists</p>
                      </div>
                    </div>

                    {/* 效率网格 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-zinc-800/50">
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">FG%</p>
                        <p className="text-xl font-bold">{formatPct(playerStats.fg_pct)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">3P%</p>
                        <p className="text-xl font-bold">{formatPct(playerStats.fg3_pct)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">FT%</p>
                        <p className="text-xl font-bold">{formatPct(playerStats.ft_pct)}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">GP</p>
                        <p className="text-xl font-bold">{playerStats.games_played}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">STL</p>
                        <p className="text-xl font-bold">{playerStats.stl}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">BLK</p>
                        <p className="text-xl font-bold">{playerStats.blk}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">TOV</p>
                        <p className="text-xl font-bold text-red-500">{playerStats.turnover}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">MIN</p>
                        <p className="text-xl font-bold">{playerStats.min}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-600 italic border border-dashed border-zinc-800 rounded-3xl">
                    No stats available for this season.
                  </div>
                )}
              </div>

              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all text-xs"
              >
                Close Data Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}