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
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="text-blue-500 underline underline-offset-8">Live Scores</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Playoffs</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        {/* 新增的大卡片：季后赛专题 */}
        <Link href="/playoffs" className="block mb-12 group">
           <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-1 rounded-[3rem] shadow-2xl transition-all hover:scale-[1.01]">
              <div className="bg-[#111317] rounded-[2.9rem] p-10 flex flex-col md:flex-row justify-between items-center overflow-hidden relative">
                 <div className="relative z-10">
                    <span className="bg-blue-500 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block text-white">Special Event</span>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-2">2026 NBA Playoffs</h3>
                    <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">查看季后赛树状对阵图与系列赛比分 →</p>
                 </div>
                 <div className="mt-8 md:mt-0 opacity-20 group-hover:opacity-100 transition-all duration-700">
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/nba.png" className="w-32 h-32 object-contain grayscale invert" />
                 </div>
                 <div className="absolute top-0 right-0 p-4 text-9xl font-black italic text-white/[0.02] uppercase select-none">BRACKET</div>
              </div>
           </div>
        </Link>

        <div className="mb-12 border-l-4 border-blue-600 pl-6">
             <h2 className="text-2xl font-black italic uppercase tracking-tighter">Live Matchups</h2>
             <p className="text-zinc-500 text-[10px] font-bold uppercase mt-1 tracking-widest">Current Date: {date}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
              <div className="text-[9px] font-black text-zinc-500 mb-8 uppercase tracking-[0.3em] text-center border-b border-zinc-900 pb-4">
                {game.status}
              </div>
              <div className="space-y-8 text-center">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.home_team.abbreviation.toLowerCase()}.png`} className="w-12 h-12" />
                    <span className="font-black italic text-xl">{game.home_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic">{game.home_team_score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.visitor_team.abbreviation.toLowerCase()}.png`} className="w-12 h-12 opacity-80" />
                    <span className="font-black italic text-xl text-zinc-400">{game.visitor_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic text-zinc-400">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-800 rounded-[4rem]">
              <p className="text-zinc-600 font-black uppercase text-sm italic tracking-widest">Waiting for next tip-off</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}