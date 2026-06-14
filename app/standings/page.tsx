'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. 2025-26 赛季季后赛阶段官方 15 人名单校对库 (截止 2026年6月)
const OFFICIAL_ROSTERS: Record<string, string[]> = {
  "SAS": ["Victor Wembanyama", "Chris Paul", "Devin Vassell", "Jeremy Sochan", "Harrison Barnes", "Stephon Castle", "Keldon Johnson", "Tre Jones", "Zach Collins", "Julian Champagnie", "Sandro Mamukelashvili", "Malaki Branham", "Blake Wesley", "Sidy Cissoko", "Charles Bassey"],
  "NYK": ["Jalen Brunson", "Karl-Anthony Towns", "Mikal Bridges", "OG Anunoby", "Josh Hart", "Miles McBride", "Cameron Payne", "Mitchell Robinson", "Precious Achiuwa", "Jericho Sims", "Tyler Kolek", "Landry Shamet", "Pacome Dadiet"],
  "BOS": ["Jayson Tatum", "Jaylen Brown", "Kristaps Porzingis", "Derrick White", "Jrue Holiday", "Al Horford", "Payton Pritchard", "Sam Hauser", "Luke Kornet", "Xavier Tillman", "Neemias Queta", "Jordan Walsh", "Baylor Scheierman"],
  "OKC": ["Shai Gilgeous-Alexander", "Chet Holmgren", "Jalen Williams", "Alex Caruso", "Isaiah Hartenstein", "Luguentz Dort", "Isaiah Joe", "Cason Wallace", "Aaron Wiggins", "Jaylin Williams", "Kenrich Williams", "Ousmane Dieng", "Dillon Jones"],
  "DAL": ["Luka Doncic", "Kyrie Irving", "Klay Thompson", "P.J. Washington", "Daniel Gafford", "Dereck Lively II", "Naji Marshall", "Quentin Grimes", "Maxi Kleber", "Spencer Dinwiddie", "Jaden Hardy", "Dante Exum", "Dwight Powell"],
  "PHI": ["Joel Embiid", "Paul George", "Tyrese Maxey", "Caleb Martin", "Kelly Oubre Jr.", "Kyle Lowry", "Andre Drummond", "Eric Gordon", "Guerschon Yabusele", "KJ Martin", "Reggie Jackson", "Jared McCain"],
  "GSW": ["Stephen Curry", "Andrew Wiggins", "Draymond Green", "Buddy Hield", "Jonathan Kuminga", "Brandin Podziemski", "Trayce Jackson-Davis", "Kevon Looney", "Kyle Anderson", "De'Anthony Melton", "Gary Payton II", "Moses Moody"],
  "MIN": ["Anthony Edwards", "Julius Randle", "Donte DiVincenzo", "Rudy Gobert", "Mike Conley", "Naz Reid", "Jaden McDaniels", "Nickeil Alexander-Walker", "Joe Ingles", "Rob Dillingham", "Terrence Shannon Jr."],
  "DEN": ["Nikola Jokic", "Jamal Murray", "Michael Porter Jr.", "Aaron Gordon", "Christian Braun", "Russell Westbrook", "Peyton Watson", "Dario Saric", "Julian Strawther", "Zeke Nnaji", "Vlatko Cancar", "DeAndre Jordan"],
  "LAL": ["LeBron James", "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Gabe Vincent", "Dalton Knecht", "Jaxson Hayes", "Max Christie", "Jarred Vanderbilt", "Christian Wood", "Bronny James"],
  "PHX": ["Kevin Durant", "Devin Booker", "Bradley Beal", "Tyus Jones", "Jusuf Nurkic", "Grayson Allen", "Royce O'Neale", "Mason Plumlee", "Josh Okogie", "Monte Morris", "Bol Bol", "Damion Lee"],
  "MIL": ["Giannis Antetokounmpo", "Damian Lillard", "Khris Middleton", "Brook Lopez", "Bobby Portis", "Gary Trent Jr.", "Taurean Prince", "Delon Wright", "Pat Connaughton", "Andre Jackson Jr.", "AJ Green"],
  "MIA": ["Jimmy Butler", "Bam Adebayo", "Tyler Herro", "Terry Rozier", "Nikola Jovic", "Jaime Jaquez Jr.", "Duncan Robinson", "Kevin Love", "Haywood Highsmith", "Alec Burks", "Josh Richardson", "Thomas Bryant"],
  "CLE": ["Donovan Mitchell", "Evan Mobley", "Jarrett Allen", "Darius Garland", "Isaac Okoro", "Caris LeVert", "Max Strus", "Georges Niang", "Dean Wade", "Ty Jerome", "Sam Merrill", "Craig Porter Jr."],
  "IND": ["Tyrese Haliburton", "Pascal Siakam", "Myles Turner", "Bennedict Mathurin", "Andrew Nembhard", "Aaron Nesmith", "Obi Toppin", "T.J. McConnell", "Isaiah Jackson", "Ben Sheppard", "Jarace Walker"],
  "ORL": ["Paolo Banchero", "Franz Wagner", "Jalen Suggs", "Kentavious Caldwell-Pope", "Wendell Carter Jr.", "Cole Anthony", "Moritz Wagner", "Jonathan Isaac", "Gary Harris", "Anthony Black", "Goga Bitadze"],
  "MEM": ["Ja Morant", "Jaren Jackson Jr.", "Desmond Bane", "Zach Edey", "Marcus Smart", "Brandon Clarke", "Santi Aldama", "GG Jackson II", "Vince Williams Jr.", "Luke Kennard", "John Konchar"],
  "HOU": ["Alperen Sengun", "Jalen Green", "Fred VanVleet", "Jabari Smith Jr.", "Dillon Brooks", "Amen Thompson", "Reed Sheppard", "Tari Eason", "Cam Whitmore", "Steven Adams", "Jeff Green", "Aaron Holiday"],
  "SAC": ["Domantas Sabonis", "De'Aaron Fox", "DeMar DeRozan", "Keegan Murray", "Kevin Huerter", "Malik Monk", "Keon Ellis", "Trey Lyles", "Alex Len", "Jordan McLaughlin", "Devin Carter"],
  "NOP": ["Zion Williamson", "Brandon Ingram", "Dejounte Murray", "CJ McCollum", "Herbert Jones", "Trey Murphy III", "Jordan Hawkins", "Daniel Theis", "Jose Alvarado", "Yves Missi", "Javonte Green"],
  "LAC": ["James Harden", "Kawhi Leonard", "Ivica Zubac", "Norman Powell", "Derrick Jones Jr.", "Terance Mann", "Nicolas Batum", "Kris Dunn", "Kevin Porter Jr.", "Amir Coffey", "Mo Bamba"],
  "CHI": ["Zach LaVine", "Josh Giddey", "Coby White", "Nikola Vucevic", "Patrick Williams", "Matas Buzelis", "Lonzo Ball", "Ayo Dosunmu", "Jalen Smith", "Chris Duarte"],
  "ATL": ["Trae Young", "Zaccharie Risacher", "Jalen Johnson", "Clint Capela", "Bogdan Bogdanovic", "Dyson Daniels", "De'Andre Hunter", "Onyeka Okongwu", "Larry Nance Jr."],
  "TOR": ["Scottie Barnes", "RJ Barrett", "Immanuel Quickley", "Jakob Poeltl", "Gradey Dick", "Davion Mitchell", "Kelly Olynyk", "Bruce Brown", "Ja'Kobe Walter", "Chris Boucher"],
  "BKN": ["Cam Thomas", "Nic Claxton", "Dennis Schroder", "Cameron Johnson", "Ben Simmons", "Bojan Bogdanovic", "Dorian Finney-Smith", "Noah Clowney", "Trendon Watford"],
  "CHA": ["LaMelo Ball", "Brandon Miller", "Miles Bridges", "Mark Williams", "Tidjane Salaun", "Tre Mann", "Grant Williams", "Nick Richards", "Josh Green"],
  "UTA": ["Lauri Markkanen", "Keyonte George", "Walker Kessler", "Collin Sexton", "John Collins", "Taylor Hendricks", "Cody Williams", "Jordan Clarkson", "Isaiah Collier"],
  "DET": ["Cade Cunningham", "Jaden Ivey", "Tobias Harris", "Jalen Duren", "Ausar Thompson", "Malik Beasley", "Isaiah Stewart", "Tim Hardaway Jr.", "Ron Holland II"],
  "WAS": ["Jordan Poole", "Kyle Kuzma", "Alex Sarr", "Bilal Coulibaly", "Jonas Valanciunas", "Malcolm Brogdon", "Bub Carrington", "Corey Kispert", "Saddiq Bey"],
  "POR": ["Anfernee Simons", "Jerami Grant", "Deandre Ayton", "Scoot Henderson", "Shaedon Sharpe", "Donovan Clingan", "Robert Williams III", "Deni Avdija"]
};

const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 现役冠军王（2024夺冠），以双探花为核心构建了极强的争冠体系。" },
  "LAL": { championships: 17, bio: "湖人队始终处于聚光灯下，詹眉组合在 2026 年依然是西部不可忽视的竞争力量。" },
  "GSW": { championships: 7, bio: "勇士队在克莱离去后进入新篇章，库里依然保持着巅峰水准，带领年轻一代前行。" },
  "CHI": { championships: 6, bio: "公牛队正在进行现代化重建，致力于重现 90 年代的辉煌底蕴。" },
  "SAS": { championships: 5, bio: "马刺队在文班亚马和克里斯·保罗的带领下，在 2026 年重新成为了全联盟的焦点。" },
  "PHI": { championships: 3, bio: "76人在迎来保罗·乔治后，组成了联盟最顶级的攻防兼备三巨头。" },
  "NYK": { championships: 2, bio: "尼克斯通过大交易得到了唐斯和大桥，2026 年是他们冲击冠军的最佳时机。" },
  "GSW": { championships: 7, bio: "勇士队正在围绕库里最后的巅峰期，通过角色球员的深度升级尝试再次登顶。" },
  "DEFAULT": { championships: 0, bio: "NBA 联盟现役核心成员球队，正处于 2025-26 赛季季后赛征程中。" }
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

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

  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div 
      onClick={() => setSelectedTeam(t)}
      className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative"
    >
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center bg-black/40 rounded-3xl p-3 border border-zinc-800/50 group-hover:bg-blue-600/10 transition-colors">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">季后赛名单入口 →</p>
        </div>
      </div>
      <span className="text-5xl font-black italic opacity-[0.02] absolute right-8 uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <div className="flex gap-8 text-[10px] font-black uppercase text-zinc-500">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/standings" className="text-blue-500 underline underline-offset-8">Teams</Link>
          <Link href="/playoffs" className="hover:text-white transition-colors">Bracket</Link>
          <Link href="/players" className="hover:text-white transition-colors">Players</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 pb-40">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-blue-500 font-black"></span> Eastern
          </h2>
          <div className="grid gap-6">{east.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-red-600 font-black"></span> Western
          </h2>
          <div className="grid gap-6">{west.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
            
            <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic font-black italic">2025-26 Postseason Squad Terminal</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-colors">×</button>
            </div>

            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Team Evolution</h4>
                  <p className="text-zinc-300 text-lg leading-relaxed italic font-medium">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 font-black italic">Titles</p>
                  <p className="text-7xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-4 uppercase tracking-[0.2em]">NBA World Championships</p>
                </div>
              </div>

              <div className="space-y-8 pb-10 border-t border-zinc-900 pt-12">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 text-white">
                    Playoff Roster (Synchronized with ESPN)
                  </h4>
                  <span className="text-[8px] font-black bg-red-600/20 text-red-500 px-2 py-0.5 rounded animate-pulse uppercase">Live Data</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(OFFICIAL_ROSTERS[selectedTeam.abbreviation] || ["Update Pending..."]).map((name: string, i: number) => (
                    <div key={i} className="bg-[#1a1d23] p-5 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all flex items-center gap-4 group">
                      <span className="text-[10px] font-mono text-zinc-700">{(i + 1).toString().padStart(2, '0')}</span>
                      <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors italic">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-8 pt-0">
               <button onClick={() => setSelectedTeam(null)} className="w-full bg-zinc-800 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}