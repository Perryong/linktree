import React, { useState, useEffect } from 'react';
import { Github, Linkedin, ExternalLink, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";


function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center space-x-2 text-white mb-6 ">
      <Clock className="w-8 h-8" />
      <time className="font-mono text-3xl font-bold">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </time>
    </div>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" 
         style={{
           backgroundImage: `url("/gengar.jpg")`
          //  backgroundImage: 'url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'

         }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20" />
      
      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 backdrop-blur-sm bg-white/10 p-8 rounded-2xl shadow-2xl">
          {/* Clock Widget */}
          <ClockWidget />
          
          {/* Profile Section */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              Wen Qing Ong
            </h1>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight">
              Software Developer &
            </p>
            <p className="text-2xl font-bold text-white mb-2 tracking-tight">
              Tech Enthusiast
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <Button
              asChild
              variant="outline"
              className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <a
                href="https://perryongwq.github.io/Personal/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">Portfolio</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <a
                href="https://www.linkedin.com/in/wen-qing-ong/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">LinkedIn</span>
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full bg-white/10 border-white text-white hover:bg-white hover:text-black transition-all duration-300"
            >
              <a
                href="https://github.com/Perryongwq"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <Github className="w-5 h-5 mr-2" />
                <span className="text-lg font-medium">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
      {/* Footer Credit */}
      <footer className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20 text-white text-xl bg-black/30 px-4 py-2 rounded-md">
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