import { Suspense } from "react";
import { auth } from "@/auth";
import { getUserPublishedRepos } from "@/actions/userRepo";
import Navbar from "@/components/Navbar";
import PublishedReposList from "./components/PublishedReposList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

async function DashboardContent() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const publishedRepos = await getUserPublishedRepos();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Manage your published repositories and track their performance.
        </p>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published Repositories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedRepos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                publishedRepos.filter((repo) => {
                  if (!repo.createdAt) return false;
                  const thisMonth = new Date();
                  thisMonth.setMonth(thisMonth.getMonth());
                  return (
                    new Date(repo.createdAt) >=
                    new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1)
                  );
                }).length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Coming Soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Published Repos List */}
      <PublishedReposList repos={publishedRepos} />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Loading your published repositories...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading repositories...</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-background">
      <Navbar session={session} />

      {/* Background gradient similar to main page */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] dark:[mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,black,transparent)] [mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,white,transparent)]" />

        <div className="relative">
          <Suspense fallback={<LoadingFallback />}>
            <DashboardContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
