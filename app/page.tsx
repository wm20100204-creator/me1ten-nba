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
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="text-blue-500 underline underline-offset-8">Live Scores</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 border-l-4 border-blue-600 pl-6 text-left">
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">NBA Matchups</h2>
             <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-[0.2em]">NY TIME: {date}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl hover:border-blue-500 transition-all">
              <div className="text-[9px] font-black text-zinc-500 mb-8 uppercase tracking-[0.3em] text-center border-b border-zinc-900 pb-4">
                {game.status}
              </div>
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {/* 使用 ESPN 极速 CDN */}
                    <img 
                      src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.home_team.abbreviation.toLowerCase()}.png`} 
                      className="w-14 h-14 object-contain" 
                      alt="logo"
                    />
                    <span className="font-black italic text-2xl tracking-tighter">{game.home_team.abbreviation}</span>
                  </div>
                  <span className="text-5xl font-black italic">{game.home_team_score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-zinc-500">
                    <img 
                      src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${game.visitor_team.abbreviation.toLowerCase()}.png`} 
                      className="w-14 h-14 object-contain opacity-70" 
                      alt="logo"
                    />
                    <span className="font-black italic text-2xl tracking-tighter">{game.visitor_team.abbreviation}</span>
                  </div>
                  <span className="text-5xl font-black italic text-zinc-500">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-24 text-center border-2 border-dashed border-zinc-900 rounded-[4rem]">
              <p className="text-zinc-600 font-black uppercase text-sm italic tracking-widest">OFF-SEASON / NO LIVE GAMES</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}