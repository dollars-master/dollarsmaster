// MongoDB Trade Schema

const tradeSchema = {
  _id: 'ObjectId',
  tradeId: 'String (unique)',
  userId: 'ObjectId (ref: User)',
  symbol: 'String',
  direction: 'String (call/put)',
  amount: 'Number',
  entryPrice: 'Number',
  exitPrice: 'Number (optional)',
  status: 'String (open/closed)',
  profit: 'Number (default: 0)',
  profitPercent: 'Number',
  duration: 'Number',
  durationUnit: 'String',
  createdAt: 'Date',
  closedAt: 'Date (optional)',
  strategyUsed: 'String (optional)',
  autoTrade: 'Boolean (default: false)'
};

module.exports = tradeSchema;