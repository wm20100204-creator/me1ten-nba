import React from 'react';
import Link from 'next/link';

async function getTeams() {
  try {
    const res = await fetch('https://api.balldontlie.io/v1/teams', {
      headers: { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' }
    });
    const data = await res.json();
    // 过滤只保留 NBA 正式 30 支球队 (ID 1-30)
    return data.data.filter((t: any) => t.id <= 30) || [];
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const teams = await getTeams();
  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2rem] hover:border-blue-500 transition-all shadow-xl group overflow-hidden relative">
      <div className="flex items-center gap-6 relative z-10">
        <img 
           src={`https://www.nba.com/assets/logos/teams/primary/full/${t.abbreviation}.svg`} 
           className="w-14 h-14 object-contain group-hover:scale-110 transition-transform" 
        />
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{t.city} | {t.division}</p>
        </div>
      </div>
      <span className="text-4xl font-black italic opacity-5 absolute right-6 group-hover:opacity-20 transition-opacity uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic uppercase tracking-tighter">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="text-zinc-500 font-bold text-xs hover:text-white uppercase tracking-widest">Back to Terminal</Link>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-12 h-[3px] bg-blue-500"></span> Eastern
          </h2>
          <div className="grid gap-4">
            {east.map((t: any) => <TeamCard key={t.id} t={t} />)}
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-12 h-[3px] bg-red-600"></span> Western
          </h2>
          <div className="grid gap-4">
            {west.map((t: any) => <TeamCard key={t.id} t={t} />)}
          </div>
        </section>
      </div>
    </div>
  );
}