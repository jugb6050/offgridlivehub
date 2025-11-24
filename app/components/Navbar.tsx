"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Race Team", href: "/racers" },
  { name: "Time Attack Leaderboards", href: "/leaderboard" },
  { name: "Interactive Map", href: "/map" },
  { name: "Head 2 Head", href: "/head2head" },
  { name: "Race Event Details", href: "/eventdetails" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="bg-black text-white px-6 py-4 flex justify-center border-b-2 border-white">
      <ul className="flex space-x-8 items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`relative px-3 py-2 text-lg font-semibold transition duration-300 
                  ${isActive ? "text-yellow-200" : "hover:text-yellow-300"}
                  after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-yellow-300 after:transition-all after:duration-300
                  hover:after:w-full hover:after:left-0
                `}
              >
                {item.name}
              </Link>
            </li>
          );
        })}

        {/* Razed Casino Button */}
        <li>
          <a
            href="https://www.razed.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-black font-semibold bg-white rounded border border-gray-300 hover:bg-blue-200 transition duration-300"
          >
            Razed Casino
          </a>
        </li>
      </ul>
    </div>
  );
}
