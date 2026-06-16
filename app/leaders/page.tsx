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
      { name: "Luka DonciĊ", team: "LAL", val: "33.5", gp: "64" },
      { name: "Shai Gilgeous-Alexander", team: "OKC", val: "31.1", gp: "68" },
      { name: "Anthony Edwards", team: "MIN", val: "28.8", gp: "61" },
      { name: "Jayson Tatum", team: "BOS", val: "28.7", gp: "71" },
      { name: "Tyrese Maxey", team: "PHI", val: "28.3", gp: "70" },
      { name: "Kawhi Leonard", team: "LAC", val: "27.9", gp: "65" },
      { name: "Denzel Valentine", team: "CLE", val: "27.9", gp: "70" },
      { name: "Nikola Jokić", team: "DEN", val: "27.7", gp: "65" },
      { name: "Devin Booker", team: "PHX", val: "26.1", gp: "64" },
      { name: "Jalen Brunson", team: "NYK", val: "26", gp: "74" }
    ],
    reb: [
      { name: "Nikola Jokic", team: "DEN", val: "12.9", gp: "65" },
      { name: "Karl-Anthony Towns", team: "NYK", val: "11.9", gp: "75" },
      { name: "Donovan Clingan", team: "POR", val: "11.6", gp: "77" },
      { name: "Victor Wembanyama", team: "SAS", val: "11.5", gp: "64" },
      { name: "Rudy Gobert", team: "MIN", val: "11.5", gp: "76" },
      { name: "Jalen Duren", team: "DET", val: "10.5", gp: "70" },
      { name: "Jalen Johnson", team: "ATL", val: "10.3", gp: "72" },
      { name: "Bam Adebayo", team: "MIA", val: "10", gp: "73" },
      { name: "Evan Mobley", team: "CLE", val: "9", gp: "65" },
      { name: "Kel'el Ware", team: "MIA", val: "9", gp: "77" }
    ],
    ast: [
      { name: "Nikola Jokic", team: "DEN", val: "10.7", gp: "65" },
      { name: "Cade Cunningham", team: "DET", val: "9.9", gp: "64" },
      { name: "Luka Doncic", team: "LAL", val: "8.3", gp: "64" },
      { name: "James Harden", team: "CLE", val: "8", gp: "70" },
      { name: "Jalen Johnson", team: "ATL", val: "7.9", gp: "72" },
      { name: "Stephen Castle", team: "SAS", val: "7.4", gp: "68" },
      { name: "Lebron James", team: "LAL", val: "7.2", gp: "60" },
      { name: "Isaiah Collier", team: "UTA", val: "7.2", gp: "59" },
      { name: "Lamelo Ball", team: "CHA", val: "7.1", gp: "72" },
      { name: "Jamal Murray", team: "DEN", val: "7.1", gp: "75" }
    ],
    stl: [
      { name: "Ausar Thompson", team: "DET", val: "2.0", gp: "73" },
      { name: "Cason Wallace", team: "OKC", val: "2.0", gp: "77" },
      { name: "Dyson Daniels", team: "ATL", val: "2.0", gp: "76" },
      { name: "Kawhi Leonard", team: "LAC", val: "1.9", gp: "65" },
      { name: "Tyrese Maxey", team: "PHI", val: "1.9", gp: "70" },
      { name: "Luka Doncic", team: "LAL", val: "1.6", gp: "64" },
      { name: "Kris Dunn", team: "LAC", val: "1.6", gp: "82" },
      { name: "OG Anunoby", team: "NYK", val: "1.6", gp: "67" },
      { name: "Jordan Goodwin", team: "PHX", val: "1.5", gp: "70" },
      { name: "Amen Thompson", team: "HOU", val: "1.5", gp: "79" }
    ],
    blk: [
      { name: "Victor Wembanyama", team: "SAS", val: "3.1", gp: "64" },
      { name: "Chet Holmgren", team: "OKC", val: "1.9", gp: "69" },
      { name: "Jay Huff", team: "IND", val: "1.9", gp: "82" },
      { name: "Evan Mobley", team: "CLE", val: "1.7", gp: "65" },
      { name: "Donovan Clingan", team: "POR", val: "1.7", gp: "77" },
      { name: "Rudy Gobert", team: "MIN", val: "1.6", gp: "76" },
      { name: "Myles Turner", team: "MIL", val: "1.6", gp: "71" },
      { name: "Isaiah Stewart", team: "DET", val: "1.6", gp: "58" },
      { name: "Yves Missi", team: "NO", val: "1.5", gp: "66" },
      { name: "Matas Buzelis", team: "CHI", val: "1.5", gp: "77" }
    ]
  },
  playoffs: {
    pts: [
      { name: "Jalen Brunson", team: "NYK", val: "28.4", gp: "19" },
      { name: "Cade Cunningham", team: "DET", val: "28.1", gp: "14" },
      { name: "Shai Gilgeous-Alexander", team: "OKC", val: "27.6", gp: "15" },
      { name: "Paulo Banchero", team: "ORL", val: "26.3", gp: "7" },
      { name: "Donovan Mitchell", team: "CLE", val: "26", gp: "18" },
      { name: "Dillon Brooks", team: "PHX", val: "26", gp: "4" },
      { name: "Nikola Jokic", team: "DEN", val: "25.8", gp: "6" },
      { name: "Jalen Brown", team: "BOS", val: "25.7", gp: "7" },
      { name: "RJ Barrett", team: "TOR", val: "24.1", gp: "7" },
      { name: "Scottie Barnes", team: "TOR", val: "24.1", gp: "7" }
    ],
    reb: [
      { name: "Nikola Jokic", team: "DEN", val: "13.2", gp: "6" },
      { name: "Victor Wembanyama", team: "SAS", val: "10.9", gp: "22" },
      { name: "Jayson Tatum", team: "BOS", val: "10.7", gp: "6" },
      { name: "Karl-Anthony Towns", team: "NYK", val: "10.6", gp: "19" },
      { name: "Alperen Sengun", team: "HOU", val: "10.2", gp: "6" },
      { name: "Deandre Ayton", team: "LAL", val: "9.6", gp: "10" },
      { name: "Rudy Gobert", team: "MIN", val: "9.3", gp: "12" },
      { name: "Paulo Banchero", team: "ORL", val: "9", gp: "7" },
      { name: "Josh Hart", team: "NYK", val: "8.9", gp: "19" },
      { name: "Neemias Queta", team: "BOS", val: "8.6", gp: "7" }
    ],
    ast: [
      { name: "Nikola Jokic", team: "DEN", val: "9.5", gp: "6" },
      { name: "Scottie Barnes", team: "TOR", val: "8.6", gp: "7" },
      { name: "Shai Gilgeous-Alexander", team: "OKC", val: "7.9", gp: "15" },
      { name: "Cade Cunningham", team: "DET", val: "7.5", gp: "14" },
      { name: "LeBron James", team: "LAL", val: "7.3", gp: "10" },
      { name: "Jrue Holiday", team: "POR", val: "7.2", gp: "5" },
      { name: "Jayson Tatum", team: "BOS", val: "6.8", gp: "6" },
      { name: "Paulo Banchero", team: "ORL", val: "6.3", gp: "7" },
      { name: "Stephen Castle", team: "SAS", val: "6.1", gp: "23" },
      { name: "Jalen Brunson", team: "NYK", val: "6.1", gp: "19" }
    ],
    stl: [
      { name: "Tari Eason", team: "HOU", val: "2.5", gp: "6" },
      { name: "Marcus Smart", team: "LAL", val: "2.4", gp: "10" },
      { name: "Reed Sheppard", team: "HOU", val: "2.2", gp: "6" },
      { name: "Anthony Black", team: "ORL", val: "2.1", gp: "7" },
      { name: "Cason Wallace", team: "OKC", val: "2.1", gp: "15" },
      { name: "Ausar Thompson", team: "DET", val: "2", gp: "14" },
      { name: "Ja'Kobe Walter", team: "TOR", val: "2", gp: "7" },
      { name: "Amen Thompson", team: "HOU", val: "2", gp: "6" },
      { name: "Jalen Green", team: "PHX", val: "2", gp: "4" },
      { name: "Desmond Bane", team: "ORL", val: "1.9", gp: "7" }
    ],
    blk: [
      { name: "Victor Wembanyama", team: "SAS", val: "3.5", gp: "22" },
      { name: "Ausar Thompson", team: "DET", val: "1.8", gp: "14" },
      { name: "Evan Mobley", team: "CLE", val: "1.8", gp: "18" },
      { name: "Jarrett Allen", team: "CLE", val: "1.7", gp: "18" },
      { name: "Wendell Carter Jr.", team: "ORL", val: "1.7", gp: "7" },
      { name: "Scottie Barnes", team: "TOR", val: "1.7", gp: "7" },
      { name: "Goga Bitadze", team: "ORL", val: "1.7", gp: "6" },
      { name: "Chet Holmgren", team: "OKC", val: "1.5", gp: "15" },
      { name: "Derrick White", team: "BOS", val: "1.4", gp: "7" },
      { name: "Alperen Sengun", team: "HOU", val: "1.3", gp: "6" }
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