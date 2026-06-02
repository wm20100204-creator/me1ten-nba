import React from 'react';
import Link from 'next/link';

async function getStandings() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };

  // 尝试的年份列表：先看最新的，没有就看去年的
  const seasons = ['2025', '2024'];
  
  for (const season of seasons) {
    try {
      const res = await fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBAStandings?season=${season}`, options);
      const data = await res.json();
      
      // 检查是否有数据
      if (data.body && (data.body.East || data.body.West)) {
        return {
          data: data.body,
          season: season
        };
      }
    } catch (e) {
      console.error(`Season ${season} fetch failed:`, e);
    }
  }
  return { data: null, season: null };
}

export default async function StandingsPage() {
  const { data, season } = await getStandings();

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0b0e11] text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4 uppercase">Data Terminal Offline</h2>
          <p className="text-zinc-500 mb-8">API 暂未返回当前赛季排名，请稍后再试或检查额度。</p>
          <Link href="/" className="bg-blue-600 px-8 py-3 rounded-full font-bold">返回主页</Link>
        </div>
      </div>
    );
  }

  const east = data.East || [];
  const west = data.West || [];

  const TeamRow = ({ team, rank }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors group">
      <div className="flex items-center gap-4">
        <span className="text-zinc-600 font-mono text-xs w-4">#{rank}</span>
        <span className="font-black italic text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{team.name}</span>
      </div>
      <div className="flex gap-6 font-mono text-xs font-bold uppercase">
        <span className="text-green-500">{team.wins}W</span>
        <span className="text-red-500">{team.loss}L</span>
        <span className="text-zinc-500">{team.winPct}%</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <Link href="/standings" className="text-blue-500">Standings</Link>
           <Link href="/players" className="hover:text-white transition-colors">Players</Link>
           <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">NBA Standings</h2>
            <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Season {season}-{parseInt(season!) + 1} Terminal</p>
          </div>
          <div className="bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
            Live Feed: Active
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 东部 */}
          <section>
            <h3 className="text-xl font-black italic text-blue-500 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-500"></span> Eastern Conference
            </h3>
            <div className="bg-[#16191d] border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
              {east.map((t: any, i: number) => <TeamRow key={i} team={t} rank={i+1} />)}
            </div>
          </section>

          {/* 西部 */}
          <section>
            <h3 className="text-xl font-black italic text-red-500 mb-6 uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-[2px] bg-red-500"></span> Western Conference
            </h3>
            <div className="bg-[#16191d] border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl">
              {west.map((t: any, i: number) => <TeamRow key={i} team={t} rank={i+1} />)}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}