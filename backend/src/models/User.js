// MongoDB User Schema
// This would be implemented with Mongoose

const userSchema = {
  _id: 'ObjectId',
  email: 'String (unique)',
  password: 'String (hashed)',
  firstName: 'String',
  lastName: 'String',
  balance: 'Number (default: 5000)',
  equity: 'Number',
  verified: 'Boolean (default: false)',
  derivApiKey: 'String (encrypted)',
  derivApiSecret: 'String (encrypted)',
  createdAt: 'Date',
  updatedAt: 'Date',
  lastLoginAt: 'Date',
  preferences: {
    theme: 'String',
    notifications: 'Boolean',
    defaultTimeframe: 'String'
  }
};

module.exports = userSchema;