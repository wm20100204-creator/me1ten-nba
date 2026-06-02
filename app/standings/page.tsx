import React from 'react';
import Link from 'next/link';

async function getStandings() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };
  try {
    const res = await fetch('https://tank01-fantasy-stats.p.rapidapi.com/getNBAStandings?season=2025', options);
    const data = await res.json();
    return data.body || {}; 
  } catch (e) { return {}; }
}

export default async function StandingsPage() {
  const standings = await getStandings();
  const east = standings.East || [];
  const west = standings.West || [];

  const TeamRow = ({ team, rank }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-zinc-900 hover:bg-zinc-900 transition-colors">
      <div className="flex items-center gap-4">
        <span className="text-zinc-600 font-mono text-xs w-4">#{rank}</span>
        <span className="font-bold uppercase italic text-sm tracking-tight">{team.name}</span>
      </div>
      <div className="flex gap-6 font-mono text-xs font-bold uppercase">
        <span className="text-green-500">{team.wins}W</span>
        <span className="text-red-500">{team.loss}L</span>
        <span className="text-zinc-500">{team.winPct}%</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <Link href="/" className="hover:text-white">Home</Link>
           <Link href="/standings" className="text-blue-500">Standings</Link>
           <Link href="/players" className="hover:text-white">Players</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-black italic text-blue-500 mb-6 uppercase tracking-widest border-l-4 border-blue-500 pl-4">Eastern Conference</h2>
          <div className="bg-[#16191d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            {east.map((t: any, i: number) => <TeamRow key={i} team={t} rank={i+1} />)}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-black italic text-red-500 mb-6 uppercase tracking-widest border-l-4 border-red-500 pl-4">Western Conference</h2>
          <div className="bg-[#16191d] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            {west.map((t: any, i: number) => <TeamRow key={i} team={t} rank={i+1} />)}
          </div>
        </section>
      </div>
    </div>
  );
}