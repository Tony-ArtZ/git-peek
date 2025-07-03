"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubFile } from "@/actions/getRepoData";
import {
  Folder,
  File,
  FileText,
  FileCode,
  FileImage,
  Archive,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Breadcrumb from "./Breadcrumb";

interface FileExplorerProps {
  files: GitHubFile[];
  onFileSelect: (file: GitHubFile) => void;
  onDirectorySelect: (path: string) => void;
  currentPath: string;
  selectedFile?: GitHubFile;
  repoName: string;
}

export default function FileExplorer({
  files,
  onFileSelect,
  onDirectorySelect,
  currentPath,
  selectedFile,
  repoName,
}: FileExplorerProps) {
  const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

  const toggleDirectory = (dirPath: string) => {
    const newExpanded = new Set(expandedDirs);
    if (newExpanded.has(dirPath)) {
      newExpanded.delete(dirPath);
    } else {
      newExpanded.add(dirPath);
      onDirectorySelect(dirPath);
    }
    setExpandedDirs(newExpanded);
  };

  const getFileIcon = (file: GitHubFile) => {
    if (file.type === "dir") {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const iconClass = "w-4 h-4";

    switch (ext) {
      case "md":
      case "txt":
      case "rst":
        return <FileText className={cn(iconClass, "text-blue-600")} />;
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
      case "py":
      case "java":
      case "cpp":
      case "c":
      case "cs":
      case "go":
      case "rs":
      case "php":
      case "rb":
        return <FileCode className={cn(iconClass, "text-green-600")} />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
      case "webp":
        return <FileImage className={cn(iconClass, "text-purple-600")} />;
      case "zip":
      case "tar":
      case "gz":
      case "rar":
        return <Archive className={cn(iconClass, "text-orange-600")} />;
      default:
        return <File className={cn(iconClass, "text-gray-500")} />;
    }
  };

  const pathSegments = currentPath.split("/").filter(Boolean);

  return (
    <Card className="w-full h-full  ">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Files
        </CardTitle>
        {/* Breadcrumb */}
        <div className="w-full overflow-hidden">
          {currentPath && (
            <Breadcrumb
              path={currentPath}
              onNavigate={onDirectorySelect}
              repoName={repoName}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-auto">
          {/* Show parent directory option if not at root */}
          {currentPath && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-xs"
              onClick={() => {
                const parentPath = pathSegments.slice(0, -1).join("/");
                onDirectorySelect(parentPath);
              }}
            >
              <Folder className="w-4 h-4 mr-2 text-gray-400" />
              ..
            </Button>
          )}

          {files
            .sort((a, b) => {
              // Directories first, then files
              if (a.type !== b.type) {
                return a.type === "dir" ? -1 : 1;
              }
              return a.name.localeCompare(b.name);
            })
            .map((file) => (
              <div key={file.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start h-8 text-xs",
                    selectedFile?.path === file.path && "bg-muted"
                  )}
                  onClick={() => {
                    if (file.type === "dir") {
                      toggleDirectory(file.path);
                    } else {
                      onFileSelect(file);
                    }
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.type === "dir" && (
                      <span className="flex-shrink-0">
                        {expandedDirs.has(file.path) ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronRight className="w-3 h-3" />
                        )}
                      </span>
                    )}
                    <span className="flex-shrink-0 mr-1">
                      {getFileIcon(file)}
                    </span>
                    <span className="truncate max-w-[180px]">{file.name}</span>
                    {file.type === "file" && file.size && (
                      <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">
                        {formatFileSize(file.size)}
                      </span>
                    )}
                  </div>
                </Button>
              </div>
            ))}
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
