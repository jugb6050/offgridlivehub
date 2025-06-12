"use client";

const racers = [
  {
    id: 1,
    name: "Tommy Makinen",
    rank: "Odyssey - Leader",
    favoriteTrack: "DMV",
    favoriteCar: "Paragon R",
  },
  {
    id: 2,
    name: "Kai Jaxon",
    rank: "Circuit King - Co Leader",
    favoriteTrack: "Garbage",
    favoriteCar: "Issi Sport",
  },
  {
    id: 3,
    name: "Ceri Makinen",
    rank: "Ghost - High Command Queen Odyssey",
    favoriteTrack: "Observatory",
    favoriteCar: "La Careuse",
  },
  {
    id: 4,
    name: "Anton Donald",
    rank: "Ghost - High Command",
    favoriteTrack: "Observatory",
    favoriteCar: "Issi Sport",
  },
  {
    id: 5,
    name: "Dexter Tempest",
    rank: "Ghost - High Command",
    favoriteTrack: "DMV",
    favoriteCar: "Paragon R",
  },
  {
    id: 6,
    name: "Fuji Clark",
    rank: "Spark - New Member",
    favoriteTrack: "DMV",
    favoriteCar: "Elegy Retro Custom",
  },
  {
    id: 7,
    name: "Alexander Kaiser",
    rank: "Spark - New Member",
    favoriteTrack: "Observatory",
    favoriteCar: "Elegy Retro Custom",
  },
  {
    id: 8,
    name: "Shamoy Samuel",
    rank: "Spark - New Member",
    favoriteTrack: "DMV",
    favoriteCar: "Elegy RH6",
  },
  {
    id: 9,
    name: "Marco Santos",
    rank: "Spark - New Member",
    favoriteTrack: "Garbage",
    favoriteCar: "Issi Sport",
  },
  {
    id: 10,
    name: "Kevin Knox",
    rank: "Underglow - Recruit",
    favoriteTrack: "Observatory",
    favoriteCar: "Niobe",
  },
  {
    id: 11,
    name: "Noah Bryant",
    rank: "Underglow - Recruit",
    favoriteTrack: "DMV",
    favoriteCar: "Elegy Retro Custom",
  },
  {
    id: 12,
    name: "Leo Alexander",
    rank: "Underglow - Recruit",
    favoriteTrack: "Grapeseed",
    favoriteCar: "10f Widebody",
  },
  {
    id: 13,
    name: "Ronnie Silver",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "Coquette D10",
  },
  {
    id: 14,
    name: "Samuel Wackson",
    rank: "Underglow - Recruit",
    favoriteTrack: "DMV",
    favoriteCar: "Elegy Retro Custom",
  },
  {
    id: 15,
    name: "Jack Kent",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "Sentinel Classic",
  },
  {
    id: 16,
    name: "John Greenwich",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 17,
    name: "Teddy",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 18,
    name: "Richie Walkin",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 19,
    name: "Ricky Perro",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 20,
    name: "Garcia Ramirez",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 21,
    name: "Jun Tomo",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 22,
    name: "Imran",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 23,
    name: "Harry Knight",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
  },
  {
    id: 24,
    name: "Moose Myers",
    rank: "Underglow - Recruit",
    favoriteTrack: "Garbage",
    favoriteCar: "TBD",
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
