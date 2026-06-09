import React from 'react';
import Link from 'next/link';

async function getTeams() {
  try {
    const res = await fetch('https://api.balldontlie.io/v1/teams', {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' }
    });
    const data = await res.json();
    return data.data || [];
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const teams = await getTeams();
  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-3xl hover:border-blue-500 transition-all shadow-xl group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center font-black italic text-xl border border-zinc-800 group-hover:text-blue-500 transition-colors">
          {t.abbreviation}
        </div>
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{t.city} | {t.division}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 text-[10px] font-black uppercase tracking-widest">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.STATS</span></h1></Link>
        <div className="flex gap-8">
           <Link href="/" className="text-zinc-500 hover:text-white transition-colors">Home</Link>
           <Link href="/standings" className="text-blue-500">Standings</Link>
           <Link href="/players" className="text-zinc-500 hover:text-white transition-colors">Players</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        <section>
          <h2 className="text-2xl font-black italic text-blue-500 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
             <span className="w-10 h-[2px] bg-blue-500"></span> Eastern Conference
          </h2>
          <div className="grid gap-4">
            {east.map((t: any) => <TeamCard key={t.id} t={t} />)}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-black italic text-red-600 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
             <span className="w-10 h-[2px] bg-red-600"></span> Western Conference
          </h2>
          <div className="grid gap-4">
            {west.map((t: any) => <TeamCard key={t.id} t={t} />)}
          </div>
        </section>
      </div>
    </div>
  );
}