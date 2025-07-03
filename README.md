# GitPeek

**The easiest way to share any GitHub repository—public or private—without adding collaborators.**

## Why GitPeek?

Sharing a GitHub repository for interviews, assignments, or portfolio reviews is a pain if your repo is private. You either have to make it public (risking leaks) or add people as collaborators (tedious, slow, and not scalable). GitPeek solves this by letting you generate a secure, public link to any of your repositories—no matter the privacy setting. No more awkward access requests or waiting for invites to be accepted.

**Perfect for:**

- Job interviews and resume links
- Assignment or project submissions
- Showcasing private work to clients or reviewers
- Sharing code with non-GitHub users

## Key Features

- 🔗 **Share Instantly**: Publish any repo (even private) with a single link—no need to add collaborators
- 🔒 **Keep Control**: Your repo stays private on GitHub; only the shared link is public
- 📁 **File Explorer**: Browse the repo structure in a beautiful, modern UI
- 🔐 **Secure**: Uses your GitHub OAuth token, never exposes it to viewers
- ⚡ **No Account Needed to View**: Anyone with the link can view, no sign-in required

## Coming Soon

- [ ] **Analytics**: See how many times your repo link was viewed
- [ ] **Email Invites**: Send repo links directly to email addresses
- [ ] **Access Controls**: Limit who can view your shared repo and revoke access
- [ ] **More integrations**

## Tech Stack

- **Framework**: Next.js
- **Authentication**: Auth.js (NextAuth) with GitHub
- **Database**: Drizzle ORM + PostgreSQL
- **UI**: shadcn/ui, Tailwind CSS, Lucide React

## Getting Started

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/gitpeek.git
   cd gitpeek
   npm install # or yarn/pnpm/bun
   ```
2. **Configure**: Copy `.env.example` to `.env.local` and fill in your GitHub OAuth and database credentials.
3. **Database**: Run migrations with `npm run db:push` (or your package manager's equivalent).
4. **Start**: `npm run dev` and open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign in** with GitHub
2. **Publish** a repository from your dashboard
3. **Share** the generated link—no GitHub account required to view

## License

MIT — see [LICENSE.md](LICENSE.md)

## Contributing

PRs and suggestions are welcome!

## Support

Open an issue on GitHub for help or feature requests.
