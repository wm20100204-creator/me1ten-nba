import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  // 强制使用美国东部日期（NBA 所在地日期）
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
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
      {/* 装饰背景 */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>

      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="text-blue-500 underline underline-offset-8">Live Scores</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12 flex justify-between items-end border-l-4 border-blue-600 pl-6">
           <div>
             <h2 className="text-3xl font-black italic uppercase tracking-tighter">Live Matchups</h2>
             <p className="text-zinc-500 text-[10px] font-bold uppercase mt-2 tracking-widest">NBA Eastern Time: {date}</p>
           </div>
           {games.length > 0 && <span className="bg-red-600 px-4 py-1.5 rounded-full text-[9px] font-black animate-pulse shadow-lg shadow-red-900/20">LIVE DATA FEED</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.length > 0 ? games.map((game: any) => (
            <div key={game.id} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl transition-all hover:border-blue-500 group">
              <div className="text-[9px] font-bold text-zinc-500 mb-8 uppercase tracking-[0.3em] text-center border-b border-zinc-900 pb-4 group-hover:text-blue-400 transition-colors">
                {game.status}
              </div>
              <div className="space-y-8">
                {/* 主队 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <img 
                      src={`https://cdn.nba.com/logos/nba/${game.home_team.id}/primary/L/logo.svg`} 
                      className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" 
                      alt="logo"
                    />
                    <span className="font-black italic text-2xl uppercase tracking-tighter">{game.home_team.abbreviation}</span>
                  </div>
                  <span className="text-5xl font-black italic tracking-tighter">{game.home_team_score}</span>
                </div>
                {/* 客队 */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-zinc-400">
                    <img 
                      src={`https://cdn.nba.com/logos/nba/${game.visitor_team.id}/primary/L/logo.svg`} 
                      className="w-14 h-14 object-contain opacity-70 group-hover:opacity-100 transition-all" 
                      alt="logo"
                    />
                    <span className="font-black italic text-2xl uppercase tracking-tighter">{game.visitor_team.abbreviation}</span>
                  </div>
                  <span className="text-5xl font-black italic tracking-tighter text-zinc-500">{game.visitor_team_score}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-900 rounded-[4rem]">
              <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-sm">NBA OFF-DAY / NO GAMES</p>
              <p className="text-zinc-700 text-[10px] mt-4 uppercase font-bold tracking-widest italic">Check back during Finals or next scheduled day ({date})</p>
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-40 pt-8 border-t border-zinc-900 text-center">
         <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.5em]">Me1ten Stats Terminal • Professional Series • 2026</p>
      </footer>
    </div>
  );
}