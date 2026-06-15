'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// 球队荣誉 & 简介 (保持尼克斯为 3 冠)
const TEAM_LEGACY: Record<string, any> = {
  "BOS": { championships: 18, bio: "凯尔特人是 NBA 历史最成功的球队，2024 年夺取第 18 冠，重新定义了统治力。" },
  "LAL": { championships: 17, bio: "洛杉矶湖人拥有无可比拟的星光，勒布朗与浓眉正带领紫金军团续写豪门新篇。" },
  "GSW": { championships: 7, bio: "勇士队虽然告别了克莱，但库里与年轻血液正试图重新构筑旧金山的争冠堡垒。" },
  "CHI": { championships: 6, bio: "公牛队代表了乔丹时代的无上光荣，目前正致力于寻找重回东部巅峰的基石。" },
  "SAS": { championships: 5, bio: "马刺队在迎来文班亚马和克里斯·保罗后，已成为 2026 年最具话题度的豪强队伍。" },
  "PHI": { championships: 3, bio: "76人在保罗·乔治加盟后组建了超级三巨头，目标直指队史第四座冠军奖杯。" },
  "NYK": { championships: 3, bio: "尼克斯在 2026 年夺得队史第 3 冠！布伦森带队开启了大苹果城的冠军新纪元。" },
  "DEFAULT": { championships: 0, bio: "一支追求极致卓越的 NBA 球队，正处于 2025-26 赛季的关键征途中。" }
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
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  // 你的 All-Star API Key
  const API_KEY = '81d9f9b6-a2ae-4af7-b043-38ddb10c75b6';
  const HEADERS = { 'Authorization': API_KEY };

  // 获取球队列表
  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('https://api.balldontlie.io/v1/teams', { headers: HEADERS });
        const data = await res.json();
        setTeams(data.data.filter((t: any) => t.id <= 30));
      } catch (e) { console.error(e); }
    }
    fetchTeams();
  }, []);

  // 【动态抓取逻辑】：实时调用 API 获取该队最新 15-20 人名单
  const fetchRoster = async (team: any) => {
    setSelectedTeam(team);
    setLoadingRoster(true);
    setRoster([]); // 清空旧数据

    try {
      // 获取当前球队的所有球员 (v1/players?team_ids[]=X)
      const res = await fetch(`https://api.balldontlie.io/v1/players?team_ids[]=${team.id}&per_page=35`, { headers: HEADERS });
      const data = await res.json();
      
      // 过滤：只保留有球衣号码或位置的现役球员，防止历史球员混入
      const activePlayers = (data.data || [])
        .filter((p: any) => p.position !== "" || p.jersey_number !== null)
        .sort((a: any, b: any) => (a.jersey_number || 99) - (b.jersey_number || 99));

      setRoster(activePlayers);
    } catch (e) {
      console.error("Roster fetch failed", e);
    } finally {
      setLoadingRoster(false);
    }
  };

  const TeamCard = ({ t }: any) => (
    <div 
      onClick={() => fetchRoster(t)}
      className="flex items-center justify-between p-6 bg-[#16191d] border border-zinc-800 rounded-[2.5rem] hover:border-blue-500 transition-all shadow-xl group cursor-pointer overflow-hidden relative"
    >
      <div className="flex items-center gap-6 relative z-10">
        <div className="w-16 h-16 flex items-center justify-center bg-black/40 rounded-3xl p-3 border border-zinc-800/50 group-hover:bg-blue-600/10 transition-colors">
            <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(t.abbreviation)}.png`} className="w-full h-full object-contain" alt={t.full_name} />
        </div>
        <div>
          <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none group-hover:text-blue-400 transition-colors">{t.full_name}</h3>
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
        <div className="flex gap-8 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">
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
          <div className="grid gap-6">{teams.filter(t => t.conference === 'East').map(t => <TeamCard key={t.id} t={t} />)}</div>
        </section>
        <section>
          <h2 className="text-3xl font-black italic text-red-600 mb-10 uppercase tracking-widest flex items-center gap-4">
             <span className="w-16 h-[3px] bg-red-600 font-black"></span> Western
          </h2>
          <div className="grid gap-6">{teams.filter(t => t.conference === 'West').map(t => <TeamCard key={t.id} t={t} />)}</div>
        </section>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-3xl bg-black/95">
          <div className="bg-[#111317] border border-zinc-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-y-auto shadow-2xl relative animate-in zoom-in duration-300 scrollbar-hide">
            
            <div className="sticky top-0 z-20 bg-zinc-900/90 backdrop-blur-md p-8 border-b border-white/10 flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <img src={`https://a.espncdn.com/i/teamlogos/nba/500/${fixTeamAbbr(selectedTeam.abbreviation)}.png`} className="w-20 h-20" />
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{selectedTeam.full_name}</h2>
                    <p className="text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2 italic">Official API Live Roster • 2025-26</p>
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
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 italic">Titles</p>
                  <p className="text-7xl font-black italic text-blue-500 leading-none">{TEAM_LEGACY[selectedTeam.abbreviation]?.championships || 0}</p>
                  <p className="text-[9px] font-bold text-zinc-700 mt-4 uppercase tracking-[0.2em]">NBA World Championships</p>
                </div>
              </div>

              {/* 【动态名单展示区】 */}
              <div className="space-y-8 pb-10 border-t border-zinc-900 pt-12">
                <div className="flex justify-between items-center px-2">
                   <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-l-2 border-red-600 pl-4 text-white">
                      Current Active Roster
                   </h4>
                   <span className="text-[8px] font-black bg-green-600/20 text-green-500 px-3 py-1 rounded animate-pulse uppercase">Live API Feed</span>
                </div>
                
                {loadingRoster ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="h-16 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {roster.map((p, i) => (
                      <div key={i} className="bg-[#1a1d23] p-5 rounded-2xl border border-zinc-800 hover:border-zinc-500 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-mono text-zinc-600">#{p.jersey_number || '--'}</span>
                          <p className="text-white font-black uppercase text-[11px] truncate group-hover:text-blue-400 transition-colors italic">
                            {p.first_name} {p.last_name}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold text-zinc-700 uppercase">{p.position}</span>
                      </div>
                    ))}
                  </div>
                )}
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