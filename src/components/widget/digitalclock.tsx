import React, { useEffect, useState } from "react";
import { Clock as ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";               // merge class names

export interface DigitalClockProps {
  /** IANA zone string (e.g. "Asia/Singapore").  
   *  Defaults to the visitor’s local zone. */
  timeZone?: string;
  /** Set false if you want “HH:MM” without seconds. */
  showSeconds?: boolean;
  /** Append additional classes (original style is preserved). */
  className?: string;
}

const DigitalClock: React.FC<DigitalClockProps> = ({
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  showSeconds = true,
  className,
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1_000);
    return () => clearInterval(id);
  }, []);

  const fmt: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    ...(showSeconds && { second: "2-digit" }),
    hour12: false,
    timeZone,
  };

  /* original wrapper classes kept intact */
  const wrapper = cn(
    "flex items-center justify-center space-x-2 text-white mb-6 shadow-text",
    className
  );

  return (
    <div className={wrapper}>
      <ClockIcon className="w-8 h-8" />
      <time className="font-mono text-3xl font-bold">
        {now.toLocaleTimeString([], fmt)}
      </time>
    </div>
  );
};

export default DigitalClock;
