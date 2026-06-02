import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, ''); // 格式化为 YYYYMMDD
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
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/" className="text-blue-500">Home</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
          <Link href="/teams" className="hover:text-white transition-colors">Teams</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Link href="/players" className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all shadow-xl group">
             <h3 className="text-xl font-black italic uppercase group-hover:text-blue-400">球员库搜索 →</h3>
             <p className="text-zinc-600 text-xs mt-2 font-medium">精准物理属性与档案</p>
          </Link>
          <Link href="/standings" className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all shadow-xl group">
             <h3 className="text-xl font-black italic uppercase group-hover:text-blue-400">联盟排行榜 →</h3>
             <p className="text-zinc-600 text-xs mt-2 font-medium">实时战绩与胜率统计</p>
          </Link>
          <Link href="/teams" className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all shadow-xl group">
             <h3 className="text-xl font-black italic uppercase group-hover:text-blue-400">球队库详情 →</h3>
             <p className="text-zinc-600 text-xs mt-2 font-medium">NBA 30 支球队资料</p>
          </Link>
        </div>

        <h2 className="text-xl font-black italic uppercase mb-10 text-zinc-300">Today's Live Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.gameID} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2rem]">
               <p className="text-[9px] font-bold text-zinc-600 mb-6 uppercase tracking-widest text-center">{game.gameStatus}</p>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">{game.home}</span>
                    <span className="text-3xl font-black italic">{game.homePts || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-500">
                    <span className="font-bold text-lg">{game.away}</span>
                    <span className="text-3xl font-black italic">{game.awayPts || 0}</span>
                  </div>
               </div>
            </div>
          )) : <div className="col-span-full py-20 text-center text-zinc-600 italic border border-dashed border-zinc-900 rounded-3xl">今日比赛暂未开始或已结束</div>}
        </div>
      </main>
    </div>
  );
}