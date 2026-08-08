import { useEffect, useState } from "react";
import {
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
  FaUserCircle,
} from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className="sticky top-0 z-40">
      <div
        className="
          h-20
          backdrop-blur-xl
          bg-white/80
          dark:bg-slate-900/90
          border-b
          border-slate-200
          dark:border-slate-700
          flex
          items-center
          justify-between
          px-10
          shadow-sm
          dark:shadow-black/30
          transition-colors
          duration-300
        "
      >

        {/* LEFT SIDE */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Library Dashboard
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Welcome back 👋
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-5">

          {/* SEARCH */}
          <div className="relative">
            <FaSearch
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              className="
                w-72
                pl-12
                pr-5
                py-3
                rounded-full
                bg-slate-100
                dark:bg-slate-800
                text-slate-800
                dark:text-white
                placeholder-slate-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
              "
              placeholder="Search books, members..."
            />
          </div>

          {/* DARK MODE BUTTON */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              bg-slate-100
              dark:bg-slate-800
              hover:bg-blue-100
              dark:hover:bg-slate-700
              transition-all
              duration-300
              hover:scale-105
            "
          >
            {darkMode ? (
              <FaSun className="text-yellow-400 text-xl" />
            ) : (
              <FaMoon className="text-slate-600 text-xl" />
            )}
          </button>

          {/* NOTIFICATION */}
          <button
            className="
              relative
              w-12
              h-12
              rounded-full
              flex
              items-center
              justify-center
              bg-slate-100
              dark:bg-slate-800
              hover:bg-blue-100
              dark:hover:bg-slate-700
              transition
            "
          >
            <FaBell className="text-slate-600 dark:text-slate-300" />

            <span
              className="
                absolute
                top-2
                right-2
                w-2.5
                h-2.5
                bg-red-500
                rounded-full
              "
            />
          </button>

          {/* PROFILE */}
          <div className="flex items-center gap-3">

            <div className="text-right">
              <p className="font-semibold text-slate-800 dark:text-white">
                Admin
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Library Manager
              </p>
            </div>

            <FaUserCircle className="text-5xl text-blue-600" />

          </div>

        </div>
      </div>
    </div>
  );
}