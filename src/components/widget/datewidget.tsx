import React, { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateWidgetProps {
  timeZone?: string;           // IANA zone, defaults to local
  className?: string;          // extra wrapper classes
}

const DateWidget: React.FC<DateWidgetProps> = ({
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
  className,
}) => {
  const [today, setToday] = useState(new Date());

  /* refresh once a minute—cheap and keeps midnight rollover accurate */
  useEffect(() => {
    const id = setInterval(() => setToday(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  /* build “dd / mm / yyyy” respecting the chosen time‑zone */
  const formatted = (() => {
    const parts = today
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",     // ←  four‑digit year
        timeZone,
      })
      .split("/");           // yields ["dd", "mm", "yyyy"]
    return `${parts[0]} / ${parts[1]} / ${parts[2]}`;
  })();

  return (
    <div
      className={cn(
        "flex items-center justify-center space-x-2 text-white",
        className
      )}
    >
      <CalendarIcon className="w-6 h-6" />
      <span className="font-mono text-2xl font-bold">{formatted}</span>
    </div>
  );
};

export default DateWidget;
