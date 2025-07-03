"use client";

import { useState } from "react";
import {
  RepoData,
  GitHubFile,
  getFileContent,
  getDirectoryContents,
} from "@/actions/getRepoData";
import RepoHeader from "./RepoHeader";
import FileExplorer from "./FileExplorer";
import CodeViewer from "./CodeViewer";
import ReadmeViewer from "./ReadmeViewer";
import LicenseViewer from "./LicenseViewer";
import ErrorCard from "./ErrorCard";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface RepositoryViewerProps {
  repoData: RepoData;
  repoId: string;
}

export default function RepositoryViewer({
  repoData,
  repoId,
}: RepositoryViewerProps) {
  const [currentFiles, setCurrentFiles] = useState<GitHubFile[]>(
    repoData.files
  );
  const [currentPath, setCurrentPath] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<GitHubFile | undefined>();
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"files" | "readme" | "license">(
    repoData.readme ? "readme" : repoData.license ? "license" : "files"
  );

  const handleDirectorySelect = async (path: string) => {
    setLoading(true);
    setError("");
    try {
      const contents = await getDirectoryContents(repoId, path);
      if (contents) {
        setCurrentFiles(contents);
        setCurrentPath(path);
        setSelectedFile(undefined);
        setFileContent("");
      } else {
        setError("Failed to load directory contents");
      }
    } catch (error) {
      console.error("Error loading directory:", error);
      setError("Failed to load directory contents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: GitHubFile) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setLoading(true);
      setError("");
      try {
        const content = await getFileContent(repoId, file.path);
        setFileContent(content || "Failed to load file content");
        setActiveTab("files");
      } catch (error) {
        console.error("Error loading file:", error);
        setFileContent("Error loading file content");
        setError("Failed to load file content");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Repository Header */}
        <RepoHeader repo={repoData.repo} />

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b">
          <button
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "files"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("files")}
          >
            Files
          </button>
          {repoData.readme && (
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "readme"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("readme")}
            >
              README
            </button>
          )}
          {repoData.license && (
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "license"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab("license")}
            >
              LICENSE
            </button>
          )}
        </div>

        {/* Content */}
        {activeTab === "files" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* File Explorer */}
            <div className="lg:col-span-1">
              <FileExplorer
                files={currentFiles}
                onFileSelect={handleFileSelect}
                onDirectorySelect={handleDirectorySelect}
                currentPath={currentPath}
                selectedFile={selectedFile}
                repoName={repoData.repo.name}
              />
            </div>

            {/* Code Viewer */}
            <div className="lg:col-span-2">
              {loading ? (
                <Card className="h-full flex items-center justify-center">
                  <CardContent>
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">
                        Loading...
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : error ? (
                <ErrorCard
                  title="Failed to load content"
                  message={error}
                  showRetry={true}
                  onRetry={() => {
                    if (selectedFile) {
                      handleFileSelect(selectedFile);
                    } else {
                      handleDirectorySelect(currentPath);
                    }
                  }}
                />
              ) : selectedFile && fileContent ? (
                <CodeViewer file={selectedFile} content={fileContent} />
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center text-muted-foreground">
                    <div className="space-y-2">
                      <p>Select a file to view its contents</p>
                      <p className="text-sm">
                        Navigate through the file tree on the left to explore
                        the repository
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : activeTab === "readme" ? (
          /* README Viewer */
          <div className="max-w-4xl">
            <ReadmeViewer
              content={repoData.readme!}
              repoUrl={repoData.repo.html_url}
              branch={repoData.repo.default_branch}
            />
          </div>
        ) : (
          /* LICENSE Viewer */
          <div className="max-w-4xl">
            <LicenseViewer content={repoData.license!} />
          </div>
        )}
      </div>
    </div>
  );
}
