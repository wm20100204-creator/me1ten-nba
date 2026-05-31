'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  // 用于存储当前选中的球员及其详情
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

  // 获取球员场均数据的函数
  const fetchPlayerStats = async (playerId: number) => {
    setLoadingStats(true);
    try {
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
    setPlayerStats(null); // 先清空上一个人的数据
    fetchPlayerStats(player.id);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <Link href="/"><h1 className="text-xl font-black italic">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-400 text-sm">返回主页</Link>
      </nav>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">球员库查询</h2>

        <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchPlayers(search, 1); }} className="flex gap-2 mb-10">
          <input 
            type="text"
            placeholder="搜索球员姓氏 (如: James, Curry, Durant)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all">搜索</button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((p: any) => (
            <div 
              key={p.id} 
              onClick={() => handlePlayerClick(p)}
              className="bg-[#16191d] border border-zinc-800 p-5 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group"
            >
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">{p.team?.abbreviation} | {p.position || 'N/A'}</p>
              <h3 className="text-lg font-bold group-hover:text-blue-400">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-500 text-xs mt-1">{p.team?.full_name}</p>
              <div className="mt-4 pt-4 border-t border-zinc-900 text-[10px] text-zinc-600 uppercase font-mono">点击查看简介 →</div>
            </div>
          ))}
        </div>

        {players.length > 0 && (
          <div className="mt-12 text-center pb-20">
            <button onClick={() => { const next = page + 1; setPage(next); fetchPlayers(search, next); }} disabled={loading} className="bg-zinc-800 px-10 py-3 rounded-full text-sm font-bold disabled:opacity-50">
              {loading ? '正在加载...' : '加载更多球员 ↓'}
            </button>
          </div>
        )}
      </div>

      {/* 球员详情弹窗 - Introduction Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedPlayer(null)}></div>
          <div className="bg-[#16191d] border border-zinc-800 w-full max-w-lg rounded-3xl p-8 relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white text-2xl">×</button>
            
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-black italic">
                {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
              <p className="text-blue-500 font-bold uppercase tracking-widest mt-1 text-sm">{selectedPlayer.team.full_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#0b0e11] p-4 rounded-2xl border border-zinc-900">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">位置 Position</p>
                <p className="text-lg font-bold">{selectedPlayer.position || 'N/A'}</p>
              </div>
              <div className="bg-[#0b0e11] p-4 rounded-2xl border border-zinc-900">
                <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">身型 Physical</p>
                <p className="text-lg font-bold">{selectedPlayer.height || '??'} / {selectedPlayer.weight || '??'}</p>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-8">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 text-center">2023-24 赛季 场均数据</h4>
              {loadingStats ? (
                <div className="flex justify-center py-4"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : playerStats ? (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-3xl font-black text-white">{playerStats.pts}</p><p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">得分 PTS</p></div>
                  <div><p className="text-3xl font-black text-white">{playerStats.reb}</p><p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">篮板 REB</p></div>
                  <div><p className="text-3xl font-black text-white">{playerStats.ast}</p><p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">助攻 AST</p></div>
                </div>
              ) : (
                <p className="text-center text-zinc-600 text-sm italic">暂无本赛季统计数据</p>
              )}
            </div>

            <button onClick={() => setSelectedPlayer(null)} className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors text-xs">
              关闭详情 Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}