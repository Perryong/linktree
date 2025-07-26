import React from "react";
import { Github, Linkedin, ExternalLink, Instagram, LineChart, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import DigitalClock from "./components/widget/digitalclock"; 
import DateWidget from "./components/widget/datewidget";
import WeatherWidget from "./components/widget/weatherwidget";
import NavBar, { NavItem } from "./components/layout/navbar";

// ----------------- reusable link button -----------------
function LinkButton({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Button
      asChild
      variant="outline"
      className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        <Icon className="w-5 h-5 mr-2" />
        <span className="text-lg font-medium">{label}</span>
      </a>
    </Button>
  );
}

// ----------------------------- main app -----------------------------
function App() {
  const linkItems = [
    {
      href: "https://perryong.github.io/personal-portfolio/",
      label: "Portfolio",
      Icon: ExternalLink,
    },
    { href: "https://www.linkedin.com/in/wen-qing-ong/", label: "LinkedIn", Icon: Linkedin },
    { href: "https://github.com/Perryong", label: "GitHub", Icon: Github },
    {href: "https://perryong.github.io/image-gallery-v2/", label: "Photo Gallery", Icon: Instagram},
    {href: "https://portfolio-tracker-weld.vercel.app/", label: "Portfolio Tracker", Icon: LineChart},
  ];

  const basePath = import.meta.env.BASE_URL || '/linktree/';

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: basePath,
      icon: Home,
      isActive: true,
    },
    {
      label: "GitHub Activity",
      href: `${basePath}github`,
      icon: Github,
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}gengar.jpg")`,
      }}
    >
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20" />

      {/* content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="max-w-md w-full space-y-2 backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl">
          {/* ---------- clock ---------- */}
          <DateWidget timeZone="Asia/Singapore" />
          <DigitalClock timeZone="Asia/Singapore" />
          <WeatherWidget location="Singapore" />

          {/* ---------- profile ---------- */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight shadow-text">
              Wen Qing Ong
            </h1>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight shadow-text">
              Software Developer &amp;
            </p>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight shadow-text">
              Tech Enthusiast
            </p>
          </div>

          {/* ---------- links ---------- */}
          <div className="space-y-4">
            {linkItems.map(({ href, label, Icon }) => (
              <LinkButton key={label} href={href} label={label} Icon={Icon} />
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <NavBar items={navItems} />

      {/* footer credit */}
      <footer className="absolute bottom-2 left-2 z-20 text-white text-xl bg-black/30 px-4 py-2 rounded-md">
        Artwork by{" "}
        <a
          href="https://x.com/vince19visuals"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-400 transition-all duration-300"
        >
          @vince19visuals
        </a>
      </footer>
    </div>
  );
}

export default App;