const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TransactionSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  invoice_id: { type: String, required: true, index: true },
  payment_provider: { type: String, required: true },
  payment_method: String,
  transaction_code: { type: String },
  provider_response: { type: mongoose.Schema.Types.Mixed },
  amount: Number,
  currency: String,
  status: { type: String, enum: ['SUCCESS','FAILED','PENDING'], default: 'PENDING' },
  failure_reason: String,
  created_at: { type: Date, default: Date.now },
  processed_at: Date,
  idempotency_key: String,
  webhook_raw: mongoose.Schema.Types.Mixed,
  signature_verified: { type: Boolean, default: false },
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Transaction', TransactionSchema);

