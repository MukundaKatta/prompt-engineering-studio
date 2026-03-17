# Prompt Engineering Studio

A collaborative prompt engineering platform built with Next.js 14, designed for developers who work with AI models daily.

## Features

- **Prompt Editor** — Monaco-powered editor with syntax highlighting, variable interpolation (`{{var}}`), and Cmd+Enter to run
- **Multi-Model Support** — Claude, GPT-4o, Gemini with real-time pricing and token tracking
- **Model Comparison** — Run prompts across 2-4 models side by side
- **Version History** — Track prompt changes with timeline view and diff viewer
- **Auto-Evaluation** — Score outputs on relevance, coherence, accuracy, and creativity
- **Template Marketplace** — Browse and use community prompt templates
- **Dark Theme** — Developer-focused UI with gray-900 background and indigo-500 accents

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Monaco Editor
- **Database**: Supabase (PostgreSQL)
- **AI Providers**: Anthropic, OpenAI, Google Gemini
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local, then:
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the studio.

## API Keys

Configure API keys in **Settings** or via environment variables:

| Provider  | Environment Variable | Settings UI |
|-----------|---------------------|-------------|
| Anthropic | `ANTHROPIC_API_KEY` | Yes         |
| OpenAI    | `OPENAI_API_KEY`    | Yes         |
| Gemini    | `GEMINI_API_KEY`    | Yes         |

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration: `supabase db push` or manually execute `supabase/migrations/001_initial.sql`
3. Add your Supabase URL and anon key to `.env.local`

## Project Structure

```
src/
  app/              # Next.js App Router pages
    api/            # API routes (run, models, evaluate)
    editor/         # Prompt editor page
    compare/        # Model comparison page
    history/        # Version history page
    templates/      # Template marketplace
    settings/       # API key configuration
  components/       # React components
  hooks/            # Custom React hooks
  lib/              # Utilities, AI providers, evaluator
  types/            # TypeScript type definitions
supabase/
  migrations/       # Database migrations
```

## License

Copyright (c) 2026 Officethree Technologies Private Limited. All Rights Reserved.
