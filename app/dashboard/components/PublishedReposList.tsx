"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { deletePublishedRepo } from "@/actions/userRepo";
import {
  ExternalLink,
  Trash2,
  Calendar,
  GitBranch,
  Copy,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

interface PublishedRepo {
  id: string;
  githubRepoId: string;
  createdAt: Date | null;
  repoName?: string;
  repoUrl?: string;
  description?: string;
  isPrivate?: boolean;
  viewCount?: number;
  lastViewed?: Date | null;
}

interface PublishedReposListProps {
  repos: PublishedRepo[];
}

function RepoCard({
  repo,
  onDelete,
}: {
  repo: PublishedRepo;
  onDelete: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/repo/${repo.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(repo.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Unknown";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">
              {repo.repoName || `Repository #${repo.githubRepoId}`}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              Published
            </Badge>
            {repo.isPrivate && (
              <Badge variant="outline" className="text-xs">
                Private
              </Badge>
            )}
          </div>
        </div>
        {repo.description && (
          <p className="text-sm text-muted-foreground mt-2">
            {repo.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Repository Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Published {formatDate(repo.createdAt)}</span>
          </div>

          {repo.viewCount !== undefined && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>
                {formatNumber(repo.viewCount)}{" "}
                {repo.viewCount === 1 ? "view" : "views"}
                {repo.viewCount >= 1000 && (
                  <span className="text-xs ml-1">
                    ({repo.viewCount.toLocaleString()})
                  </span>
                )}
                {repo.lastViewed && (
                  <span className="ml-2">
                    • Last viewed {formatDate(repo.lastViewed)}
                  </span>
                )}
              </span>
            </div>
          )}

          <div className="text-sm">
            <span className="font-medium">Share URL:</span>
            <div className="mt-1 p-2 bg-muted rounded-md font-mono text-xs break-all">
              {shareUrl}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
            className="flex-1 sm:flex-none"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy URL"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex-1 sm:flex-none"
          >
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Shared
            </a>
          </Button>

          {repo.repoUrl && (
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 sm:flex-none"
            >
              <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer">
                <GitBranch className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            {isDeleting ? "Deleting..." : "Unpublish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PublishedReposList({ repos }: PublishedReposListProps) {
  const [repoList, setRepoList] = useState(repos);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (repoId: string) => {
    startTransition(async () => {
      try {
        const result = await deletePublishedRepo(repoId);

        if (result.success) {
          setRepoList((prev) => prev.filter((repo) => repo.id !== repoId));
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete repository");
        console.error("Delete error:", error);
      }
    });
  };

  if (repoList.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <GitBranch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No Published Repositories
            </h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t published any repositories yet. Start by going to
              the home page and publishing your first repository.
            </p>
            <Button asChild>
              <Link href="/">Publish a Repository</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Published Repositories</h2>
        <Badge variant="outline" className="text-sm">
          {repoList.length}{" "}
          {repoList.length === 1 ? "repository" : "repositories"}
        </Badge>
      </div>

      {isPending && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Processing request...</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {repoList.map((repo) => (
          <RepoCard key={repo.id} repo={repo} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
