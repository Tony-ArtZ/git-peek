import { notFound } from "next/navigation";
import db from "@/db";
import { redirects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getRepoData } from "@/actions/getRepoData";
import { incrementRepoView } from "@/actions/viewRepo";
import RepositoryViewer from "@/components/RepositoryViewer";
import Navbar from "@/components/Navbar";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface RepoPageProps {
  params: {
    id: string;
  };
}

async function getRedirectData(id: string) {
  try {
    const result = await db
      .select()
      .from(redirects)
      .where(eq(redirects.id, id))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.error("Error fetching redirect data:", error);
    return null;
  }
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { id } = await params;
  const session = await auth();
  const redirectData = await getRedirectData(id);

  if (!redirectData) {
    notFound();
  }

  // Fetch repository data using the server action
  const repoData = await getRepoData(id);

  if (!repoData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar session={session} />
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Repository Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The repository you&apos;re looking for could not be loaded. This
              might be due to:
            </p>
            <ul className="text-left text-muted-foreground mb-6 space-y-2 max-w-md mx-auto">
              <li>• The repository has been deleted or made private</li>
              <li>• The owner has revoked access</li>
              <li>• There&apos;s a temporary issue with GitHub&apos;s API</li>
            </ul>
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Track the view
  await incrementRepoView(id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar session={session} />
      <RepositoryViewer repoData={repoData} repoId={id} />
    </div>
  );
}
