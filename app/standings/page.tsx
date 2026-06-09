import React from 'react';
import Link from 'next/link';

async function getTeams() {
  try {
    const res = await fetch('https://api.balldontlie.io/v1/teams', {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' }
    });
    const data = await res.json();
    return data.data.filter((t: any) => t.id <= 30) || [];
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const teams = await getTeams();
  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group overflow-hidden relative">
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-20 h-20 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50">
            {/* 使用 ESPN 大图 CDN */}
            <img 
               src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} 
               className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" 
               alt={t.abbreviation}
            />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2">{t.city} | {t.division}</p>
        </div>
      </div>
      <span className="text-6xl font-black italic opacity-[0.03] absolute right-8 group-hover:opacity-10 transition-opacity uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic uppercase tracking-tighter">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="text-zinc-500 font-black text-[10px] hover:text-white uppercase tracking-[0.3em] border border-zinc-800 px-8 py-3 rounded-full">Back to Home</Link>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-blue-500"></span> Eastern
          </h2>
          <div className="grid gap-6">{east.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-red-600"></span> Western
          </h2>
          <div className="grid gap-6">{west.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>
    </div>
  );
}