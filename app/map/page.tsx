"use client"; // optional if you do dynamic import, but safe to include

import dynamic from "next/dynamic";

// Dynamically import the GtaMap component with SSR disabled
const GtaMap = dynamic(() => import("../components/GtaMap"), { ssr: false });

export default function MapPage() {
  return <GtaMap />;
}
