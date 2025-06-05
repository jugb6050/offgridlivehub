"use client";

import { useState } from "react";
import { format } from "date-fns";

export default function HeadToHeadChallenge() {
  const [wager, setWager] = useState(5000);
  const [pinkSlip, setPinkSlip] = useState(false);
  const [dateTime, setDateTime] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 space-y-10">
      <h1 className="text-4xl font-bold text-cyan-400">
        Head 2 Head Challenge
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 p-6 rounded-xl shadow-lg">
        {/* Challenger */}
        <div>
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">You</h2>
          <select className="w-full p-2 rounded bg-gray-800 text-white mb-2">
            <option>Select Your Racer</option>
            {/* map racer list */}
          </select>
          <select className="w-full p-2 rounded bg-gray-800 text-white">
            <option>Select Your Vehicle</option>
            {/* map vehicle list */}
          </select>
        </div>

        {/* Opponent */}
        <div>
          <h2 className="text-xl font-semibold text-cyan-300 mb-2">Opponent</h2>
          <select className="w-full p-2 rounded bg-gray-800 text-white mb-2">
            <option>Select Opponent</option>
          </select>
          <select className="w-full p-2 rounded bg-gray-800 text-white">
            <option>Select Opponent Vehicle</option>
          </select>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-cyan-300">
          Schedule the Race
        </h2>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={handleDateChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        {dateTime && (
          <p className="text-sm text-cyan-300">
            Your local time | {format(new Date(dateTime), "PPpp")}
          </p>
        )}
      </div>

      {/* Wager System */}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-semibold text-cyan-300">Wager</h2>
        <label className="block mb-2">Amount: ${wager.toLocaleString()}</label>
        <input
          type="range"
          min={5000}
          max={100000}
          step={5000}
          value={wager}
          onChange={(e) => setWager(Number(e.target.value))}
          className="w-full"
        />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pinkSlip"
            checked={pinkSlip}
            onChange={() => setPinkSlip(!pinkSlip)}
            className="w-4 h-4"
          />
          <label htmlFor="pinkSlip" className="text-sm">
            Wager Pink Slip
          </label>
        </div>

        {pinkSlip && (
          <div className="text-sm text-red-400 mt-2">
            <p>🚨 Pink slip wager means you must own your vehicle</p>
            <p>
              Ownership will be transferred to the race organizer before the
              race
            </p>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          💸 All wager money must be deposited to the race organizer at the bank
          before the race
        </p>
      </div>

      {/* Submit Button */}
      <button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded shadow">
        Send Challenge
      </button>

      {/* Race Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg text-cyan-300 font-semibold mb-2">
            Requested Races
          </h3>
          {/* Map requested races */}
          <p className="text-sm text-gray-400">No races requested yet</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <h3 className="text-lg text-cyan-300 font-semibold mb-2">
            Confirmed Races
          </h3>
          {/* Map confirmed races */}
          <p className="text-sm text-gray-400">No confirmed races yet</p>
        </div>
      </div>
    </div>
  );
}
