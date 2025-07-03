"use client";

import { GitBranch, Github, Heart, Star } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <Link href="/" className="flex items-center space-x-2">
                <GitBranch className="w-6 h-6 text-primary" />
                <span className="font-semibold text-xl">GitPeek</span>
              </Link>

              <p className="text-sm text-muted-foreground max-w-md">
                Share private GitHub repositories without compromising access
                control.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Tony-ArtZ/git-peek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>

              <a
                href="https://github.com/Tony-ArtZ/git-peek/stargazers"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <Star className="w-5 h-5" />
                <span>Star</span>
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for developers</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-6 border-t border-border flex text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GitPeek. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
