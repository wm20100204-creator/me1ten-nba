import React from 'react';
import Link from 'next/link';

async function getNBAGames() {
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c2503628dcmsh417bcf8ffac6e71p138e41jsne69c13e1926f',
      'x-rapidapi-host': 'nba-api-free-data.p.rapidapi.com'
    }
  };

  try {
    // 这个 API 的获取比分路径通常是 /games
    const res = await fetch('https://nba-api-free-data.p.rapidapi.com/nba-player-stats', options); 
    const data = await res.json();
    return data || []; 
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-4 md:p-10 font-sans">
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter">ME1TEN<span className="text-blue-500">.COM</span></h1></Link>
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/" className="text-blue-500 border-b border-blue-500 pb-1">今日比分</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white transition-colors">球员查询</Link>
          <Link href="/standings" className="text-zinc-400 hover:text-white transition-colors">联盟排名</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/players" className="bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition-all">
            <h3 className="text-lg font-bold">进入球员库 →</h3>
            <p className="text-zinc-500 text-xs mt-1">查询杜兰特、库里等详细身高体重</p>
          </Link>
          <Link href="/standings" className="bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-500 transition-all">
            <h3 className="text-lg font-bold">联盟排名系统 →</h3>
            <p className="text-zinc-500 text-xs mt-1">东西部战绩实时监控</p>
          </Link>
        </div>

        <h2 className="text-xl font-bold mb-8">最新动态记录</h2>
        <div className="text-zinc-500 text-sm italic">
          数据已连接至 RapidAPI: nba-api-free-data
        </div>
      </main>
    </div>
  );
}