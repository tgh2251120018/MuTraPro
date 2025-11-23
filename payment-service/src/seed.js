const mongoose = require('mongoose');
const config = require('./config');
const Invoice = require('./models/Invoice');

async function seed(){
  await mongoose.connect(config.mongoUri);
  console.log('Seeding payment DB...');
  const sample = new Invoice({
    invoice_number: `INV-${Date.now()}`,
    customer_id: 'customer-demo-1',
    items: [{ description: 'Studio booking 2h', unit_price: 120, quantity: 2, total: 240 }],
    amount: 240,
    currency: 'VND',
    status: 'PENDING'
  });
  await sample.save();
  console.log('Sample invoice created:', sample._id);
  await mongoose.disconnect();
}
seed().catch(e=>{ console.error(e); process.exit(1); });

