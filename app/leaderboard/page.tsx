"use client";

import { useState } from "react";

const tracks = [
  "Garbage",
  "DMV",
  "Observatory",
  "Grapeseed",
  "OGT1",
  "OGT2",
  "OGT3",
];

const mockData = [
  { name: "GhostRider", placement: 1, time: "2:45", track: "Garbage" },
  { name: "NeonBlade", placement: 2, time: "2:49", track: "Garbage" },
  { name: "VoltageVixen", placement: 1, time: "3:01", track: "OGT1" },
  // Add more entries here
];

export default function Leaderboard() {
  const [selectedTrack, setSelectedTrack] = useState("All");

  const filteredData =
    selectedTrack === "All"
      ? mockData
      : mockData.filter((entry) => entry.track === selectedTrack);

  return (
    <main className="min-h-screen bg-black text-cyan-300 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-wider drop-shadow-[0_0_10px_cyan]">
        Race Leaderboard
      </h1>

      {/* Track Filter */}
      <div className="flex justify-center gap-3 flex-wrap mb-8">
        <button
          onClick={() => setSelectedTrack("All")}
          className={`px-4 py-2 border ${
            selectedTrack === "All"
              ? "bg-cyan-500 text-black"
              : "border-cyan-300"
          } rounded-xl hover:bg-cyan-400 hover:text-black transition`}
        >
          All
        </button>
        {tracks.map((track) => (
          <button
            key={track}
            onClick={() => setSelectedTrack(track)}
            className={`px-4 py-2 border ${
              selectedTrack === track
                ? "bg-cyan-500 text-black"
                : "border-cyan-300"
            } rounded-xl hover:bg-cyan-400 hover:text-black transition`}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-cyan-300 text-center shadow-xl">
          <thead className="bg-cyan-900 text-white">
            <tr>
              <th className="py-2 px-4 border-b border-cyan-300">Racer Name</th>
              <th className="py-2 px-4 border-b border-cyan-300">Placement</th>
              <th className="py-2 px-4 border-b border-cyan-300">Time</th>
              <th className="py-2 px-4 border-b border-cyan-300">Track</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, index) => (
              <tr
                key={index}
                className="hover:bg-cyan-800 hover:text-black transition duration-200"
              >
                <td className="py-2 px-4 border-b border-cyan-300">
                  {entry.name}
                </td>
                <td className="py-2 px-4 border-b border-cyan-300">
                  {entry.placement}
                </td>
                <td className="py-2 px-4 border-b border-cyan-300">
                  {entry.time}
                </td>
                <td className="py-2 px-4 border-b border-cyan-300">
                  {entry.track}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
