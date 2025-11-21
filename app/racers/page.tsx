"use client";

import { useEffect, useState } from "react";

type Racer = {
  _id?: string;
  name: string;
  rank: string;
  favoriteTrack: string;
  favoriteCar: string;
  raceTeam: string;
};

type Crew = {
  _id?: string;
  name: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function RosterPage() {
  const [racers, setRacers] = useState<Racer[]>([]);
  const [crews, setCrews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminMode, setAdminMode] = useState(false);

  // New Racer state
  const [newRacer, setNewRacer] = useState<Racer>({
    name: "",
    rank: "",
    favoriteTrack: "",
    favoriteCar: "",
    raceTeam: "",
  });

  // New Crew state
  const [newCrew, setNewCrew] = useState("");

  // Editing state
  const [editingRacerId, setEditingRacerId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Racer>({
    name: "",
    rank: "",
    favoriteTrack: "",
    favoriteCar: "",
    raceTeam: "",
  });

  // Fetch racers and crews on mount
  useEffect(() => {
    async function fetchData() {
      const racersRes = await fetch("/api/racers");
      const racersData: Racer[] = await racersRes.json();
      setRacers(racersData);

      const crewsRes = await fetch("/api/crews");
      const crewsData: Crew[] = await crewsRes.json();
      setCrews(crewsData.map((c) => c.name));

      setLoading(false);
      if (crewsData.length > 0) {
        setNewRacer((prev) => ({ ...prev, raceTeam: crewsData[0].name }));
      }
    }
    fetchData();
  }, []);

  // ADMIN LOGIN
  const handleAdminLogin = () => {
    const pin = prompt("Enter admin PIN:");
    if (pin === "1337") {
      setAdminMode(true);
      alert("Admin mode enabled!");
    } else {
      alert("Incorrect PIN!");
    }
  };

  // Add new crew
  const handleAddCrew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCrew) return;

    const res = await fetch("/api/crews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCrew }),
    });

    const result = await res.json();
    if (result.insertedId) {
      setCrews((prev) => [...prev, newCrew]);
      setNewCrew("");
      setSuccessMessage(`Crew "${newCrew}" added!`);
      setTimeout(() => setSuccessMessage(""), 2500);
    }
  };

  // Add new racer
  const handleAddRacer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !newRacer.name ||
      !newRacer.rank ||
      !newRacer.favoriteTrack ||
      !newRacer.favoriteCar ||
      !newRacer.raceTeam
    )
      return;

    const res = await fetch("/api/racers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRacer),
    });

    const result = await res.json();
    if (result.insertedId) {
      setRacers((prev) => [...prev, { _id: result.insertedId, ...newRacer }]);
      setSuccessMessage(`Racer "${newRacer.name}" added!`);
      setTimeout(() => setSuccessMessage(""), 2500);

      setNewRacer({
        name: "",
        rank: "",
        favoriteTrack: "",
        favoriteCar: "",
        raceTeam: crews[0] || "",
      });
    }
  };

  // Save edited racer
  const handleSaveEdit = async (racerId: string) => {
    const res = await fetch(`/api/racers?id=${racerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingData),
    });
    if (res.ok) {
      setRacers((prev) =>
        prev.map((r) =>
          r._id === racerId ? { _id: racerId, ...editingData } : r
        )
      );
      setEditingRacerId(null);
      setSuccessMessage("Racer updated!");
      setTimeout(() => setSuccessMessage(""), 2500);
    } else {
      alert("Failed to update racer");
    }
  };

  // Delete racer
  const handleDelete = async (racerId: string) => {
    if (!confirm("Delete this racer?")) return;
    const res = await fetch(`/api/racers?id=${racerId}`, { method: "DELETE" });
    if (res.ok) {
      setRacers((prev) => prev.filter((r) => r._id !== racerId));
    }
  };

  // Group racers by crew
  const groupedByTeam = crews.map((crew) => ({
    team: crew,
    members: racers.filter((r) => r.raceTeam === crew),
  }));

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <h1 className="text-3xl font-bold text-yellow-500 mb-10">
        Driver Roster
      </h1>

      {/* ADMIN LOGIN BUTTON */}
      {!adminMode && (
        <button
          onClick={handleAdminLogin}
          className="bg-red-600 text-black font-bold py-2 px-4 rounded mb-6"
        >
          Admin Login
        </button>
      )}
      {adminMode && (
        <span className="bg-red-600 text-black px-4 py-2 rounded font-bold mb-6 inline-block">
          Admin Mode Enabled
        </span>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-600 text-white font-semibold rounded-lg shadow-lg transition-opacity duration-300">
          {successMessage}
        </div>
      )}

      {/* ADD NEW CREW FORM */}
      <form
        onSubmit={handleAddCrew}
        className="bg-gray-900 p-6 rounded-xl mb-6 max-w-xl"
      >
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">
          Add New Crew
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Crew Name"
            className="p-2 rounded bg-black border border-gray-700 flex-1"
            value={newCrew}
            onChange={(e) => setNewCrew(e.target.value)}
            required
          />
          <button className="bg-yellow-500 text-black font-bold px-4 rounded">
            Add Crew
          </button>
        </div>
      </form>

      {/* ADD NEW RACER FORM */}
      <form
        onSubmit={handleAddRacer}
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
            required
          >
            {crews.map((crew) => (
              <option key={crew} value={crew}>
                {crew}
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

      {/* RACERS BY CREW */}
      {loading ? (
        <p className="text-gray-400">Loading racers...</p>
      ) : (
        groupedByTeam.map(({ team, members }) => (
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
                    key={racer._id}
                    className="bg-gray-900 rounded-xl p-4 flex flex-col gap-2 shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-yellow-500 text-black text-2xl font-bold shadow-inner">
                        {getInitials(racer.name)}
                      </div>
                      <div className="flex-1">
                        {editingRacerId === racer._id ? (
                          <>
                            <input
                              type="text"
                              value={editingData.name}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  name: e.target.value,
                                })
                              }
                              className="p-1 rounded w-full mb-1 bg-black border border-gray-700"
                            />
                            <input
                              type="text"
                              value={editingData.rank}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  rank: e.target.value,
                                })
                              }
                              className="p-1 rounded w-full mb-1 bg-black border border-gray-700"
                            />
                            <input
                              type="text"
                              value={editingData.favoriteTrack}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  favoriteTrack: e.target.value,
                                })
                              }
                              className="p-1 rounded w-full mb-1 bg-black border border-gray-700"
                            />
                            <input
                              type="text"
                              value={editingData.favoriteCar}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  favoriteCar: e.target.value,
                                })
                              }
                              className="p-1 rounded w-full mb-1 bg-black border border-gray-700"
                            />
                            <select
                              value={editingData.raceTeam}
                              onChange={(e) =>
                                setEditingData({
                                  ...editingData,
                                  raceTeam: e.target.value,
                                })
                              }
                              className="p-1 rounded w-full mb-1 bg-black border border-gray-700"
                            >
                              {crews.map((crew) => (
                                <option key={crew} value={crew}>
                                  {crew}
                                </option>
                              ))}
                            </select>
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() =>
                                  editingRacerId &&
                                  handleSaveEdit(editingRacerId)
                                }
                                className="bg-green-600 text-black font-bold px-2 py-1 rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingRacerId(null)}
                                className="bg-gray-600 text-white px-2 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h2 className="text-xl font-semibold text-yellow-500">
                              {racer.name}
                            </h2>
                            <p className="text-sm text-gray-300">
                              Rank: {racer.rank}
                            </p>
                            <p className="text-sm text-gray-300">
                              Favorite Track: {racer.favoriteTrack}
                            </p>
                            <p className="text-sm text-gray-300">
                              Favorite Car: {racer.favoriteCar}
                            </p>
                          </>
                        )}
                      </div>
                      {adminMode && editingRacerId !== racer._id && (
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setEditingRacerId(racer._id || null);
                              setEditingData({
                                name: racer.name,
                                rank: racer.rank,
                                favoriteTrack: racer.favoriteTrack,
                                favoriteCar: racer.favoriteCar,
                                raceTeam: racer.raceTeam,
                              });
                            }}
                            className="bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => racer._id && handleDelete(racer._id)}
                            className="bg-red-600 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
