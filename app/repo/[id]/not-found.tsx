import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">Repository Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          The repository you&apos;re looking for doesn&apos;t exist or may have
          been removed.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
