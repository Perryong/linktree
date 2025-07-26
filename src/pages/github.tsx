import React from "react";
import { ArrowLeft, Github } from "lucide-react";
import GitHubContributionGraph from "@/components/widget/githubcontributiongraph";
import GitHubActivity from "@/components/widget/githubactivity";
import NavBar, { NavItem } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export default function GitHubPage() {
  const basePath = import.meta.env.BASE_URL || '/linktree/';
  
  const navItems: NavItem[] = [
    {
      label: "Home",
      href: `${basePath}#/`,
      icon: ArrowLeft,
    },
    {
      label: "GitHub Activity",
      href: `${basePath}#/github`,
      icon: Github,
      isActive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative pt-16"
      style={{
        backgroundImage: `url("${import.meta.env.BASE_URL}gengar.jpg")`,
      }}>
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20" />

      {/* content */}
      <div className="relative z-10 pt-12 px-4 sm:px-6 lg:px-8">
        <header className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 text-white"
            asChild
          >
            <a href={`${basePath}#/`}>
              <ArrowLeft className="h-6 w-6" />
            </a>
          </Button>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Github className="mr-2 h-6 w-6" />
            GitHub Activity
          </h1>
        </header>

        <GitHubContributionGraph username="Perryong" />
        
        {/* GitHub Activity Feed */}
        <div className="mt-6 mb-6">
          <GitHubActivity username="Perryong" maxItems={10} />
        </div>
      </div>

      {/* Navigation */}
      <NavBar items={navItems} />
    </div>
  );
}