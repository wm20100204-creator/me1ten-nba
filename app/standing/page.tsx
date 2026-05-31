// app/standings/page.tsx 部分核心逻辑
async function getTeams() {
  const res = await fetch('https://api.balldontlie.io/v1/teams', {
    headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
  });
  const data = await res.json();
  return data.data;
}

export default async function StandingsPage() {
  const allTeams = await getTeams();
  const east = allTeams.filter((t: any) => t.conference === 'East');
  const west = allTeams.filter((t: any) => t.conference === 'West');

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8">
      <h1 className="text-3xl font-bold mb-10 text-center">2024-25 赛季排名</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* 东部表格 */}
        <div className="bg-[#16191d] rounded-2xl p-6 border border-zinc-800">
          <h2 className="text-blue-500 font-bold mb-4 flex items-center gap-2">东部联盟 Eastern</h2>
          {east.map((t: any) => (
            <div key={t.id} className="flex justify-between py-3 border-b border-zinc-900">
              <span className="text-sm">{t.full_name}</span>
              <span className="text-zinc-500 text-xs uppercase">{t.abbreviation}</span>
            </div>
          ))}
        </div>
        {/* 西部表格 */}
        <div className="bg-[#16191d] rounded-2xl p-6 border border-zinc-800">
          <h2 className="text-red-500 font-bold mb-4">西部联盟 Western</h2>
          {west.map((t: any) => (
            <div key={t.id} className="flex justify-between py-3 border-b border-zinc-900">
              <span className="text-sm">{t.full_name}</span>
              <span className="text-zinc-500 text-xs uppercase">{t.abbreviation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}