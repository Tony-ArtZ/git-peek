"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface ReadmeViewerProps {
  content: string;
  repoUrl?: string; // GitHub repository URL for resolving relative links
  branch?: string; // Repository branch, defaults to main/master
  repoId?: string; // Repository ID for fetching private repo assets
}

interface ParsedImage {
  id: string;
  alt: string;
  src: string;
  isVideo: boolean;
}

interface AsyncImageProps {
  imageInfo: ParsedImage;
  repoId?: string;
  repoUrl?: string;
  branch?: string;
}

function AsyncImage({ imageInfo, repoId, repoUrl, branch }: AsyncImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      setError(false);

      if (
        imageInfo.src.startsWith("http://") ||
        imageInfo.src.startsWith("https://") ||
        imageInfo.src.startsWith("//")
      ) {
        setImageSrc(imageInfo.src);
        setLoading(false);
        return;
      }

      if (repoId) {
        try {
          const response = await fetch(
            `/api/image?repoId=${encodeURIComponent(
              repoId
            )}&path=${encodeURIComponent(imageInfo.src)}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.imageData) {
              setImageSrc(data.imageData);
              setLoading(false);
              return;
            }
          }
        } catch {
          console.error("Error fetching image from API:", imageInfo.src);
          setError(true);
          setLoading(false);
          return;
        }
      }

      if (repoUrl) {
        const cleanUrl = imageInfo.src.startsWith("/")
          ? imageInfo.src.slice(1)
          : imageInfo.src;
        const rawBaseUrl = repoUrl.replace(
          "github.com",
          "raw.githubusercontent.com"
        );
        setImageSrc(`${rawBaseUrl}/${branch || "main"}/${cleanUrl}`);
      } else {
        setImageSrc(imageInfo.src);
      }

      setLoading(false);
    };

    loadImage();
  }, [imageInfo.src, repoId, repoUrl, branch]);

  if (loading) {
    return (
      <div className="max-w-full h-20 rounded border my-3 bg-muted animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Loading image...</span>
      </div>
    );
  }

  if (error || !imageSrc) {
    return (
      <div className="max-w-full h-20 rounded border my-3 bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-sm">
          Failed to load image
        </span>
      </div>
    );
  }

  if (imageInfo.isVideo) {
    return (
      <video
        controls
        className="max-w-full h-auto rounded border my-3"
        preload="metadata"
        onError={() => setError(true)}
      >
        <source
          src={imageSrc}
          type={`video/${imageInfo.src.split(".").pop()?.toLowerCase()}`}
        />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={imageInfo.alt}
      className="max-w-full h-auto rounded border my-3"
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

export default function ReadmeViewer({
  content,
  repoUrl,
  branch = "main",
  repoId,
}: ReadmeViewerProps) {
  const [parsedContent, setParsedContent] = useState<{
    html: string;
    images: ParsedImage[];
  }>({ html: "", images: [] });

  useEffect(() => {
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

    const images: ParsedImage[] = [];

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
          .replace(
            /\*\*(.*?)\*\*/g,
            '<strong class="font-semibold">$1</strong>'
          )
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
          // Images - extract and create placeholders
          .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
            const imageId = `image-${images.length}`;
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(src);

            images.push({
              id: imageId,
              alt,
              src,
              isVideo,
            });

            return `<div data-image-placeholder="${imageId}" class="my-3"></div>`;
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

    const html = renderMarkdown(content);
    setParsedContent({ html, images });
  }, [content, repoUrl, branch]);

  const renderContentWithImages = () => {
    const { html, images } = parsedContent;

    const parts = html.split(
      /(<div data-image-placeholder="[^"]*" class="my-3"><\/div>)/
    );

    return parts.map((part, index) => {
      const placeholderMatch = part.match(/data-image-placeholder="([^"]*)"/);

      if (placeholderMatch) {
        const imageId = placeholderMatch[1];
        const imageInfo = images.find((img) => img.id === imageId);

        if (imageInfo) {
          return (
            <AsyncImage
              key={imageId}
              imageInfo={imageInfo}
              repoId={repoId}
              repoUrl={repoUrl}
              branch={branch}
            />
          );
        }
      }

      return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
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
          <div className="text-sm leading-relaxed">
            {renderContentWithImages()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
