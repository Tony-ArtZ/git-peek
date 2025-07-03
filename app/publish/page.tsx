"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { publishRepo } from "@/actions/publishRepo";
import { Button } from "@/components/ui/button";
import {
  Copy,
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

function PublishPageContent() {
  const searchParams = useSearchParams();
  const repoId = searchParams.get("id");

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedData, setPublishedData] = useState<{ id: string } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePublish = useCallback(async () => {
    if (!repoId) {
      setError("No repository ID provided");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      const result = await publishRepo(repoId);
      setPublishedData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish repository"
      );
    } finally {
      setIsPublishing(false);
    }
  }, [repoId]);

  useEffect(() => {
    if (repoId && !publishedData && !error) {
      handlePublish();
    }
  }, [repoId, publishedData, error, handlePublish]);

  const shareUrl = publishedData
    ? `${window.location.origin}/repo/${publishedData.id}`
    : null;

  const copyToClipboard = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy to clipboard:", err);
      }
    }
  };

  if (!repoId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Request</h1>
          <p className="text-muted-foreground mb-4">
            No repository ID provided
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-24">
        <div className="text-center">
          {isPublishing && (
            <>
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-3xl font-bold mb-2">Publishing Repository</h1>
              <p className="text-muted-foreground">
                Creating your shareable link...
              </p>
            </>
          )}

          {error && (
            <>
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Publishing Failed</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-x-4">
                <Button onClick={handlePublish} disabled={isPublishing}>
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline">Go Home</Button>
                </Link>
              </div>
            </>
          )}

          {publishedData && shareUrl && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Repository Published!</h1>
              <p className="text-muted-foreground mb-8">
                Your repository is now available for sharing
              </p>

              <div className="bg-muted/50 border border-border rounded-lg p-6 mb-6">
                <label className="block text-sm font-medium mb-2">
                  Shareable Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono text-left">
                    {shareUrl}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={copied ? "text-green-600" : ""}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={shareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-x-4">
                <Button asChild>
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    View Published Repo
                  </a>
                </Button>
                <Link href="/">
                  <Button variant="outline">Publish Another</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PublishPageFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
    </div>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<PublishPageFallback />}>
      <PublishPageContent />
    </Suspense>
  );
}
