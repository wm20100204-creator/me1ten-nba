'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// 辅助函数：将 API 的 2 位缩写转换为 ESPN 要求的 3 位缩写
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
      // 增加 getStats=true 获取全量统计
      const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerName=${encodeURIComponent(search)}&getStats=true`;
      const res = await fetch(url, { headers: HEADERS });
      const data = await res.json();

      if (data.body && data.body.length > 0) {
        const p = data.body[0];
        
        // 深度挖掘统计数据：遍历 stats 找到最新的有效数据
        let activeStats = { pts: "0.0", reb: "0.0", ast: "0.0", fgp: "0.0", tpp: "0.0", gp: "0" };
        if (p.stats) {
          // 优先找 2025，其次 2024，最后找列表中第一个
          const sObj = p.stats.NBA || p.stats;
          const yearData = sObj['2025'] || sObj['2024'] || Object.values(sObj)[0];
          if (yearData) {
            activeStats = {
              pts: yearData.pts || "0.0",
              reb: yearData.reb || "0.0",
              ast: yearData.ast || "0.0",
              fgp: yearData.fgp || "0.0",
              tpp: yearData.tpp || "0.0",
              gp: yearData.gamesPlayed || "0"
            };
          }
        }

        setPlayer({
          ...p,
          displayStats: activeStats,
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
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Back</Link>
      </nav>

      <div className="max-w-4xl mx-auto">
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
          <div className="bg-[#16191d] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-9xl opacity-10 font-black italic uppercase">{player.teamAbbr}</div>
              
              {/* 头像 - 增加 ESPN CDN */}
              <div className="w-40 h-40 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={player.espnHeadshot || `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.playerID}.png`} 
                    className="w-full h-full object-cover mt-4" 
                    onError={(e) => { e.currentTarget.src = "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/nba.png" }}
                 />
              </div>

              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{player.longName}</h2>
              <div className="flex justify-center items-center gap-4 z-10 relative">
                 <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${player.espnAbbr}.png`} className="w-10 h-10 object-contain bg-white rounded-full p-1" />
                 <span className="font-bold tracking-widest text-sm uppercase">{player.team}</span>
                 {player.isBrunson && <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black italic shadow-lg animate-bounce">2026 FMVP</span>}
              </div>
            </div>

            <div className="p-10">
              <div className="grid grid-cols-3 gap-4 mb-10 text-center uppercase font-black">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800"><p className="text-zinc-500 text-[10px] mb-1">Height</p><p className="text-2xl text-white italic">{player.height}</p></div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800"><p className="text-zinc-500 text-[10px] mb-1">Weight</p><p className="text-2xl text-white italic">{player.weight}</p></div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800"><p className="text-zinc-500 text-[10px] mb-1">Position</p><p className="text-2xl text-blue-500 italic">{player.pos}</p></div>
              </div>

              <div className="bg-[#0b0e11] border border-zinc-800 rounded-[2.5rem] p-12 text-center shadow-inner">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Official Season Statistics</h4>
                   <span className="text-[8px] bg-green-600/20 text-green-500 px-3 py-1 rounded font-black italic animate-pulse">LIVE ESPN SYNC</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div>
                    <p className="text-7xl font-black italic tracking-tighter text-white leading-none">{player.displayStats.pts}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-4 uppercase tracking-widest">Points (PPG)</p>
                  </div>
                  <div className="border-x border-zinc-800">
                    <p className="text-7xl font-black italic tracking-tighter text-white leading-none">{player.displayStats.reb}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-4 uppercase tracking-widest">Rebounds</p>
                  </div>
                  <div>
                    <p className="text-7xl font-black italic tracking-tighter text-white leading-none">{player.displayStats.ast}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-4 uppercase tracking-widest">Assists</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 pt-10 border-t border-zinc-800/50 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                   <div>FG: <span className="text-white ml-2">{player.displayStats.fgp}%</span></div>
                   <div>3P: <span className="text-white ml-2">{player.displayStats.tpp}%</span></div>
                   <div>GP: <span className="text-white ml-2">{player.displayStats.gp}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}