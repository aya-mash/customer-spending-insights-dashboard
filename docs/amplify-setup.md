# AWS Amplify Deployment Setup

This guide walks you through deploying the Customer Spending Insights Dashboard to AWS Amplify.

## Prerequisites

- AWS Account ([Create one here](https://aws.amazon.com/free/))
- GitHub repository with your code
- Admin access to connect AWS Amplify to your repository

## Step-by-Step Setup

### 1. Access AWS Amplify Console

1. Sign in to your [AWS Console](https://console.aws.amazon.com/)
2. Navigate to **AWS Amplify** service (search for "Amplify" in the services search)
3. Click **"New app"** → **"Host web app"**

### 2. Connect Your Repository

1. **Choose your Git provider**: Select GitHub (or GitLab/Bitbucket if applicable)
2. **Authorize AWS Amplify**: Grant permissions to access your repositories
3. **Select repository**: Choose `customer-spending-insights-dashboard`
4. **Select branch**: 
   - For production: Select `main`
   - For staging: Select `develop`

### 3. Configure Build Settings

Amplify will automatically detect the `amplify.yml` file in your repository root. The configuration looks like this:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install --frozen-lockfile
    build:
      commands:
        - yarn build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Review and confirm** these settings. You usually don't need to modify anything.

### 4. Configure Advanced Settings (Optional)

#### Environment Variables
If your app needs environment variables, add them in the "Advanced settings" section:

- `NODE_ENV`: `production` (usually set automatically)
- `VITE_API_BASE_URL`: Your API endpoint (if applicable)
- Add any other custom environment variables your app requires

**Note**: Environment variables starting with `VITE_` are exposed to the client-side code.

#### Build Settings
- **App name**: Give your app a meaningful name (e.g., "Spending Dashboard - Production")
- **Environment name**: Default is fine, or customize (e.g., "production", "staging")

### 5. Deploy!

1. Click **"Save and deploy"**
2. Amplify will:
   - Clone your repository
   - Install dependencies
   - Build your app
   - Deploy to a global CDN
   - Provide a preview URL (e.g., `https://main.d123abc456.amplifyapp.com`)

First deployment typically takes 3-5 minutes.

### 6. Set Up Branch-Based Deployments (Optional)

To enable automatic deployments for multiple branches:

1. In Amplify Console, click **"App settings"** → **"Branch Management"**
2. Click **"Connect branch"**
3. Select your branch (e.g., `develop` for staging)
4. Configure branch-specific settings if needed
5. Save

Now you have:
- `main` branch → Production URL
- `develop` branch → Staging URL
- Pull requests → Automatic preview deployments

### 7. Custom Domain Setup (Optional)

1. In Amplify Console, go to **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name (e.g., `dashboard.example.com`)
4. Amplify will guide you through DNS configuration
5. Wait for SSL certificate provisioning (automatic, takes ~15 minutes)

Amplify automatically:
- Provisions SSL/TLS certificates (via AWS Certificate Manager)
- Redirects HTTP → HTTPS
- Handles www/apex domain redirects

## Continuous Deployment

Once set up, deployments are fully automatic:

- **Push to `main`** → Production deployment starts automatically
- **Push to `develop`** → Staging deployment starts automatically
- **Open a Pull Request** → Preview deployment created automatically
- **Merge PR** → Preview deleted, target branch deployed

### Monitoring Deployments

Track deployments in the Amplify Console:
- Real-time build logs
- Build duration and status
- Deployment history
- Rollback to previous versions if needed

## Performance Features (Included Automatically)

AWS Amplify provides out-of-the-box:

✅ **Global CDN** - Fast content delivery worldwide  
✅ **Automatic SSL/TLS** - Secure HTTPS by default  
✅ **HTTP/2** - Faster page loads  
✅ **Compression** - Gzip/Brotli compression  
✅ **Cache optimization** - Smart caching for static assets  
✅ **Atomic deployments** - No downtime during deployments  
✅ **Instant rollbacks** - Revert to previous version in seconds  

## Troubleshooting

### Build Fails

**Check build logs** in Amplify Console for errors. Common issues:

- **Missing dependencies**: Ensure `package.json` is up to date
- **Build command fails**: Verify `yarn build` works locally
- **Environment variables**: Check if required env vars are set

### App Doesn't Load

- **Check browser console** for errors
- **Verify base path**: Ensure `base` in `vite.config.ts` matches deployment path
- **API connectivity**: Verify `VITE_API_BASE_URL` is correct

### Need to Redeploy

In Amplify Console:
1. Go to your app
2. Click the branch you want to redeploy
3. Click **"Redeploy this version"**

## Cost Estimation

AWS Amplify pricing (as of 2025):

- **Build minutes**: First 1,000 minutes/month free, then $0.01/minute
- **Hosting**: First 15 GB served free, then $0.15/GB
- **Storage**: First 5 GB free, then $0.023/GB/month

**Typical monthly cost for this project**: $0-5 (within free tier for most use cases)

[AWS Amplify Pricing Details](https://aws.amazon.com/amplify/pricing/)

## Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/react/)
- [Amplify Console Guide](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Custom Domain Setup](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html)
- [Environment Variables](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)

## Support

For issues or questions:
- Check [AWS Amplify Forums](https://github.com/aws-amplify/amplify-hosting/discussions)
- Review deployment logs in Amplify Console
- Contact repository maintainer: @aya-mash
