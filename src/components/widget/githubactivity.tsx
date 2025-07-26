import React, { useEffect, useState } from "react";
import { GitBranch, Star, GitPullRequest, GitMerge, GitCommit, AlertCircle, Github } from "lucide-react";
import { cn } from "@/lib/utils";

interface GitHubActivityProps {
  username: string;
  maxItems?: number;
  className?: string;
}

type GitHubEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    action?: string;
    ref?: string;
    ref_type?: string;
    commits?: Array<{
      message: string;
    }>;
    pull_request?: {
      title: string;
      html_url: string;
    };
  };
};

export default function GitHubActivity({
  username,
  maxItems = 5,
  className,
}: GitHubActivityProps) {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.github.com/users/${username}/events?per_page=${maxItems}`
        );

        if (!response.ok) {
          throw new Error(`GitHub API failed: ${response.status}`);
        }

        const data: GitHubEvent[] = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error("GitHub activity fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch GitHub activity");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubActivity();
    // Refresh every 30 minutes to respect GitHub API rate limits
    const interval = setInterval(fetchGitHubActivity, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [username, maxItems]);

  // Format the date to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get icon based on event type
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "PushEvent":
        return <GitCommit className="w-4 h-4 flex-shrink-0" />;
      case "PullRequestEvent":
        return <GitPullRequest className="w-4 h-4 flex-shrink-0" />;
      case "CreateEvent":
        return <GitBranch className="w-4 h-4 flex-shrink-0" />;
      case "WatchEvent":
        return <Star className="w-4 h-4 flex-shrink-0" />;
      case "PullRequestReviewEvent":
        return <GitPullRequest className="w-4 h-4 flex-shrink-0" />;
      case "ForkEvent":
        return <GitBranch className="w-4 h-4 flex-shrink-0" />;
      case "MergeEvent":
        return <GitMerge className="w-4 h-4 flex-shrink-0" />;
      default:
        return <GitCommit className="w-4 h-4 flex-shrink-0" />;
    }
  };

  // Get a human-readable description of the event
  const getEventDescription = (event: GitHubEvent): string => {
    const repoName = event.repo.name.split("/")[1]; // Get just the repo name without owner

    switch (event.type) {
      case "PushEvent":
        const commitCount = event.payload?.commits?.length || 0;
        const commitMsg = event.payload?.commits?.[0]?.message || "";
        return `Pushed ${commitCount} commit${commitCount !== 1 ? "s" : ""} to ${repoName}${
          commitMsg ? `: "${commitMsg.split("\n")[0].substring(0, 40)}${
            commitMsg.length > 40 ? "..." : ""
          }"` : ""
        }`;
      
      case "PullRequestEvent":
        const action = event.payload?.action || "";
        const prTitle = event.payload?.pull_request?.title || "";
        return `${action === "opened" ? "Opened" : action === "closed" ? "Closed" : "Updated"} PR in ${repoName}: "${prTitle.substring(0, 40)}${prTitle.length > 40 ? "..." : ""}"`;
      
      case "CreateEvent":
        const refType = event.payload?.ref_type || "";
        const ref = event.payload?.ref || "";
        return `Created ${refType} ${ref ? `'${ref}' ` : ""}in ${repoName}`;
      
      case "WatchEvent":
        return `Starred ${repoName}`;
      
      case "ForkEvent":
        return `Forked ${repoName}`;
      
      default:
        return `Activity on ${repoName}`;
    }
  };

  if (error) {
    return (
      <div className={cn("w-full p-3 bg-white/10 rounded-lg mt-4", className)}>
        <div className="flex items-center text-red-300">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>Failed to load GitHub activity: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full bg-white/10 backdrop-blur-sm rounded-lg mt-4 border border-white/10", className)}>
      <div className="px-4 py-3 border-b border-white/20 flex items-center">
        <Github className="w-5 h-5 mr-2 text-white" />
        <h3 className="text-lg font-semibold text-white shadow-text">Recent GitHub Activity</h3>
      </div>
      
      <div className="divide-y divide-white/10 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="py-4 px-4 text-white/70 text-center">No recent activity</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition-colors">
              <div className="mt-1">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm whitespace-normal break-words">
                  {getEventDescription(event)}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {formatDate(event.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}