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
        
        // 提取效力过的球队历史 (从 stats 对象中提取所有不重复的 teamAbbr)
        let teamHistoryArr: string[] = [];
        if (p.stats && p.stats.NBA) {
          teamHistoryArr = Array.from(new Set(Object.values(p.stats.NBA).map((s: any) => s.teamAbbr))).filter(a => a && a !== "");
        }

        setPlayer({
          ...p,
          teamHistory: teamHistoryArr,
          espnAbbr: teamAbbrMapper(p.teamAbbr),
          isBrunson: p.longName.includes("Jalen Brunson")
        });
      } else {
        setErrorMsg("球员库未检索到该姓名。");
      }
    } catch (e) {
      setErrorMsg("数据同步失败，请检查网络或 API 额度。");
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
        {/* 搜索控制台 */}
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="输入球员全名 (同步 ESPN 数据库)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayerTerminal()}
          />
          <button onClick={fetchPlayerTerminal} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50">
            {loading ? 'Dossier Loading...' : 'Search'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-6 font-bold">{errorMsg}</p>}

        {player && (
          <div className="bg-[#16191d] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            {/* 头部展示区 */}
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-[12rem] opacity-10 font-black italic uppercase leading-none">{player.teamAbbr}</div>
              
              <div className="w-44 h-44 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.playerID}.png`} 
                    className="w-full h-full object-cover mt-4" 
                    onError={(e) => { e.currentTarget.src = "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/nba.png" }}
                 />
              </div>

              <h2 className="text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{player.longName}</h2>
              <div className="flex justify-center items-center gap-4 z-10 relative">
                 <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${player.espnAbbr}.png`} className="w-10 h-10 object-contain bg-white rounded-full p-1 shadow-lg" />
                 <span className="font-bold tracking-widest text-sm uppercase">{player.team}</span>
                 {player.isBrunson && <span className="bg-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black italic shadow-lg">2026 FMVP</span>}
              </div>
            </div>

            {/* 详细档案区 */}
            <div className="p-12 space-y-12">
              {/* 基础身体素质卡片 */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-[#0b0e11] p-8 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Height</p>
                  <p className="text-3xl font-black text-white italic">{player.height || '--'}</p>
                </div>
                <div className="bg-[#0b0e11] p-8 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Weight</p>
                  <p className="text-3xl font-black text-white italic">{player.weight || '--'}</p>
                </div>
                <div className="bg-[#0b0e11] p-8 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-2 tracking-widest">Position</p>
                  <p className="text-3xl font-black text-blue-500 italic">{player.pos || '--'}</p>
                </div>
              </div>

              {/* 核心档案表格 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-10 relative shadow-inner overflow-hidden">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.5em] italic">Player Profile Dossier</h4>
                   <span className="text-[8px] bg-white/5 text-zinc-500 px-3 py-1 rounded-full font-black italic">DATABASE ID: {player.playerID}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-16 px-2">
                  <div className="border-b border-zinc-800/50 pb-4">
                    <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Birthday</p>
                    <p className="text-xl font-bold text-zinc-200 uppercase">{player.bday || '--'}</p>
                  </div>
                  <div className="border-b border-zinc-800/50 pb-4">
                    <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Draft Info</p>
                    <p className="text-xl font-bold text-zinc-200 uppercase">
                      {player.draftYear ? `${player.draftYear} R${player.draftRound} Pick ${player.draftPick}` : 'Undrafted'}
                    </p>
                  </div>
                  <div className="border-b border-zinc-800/50 pb-4">
                    <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">College</p>
                    <p className="text-xl font-bold text-zinc-200 uppercase">{player.college || 'No College Data'}</p>
                  </div>
                  <div className="border-b border-zinc-800/50 pb-4">
                    <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Country</p>
                    <p className="text-xl font-bold text-zinc-200 uppercase">{player.country || 'USA'}</p>
                  </div>
                </div>

                {/* 效力球队历史 */}
                <div className="mt-12 px-2">
                   <p className="text-zinc-500 text-[10px] font-black uppercase mb-6 tracking-widest">Team Career History</p>
                   <div className="flex flex-wrap gap-3">
                      {player.teamHistory && player.teamHistory.length > 0 ? player.teamHistory.map((historyAbbr: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700/50">
                           <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${teamAbbrMapper(historyAbbr)}.png`} className="w-5 h-5 object-contain" />
                           <span className="font-mono text-xs font-black uppercase text-zinc-300">{historyAbbr}</span>
                        </div>
                      )) : (
                        <div className="text-zinc-700 font-black italic text-xs uppercase">Initial franchise record only</div>
                      )}
                   </div>
                </div>
              </div>
              <button onClick={() => setPlayer(null)} className="w-full bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">Close Dossier</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}