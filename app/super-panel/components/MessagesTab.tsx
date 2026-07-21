'use client';

import { useState } from 'react';

export function MessagesTab() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !subject.trim() || !message.trim()) return;
    setStatus('sending');

    try {
      const response = await fetch('/api/send-customer-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message, orderId }),
      });
      if (!response.ok) throw new Error();
      setEmail('');
      setSubject('');
      setMessage('');
      setOrderId('');
      setStatus('sent');
      window.setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={sendMessage} className="max-w-2xl border border-[#222] bg-[#111] p-6 space-y-5">
      <div>
        <h2 className="text-sm font-bold tracking-widest uppercase">Messages</h2>
        <p className="mt-2 text-[10px] leading-relaxed text-[#777] uppercase">Send any customer a STIROL receipt-style email from orders@stirol.xyz.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="CUSTOMER EMAIL" className="bg-[#0a0a0a] border border-[#333] p-3 text-xs outline-none focus:border-white" required />
        <input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="ORDER # (OPTIONAL)" className="bg-[#0a0a0a] border border-[#333] p-3 text-xs outline-none focus:border-white" />
      </div>
      <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="SUBJECT" maxLength={100} className="w-full bg-[#0a0a0a] border border-[#333] p-3 text-xs outline-none focus:border-white" required />
      <textarea value={message} onChange={(event) => setMessage(event.target.value)} placeholder="MESSAGE" maxLength={3000} className="w-full min-h-56 resize-y bg-[#0a0a0a] border border-[#333] p-3 text-xs leading-relaxed outline-none focus:border-white" required />
      <button type="submit" disabled={status === 'sending'} className="w-full bg-white text-black py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#ddd] disabled:opacity-40">
        {status === 'sending' ? 'SENDING...' : status === 'sent' ? 'SENT!' : status === 'error' ? 'TRY AGAIN' : 'SEND EMAIL'}
      </button>
    </form>
  );
}
