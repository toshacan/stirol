'use client';

interface SubscribersTabProps {
  subs: any[];
  copy: (text: string) => void;
  deleteSub: (email: string) => void;
}

export function SubscribersTab({ subs, copy, deleteSub }: SubscribersTabProps) {
  return (
    <div className="grid gap-4">
      {subs.map((s) => (
        <div key={s.id} className="border border-[#222] p-4 bg-[#111] flex justify-between items-center text-sm group">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:text-white" onClick={() => copy(s.email)}>
              {s.email}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 uppercase border ${
                s.client_status === 'VIP' ? 'border-yellow-500/50 text-yellow-500' : 'border-[#333] text-[#555]'
              }`}
            >
              {s.client_status}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#555] text-xs uppercase">{s.lang || 'EN'}</span>
            <button
              onClick={() => deleteSub(s.email)}
              className="text-[#444] hover:text-red-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}