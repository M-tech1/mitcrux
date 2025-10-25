"use client";
import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";

interface INavItem {
  label: string;
  href: string;
}

const navItems: INavItem[] = [
  { label: "Home", href: "#/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Software", href: "#softwares" },
  // { label: "Team", href: "/team" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  function downloadCompanyProfile() {
    return alert("Unavailable");
  }
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-sm">
      <nav className="flex items-center justify-between px-6 md:px-14 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 ">
          <a href="#/">
            <h1 className="text-xl font-semibold text-cyan-400 uppercase">
              Mitcrux
            </h1>
          </a>
          <span className="text-[10px] text-gray-300 tracking-wider ">
            Technology
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8 text-cyan-400  font-medium">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="hover:text-cyan-900 transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-5">
          <Search className="w-5 h-5 text-white hover:text-cyan-400 cursor-pointer transition" />
          <button
            onClick={downloadCompanyProfile}
            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
          >
            Company Profile
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white p-2 rounded focus:outline-none"
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Nav Dropdown */}
      {open && (
        <div className="md:hidden bg-[#07131A]/95 text-white border-t border-slate-800">
          <ul className="flex flex-col gap-3 p-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 hover:text-cyan-400 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <div className="flex items-center justify-between mt-4">
              <Search className="w-5 h-5 text-white hover:text-cyan-400 cursor-pointer transition" />
              <button
                onClick={downloadCompanyProfile}
                className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
              >
                Company Profile
              </button>
            </div>
          </ul>
        </div>
      )}
    </header>
  );
}
