'use client';
import { useState } from 'react';

interface CustomerModalProps {
  selectedProfile: any | null;
  onClose: () => void;
  updateProfile: (email: string, updates: any) => void;
  orders: any[];
  subs: any[];
}

export function CustomerModal({
  selectedProfile,
  onClose,
  updateProfile,
  orders,
  subs,
}: CustomerModalProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  if (!selectedProfile) return null;

  // 1. Фильтруем всю историю заказов этого пользователя
  const customerHistory = orders.filter((o) => o.email === selectedProfile.email);
  
  // 2. ДИНАМИЧЕСКИЙ ПОДСЧЕТ ПОТРАЧЕННЫХ ДЕНЕГ (Только для статуса SHIPPED)
  const shippedOrders = customerHistory.filter((o) => o.status?.toUpperCase() === 'SHIPPED');
  const totalSpentReal = shippedOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  
  // 3. Динамический подсчет количества заказов
  const totalOrdersReal = customerHistory.length;
  const cancelledOrdersCount = customerHistory.filter((o) => o.status?.toUpperCase() === 'CANCELLED').length;
  const isProfileSubscribed = subs.some((s) => s.email === selectedProfile.email);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-8 z-50" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#333] p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold flex items-center gap-3">
            {selectedProfile.email}
            {isProfileSubscribed && (
              <span className="text-[10px] bg-green-900/30 text-green-500 border border-green-900 px-1.5 py-0.5 tracking-widest font-normal uppercase">
                Subscribed
              </span>
            )}
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
            {/* Выводим динамически рассчитанную сумму только отправленных товаров */}
            <p className="text-lg">{totalSpentReal}€</p>
          </div>
          <div>
            <p className="text-[10px] text-[#555] uppercase">Orders</p>
            <p className="text-lg">
              {totalOrdersReal}
              {cancelledOrdersCount > 0 && (
                <span className="text-red-500 text-xs ml-2">(Cancelled: {cancelledOrdersCount})</span>
              )}
            </p>
          </div>
        </div>

        <h3 className="text-sm font-bold mb-4">History</h3>
        <div className="space-y-2 mb-6">
          {customerHistory.map((o) => {
            const isExpanded = expandedOrderId === o.id;
            const isCancelled = o.status?.toUpperCase() === 'CANCELLED';
            return (
              <div key={o.id} className="border border-[#222] bg-[#0a0a0a]">
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                  className="text-xs flex justify-between p-2 cursor-pointer hover:bg-[#151515] transition-colors items-center"
                >
                  <span className={isCancelled ? 'text-[#555]' : ''}>
                    #{o.id} - {o.status} <span className="text-[9px] text-[#444] ml-1">{isExpanded ? '▼' : '▶'}</span>
                  </span>
                  <span className={isCancelled ? 'text-[#555] line-through' : ''}>
                    {isCancelled ? '0' : o.total}€
                  </span>
                </div>

                {isExpanded && (
                  <div className="p-2 border-t border-[#222] bg-[#111] text-[11px] text-[#aaa]">
                    {o.items?.split(',').map((item: string, idx: number) => {
                      const [name, qty] = item.split(' x');
                      return (
                        <p
                          key={idx}
                          className={`mb-0.5 ${isCancelled ? 'line-through text-[#444]' : ''}`}
                        >
                          • {name.trim()}{' '}
                          {qty ? (
                            <span className="text-white font-bold ml-1 px-1 bg-[#333] rounded text-[9px]">x{qty}</span>
                          ) : (
                            ''
                          )}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="w-full border border-white py-2 text-xs font-bold uppercase hover:bg-white hover:text-black"
        >
          Close
        </button>
      </div>
    </div>
  );
}