import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Session } from "next-auth";
import { signIn, signOut } from "@/auth";
import { GitBranch } from "lucide-react";

type NavbarProps = {
  session: Session | null;
};

const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <GitBranch className=" aspect-square text-primary" />
                {/* <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center"></div> */}
                <h1 className="text-xl font-bold tracking-tight">Git-Peek</h1>
              </div>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {session ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard">
                  <div className="flex items-center space-x-2">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-muted-foreground font-medium text-sm">
                          {session.user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    {session.user?.name && (
                      <span className="text-sm font-medium hidden sm:block">
                        {session.user.name}
                      </span>
                    )}
                  </div>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut();
                  }}
                >
                  <Button variant="outline" type="submit" size="sm">
                    Sign Out
                  </Button>
                </form>
              </div>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                <Button type="submit" size="default">
                  Sign In with GitHub
                </Button>
              </form>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
