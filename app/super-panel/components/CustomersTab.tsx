'use client';

interface CustomersTabProps {
  customers: any[];
  subs: any[];
  onSelectCustomer: (customer: any) => void;
}

export function CustomersTab({ customers, subs, onSelectCustomer }: CustomersTabProps) {
  return (
    <div className="grid gap-4">
      {customers.map((p) => {
        // Сравнение без учета регистра, чтобы подписка находилась всегда
        const isSubbed = subs.some(
          (s) => (s.email || '').toLowerCase() === (p.email || '').toLowerCase()
        );
        return (
          <div
            key={p.email}
            onClick={() => onSelectCustomer(p)}
            className="border border-[#222] p-4 bg-[#111] flex justify-between items-center cursor-pointer hover:border-white transition-all"
          >
            <div className="flex items-center gap-3">
              <span className={`font-bold ${p.client_status === 'VIP' ? 'text-yellow-500' : ''}`}>{p.email}</span>
              {isSubbed && (
                <span className="text-[9px] bg-green-900/30 text-green-500 border border-green-900 px-1.5 py-0.5">
                  SUBSCRIBED
                </span>
              )}
            </div>
            <div className="flex gap-4 text-[10px] uppercase text-[#555] items-center">
              <span
                className={
                  p.client_status === 'VIP'
                    ? 'text-yellow-500 font-bold border border-yellow-500/30 px-2 py-0.5'
                    : 'text-white'
                }
              >
                {p.client_status || 'NEW'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}