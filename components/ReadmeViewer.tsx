"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ReadmeViewerProps {
  content: string;
  repoUrl?: string; // GitHub repository URL for resolving relative links
  branch?: string; // Repository branch, defaults to main/master
}

export default function ReadmeViewer({
  content,
  repoUrl,
  branch = "main",
}: ReadmeViewerProps) {
  const resolveUrl = (url: string): string => {
    if (
      !repoUrl ||
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("//")
    ) {
      return url;
    }
    const cleanUrl = url.startsWith("/") ? url.slice(1) : url;

    const rawBaseUrl = repoUrl.replace(
      "github.com",
      "raw.githubusercontent.com"
    );
    return `${rawBaseUrl}/${branch}/${cleanUrl}`;
  };

  const renderMarkdown = (markdown: string): string => {
    return (
      markdown
        // Headers
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>'
        )
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        // Strikethrough
        .replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')
        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-muted p-3 rounded border overflow-x-auto my-3"><code>$1</code></pre>'
        )
        // Inline code
        .replace(
          /`(.*?)`/g,
          '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
        )
        // Images
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
          const resolvedSrc = resolveUrl(src);
          const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);

          if (isVideo) {
            return `<video controls class="max-w-full h-auto rounded border my-3" preload="metadata">
                <source src="${resolvedSrc}" type="video/${src
              .split(".")
              .pop()
              ?.toLowerCase()}">
                Your browser does not support the video tag.
              </video>`;
          }

          return `<img src="${resolvedSrc}" alt="${alt}" class="max-w-full h-auto rounded border my-3" loading="lazy" onerror="this.style.display='none'" />`;
        })
        // Unordered lists
        .replace(/^\* (.*)$/gim, '<li class="ml-4">$1</li>')
        .replace(
          /(<li class="ml-4">.*<\/li>\s*)+/g,
          '<ul class="list-disc list-inside my-2 space-y-1">$&</ul>'
        )
        // Ordered lists
        .replace(/^\d+\. (.*)$/gim, '<li class="ml-4">$1</li>')
        // Blockquotes
        .replace(
          /^> (.*)$/gim,
          '<blockquote class="border-l-4 border-muted pl-4 italic my-3">$1</blockquote>'
        )
        // Horizontal rules
        .replace(/^---$/gim, '<hr class="border-t border-muted my-4" />')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
          const resolvedHref = resolveUrl(href);
          const isExternal =
            resolvedHref.startsWith("http") &&
            !resolvedHref.includes("github.com");
          const target = isExternal
            ? ' target="_blank" rel="noopener noreferrer"'
            : "";
          return `<a href="${resolvedHref}" class="text-primary hover:underline"${target}>${text}</a>`;
        })
        // Line breaks
        .replace(/\n/g, "<br>")
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          README
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(content),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
