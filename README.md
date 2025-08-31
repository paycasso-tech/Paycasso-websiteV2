# Paycasso-Website Version 2

## Environment Setup

This project requires the following environment variables to be set:

### Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Vercel Configuration (optional)
NEXT_PUBLIC_VERCEL_URL=your_vercel_url_here
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the Project URL and anon/public key
4. Add them to your `.env.local` file

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`
