"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  GitBranch,
  Lock,
  Globe,
  Upload,
  Check,
} from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  html_url: string;
  updated_at: string;
}

interface RepoPublisherProps {
  repos: GitHubRepo[];
}

export default function RepoPublisher({ repos }: RepoPublisherProps) {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const router = useRouter();

  const handleRepoSelect = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
  };

  const handlePublish = () => {
    if (selectedRepo) {
      router.push(`/publish?id=${selectedRepo.html_url}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
        onClick={handlePublish}
        disabled={!selectedRepo}
      >
        <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <span className="truncate">
          {selectedRepo ? `Publish ${selectedRepo.name}` : "Select Repository"}
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="lg"
            className="px-4 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
          >
            <GitBranch className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="flex items-center gap-2 truncate">
              {selectedRepo ? (
                <>
                  {selectedRepo.private ? (
                    <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  <span className="truncate">{selectedRepo.name}</span>
                </>
              ) : (
                "Select Repository"
              )}
            </span>
            <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[90vw] sm:w-80 max-h-80 overflow-y-auto"
        >
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
            Your Repositories
          </div>
          <DropdownMenuSeparator />
          {repos.length === 0 ? (
            <DropdownMenuItem disabled>
              <span className="text-muted-foreground">
                No repositories found
              </span>
            </DropdownMenuItem>
          ) : (
            repos.map((repo) => (
              <DropdownMenuItem
                key={repo.id}
                className="cursor-pointer"
                onClick={() => handleRepoSelect(repo)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {repo.private ? (
                      <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    ) : (
                      <Globe className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">{repo.name}</span>
                      {repo.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-full">
                          {repo.description}
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedRepo?.id === repo.id ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
