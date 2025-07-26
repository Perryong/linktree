import React, { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitHubContributionGraphProps {
  username: string;
  className?: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionStats {
  totalContributions: number;
  longestStreak: number;
  currentStreak: number;
  averagePerDay: number;
}

interface CalendarData {
  calendar: ContributionDay[][];
  monthPositions: Record<string, number>;
}

export default function GitHubContributionGraph({
  username,
  className,
}: GitHubContributionGraphProps) {
  const [contributionData, setContributionData] = useState<Record<string, ContributionDay>>({});
  const [stats, setStats] = useState<ContributionStats>({
    totalContributions: 0,
    longestStreak: 0,
    currentStreak: 0,
    averagePerDay: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch contributions: ${response.status}`);
        }
        
        const data = await response.json();
        
        const contributions: Record<string, ContributionDay> = {};
        let total = 0;
        let longestStreak = 0;
        let currentStreak = 0;
        let tempStreak = 0;
        
        if (data.contributions) {
          const sortedContribs = data.contributions.sort((a: any, b: any) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          sortedContribs.forEach((contrib: any, index: number) => {
            const count = contrib.count || 0;
            total += count;
            
            let level = 0;
            if (count === 0) level = 0;
            else if (count <= 2) level = 1;
            else if (count <= 5) level = 2;
            else if (count <= 8) level = 3;
            else level = 4;
            
            contributions[contrib.date] = {
              date: contrib.date,
              count,
              level
            };
            
            // Calculate streaks
            if (count > 0) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
              
              // Check if this is part of current streak (from today backwards)
              if (index === sortedContribs.length - 1 || 
                  new Date(contrib.date).getTime() >= Date.now() - (currentStreak + 1) * 24 * 60 * 60 * 1000) {
                currentStreak = tempStreak;
              }
            } else {
              tempStreak = 0;
            }
          });
        }
        
        const totalDays = Object.keys(contributions).length || 1;
        const averagePerDay = Math.round((total / totalDays) * 100) / 100;
        
        setStats({
          totalContributions: total,
          longestStreak,
          currentStreak,
          averagePerDay,
        });
        
        setContributionData(contributions);
        setError(null);
      } catch (err) {
        console.error("Error fetching GitHub contributions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch GitHub contributions");
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  const getColorClass = (level: number): string => {
    const colors = {
      0: "bg-slate-800/50 hover:bg-slate-700/50",
      1: "bg-green-900/60 hover:bg-green-800/60",
      2: "bg-green-700/70 hover:bg-green-600/70",
      3: "bg-green-500/80 hover:bg-green-400/80",
      4: "bg-green-400/90 hover:bg-green-300/90",
    };
    return colors[level as keyof typeof colors] || colors[0];
  };

  // Use useMemo to avoid recalculating calendar on every render
  const { calendar, monthPositions } = useMemo(() => {
    const today = new Date();
    // Start from March 1, 2025
    const startDate = new Date('2025-03-01');
    
    // If today is somehow before March 2025, use today's year instead
    if (startDate > today) {
      startDate.setFullYear(today.getFullYear());
    }
    
    // Adjust to the beginning of the week
    const startDayOfWeek = startDate.getDay();
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(adjustedStartDate.getDate() - startDayOfWeek);
    
    const totalWeeks = Math.ceil((today.getTime() - adjustedStartDate.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
    const calendar: ContributionDay[][] = [];
    const monthStartingWeeks: Record<string, number> = {};
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekData: ContributionDay[] = [];
      
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(adjustedStartDate);
        currentDate.setDate(currentDate.getDate() + (week * 7) + day);
        
        if (currentDate > today) continue;
        
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // If this is the first day of a month, record which week it's in
        if (currentDate.getDate() === 1) {
          const monthIndex = currentDate.getMonth();
          monthStartingWeeks[months[monthIndex]] = week;
        }
        
        const contribution = contributionData[dateStr] || {
          date: dateStr,
          count: 0,
          level: 0
        };
        
        weekData.push(contribution);
      }
      
      if (weekData.length > 0) {
        calendar.push(weekData);
      }
    }
    
    return { calendar, monthPositions: monthStartingWeeks } as CalendarData;
  }, [contributionData, months]);

  if (loading) {
    return (
      <Card className={cn("bg-white/5 border-white/10 backdrop-blur-sm", className)}>
        <CardContent className="p-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("bg-white/5 border-white/10 backdrop-blur-sm", className)}>
        <CardContent className="p-8">
          <div className="text-red-400 text-center">
            <Github className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Failed to load GitHub contributions</p>
            <p className="text-sm text-white/60 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-white/5 border-white/10 backdrop-blur-sm", className)}>
      <CardHeader>
        <CardTitle className="text-white flex items-center text-xl shadow-text">
          <Github className="w-6 h-6 mr-3" />
          GitHub Activity
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Stats Cards - Only Total Contributions */}
        <div className="mb-8">
          <div className="bg-white/5 rounded-lg p-4 text-center border border-white/10 max-w-xs mx-auto">
            <div className="text-3xl font-bold text-green-400 shadow-text">{stats.totalContributions}</div>
            <div className="text-sm text-white shadow-text font-medium">Total Contributions</div>
          </div>
        </div>

        {/* Contribution Graph */}
        <div className="overflow-x-auto">
          <div className="min-w-fit">
            {/* Month labels */}
            <div className="flex mb-2 ml-8 relative h-4">
              {Object.keys(monthPositions).map((month, i) => {
                const weekPosition = monthPositions[month];
                const leftPosition = weekPosition * 13; // 11px width + 2px gap

                return (
                  <div
                    key={i}
                    className="absolute text-xs text-white/60 shadow-text"
                    style={{
                      left: `${leftPosition}px`,
                    }}
                  >
                    {month}
                  </div>
                );
              })}
            </div>

            <div className="flex">
              {/* Weekday labels */}
              <div className="flex flex-col pr-2 text-xs text-white/60 shadow-text">
                {weekdays.map((day, i) => (
                  <div 
                    key={i} 
                    className="h-[11px] flex items-center justify-end w-8 mb-[2px]"
                    style={{ fontSize: '10px' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex gap-[2px]">
                {calendar.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[2px]">
                    {week.map((day, dayIndex) => (
                      <div 
                        key={`${weekIndex}-${dayIndex}`}
                        className={cn(
                          "h-[11px] w-[11px] rounded-sm transition-all duration-200 cursor-pointer",
                          getColorClass(day.level)
                        )}
                        title={`${new Date(day.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-between items-center mt-4 text-xs text-white/60 shadow-text">
              <span>Contributions since March 2025</span>
              <div className="flex items-center gap-1">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map(level => (
                  <div 
                    key={level} 
                    className={cn("h-[11px] w-[11px] rounded-sm", getColorClass(level))}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}