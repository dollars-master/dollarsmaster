// MongoDB Signal Schema

const signalSchema = {
  _id: 'ObjectId',
  signalId: 'String (unique)',
  symbol: 'String',
  type: 'String (BUY/SELL/HOLD)',
  strength: 'Number (0-1)',
  reason: 'String',
  timeframe: 'String (1h/4h/1d)',
  accuracy: 'Number (percentage)',
  createdAt: 'Date',
  indicators: [
    {
      name: 'String',
      value: 'Number',
      status: 'String'
    }
  ]
};

module.exports = signalSchema;