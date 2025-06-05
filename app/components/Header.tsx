"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="relative z-50 w-full bg-black border-b-4 border-cyan-500 shadow-[0_0_20px_#00ffff]">
      <div className="py-6 px-8 text-center bg-gradient-to-r from-cyan-900 via-black to-cyan-900 animate-background-glow">
        <Link
          href="/"
          className="text-white text-5xl md:text-6xl font-cyberpunk tracking-widest hover:text-cyan-300 transition-all duration-300 drop-shadow-[0_0_10px_#00ffff]"
        >
          OFF GRID
        </Link>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-white to-white animate-pulse" />
    </header>
  );
}
