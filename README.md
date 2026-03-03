# AI Resume Maker

Welcome to the AI Resume Maker! This Next.js App Router project meets all the V1 requirements: a stunning landing page, a builder page with a form (validated with Zod), integration with OpenRouter to generate ATS-friendly markdown resumes, and saving to Supabase.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup environment variables**:
   Create a `.env` or `.env.local` file by copying `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```

3. **Database Setup**:
   In your Supabase SQL editor, run the following to create the required table:
   ```sql
   create table public.resumes (
     id uuid default gen_random_uuid() primary key,
     full_name text not null,
     email text not null,
     phone text,
     skills text,
     experience text,
     education text,
     projects text,
     generated_markdown text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   
   -- If RLS is enabled, you might need to allow anon inserts:
   -- create policy "Allow public inserts" on public.resumes for insert with check (true);
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## Tech Stack
- Next.js App Router (TypeScript)
- Tailwind CSS
- Zod + React Hook Form
- Framer Motion
- React Markdown
- Supabase Client
