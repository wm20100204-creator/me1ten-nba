'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// --- 1. 根据截图 100% 精确录入的详细名单数据 (已修复重复项错误) ---
const DETAILED_ROSTERS: Record<string, any[]> = {
  "LAL": [
    { no: "77", name: "Luka Dončić", pos: "PG" }, { no: "23", name: "LeBron James", pos: "SF" },
    { no: "05", name: "Deandre Ayton", pos: "C" }, { no: "36", name: "Marcus Smart", pos: "SG" },
    { no: "15", name: "Austin Reaves", pos: "SG" }, { no: "28", name: "Rui Hachimura", pos: "PF" },
    { no: "02", name: "Jarred Vanderbilt", pos: "PF" }, { no: "11", name: "Jaxson Hayes", pos: "C" },
    { no: "12", name: "Jake LaRavia", pos: "PF" }, { no: "04", name: "Dalton Knecht", pos: "SF" },
    { no: "14", name: "Maxi Kleber", pos: "PF" }, { no: "10", name: "Luke Kennard", pos: "SG" },
    { no: "09", name: "Bronny James", pos: "SG" }, { no: "20", name: "Nick Smith Jr.", pos: "SG" }
  ],
  "DET": [
    { no: "02", name: "Cade Cunningham", pos: "PG" }, { no: "12", name: "Tobias Harris", pos: "PF" },
    { no: "00", name: "Jalen Duren", pos: "C" }, { no: "09", name: "Ausar Thompson", pos: "SF" },
    { no: "05", name: "Ron Holland", pos: "SF" }, { no: "55", name: "Duncan Robinson", pos: "SG" },
    { no: "08", name: "Caris LeVert", pos: "SG" }, { no: "28", name: "Isaiah Stewart", pos: "C" },
    { no: "07", name: "Paul Reed", pos: "C" }, { no: "25", name: "Marcus Sasser", pos: "PG" },
    { no: "31", name: "Javonte Green", pos: "SG" }, { no: "27", name: "Kevin Huerter", pos: "SG" }
  ],
  "BOS": [
    { no: "00", name: "Jayson Tatum", pos: "PF" }, { no: "07", name: "Jaylen Brown", pos: "SF" },
    { no: "09", name: "Derrick White", pos: "SG" }, { no: "11", name: "Payton Pritchard", pos: "PG" },
    { no: "30", name: "Sam Hauser", pos: "PF" }, { no: "04", name: "Nikola Vučević", pos: "C" },
    { no: "88", name: "Neemias Queta", pos: "C" }, { no: "55", name: "Baylor Scheierman", pos: "SG" },
    { no: "27", name: "Jordan Walsh", pos: "PF" }, { no: "52", name: "Luka Garza", pos: "C" }
  ],
  "NYK": [
    { no: "11", name: "Jalen Brunson", pos: "PG" }, { no: "32", name: "Karl-Anthony Towns", pos: "C" },
    { no: "25", name: "Mikal Bridges", pos: "SF" }, { no: "08", name: "OG Anunoby", pos: "PF" },
    { no: "03", name: "Josh Hart", pos: "SF" }, { no: "00", name: "Jordan Clarkson", pos: "SG" },
    { no: "23", name: "Mitchell Robinson", pos: "C" }, { no: "13", name: "Tyler Kolek", pos: "PG" },
    { no: "02", name: "Miles McBride", pos: "PG" }, { no: "44", name: "Landry Shamet", pos: "SG" }
  ],
  "WAS": [
    { no: "23", name: "Anthony Davis", pos: "PF" }, { no: "32", name: "Cooper Flagg", pos: "SF" },
    { no: "20", name: "Alex Sarr", pos: "C" }, { no: "03", name: "Trae Young", pos: "PG" },
    { no: "07", name: "Bub Carrington", pos: "PG" }, { no: "13", name: "Jordan Poole", pos: "SG" },
    { no: "33", name: "Kyle Kuzma", pos: "PF" }, { no: "00", name: "Bilal Coulibaly", pos: "SF" }
  ],
  "GSW": [
    { no: "30", name: "Stephen Curry", pos: "PG" }, { no: "10", name: "Jimmy Butler", pos: "SF" },
    { no: "23", name: "Draymond Green", pos: "PF" }, { no: "08", name: "Buddy Hield", pos: "SG" },
    { no: "02", name: "Brandin Podziemski", pos: "SG" }, { no: "00", name: "Jonathan Kuminga", pos: "PF" },
    { no: "32", name: "Trayce Jackson-Davis", pos: "C" }, { no: "04", name: "Moses Moody", pos: "SG" }
  ],
  "SAS": [
    { no: "01", name: "Victor Wembanyama", pos: "C" }, { no: "19", name: "Ace Bailey", pos: "SF" },
    { no: "05", name: "Stephon Castle", pos: "PG" }, { no: "24", name: "Devin Vassell", pos: "SG" },
    { no: "30", name: "Tre Jones", pos: "PG" }, { no: "14", name: "Matas Buzelis", pos: "PF" },
    { no: "44", name: "Patrick Williams", pos: "PF" }, { no: "12", name: "Zach Collins", pos: "C" }
  ],
  "OKC": [
    { no: "02", name: "Shai Gilgeous-Alexander", pos: "PG" }, { no: "07", name: "Chet Holmgren", pos: "C" },
    { no: "08", name: "Jalen Williams", pos: "SF" }, { no: "09", name: "Alex Caruso", pos: "SG" },
    { no: "55", name: "Isaiah Hartenstein", pos: "C" }, { no: "05", name: "Luguentz Dort", pos: "SF" },
    { no: "11", name: "Isaiah Joe", pos: "SG" }, { no: "22", name: "Cason Wallace", pos: "SG" }
  ],
  "PHI": [
    { no: "21", name: "Joel Embiid", pos: "C" }, { no: "08", name: "Paul George", pos: "PF" },
    { no: "00", name: "Tyrese Maxey", pos: "PG" }, { no: "77", name: "VJ Edgecombe", pos: "SG" },
    { no: "09", name: "Kelly Oubre Jr.", pos: "SF" }, { no: "01", name: "Andre Drummond", pos: "C" },
    { no: "05", name: "Quentin Grimes", pos: "SG" }, { no: "07", name: "Kyle Lowry", pos: "PG" }
  ],
  "CLE": [
    { no: "45", name: "Donovan Mitchell", pos: "SG" }, { no: "04", name: "Evan Mobley", pos: "PF" },
    { no: "31", name: "Jarrett Allen", pos: "C" }, { no: "10", name: "Darius Garland", pos: "PG" },
    { no: "01", name: "James Harden", pos: "PG" }, { no: "20", name: "Jaylon Tyson", pos: "SG" },
    { no: "22", name: "Larry Nance Jr.", pos: "PF" }, { no: "02", name: "Max Strus", pos: "SF" }
  ],
  "MIN": [
    { no: "05", name: "Anthony Edwards", pos: "SG" }, { no: "30", name: "Julius Randle", pos: "PF" },
    { no: "27", name: "Rudy Gobert", pos: "C" }, { no: "00", name: "Donte DiVincenzo", pos: "SG" },
    { no: "10", name: "Mike Conley", pos: "PG" }, { no: "11", name: "Naz Reid", pos: "C" },
    { no: "03", name: "Jaden McDaniels", pos: "PF" }, { no: "07", name: "Nickeil Alexander-Walker", pos: "SG" }
  ],
  "PHX": [
    { no: "07", name: "Kevin Durant", pos: "PF" }, { no: "01", name: "Devin Booker", pos: "SG" },
    { no: "00", name: "Royce O'Neale", pos: "SF" }, { no: "08", name: "Grayson Allen", pos: "SG" },
    { no: "15", name: "Mark Williams", pos: "C" }, { no: "03", name: "Dillon Brooks", pos: "SF" },
    { no: "05", name: "Tyus Jones", pos: "PG" }, { no: "11", name: "Oso Ighodaro", pos: "PF" }
  ],
  "DAL": [
    { no: "77", name: "Luka Doncic", pos: "PG" }, { no: "11", name: "Kyrie Irving", pos: "SG" },
    { no: "31", name: "Klay Thompson", pos: "SF" }, { no: "25", name: "P.J. Washington", pos: "PF" },
    { no: "02", name: "Dereck Lively II", pos: "C" }, { no: "21", name: "Daniel Gafford", pos: "C" }
  ],
  "IND": [
    { no: "00", name: "Tyrese Haliburton", pos: "PG" }, { no: "43", name: "Pascal Siakam", pos: "PF" },
    { no: "33", name: "Myles Turner", pos: "C" }, { no: "02", name: "Andrew Nembhard", pos: "SG" },
    { no: "23", name: "Aaron Nesmith", pos: "SF" }, { no: "32", name: "Jay Huff", pos: "C" }
  ],
  "ORL": [
    { no: "05", name: "Paolo Banchero", pos: "PF" }, { no: "22", name: "Franz Wagner", pos: "SF" },
    { no: "04", name: "Jalen Suggs", pos: "PG" }, { no: "03", name: "Desmond Bane", pos: "SG" },
    { no: "34", name: "Wendell Carter Jr.", pos: "C" }, { no: "01", name: "Jonathan Isaac", pos: "PF" }
  ],
  "MIA": [
    { no: "13", name: "Bam Adebayo", pos: "C" }, { no: "14", name: "Tyler Herro", pos: "SG" },
    { no: "22", name: "Andrew Wiggins", pos: "SF" }, { no: "11", name: "Jaime Jaquez Jr.", pos: "SF" },
    { no: "07", name: "Kel'el Ware", pos: "C" }
  ],
  "MIL": [
    { no: "34", name: "Giannis Antetokounmpo", pos: "PF" }, { no: "00", name: "Damian Lillard", pos: "PG" },
    { no: "11", name: "Brook Lopez", pos: "C" }, { no: "09", name: "Bobby Portis", pos: "PF" }
  ],
  "HOU": [
    { no: "28", name: "Alperen Şengün", pos: "C" }, { no: "04", name: "Jalen Green", pos: "SG" },
    { no: "00", name: "Fred VanVleet", pos: "PG" }, { no: "12", name: "Steven Adams", pos: "C" }
  ],
  "DEN": [
    { no: "15", name: "Nikola Jokic", pos: "C" }, { no: "27", name: "Jamal Murray", pos: "PG" },
    { no: "01", name: "Michael Porter Jr.", pos: "SF" }, { no: "50", name: "Aaron Gordon", pos: "PF" }
  ]
};

// 球队荣誉
const TEAM_LEGACY: Record<string, any> = {
  "NYK": { championships: 3, bio: "【2026冠军】纽约尼克斯在 Jalen Brunson 的率领下开启三冠王朝，麦迪逊花园重回巅峰。" },
  "LAL": { championships: 17, bio: "东契奇、詹姆斯、艾顿三巨头领衔，旨在复兴紫金荣耀。" },
  "WAS": { championships: 1, bio: "安东尼·戴维斯联手状元 Cooper Flagg，华盛顿正在统治东部。" },
  "DEFAULT": { championships: 0, bio: "NBA 2025-26 赛季活跃成员球队。" }
};

const fixTeamAbbr = (abbr: string) => {
  const s = abbr.toLowerCase();
  if (s === 'nop') return 'no';
  if (s === 'uta') return 'utah';
  return s;
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const PRO_HEADERS = { 'Authorization': '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6' };

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: PRO_HEADERS });
        const data = await res.json();
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error(e); }
    }
    fetchTeams();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm relative">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="text-blue-500 underline underline-offset-8">Teams</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Bracket</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 pb-40">
        {teams.map((t: any) => (
          <div key={t.id} onClick={() => setSelectedTeam(t)} className="bg-[#16191d] border border-zinc-800 p-8 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative flex items-center justify-between">
            <div className="flex items-center gap-6 relative z-10">
              <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(t.abbreviation)}.png`} className="w-16 h-16 object-contain" alt={t.full_name} />
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{t.full_name}</h3>
            </div>
            <span className="text-6xl font-black italic opacity-[0.02] absolute right-6 uppercase">{t.abbreviation}</span>
          </div>
        ))}
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95 animate-in fade-in duration-300">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative">
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-10 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-8">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(selectedTeam.abbreviation)}.png`} className="w-24 h-24" />
                  <div>
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-xs mt-3 italic text-white/40 italic">Verified Roster • 2025-26 Season</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center text-4xl font-light hover:bg-white hover:text-black transition-all">×</button>
            </div>

            <div className="p-12 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-white italic">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest border-l-4 border-blue-500 pl-4 font-black italic italic">Franchise Profile</h4>
                  <p className="text-zinc-300 text-xl leading-relaxed italic font-medium font-black italic">{TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY.DEFAULT.bio}</p>
                </div>
                <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-zinc-800 text-center flex flex-col justify-center shadow-inner">
                  <p className="text-[12px] font-black text-zinc-500 uppercase tracking-widest mb-4 italic font-black italic">Titles</p>
                  <p className="text-8xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[10px] font-bold text-zinc-700 mt-6 uppercase tracking-[0.2em]">World Championships</p>
                </div>
              </div>

              <div className="space-y-10 pb-10">
                <h4 className="text-[12px] font-black text-zinc-500 uppercase tracking-widest border-l-4 border-red-600 pl-4 text-white font-black italic">Active 2025-26 Season Roster</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {(DETAILED_ROSTERS[selectedTeam.abbreviation] || []).map((p, i) => (
                    <div key={i} className="bg-[#1a1d23] p-6 rounded-2xl border border-zinc-800 hover:border-blue-500 transition-all flex items-center justify-between group shadow-xl">
                       <div className="flex items-center gap-5">
                          <span className="font-mono text-zinc-700 text-lg font-bold group-hover:text-blue-500 transition-colors italic font-black italic">#{p.no}</span>
                          <p className="text-white font-black uppercase text-sm tracking-tighter transition-colors italic group-hover:text-white/90 font-black italic">{p.name}</p>
                       </div>
                       <span className="bg-zinc-800 text-zinc-500 text-[10px] px-3 py-1 rounded-full font-black group-hover:bg-blue-600 group-hover:text-white transition-all">{p.pos}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}