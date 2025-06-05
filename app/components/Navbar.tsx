"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Race Team", href: "/racers" },
  { name: "Time Attack Leaderboards", href: "/leaderboard" },
  { name: "Interactive Map", href: "/map" },
  { name: "Head 2 Head", href: "/head2head" },
  { name: "Race Event Details", href: "/eventdetails" }, // 👈 Added this
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bg-black text-white px-6 py-4 flex justify-center border-b-2 border-white">
      <ul className="flex space-x-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`relative px-3 py-2 text-lg font-semibold transition duration-300 
                  ${isActive ? "text-cyan-400" : "hover:text-cyan-300"}
                  after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300
                  hover:after:w-full hover:after:left-0
                `}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
