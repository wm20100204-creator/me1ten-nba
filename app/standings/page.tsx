'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 30支球队准确荣誉库
const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 历史夺冠王，绿军文化代表了极致的团队篮球。" },
  "LAL": { championships: 17, bio: "洛杉矶湖人是紫金王朝，拥有全联盟最璀璨的巨星历史。" },
  "GSW": { championships: 7, bio: "金州勇士通过三分革命改变了现代篮球，是当代的进攻标杆。" },
  "CHI": { championships: 6, bio: "公牛队在 90 年代凭借迈克尔·乔丹统治了整个世界篮球。" },
  "SAS": { championships: 5, bio: "马刺队以低调、严谨和跨越二十年的团队稳定性闻名。" },
  "PHI": { championships: 3, bio: "76人队历史底蕴深厚，代表了费城坚韧不拔的篮球精神。" },
  "DET": { championships: 3, bio: "底特律活塞是蓝领阶级的代表，曾两次打破巨星垄断。" },
  "MIA": { championships: 3, bio: "热火队以“热火文化（Heat Culture）”和极致的纪律性著称。" },
  "MIL": { championships: 2, bio: "雄鹿队在字母哥带领下重回巅峰，拥有强大的内线统治力。" },
  "HOU": { championships: 2, bio: "休斯顿火箭曾书写连冠奇迹，目前正致力于重建航天城荣誉。" },
  "NYK": { championships: 2, bio: "尼克斯坐拥篮球麦加圣地，拥有联盟最忠诚且挑剔的球迷。" },
  "CLE": { championships: 1, bio: "克利夫兰骑士在 2016 年完成了总决赛史诗级的逆转夺冠。" },
  "DAL": { championships: 1, bio: "独行侠由东契奇领衔，是国际球员走向 NBA 巅峰的典范。" },
  "TOR": { championships: 1, bio: "作为唯一加拿大球队，猛龙在 2019 年点燃了北境狂潮。" },
  "DEN": { championships: 1, bio: "丹佛掘金拥有约基奇，开创了属于中锋组织进攻的新时代。" },
  "POR": { championships: 1, bio: "开拓者在“撕裂之城”拥有最热血的主场，永不言败。" },
  "SAC": { championships: 1, bio: "国王队正通过年轻的力量和华丽的进攻重回西部强队。" },
  "WAS": { championships: 1, bio: "华盛顿奇才历史悠久，目前正在构建全新的球队未来。" },
  "OKC": { championships: 1, bio: "雷霆队拥有恐怖的天赋储备，是西部未来几年的统治级竞争者。" },
  "ATL": { championships: 1, bio: "老鹰队节奏极快，是一支极具观赏性的年轻劲旅。" },
  "PHX": { championships: 0, bio: "太阳队历史底蕴深厚，拥有杜兰特等顶级得分手追逐首冠。" },
  "LAC": { championships: 0, bio: "快船队正在新球馆开启新篇章，致力成为洛杉矶的新王。" },
  "MIN": { championships: 0, bio: "森林狼由爱德华兹率领，正处于队史最具统治力的阶段。" },
  "IND": { championships: 0, bio: "步行者代表了印第安纳纯粹的篮球狂热，打法极其无私。" },
  "MEM": { championships: 0, bio: "灰熊队球风强硬，是一支充满斗志的“磨砺之城”队伍。" },
  "NOP": { championships: 0, bio: "鹈鹕队天赋异禀，是全联盟最强悍的青年军之一。" },
  "ORL": { championships: 0, bio: "魔术队正迅速崛起，防守体系和天赋上限令人胆寒。" },
  "CHA": { championships: 0, bio: "黄蜂队在夏洛特扎根，正致力于打造独特的蜂巢身份。" },
  "UTA": { championships: 0, bio: "爵士队以高原主场优势和严明的战术纪律立足西部。" },
  "BKN": { championships: 0, bio: "布鲁克林篮网致力于打造最前卫的都市篮球品牌。" },
  "DEFAULT": { championships: 0, bio: "一支充满竞争力的 NBA 核心成员球队。" }
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 1. 初始化获取 30 支球队
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: PRO_HEADERS });
        const data = await res.json();
        // 过滤保留官方 30 支核心球队
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error(e); }
    }
    fetchTeams();
  }, []);

  // 2. 核心修复：独立抓取每一队的现役成员
  const fetchRosterForTeam = async (team: any) => {
    setLoadingRoster(true);
    setRoster([]); // 【关键：立即清空上一队数据】
    setSelectedTeam(team);

    try {
      // 策略：抓取 2025 赛季在该队上场过的球员，这才是最准的名单
      const res = await fetch(`https://api.balldontlie.io/v1/stats?team_ids[]=${team.id}&seasons[]=2025&per_page=100`, { headers: PRO_HEADERS });
      const data = await res.json();
      
      const stats = data.data || [];
      const playerMap = new Map();
      
      // 去重逻辑：确保名单里的球员不重复，且必须有数据
      stats.forEach((entry: any) => {
        if (entry.player && !playerMap.has(entry.player.id)) {
          playerMap.set(entry.player.id, entry.player);
        }
      });

      let activePlayers = Array.from(playerMap.values());

      // 如果 2025 赛季没开（或者该队没打过），回退到 2024 赛季
      if (activePlayers.length === 0) {
        const res2 = await fetch(`https://api.balldontlie.io/v1/stats?team_ids[]=${team.id}&seasons[]=2024&per_page=100`, { headers: PRO_HEADERS });
        const data2 = await res2.json();
        const stats2 = data2.data || [];
        stats2.forEach((entry: any) => {
          if (entry.player && !playerMap.has(entry.player.id)) {
            playerMap.set(entry.player.id, entry.player);
          }
        });
        activePlayers = Array.from(playerMap.values());
      }
      
      setRoster(activePlayers);
    } catch (e) {
      console.error("Roster retrieval failed", e);
    } finally {
      setLoadingRoster(false);
    }
  };

  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div 
      onClick={() => fetchRosterForTeam(t)}
      className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative"
    >
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
        </div>
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{t.full_name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Terminal Details →</p>
        </div>
      </div>
      <span className="text-5xl font-black italic opacity-[0.03] absolute right-8 uppercase">{t.abbreviation}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-6 md:p-12 font-sans text-sm">
      <nav className="max-w-7xl mx-auto flex justify-between items-center mb-20 border-b border-zinc-800 pb-10">
        <Link href="/"><h1 className="text-3xl font-black italic tracking-tighter uppercase">Me1ten<span className="text-blue-500">.Stats</span></h1></Link>
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

      {/* 球队详情浮窗 */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300">
            
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Active Roster • Verified Data</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-2xl hover:bg-red-600 transition-colors">×</button>
            </div>

            <div className="p-10 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Team Introduction</h4>
                  <p className="text-zinc-300 text-lg leading-relaxed italic font-medium">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Championships</p>
                  <p className="text-7xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-4 uppercase tracking-widest">Larry O'Brien Cups</p>
                </div>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 flex justify-between items-center text-white">
                  <span>Current Squad List</span>
                  {loadingRoster && <span className="text-[8px] animate-pulse text-red-500">Retrieving New Team...</span>}
                </h4>
                
                {loadingRoster ? (
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[...Array(12)].map((_, i) => <div key={i} className="h-16 bg-zinc-800/50 rounded-2xl animate-pulse"></div>)}
                   </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roster.map((player: any) => (
                      <div key={player.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 hover:border-blue-500 transition-all group overflow-hidden">
                        <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors">{player.first_name} {player.last_name}</p>
                        <p className="text-zinc-600 text-[9px] font-bold mt-1 uppercase tracking-widest">{player.position || 'G-F'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-8 pt-0">
               <button onClick={() => setSelectedTeam(null)} className="w-full bg-zinc-800 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700">Close Team Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}