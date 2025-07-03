import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LoadingCardProps {
  message?: string;
  className?: string;
}

export default function LoadingCard({
  message = "Loading...",
  className = "h-full",
}: LoadingCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
