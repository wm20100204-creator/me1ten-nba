'use client';

import React from 'react';
import Link from 'next/link';

// NBA 官方 2025-26 赛季季后赛模拟对阵数据
const PLAYOFF_DATA_2026 = {
  east: {
    r1: [
      { top: { name: 'BOS', rank: 1 }, bot: { name: 'MIA', rank: 8 }, score: "4-1" },
      { top: { name: 'NYK', rank: 2 }, bot: { name: 'PHI', rank: 7 }, score: "4-2" },
      { top: { name: 'MIL', rank: 3 }, bot: { name: 'IND', rank: 6 }, score: "3-4" },
      { top: { name: 'CLE', rank: 4 }, bot: { name: 'ORL', rank: 5 }, score: "4-2" },
    ],
    r2: [
      { top: { name: 'BOS' }, bot: { name: 'CLE' }, score: "4-1" },
      { top: { name: 'NYK' }, bot: { name: 'IND' }, score: "4-3" },
    ],
    cf: [
      { top: { name: 'BOS' }, bot: { name: 'NYK' }, score: "2-4" }
    ],
  },
  west: {
    r1: [
      { top: { name: 'OKC', rank: 1 }, bot: { name: 'GSW', rank: 8 }, score: "4-0" },
      { top: { name: 'DEN', rank: 2 }, bot: { name: 'LAL', rank: 7 }, score: "4-1" },
      { top: { name: 'MIN', rank: 3 }, bot: { name: 'PHX', rank: 6 }, score: "4-0" },
      { top: { name: 'LAC', rank: 4 }, bot: { name: 'SAS', rank: 5 }, score: "3-4" },
    ],
    r2: [
      { top: { name: 'OKC' }, bot: { name: 'SAS' }, score: "3-4" },
      { top: { name: 'DEN' }, bot: { name: 'MIN' }, score: "4-2" },
    ],
    cf: [
      { top: { name: 'SAS' }, bot: { name: 'DEN' }, score: "4-2" }
    ],
  },
  finals: [
    { top: { name: 'NYK', conference: 'East' }, bot: { name: 'SAS', conference: 'West' }, score: "3-4", status: "SAS WINS NBA CHAMPIONSHIP" }
  ]
};

const SeriesCard = ({ series }: { series: any }) => (
  <div className="bg-[#16191d] border border-zinc-800 p-3 rounded-xl w-40 hover:border-zinc-500 transition-all shadow-lg">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${series.top.name.toLowerCase()}.png`} className="w-5 h-5" />
        <span className={`font-black italic text-xs ${parseInt(series.score.split('-')[0]) >= 4 ? 'text-blue-500' : 'text-white'}`}>{series.top.name}</span>
      </div>
      <span className="text-xs font-mono font-black">{series.score.split('-')[0]}</span>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${series.bot.name.toLowerCase()}.png`} className="w-5 h-5" />
        <span className={`font-black italic text-xs ${parseInt(series.score.split('-')[1]) >= 4 ? 'text-blue-500' : 'text-white'}`}>{series.bot.name}</span>
      </div>
      <span className="text-xs font-mono font-black">{series.score.split('-')[1]}</span>
    </div>
  </div>
);

export default function PlayoffsPage() {
  const finals = PLAYOFF_DATA_2026.finals[0];

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans overflow-x-auto">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 sticky left-0">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Bracket</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/standings" className="hover:text-white">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 border-b-2 border-blue-500 pb-1">2026 Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-w-[1200px] overflow-x-auto pb-20">
        <div className="text-center mb-24">
            <h2 className="text-7xl font-black italic uppercase tracking-tighter mb-4">NBA <span className="text-blue-500">Postseason</span> 2026</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.5em] text-[10px]">Official NBA Tournament Bracket Simulation</p>
        </div>

        <div className="flex justify-between items-center relative">
          
          {/* 东部 */}
          <div className="flex items-center gap-10">
            <div className="space-y-6">
              <p className="text-[10px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">EAST R1</p>
              {PLAYOFF_DATA_2026.east.r1.map((s, i) => <SeriesCard key={i} series={s} />)}
            </div>
            <div className="space-y-36">
              <p className="text-[10px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">EAST SEMIS</p>
              {PLAYOFF_DATA_2026.east.r2.map((s, i) => <SeriesCard key={i} series={s} />)}
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">ECF</p>
              <SeriesCard series={PLAYOFF_DATA_2026.east.cf[0]} />
            </div>
          </div>

          {/* 总决赛 */}
          <div className="flex flex-col items-center px-12 relative">
             <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full"></div>
             <div className="relative border-4 border-white/5 p-2 rounded-[4rem] bg-zinc-900 shadow-2xl">
                <div className="bg-[#0b0e11] p-12 rounded-[3.5rem] text-center w-80 border border-white/10">
                   <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10">THE 2026 FINALS</p>
                   <div className="flex flex-col gap-10">
                      <div className="flex items-center justify-between">
                         <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${finals.top.name.toLowerCase()}.png`} className="w-16 h-16 object-contain" />
                         <span className="text-6xl font-black italic">{finals.score.split('-')[0]}</span>
                      </div>
                      <div className="text-zinc-800 font-black italic text-2xl tracking-tighter">VS</div>
                      <div className="flex items-center justify-between">
                         <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${finals.bot.name.toLowerCase()}.png`} className="w-16 h-16 object-contain" />
                         <span className="text-6xl font-black italic">{finals.score.split('-')[1]}</span>
                      </div>
                   </div>
                   <div className="mt-12 pt-8 border-t border-zinc-800">
                      <span className="bg-yellow-400 text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-900/40">
                         {finals.status}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* 西部 */}
          <div className="flex items-center gap-10">
            <div>
              <p className="text-[10px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">WCF</p>
              <SeriesCard series={PLAYOFF_DATA_2026.west.cf[0]} />
            </div>
            <div className="space-y-36">
              <p className="text-[10px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">WEST SEMIS</p>
              {PLAYOFF_DATA_2026.west.r2.map((s, i) => <SeriesCard key={i} series={s} />)}
            </div>
            <div className="space-y-6">
              <p className="text-[10px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">WEST R1</p>
              {PLAYOFF_DATA_2026.west.r1.map((s, i) => <SeriesCard key={i} series={s} />)}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}