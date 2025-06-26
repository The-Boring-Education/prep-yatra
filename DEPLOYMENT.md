# Deployment Guide

## Environment Variables

### Local Development

-   Use `.env.local` for local development
-   Use `.env.production` for production builds

### Netlify Deployment

**IMPORTANT**: Never commit sensitive environment variables to your repository!

1. **Set Environment Variables in Netlify Dashboard**:

    - Go to your Netlify site dashboard
    - Navigate to **Site settings** → **Environment variables**
    - Add the following variables:
        ```
        VITE_SUPABASE_URL = https://mnpxxxoffgqznwzihnwu.supabase.co
        VITE_SUPABASE_ANON_KEY = your_supabase_anon_key_here
        VITE_TBE_WEBAPP_API_URL = https://www.theboringeducation.com
        ```

2. **Why This Approach**:
    - ✅ Environment variables are encrypted and secure
    - ✅ Different values for different environments
    - ✅ No sensitive data in your code repository
    - ✅ Easy to update without code changes

## Testing Build Locally

Before deploying, test your production build locally:

```bash
# Test the production build
npm run test-build

# Or manually
npm run build
```

This will:

-   Check if `.env.production` exists
-   Run the production build
-   Verify the build output

## Build Process

1. **Netlify automatically**:

    - Installs dependencies with `npm install`
    - Runs `npm run build` (from netlify.toml)
    - Serves files from `dist` directory

2. **Environment Variables**:
    - Netlify uses the variables set in the dashboard
    - These override any values in `.env` files during build

## Troubleshooting

### Build Fails

1. Check if all environment variables are set in Netlify dashboard
2. Test build locally with `npm run test-build`
3. Check build logs in Netlify dashboard

### Environment Variables Not Working

1. Ensure variable names start with `VITE_`
2. Redeploy after adding/changing environment variables
3. Check variable names match exactly (case-sensitive)

### Routing Issues

-   The `_redirects` file handles client-side routing
-   All routes redirect to `index.html` for SPA behavior
