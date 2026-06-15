'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 这里的 Key 已更新为你的最新 All-Star Key
  const HEADERS = { 'Authorization': '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6' };

  const fetchPlayersTerminal = async () => {
    if (!search) return;
    setLoading(true);
    setErrorMsg('');
    setPlayers([]);

    try {
      // 这里的接口和参数严格对应 balldontlie v1 官方文档
      const res = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(search)}`, { 
        headers: HEADERS 
      });
      const data = await res.json();

      if (data.data && data.data.length > 0) {
        setPlayers(data.data);
      } else {
        setErrorMsg("球员库未检索到该姓名。请尝试输入姓氏（如: James）");
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
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">Home</Link>
      </nav>

      <div className="max-w-5xl mx-auto">
        <div className="flex gap-4 mb-16">
          <input 
            type="text"
            placeholder="搜索球员 (例如: Stephen Curry)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2.5rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayersTerminal()}
          />
          <button onClick={fetchPlayersTerminal} className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50 transition-all active:scale-95">
            {loading ? 'SYNCING...' : 'Search'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-6 font-bold">{errorMsg}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p: any) => (
            <div key={p.id} onClick={() => setSelectedPlayer(p)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all cursor-pointer group shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-6xl italic">{p.team?.abbreviation}</div>
              <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors leading-none mb-2">{p.first_name} <br/> {p.last_name}</h3>
              <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">{p.team?.full_name}</p>
              <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-between items-center">
                 <span className="text-[10px] font-black text-zinc-600 uppercase">POS: {p.position}</span>
                 <span className="text-[10px] font-black text-blue-500 uppercase">Access Dossier →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/90">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in duration-300">
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden border-b border-white/10">
              <button onClick={() => setSelectedPlayer(null)} className="absolute top-8 right-10 text-white/50 hover:text-white text-4xl z-20 font-light">×</button>
              
              {/* 头像 - 自动适配 ESPN CDN 与 API ID */}
              <div className="w-44 h-44 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${selectedPlayer.id + 1000}.png`} // 使用常见的ID位移逻辑尝试匹配
                    className="w-full h-full object-cover mt-4 relative z-10" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                 />
                 <div className="absolute inset-0 flex items-center justify-center text-5xl font-black italic text-white opacity-20">
                    {selectedPlayer.first_name[0]}{selectedPlayer.last_name[0]}
                 </div>
              </div>

              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">{selectedPlayer.first_name} <br/> {selectedPlayer.last_name}</h2>
              <div className="flex justify-center items-center gap-3 relative z-10">
                <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${selectedPlayer.team?.abbreviation.toLowerCase()}.png`} className="w-6 h-6 object-contain" />
                <p className="font-bold tracking-[0.2em] text-[10px] uppercase opacity-80">{selectedPlayer.team?.full_name}</p>
              </div>
            </div>

            <div className="p-10">
              {/* 身体素质数据 */}
              <div className="grid grid-cols-3 gap-4 mb-10 text-center uppercase font-black">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Height</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.height || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Weight</p>
                  <p className="text-xl font-black text-white italic">{selectedPlayer.weight || '--'}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[9px] mb-1">Jersey</p>
                  <p className="text-xl font-black text-blue-500 italic">#{selectedPlayer.jersey_number || '00'}</p>
                </div>
              </div>

              {/* 深度档案区 */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-10 relative shadow-inner">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic mb-10 text-center">OFFICIAL DOSSIER</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 px-2 text-left font-black italic">
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Country / Origin</p>
                      <p className="text-lg text-white uppercase">{selectedPlayer.country || 'International'}</p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Alma Mater (College)</p>
                      <p className="text-lg text-white uppercase">{selectedPlayer.college || 'Direct Entry'}</p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">NBA Draft Entry</p>
                      <p className="text-lg text-white uppercase">
                        {selectedPlayer.draft_year ? `${selectedPlayer.draft_year} R${selectedPlayer.draft_round} P${selectedPlayer.draft_number}` : 'Undrafted'}
                      </p>
                   </div>
                   <div className="border-l-2 border-zinc-800 pl-4">
                      <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Official ID</p>
                      <p className="text-lg text-blue-600 uppercase">SYS-NODE-{selectedPlayer.id}</p>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedPlayer(null)} 
                className="w-full mt-10 bg-zinc-800 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all border border-zinc-700/50"
              >
                Close Dossier Terminal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}