import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
  repoName: string;
}

export default function Breadcrumb({
  path,
  onNavigate,
  repoName,
}: BreadcrumbProps) {
  const segments = path.split("/").filter(Boolean);

  return (
    <div className="flex items-center gap-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 hover:bg-muted"
        onClick={() => onNavigate("")}
      >
        <Home className="w-4 h-4" />
        <span className="ml-1">{repoName}</span>
      </Button>

      {segments.map((segment, index) => {
        const segmentPath = segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <div key={segmentPath} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 ${
                isLast
                  ? "text-foreground font-medium cursor-default"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => !isLast && onNavigate(segmentPath)}
              disabled={isLast}
            >
              {segment}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
