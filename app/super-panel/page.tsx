'use client';
import { useEffect, useState } from 'react';

export default function SuperPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'subs'>('orders');
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(activeTab === 'orders' ? '/api/get-orders' : '/api/get-subs');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setData([]);
    }
  };

  useEffect(() => { 
    setData([]); 
    fetchData(); 
  }, [activeTab]);

  const updateOrder = async (id: string, updates: any) => {
    await fetch('/api/update-order', {
      method: 'POST',
      body: JSON.stringify({ id, updates }),
    });
    setData(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1000);
  };

  const copyAllEmails = () => {
    const allEmails = data.map(s => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
  };

  const sendOrderEmail = async (order: any) => {
    setSendingId(order.id);
    const res = await fetch('/api/send-order-status', {
      method: 'POST',
      body: JSON.stringify({ order }),
    });
    const result = await res.json();
    if (result.success) {
      setStatusMsg('SENT!');
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      alert('Error: ' + result.error);
    }
    setSendingId(null);
  };

  const filtered = (data || []).filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-[#ffffff] font-mono selection:bg-white selection:text-black">
      <aside className="w-64 border-r border-[#222] p-8 flex flex-col gap-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">Stirol Admin</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('orders')} className={`text-left p-2 ${activeTab === 'orders' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>ORDERS</button>
          <button onClick={() => setActiveTab('subs')} className={`text-left p-2 ${activeTab === 'subs' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>SUBSCRIBERS</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-8 gap-4">
            <input placeholder="SEARCH..." className="flex-1 bg-[#111] border border-[#333] p-4 outline-none focus:border-white text-sm" onChange={(e) => setSearch(e.target.value)} />
            {activeTab === 'subs' && (
              <button onClick={copyAllEmails} className="bg-white text-black px-6 py-4 text-xs font-bold hover:bg-gray-200 uppercase">{isCopiedAll ? 'COPIED!' : 'Copy All Emails'}</button>
            )}
          </div>
          
          <div className="grid gap-4">
            {activeTab === 'orders' ? filtered.map((o) => (
              <div key={o.id} className="border border-[#222] bg-[#111] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{o.name} <span className="text-[#444]">#{o.id}</span>
                      <span className="ml-2 text-[10px] bg-[#222] px-2 py-1 uppercase">{o.lang || 'EN'}</span>
                    </h3>
                    <div className="text-[11px] mt-2 text-[#888] flex gap-4">
                      <span className="cursor-pointer hover:text-white" onClick={() => copy(o.email, o.id+'e')}>{o.email}</span>
                      <span className="cursor-pointer hover:text-white" onClick={() => copy(o.phone, o.id+'p')}>{o.phone}</span>
                    </div>
                  </div>
                  <select defaultValue={o.status || 'NEW'} className="bg-[#222] text-xs p-2 uppercase outline-none cursor-pointer" onChange={(e) => updateOrder(o.id, { status: e.target.value })}>
                    <option value="NEW">NEW</option><option value="PACKING">PACKING</option><option value="SHIPPED">SHIPPED</option><option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs border-t border-[#222] pt-4">
                  <div>
                    <p className="text-[#555] uppercase">Address</p>
                    <p>{o.address}, {o.city}, {o.zip}</p>
                    <input type="text" placeholder="Tracking..." value={o.tracking || ''} className="bg-[#0a0a0a] border border-[#333] p-1 mt-2 w-full" onChange={(e) => setData(prev => prev.map(item => item.id === o.id ? {...item, tracking: e.target.value} : item))} onBlur={(e) => updateOrder(o.id, { tracking: e.target.value })} />
                  </div>
                  <div className="flex flex-col justify-between">
                    <p><b>ITEMS:</b> {o.items}</p>
                    {(o.status === 'SHIPPED' || o.status === 'CANCELLED') && (
                       <button disabled={sendingId === o.id} onClick={() => sendOrderEmail(o)} className="border border-white p-2 hover:bg-white hover:text-black uppercase text-[10px] font-bold disabled:opacity-30">
                         {sendingId === o.id ? 'SENDING...' : (statusMsg || `Send ${o.lang === 'UA' ? 'UA' : 'EN'} Email`)}
                       </button>
                    )}
                  </div>
                </div>
              </div>
            )) : filtered.map((s) => (
              <div key={s.id} className="border border-[#222] p-4 bg-[#111] flex justify-between items-center text-sm">
                <span className="cursor-pointer hover:text-white" onClick={() => copy(s.email, s.id)}>{s.email}</span>
                <span className="text-[#555] text-xs uppercase">{s.lang}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}