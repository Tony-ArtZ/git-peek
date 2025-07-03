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
    <div className="flex items-center gap-1 text-sm overflow-x-auto whitespace-nowrap pb-2 [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/40 scroll-smooth">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 hover:bg-muted flex-shrink-0"
        onClick={() => onNavigate("")}
      >
        <Home className="w-4 h-4" />
        <span className="ml-1">{repoName}</span>
      </Button>

      {segments.map((segment, index) => {
        const segmentPath = segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <div key={segmentPath} className="flex items-center flex-shrink-0">
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 flex-shrink-0 max-w-[150px] ${
                isLast
                  ? "text-foreground font-medium cursor-default"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              onClick={() => !isLast && onNavigate(segmentPath)}
              disabled={isLast}
            >
              <span className="truncate">{segment}</span>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
