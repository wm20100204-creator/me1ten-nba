async function getPlayers() {
  const res = await fetch('https://api.balldontlie.io/v1/players', {
    headers: { 'Authorization': '1a1dced8-6268-41f3-b373-7bde5d196b8d' }
  });
  const data = await res.json();
  return data.data;
}

export default async function PlayersPage() {
  const players = await getPlayers();

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white p-8">
      <h1 className="text-2xl font-bold mb-6">NBA 现役球员库</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {players.map((p: any) => (
          <div key={p.id} className="bg-[#16191d] p-4 rounded-xl border border-zinc-800">
            <p className="font-bold">{p.first_name} {p.last_name}</p>
            <p className="text-xs text-zinc-500">{p.team.full_name}</p>
            <p className="text-blue-500 text-xs mt-2">{p.position || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}