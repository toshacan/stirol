'use client';
import { useEffect, useState, useMemo } from 'react';

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<'orders' | 'subs' | 'dashboard' | 'customers'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');
  
  // Фильтры для раздела SUBSCRIBERS
  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');
  const [subLangFilter, setSubLangFilter] = useState<string>('ALL');

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);
  
  // Состояние для отслеживания развернутого заказа в попапе истории
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const fetchData = async () => {
    if (orders.length === 0) {
      fetch('/api/get-orders').then(r => r.json()).then(j => setOrders(Array.isArray(j) ? j : []));
    }
    if (subs.length === 0) {
      fetch('/api/get-subs').then(r => r.json()).then(j => setSubs(Array.isArray(j) ? j : []));
    }
    if (profiles.length === 0) {
      fetch('/api/get-profiles').then(r => r.json()).then(j => {
        const cleanedProfiles = (Array.isArray(j) ? j : []).map(p => ({
          ...p,
          // На случай, если из базы прилетает строка с физическими кавычками "'NEW'" или "'VIP'"
          client_status: p.client_status ? p.client_status.replace(/['"]/g, '').trim() : 'NEW'
        }));
        setProfiles(cleanedProfiles);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const updateOrder = async (id: string, updates: any) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    await fetch('/api/update-order', {
      method: 'POST',
      body: JSON.stringify({ id, updates }),
    });
  };

  const updateProfile = async (email: string, updates: any) => {
    // Очищаем значение статуса от возможных случайных кавычек перед записью в стейт и отправкой
    if (updates.client_status) {
      updates.client_status = updates.client_status.replace(/['"]/g, '').trim();
    }

    setProfiles(prev => prev.map(p => p.email === email ? { ...p, ...updates } : p));
    
    if (selectedProfile && selectedProfile.email === email) {
      setSelectedProfile(prev => prev ? { ...prev, ...updates } : null);
    }

    await fetch('/api/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, updates })
    });
  };

  // Функция удаления подписчика
  const deleteSub = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    
    setSubs(prev => prev.filter(s => s.email !== email));
    
    await fetch('/api/delete-sub', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

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

  const newOrdersCount = orders.filter(o => o.status === 'NEW').length;
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED');
  const totalRevenue = shippedOrders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);
  
  const topItems = useMemo(() => {
    const map: Record<string, number> = {};
    shippedOrders.forEach(o => {
      o.items?.split(',').forEach((item: string) => {
        const [name, qtyStr] = item.split(' x');
        const qty = parseInt(qtyStr || '1');
        const cleanName = name.trim();
        map[cleanName] = (map[cleanName] || 0) + qty;
      });
    });
    return Object.entries(map).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
  }, [shippedOrders]);

  const totalItemsSold = Object.values(topItems.reduce((acc: any, [name, val]: any) => ({...acc, [name]: val}), {})).reduce((a: any, b: any) => a + b, 0);

  const filtered = useMemo(() => {
    let data: any[] = [];
    if (activeTab === 'orders') data = orders;
    else if (activeTab === 'subs') {
      data = subs.map(s => {
        const profile = profiles.find(p => p.email === s.email);
        return { ...s, client_status: profile?.client_status || 'NEW' };
      });
    }
    else if (activeTab === 'customers') data = profiles;

    let result = [...data].filter(i => {
      const matchesSearch = JSON.stringify(i).toLowerCase().includes(search.toLowerCase());
      
      if (activeTab === 'orders') {
        return matchesSearch && (statusFilter === 'ALL' || i.status === statusFilter);
      }
      
      if (activeTab === 'customers') {
        return matchesSearch && (customerFilter === 'ALL' || i.client_status === customerFilter);
      }
      
      if (activeTab === 'subs') {
        const matchesStatus = subStatusFilter === 'ALL' || i.client_status === subStatusFilter;
        const matchesLang = subLangFilter === 'ALL' || (i.lang || 'EN').toUpperCase() === subLangFilter;
        return matchesSearch && matchesStatus && matchesLang;
      }
      
      return matchesSearch;
    });

    if (activeTab === 'customers') {
      result.sort((a, b) => {
        if (a.client_status === 'VIP' && b.client_status !== 'VIP') return -1;
        if (a.client_status !== 'VIP' && b.client_status === 'VIP') return 1;
        return (b.id || 0) - (a.id || 0);
      });
    } else {
      result.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return result;
  }, [orders, subs, profiles, activeTab, search, statusFilter, customerFilter, subStatusFilter, subLangFilter]);

  const copyFilteredEmails = () => {
    if (activeTab !== 'subs') return;
    const allEmails = filtered.map(s => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
  };

  const customerHistory = selectedProfile ? orders.filter(o => o.email === selectedProfile.email) : [];
  const cancelledOrdersCount = customerHistory.filter(o => o.status === 'CANCELLED').length;
  const isProfileSubscribed = selectedProfile ? subs.some(s => s.email === selectedProfile.email) : false;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-[#ffffff] font-mono selection:bg-white selection:text-black">
      <aside className="w-64 border-r border-[#222] p-8 flex flex-col gap-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">Stirol Admin</h2>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab('orders')} className={`text-left p-2 flex justify-between ${activeTab === 'orders' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>
            ORDERS {newOrdersCount > 0 && <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-full">{newOrdersCount}</span>}
          </button>
          <button onClick={() => setActiveTab('subs')} className={`text-left p-2 ${activeTab === 'subs' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>SUBSCRIBERS</button>
          <button onClick={() => setActiveTab('dashboard')} className={`text-left p-2 ${activeTab === 'dashboard' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>DASHBOARD</button>
          <button onClick={() => setActiveTab('customers')} className={`text-left p-2 ${activeTab === 'customers' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'}`}>CUSTOMERS</button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          {activeTab === 'dashboard' ? (
            <div className="grid gap-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-[#222] p-8 bg-[#111]">
                  <p className="text-[#555] uppercase text-xs mb-2">Revenue (Shipped Only)</p>
                  <h3 className="text-4xl font-bold">{totalRevenue.toFixed(2)}€</h3>
                </div>
                <div className="border border-[#222] p-8 bg-[#111]">
                  <p className="text-[#555] uppercase text-xs mb-2">Total Items (Shipped Only)</p>
                  <h3 className="text-4xl font-bold">{totalItemsSold}</h3>
                </div>
              </div>
              <div className="border border-[#222] p-8 bg-[#111]">
                <p className="text-[#555] uppercase text-xs mb-4">Top 5 Items</p>
                {topItems.map(([name, count]: any, idx) => (
                  <div key={idx} className="flex justify-between py-2 border-b border-[#222] text-sm">
                    <span>{name}</span> <b>{count} sold</b>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col mb-8 gap-4">
              <div className="flex gap-4">
                <input placeholder="SEARCH..." className="flex-1 bg-[#111] border border-[#333] p-4 outline-none focus:border-white text-sm" onChange={(e) => setSearch(e.target.value)} />
                {activeTab === 'subs' && (
                  <button onClick={copyFilteredEmails} className="bg-white text-black px-6 py-4 text-xs font-bold hover:bg-gray-200 uppercase">
                    {isCopiedAll ? 'COPIED!' : 'Copy Filtered Emails'}
                  </button>
                )}
              </div>
              
              {activeTab === 'orders' && (
                <div className="flex gap-2">
                  {['ALL', 'NEW', 'PACKING', 'SHIPPED', 'CANCELLED'].map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-1 text-[10px] border ${statusFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'subs' && (
                <div className="flex gap-6 items-center">
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#555] uppercase">Status:</span>
                    {['ALL', 'NEW', 'REGULAR', 'VIP'].map((s) => (
                      <button key={s} onClick={() => setSubStatusFilter(s)} className={`px-3 py-1 text-[10px] border ${subStatusFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#555] uppercase">Lang:</span>
                    {['ALL', 'EN', 'UA'].map((l) => (
                      <button key={l} onClick={() => setSubLangFilter(l)} className={`px-3 py-1 text-[10px] border ${subLangFilter === l ? 'bg-white text-black' : 'border-[#333] text-[#555]'}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="flex gap-2">
                  {['ALL', 'NEW', 'REGULAR', 'VIP'].map((s) => (
                    <button key={s} onClick={() => setCustomerFilter(s)} className={`px-4 py-1 text-[10px] border ${customerFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="grid gap-4">
            {activeTab === 'orders' && filtered.map((o) => (
              <div key={o.id} className="border border-[#222] bg-[#111] p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{o.name} <span className="text-[#444]">#{o.id}</span>
                      <span className="ml-2 text-[10px] bg-[#222] px-2 py-1 uppercase">{o.lang || 'EN'}</span>
                    </h3>
                    <div className="text-[11px] mt-2 text-[#888] flex gap-4">
                      <span className="cursor-pointer hover:text-white" onClick={() => copy(o.email)}>{o.email}</span>
                      <span className="cursor-pointer hover:text-white" onClick={() => copy(o.phone)}>{o.phone}</span>
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
                    <input type="text" placeholder="Tracking..." value={o.tracking || ''} className="bg-[#0a0a0a] border border-[#333] p-1 mt-2 w-full" onChange={(e) => setOrders(prev => prev.map(item => item.id === o.id ? {...item, tracking: e.target.value} : item))} onBlur={(e) => updateOrder(o.id, { tracking: e.target.value })} />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-[#555] uppercase">Items</p>
                      {o.items?.split(',').map((item: string, idx: number) => {
                         const [name, qty] = item.split(' x');
                         return (
                           <p key={idx} className="mb-0.5">• {name.trim()} {qty ? <span className="text-white font-bold ml-1 px-1.5 bg-[#333] rounded">x{qty}</span> : ''}</p>
                         );
                      })}
                      <p className="mt-2"><b>TOTAL:</b> {o.total || 'N/A'}</p>
                    </div>
                    {(o.status === 'SHIPPED' || o.status === 'CANCELLED') && (
                       <button disabled={sendingId === o.id} onClick={() => sendOrderEmail(o)} className="border border-white p-2 hover:bg-white hover:text-black uppercase text-[10px] font-bold disabled:opacity-30 mt-4">
                         {sendingId === o.id ? 'SENDING...' : (statusMsg || `Send ${o.lang === 'UA' ? 'UA' : 'EN'} Email`)}
                       </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {activeTab === 'subs' && filtered.map((s) => (
              <div key={s.id} className="border border-[#222] p-4 bg-[#111] flex justify-between items-center text-sm group">
                <div className="flex items-center gap-3">
                   <span className="cursor-pointer hover:text-white" onClick={() => copy(s.email)}>{s.email}</span>
                   <span className={`text-[9px] px-1.5 py-0.5 uppercase border ${s.client_status === 'VIP' ? 'border-yellow-500/50 text-yellow-500' : 'border-[#333] text-[#555]'}`}>
                     {s.client_status}
                   </span>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[#555] text-xs uppercase">{s.lang || 'EN'}</span>
                   <button onClick={() => deleteSub(s.email)} className="text-[#444] hover:text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              </div>
            ))}

            {activeTab === 'customers' && filtered.map((p) => {
              const isSubbed = subs.some(s => s.email === p.email);
              return (
                <div key={p.email} onClick={() => { setSelectedProfile(p); setExpandedOrderId(null); }} className="border border-[#222] p-4 bg-[#111] flex justify-between items-center cursor-pointer hover:border-white transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold ${p.client_status === 'VIP' ? 'text-yellow-500' : ''}`}>{p.email}</span>
                    {isSubbed && <span className="text-[9px] bg-green-900/30 text-green-500 border border-green-900 px-1.5 py-0.5">SUBSCRIBED</span>}
                  </div>
                  <div className="flex gap-4 text-[10px] uppercase text-[#555] items-center">
                    <span className={p.client_status === 'VIP' ? 'text-yellow-500 font-bold border border-yellow-500/30 px-2 py-0.5' : 'text-white'}>
                      {p.client_status || 'NEW'}
                    </span>
                    <span>{p.total_spent}€</span>
                    <span>{p.total_orders} orders</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ПОПАП КАРТОЧКИ КЛИЕНТА */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50" onClick={() => setSelectedProfile(null)}>
          <div className="bg-[#111] border border-[#333] p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-1">
               <h2 className="text-xl font-bold flex items-center gap-3">
                 {selectedProfile.email} 
                 {isProfileSubscribed && <span className="text-[10px] bg-green-900/30 text-green-500 border border-green-900 px-1.5 py-0.5 tracking-widest font-normal uppercase">Subscribed</span>}
               </h2>
            </div>
            
            <select 
                value={selectedProfile.client_status ? selectedProfile.client_status.replace(/['"]/g, '').trim() : 'NEW'} 
                onChange={(e) => updateProfile(selectedProfile.email, { client_status: e.target.value })}
                className="bg-[#222] text-[10px] uppercase p-1 mb-6 outline-none cursor-pointer hover:bg-[#333]"
            >
                <option value="NEW">NEW</option>
                <option value="REGULAR">REGULAR</option>
                <option value="VIP">VIP</option>
            </select>

            <div className="flex gap-8 mb-6 border-b border-[#222] pb-4">
              <div>
                <p className="text-[10px] text-[#555] uppercase">Total Spent</p>
                <p className="text-lg">{selectedProfile.total_spent}€</p>
              </div>
              <div>
                <p className="text-[10px] text-[#555] uppercase">Orders</p>
                <p className="text-lg">
                  {selectedProfile.total_orders} 
                  {cancelledOrdersCount > 0 && <span className="text-red-500 text-xs ml-2">(Cancelled: {cancelledOrdersCount})</span>}
                </p>
              </div>
            </div>
            
            <h3 className="text-sm font-bold mb-4">History</h3>
            <div className="space-y-2 mb-6">
              {customerHistory.map(o => {
                const isExpanded = expandedOrderId === o.id;
                return (
                  <div key={o.id} className="border border-[#222] bg-[#0a0a0a]">
                    <div 
                      onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                      className="text-xs flex justify-between p-2 cursor-pointer hover:bg-[#151515] transition-colors items-center"
                    >
                      <span className={o.status === 'CANCELLED' ? 'text-[#555]' : ''}>
                        #{o.id} - {o.status} <span className="text-[9px] text-[#444] ml-1">{isExpanded ? '▼' : '▶'}</span>
                      </span>
                      <span className={o.status === 'CANCELLED' ? 'text-[#555] line-through' : ''}>
                        {o.status === 'CANCELLED' ? '0' : o.total}€
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="p-2 border-t border-[#222] bg-[#111] text-[11px] text-[#aaa]">
                        {o.items?.split(',').map((item: string, idx: number) => {
                           const [name, qty] = item.split(' x');
                           return (
                             <p key={idx} className={`mb-0.5 ${o.status === 'CANCELLED' ? 'line-through text-[#444]' : ''}`}>
                               • {name.trim()} {qty ? <span className="text-white font-bold ml-1 px-1 bg-[#333] rounded text-[9px]">x{qty}</span> : ''}
                             </p>
                           );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={() => setSelectedProfile(null)} className="w-full border border-white py-2 text-xs font-bold uppercase hover:bg-white hover:text-black">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}