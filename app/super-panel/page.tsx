'use client';
import { useEffect, useState } from 'react';

export default function SuperPanel() {
  const [activeTab, setActiveTab] = useState<'orders' | 'subs'>('orders');
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  const fetchData = async () => {
    const res = await fetch(activeTab === 'orders' ? '/api/get-orders' : '/api/get-subs');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

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

  const filtered = data.filter(i => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-[#ffffff] font-mono selection:bg-white selection:text-black">
      <aside className="w-64 border-r border-[#222] p-8 flex flex-col gap-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">Stirol Admin</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('orders')} className={`text-left p-2 transition-colors ${activeTab === 'orders' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>ORDERS</button>
          <button onClick={() => setActiveTab('subs')} className={`text-left p-2 transition-colors ${activeTab === 'subs' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>SUBSCRIBERS</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="flex justify-between items-center mb-8 gap-4">
            <input 
              placeholder="SEARCH..." 
              className="flex-1 bg-[#111] border border-[#333] p-4 outline-none focus:border-white transition-all text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            {activeTab === 'subs' && (
              <button 
                onClick={copyAllEmails} 
                className="bg-white text-black px-6 py-4 text-xs font-bold hover:bg-gray-200 uppercase transition-all"
              >
                {isCopiedAll ? 'COPIED!' : 'Copy All Emails'}
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {activeTab === 'orders' ? filtered.map((o) => (
              <div key={o.id} className="border border-[#222] bg-[#111] p-6 hover:border-[#444] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{o.name} <span className="text-[#444]">#{o.id}</span></h3>
                    <div className="text-[12px] mt-1 text-[#888]">
                      <p className="cursor-pointer hover:text-white" onClick={() => copy(o.email, o.id + 'e')}>{o.email} {copiedId === o.id + 'e' && <span className="text-white ml-2">[COPIED]</span>}</p>
                      <p className="cursor-pointer hover:text-white" onClick={() => copy(o.phone, o.id + 'p')}>{o.phone} {copiedId === o.id + 'p' && <span className="text-white ml-2">[COPIED]</span>}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{o.total} €</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs border-t border-[#222] pt-4">
                  <div>
                    <p className="text-[#555] uppercase mb-1">Shipping</p>
                    <p>{o.address}, {o.city}</p>
                    <p>{o.country}, {o.zip}</p>
                  </div>
                  <div>
                    <p className="text-[#555] uppercase mb-1">Items</p>
                    <p className="font-bold text-white leading-relaxed">{o.items}</p>
                  </div>
                </div>
              </div>
            )) : filtered.map((s) => (
              <div key={s.id} className="border border-[#222] p-4 bg-[#111] flex justify-between items-center text-sm">
                <span className="cursor-pointer hover:text-white" onClick={() => copy(s.email, s.id)}>{s.email} {copiedId === s.id && <span className="text-gray-500 ml-2">[COPIED]</span>}</span>
                <span className="text-[#555] text-xs uppercase">{s.lang}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}