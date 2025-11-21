"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Blip = {
  _id: string;
  date: string;
  timeUTC: string;
  eventName: string;
  carClass: string;
  trackName?: string;
  coords: { x: number; y: number };
};

export default function GtaMap() {
  const [blips, setBlips] = useState<Blip[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [addingBlip, setAddingBlip] = useState<{ x: number; y: number } | null>(
    null
  );
  const [newBlipData, setNewBlipData] = useState({
    date: "",
    timeUTC: "",
    eventName: "",
    carClass: "",
    trackName: "",
  });

  const [editingBlipId, setEditingBlipId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState({
    date: "",
    timeUTC: "",
    eventName: "",
    carClass: "",
    trackName: "",
  });

  // Load blips from API
  const fetchBlips = async () => {
    const res = await fetch("/api/blips");
    const data = await res.json();
    setBlips(data);
  };

  useEffect(() => {
    fetchBlips();
  }, []);

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

  // Click map to add blip (admin only)
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!adminMode) return;
        setAddingBlip({ x: e.latlng.lat, y: e.latlng.lng });
      },
    });
    return null;
  };

  // Save new blip
  const saveBlip = async () => {
    if (!addingBlip) return;
    const payload = { ...newBlipData, coords: addingBlip };
    const res = await fetch("/api/blips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      fetchBlips();
      setAddingBlip(null);
      setNewBlipData({
        date: "",
        timeUTC: "",
        eventName: "",
        carClass: "",
        trackName: "",
      });
    } else {
      alert("Failed to save blip");
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      {/* Admin Button */}
      <div className="fixed top-4 left-4 z-50 flex gap-4">
        {!adminMode && (
          <button
            onClick={handleAdminLogin}
            className="px-4 py-2 bg-red-600 text-black font-bold rounded hover:bg-red-500"
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

      <MapContainer
        center={[0, 0]}
        zoom={-1}
        minZoom={-5}
        maxZoom={5}
        scrollWheelZoom
        className="absolute top-16 left-0 right-0 bottom-0"
        crs={L.CRS.Simple}
      >
        <MapClickHandler />

        {/* Map Image */}
        <ImageOverlay
          url="/gta-map.png"
          bounds={[
            [0, 0],
            [1000, 1000],
          ]}
        />

        {/* Existing Blips */}
        {blips.map((blip) => (
          <Marker
            key={blip._id}
            position={[blip.coords.x, blip.coords.y]}
            icon={L.divIcon({
              className: "bg-yellow-500 rounded-full w-4 h-4",
            })}
          >
            <Popup>
              <div className="flex flex-col gap-1 text-black">
                {editingBlipId === blip._id ? (
                  <>
                    <input
                      type="date"
                      value={editingData.date}
                      onChange={(e) =>
                        setEditingData({ ...editingData, date: e.target.value })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      type="time"
                      value={editingData.timeUTC}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          timeUTC: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Event Name"
                      value={editingData.eventName}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          eventName: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Car Class"
                      value={editingData.carClass}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          carClass: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Track Name"
                      value={editingData.trackName}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          trackName: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={async () => {
                          const res = await fetch(
                            `/api/blips?id=${editingBlipId}`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(editingData),
                            }
                          );
                          if (res.ok) {
                            fetchBlips();
                            setEditingBlipId(null);
                          } else {
                            alert("Failed to update blip");
                          }
                        }}
                        className="bg-green-600 text-black font-bold rounded p-1 hover:bg-green-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBlipId(null)}
                        className="bg-gray-600 text-white p-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <b>{blip.eventName}</b>
                    <span>Date: {blip.date}</span>
                    <span>Time (UTC): {blip.timeUTC}</span>
                    <span>Car Class: {blip.carClass}</span>
                    {blip.trackName && <span>Track: {blip.trackName}</span>}
                    {adminMode && (
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => {
                            setEditingBlipId(blip._id);
                            setEditingData({
                              date: blip.date,
                              timeUTC: blip.timeUTC,
                              eventName: blip.eventName,
                              carClass: blip.carClass,
                              trackName: blip.trackName || "",
                            });
                          }}
                          className="bg-blue-600 text-white p-1 rounded hover:bg-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!confirm("Delete this blip?")) return;
                            const res = await fetch(
                              `/api/blips?id=${blip._id}`,
                              {
                                method: "DELETE",
                              }
                            );
                            if (res.ok) fetchBlips();
                          }}
                          className="bg-red-600 text-white p-1 rounded hover:bg-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Adding New Blip */}
        {addingBlip && (
          <Marker
            position={[addingBlip.x, addingBlip.y]}
            icon={L.divIcon({ className: "bg-green-600 rounded-full w-4 h-4" })}
          >
            <Popup>
              <div className="flex flex-col gap-2 text-black">
                <input
                  type="date"
                  value={newBlipData.date}
                  onChange={(e) =>
                    setNewBlipData({ ...newBlipData, date: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="time"
                  value={newBlipData.timeUTC}
                  onChange={(e) =>
                    setNewBlipData({ ...newBlipData, timeUTC: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Event Name"
                  value={newBlipData.eventName}
                  onChange={(e) =>
                    setNewBlipData({
                      ...newBlipData,
                      eventName: e.target.value,
                    })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Car Class"
                  value={newBlipData.carClass}
                  onChange={(e) =>
                    setNewBlipData({ ...newBlipData, carClass: e.target.value })
                  }
                  className="border p-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Track Name (optional)"
                  value={newBlipData.trackName}
                  onChange={(e) =>
                    setNewBlipData({
                      ...newBlipData,
                      trackName: e.target.value,
                    })
                  }
                  className="border p-1 rounded"
                />
                <button
                  onClick={saveBlip}
                  className="bg-green-600 text-black font-bold rounded p-1 hover:bg-green-500"
                >
                  Save Blip
                </button>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
