async function getTeams() {
  const res = await fetch('https://api.balldontlie.io/v1/teams', {
    headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
  });
  const data = await res.json();
  return data.data;
}

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teams.map((t: any) => (
          <div key={t.id} className="p-6 bg-[#16191d] rounded-2xl border-l-4 border-blue-500">
            <h3 className="text-xl font-bold">{t.full_name}</h3>
            <p className="text-zinc-400">{t.conference} Conference | {t.division}</p>
            <p className="text-zinc-600 text-sm mt-1">{t.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}