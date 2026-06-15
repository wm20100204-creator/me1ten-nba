'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 使用你的 All-Star API Key
  const HEADERS = { 'Authorization': '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6' };

  const fetchPlayersTerminal = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayers([]);

    try {
      // 调用 balldontlie 官方 v1 接口
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(search)}`, { 
        headers: HEADERS 
      });
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setPlayers(data.data);
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
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">Back</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索球员 (例如: Jalen Brunson)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayersTerminal()}
          />
          <button onClick={fetchPlayersTerminal} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50">
            {loading ? 'SYNCING...' : 'Search'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => setSelectedPlayer(p)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl italic">{p.team?.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{p.team?.full_name}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          {/* 这里加宽到了 max-w-5xl，缩短了高度 */}
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            
            {/* 头部：横向布局 */}
            <div className="bg-blue-600 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-[15rem] opacity-5 font-black italic uppercase leading-none select-none">
                {selectedPlayer.team?.abbreviation}
              </div>
              
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl font-light z-30">×</button>
              
              <div className="w-48 h-48 bg-zinc-900 rounded-full flex-shrink-0 border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
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
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-4">
                    {selectedPlayer.first_name} {selectedPlayer.last_name}
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                   <div className="flex items-center gap-3 bg-black/20 px-5 py-2 rounded-full border border-white/10">
                      {/* 修复后的 Logo 逻辑 */}
                      <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${getEspnAbbr(selectedPlayer.team?.abbreviation)}.png`} className="w-8 h-8 object-contain" />
                      <span className="font-black tracking-widest text-sm uppercase">{selectedPlayer.team?.full_name}</span>
                   </div>
                   {selectedPlayer.last_name === "Brunson" && <span className="bg-orange-500 text-black px-4 py-2 rounded-full text-[10px] font-black italic shadow-lg animate-pulse">2026 FINALS MVP</span>}
                </div>
              </div>
            </div>

            <div className="p-10 md:p-12 space-y-10">
              {/* 核心三项：身体数据 */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Height</p>
                  <p className="text-3xl font-black text-white italic">{selectedPlayer.height || 'N/A'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Weight</p>
                  <p className="text-3xl font-black text-white italic">{selectedPlayer.weight || 'N/A'} <span className="text-sm">lbs</span></p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase mb-1">Position</p>
                  <p className="text-3xl font-black text-blue-500 italic">{selectedPlayer.position || 'G-F'}</p>
                </div>
              </div>

              {/* 深度档案：横向排开，缩短高度 */}
              <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-10 relative shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left font-black italic">
                   <div>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2 italic">Draft Status</p>
                      <p className="text-lg text-white uppercase">
                        {selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}
                      </p>
                   </div>
                   <div>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2 italic">College / Home</p>
                      <p className="text-lg text-white uppercase truncate">{selectedPlayer.college || 'Direct Entry'}</p>
                   </div>
                   <div>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2 italic">Country</p>
                      <p className="text-lg text-white uppercase">{selectedPlayer.country || 'USA'}</p>
                   </div>
                   <div>
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-2 italic">Jersey Number</p>
                      <p className="text-lg text-blue-500 uppercase">#{selectedPlayer.jersey_number || '00'}</p>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-black transition-all"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}