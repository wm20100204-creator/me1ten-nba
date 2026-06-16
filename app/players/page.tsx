'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 1. 2026 赛季官方荣誉榜映射
const PLAYER_AWARDS: Record<string, { label: string; color: string }> = {
  "Shai Gilgeous-Alexander": { label: "2026 MVP", color: "bg-amber-500" },
  "Victor Wembanyama": { label: "2026 DPOY", color: "bg-red-600" },
  "Cooper Flagg": { label: "2026 ROOKIE OF THE YEAR", color: "bg-green-600" },
  "Keldon Johnson": { label: "2026 MIP", color: "bg-purple-600" },
  "Jalen Brunson": { label: "2026 FINALS MVP", color: "bg-orange-500" }
};

// 修正：NBA 官方 Logo 缩写转换映射
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
  const [loadingStats, setLoadingStats] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();
  const autoName = searchParams.get('name');

  const HEADERS = { 'Authorization': '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6' };

  // 抓取球员场均统计
  const fetchPlayerStats = async (playerId: number) => {
    setLoadingStats(true);
    setStats(null);
    try {
      const seasons = [2025, 2024];
      for (const season of seasons) {
        const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=${season}&player_ids[]=${playerId}`, { headers: HEADERS });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setStats(data.data[0]);
          break;
        }
      }
    } catch (e) { console.error("Stats failed", e); }
    setLoadingStats(false);
  };

  // 搜索球员逻辑
  const fetchPlayersTerminal = async (nameToSearch: string) => {
    if (!nameToSearch) return;
    setLoading(true);
    setErrorMsg('');
    setPlayers([]);

    try {
      let res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(nameToSearch)}`, { headers: HEADERS });
      let data = await res.json();

      // 自动容错：如果全名搜不到，搜姓氏
      if ((!data.data || data.data.length === 0) && nameToSearch.includes(' ')) {
        const lastName = nameToSearch.trim().split(' ').pop();
        res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(lastName!)}`, { headers: HEADERS });
        data = await res.json();
      }

      if (data.data && data.data.length > 0) {
        setPlayers(data.data);
        if (autoName && data.data.length === 1) {
          setSelectedPlayer(data.data[0]);
          fetchPlayerStats(data.data[0].id);
        }
      } else {
        setErrorMsg("球员库未检索到该姓名。建议只搜姓氏。");
      }
    } catch (e) { setErrorMsg("数据同步失败。"); }
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
      <div className="flex gap-4 mb-16">
        <input 
          type="text"
          placeholder="搜索球员 (例如: Stephen Curry)"
          className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPlayersTerminal(search)}
        />
        <button onClick={() => fetchPlayersTerminal(search)} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50 transition-all">
          {loading ? 'SYNCING...' : 'Search'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {players.map((p: any) => {
          const award = PLAYER_AWARDS[`${p.first_name} ${p.last_name}`];
          return (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchPlayerStats(p.id); }} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl italic">{p.team?.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              {award && (
                <span className={`${award.color} text-white text-[8px] font-black px-2 py-0.5 rounded-full mt-1 inline-block italic`}>{award.label}</span>
              )}
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">{p.team?.full_name}</p>
            </div>
          );
        })}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl font-light z-30">×</button>
              
              <div className="w-44 h-44 bg-zinc-900 rounded-full flex-shrink-0 border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} 
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.opacity = '0.2'; }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center text-6xl font-black italic text-white opacity-20">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </div>
              </div>

              <div className="text-center md:text-left z-10">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                   <div className="flex items-center gap-3 bg-black/20 px-5 py-2 rounded-full border border-white/10">
                      <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${getEspnAbbr(selectedPlayer.team?.abbreviation)}.png`} className="w-8 h-8 object-contain" />
                      <span className="font-black tracking-widest text-sm uppercase">{selectedPlayer.team?.full_name}</span>
                   </div>
                   {PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`] && (
                     <span className={`${PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].color} text-black px-4 py-2 rounded-full text-[10px] font-black italic shadow-lg animate-pulse`}>
                       {PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].label}
                     </span>
                   )}
                </div>
              </div>
            </div>

            <div className="p-10 md:p-12 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Height</p>
                  <p className="text-3xl font-black text-white italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Weight</p>
                  <p className="text-3xl font-black text-white italic">{selectedPlayer.weight || 'N/A'} lbs</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Jersey</p>
                  <p className="text-3xl font-black text-blue-500 italic">#{selectedPlayer.jersey_number || '00'}</p>
                </div>
              </div>

              {/* 场均数据区 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-8 shadow-inner">
                <div className="flex justify-between items-center mb-10 px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Season Performance</h4>
                   <span className="bg-blue-600/20 text-blue-500 px-3 py-1 rounded-full text-[8px] font-black italic">PRO FEED</span>
                </div>
                {loadingStats ? (
                  <div className="flex justify-center py-10 animate-spin"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>
                ) : stats ? (
                  <div className="grid grid-cols-5 gap-4 text-center">
                    <div><p className="text-4xl font-black italic text-white">{stats.pts}</p><p className="text-[8px] text-blue-500 font-bold mt-2 uppercase">PTS</p></div>
                    <div><p className="text-4xl font-black italic text-white">{stats.reb}</p><p className="text-[8px] text-blue-500 font-bold mt-2 uppercase">REB</p></div>
                    <div><p className="text-4xl font-black italic text-white">{stats.ast}</p><p className="text-[8px] text-blue-500 font-bold mt-2 uppercase">AST</p></div>
                    <div><p className="text-4xl font-black italic text-white">{stats.stl}</p><p className="text-[8px] text-zinc-500 font-bold mt-2 uppercase">STL</p></div>
                    <div><p className="text-4xl font-black italic text-white">{stats.blk}</p><p className="text-[8px] text-zinc-500 font-bold mt-2 uppercase">BLK</p></div>
                  </div>
                ) : <div className="py-10 text-zinc-700 font-black uppercase text-xs italic text-center">Stats Syncing...</div>}
              </div>

              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 grid grid-cols-2 md:grid-cols-3 gap-8 text-left font-black italic">
                 <div><p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Draft Info</p><p className="text-lg text-white uppercase">{selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}</p></div>
                 <div><p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">College</p><p className="text-lg text-white uppercase truncate">{selectedPlayer.college || 'Direct Entry'}</p></div>
                 <div><p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Country</p><p className="text-lg text-white uppercase">{selectedPlayer.country || 'USA'}</p></div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayersPage() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all text-zinc-400">Back</Link>
      </nav>
      <Suspense fallback={<div className="text-center py-40 animate-pulse font-black uppercase">Syncing Terminal...</div>}>
        <PlayerTerminalContent />
      </Suspense>
    </div>
  );
}