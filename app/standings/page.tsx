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
    // 换成这个 API 的排名端点
    const res = await fetch('https://nba-api-free-data.p.rapidapi.com/nba-standings', options);
    const data = await res.json();
    // 该 API 可能返回一个对象，里面有数据数组
    return Array.isArray(data) ? data : (data.response || data.data || []);
  } catch (e) { return []; }
}

export default async function StandingsPage() {
  const teams = await getStandings();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b border-zinc-800 pb-6 text-sm">
        <Link href="/"><h1 className="text-xl font-black italic">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-6">
          <Link href="/" className="text-zinc-500">今日比分</Link>
          <Link href="/standings" className="text-blue-500">联盟排名</Link>
          <Link href="/players" className="text-zinc-500">球员查询</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-black italic uppercase text-center mb-16 tracking-tighter text-zinc-200">NBA STANDINGS</h2>
        
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {teams.map((t: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-[#16191d] border border-zinc-800 p-5 rounded-2xl hover:border-zinc-500 transition-all">
                <div className="flex items-center gap-6">
                  <span className="text-zinc-600 font-mono text-xs w-4">#{idx + 1}</span>
                  <span className="font-bold text-lg">{t.team_name || t.team || "NBA Team"}</span>
                </div>
                <div className="flex gap-10 text-sm font-mono">
                  <span className="text-green-500">W: {t.wins || t.W || 0}</span>
                  <span className="text-red-500">L: {t.losses || t.L || 0}</span>
                  <span className="text-zinc-500">PCT: {t.win_pct || t.PCT || "0.0"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl text-zinc-600 italic">
            数据正在同步中，请稍后再试... (可能已超过 API 免费限额)
          </div>
        )}
      </div>
    </div>
  );
}