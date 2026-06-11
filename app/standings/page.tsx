'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. NBA 官方 2025-26 赛季 15 人核心名单校对库
const OFFICIAL_ROSTERS: Record<string, string[]> = {
  "SAS": ["Victor Wembanyama", "Devin Vassell", "Jeremy Sochan", "Chris Paul", "Harrison Barnes", "Stephon Castle", "Keldon Johnson", "Tre Jones", "Zach Collins", "Julian Champagnie", "Sandro Mamukelashvili", "Malaki Branham", "Blake Wesley", "Sidy Cissoko", "Charles Bassey"],
  "NYK": ["Jalen Brunson", "Karl-Anthony Towns", "Mikal Bridges", "Josh Hart", "OG Anunoby", "Miles McBride", "Cameron Payne", "Mitchell Robinson", "Precious Achiuwa", "Jericho Sims", "Tyler Kolek", "Landry Shamet", "Pacome Dadiet", "Ariel Hukporti", "Jacob Toppin"],
  "BOS": ["Jayson Tatum", "Jaylen Brown", "Kristaps Porzingis", "Derrick White", "Jrue Holiday", "Al Horford", "Payton Pritchard", "Sam Hauser", "Luke Kornet", "Xavier Tillman", "Neemias Queta", "Jordan Walsh", "Baylor Scheierman", "Anton Watson", "Drew Peterson"],
  "GSW": ["Stephen Curry", "Andrew Wiggins", "Draymond Green", "Buddy Hield", "Jonathan Kuminga", "Brandin Podziemski", "Trayce Jackson-Davis", "Kevon Looney", "De'Anthony Melton", "Kyle Anderson", "Gary Payton II", "Moses Moody", "Lindy Waters III", "Gui Santos", "Quint Post"],
  "LAL": ["LeBron James", "Anthony Davis", "Austin Reaves", "D'Angelo Russell", "Rui Hachimura", "Gabe Vincent", "Jarred Vanderbilt", "Max Christie", "Jaxson Hayes", "Dalton Knecht", "Bronny James", "Cam Reddish", "Jalen Hood-Schifino", "Christian Wood", "Christian Koloko"],
  "DAL": ["Luka Doncic", "Kyrie Irving", "Klay Thompson", "P.J. Washington", "Daniel Gafford", "Dereck Lively II", "Naji Marshall", "Quentin Grimes", "Maxi Kleber", "Spencer Dinwiddie", "Jaden Hardy", "Dante Exum", "Olivier-Maxence Prosper", "Kesad Edwards", "Dwight Powell"],
  "OKC": ["Shai Gilgeous-Alexander", "Chet Holmgren", "Jalen Williams", "Alex Caruso", "Isaiah Hartenstein", "Luguentz Dort", "Isaiah Joe", "Cason Wallace", "Aaron Wiggins", "Jaylin Williams", "Kenrich Williams", "Ousmane Dieng", "Dillon Jones", "Ajay Mitchell", "Nikola Topic"],
  "DEN": ["Nikola Jokic", "Jamal Murray", "Michael Porter Jr.", "Aaron Gordon", "Christian Braun", "Russell Westbrook", "Peyton Watson", "Dario Saric", "Julian Strawther", "Zeke Nnaji", "Vlatko Cancar", "DeAndre Jordan", "Hunter Tyson", "Jalen Pickett", "Trey Alexander"],
  "PHX": ["Kevin Durant", "Devin Booker", "Bradley Beal", "Tyus Jones", "Jusuf Nurkic", "Grayson Allen", "Royce O'Neale", "Mason Plumlee", "Josh Okogie", "Monte Morris", "Bol Bol", "Damion Lee", "Oso Ighodaro", "Ryan Dunn", "Jalen Bridges"],
  "MIN": ["Anthony Edwards", "Julius Randle", "Donte DiVincenzo", "Rudy Gobert", "Mike Conley", "Naz Reid", "Jaden McDaniels", "Nickeil Alexander-Walker", "Joe Ingles", "Rob Dillingham", "Terrence Shannon Jr.", "Luka Garza", "Josh Minott", "Leonard Miller", "P.J. Dozier"],
  "PHI": ["Joel Embiid", "Paul George", "Tyrese Maxey", "Caleb Martin", "Kelly Oubre Jr.", "Kyle Lowry", "Andre Drummond", "Eric Gordon", "Guerschon Yabusele", "KJ Martin", "Reggie Jackson", "Jared McCain", "Adem Bona", "Ricky Council IV", "Guerschon Yabusele"],
  "MIL": ["Giannis Antetokounmpo", "Damian Lillard", "Khris Middleton", "Brook Lopez", "Bobby Portis", "Gary Trent Jr.", "Taurean Prince", "Delon Wright", "Pat Connaughton", "Andre Jackson Jr.", "AJ Green", "MarJon Beauchamp", "Tyler Smith", "AJ Johnson", "Chris Livingston"],
  "MIA": ["Jimmy Butler", "Bam Adebayo", "Tyler Herro", "Terry Rozier", "Nikola Jovic", "Jaime Jaquez Jr.", "Duncan Robinson", "Kevin Love", "Haywood Highsmith", "Alec Burks", "Josh Richardson", "Thomas Bryant", "Kel'el Ware", "Pelle Larsson", "Dru Smith"],
  "LAC": ["James Harden", "Kawhi Leonard", "Ivica Zubac", "Norman Powell", "Derrick Jones Jr.", "Terance Mann", "Nicolas Batum", "Kris Dunn", "Kevin Porter Jr.", "Amir Coffey", "Mo Bamba", "P.J. Tucker", "Bones Hyland", "Kai Jones", "Cam Christie"],
  "CLE": ["Donovan Mitchell", "Evan Mobley", "Jarrett Allen", "Darius Garland", "Isaac Okoro", "Caris LeVert", "Max Strus", "Georges Niang", "Dean Wade", "Ty Jerome", "Sam Merrill", "Craig Porter Jr.", "Jaylon Tyson", "Tristan Thompson", "JT Thor"],
  "IND": ["Tyrese Haliburton", "Pascal Siakam", "Myles Turner", "Bennedict Mathurin", "Andrew Nembhard", "Aaron Nesmith", "Obi Toppin", "T.J. McConnell", "Isaiah Jackson", "Ben Sheppard", "Jarace Walker", "James Wiseman", "Johnny Furphy", "Kendall Brown", "Enrique Freeman"],
  "ORL": ["Paolo Banchero", "Franz Wagner", "Jalen Suggs", "Kentavious Caldwell-Pope", "Wendell Carter Jr.", "Cole Anthony", "Moritz Wagner", "Jonathan Isaac", "Gary Harris", "Anthony Black", "Goga Bitadze", "Tristan da Silva", "Jett Howard", "Caleb Houstan", "Cory Joseph"],
  "HOU": ["Alperen Sengun", "Jalen Green", "Fred VanVleet", "Jabari Smith Jr.", "Dillon Brooks", "Amen Thompson", "Reed Sheppard", "Tari Eason", "Cam Whitmore", "Steven Adams", "Jeff Green", "Aaron Holiday", "Jock Landale", "Tari Eason", "N'Faly Dante"],
  "SAC": ["Domantas Sabonis", "De'Aaron Fox", "DeMar DeRozan", "Keegan Murray", "Kevin Huerter", "Malik Monk", "Keon Ellis", "Trey Lyles", "Alex Len", "Jordan McLaughlin", "Devin Carter", "Jalen McDaniels", "Colby Jones", "Isaac Jones", "Mason Jones"],
  "MEM": ["Ja Morant", "Jaren Jackson Jr.", "Desmond Bane", "Zach Edey", "Marcus Smart", "Brandon Clarke", "Santi Aldama", "GG Jackson II", "Vince Williams Jr.", "Luke Kennard", "John Konchar", "Jake LaRavia", "Scotty Pippen Jr.", "Jaylen Wells", "Jay Huff"],
  "NOP": ["Zion Williamson", "Brandon Ingram", "Dejounte Murray", "CJ McCollum", "Herbert Jones", "Trey Murphy III", "Jordan Hawkins", "Daniel Theis", "Jose Alvarado", "Yves Missi", "Javonte Green", "Jeremiah Robinson-Earl", "Antonio Reeves", "Karane Lewis", "Jaylen Nowell"],
  "CHI": ["Zach LaVine", "Josh Giddey", "Coby White", "Nikola Vucevic", "Patrick Williams", "Matas Buzelis", "Lonzo Ball", "Ayo Dosunmu", "Jalen Smith", "Chris Duarte", "Torrey Craig", "Julian Phillips", "Dalen Terry", "Jevon Carter", "Adama Sanogo"],
  "ATL": ["Trae Young", "Zaccharie Risacher", "Jalen Johnson", "Clint Capela", "Bogdan Bogdanovic", "Dyson Daniels", "De'Andre Hunter", "Onyeka Okongwu", "Larry Nance Jr.", "Garrison Mathews", "Kobe Bufkin", "David Roddy", "Vit Krejci", "Dominick Barlow", "Seth Lundy"],
  "TOR": ["Scottie Barnes", "RJ Barrett", "Immanuel Quickley", "Jakob Poeltl", "Gradey Dick", "Davion Mitchell", "Kelly Olynyk", "Bruce Brown", "Ja'Kobe Walter", "Chris Boucher", "Ochai Agbaji", "Jonathan Mogbo", "Jamal Shead", "Bruno Fernando", "Garrett Temple"],
  "BKN": ["Cam Thomas", "Nic Claxton", "Dennis Schroder", "Cameron Johnson", "Ben Simmons", "Bojan Bogdanovic", "Dorian Finney-Smith", "Noah Clowney", "Trendon Watford", "Ziaire Williams", "Jalen Wilson", "Day'Ron Sharpe", "Shake Milton", "Dariq Whitehead", "Cui Yongxi"],
  "UTA": ["Lauri Markkanen", "Keyonte George", "Walker Kessler", "Collin Sexton", "John Collins", "Taylor Hendricks", "Cody Williams", "Jordan Clarkson", "Isaiah Collier", "Kyle Filipowski", "Drew Eubanks", "Patty Mills", "Brice Sensabaugh", "Brice Sensabaugh", "Johnny Juzang"],
  "CHA": ["LaMelo Ball", "Brandon Miller", "Miles Bridges", "Mark Williams", "Tidjane Salaun", "Tre Mann", "Grant Williams", "Nick Richards", "Josh Green", "Vasilije Micic", "Cody Martin", "Seth Curry", "KJ Simpson", "Nick Smith Jr.", "Moussa Diabate"],
  "DET": ["Cade Cunningham", "Jaden Ivey", "Tobias Harris", "Jalen Duren", "Ausar Thompson", "Malik Beasley", "Isaiah Stewart", "Tim Hardaway Jr.", "Ron Holland II", "Simone Fontecchio", "Paul Reed", "Marcus Sasser", "Wendell Moore Jr.", "Boban Marjanovic", "Tolu Smith"],
  "WAS": ["Jordan Poole", "Kyle Kuzma", "Alex Sarr", "Bilal Coulibaly", "Jonas Valanciunas", "Malcolm Brogdon", "Bub Carrington", "Corey Kispert", "Saddiq Bey", "Kyshawn George", "Marvin Bagley III", "Richaun Holmes", "Patrick Baldwin Jr.", "Jared Butler", "Anthony Gill"],
  "POR": ["Anfernee Simons", "Jerami Grant", "Deandre Ayton", "Scoot Henderson", "Shaedon Sharpe", "Donovan Clingan", "Robert Williams III", "Deni Avdija", "Toumani Camara", "Matisse Thybulle", "Duop Reath", "Jabari Walker", "Kris Murray", "Rayan Rupert", "Dalano Banton"]
};

// 球队荣誉 & 简介 (已修正重复项)
const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 历史之王，2024 年夺得第 18 冠，绿军王朝底蕴深厚。" },
  "LAL": { championships: 17, bio: "洛杉矶湖人是紫金王朝，拥有全联盟最璀璨的巨星历史与冠军基因。" },
  "GSW": { championships: 7, bio: "金州勇士开创了三分革命，库里带领球队在 8 年内夺得 4 冠，改写了篮球历史。" },
  "CHI": { championships: 6, bio: "公牛队在 90 年代凭借迈克尔·乔丹完成了两次三连冠，定义了篮球的巅峰。" },
  "SAS": { championships: 5, bio: "马刺队以完美的团队篮球和波波维奇的执教艺术闻名，文班亚马正开启新时代。" },
  "PHI": { championships: 3, bio: "费城 76 人历史底蕴深厚，从张伯伦到恩比德，始终是东部的核心竞争者。" },
  "MIA": { championships: 3, bio: "热火队以“热火文化（Heat Culture）”著称，代表了极致的纪律、努力与强硬。" },
  "DET": { championships: 3, bio: "底特律活塞是蓝领篮球的巅峰，曾以强悍防守打破了巨星对冠军的垄断。" },
  "MIL": { championships: 2, bio: "雄鹿队在字母哥的带领下夺取队史第二冠，是现代 NBA 最具身体统治力的球队。" },
  "HOU": { championships: 2, bio: "休斯顿火箭曾创造奥拉朱旺时代的连冠辉煌，目前正致力于航天城的重建。" },
  "NYK": { championships: 2, bio: "尼克斯坐拥麦迪逊花园，是全联盟曝光度最高的球队，布伦森正带领大苹果城复兴。" },
  "CLE": { championships: 1, bio: "克利夫兰骑士在 2016 年完成了总决赛史诗级的 1-3 逆转夺冠，改写了城市命运。" },
  "DAL": { championships: 1, bio: "独行侠不仅是德州的骄傲，更是欧洲天才东契奇通往 NBA 巅峰的展示窗口。" },
  "OKC": { championships: 1, bio: "雷霆队的前身超音速曾夺冠，如今在 SGA 带领下正处于队史最具希望的巅峰。" },
  "DEN": { championships: 1, bio: "丹佛掘金拥有约基奇，以无私的传导球和高效进攻体系夺取了 2023 年总冠军。" },
  "TOR": { championships: 1, bio: "猛龙队作为加拿大唯一代表，在 2019 年书写了北境夺冠奇迹。" },
  "POR": { championships: 1, bio: "开拓者在“撕裂之城”拥有最狂热的主场，坚韧与忠诚是这支球队的标签。" },
  "SAC": { championships: 1, bio: "国王队正通过华丽的进攻和极速的节奏重新找回 21 世纪初期的豪强感觉。" },
  "ATL": { championships: 1, bio: "老鹰队始终保持着极高的进攻节奏和观赏性，是一支充满活力的南方劲旅。" },
  "WAS": { championships: 1, bio: "奇才队历史底蕴深厚，作为首都球队，目前正处于重构竞争力的关键期。" },
  "IND": { championships: 0, bio: "印第安纳步行者代表了最纯粹的篮球热爱，打法极其无私且充满韧性。" },
  "LAC": { championships: 0, bio: "快船队正在新球馆开启新纪元，致力于打破洛杉矶的旧格局。" },
  "MEM": { championships: 0, bio: "孟菲斯灰熊以坚韧和磨砺（Grit and Grind）精神著称，球风硬朗。" },
  "MIN": { championships: 0, bio: "森林狼由爱德华兹率领，正处于队史最具统治力和希望的阶段。" },
  "NOP": { championships: 0, bio: "鹈鹕队坐拥新奥尔良，是一支充满天赋和运动能力的青年军。" },
  "ORL": { championships: 0, bio: "魔术队正迅速成长为东部新贵，防守体系和天赋上限令人期待。" },
  "CHA": { championships: 0, bio: "黄蜂队在夏洛特拥有独特的蜂巢文化，致力于打造全新的竞争身份。" },
  "UTA": { championships: 0, bio: "犹他爵士以严明的执行力和坚固的高原主场优势闻名西部。" },
  "BKN": { championships: 0, bio: "布鲁克林篮网致力于打造最前卫的都市篮球品牌。" },
  "DEFAULT": { championships: 0, bio: "NBA 联盟正式成员球队，致力于追求奥布莱恩杯。" }
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
        <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50 group-hover:bg-blue-600/10 transition-colors">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1 italic">Roster Terminal →</p>
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
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4 font-black italic">
             <span className="w-16 h-[3px] bg-blue-500 font-black"></span> Eastern
          </h2>
          <div className="grid gap-6">{east.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4 font-black italic">
             <span className="w-16 h-[3px] bg-red-600 font-black"></span> Western
          </h2>
          <div className="grid gap-6">{west.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
            
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic font-black italic">Official Roster Terminal • 2025-26</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-colors font-light">×</button>
            </div>

            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Team Introduction</h4>
                  <p className="text-zinc-300 text-lg leading-relaxed italic font-medium">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 font-black italic">Championships</p>
                  <p className="text-7xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-4 uppercase tracking-[0.2em]">Larry O'Brien Trophies</p>
                </div>
              </div>

              <div className="space-y-8 pb-10">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 text-white">
                  2025-26 Active Squad (Official 15)
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(OFFICIAL_ROSTERS[selectedTeam.abbreviation] || ["No Roster Data Available"]).map((name: string, i: number) => (
                    <div key={i} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all flex items-center gap-4 group">
                      <span className="text-[10px] font-mono text-zinc-700">{(i + 1).toString().padStart(2, '0')}</span>
                      <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors italic">{name}</p>
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