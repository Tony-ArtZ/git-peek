"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale } from "lucide-react";

interface LicenseViewerProps {
  content: string;
}

export default function LicenseViewer({ content }: LicenseViewerProps) {
  const renderLicense = (licenseText: string): string => {
    return (
      licenseText
        // Headers (for licenses with markdown headers)
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
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        // Copyright notices - highlight them
        .replace(
          /Copyright \(c\) ([^\n]+)/gi,
          '<div class="bg-muted p-2 rounded border-l-4 border-primary my-2"><strong>Copyright © $1</strong></div>'
        )
        // License name detection and highlighting
        .replace(
          /^(MIT License|Apache License|GPL|BSD|ISC License|Mozilla Public License).*$/gim,
          '<div class="text-lg font-bold text-primary mb-4 p-3 bg-primary/10 rounded border">$1</div>'
        )
        // Preserve line breaks and spacing
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, "<br>")
        // Wrap in paragraphs
        .replace(/^(.)/gm, '<p class="mb-4">$1')
        .replace(/(.*)$/gm, "$1</p>")
        // Clean up multiple paragraph tags
        .replace(/<\/p><p class="mb-4"><\/p>/g, '</p><p class="mb-4">')
        .replace(/<p class="mb-4"><\/p>/g, "")
    );
  };

  // Detect license type from content
  const detectLicenseType = (content: string): string => {
    const upperContent = content.toUpperCase();
    if (upperContent.includes("MIT LICENSE")) return "MIT License";
    if (upperContent.includes("APACHE LICENSE")) return "Apache License 2.0";
    if (upperContent.includes("GNU GENERAL PUBLIC LICENSE"))
      return "GPL License";
    if (upperContent.includes("BSD LICENSE")) return "BSD License";
    if (upperContent.includes("ISC LICENSE")) return "ISC License";
    if (upperContent.includes("MOZILLA PUBLIC LICENSE"))
      return "Mozilla Public License";
    return "License";
  };

  const licenseType = detectLicenseType(content);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Scale className="w-5 h-5" />
          {licenseType}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div
            className="text-sm leading-relaxed font-mono"
            dangerouslySetInnerHTML={{
              __html: renderLicense(content),
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
