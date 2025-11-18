"use client";

import { useState } from "react";

const initialRacers = [
  {
    id: 1,
    name: "Tommy Makinen",
    rank: "Odyssey - Leader",
    favoriteTrack: "DMV",
    favoriteCar: "Itali GTO",
    raceTeam: "Off Grid",
  },
  {
    id: 2,
    name: "Ceri Makinen",
    rank: "Queen Odyssey - Second in Command",
    favoriteTrack: "Burgershot",
    favoriteCar: "Sunrise",
    raceTeam: "Off Grid",
  },
  {
    id: 3,
    name: "Rowdy Makinen",
    rank: "Ghost - High Command",
    favoriteTrack: "Observatory",
    favoriteCar: "GB200",
    raceTeam: "Off Grid",
  },

  // Add the rest of your racers and assign them a default team if needed.
];

const TEAMS = ["Off Grid", "VCB", "FB"];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function RosterPage() {
  const [racers, setRacers] = useState(initialRacers);

  const [newRacer, setNewRacer] = useState({
    name: "",
    rank: "",
    favoriteTrack: "",
    favoriteCar: "",
    raceTeam: TEAMS[0],
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const racerToAdd = {
      id: racers.length + 1,
      ...newRacer,
    };

    setRacers([...racers, racerToAdd]);

    setNewRacer({
      name: "",
      rank: "",
      favoriteTrack: "",
      favoriteCar: "",
      raceTeam: TEAMS[0],
    });
  };

  // Group racers by team
  const groupedByTeam = TEAMS.map((team) => ({
    team,
    members: racers.filter((r) => r.raceTeam === team),
  }));

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-10">
        Driver Roster
      </h1>

      {/* ------ NEW RACER FORM ------ */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-xl mb-12 max-w-xl"
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">
          Add New Racer
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            className="p-2 rounded bg-black border border-gray-700"
            value={newRacer.name}
            onChange={(e) => setNewRacer({ ...newRacer, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Rank"
            className="p-2 rounded bg-black border border-gray-700"
            value={newRacer.rank}
            onChange={(e) => setNewRacer({ ...newRacer, rank: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Favorite Track"
            className="p-2 rounded bg-black border border-gray-700"
            value={newRacer.favoriteTrack}
            onChange={(e) =>
              setNewRacer({ ...newRacer, favoriteTrack: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Favorite Car"
            className="p-2 rounded bg-black border border-gray-700"
            value={newRacer.favoriteCar}
            onChange={(e) =>
              setNewRacer({ ...newRacer, favoriteCar: e.target.value })
            }
            required
          />

          <select
            className="p-2 rounded bg-black border border-gray-700"
            value={newRacer.raceTeam}
            onChange={(e) =>
              setNewRacer({ ...newRacer, raceTeam: e.target.value })
            }
          >
            {TEAMS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-yellow-500 text-black font-bold py-2 rounded mt-2"
          >
            Add Racer
          </button>
        </div>
      </form>

      {/* ------ RACERS BY TEAM ------ */}
      {groupedByTeam.map(({ team, members }) => (
        <div key={team} className="mb-16">
          <h2 className="text-2xl font-bold text-yellow-500 mb-6">
            {team} Crew
          </h2>

          {members.length === 0 ? (
            <p className="text-gray-400 mb-6">No racers in this crew yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((racer) => (
                <div
                  key={racer.id}
                  className="bg-gray-900 rounded-xl p-4 flex items-center gap-4 shadow-lg"
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-500 text-black text-2xl font-bold shadow-inner">
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
          )}
        </div>
      ))}
    </div>
  );
}
