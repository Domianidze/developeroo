<img src="./public/logo.svg#gh-light-mode-only" alt="Developeroo" width="72">
<img src="./public/logo-dark.svg#gh-dark-mode-only" alt="Developeroo" width="72">

Developeroo is a GitHub-powered developer portfolio builder.

Sign in with GitHub, generate a portfolio from your profile and repositories, publish it on the Developeroo domain, and soon customize its look and connect your own domain.

## Features

- Generate a developer portfolio from your GitHub profile
- Support for light and dark themes
- Publish your portfolio at a shareable route on the Developeroo domain
- Portfolio customization options (Coming soon)
- More visual styling controls (Coming soon)
- Custom domain support (Coming soon)

## Stack

- Next.js 16
- React 19
- Convex
- Tailwind CSS 4
- Biome

## Project Structure

```text
.
├── convex/                    # Convex auth, schema, queries, and mutations
├── public/                    # Static assets, including logos and preview images
├── scripts/                   # Utility scripts such as Convex environment variable generation
├── src/app/                   # App Router routes and layouts
├── src/components/
│   ├── ui/                    # Reusable shadcn/ui-style primitives
│   ├── tailark/               # Tailark landing page components
│   ├── shared/                # Shared client components used across pages
│   ├── server/                # Server components following the same structure
│   └── [page]/                # Page-specific components
├── src/hooks/                 # Custom React hooks
├── src/lib/                   # Shared utilities and server helpers
└── src/providers/             # App-level providers
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

- `GITHUB_TOKEN` for reading GitHub data

`CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, and `NEXT_PUBLIC_CONVEX_SITE_URL` are set automatically when you run `npx convex dev`.

You will also need these variables in your Convex environment:

- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`
- `ENCRYPTION_KEY`
- `JWKS`
- `JWT_PRIVATE_KEY`
- `SITE_URL`

### 3. Start Convex

```bash
npx convex dev
```

### 4. Generate Convex environment variables

This app needs generated values for `ENCRYPTION_KEY`, `JWKS`, and `JWT_PRIVATE_KEY`.

```bash
npm run generate-encryption-key
npm run generate-jwt-keys
```

Then copy the printed values into your Convex environment variables:

- `ENCRYPTION_KEY` from `npm run generate-encryption-key`
- `JWKS` from `npm run generate-jwt-keys`
- `JWT_PRIVATE_KEY` from `npm run generate-jwt-keys`

You can set them in the Convex dashboard or with the Convex CLI, for example:

```bash
npx convex env set ENCRYPTION_KEY "<value>"
npx convex env set JWKS '<value>'
npx convex env set JWT_PRIVATE_KEY "<value>"
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run format
npm run generate-encryption-key
npm run generate-jwt-keys
```

## Open Source

Issues and pull requests are welcome.

## License

MIT
