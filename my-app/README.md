This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Setup (Supabase)

This project uses [Supabase](https://supabase.com) as the PostgreSQL database.

### Quick Setup

1. **Create a Supabase account** at [supabase.com](https://supabase.com)
2. **Create a new project** and save your database password
3. **Get your credentials** from Settings → API
4. **Create `.env.local`** in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
5. **Run the app**: `npm run dev`

### Using Supabase Client

The project includes a configured Supabase client at `src/lib/supabase.ts`:

```typescript
import { supabase } from "@/lib/supabase";

// Query data
const { data, error } = await supabase.from("users").select("*");
```

For detailed examples and usage, see [SUPABASE_CLIENT_GUIDE.md](./SUPABASE_CLIENT_GUIDE.md).

### Environment Variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

See `.env.local.example` for a template.

### Testing Connection

Test your Supabase connection:

```bash
# Open in browser
http://localhost:3000/api/test-supabase
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
