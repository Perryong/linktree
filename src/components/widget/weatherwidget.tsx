import React, { useEffect, useState } from "react";
import { CloudRain, CloudSun, Sun, Snowflake, Cloud, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  /** OpenWeather city name OR "lat,lon" string (e.g. "1.29,103.85"). */
  location: string;
  /** Tailwind classes for the wrapper. */
  className?: string;
  /** Refresh period in minutes (default 10). */
  refreshMins?: number;
}

type OWM = {
  main: { temp: number };
  weather: { id: number; description: string }[];
};

export default function WeatherWidget({
  location,
  className,
  refreshMins = 10,
}: WeatherWidgetProps) {
  const [data, setData]   = useState<OWM | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY as string | undefined;

  useEffect(() => {
    if (!apiKey) {
      setError("API key missing");
      return;
    }

    const fetchWeather = () => {
      const q = location.includes(",")
        ? `lat=${location.split(",")[0]}&lon=${location.split(",")[1]}`
        : `q=${location}`;

      fetch(`https://api.openweathermap.org/data/2.5/weather?${q}&appid=${apiKey}&units=metric`)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
        .then((j: OWM) => { setData(j); setError(null); })
        .catch((e) => setError(String(e)));
    };

    fetchWeather();
    const id = setInterval(fetchWeather, refreshMins * 60_000);
    return () => clearInterval(id);
  }, [location, apiKey, refreshMins]);

  // ——— map weather code to icon ———
  const pickIcon = () => {
    if (!data) return HelpCircle;
    const id = data.weather[0].id;
    if (id >= 200 && id < 600) return CloudRain;
    if (id >= 600 && id < 700) return Snowflake;
    if (id === 800)            return Sun;
    if (id > 800)              return CloudSun;
    return Cloud;
  };

  const Icon = pickIcon();
  const temp = data ? Math.round(data.main.temp) : "--";

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2 text-white",
        className
      )}
      title={data?.weather[0].description ?? error ?? ""}
    >
      <Icon className="w-6 h-6" />
      <span className="font-mono text-2xl font-bold">{temp}°C</span>
    </div>
  );
}
