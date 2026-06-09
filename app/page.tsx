import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const today = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${today}`, {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' },
      next: { revalidate: 30 } // 专业版支持更高频率刷新
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) { return []; }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter text-white">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest">
          <Link href="/" className="text-blue-500">Scores</Link>
          <Link href="/players" className="text-zinc-500 hover:text-white transition-colors">Players Search</Link>
          <Link href="/standings" className="text-zinc-500 hover:text-white transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <Link href="/players" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-2xl">
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Professional Database</span>
            <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors">查询球员库 →</h3>
            <p className="text-zinc-500 text-sm mt-2">获取 100% 准确的身高、体重及赛季场均统计。</p>
          </Link>
          <Link href="/standings" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-zinc-500 transition-all shadow-2xl">
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">League Rankings</span>
            <h3 className="text-3xl font-black italic uppercase group-hover:text-white transition-colors">联盟排名 →</h3>
            <p className="text-zinc-500 text-sm mt-2">实时监控东西部 30 支球队战绩统计。</p>
          </Link>
        </div>

        <h2 className="text-2xl font-black italic uppercase mb-10 flex items-center gap-3">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          Live Matchups
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2rem] shadow-xl">
              <div className="text-[10px] font-bold text-zinc-600 mb-6 uppercase tracking-widest text-center border-b border-zinc-900 pb-4">
                {game.status}
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="font-black italic text-xl uppercase tracking-tighter">{game.home_team.abbreviation}</span>
                  <span className="text-4xl font-black italic">{game.home_team_score}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <span className="font-black italic text-xl uppercase tracking-tighter">{game.visitor_team.abbreviation}</span>
                  <span className="text-4xl font-black italic">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] text-zinc-700 font-bold uppercase tracking-widest">
              No Games Scheduled Today
            </div>
          )}
        </div>
      </main>
    </div>
  );
}