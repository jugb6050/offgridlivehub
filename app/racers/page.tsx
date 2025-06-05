"use client";

const racers = [
  {
    id: 1,
    name: "Tommy Makinen",
    rank: "Odyssey",
    bestLap: "1:12.45",
    bestTrack: "DMV",
  },
  {
    id: 2,
    name: "Anton Donald",
    rank: "B",
    bestLap: "1:18.22",
    bestTrack: "Garbage",
  },
  {
    id: 3,
    name: "Ceri Makinen",
    rank: "S",
    bestLap: "1:12.52",
    bestTrack: "DMV",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function RosterPage() {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">Driver Roster</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {racers.map((racer) => (
          <div
            key={racer.id}
            className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-cyan-600 text-white text-2xl font-bold shadow-inner">
              {getInitials(racer.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-cyan-300">
                {racer.name}
              </h2>
              <p className="text-sm text-gray-300">Rank: {racer.rank}</p>
              <p className="text-sm text-gray-300">Best Lap: {racer.bestLap}</p>
              <p className="text-sm text-gray-300">
                Best Track: {racer.bestTrack}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
