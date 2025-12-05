import { useState } from "react";
import { paymentApi } from "../api";

export default function Payment() {
  const [amount, setAmount] = useState(100);

  async function createInvoice() {
    const res = await paymentApi.post('/invoices', {
      amount,
      items: [
        { description: 'Studio Hour', quantity: 1, unit_price: amount, total: amount }
      ]
    }, { headers: { "x-user-id": "demo-user" }});

    alert('Invoice created: ' + res.data._id);
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-3'>Tạo hóa đơn</h1>

      <label className='form-control w-60'>
        <span className='label-text'>Số tiền</span>
        <input type='number' value={amount} onChange={e => setAmount(e.target.value)} className='input input-bordered' />
      </label>

      <button onClick={createInvoice} className='btn btn-primary mt-4'>Tạo hóa đơn</button>
    </div>
  );
}
