import React from 'react';
import Link from 'next/link';

async function getTeams() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'tank01-fantasy-stats.p.rapidapi.com'
    }
  };
  try {
    const res = await fetch('https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams', options);
    const data = await res.json();
    return data.body || [];
  } catch (e) { return []; }
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 relative z-10">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <Link href="/" className="text-zinc-500 text-xs font-bold border border-zinc-800 px-6 py-2 rounded-full">BACK</Link>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team: any) => (
          <div key={team.teamID} className="bg-[#16191d] border border-zinc-800 p-8 rounded-3xl hover:border-blue-500 transition-all shadow-2xl group">
             <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center text-xl font-black italic border border-zinc-800 group-hover:text-blue-500 transition-colors">
                  {team.abbreviation}
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{team.conference}</span>
             </div>
             <h3 className="text-2xl font-black italic uppercase leading-none mb-2">{team.teamName}</h3>
             <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">{team.city} | {team.division}</p>
          </div>
        ))}
      </div>
    </div>
  );
}