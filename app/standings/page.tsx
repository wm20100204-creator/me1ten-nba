import React from 'react';
import Link from 'next/link';

async function getStandings() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '你的_RAPID_API_KEY',
      'x-rapidapi-host': 'api-nba-v1.p.rapidapi.com'
    }
  };
  try {
    const res = await fetch('https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023', options);
    const data = await res.json();
    return data.response || [];
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const data = await getStandings();
  const east = data.filter((s: any) => s.conference.name === 'east').sort((a:any, b:any) => a.conference.rank - b.conference.rank);
  const west = data.filter((s: any) => s.conference.name === 'west').sort((a:any, b:any) => a.conference.rank - b.conference.rank);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-xl font-black italic">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-6 text-sm">
          <Link href="/" className="text-zinc-400 hover:text-white">今日比分</Link>
          <Link href="/standings" className="text-blue-500">联盟排名</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white">球员查询</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <h2 className="text-blue-500 font-black text-2xl mb-6 italic">EASTERN CONFERENCE</h2>
          <div className="bg-[#16191d] rounded-2xl overflow-hidden border border-zinc-800">
            {east.map((team: any) => (
              <div key={team.team.id} className="flex items-center gap-4 p-4 border-b border-zinc-900">
                <span className="text-zinc-600 font-mono w-4">{team.conference.rank}</span>
                <img src={team.team.logo} className="w-6 h-6" />
                <span className="flex-1 font-bold">{team.team.name}</span>
                <span className="text-xs font-mono">{team.win.total}W - {team.loss.total}L</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-red-500 font-black text-2xl mb-6 italic">WESTERN CONFERENCE</h2>
          <div className="bg-[#16191d] rounded-2xl overflow-hidden border border-zinc-800">
            {west.map((team: any) => (
              <div key={team.team.id} className="flex items-center gap-4 p-4 border-b border-zinc-900">
                <span className="text-zinc-600 font-mono w-4">{team.conference.rank}</span>
                <img src={team.team.logo} className="w-6 h-6" />
                <span className="flex-1 font-bold">{team.team.name}</span>
                <span className="text-xs font-mono">{team.win.total}W - {team.loss.total}L</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}