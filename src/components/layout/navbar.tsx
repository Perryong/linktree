import React from "react";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isActive?: boolean;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export default function NavBar({ items, className }: NavBarProps) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10",
        className
      )}
    >
      <div className="container max-w-md mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 rounded-lg transition-colors",
                item.isActive
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {item.icon && (
                <item.icon className="w-5 h-5 mr-2" />
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}