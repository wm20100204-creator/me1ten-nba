'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState(''); // 增加错误提示状态

  const RAPID_HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
  };

  const fetchPlayers = async () => {
    if (!search) {
      alert("请输入球员姓名");
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    setPlayers([]); // 清空上次结果

    console.log("正在搜索球员:", search);

    try {
      // 这里的playerName参数区分大小写，尝试把首字母大写
      const formattedName = search.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      
      const res = await fetch(`https://nba-api-free-data.p.rapidapi.com/nba-player-details?playerName=${formattedName}`, { 
        headers: RAPID_HEADERS,
        method: 'GET'
      });

      if (!res.ok) {
        throw new Error(`API 请求失败，状态码: ${res.status}`);
      }

      const data = await res.json();
      console.log("API 返回原始数据:", data);

      // 处理数据逻辑：确保结果是数组
      if (data && (data.player_name || data.Name)) {
        setPlayers([data]);
      } else if (Array.isArray(data) && data.length > 0) {
        setPlayers(data);
      } else {
        setErrorMsg('未找到该球员，请检查拼写（建议输入全名，如 LeBron James）');
      }
    } catch (e: any) {
      console.error("搜索过程出错:", e);
      setErrorMsg(`搜索出错: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 relative font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Home</Link>
      </nav>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-3 mb-12">
          <div className="flex gap-3">
            <input 
              type="text"
              placeholder="请输入球员全名 (如: Kevin Durant)"
              className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-base text-white focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPlayers()}
            />
            <button 
              onClick={() => fetchPlayers()}
              disabled={loading}
              className="bg-blue-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'SEARCH'}
            </button>
          </div>
          {errorMsg && <p className="text-red-500 text-sm ml-4">{errorMsg}</p>}
        </div>

        {/* 结果展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {players.map((p: any, idx: number) => (
            <div key={idx} onClick={() => setSelectedPlayer(p)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all cursor-pointer group">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-blue-400">{p.player_name || p.Name}</h3>
              <p className="text-zinc-500 font-bold mt-2">{p.team_name || p.Team || 'Active Player'}</p>
              <p className="text-[10px] mt-4 text-zinc-600">点击查看详情 →</p>
            </div>
          ))}
        </div>
      </div>

      {/* 详情弹窗 */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="bg-blue-600 p-10 text-center">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-6 right-8 text-white text-3xl">×</button>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedPlayer.player_name || selectedPlayer.Name}</h2>
              <p className="mt-2 font-bold tracking-widest text-xs uppercase opacity-80">{selectedPlayer.team_name || selectedPlayer.Team}</p>
            </div>
            <div className="p-10">
              <div className="grid grid-cols-2 gap-4 mb-10 text-center">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Height</p>
                  <p className="text-xl font-black text-white">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Weight</p>
                  <p className="text-xl font-black text-white">{selectedPlayer.weight || '--'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full bg-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-700">CLOSE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}