'use client';
import { useEffect, useState } from 'react';

export default function SuperPanel() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/get-orders')
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div style={{ padding: '40px', color: '#fff', backgroundColor: '#050505', minHeight: '100vh', fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: '12px', letterSpacing: '0.2em' }}>STIROL ORDERS</h1>
      <table style={{ width: '100%', marginTop: '40px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>ID</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>NAME</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o: any, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '10px' }}>{o.orderId || '---'}</td>
              <td style={{ padding: '10px' }}>{o.name}</td>
              <td style={{ padding: '10px' }}>{o.total}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}