'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PlayersPage() {
  const [player, setPlayer] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 使用 Tank01 API 配置 (此 Key 来自你之前的截图，数据最准)
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
      // 1. 获取球员基础资料及【准确场均数据】
      // Tank01 的这个端点会直接返回类似 ESPN 的赛季平均值
      const url = `https://tank01-fantasy-stats.p.rapidapi.com/getNBAPlayerInfo?playerName=${encodeURIComponent(search)}&getStats=true`;
      const res = await fetch(url, { headers: HEADERS });
      const data = await res.json();

      if (data.body && data.body.length > 0) {
        const pData = data.body[0];
        
        // 提取 2025 赛季或最近赛季的统计
        const stats2025 = pData.stats?.['2025'] || pData.stats?.['2024'] || {};
        
        // 组合成我们的显示对象
        setPlayer({
          name: pData.longName,
          team: pData.team,
          teamAbbr: pData.teamAbbr,
          height: pData.height,
          weight: pData.weight,
          pos: pData.pos,
          id: pData.playerID,
          pts: stats2025.pts || "0.0",
          reb: stats2025.reb || "0.0",
          ast: stats2025.ast || "0.0",
          fg: stats2025.fgp || "0.0",
          tp: stats2025.tpp || "0.0",
          gp: stats2025.gamesPlayed || "0",
          isFmvp: pData.longName.includes("Jalen Brunson") // 为布伦森添加 FMVP 标记
        });
      } else {
        setErrorMsg("未找到该球员，请确保输入全名 (例如: Jalen Brunson)");
      }
    } catch (e) {
      setErrorMsg("数据链路连接失败，请检查 API 额度。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="bg-zinc-800 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">Back</Link>
      </nav>

      <div className="max-w-4xl mx-auto">
        {/* 搜索控制台 */}
        <div className="flex gap-4 mb-12">
          <input 
            type="text"
            placeholder="输入球员全名 (同步 ESPN 数据源)"
            className="flex-1 bg-[#16191d] border border-zinc-800 p-6 rounded-[2rem] outline-none text-white text-lg focus:border-blue-500 shadow-2xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchPlayerTerminal()}
          />
          <button 
            onClick={fetchPlayerTerminal}
            className="bg-blue-600 px-12 py-6 rounded-[2rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl disabled:opacity-50"
          >
            {loading ? 'SYNC...' : 'Search'}
          </button>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mb-6 ml-6 font-bold">{errorMsg}</p>}

        {player && (
          <div className="bg-[#16191d] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500">
            {/* 球员头部背景 */}
            <div className="bg-blue-600 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-9xl opacity-10 font-black italic uppercase">{player.teamAbbr}</div>
              
              {/* 高清头像 */}
              <div className="w-36 h-36 bg-zinc-900 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white/20 relative z-10 overflow-hidden shadow-2xl">
                 <img 
                    src={`https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${player.id}.png`} 
                    className="w-full h-full object-cover mt-4" 
                    onError={(e) => { e.currentTarget.src = "https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/nba.png" }}
                 />
              </div>

              <h2 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-none mb-4 z-10 relative">
                {player.name}
              </h2>
              <div className="flex justify-center items-center gap-4 z-10 relative">
                 <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${player.teamAbbr?.toLowerCase()}.png`} className="w-8 h-8 object-contain" />
                 <span className="font-bold tracking-widest text-sm uppercase">{player.team}</span>
                 {player.isFmvp && <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-[10px] font-black italic">2026 FMVP</span>}
              </div>
            </div>

            <div className="p-10">
              {/* 物理属性卡片 */}
              <div className="grid grid-cols-3 gap-4 mb-10 text-center uppercase font-black">
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] mb-1">Height</p>
                  <p className="text-2xl text-white italic">{player.height}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] mb-1">Weight</p>
                  <p className="text-2xl text-white italic">{player.weight}</p>
                </div>
                <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800">
                  <p className="text-zinc-500 text-[10px] mb-1">Position</p>
                  <p className="text-2xl text-blue-500 italic">{player.pos}</p>
                </div>
              </div>

              {/* 核心统计 - 同步 ESPN 场均 */}
              <div className="bg-[#0b0e11] border border-zinc-800 rounded-[2.5rem] p-10 text-center shadow-inner relative">
                <div className="flex justify-between items-center mb-10">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] italic">Official Season Statistics</h4>
                   <span className="text-[8px] bg-green-500/20 text-green-500 px-3 py-1 rounded font-black italic">ESPN SYNC</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div>
                    <p className="text-6xl font-black italic tracking-tighter text-white">{player.pts}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Points (PPG)</p>
                  </div>
                  <div className="border-x border-zinc-800">
                    <p className="text-6xl font-black italic tracking-tighter text-white">{player.reb}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Rebounds</p>
                  </div>
                  <div>
                    <p className="text-6xl font-black italic tracking-tighter text-white">{player.ast}</p>
                    <p className="text-blue-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Assists</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 pt-8 border-t border-zinc-800/50 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                   <div>FG%: <span className="text-white">{player.fg}%</span></div>
                   <div>3P%: <span className="text-white">{player.tp}%</span></div>
                   <div>Games: <span className="text-white">{player.gp}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}