import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const today = new Date().toISOString().split('T')[0];
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '你的_RAPID_API_KEY', // 记得填入你的 Key
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };
  try {
    const res = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${today}`, options);
    const data = await res.json();
    return data.response || [];
  } catch (error) { return []; }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-4 md:p-10 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/" className="text-blue-500 border-b border-blue-500">今日比分</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white transition-colors">球员查询</Link>
          <Link href="/standings" className="text-zinc-400 hover:text-white transition-colors">联盟排名</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/players" className="bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition-all">
            <h3 className="text-lg font-bold">进入球员库 →</h3>
            <p className="text-zinc-500 text-xs">查询球员详细身高、体重及场均数据</p>
          </Link>
          <Link href="/standings" className="bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-500 transition-all">
            <h3 className="text-lg font-bold">查看东西部排名 →</h3>
            <p className="text-zinc-500 text-xs">实时同步 NBA 联盟最新排名</p>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">今日赛程</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 rounded-2xl p-6">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">{game.status.long}</span>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={game.teams.home.logo} className="w-8 h-8" />
                      <span className="font-bold">{game.teams.home.name}</span>
                    </div>
                    <span className="text-2xl font-black">{game.scores.home.points || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={game.teams.visitors.logo} className="w-8 h-8" />
                      <span className="font-bold">{game.teams.visitors.name}</span>
                    </div>
                    <span className="text-2xl font-black">{game.scores.visitors.points || 0}</span>
                  </div>
               </div>
            </div>
          )) : <div className="col-span-full py-20 text-center text-zinc-500">今日暂无比赛</div>}
        </div>
      </main>
    </div>
  );
}