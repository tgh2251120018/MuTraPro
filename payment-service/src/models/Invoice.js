const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ItemSchema = new mongoose.Schema({
  description: String,
  unit_price: { type: Number, min: 0 },
  quantity: { type: Number, min: 1 },
  total: { type: Number, min: 0 }
}, { _id: false });

const InvoiceSchema = new mongoose.Schema({
  _id: { type: String, default: () => uuidv4() },
  invoice_number: { type: String, unique: true, sparse: true },
  customer_id: { type: String, required: true },
  request_id: { type: String },
  items: { type: [ItemSchema], default: [] },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'VND' },
  status: { type: String, enum: ['PENDING','PAID','FAILED','CANCELLED'], default: 'PENDING' },
  payment_methods_allowed: { type: [String], default: ['VNPay','Stripe','PayPal'] },
  metadata: { type: mongoose.Schema.Types.Mixed },
  created_by: String,
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  paid_at: Date,
  idempotency_key: String
});

InvoiceSchema.pre('save', function(next){
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
