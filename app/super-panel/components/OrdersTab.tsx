'use client';

interface OrdersTabProps {
  orders: any[];
  updateOrder: (id: string, updates: any) => void;
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  copy: (text: string) => void;
  sendOrderEmail: (order: any) => void;
  sendingId: string | null;
  statusMsg: string | null;
}

export function OrdersTab({
  orders,
  updateOrder,
  setOrders,
  copy,
  sendOrderEmail,
  sendingId,
  statusMsg,
}: OrdersTabProps) {
  return (
    <div className="grid gap-4">
      {/* Новые заказы сверху, старые снизу */}
      {[...orders].reverse().map((o) => (
        <div key={o.id} className="border border-[#222] bg-[#111] p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">
                {o.name} <span className="text-[#444]">#{o.id}</span>
                <span className="ml-2 text-[10px] bg-[#222] px-2 py-1 uppercase">{o.lang || 'EN'}</span>
              </h3>
              <div className="text-[11px] mt-2 text-[#888] flex gap-4">
                <span className="cursor-pointer hover:text-white" onClick={() => copy(o.email)}>
                  {o.email}
                </span>
                <span className="cursor-pointer hover:text-white" onClick={() => copy(o.phone)}>
                  {o.phone}
                </span>
              </div>
            </div>
            <select
              defaultValue={o.status || 'NEW'}
              className="bg-[#222] text-xs p-2 uppercase outline-none cursor-pointer"
              onChange={(e) => updateOrder(o.id, { status: e.target.value })}
            >
              <option value="NEW">NEW</option>
              <option value="PACKING">PACKING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs border-t border-[#222] pt-4">
            <div>
              <p className="text-[#555] uppercase">Address</p>
              <p>
                {o.address}, {o.city}, {o.zip}
              </p>
              <input
                type="text"
                placeholder="Tracking..."
                value={o.tracking || ''}
                className="bg-[#0a0a0a] border border-[#333] p-1 mt-2 w-full"
                onChange={(e) =>
                  setOrders((prev) =>
                    prev.map((item) => (item.id === o.id ? { ...item, tracking: e.target.value } : item))
                  )
                }
                onBlur={(e) => updateOrder(o.id, { tracking: e.target.value })}
              />
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[#555] uppercase">Items</p>
                {o.items?.split(',').map((item: string, idx: number) => {
                  const [name, qty] = item.split(' x');
                  return (
                    <p key={idx} className="mb-0.5">
                      • {name.trim()}{' '}
                      {qty ? <span className="text-white font-bold ml-1 px-1.5 bg-[#333] rounded">x{qty}</span> : ''}
                    </p>
                  );
                })}
                
                {/* ИСПРАВЛЕННАЯ ЛОГИКА СУММЫ ЗАКАЗА */}
                <p className="mt-2 font-mono">
                  <b>TOTAL:</b> {o.status === 'SHIPPED' ? (o.total || '0€') : '0€'}
                  {o.status !== 'SHIPPED' && (
                    <span className="text-[#555] text-[10px] ml-2">
                      ({o.total || '0€'} {o.status === 'CANCELLED' ? 'cancelled' : 'pending'})
                    </span>
                  )}
                </p>
              </div>
              {(o.status === 'SHIPPED' || o.status === 'CANCELLED') && (
                <button
                  disabled={sendingId === o.id}
                  onClick={() => sendOrderEmail(o)}
                  className="border border-white p-2 hover:bg-white hover:text-black uppercase text-[10px] font-bold disabled:opacity-30 mt-4"
                >
                  {sendingId === o.id ? 'SENDING...' : statusMsg || `Send ${o.lang === 'UA' ? 'UA' : 'EN'} Email`}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}