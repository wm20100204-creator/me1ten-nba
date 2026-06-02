'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [player, setPlayer] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
  };

  const fetchPlayer = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayer(null);

    try {
      // Tank01 搜索接口建议使用 playerName，支持模糊匹配
      const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerName=${encodeURIComponent(search)}`;
      const res = await fetch(url, { headers: HEADERS });
      const data = await res.json();

      if (data.body && data.body.length > 0) {
        // Tank01 返回的是数组，我们取第一个匹配最准的
        setPlayer(data.body[0]);
      } else {
        setErrorMsg("球员库未检索到该姓名，请检查拼写。");
      }
    } catch (e) {
      setErrorMsg("数据终端连接超时，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-500 text-xs font-bold border border-zinc-800 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">HOME</Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-12">
          <input 
            type="text"
            placeholder="输入球员姓名 (如: Kevin Durant)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-3xl outline-none text-white text-lg focus:border-blue-500 transition-all shadow-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayer()}
          />
          <button onClick={fetchPlayer} className="bg-blue-600 px-12 py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-900/20 disabled:opacity-50">
            {loading ? '...' : 'SEARCH'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-4 font-bold">{errorMsg}</p>}

        {player && (
          <div className="bg-[#16191d] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
            {/* 球员头部卡片 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-9xl opacity-10 font-black italic uppercase">{player.teamAbbr}</div>
              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4">{player.longName}</h2>
              <div className="flex justify-center gap-4 text-xs font-bold tracking-widest uppercase opacity-90">
                <span className="bg-black/20 px-3 py-1 rounded">#{player.jerseyNum || '00'}</span>
                <span className="bg-black/20 px-3 py-1 rounded">{player.pos}</span>
                <span className="bg-black/20 px-3 py-1 rounded">{player.team}</span>
              </div>
            </div>
            
            <div className="p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Height</p>
                  <p className="text-2xl font-black italic">{player.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Weight</p>
                  <p className="text-2xl font-black italic">{player.weight || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Age</p>
                  <p className="text-2xl font-black italic">{player.age || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">College</p>
                  <p className="text-sm font-black italic truncate">{player.college || 'None'}</p>
                </div>
              </div>

              {/* 生涯记录/统计提示 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-10 text-center">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em] mb-6 italic">Professional Dossier</h4>
                <div className="space-y-4 text-sm text-zinc-400 font-medium leading-relaxed">
                  <p>来自 {player.country || 'USA'}，选秀于 {player.draftYear || 'N/A'} 年第 {player.draftRound || 'N/A'} 轮第 {player.draftPick || 'N/A'} 顺位。</p>
                  <p>当前状态: <span className="text-green-500 uppercase font-black">{player.injury?.status || 'Active'}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}