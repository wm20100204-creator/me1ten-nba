'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  // 关键修复：给 useState 加上 <any[]> 类型定义
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchPlayers = async (searchName = '', pageNum = 1) => {
    setLoading(true);
    try {
      const url = `https://api.balldontlie.io/v1/players?search=${searchName}&page=${pageNum}&per_page=50`;
      const res = await fetch(url, {
        headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
      });
      const data = await res.json();
      
      if (pageNum === 1) {
        setPlayers(data.data || []);
      } else {
        // 这里就是报错的地方，现在修复了
        setPlayers((prev: any[]) => [...prev, ...(data.data || [])]);
      }
    } catch (error) {
      console.error("加载失败", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPlayers(search, 1);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlayers(search, nextPage);
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <Link href="/"><h1 className="text-xl font-black italic">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-400 text-sm hover:text-white">返回主页</Link>
      </nav>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 tracking-tighter">NBA 球员库查询</h2>

        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <input 
            type="text"
            placeholder="搜索球员姓氏 (如: James, Curry, Yao)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20">
            搜索
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((p: any) => (
            <div key={p.id} className="bg-[#16191d] border border-zinc-800 p-5 rounded-2xl hover:border-zinc-600 transition-all">
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">{p.team?.abbreviation || 'NBA'} | {p.position || 'N/A'}</p>
              <h3 className="text-lg font-bold text-white">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-500 text-xs mt-1">{p.team?.full_name}</p>
              
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 font-mono">ID: {p.id}</span>
                <span className="text-[10px] text-zinc-400">Regular Season</span>
              </div>
            </div>
          ))}
        </div>

        {players.length > 0 && (
          <div className="mt-12 text-center pb-20">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="bg-zinc-800 border border-zinc-700 px-10 py-3 rounded-full text-sm font-bold hover:bg-zinc-700 transition-all disabled:opacity-50"
            >
              {loading ? '正在加载...' : '加载更多球员 ↓'}
            </button>
          </div>
        )}

        {players.length === 0 && !loading && (
          <p className="text-center text-zinc-500 py-20 border border-dashed border-zinc-800 ro