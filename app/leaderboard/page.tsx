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

type LapTimeRaw = {
  _id: string;
  racer: string;
  time: string;
  track: string;
  vehicle: string;
  approved: "In Review" | "Denied" | "Approved";
};

type LapTimeParsed = LapTimeRaw & {
  timeInMs: number;
  placement: number;
};

export default function Leaderboard() {
  const [lapTimes, setLapTimes] = useState<LapTimeParsed[]>([]);
  const [selectedTrack, setSelectedTrack] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    racer: "",
    time: "",
    track: tracks[0],
    vehicle: "",
    videoProof: false,
  });

  // Convert time string "M:SS:SSS" to milliseconds number
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

        const grouped: Record<string, LapTimeParsed[]> = {};
        withMs.forEach((entry) => {
          if (!grouped[entry.track]) grouped[entry.track] = [];
          grouped[entry.track].push(entry);
        });

        const allWithPlacements: LapTimeParsed[] = [];
        for (const track in grouped) {
          const sorted = grouped[track].sort((a, b) => a.timeInMs - b.timeInMs);
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

    const payload = {
      racer: formData.racer,
      time: formData.time,
      track: formData.track,
      vehicle: formData.vehicle,
      approved: formData.videoProof ? "In Review" : "Denied",
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

  const displayed =
    selectedTrack === "All"
      ? lapTimes
      : lapTimes.filter((entry) => entry.track === selectedTrack);

  return (
    <main className="min-h-screen bg-black text-yellow-300 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-6 tracking-wider">
        Race Leaderboard
      </h1>

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

      <div className="text-center mb-8">
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="px-6 py-2 border border-yellow-300 rounded-xl hover:bg-yellow-400 hover:text-black transition"
        >
          {formOpen ? "Close Form" : "Submit Lap Time"}
        </button>
      </div>

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
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
