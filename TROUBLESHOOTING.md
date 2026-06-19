# Troubleshooting Guide

## Backend Issues

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Database Connection Error
```bash
# Check MongoDB connection
mongosh "mongodb://localhost:27017"

# Verify connection string in .env
echo $DATABASE_URL

# Check if MongoDB is running
psudo systemctl status mongod
```

### JWT Token Issues
- Ensure JWT_SECRET is set
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

### CORS Errors
```javascript
// Check CORS configuration in index.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

## Frontend Issues

### Blank Page or 404
- Check that backend is running
- Verify API_URL in .env
- Check browser console for errors
- Clear browser cache

### API Calls Failing
```bash
# Test API endpoint
curl http://localhost:5000/api/health

# Check network tab in DevTools
# Look for 401, 403, 500 errors
```

### Redux State Not Updating
- Use Redux DevTools extension
- Check that reducer is handling action
- Verify action is being dispatched
- Check useSelector hook

### WebSocket Connection Issues
```javascript
// Check socket connection
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionDelay: 1000
});

socket.on('connect', () => console.log('Connected'));
socket.on('error', (err) => console.error('Error:', err));
```

## Docker Issues

### Container Won't Start
```bash
# Check logs
docker logs dollarsmaster-backend

# Rebuild image
docker-compose build --no-cache

# Start fresh
docker-compose down -v
docker-compose up -d
```

### Permission Denied
```bash
# Run docker commands with sudo
sudo docker-compose up

# Or add user to docker group
sudo usermod -aG docker $USER
```

## Database Issues

### MongoDB Connection Timeout
- Check network connectivity
- Verify IP whitelist
- Check connection string format
- Ensure MongoDB service is running

### Data Not Persisting
- Check if volume is mounted correctly
- Verify MongoDB data directory
- Check database permissions

## Performance Issues

### Slow API Response
```bash
# Check server logs for errors
npm run dev

# Monitor system resources
top

# Check database queries
# Add logging to understand bottlenecks
```

### High Memory Usage
- Check for memory leaks
- Review Redux store size
- Optimize API responses
- Implement pagination

### Slow Frontend
- Check bundle size: `npm run build`
- Use React DevTools Profiler
- Implement code splitting
- Optimize images

## Security Issues

### Unauthorized Errors
- Verify token is being sent
- Check token expiration
- Ensure authMiddleware is applied
- Check JWT_SECRET matches

### HTTPS Warnings
- Install valid SSL certificate
- Update security headers
- Configure CORS properly

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `ECONNREFUSED` | Service not running | Start the service |
| `EADDRINUSE` | Port in use | Kill process or use different port |
| `SyntaxError` | Code error | Check syntax in error file |
| `undefined is not a function` | Import issue | Check imports and exports |
| `401 Unauthorized` | Missing/invalid token | Check authentication |
| `CORS error` | Configuration issue | Update CORS settings |

## Getting Help

1. Check error message carefully
2. Search GitHub issues
3. Check documentation
4. Enable debug logging
5. Isolate the problem
6. Create minimal reproduction
7. Ask in community forums

## Debug Logging

```javascript
// Add debug logging
const debug = require('debug')('app:*');

debug('Message:', value);

// Enable debug output
DEBUG=app:* npm run dev
```
