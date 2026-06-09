'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// NBA 30 支球队全量准确荣誉库
const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 历史夺冠王，以坚韧的防守和绿军文化闻名。" },
  "LAL": { championships: 17, bio: "洛杉矶湖人是拥有超级星味与辉煌底蕴的紫金王朝。" },
  "GSW": { championships: 7, bio: "金州勇士开创了三分球时代，是现代篮球战术的引领者。" },
  "CHI": { championships: 6, bio: "公牛队在 90 年代凭借迈克尔·乔丹统治了整个联盟。" },
  "SAS": { championships: 5, bio: "圣安东尼奥马刺以低调、严谨和完美的团队体系著称。" },
  "PHI": { championships: 3, bio: "76人队历史底蕴深厚，一直是东部不可忽视的力量。" },
  "DET": { championships: 3, bio: "底特律活塞代表了蓝领阶级的强韧与铁血防守精神。" },
  "MIA": { championships: 3, bio: "迈阿密热火以其极致的职业态度和热火文化（Heat Culture）闻名。" },
  "MIL": { championships: 2, bio: "密尔沃基雄鹿在字母哥的带领下保持着顶级的竞争力和统治力。" },
  "HOU": { championships: 2, bio: "休斯顿火箭曾创造过辉煌连冠，目前正处于青年军崛起期。" },
  "NYK": { championships: 2, bio: "纽约尼克斯坐拥麦迪逊花园，是全联盟市场价值最高的球队之一。" },
  "CLE": { championships: 1, bio: "克利夫兰骑士在 2016 年完成了 NBA 总决赛史上最伟大的逆转夺冠。" },
  "DAL": { championships: 1, bio: "达拉斯独行侠由东契奇领衔，致力于追逐队史第二座冠军奖杯。" },
  "TOR": { championships: 1, bio: "作为加拿大唯一代表，猛龙在 2019 年书写了北境夺冠奇迹。" },
  "DEN": { championships: 1, bio: "丹佛掘金拥有约基奇，以无私的传导球和高效进攻体系著称。" },
  "POR": { championships: 1, bio: "波特兰开拓者在“撕裂之城”拥有最狂热的球迷主场氛围。" },
  "SAC": { championships: 1, bio: "萨克拉门托国王队正通过华丽的进攻风格重回强队行列。" },
  "WAS": { championships: 1, bio: "奇才队作为首都球队，历史悠久，目前正处于新老更替阶段。" },
  "OKC": { championships: 1, bio: "雷霆队拥有极其恐怖的天赋储备，是西部未来几年的统治级竞争者。" },
  "ATL": { championships: 1, bio: "亚特兰大老鹰始终保持着极高的进攻节奏，是一支充满活力的球队。" },
  "PHX": { championships: 0, bio: "菲尼克斯太阳曾多次杀入决赛，目前仍在全力追求队史首冠。" },
  "LAC": { championships: 0, bio: "洛杉矶快船拥有顶级的球队配置，正在新球馆开启冠军征程。" },
  "MIN": { championships: 0, bio: "明尼苏达森林狼在爱德华兹的率领下，正处于队史巅峰期。" },
  "IND": { championships: 0, bio: "印第安纳步行者代表了印州最纯粹的篮球热爱，进攻火力全联盟顶尖。" },
  "MEM": { championships: 0, bio: "孟菲斯灰熊以坚韧、磨砺和强硬的球风在西部立足。" },
  "NOP": { championships: 0, bio: "新奥尔良鹈鹕是一支极具天赋的侧翼大军，具备极高上限。" },
  "ORL": { championships: 0, bio: "奥兰多魔术凭借年轻的力量，正迅速成长为东部的新贵。" },
  "CHA": { championships: 0, bio: "夏洛特黄蜂在鲍尔的穿针引线下，正在构建全新的球队身份。" },
  "UTA": { championships: 0, bio: "犹他爵士以严明的执行力和高原主场优势著称。" },
  "BKN": { championships: 0, bio: "布鲁克林篮网致力于通过现代化的经营打造大都市篮球标杆。" },
  "DEFAULT": { championships: 0, bio: "NBA 联盟现役 30 支核心成员球队之一。" }
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 1. 抓取所有 30 支球队
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: PRO_HEADERS });
        const data = await res.json();
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error("Teams load error", e); }
    }
    fetchTeams();
  }, []);

  // 2. 抓取该球队的【实时名单】—— 修复“名单一样”的问题
  const fetchRoster = async (teamId: number) => {
    setLoadingRoster(true);
    setRoster([]); // 【第一步】切换球队时立刻清空旧名单，防止数据串线

    try {
      // 使用更直接的 players 接口，通过 team_ids 过滤
      // 增加 per_page=35 确保轮换名单、双向合同球员都能刷出来
      const res = await fetch(`https://api.balldontlie.io/v1/players?team_ids[]=${teamId}&per_page=35`, { headers: PRO_HEADERS });
      const data = await res.json();
      
      // 过滤掉那些已经在数据库里但目前没有位置（可能退役或在海外）的僵尸数据
      const activeRoster = (data.data || []).filter((p: any) => p.position && p.position !== "");
      
      setRoster(activeRoster);
    } catch (e) { 
      console.error("Roster load error", e); 
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
        <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50 group-hover:bg-blue-600/10 transition-colors">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Open Terminal Details →</p>
        </div>
      </div>
      <span className="text-5xl font-black italic opacity-[0.03] absolute right-8 group-hover:opacity-10 transition-opacity uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
        <Link href="/" className="text-zinc-500 font-black text-[10px] hover:text-white uppercase tracking-[0.3em] border border-zinc-800 px-8 py-3 rounded-full">Back to Home</Link>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95 animate-in fade-in duration-300">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">
            
            {/* 终端头部 */}
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">ID: {selectedTeam.id} • NBA Official Terminal</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-colors">×</button>
            </div>

            <div className="p-10 space-y-12">
              {/* 荣誉墙与简介 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Team Introduction</h4>
                  <p className="text-zinc-300 text-lg leading-relaxed italic font-medium">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center flex flex-col justify-center shadow-inner">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Championships</p>
                  <p className="text-7xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-4 uppercase tracking-[0.2em]">NBA Finals Titles</p>
                </div>
              </div>

              {/* 实时名单 Roster */}
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 flex justify-between items-center">
                  <span>Current 2025-26 Active Roster</span>
                  {loadingRoster && <span className="text-[8px] animate-pulse text-red-500">Updating Feed...</span>}
                </h4>
                
                {loadingRoster ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-20">
                     {[...Array(8)].map((_, i) => <div key={i} className="h-16 bg-zinc-800 rounded-2xl animate-pulse"></div>)}
                   </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roster.length > 0 ? roster.map((player: any) => (
                      <div key={player.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all group relative overflow-hidden">
                        <div className="relative z-10">
                          <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors">{player.first_name} {player.last_name}</p>
                          <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase tracking-widest">{player.position}</p>
                        </div>
                        <span className="absolute bottom-[-10px] right-[-5px] text-4xl font-black italic text-white/[0.02] uppercase">{player.position}</span>
                      </div>
                    )) : (
                      <div className="col-span-full py-10 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-600 font-bold uppercase text-[10px]">
                        名单库正在同步中，请尝试搜索特定球员
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 pt-0">
               <button onClick={() => setSelectedTeam(null)} className="w-full bg-zinc-800 py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-zinc-700 transition-all">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}