# Heroku Deployment Guide for DollarsMaster

## Prerequisites

1. **Heroku Account** - Sign up at https://www.heroku.com/
2. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
3. **Git** - For version control
4. **MongoDB Atlas Account** - Free cloud MongoDB at https://www.mongodb.com/cloud/atlas

## Step 1: Prepare Your Code

```bash
# Ensure you're in the project root
cd dollarsmaster

# Make sure everything is committed
git add .
git commit -m "Ready for Heroku deployment"
```

## Step 2: Create Heroku Apps

### Backend App

```bash
# Login to Heroku
heroku login

# Create backend app
heroku create dollarsmaster-api --region us

# Verify creation
heroku apps
```

### Frontend App

```bash
# Create frontend app
heroku create dollarsmaster-web --region us

# Or use Netlify for frontend (recommended)
# See Netlify section below
```

## Step 3: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/database`)
5. Whitelist Heroku IP: `0.0.0.0/0` (for development)

## Step 4: Set Environment Variables

```bash
# Get your Deriv API credentials from https://app.deriv.com/settings/api
# Then set them on Heroku:

heroku config:set DERIV_API_KEY=your_api_key --app=dollarsmaster-api
heroku config:set DERIV_APP_ID=your_app_id --app=dollarsmaster-api
heroku config:set JWT_SECRET=your-super-secret-key --app=dollarsmaster-api
heroku config:set DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/dollarsmaster --app=dollarsmaster-api
heroku config:set NODE_ENV=production --app=dollarsmaster-api
heroku config:set FRONTEND_URL=https://your-frontend-url.com --app=dollarsmaster-api
```

## Step 5: Deploy Backend to Heroku

```bash
# Add Heroku remote
heroku git:remote -a dollarsmaster-api

# Push to Heroku
git push heroku main

# View logs
heroku logs --tail --app=dollarsmaster-api

# Check if running
curl https://dollarsmaster-api.herokuapp.com/api/health
```

## Step 6: Deploy Frontend

### Option A: Deploy to Heroku

```bash
# In frontend directory, create Procfile
echo "web: npm start" > frontend/Procfile

# Create .env.production
echo "REACT_APP_API_URL=https://dollarsmaster-api.herokuapp.com/api" > frontend/.env.production

# Add and commit
git add frontend/
git commit -m "Add frontend Heroku config"

# Create frontend Heroku remote
heroku create dollarsmaster-web --region us
heroku git:remote -a dollarsmaster-web

# Push frontend
cd frontend
git subtree push --prefix frontend heroku main
cd ..
```

### Option B: Deploy to Netlify (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=build

# You'll be prompted for configuration:
# - Site name: dollarsmaster
# - Build command: npm run build
# - Publish directory: build
```

**Add environment variable to Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add: `REACT_APP_API_URL` = `https://dollarsmaster-api.herokuapp.com/api`
3. Redeploy

## Step 7: Verify Deployment

```bash
# Test backend API
curl https://dollarsmaster-api.herokuapp.com/api/health

# Expected response:
# {"status":"ok","timestamp":"...","environment":"production"}

# Test authentication endpoint
curl -X POST https://dollarsmaster-api.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@"}'
```

## Step 8: Set Up Custom Domain (Optional)

### For Heroku Backend

```bash
# Add domain
heroku domains:add api.yourdomain.com --app=dollarsmaster-api

# Get DNS target
heroku domains --app=dollarsmaster-api

# Add CNAME record to your DNS provider:
# CNAME api.yourdomain.com -> api.yourdomain.com.herokudns.com
```

### For Netlify Frontend

1. Go to Netlify Site settings → Domain management
2. Add custom domain
3. Update DNS provider with Netlify nameservers

## Step 9: Monitor and Maintain

```bash
# View logs
heroku logs --tail --app=dollarsmaster-api

# View config
heroku config --app=dollarsmaster-api

# Restart app
heroku restart --app=dollarsmaster-api

# Scale dynos (if needed)
heroku ps:scale web=2 --app=dollarsmaster-api
```

## Troubleshooting

### Application crashes

```bash
# Check logs
heroku logs --app=dollarsmaster-api

# Common issues:
# - Missing environment variables
# - Database connection error
# - Port not being respected
```

### Database connection issues

```bash
# Verify MongoDB Atlas
# 1. Check IP whitelist
# 2. Verify connection string
# 3. Check user permissions

# Test connection locally
mongosh "mongodb+srv://user:password@cluster.mongodb.net/dollarsmaster"
```

### CORS errors

```bash
# Make sure FRONTEND_URL environment variable is set correctly
heroku config:set FRONTEND_URL=https://yourdomain.com --app=dollarsmaster-api
```

## Continuous Deployment

### Auto-deploy on Git push

```bash
# Enable auto-deploy from main branch
heroku apps:settings:update --auto-release --app=dollarsmaster-api

# Or use GitHub integration:
# 1. Connect GitHub to Heroku
# 2. Select repository
# 3. Enable automatic deploys
```

## Free Tier Limitations

- App sleeps after 30 min of inactivity
- 550 free dyno hours/month
- Limited to 1 free database

**To keep app awake:**

```bash
# Install Kaffeine or similar
# https://kaffeine.herokuapp.com/
```

## Production Checklist

- [ ] Environment variables set
- [ ] MongoDB Atlas configured
- [ ] API endpoints tested
- [ ] Frontend connected to backend
- [ ] CORS configured
- [ ] SSL enabled (automatic on Heroku)
- [ ] Logging configured
- [ ] Error monitoring set up (optional)
- [ ] Monitoring and alerts configured
- [ ] Backup strategy in place

## Next Steps

1. **Add Error Tracking** - Use Sentry or Rollbar
2. **Set Up Monitoring** - Use New Relic or Datadog
3. **Configure Backups** - MongoDB Atlas automated backups
4. **Add CI/CD** - Use GitHub Actions
5. **Scale if needed** - Upgrade Heroku dynos

## Support

- Heroku Documentation: https://devcenter.heroku.com/
- Heroku Status: https://status.heroku.com/
- Contact Heroku Support for issues
