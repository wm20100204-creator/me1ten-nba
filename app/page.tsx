import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const today = formatter.format(new Date()); 

  try {
    const res = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${today}`, {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' },
      next: { revalidate: 30 }
    });
    const data = await res.json();
    return { games: data.data || [], date: today };
  } catch (error) { 
    return { games: [], date: today }; 
  }
}

export default async function Home() {
  const { games, date } = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans overflow-hidden relative">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="text-blue-500 underline underline-offset-8">Live Scores</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Playoffs</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        
        {/* --- 尼克斯总冠军超级横幅 --- */}
        <div className="relative mb-16 group">
          <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full animate-pulse"></div>
          <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-orange-600 p-1 rounded-[3rem] shadow-[0_0_50px_rgba(37,99,235,0.3)]">
            <div className="bg-[#0b0e11]/90 rounded-[2.9rem] p-12 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
              <div className="relative z-10 text-center md:text-left">
                <span className="bg-white text-blue-700 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.3em] mb-6 inline-block">2026 NBA Champions</span>
                <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
                  NEW YORK <br/> <span className="text-orange-500">KNICKS</span>
                </h2>
                <div className="h-[2px] w-24 bg-white/20 mb-6 mx-auto md:mx-0"></div>
                <p className="text-2xl md:text-4xl font-black italic uppercase text-white tracking-tight">
                  🏆 JALEN BRUNSON <span className="text-orange-500 underline decoration-4 underline-offset-8 ml-2">FMVP</span>
                </p>
              </div>
              
              <div className="mt-12 md:mt-0 relative">
                <img src="https://a.espncdn.com/i/teamlogos/nba/500/nyk.png" className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-bounce-slow" />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-orange-500 text-black font-black italic text-xs px-6 py-2 rounded-full shadow-2xl">
                  KNICKS NATION REJOICE
                </div>
              </div>

              {/* 背景装饰字 */}
              <div className="absolute top-0 right-0 p-4 text-[12rem] font-black italic text-white/[0.03] uppercase select-none leading-none">WINNER</div>
            </div>
          </div>
        </div>

        {/* 导航卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <Link href="/playoffs" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-2xl overflow-hidden relative">
            <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400">冠军之路对阵图 →</h3>
            <p className="text-zinc-500 text-sm mt-2">查看尼克斯如何 4-1 击败马刺夺冠</p>
          </Link>
          <Link href="/standings" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-zinc-500 transition-all shadow-2xl overflow-hidden relative">
            <h3 className="text-3xl font-black italic uppercase group-hover:text-zinc-300">球队库详情 →</h3>
            <p className="text-zinc-500 text-sm mt-2">尼克斯 15 人冠军班底深度资料</p>
          </Link>
        </div>

        <h2 className="text-xl font-black italic uppercase mb-10 border-l-4 border-blue-600 pl-6">NBA Activity Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-blue-500 transition-all group">
              <div className="text-[9px] font-black text-zinc-500 mb-8 uppercase tracking-[0.3em] text-center border-b border-zinc-900 pb-4 group-hover:text-blue-400">
                {game.status}
              </div>
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.home_team.abbreviation.toLowerCase()}.png`} className="w-12 h-12 object-contain" />
                    <span className="font-black italic text-xl">{game.home_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic">{game.home_team_score}</span>
                </div>
                <div className="flex justify-between items-center text-zinc-500">
                  <div className="flex items-center gap-4">
                    <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.visitor_team.abbreviation.toLowerCase()}.png`} className="w-12 h-12 opacity-80" />
                    <span className="font-black italic text-xl">{game.visitor_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[4rem]">
              <p className="text-zinc-600 font-black uppercase text-sm italic tracking-widest italic tracking-widest">Post-Season Terminal: NYK Champions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}