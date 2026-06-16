'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 1. 2026 赛季官方荣誉榜
const PLAYER_AWARDS: Record<string, { label: string; color: string }> = {
  "Shai Gilgeous-Alexander": { label: "2026 MVP", color: "bg-amber-500" },
  "Victor Wembanyama": { label: "2026 DPOY", color: "bg-red-600" },
  "Cooper Flagg": { label: "2026 ROOKIE OF THE YEAR", color: "bg-green-600" },
  "Keldon Johnson": { label: "2026 MIP", color: "bg-purple-600" },
  "Jalen Brunson": { label: "2026 FINALS MVP", color: "bg-orange-500" }
};

// 修正：NBA 官方 Logo 缩写映射
const getEspnAbbr = (abbr: string) => {
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

function PlayerTerminalContent() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();
  const autoName = searchParams.get('name');
  const API_KEY = '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6';

  // 抓取球员统计 (仅用于辅助判断状态)
  const fetchPlayerStats = async (playerId: number) => {
    setStats(null);
    try {
      // 尝试 2025 或 2024
      const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${playerId}`, { 
        headers: { 'Authorization': API_KEY } 
      });
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        setStats(data.data[0]);
      }
    } catch (e) { console.error(e); }
  };

  const fetchPlayersTerminal = async (nameToSearch: string) => {
    if (!nameToSearch) return;
    setSelectedPlayer(null);
    setStats(null);
    setErrorMsg('');
    setPlayers([]);
    setLoading(true);

    try {
      let res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(nameToSearch)}`, { 
        headers: { 'Authorization': API_KEY } 
      });
      let data = await res.json();

      if ((!data.data || data.data.length === 0) && nameToSearch.includes(' ')) {
        const lastName = nameToSearch.trim().split(' ').pop();
        res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(lastName!)}`, { 
          headers: { 'Authorization': API_KEY } 
        });
        data = await res.json();
      }

      if (data.data && data.data.length > 0) {
        setPlayers(data.data);
        // 如果是精准跳转，直接打开
        if (autoName && data.data.length >= 1) {
          const p = data.data[0];
          setSelectedPlayer(p);
          fetchPlayerStats(p.id);
        }
      } else { setErrorMsg("球员库未检索到该姓名。"); }
    } catch (e) { setErrorMsg("同步失败。"); }
    setLoading(false);
  };

  useEffect(() => {
    if (autoName) {
      setSearch(autoName);
      fetchPlayersTerminal(autoName);
    }
  }, [autoName]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-4 mb-12 px-4 md:px-0">
        <input 
          type="text"
          placeholder="搜索球员 (例如: Stephen Curry)"
          className="flex-1 bg-[#16191d] border border-zinc-800 p-5 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPlayersTerminal(search)}
        />
        <button onClick={() => fetchPlayersTerminal(search)} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-20 px-4">
        {players.map((p: any) => {
          const award = PLAYER_AWARDS[`${p.first_name} ${p.last_name}`];
          return (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchPlayerStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl italic uppercase">{p.team?.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              {award && <span className={`${award.color} text-white text-[8px] font-black px-2 py-0.5 rounded-full inline-block italic`}>{award.label}</span>}
              <p className="text-zinc-600 font-bold uppercase text-[10px] tracking-widest mt-4">{p.team?.full_name}</p>
            </div>
          );
        })}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-5xl max-h-[85vh] overflow-y-auto rounded-[3rem] shadow-2xl relative scrollbar-hide">
            
            {/* 顶部横幅 */}
            <div className="bg-blue-600 p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden border-b border-white/10 sticky top-0 z-30">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-8 text-white/50 hover:text-white text-4xl font-light z-40">×</button>
              
              <div className="w-32 h-32 md:w-44 md:h-44 bg-zinc-900 rounded-full flex-shrink-0 border-4 border-white/20 relative z-10 overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center text-4xl font-black italic text-white opacity-20">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </div>
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} 
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
              </div>

              <div className="text-center md:text-left z-10">
                <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">
                    {selectedPlayer.first_name} <br className="hidden md:block" /> {selectedPlayer.last_name}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                   <div className="flex items-center gap-3 bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
                      <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${getEspnAbbr(selectedPlayer.team?.abbreviation)}.png`} className="w-8 h-8 object-contain" />
                      <span className="font-black tracking-widest text-[10px] uppercase">{selectedPlayer.team?.full_name}</span>
                   </div>
                   {PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`] && (
                     <span className={`${PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].color} text-black px-4 py-2 rounded-full text-[10px] font-black italic shadow-lg`}>
                       {PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].label}
                     </span>
                   )}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-10">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Height</p>
                  <p className="text-2xl font-black text-white italic">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Weight</p>
                  <p className="text-2xl font-black text-white italic">{selectedPlayer.weight || '--'} lbs</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1 tracking-widest">Jersey</p>
                  <p className="text-2xl font-black text-blue-500 italic">#{selectedPlayer.jersey_number || '00'}</p>
                </div>
              </div>

              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 shadow-inner">
                <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] italic mb-10 text-center">Intelligence Terminal</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left font-black italic">
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">NBA Draft</p>
                      <p className="text-sm text-white uppercase">{selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}</p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Alma Mater</p>
                      <p className="text-sm text-white uppercase truncate">{selectedPlayer.college || 'Direct'}</p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Country</p>
                      <p className="text-sm text-white uppercase">{selectedPlayer.country || 'USA'}</p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Status</p>
                      {/* 【修正判定】：如果球员有奖项 OR 有比赛数据，则为 Active */}
                      <p className={`text-sm uppercase leading-tight tracking-widest ${ (stats || PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`]) ? 'text-green-500 animate-pulse' : 'text-zinc-600'}`}>
                        { (stats || PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`]) ? 'Active Node' : 'Legacy / Retired'}
                      </p>
                   </div>
                </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full bg-zinc-800 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all border border-zinc-700/50 shadow-xl">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayersPage() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans overflow-x-hidden">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white hover:text-blue-500 transition-colors">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Back</Link>
      </nav>
      <Suspense fallback={<div className="text-center py-40 animate-pulse font-black text-zinc-600 uppercase">Connecting to Terminal...</div>}>
        <PlayerTerminalContent />
      </Suspense>
    </div>
  );
}