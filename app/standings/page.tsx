'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 1. 准确的 NBA 30 支球队全量数据库 (更正后的冠军数 & 简介)
const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, founded: "1946", bio: "凯尔特人是 NBA 历史上获得冠军最多的球队，拥有浓厚的绿军铁血文化。" },
  "LAL": { championships: 17, founded: "1947", bio: "坐拥洛杉矶，紫金军团是好莱坞星光与篮球冠军底蕴的完美结合。" },
  "GSW": { championships: 7, founded: "1946", bio: "金州勇士在过去十年通过三分革命彻底改变了现代篮球的打法。" },
  "CHI": { championships: 6, founded: "1966", bio: "迈克尔·乔丹在 90 年代带领公牛完成了两次三连冠伟业。" },
  "SAS": { championships: 5, founded: "1967", bio: "马刺以长达二十年的稳定表现和完美的团队体系闻名联盟。" },
  "PHI": { championships: 3, founded: "1946", bio: "76人队历史悠久，从张伯伦到艾弗森，始终是东部的核心力量。" },
  "DET": { championships: 3, founded: "1941", bio: "活塞的“坏孩子军团”和 04 年的平民冠军是其铁血防守的代名词。" },
  "MIA": { championships: 3, founded: "1988", bio: "热火队以坚韧的文化著称，是联盟中执行力和纪律性最强的球队。" },
  "MIL": { championships: 2, founded: "1968", bio: "密尔沃基雄鹿在阿德托昆博的带领下再次回到了冠军行列。" },
  "HOU": { championships: 2, founded: "1967", bio: "奥拉朱旺时期的连冠是火箭队的巅峰，目前正处于青年才俊的重建期。" },
  "NYK": { championships: 2, founded: "1946", bio: "纽约尼克斯拥有世界上最著名的球馆麦迪逊广场花园。" },
  "CLE": { championships: 1, founded: "1970", bio: "2016 年勒布朗·詹姆斯带领克利夫兰完成了史诗级的逆转夺冠。" },
  "DAL": { championships: 1, founded: "1980", bio: "独行侠不仅是达拉斯的骄傲，更是欧洲天才球员通往 NBA 的圣地。" },
  "TOR": { championships: 1, founded: "1995", bio: "作为唯一一支加拿大球队，2019 年的冠军引爆了整个国家的篮球热情。" },
  "DEN": { championships: 1, founded: "1967", bio: "丹佛掘金在约基奇的带领下，于 2023 年夺得了队史首冠。" },
  "POR": { championships: 1, founded: "1970", bio: "开拓者拥有全联盟最忠诚的球迷群体之一，撕裂之城永远充满斗志。" },
  "SAC": { championships: 1, founded: "1923", bio: "国王队正通过华丽的进攻重新找回 21 世纪初期的强队感觉。" },
  "WAS": { championships: 1, founded: "1961", bio: "代表美国首都的球队，历史上曾拥有昂塞尔德等传奇内线。" },
  "OKC": { championships: 1, founded: "1967", bio: "雷霆队继承了超音速的遗产，目前拥有全联盟最令人艳羡的选秀资产。" },
  "ATL": { championships: 1, founded: "1946", bio: "老鹰队在亚特兰大扎根多年，始终保持着极强的季后赛竞争性。" },
  "PHX": { championships: 0, founded: "1968", bio: "太阳队历史底蕴深厚，曾多次杀入总决赛，目前正在全力冲击首冠。" },
  "IND": { championships: 0, founded: "1967", bio: "步行者代表了印第安纳州的篮球狂热，是一支极其重视基本功的球队。" },
  "LAC": { championships: 0, founded: "1970", bio: "快船队正在新球馆开启新纪元，致力于打破洛杉矶的旧格局。" },
  "MEM": { championships: 0, founded: "1995", bio: "孟菲斯灰熊以坚韧和磨砺（Grit and Grind）精神著称。" },
  "MIN": { championships: 0, founded: "1989", bio: "森林狼在爱德华兹的率领下，正处于队史最具希望的爆发期。" },
  "NOP": { championships: 0, founded: "2002", bio: "鹈鹕队坐拥新奥尔良，是一支充满天赋和运动能力的青年军。" },
  "ORL": { championships: 0, founded: "1989", bio: "奥兰多魔术曾在奥尼尔和霍华德时代两次打入总决赛。" },
  "BKN": { championships: 0, founded: "1967", bio: "布鲁克林篮网致力于打造最酷的都市篮球文化。" },
  "CHA": { championships: 0, founded: "1988", bio: "黄蜂队在夏洛特拥有独特的蜂巢文化，正处于新一代领袖的磨合期。" },
  "UTA": { championships: 0, founded: "1974", bio: "爵士队以严明的战术执行力和坚固的高原主场优势闻名。" },
  "DEFAULT": { championships: 0, founded: "N/A", bio: "NBA 联盟正式成员球队。" }
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 1. 获取所有 30 支球队
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: PRO_HEADERS });
        const data = await res.json();
        // 过滤保留官方 30 支现役队
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error(e); }
    }
    fetchTeams();
  }, []);

  // 2. 抓取该球队的【准确现役名单】
  const fetchRoster = async (teamId: number) => {
    setLoadingRoster(true);
    setRoster([]);
    try {
      // 关键修正：通过 stats 接口抓取 2025 赛季在该队出场过的球员，这才是真正的现役名单
      const res = await fetch(`https://api.balldontlie.io/v1/stats?team_ids[]=${teamId}&seasons[]=2025&per_page=50`, { headers: PRO_HEADERS });
      const data = await res.json();
      
      // 数据去重：因为每场比赛都会返回球员，我们要按球员 ID 去重
      const rawPlayers = data.data.map((s: any) => s.player);
      const uniquePlayers = Array.from(new Map(rawPlayers.map((p: any) => [p.id, p])).values());
      
      setRoster(uniquePlayers);
    } catch (e) { 
        console.error(e); 
    } finally {
        setLoadingRoster(false);
    }
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    fetchRoster(team.id);
  };

  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div onClick={() => handleTeamClick(t)} className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative">
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Terminal Details →</p>
        </div>
      </div>
      <span className="text-5xl font-black italic opacity-[0.03] absolute right-8 group-hover:opacity-10 transition-opacity uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic uppercase tracking-tighter">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="text-zinc-500 font-black text-[10px] hover:text-white uppercase tracking-[0.3em] border border-zinc-800 px-8 py-3 rounded-full">Back to Home</Link>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-blue-500"></span> Eastern
          </h2>
          <div className="grid gap-6">{east.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-red-600"></span> Western
          </h2>
          <div className="grid gap-6">{west.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-500">
            
            <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{selectedTeam.city} • NBA Member Team</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-red-600 transition-colors">×</button>
            </div>

            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4 text-white">Team Bio</h4>
                  <p className="text-zinc-400 text-lg leading-relaxed italic">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Championships</p>
                  <p className="text-7xl font-black italic text-blue-500">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[8px] font-bold text-zinc-700 mt-2 uppercase tracking-widest">Larry O'Brien Trophies</p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 flex justify-between items-center text-white">
                  <span>Current 2025-26 Roster</span>
                  <span className="text-[8px] text-zinc-700 font-black animate-pulse uppercase tracking-[0.2em]">Live Pro Data Sync</span>
                </h4>
                
                {loadingRoster ? (
                   <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : roster.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roster.map((player: any) => (
                      <div key={player.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all group overflow-hidden relative">
                         <div className="relative z-10">
                            <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors">{player.first_name} {player.last_name}</p>
                            <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase tracking-widest">{player.position || 'G-F'}</p>
                         </div>
                         <span className="absolute bottom-[-10px] right-[-5px] text-3xl font-black italic text-white/[0.02] uppercase group-hover:text-blue-500/5 transition-colors">{player.position}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                    名单正在同步中，请稍后刷新 (Syncing...)
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 pt-0">
               <button onClick={() => setSelectedTeam(null)} className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-blue-700 transition-all shadow-xl">Exit Team Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}