# Deployment Guide for DollarsMaster

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] API endpoints tested
- [ ] Frontend build successful
- [ ] SSL certificates ready
- [ ] Backup strategies in place

## Option 1: Heroku Deployment (Easiest)

### Backend Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create dollarsmaster-api

# Set environment variables
heroku config:set DERIV_API_KEY=your_key
heroku config:set DERIV_APP_ID=your_app_id
heroku config:set JWT_SECRET=your_secret
heroku config:set DATABASE_URL=your_mongo_uri

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Frontend Deployment (Netlify)

```bash
# Build frontend
cd frontend
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

## Option 2: AWS Deployment

### Using Elastic Beanstalk

```bash
# Install AWS CLI
pip install awsebcli

# Initialize EB
eb init -p node.js-18 dollarsmaster

# Create environment
eb create dollarsmaster-env

# Set environment variables
eb setenv DERIV_API_KEY=your_key DERIV_APP_ID=your_app_id

# Deploy
eb deploy
```

### Using EC2 + RDS

1. Launch EC2 instance (Ubuntu 22.04)
2. Set up RDS MongoDB Atlas
3. Install Node.js and PM2
4. Clone repository
5. Install dependencies
6. Configure environment
7. Start with PM2

## Option 3: DigitalOcean Deployment

```bash
# Create Droplet (2GB RAM minimum)
# SSH into droplet
ssh root@your_droplet_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install MongoDB
apt install -y mongodb-org

# Install Nginx
apt install -y nginx

# Clone repository
git clone https://github.com/dollars-master/dollarsmaster.git
cd dollarsmaster

# Install dependencies
cd backend && npm install
cd ../frontend && npm install && npm run build

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with your credentials

# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start src/index.js --name "dollarsmaster-api"
pm2 save
pm2 startup

# Configure Nginx
sudo nano /etc/nginx/sites-available/dollarsmaster
```

Nginx Config:
```nginx
upstream backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name your_domain.com;

    # Frontend
    location / {
        root /root/dollarsmaster/frontend/build;
        try_files $uri /index.html;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Option 4: Docker Deployment

### Build and Push to Docker Hub

```bash
# Login to Docker
docker login

# Build images
docker-compose build

# Tag images
docker tag dollarsmaster-backend:latest your_username/dollarsmaster-backend:latest
docker tag dollarsmaster-frontend:latest your_username/dollarsmaster-frontend:latest

# Push to Docker Hub
docker push your_username/dollarsmaster-backend:latest
docker push your_username/dollarsmaster-frontend:latest
```

### Deploy with Docker

```bash
# Pull images
docker pull your_username/dollarsmaster-backend:latest
docker pull your_username/dollarsmaster-frontend:latest

# Run containers
docker-compose up -d
```

## Post-Deployment

1. **Verify Services**
   ```bash
   curl http://your-domain.com/api/health
   ```

2. **Monitor Logs**
   ```bash
   pm2 monit
   # or
   docker logs -f dollarsmaster-backend
   ```

3. **Set Up SSL/TLS**
   ```bash
   # Using Let's Encrypt
   certbot --nginx -d your_domain.com
   ```

4. **Configure Backups**
   - Daily MongoDB backups
   - Database replication
   - Code version control

5. **Set Up Monitoring**
   - Application logs
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

## Troubleshooting

### Connection Issues
```bash
# Check if backend is running
lsof -i :5000

# Check if database is accessible
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/dbname"
```

### Performance Issues
```bash
# Monitor resource usage
top
df -h

# Clear cache
redis-cli FLUSHALL
```

### SSL Certificate Issues
```bash
# Renew certificate
certbot renew --dry-run
```

## Production Best Practices

1. **Security**
   - Use HTTPS everywhere
   - Implement rate limiting
   - Validate all inputs
   - Use secure headers

2. **Performance**
   - Enable caching
   - Compress responses
   - Use CDN for static files
   - Optimize database queries

3. **Reliability**
   - Implement auto-scaling
   - Use load balancing
   - Set up health checks
   - Configure auto-restart

4. **Monitoring**
   - Set up alerts
   - Monitor error rates
   - Track user metrics
   - Log all transactions
