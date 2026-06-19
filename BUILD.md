# Build and Deploy Instructions

## Frontend Build

```bash
cd frontend
npm install
npm run build
```

Output: `frontend/build/` directory

## Backend Build

```bash
cd backend
npm install
npm run build
```

## Docker Build

```bash
# Build all containers
docker-compose build

# Build specific container
docker-compose build backend
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Frontend build generated
- [ ] Backend tests passing
- [ ] API endpoints tested
- [ ] SSL certificates ready
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Team notifications sent
- [ ] Rollback plan ready

## CI/CD Pipeline

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm run deploy
```

## Post-Deployment Verification

1. **Check Health**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Test Authentication**
   ```bash
   curl -X POST https://your-domain.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!@"}'
   ```

3. **Verify Database**
   - Check data consistency
   - Verify backups working

4. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Watch resource usage

## Rollback Procedure

```bash
# If deployment fails:
git revert HEAD~1
git push origin main

# Or rollback to previous version:
heroku releases
heroku rollback v<number>
```
