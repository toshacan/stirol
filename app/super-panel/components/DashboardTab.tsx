'use client';

interface DashboardTabProps {
  totalRevenue: number;
  totalItemsSold: number;
  topItems: [string, number][];
}

export function DashboardTab({ totalRevenue, totalItemsSold, topItems }: DashboardTabProps) {
  return (
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
        {topItems.map(([name, count], idx) => (
          <div key={idx} className="flex justify-between py-2 border-b border-[#222] text-sm">
            <span>{name}</span> <b>{count} sold</b>
          </div>
        ))}
      </div>
    </div>
  );
}