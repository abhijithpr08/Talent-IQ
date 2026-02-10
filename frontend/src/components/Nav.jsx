import React from "react";
import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { UserButton } from "@clerk/clerk-react";

const Nav = () => {
  const { isDark, toggleTheme } = useTheme();

    const location = useLocation();

  console.log(location);

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <nav className="bg-base-100/15 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                <span className="text-blue-400 text-2xl">T</span>alent IQ
              </span>
              <span className="text-xs text-base-content/60 font-medium -mt-1">
                Code Together
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* THEME TOGGLE */}
            <button
              type="button"
              className="btn btn-ghost btn-sm rounded-xl"
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              title={isDark ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
            >
              {isDark ? (
                <SunIcon className="size-4" />
              ) : (
                <MoonIcon className="size-4" />
              )}
              <span className="hidden sm:inline">
                {isDark ? "Light" : "Dark"}
              </span>
            </button>

            <div className="flex items-center gap-1">
                {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashbord</span>
            </div>
          </Link>

           <div className="ml-4 mt-2">
            <UserButton />
          </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
