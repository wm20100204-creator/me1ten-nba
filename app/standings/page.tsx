'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 球队荣誉与简介数据库 (手动校对 2026 版)
const TEAM_LEGACY: Record<string, any> = {
  "LAL": { championships: 17, founded: "1947", bio: "坐拥洛杉矶，NBA 历史上最具传奇色彩的球队之一，拥有无数巨星传承。" },
  "BOS": { championships: 18, founded: "1946", bio: "NBA 冠军头衔最多的豪门，坚韧的防守文化与绿军精神是其核心。" },
  "GSW": { championships: 7, founded: "1946", bio: "开创了现代篮球的小球时代，库里、汤普森定义的射手文明。" },
  "CHI": { championships: 6, founded: "1966", bio: "公牛王朝在 90 年代由乔丹建立，是全球知名度最高的球队之一。" },
  "MIA": { championships: 3, founded: "1988", bio: "以 Heat Culture 闻名，追求极致的纪律与铁血强悍的竞争性。" },
  "PHX": { championships: 0, founded: "1968", bio: "菲尼克斯的骄傲，华丽的进攻风格，正处于追逐首冠的巅峰期。" },
  "DAL": { championships: 1, founded: "1980", bio: "独行侠不仅是达拉斯的象征，更是国际球星走向联盟巅峰的窗口。" },
  // 备用通用数据
  "DEFAULT": { championships: 0, founded: "N/A", bio: "一支充满竞争力的 NBA 职业篮球队，致力于追求奥布莱恩杯。" }
};

export default function StandingsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const PRO_HEADERS = { 'Authorization': '35a8d143-7cb0-4165-850d-f504a5a84700' };

  // 1. 获取所有球队列表
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

  // 2. 抓取该球队的现役名单
  const fetchRoster = async (teamId: number) => {
    setLoadingRoster(true);
    setRoster([]);
    try {
      // 抓取该团队所属的所有球员
      const res = await fetch(`https://api.balldontlie.io/v1/players?team_ids[]=${teamId}&per_page=30`, { headers: PRO_HEADERS });
      const data = await res.json();
      setRoster(data.data || []);
    } catch (e) { console.error(e); }
    setLoadingRoster(false);
  };

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    fetchRoster(team.id);
  };

  const east = teams.filter((t: any) => t.conference === 'East');
  const west = teams.filter((t: any) => t.conference === 'West');

  const TeamCard = ({ t }: any) => (
    <div 
      onClick={() => handleTeamClick(t)}
      className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative"
    >
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center bg-black/20 rounded-3xl p-3 border border-zinc-800/50">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${t.abbreviation.toLowerCase()}.png`} className="w-full h-full object-contain" />
        </div>
        <div>
          <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{t.full_name}</h3>
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
        <Link href="/" className="text-zinc-500 font-black text-[10px] hover:text-white uppercase tracking-[0.3em] border border-zinc-800 px-8 py-3 rounded-full">Back to Terminal</Link>
      </nav>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <section>
          <h2 className="text-3xl font-black italic text-blue-500 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-blue-500"></span> Eastern Conference
          </h2>
          <div className="grid gap-6">{east.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-red-600"></span> Western Conference
          </h2>
          <div className="grid gap-6">{west.map((t: any) => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>

      {/* 球队详情高级终端 (Team Details Modal) */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-500 scrollbar-hide">
            
            {/* 终端头部 */}
            <div className="sticky top-0 z-20 bg-zinc-900/80 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${selectedTeam.abbreviation.toLowerCase()}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">{selectedTeam.city} • {selectedTeam.conference}ern Division</p>
                  </div>
               </div>
               <button onClick={() => setSelectedTeam(null)} className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center text-xl hover:bg-red-600 transition-colors">×</button>
            </div>

            <div className="p-10 space-y-12">
              {/* 荣誉墙与简介 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest border-l-2 border-blue-500 pl-4">Team Introduction</h4>
                  <p className="text-zinc-400 text-lg leading-relaxed italic">
                    {TEAM_LEGACY[selectedTeam.abbreviation]?.bio || TEAM_LEGACY["DEFAULT"].bio}
                  </p>
                </div>
                <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800 text-center">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Championships</p>
                  <p className="text-6xl font-black italic text-blue-500">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-2">NBA FINALS TITLES</p>
                </div>
              </div>

              {/* 实时名单 Roster */}
              <div className="space-y-8">
                <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 flex justify-between items-center">
                  <span>Current Roster Squad</span>
                  <span className="text-[9px] text-zinc-700 font-mono">Live Sync Active</span>
                </h4>
                
                {loadingRoster ? (
                   <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roster.map((player: any) => (
                      <div key={player.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all">
                        <p className="text-white font-bold uppercase text-xs truncate">{player.first_name} {player.last_name}</p>
                        <p className="text-zinc-600 text-[9px] font-black mt-1 uppercase tracking-widest">{player.position || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 底部关闭 */}
            <div className="p-8 pt-0">
               <button onClick={() => setSelectedTeam(null)} className="w-full bg-blue-600 py-6 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl">Close Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}