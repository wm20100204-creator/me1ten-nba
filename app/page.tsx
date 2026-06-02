import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const today = new Date().toISOString().split('T')[0];
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '你的_RAPID_API_KEY_粘贴在这里',
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const res = await fetch(`https://api-nba-v1.p.rapidapi.com/games?date=${today}`, options);
    const data = await res.json();
    return data.response || []; // API-NBA 的返回字段是 response
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-4 md:p-10 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black tracking-tighter">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-blue-500">今日比分</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white">球员列表</Link>
          <Link href="/teams" className="text-zinc-400 hover:text-white">球队库</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">今日赛程 <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full animate-pulse">LIVE</span></h2>
        
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="bg-[#16191d] border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                   <span className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase tracking-widest">{game.status.long}</span>
                </div>
                <div className="space-y-6">
                  {/* 主队 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={game.teams.home.logo} className="w-10 h-10 object-contain" />
                      <span className="text-lg font-bold">{game.teams.home.name}</span>
                    </div>
                    <span className="text-3xl font-mono font-black">{game.scores.home.points || 0}</span>
                  </div>
                  {/* 客队 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={game.teams.visitors.logo} className="w-10 h-10 object-contain" />
                      <span className="text-lg font-bold">{game.teams.visitors.name}</span>
                    </div>
                    <span className="text-3xl font-mono font-black">{game.scores.visitors.points || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-500">今日暂无比赛</div>
        )}
      </main>
    </div>
  );
}