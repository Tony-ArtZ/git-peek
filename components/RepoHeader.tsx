import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubRepo } from "@/actions/getRepoData";
import {
  Star,
  GitFork,
  AlertCircle,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface RepoHeaderProps {
  repo: GitHubRepo;
}

export default function RepoHeader({ repo }: RepoHeaderProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{repo.name}</h1>
              {repo.private && (
                <Badge variant="secondary" className="text-xs">
                  Private
                </Badge>
              )}
            </div>
            {repo.description && (
              <p className="text-muted-foreground">{repo.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {repo.language && (
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: getLanguageColor(repo.language),
                    }}
                  />
                  {repo.language}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {repo.stargazers_count}
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="w-4 h-4" />
                {repo.forks_count}
              </div>
              {repo.open_issues_count > 0 && (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {repo.open_issues_count}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View on GitHub
              </a>
            </Button>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    "C#": "#239120",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#4F5D95",
    Ruby: "#701516",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    Dart: "#00B4AB",
    Shell: "#89e051",
    HTML: "#e34c26",
    CSS: "#1572B6",
    Vue: "#2c3e50",
    React: "#61DAFB",
  };
  return colors[language] || "#586069";
}
