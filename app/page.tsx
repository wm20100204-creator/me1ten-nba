import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const today = new Date().toISOString().split('T')[0];
  try {
    const res = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${today}`, {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' },
      next: { revalidate: 30 }
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
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
          <Link href="/" className="text-blue-500">Live Scores</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-500">
              <div className="text-[10px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.3em] text-center border-b border-zinc-900 pb-4">
                {game.status}
              </div>
              <div className="space-y-8">
                {/* 主队 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://www.nba.com/assets/logos/teams/primary/full/${game.home_team.abbreviation}.svg`} 
                      className="w-12 h-12 object-contain" 
                      alt="logo"
                    />
                    <span className="font-black italic text-xl uppercase">{game.home_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic">{game.home_team_score}</span>
                </div>
                {/* 客队 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://www.nba.com/assets/logos/teams/primary/full/${game.visitor_team.abbreviation}.svg`} 
                      className="w-12 h-12 object-contain opacity-80" 
                      alt="logo"
                    />
                    <span className="font-black italic text-xl uppercase text-zinc-400">{game.visitor_team.abbreviation}</span>
                  </div>
                  <span className="text-4xl font-black italic text-zinc-400">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-900 rounded-[3rem] text-zinc-600 font-black uppercase tracking-widest">
              No Games scheduled for this terminal today
            </div>
          )}
        </div>
      </main>
    </div>
  );
}