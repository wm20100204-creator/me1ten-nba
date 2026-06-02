import React from 'react';
import Link from 'next/link';

async function getStandings() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
    }
  };
  try {
    const res = await fetch('https://nba-api-free-data.p.rapidapi.com/nba-standings', options);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const teams = await getStandings();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 text-sm font-bold uppercase">
        <Link href="/"><h1 className="text-xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-8">
          <Link href="/" className="text-zinc-500 hover:text-white transition-colors">HOME</Link>
          <Link href="/standings" className="text-blue-500">STANDINGS</Link>
          <Link href="/players" className="text-zinc-500 hover:text-white transition-colors">PLAYERS</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-black italic uppercase text-center mb-12 tracking-tighter">NBA Standings</h2>
        {teams.length > 0 ? (
          <div className="space-y-3">
            {teams.map((t: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-[#16191d] border border-zinc-800 p-5 rounded-2xl hover:border-blue-500 transition-all group">
                <div className="flex items-center gap-6">
                  <span className="text-zinc-600 font-mono text-xs w-4">#{idx + 1}</span>
                  <span className="font-black italic text-lg uppercase group-hover:text-blue-400 transition-colors">{t.team_name}</span>
                </div>
                <div className="flex gap-8 font-mono text-xs font-bold tracking-widest uppercase">
                  <span className="text-green-500">W {t.wins}</span>
                  <span className="text-red-500">L {t.losses}</span>
                  <span className="text-zinc-500">PCT {t.win_pct}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
            暂无排名数据，请检查 API 额度
          </div>
        )}
      </div>
    </div>
  );
}