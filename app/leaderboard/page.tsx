"use client";

import { useEffect, useState, useCallback } from "react";

const tracks = [
  "Garbage",
  "DMV",
  "Observatory",
  "Grapeseed",
  "OGT1",
  "OGT2",
  "OGT3",
];

const approvalOptions = ["In Review", "Denied", "Approved"] as const;
type ApprovalStatus = (typeof approvalOptions)[number];

type LapTimeRaw = {
  _id: string;
  racer: string;
  time: string;
  track: string;
  vehicle: string;
  approved: ApprovalStatus;
};

type LapTimeParsed = LapTimeRaw & {
  timeInMs: number;
  placement: number;
};

export default function Leaderboard() {
  const [lapTimes, setLapTimes] = useState<LapTimeParsed[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | "All">("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    racer: "",
    time: "",
    track: tracks[0],
    vehicle: "",
    videoProof: false,
  });

  const [adminMode, setAdminMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<LapTimeRaw>>({});

  // Convert time string "M:SS:SSS" to milliseconds
  const timeStringToMs = (input: string): number => {
    const parts = input.split(":").map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    const [minutes, seconds, milliseconds] = parts;
    return minutes * 60000 + seconds * 1000 + milliseconds;
  };

  const fetchData = useCallback(() => {
    fetch("/api/lap-times")
      .then((res) => res.json())
      .then((data: LapTimeRaw[]) => {
        const withMs: LapTimeParsed[] = data.map((entry) => ({
          ...entry,
          timeInMs: timeStringToMs(entry.time),
          placement: 0,
        }));

        // Calculate placement per track
        const grouped: Record<string, LapTimeParsed[]> = {};
        withMs.forEach((entry) => {
          if (!grouped[entry.track]) grouped[entry.track] = [];
          grouped[entry.track].push(entry);
        });

        const allWithPlacements: LapTimeParsed[] = [];
        for (const trackName in grouped) {
          const sorted = grouped[trackName].sort(
            (a, b) => a.timeInMs - b.timeInMs
          );
          sorted.forEach((entry, index) => {
            entry.placement = index + 1;
            allWithPlacements.push(entry);
          });
        }

        setLapTimes(allWithPlacements);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LapTimeRaw = {
      racer: formData.racer,
      time: formData.time,
      track: formData.track,
      vehicle: formData.vehicle,
      approved: formData.videoProof ? "In Review" : "Denied",
      _id: "", // backend will assign
    };

    await fetch("/api/lap-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setFormData({
      racer: "",
      time: "",
      track: tracks[0],
      vehicle: "",
      videoProof: false,
    });
    setFormOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    await fetch(`/api/lap-times?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  const startEditing = (entry: LapTimeParsed) => {
    setEditingId(entry._id);
    setEditingData({ ...entry });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const saveEditing = async () => {
    if (!editingId) return;

    await fetch(`/api/lap-times?id=${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingData),
    });

    setEditingId(null);
    setEditingData({});
    fetchData();
  };

  const displayed =
    selectedTrack === "All"
      ? lapTimes
      : lapTimes.filter((entry) => entry.track === selectedTrack);

  const handleAdminLogin = () => {
    const pin = prompt("Enter admin PIN:");
    if (pin === "1337") {
      setAdminMode(true);
      alert("Admin mode enabled!");
    } else {
      alert("Incorrect PIN!");
    }
  };

  return (
    <main className="min-h-screen bg-black text-yellow-300 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-wider">
        Race Leaderboard
      </h1>

      {/* Track Filters */}
      <div className="flex justify-center gap-3 flex-wrap mb-4">
        <button
          onClick={() => setSelectedTrack("All")}
          className={`px-4 py-2 border ${
            selectedTrack === "All"
              ? "bg-yellow-500 text-black"
              : "border-yellow-300"
          } rounded-xl hover:bg-yellow-400 hover:text-black transition`}
        >
          All
        </button>
        {tracks.map((track) => (
          <button
            key={track}
            onClick={() => setSelectedTrack(track)}
            className={`px-4 py-2 border ${
              selectedTrack === track
                ? "bg-yellow-500 text-black"
                : "border-yellow-300"
            } rounded-xl hover:bg-yellow-400 hover:text-black transition`}
          >
            {track}
          </button>
        ))}
      </div>

      {/* Form + Admin Login */}
      <div className="text-center mb-8 flex justify-center gap-4">
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-6 py-2 border border-yellow-300 rounded-xl hover:bg-yellow-400 hover:text-black transition"
        >
          {formOpen ? "Close Form" : "Submit Lap Time"}
        </button>

        {!adminMode && (
          <button
            onClick={handleAdminLogin}
            className="px-6 py-2 border border-red-500 rounded-xl hover:bg-red-600 hover:text-black transition"
          >
            Admin Login
          </button>
        )}

        {adminMode && (
          <span className="px-4 py-2 bg-red-600 rounded text-black font-bold">
            Admin Mode Enabled
          </span>
        )}
      </div>

      {/* Submit Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto mb-10 p-4 border border-yellow-300 rounded-lg bg-yellow-900"
        >
          <label className="block mb-2">
            Racer Name:
            <input
              type="text"
              value={formData.racer}
              onChange={(e) =>
                setFormData({ ...formData, racer: e.target.value })
              }
              required
              className="w-full mt-1 p-2 rounded bg-black text-yellow-300 border border-yellow-500"
            />
          </label>

          <label className="block mb-2">
            Time (M:SS:SSS):
            <input
              type="text"
              placeholder="e.g. 1:45:238"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
              className="w-full mt-1 p-2 rounded bg-black text-yellow-300 border border-yellow-500"
            />
          </label>

          <label className="block mb-2">
            Track:
            <select
              value={formData.track}
              onChange={(e) =>
                setFormData({ ...formData, track: e.target.value })
              }
              className="w-full mt-1 p-2 rounded bg-black text-yellow-300 border border-yellow-500"
            >
              {tracks.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </label>

          <label className="block mb-4">
            Vehicle:
            <input
              type="text"
              value={formData.vehicle}
              onChange={(e) =>
                setFormData({ ...formData, vehicle: e.target.value })
              }
              required
              className="w-full mt-1 p-2 rounded bg-black text-yellow-300 border border-yellow-500"
            />
          </label>

          <label className="block mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.videoProof}
              onChange={(e) =>
                setFormData({ ...formData, videoProof: e.target.checked })
              }
            />
            Video Proof Provided
          </label>

          <p className="text-xs italic text-yellow-400 mb-4 max-w-md mx-auto">
            POV of track timing must be posted in the organization email in the
            respective section for approved status.
          </p>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400"
          >
            Submit
          </button>
        </form>
      )}

      {/* Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-yellow-300 text-center shadow-xl">
          <thead className="bg-yellow-900 text-white">
            <tr>
              <th className="py-2 px-4 border-b border-yellow-300">Racer</th>
              <th className="py-2 px-4 border-b border-yellow-300">
                Placement
              </th>
              <th className="py-2 px-4 border-b border-yellow-300">Time</th>
              <th className="py-2 px-4 border-b border-yellow-300">Track</th>
              <th className="py-2 px-4 border-b border-yellow-300">Vehicle</th>
              <th className="py-2 px-4 border-b border-yellow-300">Approval</th>
              {adminMode && (
                <th className="py-2 px-4 border-b border-yellow-300">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayed
              .sort((a, b) => a.placement - b.placement)
              .map((entry) => (
                <tr
                  key={entry._id}
                  className="hover:bg-yellow-800 hover:text-black transition duration-200"
                >
                  {editingId === entry._id ? (
                    <>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <input
                          className="w-full bg-black text-yellow-300 border border-yellow-500 rounded p-1"
                          value={editingData.racer || ""}
                          onChange={(e) =>
                            setEditingData((prev) => ({
                              ...prev,
                              racer: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.placement}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <input
                          className="w-full bg-black text-yellow-300 border border-yellow-500 rounded p-1"
                          value={editingData.time || ""}
                          onChange={(e) =>
                            setEditingData((prev) => ({
                              ...prev,
                              time: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <select
                          className="w-full bg-black text-yellow-300 border border-yellow-500 rounded p-1"
                          value={editingData.track || tracks[0]}
                          onChange={(e) =>
                            setEditingData((prev) => ({
                              ...prev,
                              track: e.target.value,
                            }))
                          }
                        >
                          {tracks.map((track) => (
                            <option key={track} value={track}>
                              {track}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <input
                          className="w-full bg-black text-yellow-300 border border-yellow-500 rounded p-1"
                          value={editingData.vehicle || ""}
                          onChange={(e) =>
                            setEditingData((prev) => ({
                              ...prev,
                              vehicle: e.target.value,
                            }))
                          }
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <select
                          className="w-full bg-black text-yellow-300 border border-yellow-500 rounded p-1"
                          value={editingData.approved || "In Review"}
                          onChange={(e) =>
                            setEditingData((prev) => ({
                              ...prev,
                              approved: e.target.value as ApprovalStatus,
                            }))
                          }
                        >
                          {approvalOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300 flex gap-2 justify-center">
                        <button
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                          onClick={saveEditing}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.racer}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.placement}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.time}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.track}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        {entry.vehicle}
                      </td>
                      <td className="py-2 px-4 border-b border-yellow-300">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            entry.approved === "Approved"
                              ? "bg-green-600 text-green-100"
                              : entry.approved === "Denied"
                              ? "bg-red-600 text-red-100"
                              : "bg-yellow-600 text-yellow-100"
                          }`}
                        >
                          {entry.approved}
                        </span>
                      </td>
                      {adminMode && (
                        <td className="py-2 px-4 border-b border-yellow-300 flex gap-2 justify-center">
                          <button
                            className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500"
                            onClick={() => startEditing(entry)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                            onClick={() => handleDelete(entry._id)}
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
