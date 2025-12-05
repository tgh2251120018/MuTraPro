const Invoice = require('../models/Invoice');
const Transaction = require('../models/Transaction');

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const customer_id = req.headers['x-user-id'] || req.body.customer_id;
    if (!customer_id) return res.status(400).json({ error: 'customer_id missing in header or body' });

    const { items = [], amount, currency='VND', request_id, idempotency_key } = req.body;
    const invoice = new Invoice({
      customer_id, items, amount, currency, request_id, idempotency_key, created_by: customer_id
    });
    await invoice.save();
    return res.status(201).json(invoice);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Start payment (create transaction + return mocked payment url)
exports.startPayment = async (req, res) => {
  try {
    const { provider } = req.body;
    const invoiceId = req.params.invoiceId;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    if (invoice.status === 'PAID') return res.status(400).json({ error: 'Invoice already paid' });

    const tx = new Transaction({
      invoice_id: invoice._id,
      payment_provider: provider || 'VNPay',
      amount: invoice.amount,
      currency: invoice.currency,
      status: 'PENDING',
      idempotency_key: req.body.idempotency_key
    });
    await tx.save();

    // For demo: generate a fake payment_url (in real use call provider SDK)
    const paymentUrl = `https://mock-pay.example.com/pay?tx=${tx._id}&provider=${tx.payment_provider}`;
    return res.json({ payment_url: paymentUrl, transaction: tx });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Webhook handler (simple demo)
exports.handleWebhook = async (req, res) => {
  try {
    const provider = req.params.provider;
    const body = req.body;
    // In real: verify signature using provider secret
    // For demo: expect body.transaction_code and body.status
    const { transaction_code, invoice_id, status, amount } = body;

    // idempotency check by transaction_code
    let tx = await Transaction.findOne({ transaction_code });
    if (!tx) {
      // create new transaction from webhook
      tx = new Transaction({
        invoice_id,
        payment_provider: provider,
        transaction_code,
        provider_response: body,
        amount,
        currency: body.currency || 'VND',
        status: status === 'SUCCESS' ? 'SUCCESS' : 'FAILED',
        webhook_raw: body,
        signature_verified: true,
        processed_at: new Date()
      });
      await tx.save();
    } else {
      // update existing
      tx.status = status === 'SUCCESS' ? 'SUCCESS' : 'FAILED';
      tx.provider_response = body;
      tx.processed_at = new Date();
      await tx.save();
    }

    // update invoice if success
    if (tx.status === 'SUCCESS') {
      await Invoice.findByIdAndUpdate(invoice_id, { status: 'PAID', paid_at: new Date() });
      // TODO: call Notification Service (HTTP) to notify user
    } else {
      await Invoice.findByIdAndUpdate(invoice_id, { status: 'FAILED' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Get transactions by customer
exports.getTransactionsByCustomer = async (req, res) => {
  try {
    const customer_id = req.headers['x-user-id'] || req.params.customerId;
    if (!customer_id) return res.status(400).json({ error: 'customer_id missing' });
    const invoices = await Invoice.find({ customer_id }, '_id');
    const ids = invoices.map(i => i._id);
    const txs = await Transaction.find({ invoice_id: { $in: ids } }).sort('-created_at');
    return res.json(txs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

