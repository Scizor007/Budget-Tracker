
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, BarChart2, LayoutDashboard, Star } from "lucide-react";

const navItems = [
  {
    path: "/",
    label: "Home",
    icon: Home,
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/graphs",
    label: "Graphs",
    icon: BarChart2,
  },
  {
    path: "/features",
    label: "Features",
    icon: Star,
  },
];

export default function Navbar() {
  const location = useLocation();
  return (
    <nav className="w-full bg-background/80 backdrop-blur border-b sticky top-0 z-40">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="text-xl font-bold tracking-tight flex items-center space-x-2 text-primary">
          <span role="img" aria-label="logo" className="mr-1">💸</span>
          <span>Budget Tracker</span>
        </div>
        <ul className="flex items-center space-x-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={cn(
                  "flex items-center space-x-1 px-3 py-1.5 rounded hover:bg-accent/50 transition text-sm sm:text-base font-medium",
                  location.pathname === path
                    ? "bg-accent/75 text-accent-foreground"
                    : "text-muted-foreground"
                )}
                aria-current={location.pathname === path ? "page" : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
