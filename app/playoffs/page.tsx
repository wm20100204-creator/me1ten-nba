'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PlayoffsPage() {
  const [activeTab, setActiveTab] = useState('bracket');
  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 模拟对阵数据结构 (因为现在是2026年6月，正处于总决赛阶段)
  // 在实际开发中，这些数据可以从 https://api.balldontlie.io/v1/games?postseason=true 获取并处理
  const bracketData = {
    east: {
      r1: [
        { top: "BOS", bot: "MIA", score: "4-1" },
        { top: "CLE", bot: "ORL", score: "4-3" },
        { top: "MIL", bot: "IND", score: "2-4" },
        { top: "NYK", bot: "PHI", score: "4-2" },
      ],
      r2: [
        { top: "BOS", bot: "CLE", score: "4-1" },
        { top: "IND", bot: "NYK", score: "3-4" },
      ],
      cf: { top: "BOS", bot: "NYK", score: "4-0" }
    },
    west: {
      r1: [
        { top: "OKC", bot: "NOP", score: "4-0" },
        { top: "LAC", bot: "DAL", score: "2-4" },
        { top: "MIN", bot: "PHX", score: "4-0" },
        { top: "DEN", bot: "LAL", score: "4-1" },
      ],
      r2: [
        { top: "OKC", bot: "DAL", score: "2-4" },
        { top: "MIN", bot: "DEN", score: "4-3" },
      ],
      cf: { top: "DAL", bot: "MIN", score: "4-1" }
    },
    finals: { top: "BOS", bot: "DAL", score: "2-1", status: "LIVE" }
  };

  const SeriesCard = ({ team1, team2, score, isLive }: any) => (
    <div className={`bg-[#16191d] border ${isLive ? 'border-blue-500' : 'border-zinc-800'} p-3 rounded-xl w-40 shadow-2xl relative group hover:scale-105 transition-all`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${team1.toLowerCase()}.png`} className="w-5 h-5" />
          <span className="font-black italic text-xs">{team1}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">{score.split('-')[0]}</span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${team2.toLowerCase()}.png`} className="w-5 h-5" />
          <span className="font-black italic text-xs">{team2}</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">{score.split('-')[1]}</span>
      </div>
      {isLive && <span className="absolute -top-2 -right-2 bg-red-600 text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">FINALS</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-4 md:p-12 font-sans overflow-x-auto">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8 sticky left-0">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Bracket</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 underline underline-offset-8">Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto min-w-[1000px]">
        <div className="text-center mb-20">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-2">NBA <span className="text-blue-500">Postseason</span> 2026</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-xs">Road to the Larry O'Brien Trophy</p>
        </div>

        {/* 树状图布局容器 */}
        <div className="flex justify-between items-center gap-4 relative">
          
          {/* --- EASTERN CONFERENCE --- */}
          <div className="flex items-center gap-8">
             {/* R1 */}
             <div className="space-y-8">
                <p className="text-center text-[10px] font-black text-blue-500 mb-4 uppercase tracking-widest">Round 1</p>
                {bracketData.east.r1.map((s, i) => <SeriesCard key={i} team1={s.top} team2={s.bot} score={s.score} />)}
             </div>
             {/* R2 */}
             <div className="space-y-32">
                <p className="text-center text-[10px] font-black text-blue-500 mb-4 uppercase tracking-widest">Semis</p>
                {bracketData.east.r2.map((s, i) => <SeriesCard key={i} team1={s.top} team2={s.bot} score={s.score} />)}
             </div>
             {/* CF */}
             <div className="space-y-0">
                <p className="text-center text-[10px] font-black text-blue-500 mb-4 uppercase tracking-widest">Conf Finals</p>
                <SeriesCard team1={bracketData.east.cf.top} team2={bracketData.east.cf.bot} score={bracketData.east.cf.score} />
             </div>
          </div>

          {/* --- THE FINALS --- */}
          <div className="flex flex-col items-center">
             <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] group-hover:bg-blue-500/40 transition-all"></div>
                <div className="relative bg-gradient-to-b from-blue-600 to-blue-900 p-1 rounded-3xl shadow-2xl">
                   <div className="bg-[#0b0e11] p-8 rounded-[1.4rem] text-center w-64 border border-white/10">
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">NBA Finals 2026</p>
                      <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${bracketData.finals.top.toLowerCase()}.png`} className="w-12 h-12" />
                            <span className="text-4xl font-black italic">{bracketData.finals.score.split('-')[0]}</span>
                        </div>
                        <div className="h-[1px] bg-zinc-800 w-full relative">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0b0e11] px-4 font-black italic text-zinc-600 italic">VS</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${bracketData.finals.bot.toLowerCase()}.png`} className="w-12 h-12" />
                            <span className="text-4xl font-black italic text-zinc-500">{bracketData.finals.score.split('-')[1]}</span>
                        </div>
                      </div>
                      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 py-2 rounded-full">
                         <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest">{bracketData.finals.status}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* --- WESTERN CONFERENCE --- */}
          <div className="flex items-center gap-8">
             {/* CF */}
             <div className="space-y-0">
                <p className="text-center text-[10px] font-black text-red-500 mb-4 uppercase tracking-widest">Conf Finals</p>
                <SeriesCard team1={bracketData.west.cf.top} team2={bracketData.west.cf.bot} score={bracketData.west.cf.score} />
             </div>
             {/* R2 */}
             <div className="space-y-32">
                <p className="text-center text-[10px] font-black text-red-500 mb-4 uppercase tracking-widest">Semis</p>
                {bracketData.west.r2.map((s, i) => <SeriesCard key={i} team1={s.top} team2={s.bot} score={s.score} />)}
             </div>
             {/* R1 */}
             <div className="space-y-8">
                <p className="text-center text-[10px] font-black text-red-500 mb-4 uppercase tracking-widest">Round 1</p>
                {bracketData.west.r1.map((s, i) => <SeriesCard key={i} team1={s.top} team2={s.bot} score={s.score} />)}
             </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-40 pt-8 border-t border-zinc-900 text-center">
        <p className="text-[9px] text-zinc-800 font-bold uppercase tracking-[0.5em]">Terminal Bracket Engine • Verified All-Star Data Source</p>
      </footer>
    </div>
  );
}