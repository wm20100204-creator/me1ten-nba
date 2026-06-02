'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [player, setPlayer] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const RAPID_HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
  };

  const fetchPlayer = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayer(null);

    try {
      // 自动修正名字格式 (例如: lebron james -> Lebron James)
      const formattedName = search.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ');
      
      const url = `https://nba-api-free-data.p.rapidapi.com/nba-player-stats?playerName=${encodeURIComponent(formattedName)}`;
      const res = await fetch(url, { headers: RAPID_HEADERS });
      const data = await res.json();

      console.log("API返回结果:", data);

      if (data && data.player_name) {
        setPlayer(data);
      } else {
        setErrorMsg("查无此人。请尝试输入全名，如: LeBron James");
      }
    } catch (e: any) {
      setErrorMsg("请求失败，请检查 API 额度或网络");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-500 text-xs font-bold border border-zinc-800 px-4 py-2 rounded-full">BACK</Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-12">
          <input 
            type="text"
            placeholder="输入全名，如: Stephen Curry"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-3xl outline-none text-white text-lg focus:border-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={fetchPlayer}
            className="bg-blue-600 px-10 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/20"
          >
            {loading ? '...' : 'SEARCH'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-4">{errorMsg}</p>}

        {player && (
          <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-10 text-center">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">{player.player_name}</h2>
              <p className="text-white/80 font-bold uppercase tracking-widest text-xs mt-2">{player.team_name}</p>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Height</p>
                  <p className="text-2xl font-black italic">{player.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase mb-1">Weight</p>
                  <p className="text-2xl font-black italic">{player.weight || '--'}</p>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-10">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-10 text-center">SEASON PERFORMANCE</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-4xl font-black italic">{player.points || '0'}</p>
                    <p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Points</p>
                  </div>
                  <div className="border-x border-zinc-800">
                    <p className="text-4xl font-black italic">{player.rebounds || '0'}</p>
                    <p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Rebounds</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black italic">{player.assists || '0'}</p>
                    <p className="text-blue-500 text-[9px] font-bold mt-2 uppercase">Assists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}