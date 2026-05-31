import React from 'react';
import Link from 'next/link'; // 导入跳转组件

// 获取 NBA 数据的方法
async function getNBAGames() {
  // 获取今天的日期 (格式: YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const res = await fetch(`https://api.balldontlie.io/v1/games?dates[]=${today}`, {
      headers: {
        // 你的 API Key
        'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d',
      },
      next: { revalidate: 60 } // 每 60 秒自动刷新缓存
    });

    if (!res.ok) {
      throw new Error('API 请求失败');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("获取数据出错:", error);
    return [];
  }
}

export default async function Home() {
  const games = await getNBAGames();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-4 md:p-10 font-sans">
      {/* 顶部导航栏 */}
      <nav className="max-w-6xl mx-auto flex justify-between items-center mb-12 border-b border-zinc-800 pb-6">
        <div>
          <Link href="/">
            <h1 className="text-2xl font-black tracking-tighter text-white cursor-pointer hover:opacity-80 transition-opacity">
              ME1TEN<span className="text-blue-500">.COM</span>
            </h1>
          </Link>
          <p className="text-xs text-zinc-500 tracking-widest uppercase mt-1">NBA Data Terminal</p>
        </div>
        <div className="flex gap-6 text-sm font-medium">
          <Link href="/" className="text-blue-500 border-b border-blue-500 pb-1">今日比分</Link>
          <Link href="/standings" className="text-zinc-400 hover:text-white transition-colors">联盟排名</Link>
          <Link href="/players" className="text-zinc-400 hover:text-white transition-colors">球员列表</Link>
          <Link href="/teams" className="text-zinc-400 hover:text-white transition-colors">球队库</Link>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-6xl mx-auto">
        
        {/* 快速导航大卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <Link href="/players" className="group bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-blue-500 transition-all cursor-pointer">
            <span className="text-blue-500 text-[10px] font-bold tracking-widest uppercase">Database</span>
            <h3 className="text-lg font-bold mt-1 group-hover:text-blue-400 transition-colors">进入球员库 →</h3>
            <p className="text-zinc-500 text-xs mt-1">查询现役所有球员资料与位置</p>
          </Link>
          <Link href="/standings" className="group bg-[#16191d] border border-zinc-800 p-6 rounded-2xl hover:border-zinc-500 transition-all cursor-pointer">
            <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Rankings</span>
            <h3 className="text-lg font-bold mt-1 group-hover:text-white transition-colors">查看联盟排名 →</h3>
            <p className="text-zinc-500 text-xs mt-1">NBA 东西部各球队分组详情</p>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8 border-l-4 border-blue-500 pl-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            今日赛程 
            <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </h2>
          <p className="text-sm text-zinc-500">{new Date().toLocaleDateString()}</p>
        </div>
        
        {games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game: any) => (
              <div key={game.id} className="bg-[#16191d] border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-all shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400 uppercase tracking-widest">
                    {game.status}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">
                    Regular Season
                  </span>
                </div>
                
                <div className="space-y-6">
                  {/* 主队 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* 真实的球队 Logo */}
                      <img 
                        src={`https://www.nba.com/assets/logos/teams/primary/full/${game.home_team.abbreviation}.svg`} 
                        alt="logo"
                        className="w-10 h-10 object-contain p-1 bg-zinc-800 rounded-lg shadow-inner"
                        onError={(e) => { e.currentTarget.style.display = 'none' }} 
                      />
                      <div>
                        <span className="text-lg font-bold block leading-tight">{game.home_team.full_name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">{game.home_team.abbreviation}</span>
                      </div>
                    </div>
                    <span className="text-3xl font-mono font-black">{game.home_team_score}</span>
                  </div>

                  {/* 分割线 */}
                  <div className="h-[1px] bg-zinc-800 w-full relative">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#16191d] px-2 text-[10px] text-zinc-600 font-bold">VS</span>
                  </div>

                  {/* 客队 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {/* 真实的球队 Logo */}
                      <img 
                        src={`https://www.nba.com/assets/logos/teams/primary/full/${game.visitor_team.abbreviation}.svg`} 
                        alt="logo"
                        className="w-10 h-10 object-contain p-1 bg-zinc-800 rounded-lg shadow-inner"
                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                      />
                      <div>
                        <span className="text-lg font-bold block leading-tight">{game.visitor_team.full_name}</span>
                        <span className="text-[10px] text-zinc-500 uppercase">{game.visitor_team.abbreviation}</span>
                      </div>
                    </div>
                    <span className="text-3xl font-mono font-black text-zinc-400">{game.visitor_team_score}</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button className="text-[11px] font-bold text-zinc-500 hover:text-blue-400 transition-colors uppercase tracking-widest">
                    View Match Stats →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#16191d] border border-dashed border-zinc-800 rounded-3xl py-32 text-center">
            <p className="text-zinc-500 text-sm">目前没有正在进行的比赛</p>
            <p className="text-zinc-700 text-xs mt-2">NBA 赛季通常在 10月至次年6月</p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-zinc-900 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
        &copy; {new Date().getFullYear()} Me1ten Stats. Data provided by BallDontLie.
      </footer>
    </div>
  );
}