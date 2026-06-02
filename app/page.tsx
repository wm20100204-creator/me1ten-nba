import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  // Tank01 日期格式需要是 YYYYMMDD，比如 20260602
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };

  try {
    const res = await fetch(`https://tank01-fantasy-stats.p.rapidapi.com/getNBAGamesForDate?gameDate=${dateStr}`, options);
    const data = await res.json();
    return data.body || []; 
  } catch (error) { return []; }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1>
          <p className="text-[9px] text-zinc-600 tracking-[0.5em] uppercase mt-2">Tank01 Professional Engine</p>
        </div>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/players" className="hover:text-blue-500 transition-colors">Players</Link>
          <Link href="/standings" className="hover:text-blue-500 transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Link href="/players" className="group bg-[#16191d] border border-zinc-800 p-12 rounded-[3rem] hover:border-blue-500 transition-all shadow-2xl">
            <h3 className="text-4xl font-black italic uppercase group-hover:text-blue-400 mb-4">球员档案库 →</h3>
            <p className="text-zinc-500 text-sm font-medium">获取最准确的身高、体重、选秀及伤病报告。</p>
          </Link>
          <Link href="/standings" className="group bg-[#16191d] border border-zinc-800 p-12 rounded-[3rem] hover:border-blue-500 transition-all shadow-2xl">
            <h3 className="text-4xl font-black italic uppercase group-hover:text-blue-400 mb-4">实时排行榜 →</h3>
            <p className="text-zinc-500 text-sm font-medium">全联盟 30 支球队战绩及胜率深度统计。</p>
          </Link>
        </div>

        <h2 className="text-2xl font-black italic uppercase mb-10 border-l-4 border-blue-600 pl-6">Today's Matchups</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.gameID} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
               <div className="text-[10px] font-bold text-zinc-600 mb-8 uppercase tracking-widest text-center border-b border-zinc-900 pb-4">
                 {game.gameStatus}
               </div>
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <span className="font-black italic text-xl uppercase">{game.home}</span>
                    <span className="text-4xl font-black italic">{game.homePts || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="font-black italic text-xl uppercase">{game.away}</span>
                    <span className="text-4xl font-black italic">{game.awayPts || '0'}</span>
                  </div>
               </div>
            </div>
          )) : <div className="col-span-full py-24 text-center text-zinc-700 font-bold uppercase tracking-widest border-2 border-dashed border-zinc-900 rounded-[3rem]">No Live Data Available</div>}
        </div>
      </main>
    </div>
  );
}