import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans relative overflow-hidden">
      {/* 装饰背景 */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">
            ME1TEN<span className="text-blue-500">.STATS</span>
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-[0.4em] uppercase mt-1 text-center md:text-left">NBA Intelligence Terminal</p>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <Link href="/" className="text-blue-500">Dashboard</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4 leading-none">
            Elite NBA <br />Data Engine
          </h2>
          <p className="text-zinc-500 max-w-xl text-sm leading-relaxed">
            接入全球领先的 RapidAPI 实时数据源。提供最精准的球员物理资料、场均表现及东西部联盟即时排名。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 球员库入口 */}
          <Link href="/players" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 font-black italic uppercase text-white">DB</div>
            <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Research Center</span>
            <h3 className="text-3xl font-black italic uppercase group-hover:text-blue-400 transition-colors">查询球员库 →</h3>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed max-w-[250px]">
              实时检索全联盟球员的身高、体重及职业生涯数据。
            </p>
          </Link>

          {/* 排名入口 */}
          <Link href="/standings" className="group bg-[#16191d] border border-zinc-800 p-10 rounded-[2.5rem] hover:border-zinc-500 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 font-black italic uppercase text-white">RANK</div>
            <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Alliance Status</span>
            <h3 className="text-3xl font-black italic uppercase group-hover:text-zinc-300 transition-colors">东西部排名 →</h3>
            <p className="text-zinc-500 text-sm mt-4 leading-relaxed max-w-[250px]">
              实时监控 NBA 联盟各球队胜率、排名及近期战绩。
            </p>
          </Link>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-32 pt-8 border-t border-zinc-900 text-[10px] text-zinc-700 uppercase tracking-widest flex justify-between items-center">
        <span>© 2026 ME1TEN.COM DATA TERMINAL</span>
        <span>Powered by RapidAPI</span>
      </footer>
    </div>
  );
}