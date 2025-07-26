import React, { useEffect, useState } from "react";
import { CloudRain, CloudSun, Sun, Snowflake, Cloud, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  /** Location name (e.g., "Singapore", "London") */
  location: string;
  /** Tailwind classes for the wrapper. */
  className?: string;
  /** Refresh period in minutes (default 10). */
  refreshMins?: number;
}

// Open-Meteo API response type
type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
  current_units: {
    temperature_2m: string;
  };
};

// Geocoding response type
type GeocodingResponse = {
  results?: Array<{
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  }>;
};

export default function WeatherWidget({
  location,
  className,
  refreshMins = 10,
}: WeatherWidgetProps) {
  const [data, setData] = useState<OpenMeteoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Step 1: Get coordinates for the location using Open-Meteo's geocoding API
        const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`;
        
        const geoResponse = await fetch(geocodingUrl);
        if (!geoResponse.ok) {
          throw new Error(`Geocoding failed: ${geoResponse.status}`);
        }
        
        const geoData: GeocodingResponse = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          throw new Error(`Location "${location}" not found`);
        }

        const { latitude, longitude } = geoData.results[0];

        // Step 2: Get weather data using coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;
        
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          throw new Error(`Weather API failed: ${weatherResponse.status}`);
        }

        const weatherData: OpenMeteoResponse = await weatherResponse.json();
        console.log('Open-Meteo Weather Data:', weatherData); // For debugging
        
        setData(weatherData);
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, refreshMins * 60_000);
    return () => clearInterval(interval);
  }, [location, refreshMins]);

  // Map WMO weather codes to icons
  // Reference: https://open-meteo.com/en/docs
  const pickIcon = () => {
    if (!data) return HelpCircle;
    
    const code = data.current.weather_code;
    
    // Clear sky
    if (code === 0) return Sun;
    
    // Partly cloudy
    if (code >= 1 && code <= 3) return CloudSun;
    
    // Overcast
    if (code === 45 || code === 48) return Cloud;
    
    // Rain
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return CloudRain;
    
    // Snow
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return Snowflake;
    
    // Thunderstorm
    if (code >= 95 && code <= 99) return CloudRain;
    
    return Cloud; // Default fallback
  };

  // Get weather description from WMO code
  const getWeatherDescription = (code: number): string => {
    const descriptions: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      56: "Light freezing drizzle",
      57: "Dense freezing drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      66: "Light freezing rain",
      67: "Heavy freezing rain",
      71: "Slight snow fall",
      73: "Moderate snow fall",
      75: "Heavy snow fall",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    
    return descriptions[code] || "Unknown";
  };

  const Icon = pickIcon();
  const temp = data ? Math.round(data.current.temperature_2m) : "--";
  const description = data ? getWeatherDescription(data.current.weather_code) : (error || "");

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2 text-white shadow-text",
        className
      )}
      title={description}
    >
      <Icon className="w-6 h-6" />
      <span className="font-mono text-2xl font-bold">{temp}°C</span>
    </div>
  );
}