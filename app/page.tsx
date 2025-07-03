import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { signIn } from "@/auth";
import RepoPublisher from "@/components/RepoPublisher";
import { getUserRepos } from "@/actions/getRepo";
import { Lock, Shield, Zap, Github, GitBranch } from "lucide-react";

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

      {/* Tech Stack Highlight */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-8 text-muted-foreground">
            Built with Modern Technologies
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "Drizzle ORM",
            ].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 border border-border rounded-lg bg-card/50"
              >
                <span className="text-sm font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
