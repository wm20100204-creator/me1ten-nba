'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// 1. 荣誉榜
const PLAYER_AWARDS: Record<string, { label: string; color: string }> = {
  "Shai Gilgeous-Alexander": { label: "2026 MVP", color: "bg-amber-500" },
  "Victor Wembanyama": { label: "2026 DPOY", color: "bg-red-600" },
  "Cooper Flagg": { label: "2026 ROOKIE OF THE YEAR", color: "bg-green-600" },
  "Keldon Johnson": { label: "2026 MIP", color: "bg-purple-600" },
  "Jalen Brunson": { label: "2026 FINALS MVP", color: "bg-orange-500" }
};

// 2. 超级球星保底数据库
const STAR_STATS_BACKUP: Record<string, any> = {
  "Shai Gilgeous-Alexander": { pts: 31.1, reb: 5.5, ast: 6.4, stl: 2.1, blk: 0.9, fg_pct: 0.54, fg3_pct: 0.38, games_played: 76 },
  "Victor Wembanyama": { pts: 26.4, reb: 12.8, ast: 4.5, stl: 1.4, blk: 3.9, fg_pct: 0.49, fg3_pct: 0.34, games_played: 74 },
  "Jalen Brunson": { pts: 28.7, reb: 3.6, ast: 7.2, stl: 1.0, blk: 0.2, fg_pct: 0.48, fg3_pct: 0.41, games_played: 79 },
  "Cooper Flagg": { pts: 21.3, reb: 8.2, ast: 4.1, stl: 1.5, blk: 1.8, fg_pct: 0.46, fg3_pct: 0.36, games_played: 80 },
  "Keldon Johnson": { pts: 22.8, reb: 6.1, ast: 3.9, stl: 1.1, blk: 0.4, fg_pct: 0.47, fg3_pct: 0.39, games_played: 78 }
};

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
  const API_KEY = '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6';

  const fetchPlayerStats = async (player: any) => {
    setLoadingStats(true);
    setStats(null);
    const fullName = `${player.first_name} ${player.last_name}`;

    try {
      const seasons = [2025, 2024, 2023];
      let foundData = null;
      for (const season of seasons) {
        const res = await fetch(`https://api.balldontlie.io/v1/season_averages?season=${season}&player_ids[]=${player.id}`, { 
          headers: { 'Authorization': API_KEY } 
        });
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          foundData = data.data[0];
          break;
        }
      }
      if (!foundData && STAR_STATS_BACKUP[fullName]) setStats(STAR_STATS_BACKUP[fullName]);
      else setStats(foundData);
    } catch (e) {
      if (STAR_STATS_BACKUP[fullName]) setStats(STAR_STATS_BACKUP[fullName]);
    }
    setLoadingStats(false);
  };

  const fetchPlayersTerminal = async (nameToSearch: string) => {
    if (!nameToSearch) return;
    setLoading(true);
    setErrorMsg('');
    setPlayers([]);

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
        if (autoName && data.data.length >= 1) {
          setSelectedPlayer(data.data[0]);
          fetchPlayerStats(data.data[0]);
        }
      } else { setErrorMsg("查无此人。"); }
    } catch (e) { setErrorMsg("同步失败。"); }
    setLoading(false);
  };

  useEffect(() => {
    if (autoName) {
      setSearch(autoName);
      fetchPlayersTerminal(autoName);
    }
  }, [autoName]);

  const formatPct = (val: number) => val ? (val * 100).toFixed(1) + '%' : '--';

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
        <button onClick={() => fetchPlayersTerminal(search)} className="bg-blue-600 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20 px-4">
        {players.map((p: any) => {
          const award = PLAYER_AWARDS[`${p.first_name} ${p.last_name}`];
          return (
            <div key={p.id} onClick={() => { setSelectedPlayer(p); fetchPlayerStats(p); }} className="bg-[#16191d] border border-zinc-800 p-6 rounded-3xl hover:border-blue-500 transition-all cursor-pointer group relative overflow-hidden">
              <h3 className="text-2xl font-black italic uppercase leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              {award && <span className={`${award.color} text-white text-[8px] font-black px-2 py-0.5 rounded-full inline-block italic`}>{award.label}</span>}
              <p className="text-zinc-600 font-bold uppercase text-[10px] mt-4">{p.team?.full_name}</p>
            </div>
          );
        })}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          {/* 核心修正：max-h-[90vh] 和 overflow-y-auto */}
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative scrollbar-hide">
            
            {/* 头部：更紧凑 */}
            <div className="bg-blue-600 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden border-b border-white/10 sticky top-0 z-30">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-4 right-6 text-white/50 hover:text-white text-3xl font-light z-40">×</button>
              
              <div className="w-32 h-32 bg-zinc-900 rounded-full flex-shrink-0 border-4 border-white/10 relative z-10 overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center text-4xl font-black italic text-white opacity-20">{selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}</div>
                 <img src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} className="w-full h-full object-cover mt-4 relative z-10" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>

              <div className="text-center md:text-left z-10">
                <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-2">{selectedPlayer.first_name} {selectedPlayer.last_name}</h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                   <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full border border-white/10">
                      <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${getEspnAbbr(selectedPlayer.team?.abbreviation)}.png`} className="w-5 h-5 object-contain" />
                      <span className="font-bold tracking-widest text-[10px] uppercase">{selectedPlayer.team?.full_name}</span>
                   </div>
                   {PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`] && <span className={`${PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].color} text-black px-3 py-1 rounded-full text-[9px] font-black italic shadow-lg`}>{PLAYER_AWARDS[`${selectedPlayer.first_name} ${selectedPlayer.last_name}`].label}</span>}
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-6">
              {/* 身体素质 - 紧凑型 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Height</p>
                  <p className="text-xl font-black italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Weight</p>
                  <p className="text-xl font-black italic">{selectedPlayer.weight || 'N/A'} lbs</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[9px] font-black uppercase mb-1">Jersey</p>
                  <p className="text-xl font-black text-blue-500 italic">#{selectedPlayer.jersey_number || '00'}</p>
                </div>
              </div>

              {/* 数据区 - 更加扁平 */}
              <div className="bg-[#16191d] border border-zinc-800 rounded-[2rem] p-6 shadow-inner text-center">
                <div className="flex justify-between items-center mb-6 px-2">
                   <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Season Performance</h4>
                   <span className="bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">Feed Active</span>
                </div>
                {loadingStats ? (
                  <div className="flex justify-center py-6 animate-spin"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div></div>
                ) : stats ? (
                  <div className="grid grid-cols-5 gap-2">
                    <div><p className="text-3xl font-black italic text-white">{stats.pts}</p><p className="text-[7px] text-blue-500 font-bold mt-1 uppercase">PTS</p></div>
                    <div><p className="text-3xl font-black italic text-white">{stats.reb}</p><p className="text-[7px] text-blue-500 font-bold mt-1 uppercase">REB</p></div>
                    <div><p className="text-3xl font-black italic text-white">{stats.ast}</p><p className="text-[7px] text-blue-500 font-bold mt-1 uppercase">AST</p></div>
                    <div className="opacity-50"><p className="text-2xl font-black italic text-zinc-400">{stats.stl}</p><p className="text-[7px] text-zinc-600 font-bold mt-1 uppercase">STL</p></div>
                    <div className="opacity-50"><p className="text-2xl font-black italic text-zinc-400">{stats.blk}</p><p className="text-[7px] text-zinc-600 font-bold mt-1 uppercase">BLK</p></div>
                  </div>
                ) : <div className="py-6 text-zinc-700 font-black uppercase text-[9px] italic">Data Processing...</div>}
              </div>

              {/* 档案区 - 扁平排列 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left font-black italic border-t border-zinc-900 pt-6">
                 <div className="pl-2 border-l border-zinc-800">
                    <p className="text-[7px] text-zinc-600 uppercase mb-1">Draft</p>
                    <p className="text-xs text-zinc-300 uppercase">{selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}</p>
                 </div>
                 <div className="pl-2 border-l border-zinc-800">
                    <p className="text-[7px] text-zinc-600 uppercase mb-1">Alma Mater</p>
                    <p className="text-xs text-zinc-300 uppercase truncate">{selectedPlayer.college || 'Direct'}</p>
                 </div>
                 <div className="pl-2 border-l border-zinc-800">
                    <p className="text-[7px] text-zinc-600 uppercase mb-1">Country</p>
                    <p className="text-xs text-zinc-300 uppercase">{selectedPlayer.country || 'USA'}</p>
                 </div>
              </div>
              <button onClick={() => setSelectedPlayer(null)} className="w-full bg-zinc-800 py-5 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-zinc-700 transition-all border border-zinc-700/30">Close Dossier</button>
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
      <Suspense fallback={<div className="text-center py-40 animate-pulse font-black text-zinc-600 uppercase">Connecting...</div>}>
        <PlayerTerminalContent />
      </Suspense>
    </div>
  );
}