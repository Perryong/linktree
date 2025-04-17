import React from "react";
import { Github, Linkedin, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import DigitalClock from "./components/widget/digitalclock"; 

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
      href: "https://perryongwq.github.io/Personal/",
      label: "Portfolio",
      Icon: ExternalLink,
    },
    { href: "https://www.linkedin.com/in/wen-qing-ong/", label: "LinkedIn", Icon: Linkedin },
    { href: "https://github.com/Perryongwq", label: "GitHub", Icon: Github },
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl">
          {/* ---------- clock ---------- */}
          <DigitalClock timeZone="Asia/Singapore" />

          {/* ---------- profile ---------- */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Wen Qing Ong
            </h1>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight">
              Software Developer &amp;
            </p>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight">
              Tech Enthusiast
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

      {/* footer credit */}
      <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-white text-xl bg-black/30 px-4 py-2 rounded-md">
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
