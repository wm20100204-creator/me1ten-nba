'use client'; // 必须加上这一行，因为搜索需要用户互动

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 获取数据的函数
  const fetchPlayers = async (searchName = '', pageNum = 1) => {
    setLoading(true);
    try {
      // per_page=100 可以让你一次获取更多球员
      const url = `https://api.balldontlie.io/v1/players?search=${searchName}&page=${pageNum}&per_page=50`;
      const res = await fetch(url, {
        headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
      });
      const data = await res.json();
      
      if (pageNum === 1) {
        setPlayers(data.data);
      } else {
        setPlayers((prev) => [...prev, ...data.data]); // 把新加载的球员拼接到后面
      }
    } catch (error) {
      console.error("加载失败", error);
    }
    setLoading(false);
  };

  // 页面加载时抓取第一批球员
  useEffect(() => {
    fetchPlayers();
  }, []);

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPlayers(search, 1);
  };

  // 加载下一页
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
        <h2 className="text-3xl font-bold mb-8">球员库查询</h2>

        {/* 搜索栏 */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-10">
          <input 
            type="text"
            placeholder="输入球员姓氏 (例如: Curry, James, Yao)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
            搜索
          </button>
        </form>

        {/* 球员列表网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {players.map((p: any) => (
            <div key={p.id} className="bg-[#16191d] border border-zinc-800 p-5 rounded-2xl hover:scale-[1.02] transition-transform">
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">{p.team.abbreviation} | {p.position || 'N/A'}</p>
              <h3 className="text-lg font-bold text-white">{p.first_name} {p.last_name}</h3>
              <p className="text-zinc-500 text-xs mt-1">{p.team.full_name}</p>
              
              <div className="mt-4 pt-4 border-t border-zinc-900 flex justify-between items-center">
                <span className="text-[10px] text-zinc-600 uppercase font-mono">ID: {p.id}</span>
                <button className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400 hover:text-white">查看数据</button>
              </div>
            </div>
          ))}
        </div>

        {/* 加载更多按钮 */}
        {players.length > 0 && (
          <div className="mt-12 text-center">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="bg-zinc-800 border border-zinc-700 px-10 py-3 rounded-full text-sm font-bold hover:bg-zinc-700 transition-all disabled:opacity-50"
            >
              {loading ? '加载中...' : '加载更多球员 ↓'}
            </button>
          </div>
        )}

        {players.length === 0 && !loading && (
          <p className="text-center text-zinc-500 py-20">没有找到相关球员，请尝试其他关键词。</p>
        )}
      </div>
    </div>
  );
}