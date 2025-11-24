"use client";

import { useState, useEffect } from "react";

type Racer = {
  name: string;
  crew: string;
  car: string;
  carClass: string;
  qualifyingLap: string;
};

type Match = {
  player1?: Racer;
  player2?: Racer;
  winner?: Racer;
};

type Round = Match[];

type Bracket = {
  _id?: string;
  name: string;
  size: number;
  rounds: Round[];
};

export default function RaceBracketTool() {
  const [adminMode, setAdminMode] = useState(false);
  const [bracketName, setBracketName] = useState("");
  const [bracketSize, setBracketSize] = useState(2);
  const [bracket, setBracket] = useState<Bracket | null>(null);
  const [crews, setCrews] = useState<string[]>([]);

  // Admin login
  const handleAdminLogin = () => {
    const pin = prompt("Enter admin PIN:");
    if (pin === "1337") {
      setAdminMode(true);
      alert("Admin mode enabled!");
    } else {
      alert("Incorrect PIN!");
    }
  };

  // Load crews
  useEffect(() => {
    fetch("/api/crews")
      .then((res) => res.json())
      .then((data) => setCrews(data.map((c: any) => c.name)));
  }, []);

  // Load first bracket
  useEffect(() => {
    fetch("/api/brackets")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setBracket(data[0]);
      });
  }, []);

  // Generate empty bracket
  const generateBracket = () => {
    const rounds: Round[] = [];
    let size = bracketSize;
    while (size > 0) {
      const round: Round = Array.from({ length: size / 2 }, () => ({}));
      rounds.push(round);
      size = Math.floor(size / 2);
    }
    setBracket({ name: bracketName, size: bracketSize, rounds });
  };

  // Fill default racer fields
  const fillRacerDefaults = (racer?: Partial<Racer>): Racer => ({
    name: racer?.name || "",
    crew: racer?.crew || crews[0] || "",
    car: racer?.car || "",
    carClass: racer?.carClass || "",
    qualifyingLap: racer?.qualifyingLap || "",
  });

  // Update racer info
  const updateRacer = (
    matchIndex: number,
    player: "player1" | "player2",
    racer: Partial<Racer>
  ) => {
    if (!bracket) return;

    const newRounds = bracket.rounds.map((round, ri) => {
      if (ri !== 0) return round;
      return round.map((match, mi) =>
        mi !== matchIndex
          ? match
          : { ...match, [player]: fillRacerDefaults(racer) }
      );
    });

    setBracket({ ...bracket, rounds: newRounds });
  };

  // Advance winner to next round
  const advanceWinner = (
    roundIndex: number,
    matchIndex: number,
    winner: Racer
  ) => {
    if (!bracket) return;

    const newRounds = bracket.rounds.map((round) =>
      round.map((m) => ({ ...m }))
    );
    newRounds[roundIndex][matchIndex].winner = winner;

    const nextRoundIndex = roundIndex + 1;
    if (newRounds[nextRoundIndex]) {
      const nextMatchIndex = Math.floor(matchIndex / 2);
      if (matchIndex % 2 === 0) {
        newRounds[nextRoundIndex][nextMatchIndex].player1 = winner;
      } else {
        newRounds[nextRoundIndex][nextMatchIndex].player2 = winner;
      }
    }

    setBracket({ ...bracket, rounds: newRounds });
  };

  // Save bracket
  const saveBracket = async () => {
    if (!bracket) return;
    const res = await fetch("/api/brackets", {
      method: bracket._id ? "PATCH" : "POST",
      body: JSON.stringify(
        bracket._id
          ? { bracketId: bracket._id, rounds: bracket.rounds }
          : bracket
      ),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) alert("Bracket saved!");
  };

  // Reset bracket
  const resetBracket = () => {
    if (!bracket) return;
    const emptyRounds = bracket.rounds.map((round) => round.map(() => ({})));
    setBracket({ ...bracket, rounds: emptyRounds });
  };

  // Delete bracket
  const deleteBracket = async () => {
    if (!bracket || !bracket._id) return;
    if (!confirm("Are you sure you want to delete this bracket?")) return;

    const res = await fetch("/api/brackets", {
      method: "DELETE",
      body: JSON.stringify({ bracketId: bracket._id }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      alert("Bracket deleted!");
      setBracket(null);
    } else {
      alert("Failed to delete bracket");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-black min-h-screen text-white">
      {!adminMode && (
        <button
          onClick={handleAdminLogin}
          className="mb-4 px-4 py-2 bg-red-600 text-white font-bold rounded"
        >
          Admin Login
        </button>
      )}

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-500">
        Race Bracket Tool
      </h1>

      {!bracket && (
        <div className="mb-6 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Bracket Name"
            className="p-2 rounded border border-gray-700 text-white bg-gray-900 flex-1"
            value={bracketName}
            onChange={(e) => setBracketName(e.target.value)}
          />
          <select
            className="p-2 rounded border border-gray-700 text-white bg-gray-900"
            value={bracketSize}
            onChange={(e) => setBracketSize(parseInt(e.target.value))}
          >
            {[2, 4, 8, 16, 32, 64].map((n) => (
              <option key={n} value={n}>
                {n} Racers
              </option>
            ))}
          </select>
          <button
            onClick={generateBracket}
            className="px-4 py-2 bg-green-600 text-white font-bold rounded"
          >
            Generate Bracket
          </button>
        </div>
      )}

      {bracket && (
        <div className="overflow-x-auto">
          <div className="flex flex-wrap gap-6 sm:gap-8">
            {bracket.rounds.map((round, roundIndex) => (
              <div
                key={roundIndex}
                className="flex flex-col min-w-[260px] max-w-full"
              >
                <h3 className="font-semibold text-yellow-400 mb-4 text-center">
                  Round {roundIndex + 1}
                </h3>

                {round.map((match, matchIndex) => (
                  <div
                    key={matchIndex}
                    className="flex flex-col sm:flex-row gap-2 items-center mb-6 p-2 border border-gray-700 rounded"
                  >
                    <span className="font-bold mb-1 sm:mb-0">
                      Race {matchIndex + 1}:
                    </span>

                    {/* Player 1 */}
                    <input
                      type="text"
                      placeholder="Name"
                      disabled={roundIndex !== 0 && !adminMode}
                      className="p-1 rounded text-white bg-gray-900 flex-1"
                      value={match.player1?.name || ""}
                      onChange={(e) =>
                        updateRacer(matchIndex, "player1", {
                          name: e.target.value,
                        })
                      }
                    />
                    <select
                      disabled={roundIndex !== 0 && !adminMode}
                      className="p-1 rounded text-white bg-gray-900"
                      value={match.player1?.crew || crews[0] || ""}
                      onChange={(e) =>
                        updateRacer(matchIndex, "player1", {
                          crew: e.target.value,
                        })
                      }
                    >
                      {crews.map((crew) => (
                        <option key={crew} value={crew} className="text-black">
                          {crew}
                        </option>
                      ))}
                    </select>

                    <span className="mx-2 font-bold">vs</span>

                    {/* Player 2 */}
                    <input
                      type="text"
                      placeholder="Name"
                      disabled={roundIndex !== 0 && !adminMode}
                      className="p-1 rounded text-white bg-gray-900 flex-1"
                      value={match.player2?.name || ""}
                      onChange={(e) =>
                        updateRacer(matchIndex, "player2", {
                          name: e.target.value,
                        })
                      }
                    />
                    <select
                      disabled={roundIndex !== 0 && !adminMode}
                      className="p-1 rounded text-white bg-gray-900"
                      value={match.player2?.crew || crews[0] || ""}
                      onChange={(e) =>
                        updateRacer(matchIndex, "player2", {
                          crew: e.target.value,
                        })
                      }
                    >
                      {crews.map((crew) => (
                        <option key={crew} value={crew} className="text-black">
                          {crew}
                        </option>
                      ))}
                    </select>

                    {/* Winner buttons */}
                    {adminMode && (match.player1 || match.player2) && (
                      <div className="flex flex-col sm:flex-row gap-1 ml-2">
                        {match.player1 && (
                          <button
                            onClick={() =>
                              advanceWinner(
                                roundIndex,
                                matchIndex,
                                match.player1!
                              )
                            }
                            className="px-2 py-1 bg-green-600 text-white rounded font-bold"
                          >
                            {match.player1.name} Wins
                          </button>
                        )}
                        {match.player2 && (
                          <button
                            onClick={() =>
                              advanceWinner(
                                roundIndex,
                                matchIndex,
                                match.player2!
                              )
                            }
                            className="px-2 py-1 bg-green-600 text-white rounded font-bold"
                          >
                            {match.player2.name} Wins
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {adminMode && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={saveBracket}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded"
              >
                Save Bracket
              </button>
              <button
                onClick={resetBracket}
                className="px-4 py-2 bg-yellow-600 text-black font-bold rounded"
              >
                Reset Bracket
              </button>
              <button
                onClick={deleteBracket}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded"
              >
                Delete Bracket
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
