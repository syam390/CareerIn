# LinkedIn-like Full Starter (Next.js + Supabase)

This starter implements a LinkedIn-like MVP:
- Supabase Auth (magic link)
- Profiles (public and editable)
- Posts, Comments, Likes
- Jobs (post/list/detail) and Applications
- Client-side file upload hooks prepared for Supabase Storage

## Quickstart

1. Create a Supabase project.
2. In Supabase: Settings -> API -> copy Project URL and Anon Key.
3. In Supabase SQL Editor, paste and run `supabase/schema.sql` from this repo.
4. Copy `.env.example` to `.env.local` and set your Supabase env vars.
5. `npm install` then `npm run dev` to run locally.
6. Deploy to Vercel and add the same env vars in Project Settings.

Notes:
- RLS policies are included. Use the anon key in the frontend only.
- For file uploads, create storage buckets and set policies as needed.
