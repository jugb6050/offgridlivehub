"use client";

const racers = [
  {
    id: 1,
    name: "Tommy Makinen",
    rank: "Odyssey - Leader",
    favoriteTrack: "DMV",
    favoriteCar: "Itali GTO",
  },
  {
    id: 2,
    name: "Ceri Makinen",
    rank: "Queen Odyssey - Second in Command",
    favoriteTrack: "Burgershot",
    favoriteCar: "Coquette D10",
  },
  {
    id: 3,
    name: "Shamoy Makinen",
    rank: "Ghost - High Command",
    favoriteTrack: "DMV",
    favoriteCar: "Pegassi Tempesta",
  },
  {
    id: 4,
    name: "Rowdy Makinen",
    rank: "Sentinel - Low Command",
    favoriteTrack: "Observatory",
    favoriteCar: "Jester",
  },
  {
    id: 5,
    name: "Tony Makinen",
    rank: "Sentinel - Low Command",
    favoriteTrack: "DMV",
    favoriteCar: "Itali GTO",
  },
  {
    id: 6,
    name: "Oscar Makinen",
    rank: "Sentinel - Low Command",
    favoriteTrack: "DMV",
    favoriteCar: "Coquette D10",
  },
  {
    id: 7,
    name: "Romeo Terrance",
    rank: "REVolutionish - OG",
    favoriteTrack: "DMV",
    favoriteCar: "Calvaclade XL",
  },
  {
    id: 8,
    name: "Mouse Cougzy",
    rank: "Drafter - Pillar",
    favoriteTrack: "Burgershot",
    favoriteCar: "Vigero",
  },
  {
    id: 9,
    name: "Uncle Ricky",
    rank: "Off Grid Unc - Relations",
    favoriteTrack: "Unkown",
    favoriteCar: "uknown",
  },
  {
    id: 10,
    name: "Buck Richmond",
    rank: "Hangaround",
    favoriteTrack: "Unkown",
    favoriteCar: "Unknown",
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
      <h1 className="text-3xl font-bold text-yellow-500 mb-8">Driver Roster</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {racers.map((racer) => (
          <div
            key={racer.id}
            className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 shadow-lg"
          >
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-500 text-white text-2xl font-bold shadow-inner">
              {getInitials(racer.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-yellow-500">
                {racer.name}
              </h2>
              <p className="text-sm text-gray-300">Rank: {racer.rank}</p>
              <p className="text-sm text-gray-300">
                Favorite Track: {racer.favoriteTrack}
              </p>
              <p className="text-sm text-gray-300">
                Favorite Car: {racer.favoriteCar}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
