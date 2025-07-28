# CRITICAL: Required Environment Variables for Vercel

## You MUST set these in Vercel Dashboard → Settings → Environment Variables

### Supabase (REQUIRED - App won't work without these)
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
SUPABASE_DB_PASSWORD=
```

### Stripe (Required for payments)
```
STRIPE_SECRET_KEY=
PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Email (Required for notifications)
```
RESEND_API_KEY=
```

### Turnstile (Required for auth)
```
PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### App URL (Required)
```
PUBLIC_APP_URL=https://your-app.vercel.app
```

### Optional but recommended
```
PUBLIC_SENTRY_DSN=
```

## IMPORTANT: Copy values from your local .env file!
The values should match what you have in your local `.env` file.