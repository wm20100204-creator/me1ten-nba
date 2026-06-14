'use client';

import React from 'react';
import Link from 'next/link';

// 1. 修正后的季后赛对阵数据（确保全部是字符串，防止 toLowerCase 报错）
const BRACKET_2026 = {
  west: {
    r1: [
      { top: "OKC", bot: "PHX", score: "4-0", seedT: 1, seedB: 8 },
      { top: "LAL", bot: "HOU", score: "4-2", seedT: 4, seedB: 5 },
      { top: "SAS", bot: "POR", score: "4-1", seedT: 2, seedB: 7 },
      { top: "DEN", bot: "MIN", score: "2-4", seedT: 3, seedB: 6 },
    ],
    r2: [
      { top: "OKC", bot: "LAL", score: "4-0" },
      { top: "SAS", bot: "MIN", score: "4-2" },
    ],
    cf: { top: "OKC", bot: "SAS", score: "3-4" }
  },
  east: {
    r1: [
      { top: "DET", bot: "ORL", score: "4-3", seedT: 1, seedB: 8 },
      { top: "CLE", bot: "TOR", score: "4-3", seedT: 4, seedB: 5 },
      { top: "BOS", bot: "PHI", score: "3-4", seedT: 2, seedB: 7 },
      { top: "NYK", bot: "ATL", score: "4-2", seedT: 3, seedB: 6 },
    ],
    r2: [
      { top: "DET", bot: "CLE", score: "3-4" },
      { top: "PHI", bot: "NYK", score: "0-4" },
    ],
    cf: { top: "CLE", bot: "NYK", score: "0-4" }
  },
  finals: { top: "SAS", bot: "NYK", score: "1-2", status: "FINALS IN PROGRESS" }
};

// 2. 常规赛排名数据（同步图片数据）
const STANDINGS_DATA = {
  west: [
    { rank: 1, name: "雷霆", abbr: "okc", wl: "64/18", pct: "78%" },
    { rank: 2, name: "马刺", abbr: "sas", wl: "62/20", pct: "75.6%" },
    { rank: 3, name: "掘金", abbr: "den", wl: "54/28", pct: "65.9%" },
    { rank: 4, name: "湖人", abbr: "lal", wl: "53/29", pct: "64.6%" },
    { rank: 5, name: "火箭", abbr: "hou", wl: "52/30", pct: "63.4%" },
    { rank: 6, name: "森林狼", abbr: "min", wl: "49/33", pct: "59.8%" },
    { rank: 7, name: "太阳", abbr: "phx", wl: "45/37", pct: "54.9%" },
    { rank: 8, name: "开拓者", abbr: "por", wl: "42/40", pct: "51.2%" },
    { rank: 9, name: "快船", abbr: "lac", wl: "42/40", pct: "51.2%" },
    { rank: 10, name: "勇士", abbr: "gsw", wl: "37/45", pct: "45.1%" },
    { rank: 11, name: "鹈鹕", abbr: "no", wl: "26/56", pct: "31.7%" },
    { rank: 12, name: "独行侠", abbr: "dal", wl: "26/56", pct: "31.7%" },
    { rank: 13, name: "灰熊", abbr: "mem", wl: "25/57", pct: "30.5%" },
    { rank: 14, name: "国王", abbr: "sac", wl: "22/60", pct: "26.8%" },
    { rank: 15, name: "爵士", abbr: "utah", wl: "22/60", pct: "26.8%" },
  ],
  east: [
    { rank: 1, name: "活塞", abbr: "det", wl: "60/22", pct: "73.2%" },
    { rank: 2, name: "凯尔特人", abbr: "bos", wl: "56/26", pct: "68.3%" },
    { rank: 3, name: "尼克斯", abbr: "nyk", wl: "53/29", pct: "64.6%" },
    { rank: 4, name: "骑士", abbr: "cle", wl: "52/30", pct: "63.4%" },
    { rank: 5, name: "猛龙", abbr: "tor", wl: "46/36", pct: "56.1%" },
    { rank: 6, name: "老鹰", abbr: "atl", wl: "46/36", pct: "56.1%" },
    { rank: 7, name: "76人", abbr: "phi", wl: "45/37", pct: "54.9%" },
    { rank: 8, name: "魔术", abbr: "orl", wl: "45/37", pct: "54.9%" },
    { rank: 9, name: "黄蜂", abbr: "cha", wl: "44/38", pct: "53.7%" },
    { rank: 10, name: "热火", abbr: "mia", wl: "43/39", pct: "52.4%" },
    { rank: 11, name: "雄鹿", abbr: "mil", wl: "32/50", pct: "39%" },
    { rank: 12, name: "公牛", abbr: "chi", wl: "31/51", pct: "37.8%" },
    { rank: 13, name: "篮网", abbr: "bkn", wl: "20/62", pct: "24.4%" },
    { rank: 14, name: "步行者", abbr: "ind", wl: "19/63", pct: "23.2%" },
    { rank: 15, name: "奇才", abbr: "was", wl: "17/65", pct: "20.7%" },
  ]
};

// 辅助：处理特殊球队的 ESPN 图片缩写
const fixAbbr = (a: string) => {
  const s = a.toLowerCase();
  if (s === "nop") return "no";
  if (s === "uta") return "utah";
  return s;
};

const SeriesCard = ({ t1, t2, score, seed1, seed2 }: any) => (
  <div className="bg-[#16191d] border border-zinc-800 p-3 rounded-xl w-44 hover:border-blue-500 transition-all shadow-lg group">
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${fixAbbr(t1)}.png`} className="w-5 h-5" />
        <span className={`font-black italic text-[10px] ${parseInt(score.split('-')[0]) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t1} {seed1 && <span className="text-zinc-600 not-italic">({seed1})</span>}</span>
      </div>
      <span className="font-mono text-xs font-black">{score.split('-')[0]}</span>
    </div>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${fixAbbr(t2)}.png`} className="w-5 h-5" />
        <span className={`font-black italic text-[10px] ${parseInt(score.split('-')[1]) >= 4 ? 'text-blue-500' : 'text-white'}`}>{t2} {seed2 && <span className="text-zinc-600 not-italic">({seed2})</span>}</span>
      </div>
      <span className="font-mono text-xs font-black">{score.split('-')[1]}</span>
    </div>
  </div>
);

export default function PlayoffsPage() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white font-sans p-6 md:p-12">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-8">
        <Link href="/"><h1 className="text-2xl font-black italic tracking-tighter uppercase">ME1TEN<span className="text-blue-500">.BRACKET</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Standings</Link>
          <Link href="/playoffs" className="text-blue-500 underline underline-offset-8">Playoffs</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto overflow-x-auto pb-32">
        <div className="text-center mb-24">
          <h2 className="text-7xl font-black italic uppercase tracking-tighter">NBA Playoffs <span className="text-blue-500">2026</span></h2>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.6em] text-[10px] mt-2 italic">Official Postseason Terminal</p>
        </div>

        <div className="flex justify-between items-center gap-4 min-w-[1200px]">
          {/* 西部 */}
          <div className="flex items-center gap-10">
            <div className="space-y-6">
              <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">West R1</p>
              {BRACKET_2026.west.r1.map((s, i) => <SeriesCard key={i} t1={s.top} t2={s.bot} score={s.score} seed1={s.seedT} seed2={s.seedB} />)}
            </div>
            <div className="space-y-40">
              <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">Semis</p>
              {BRACKET_2026.west.r2.map((s, i) => <SeriesCard key={i} t1={s.top} t2={s.bot} score={s.score} />)}
            </div>
            <div className="space-y-0">
              <p className="text-[9px] font-black text-red-600 mb-2 uppercase text-center italic tracking-widest">WCF</p>
              <SeriesCard t1={BRACKET_2026.west.cf.top} t2={BRACKET_2026.west.cf.bot} score={BRACKET_2026.west.cf.score} />
            </div>
          </div>

          {/* 总决赛 */}
          <div className="flex flex-col items-center px-6">
            <div className="relative border-4 border-blue-500/20 p-1 rounded-[4rem] bg-zinc-900 shadow-2xl">
              <div className="bg-[#0b0e11] p-12 rounded-[3.8rem] text-center w-80 border border-white/5">
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em] mb-10 italic">The Finals</p>
                <div className="flex flex-col gap-10">
                  <div className="flex items-center justify-between">
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/sas.png" className="w-16 h-16 object-contain" />
                    <span className="text-6xl font-black italic">1</span>
                  </div>
                  <div className="text-zinc-800 font-black italic text-2xl tracking-tighter">VS</div>
                  <div className="flex items-center justify-between">
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/nyk.png" className="w-16 h-16 object-contain" />
                    <span className="text-6xl font-black italic text-zinc-500">2</span>
                  </div>
                </div>
                <p className="mt-12 text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">{BRACKET_2026.finals.status}</p>
              </div>
            </div>
          </div>

          {/* 东部 */}
          <div className="flex items-center gap-10 text-right">
            <div className="space-y-0">
              <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">ECF</p>
              <SeriesCard t1={BRACKET_2026.east.cf.top} t2={BRACKET_2026.east.cf.bot} score={BRACKET_2026.east.cf.score} />
            </div>
            <div className="space-y-40">
              <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">Semis</p>
              {BRACKET_2026.east.r2.map((s, i) => <SeriesCard key={i} t1={s.top} t2={s.bot} score={s.score} />)}
            </div>
            <div className="space-y-6">
              <p className="text-[9px] font-black text-blue-500 mb-2 uppercase text-center italic tracking-widest">East R1</p>
              {BRACKET_2026.east.r1.map((s, i) => <SeriesCard key={i} t1={s.top} t2={s.bot} score={s.score} seed1={s.seedT} seed2={s.seedB} />)}
            </div>
          </div>
        </div>
      </main>

      {/* 常规赛排行榜 */}
      <section className="max-w-7xl mx-auto border-t border-zinc-800 pt-20 pb-40">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-black italic uppercase tracking-tighter">Regular Season <span className="text-blue-500">Standings</span></h3>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-2 italic">2025-26 Official Record</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 西部表格 */}
          <div>
            <h4 className="text-red-600 font-black italic text-xl mb-6 uppercase tracking-widest border-l-4 border-red-600 pl-4">Western Conference</h4>
            <div className="bg-[#16191d] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-500 text-[9px] font-black uppercase tracking-widest border-b border-zinc-800">
                    <th className="p-4 px-6">Rank</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">W/L</th>
                    <th className="p-4">Pct</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {STANDINGS_DATA.west.map((team) => (
                    <tr key={team.rank} className="border-b border-zinc-900 hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4 px-6 font-mono text-zinc-600 text-xs">{team.rank}</td>
                      <td className="p-4 flex items-center gap-3">
                        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${team.abbr}.png`} className="w-6 h-6 object-contain" />
                        <span className="font-black italic uppercase group-hover:text-blue-400 transition-colors">{team.name}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-300">{team.wl}</td>
                      <td className="p-4 font-mono text-zinc-500">{team.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 东部表格 */}
          <div>
            <h4 className="text-blue-500 font-black italic text-xl mb-6 uppercase tracking-widest border-l-4 border-blue-500 pl-4">Eastern Conference</h4>
            <div className="bg-[#16191d] rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-900/50 text-zinc-500 text-[9px] font-black uppercase tracking-widest border-b border-zinc-800">
                    <th className="p-4 px-6">Rank</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">W/L</th>
                    <th className="p-4">Pct</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {STANDINGS_DATA.east.map((team) => (
                    <tr key={team.rank} className="border-b border-zinc-900 hover:bg-zinc-800/50 transition-colors group">
                      <td className="p-4 px-6 font-mono text-zinc-600 text-xs">{team.rank}</td>
                      <td className="p-4 flex items-center gap-3">
                        <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${team.abbr}.png`} className="w-6 h-6 object-contain" />
                        <span className="font-black italic uppercase group-hover:text-blue-400 transition-colors">{team.name}</span>
                      </td>
                      <td className="p-4 font-mono font-bold text-zinc-300">{team.wl}</td>
                      <td className="p-4 font-mono text-zinc-500">{team.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}