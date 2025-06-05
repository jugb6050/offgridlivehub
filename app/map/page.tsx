"use client";

import {
  MapContainer,
  ImageOverlay,
  Marker,
  Circle,
  useMapEvents,
  Popup,
  Tooltip,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapPin,
  faBroadcastTower,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const bounds: [[number, number], [number, number]] = [
  [0, 0],
  [952, 952],
];

const markerIcon = new L.DivIcon({
  html: `<div style="background:#0ff;padding:6px;border-radius:50%;box-shadow:0 0 6px #0ff;"></div>`,
  iconSize: [16, 16],
  className: "",
});

const jammerIcon = new L.DivIcon({
  html: `<div style="background:red;padding:6px;border-radius:50%;box-shadow:0 0 6px red;"></div>`,
  iconSize: [16, 16],
  className: "",
});

export default function GtaMap() {
  const [markers, setMarkers] = useState<
    { id: number; latlng: L.LatLng; name: string }[]
  >([]);
  const [jammers, setJammers] = useState<
    { id: number; latlng: L.LatLng; radius: number }[]
  >([]);
  const [placingMode, setPlacingMode] = useState<"marker" | "jammer">("marker");
  const [jammerRadius, setJammerRadius] = useState<number>(100);
  const mapRef = useRef<L.Map | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        if (placingMode === "marker") {
          const name = prompt("Enter marker name:");
          if (name) {
            setMarkers((prev) => [
              ...prev,
              { id: Date.now(), latlng: e.latlng, name },
            ]);
          }
        } else {
          setJammers((prev) => [
            ...prev,
            { id: Date.now(), latlng: e.latlng, radius: jammerRadius },
          ]);
        }
      },
      zoomend: () => {
        setZoomLevel(map.getZoom());
      },
    });

    useEffect(() => {
      mapRef.current = map;
      setZoomLevel(map.getZoom());
    }, [map]);

    return null;
  };

  return (
    <div className="w-screen h-screen relative bg-black">
      {/* Modern Control Panel */}
      <div className="absolute top-4 left-4 z-[1000] bg-black/80 border border-cyan-600 text-white px-5 py-4 rounded-xl shadow-xl backdrop-blur-sm space-y-3 w-72">
        <h2 className="text-lg font-semibold text-cyan-300">🧭 Tools</h2>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-md transition text-sm font-semibold ${
              placingMode === "marker"
                ? "bg-cyan-500 text-black shadow"
                : "bg-gray-900 text-cyan-400 border border-cyan-600 hover:bg-cyan-600 hover:text-black"
            }`}
            onClick={() => setPlacingMode("marker")}
          >
            <FontAwesomeIcon icon={faMapPin} className="mr-2" />
            Marker
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition text-sm font-semibold ${
              placingMode === "jammer"
                ? "bg-red-500 text-black shadow"
                : "bg-gray-900 text-red-400 border border-red-600 hover:bg-red-600 hover:text-black"
            }`}
            onClick={() => setPlacingMode("jammer")}
          >
            <FontAwesomeIcon icon={faBroadcastTower} className="mr-2" />
            Jammer
          </button>
        </div>
        {placingMode === "jammer" && (
          <div>
            <label className="block text-xs mb-1">
              Radius: {jammerRadius}px
            </label>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={jammerRadius}
              onChange={(e) => setJammerRadius(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        )}
      </div>

      {/* Map */}
      <MapContainer
        center={[476, 476]}
        zoom={1}
        minZoom={-2}
        maxZoom={4}
        scrollWheelZoom
        crs={L.CRS.Simple}
        bounds={bounds}
        style={{ height: "100%", width: "100%" }}
      >
        <MapClickHandler />
        <ImageOverlay url="/gta-map.png" bounds={bounds} />

        {/* Markers */}
        {markers.map((m) => (
          <Marker key={m.id} position={m.latlng} icon={markerIcon}>
            <Tooltip
              direction="top"
              offset={[0, -10]}
              permanent
              className="!bg-transparent !border-none !shadow-none"
            >
              <span
                style={{
                  fontSize: `${Math.max(8, zoomLevel * 4)}px`,
                  color: "white",
                  textShadow: "0 0 4px #000",
                }}
              >
                {m.name}
              </span>
            </Tooltip>
            <Popup>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  L.DomEvent.stopPropagation(e);
                  setMarkers((prev) => prev.filter((x) => x.id !== m.id));
                }}
                className="text-red-500 hover:underline"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                Remove Marker
              </button>
            </Popup>
          </Marker>
        ))}

        {/* Jammers */}
        {jammers.map((j) => (
          <div key={j.id}>
            <Circle
              center={j.latlng}
              radius={j.radius}
              color="red"
              fillOpacity={0.3}
              interactive={false}
            />
            <Marker
              position={j.latlng}
              icon={jammerIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const newLatLng = e.target.getLatLng();
                  setJammers((prev) =>
                    prev.map((x) =>
                      x.id === j.id ? { ...x, latlng: newLatLng } : x
                    )
                  );
                },
              }}
            >
              <Popup>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    L.DomEvent.stopPropagation(e);
                    setJammers((prev) => prev.filter((x) => x.id !== j.id));
                  }}
                  className="text-red-500 hover:underline"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-1" />
                  Remove Jammer
                </button>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
