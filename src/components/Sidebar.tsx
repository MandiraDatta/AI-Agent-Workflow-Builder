"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Workflow, LayoutTemplate, Settings, ChevronsUpDown, Zap } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "My Workflows", href: "/", icon: Workflow },
    { label: "Templates", href: "/templates", icon: LayoutTemplate },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-full bg-sidebar-bg text-zinc-300 flex flex-col border-r border-[#2D273F] text-sm">
      {/* Organization Switcher */}
      <div className="p-4 border-b border-[#2D273F] flex items-center justify-between hover:bg-sidebar-hover cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-xs">
            A
          </div>
          <span className="font-medium text-[#F5F5F5]">Acme Corp</span>
        </div>
        <ChevronsUpDown className="w-4 h-4 text-zinc-500" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/workflow/') && item.href === '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                isActive 
                  ? "bg-[#181423] text-white font-medium" 
                  : "hover:bg-sidebar-hover text-zinc-400 hover:text-white"
              }`}
            >
              <div className="relative flex items-center justify-center w-4 h-4">
                <div className={`w-3.5 h-3.5 rounded-full border border-[#2D273F] flex items-center justify-center ${isActive ? '' : 'bg-[#181423]'}`}>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />}
                </div>
              </div>
              <span className="text-[13px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usage/Quota Indicator */}
      <div className="p-4 border-t border-[#2D273F] m-3 rounded-lg bg-[#181423]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            Executions
          </span>
          <span className="text-xs font-bold text-zinc-200">2,450 / 10k</span>
        </div>
        <div className="w-full bg-[#0A0710] rounded-full h-1.5 border border-[#2D273F]">
          <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: '24.5%' }}></div>
        </div>
      </div>
    </div>
  );
}

