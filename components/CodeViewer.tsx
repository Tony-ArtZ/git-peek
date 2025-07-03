"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubFile } from "@/actions/getRepoData";
import { FileCode, Download, Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeViewerProps {
  file: GitHubFile;
  content: string;
}

export default function CodeViewer({ file, content }: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      go: "go",
      rs: "rust",
      php: "php",
      rb: "ruby",
      sh: "bash",
      yml: "yaml",
      yaml: "yaml",
      json: "json",
      xml: "xml",
      html: "html",
      css: "css",
      scss: "scss",
      md: "markdown",
      sql: "sql",
    };
    return languageMap[ext || ""] || "text";
  };

  const isImage = (filename: string): boolean => {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext || "");
  };

  const isBinary = (content: string): boolean => {
    // Simple heuristic to detect binary files
    return /[\x00-\x08\x0E-\x1F\x7F]/.test(content);
  };

  const lines = content.split("\n");
  const language = getLanguage(file.name);

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            <CardTitle className="text-lg">{file.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {language}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-1"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
            {file.download_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center gap-1"
              >
                <a
                  href={file.download_url}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {lines.length} lines • {formatFileSize(content.length)}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-0">
        <div className="relative h-full">
          {isImage(file.name) && file.download_url ? (
            <div className="flex items-center justify-center h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.download_url}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded border"
              />
            </div>
          ) : isBinary(content) ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <FileCode className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Binary file cannot be displayed</p>
                <p className="text-sm">
                  Use the download button to view this file
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto max-h-[calc(100vh-250px)]">
              <div className="bg-muted/50 rounded border">
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className={`language-${language}`}>
                    {lines.map((line, index) => (
                      <div key={index} className="flex">
                        <span className="select-none text-muted-foreground mr-4 text-right w-8 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="flex-1">{line || " "}</span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
