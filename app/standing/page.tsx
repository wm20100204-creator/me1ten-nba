import React from 'react';
import Link from 'next/link';

async function getTeamsData() {
  const res = await fetch('https://api.balldontlie.io/v1/teams', {
    headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' },
    next: { revalidate: 3600 } // 球队信息变动小，一小时刷新一次即可
  });
  const data = await res.json();
  return data.data;
}

export default async function StandingsPage() {
  const teams = await getTeamsData();
  
  // 将球队分为东部和西部
  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-xl font-black">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-zinc-400 hover:text-white">今日比分</Link>
          <Link href="/standings" className="text-blue-500 border-b border-blue-500">联盟排名</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white">球员列表</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center tracking-tight">NBA 联盟分组列表</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 东部 */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b-2 border-blue-600 pb-2 w-fit">
              <span className="text-2xl font-black italic">EASTERN</span>
              <span className="text-blue-500 text-sm font-bold uppercase tracking-widest">Conference</span>
            </div>
            <div className="bg-[#16191d] rounded-2xl overflow-hidden border border-zinc-800">
              {east.map((t: any) => (
                <div key={t.id} className="flex items-center gap-4 p-4 border-b border-zinc-900 hover:bg-zinc-900 transition-colors">
                  <img src={`https://www.nba.com/assets/logos/teams/primary/full/${t.abbreviation}.svg`} className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <p className="font-bold">{t.full_name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{t.city} | {t.division}</p>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono">{t.abbreviation}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 西部 */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b-2 border-red-600 pb-2 w-fit">
              <span className="text-2xl font-black italic">WESTERN</span>
              <span className="text-red-500 text-sm font-bold uppercase tracking-widest">Conference</span>
            </div>
            <div className="bg-[#16191d] rounded-2xl overflow-hidden border border-zinc-800">
              {west.map((t: any) => (
                <div key={t.id} className="flex items-center gap-4 p-4 border-b border-zinc-900 hover:bg-zinc-900 transition-colors">
                  <img src={`https://www.nba.com/assets/logos/teams/primary/full/${t.abbreviation}.svg`} className="w-8 h-8 object-contain" />
                  <div className="flex-1">
                    <p className="font-bold">{t.full_name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase">{t.city} | {t.division}</p>
                  </div>
                  <span className="text-xs text-zinc-600 font-mono">{t.abbreviation}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}