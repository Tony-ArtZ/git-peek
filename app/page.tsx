import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import RepoPublisher from "@/components/RepoPublisher";
import { getUserRepos } from "@/actions/getRepo";
import {
  Lock,
  Shield,
  Zap,
  Github,
  GitBranch,
  ExternalLink,
  Star,
} from "lucide-react";

export default async function Home() {
  const session = await auth();

  // Fetch repos if user is authenticated
  const repos = session ? await getUserRepos() : [];

  return (
    <main className="min-h-screen bg-background">
      <Navbar session={session} />

      {/* Hero  */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />

        {/* Grid */}
        <div className="absolute inset-0 dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:32px_32px] dark:[mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,black,transparent)] [mask-image:radial-gradient(ellipse_800px_600px_at_50%_0%,white,transparent)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Main */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent flex items-center justify-center gap-4">
                <GitBranch className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary" />
                Git Peek
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Share your private repositories without going public
            </p>

            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Keep your code private while still sharing it with collaborators,
              clients, or the community. GitPeek lets you showcase your work
              without compromising your repository&apos;s privacy.
            </p>

            {/* Main Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                <RepoPublisher repos={repos} />
              ) : (
                <form
                  action={async () => {
                    "use server";
                    await signIn("github");
                  }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    Sign In with GitHub
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Built for Developers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your development workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Private Sharing</h3>
              <p className="text-muted-foreground">
                Share your private repositories with specific people without
                making them public on GitHub.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Controlled Access</h3>
              <p className="text-muted-foreground">
                Maintain full control over who can view your code while
                showcasing your work professionally.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
              <p className="text-muted-foreground">
                Connect with GitHub seamlessly and start sharing your private
                repositories in seconds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Repository Section */}
      <div className="py-24 bg-gradient-to-b from-background to-primary/5 border-t border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-12 bg-primary/30"></div>
              <GitBranch className="w-8 h-8 text-primary mx-4" />
              <div className="h-px w-12 bg-primary/30"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Open Source Project
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              GitPeek is completely open source and free to use. We believe in
              the power of community collaboration. Star the repository to show
              your support and stay updated!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
              <a
                href="https://github.com/Tony-ArtZ/git-peek"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 border border-border bg-card rounded-lg hover:bg-card/80 transition-colors"
              >
                <Github className="w-6 h-6" />
                <span className="text-lg">View on GitHub</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>

              <a
                href="https://github.com/Tony-ArtZ/git-peek/stargazers"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Star className="w-6 h-6" />
                <span className="text-lg">Star the Project</span>
              </a>
            </div>

            {/* GitHub Stars Count - You could add actual count using GitHub API */}
            <div className="flex items-center gap-2 mt-6 text-muted-foreground">
              <Star className="w-5 h-5 fill-primary stroke-none" />
              <span>Your star helps this project grow and improve!</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
