# Development Guide

## Getting Started

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- Git
- MongoDB
- Redis

### Local Setup

```bash
# Clone repository
git clone https://github.com/dollars-master/dollarsmaster.git
cd dollarsmaster

# Start services with Docker
docker-compose up -d

# Backend setup
cd backend
cp .env.example .env
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api npm start
```

## Project Structure

```
dollarsmaster/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Database schemas
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Utility functions
│   │   └── index.js          # Main entry point
│   ├── package.json
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # React components
│   │   ├── store/            # Redux store
│   │   ├── services/         # API services
│   │   ├── App.jsx           # Main app component
│   │   └── index.jsx         # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── ai-engine/
│   ├── models/               # ML models
│   ├── training/             # Training scripts
│   └── inference/            # Prediction logic
├── docker-compose.yml
└── README.md
```

## API Development

### Creating a New Endpoint

1. **Create Controller**
```javascript
// backend/src/controllers/newController.js
exports.getAction = (req, res) => {
  try {
    // Your logic here
    res.json({ data: 'success' });
  } catch (error) {
    logger.error('Error:', error);
    res.status(500).json({ error: 'Failed to get action' });
  }
};
```

2. **Create Route**
```javascript
// backend/src/routes/new.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/newController');
const authMiddleware = require('../middleware/auth');

router.get('/action', authMiddleware, controller.getAction);

module.exports = router;
```

3. **Register Route in index.js**
```javascript
app.use('/api/new', require('./routes/new'));
```

## Frontend Development

### Creating a New Page

1. **Create Page Component**
```jsx
// frontend/src/pages/NewPage.jsx
import React from 'react';

function NewPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">New Page</h1>
      {/* Your content */}
    </div>
  );
}

export default NewPage;
```

2. **Add Route in App.jsx**
```jsx
<Route path="/new" element={<NewPage />} />
```

3. **Add Sidebar Navigation**
Edit `frontend/src/components/Sidebar.jsx` and add menu item.

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Debugging

### Backend Debug Mode
```bash
node --inspect src/index.js
```

### Frontend Debug
- Open Chrome DevTools (F12)
- Use Redux DevTools extension
- Check Network tab for API calls

## Common Development Tasks

### Add Database Model
1. Create schema in `backend/src/models/`
2. Use Mongoose for MongoDB
3. Export model for use in controllers

### Add Redux Slice
1. Create slice in `frontend/src/store/slices/`
2. Import in `frontend/src/store/index.js`
3. Use with `useSelector` and `useDispatch`

### Add API Service
1. Use existing `api.js` service
2. Create methods in components
3. Handle errors appropriately

## Performance Tips

1. Use React.memo for components
2. Implement code splitting
3. Cache API responses
4. Optimize bundle size
5. Use lazy loading for images

## Code Style

- Use ESLint for JavaScript
- Follow React conventions
- Use Tailwind CSS for styling
- Keep components small and focused
- Use meaningful variable names

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes
git add .

# Commit with clear message
git commit -m "feat: add your feature"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request
```

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Documentation](https://redux.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://docs.mongodb.com/)
- [Socket.io](https://socket.io/docs/)
