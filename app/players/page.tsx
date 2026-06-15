'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// 辅助函数：将 Tank01 的缩写转换为 ESPN 兼容的 Logo 缩写
const teamAbbrMapper = (abbr: string) => {
  const map: Record<string, string> = {
    'NY': 'nyk', 'GS': 'gsw', 'SA': 'sas', 'LAL': 'lal', 'BOS': 'bos',
    'PHI': 'phi', 'CLE': 'cle', 'MIL': 'mil', 'IND': 'ind', 'ORL': 'orl',
    'MIA': 'mia', 'ATL': 'atl', 'CHI': 'chi', 'TOR': 'tor', 'BKN': 'bkn',
    'CHA': 'cha', 'DET': 'det', 'WAS': 'was', 'OKC': 'okc', 'DEN': 'den',
    'MIN': 'min', 'PHX': 'phx', 'LAC': 'lac', 'SAC': 'sac', 'MEM': 'mem',
    'NOP': 'no', 'HOU': 'hou', 'UTA': 'utah', 'POR': 'por', 'DAL': 'dal'
  };
  return map[abbr?.toUpperCase()] || abbr?.toLowerCase();
};

export default function PlayersPage() {
  const [player, setPlayer] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const HEADERS = {
    'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
    'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
  };

  const fetchPlayerTerminal = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayer(null);

    try {
      const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerName=${encodeURIComponent(search)}`;
      const res = await fetch(url, { headers: HEADERS });
      const data = await res.json();

      if (data.body && data.body.length > 0) {
        const p = data.body[0];
        setPlayer({
          ...p,
          espnAbbr: teamAbbrMapper(p.teamAbbr),
          isBrunson: p.longName.includes("Jalen Brunson")
        });
      } else {
        setErrorMsg("球员库未检索到该姓名。");
      }
    } catch (e) {
      setErrorMsg("数据同步失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="输入全名 (如: Jalen Brunson)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayerTerminal()}
          />
          <button onClick={fetchPlayerTerminal} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50">
            {loading ? 'SYNCING...' : 'Search'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-6 font-bold">{errorMsg}</p>}

        {player && (
          <div className="bg-[#16191d] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500 max-w-4xl mx-auto">
            {/* 头部：宽版横向布局 */}
            <div className="bg-blue-600 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-[15rem] opacity-5 font-black italic uppercase leading-none select-none">{player.teamAbbr}</div>
              
              {/* 头像 */}
              <div className="w-48 h-48 bg-zinc-900 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.espnID || player.playerID}.png`} 
                    className="w-full h-full object-cover mt-4" 
                    onError={(e) => { e.currentTarget.style.opacity = '0.1'; }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center text-6xl font-black italic text-white opacity-20 z-0">
                    {player.longName.split(' ')[0][0]}{player.longName.split(' ')[1]?.[0]}
                 </div>
              </div>

              <div className="text-center md:text-left z-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">{player.longName}</h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                   <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/10 shadow-lg">
                      <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${player.espnAbbr}.png`} className="w-6 h-6 object-contain" />
                      <span className="font-bold tracking-widest text-xs uppercase">{player.team}</span>
                   </div>
                   {player.isBrunson && <span className="bg-orange-500 text-black px-4 py-2 rounded-full text-[10px] font-black italic shadow-lg animate-pulse">2026 FMVP</span>}
                </div>
              </div>
            </div>

            {/* 内容区：更宽的网格布局以缩短高度 */}
            <div className="p-8 md:p-10 space-y-8">
              {/* 身体素质 - 横向一排 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0b0e11] p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest text-blue-500">Position</p>
                  <p className="text-2xl font-black text-white italic">{player.pos || '--'}</p>
                </div>
                <div className="bg-[#0b0e11] p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-2xl font-black text-white italic">{player.height || '--'}</p>
                </div>
                <div className="bg-[#0b0e11] p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-2xl font-black text-white italic">{player.weight || '--'}</p>
                </div>
              </div>

              {/* 档案细节 - 两列横向排列 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2rem] p-8 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest">Draft Info</p>
                    <p className="text-sm font-bold text-zinc-200 uppercase">{player.draftYear ? `${player.draftYear} R${player.draftRound} P${player.draftPick}` : 'Undrafted'}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest">Alma Mater</p>
                    <p className="text-sm font-bold text-zinc-200 uppercase">{player.college || 'Direct Entry'}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest">Birthday</p>
                    <p className="text-sm font-bold text-zinc-200 uppercase">{player.bday || '--'}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-[9px] font-black uppercase mb-1 tracking-widest">Nationality</p>
                    <p className="text-sm font-bold text-zinc-200 uppercase">{player.country || 'USA'}</p>
                  </div>
                </div>
              </div>

              {/* 底部按钮：不再需要大幅滚动 */}
              <button 
                onClick={() => setPlayer(null)} 
                className="w-full bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all border border-white/5 shadow-xl"
              >
                Close Profile Terminal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}