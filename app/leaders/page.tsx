'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// 核心缩写转换逻辑：确保图片不碎
const fixTeam = (abbr: string) => {
  const map: Record<string, string> = {
    'SA': 'sas', 'NY': 'nyk', 'GS': 'gsw', 'NO': 'no', 'UTAH': 'utah',
    'BRK': 'bkn', 'CHO': 'cha', 'PHX': 'phx', 'OKC': 'okc', 'LAL': 'lal'
  };
  const s = abbr?.toUpperCase();
  return map[s] || s?.toLowerCase();
};

// --- 根据你提供图片 100% 精确录入的数据 ---
const IMAGE_STATS = {
  regular: {
    pts: [
      { name: "东契奇", team: "LAL", val: "33.5", gp: "64" },
      { name: "亚历山大", team: "OKC", val: "31.1", gp: "68" },
      { name: "爱德华兹", team: "MIN", val: "28.8", gp: "61" },
      { name: "布朗", team: "BOS", val: "28.7", gp: "71" },
      { name: "马克西", team: "PHI", val: "28.3", gp: "70" },
      { name: "伦纳德", team: "LAC", val: "27.9", gp: "65" },
      { name: "米切尔", team: "CLE", val: "27.9", gp: "70" },
      { name: "约基奇", team: "DEN", val: "27.7", gp: "65" },
      { name: "布克", team: "PHX", val: "26.1", gp: "64" },
      { name: "布伦森", team: "NYK", val: "26", gp: "74" }
    ],
    reb: [
      { name: "约基奇", team: "DEN", val: "12.9", gp: "65" },
      { name: "唐斯", team: "NYK", val: "11.9", gp: "75" },
      { name: "克林根", team: "POR", val: "11.6", gp: "77" },
      { name: "文班亚马", team: "SAS", val: "11.5", gp: "64" },
      { name: "戈贝尔", team: "MIN", val: "11.5", gp: "76" },
      { name: "杜伦", team: "DET", val: "10.5", gp: "70" },
      { name: "约翰逊", team: "ATL", val: "10.3", gp: "72" },
      { name: "阿德巴约", team: "MIA", val: "10", gp: "73" },
      { name: "莫布里", team: "CLE", val: "9", gp: "65" },
      { name: "韦尔", team: "MIA", val: "9", gp: "77" }
    ],
    ast: [
      { name: "约基奇", team: "DEN", val: "10.7", gp: "65" },
      { name: "坎宁安", team: "DET", val: "9.9", gp: "64" },
      { name: "东契奇", team: "LAL", val: "8.3", gp: "64" },
      { name: "哈登", team: "CLE", val: "8", gp: "70" },
      { name: "约翰逊", team: "ATL", val: "7.9", gp: "72" },
      { name: "卡斯尔", team: "SAS", val: "7.4", gp: "68" },
      { name: "詹姆斯", team: "LAL", val: "7.2", gp: "60" },
      { name: "科利尔", team: "UTA", val: "7.2", gp: "59" },
      { name: "鲍尔", team: "CHA", val: "7.1", gp: "72" },
      { name: "穆雷", team: "DEN", val: "7.1", gp: "75" }
    ],
    stl: [
      { name: "奥萨尔", team: "DET", val: "2.0", gp: "73" },
      { name: "华莱士", team: "OKC", val: "2.0", gp: "77" },
      { name: "丹尼尔斯", team: "ATL", val: "2.0", gp: "76" },
      { name: "伦纳德", team: "LAC", val: "1.9", gp: "65" },
      { name: "马克西", team: "PHI", val: "1.9", gp: "70" },
      { name: "东契奇", team: "LAL", val: "1.6", gp: "64" },
      { name: "邓恩", team: "LAC", val: "1.6", gp: "82" },
      { name: "阿努诺比", team: "NYK", val: "1.6", gp: "67" },
      { name: "古德温", team: "PHX", val: "1.5", gp: "70" },
      { name: "阿门", team: "HOU", val: "1.5", gp: "79" }
    ],
    blk: [
      { name: "文班亚马", team: "SAS", val: "3.1", gp: "64" },
      { name: "霍姆格伦", team: "OKC", val: "1.9", gp: "69" },
      { name: "赫夫", team: "IND", val: "1.9", gp: "82" },
      { name: "莫布里", team: "CLE", val: "1.7", gp: "65" },
      { name: "克林根", team: "POR", val: "1.7", gp: "77" },
      { name: "戈贝尔", team: "MIN", val: "1.6", gp: "76" },
      { name: "特纳", team: "MIL", val: "1.6", gp: "71" },
      { name: "斯图尔特", team: "DET", val: "1.6", gp: "58" },
      { name: "米西", team: "NO", val: "1.5", gp: "66" },
      { name: "布泽利斯", team: "CHI", val: "1.5", gp: "77" }
    ]
  },
  playoffs: {
    pts: [
      { name: "布伦森", team: "NYK", val: "28.4", gp: "19" },
      { name: "坎宁安", team: "DET", val: "28.1", gp: "14" },
      { name: "亚历山大", team: "OKC", val: "27.6", gp: "15" },
      { name: "班凯罗", team: "ORL", val: "26.3", gp: "7" },
      { name: "米切尔", team: "CLE", val: "26", gp: "18" },
      { name: "狄龙", team: "PHX", val: "26", gp: "4" },
      { name: "约基奇", team: "DEN", val: "25.8", gp: "6" },
      { name: "布朗", team: "BOS", val: "25.7", gp: "7" },
      { name: "巴雷特", team: "TOR", val: "24.1", gp: "7" },
      { name: "巴恩斯", team: "TOR", val: "24.1", gp: "7" }
    ],
    reb: [
      { name: "约基奇", team: "DEN", val: "13.2", gp: "6" },
      { name: "文班亚马", team: "SAS", val: "10.9", gp: "22" },
      { name: "塔图姆", team: "BOS", val: "10.7", gp: "6" },
      { name: "唐斯", team: "NYK", val: "10.6", gp: "19" },
      { name: "申京", team: "HOU", val: "10.2", gp: "6" },
      { name: "艾顿", team: "LAL", val: "9.6", gp: "10" },
      { name: "戈贝尔", team: "MIN", val: "9.3", gp: "12" },
      { name: "班凯罗", team: "ORL", val: "9", gp: "7" },
      { name: "哈特", team: "NYK", val: "8.9", gp: "19" },
      { name: "奎塔", team: "BOS", val: "8.6", gp: "7" }
    ],
    ast: [
      { name: "约基奇", team: "DEN", val: "9.5", gp: "6" },
      { name: "巴恩斯", team: "TOR", val: "8.6", gp: "7" },
      { name: "亚历山大", team: "OKC", val: "7.9", gp: "15" },
      { name: "坎宁安", team: "DET", val: "7.5", gp: "14" },
      { name: "詹姆斯", team: "LAL", val: "7.3", gp: "10" },
      { name: "霍勒迪", team: "POR", val: "7.2", gp: "5" },
      { name: "塔图姆", team: "BOS", val: "6.8", gp: "6" },
      { name: "班凯罗", team: "ORL", val: "6.3", gp: "7" },
      { name: "卡斯尔", team: "SAS", val: "6.1", gp: "23" },
      { name: "布伦森", team: "NYK", val: "6.1", gp: "19" }
    ],
    stl: [
      { name: "伊森", team: "HOU", val: "2.5", gp: "6" },
      { name: "斯玛特", team: "LAL", val: "2.4", gp: "10" },
      { name: "谢泼德", team: "HOU", val: "2.2", gp: "6" },
      { name: "布莱克", team: "ORL", val: "2.1", gp: "7" },
      { name: "华莱士", team: "OKC", val: "2.1", gp: "15" },
      { name: "奥萨尔", team: "DET", val: "2", gp: "14" },
      { name: "沃尔特", team: "TOR", val: "2", gp: "7" },
      { name: "阿门", team: "HOU", val: "2", gp: "6" },
      { name: "格林", team: "PHX", val: "2", gp: "4" },
      { name: "贝恩", team: "ORL", val: "1.9", gp: "7" }
    ],
    blk: [
      { name: "文班亚马", team: "SAS", val: "3.5", gp: "22" },
      { name: "奥萨尔", team: "DET", val: "1.8", gp: "14" },
      { name: "莫布里", team: "CLE", val: "1.8", gp: "18" },
      { name: "阿伦", team: "CLE", val: "1.7", gp: "18" },
      { name: "卡特", team: "ORL", val: "1.7", gp: "7" },
      { name: "巴恩斯", team: "TOR", val: "1.7", gp: "7" },
      { name: "比塔泽", team: "ORL", val: "1.7", gp: "6" },
      { name: "霍姆格伦", team: "OKC", val: "1.5", gp: "15" },
      { name: "怀特", team: "BOS", val: "1.4", gp: "7" },
      { name: "申京", team: "HOU", val: "1.3", gp: "6" }
    ]
  }
};

const StatCard = ({ title, data, unit }: any) => (
  <div className="bg-[#16191d] border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl">
    <h3 className="text-xl font-black italic uppercase text-blue-500 mb-8 flex items-center gap-3">
      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> {title}
    </h3>
    <div className="space-y-3">
      {data.map((p: any, i: number) => (
        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl transition-all ${i === 0 ? 'bg-blue-600/10 border border-blue-500/30' : 'hover:bg-zinc-900/50'}`}>
          <div className="flex items-center gap-4">
            <span className={`font-mono text-xs ${i === 0 ? 'text-blue-500 font-bold' : 'text-zinc-600'}`}>{i + 1}</span>
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/${fixTeam(p.team)}.png`} className="w-6 h-6 object-contain" />
            <div>
              <p className={`font-black italic uppercase text-sm ${i === 0 ? 'text-white' : 'text-zinc-300'}`}>{p.name}</p>
              <p className="text-[9px] text-zinc-500 font-bold uppercase">{p.team}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-black italic ${i === 0 ? 'text-blue-500 text-2xl' : 'text-white text-lg'}`}>{p.val}</p>
            <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{unit} / {p.gp}G</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function LeadersPage() {
  const [mode, setMode] = useState<'regular' | 'playoffs'>('regular');

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-16 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Leaders</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="hover:text-white transition-colors">Teams</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Bracket</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-20">
          <div className="bg-[#16191d] p-1.5 rounded-full border border-zinc-800 flex gap-2">
            <button onClick={() => setMode('regular')} className={`px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${mode === 'regular' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>Regular</button>
            <button onClick={() => setMode('playoffs')} className={`px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${mode === 'playoffs' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>Playoffs</button>
          </div>
        </div>

        <div className="text-center mb-24">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4">League <span className="text-blue-500">Leaders</span></h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.4em] text-[10px]">2025-26 Official Simulation Terminal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-40">
          <StatCard title="Scoring" data={mode === 'regular' ? IMAGE_STATS.regular.pts : IMAGE_STATS.playoffs.pts} unit="PPG" />
          <StatCard title="Rebounds" data={mode === 'regular' ? IMAGE_STATS.regular.reb : IMAGE_STATS.playoffs.reb} unit="RPG" />
          <StatCard title="Assists" data={mode === 'regular' ? IMAGE_STATS.regular.ast : IMAGE_STATS.playoffs.ast} unit="APG" />
          <StatCard title="Steals" data={mode === 'regular' ? IMAGE_STATS.regular.stl : IMAGE_STATS.playoffs.stl} unit="SPG" />
          <StatCard title="Blocks" data={mode === 'regular' ? IMAGE_STATS.regular.blk : IMAGE_STATS.playoffs.blk} unit="BPG" />
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-900 rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center border border-white/10 shadow-2xl">
              <h4 className="text-2xl font-black italic uppercase leading-tight mb-4 text-white">Verified <br/>Analytical <br/>Feed</h4>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">所有数据均已根据 2025-26 赛季快照进行同步。</p>
          </div>
        </div>
      </main>
    </div>
  );
}