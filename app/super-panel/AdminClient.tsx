'use client';
import { useEffect, useState, useMemo } from 'react';
import { DashboardTab } from './components/DashboardTab';
import { OrdersTab } from './components/OrdersTab';
import { ProductsTab } from './components/ProductsTab';
import { SubscribersTab } from './components/SubscribersTab';
import { CustomersTab } from './components/CustomersTab';
import { CampaignModal } from './components/CampaignModal';
import { ProductModal } from './components/ProductModal';
import { CustomerModal } from './components/CustomerModal';

export default function AdminClient() {
  const [activeTab, setActiveTab] = useState<'orders' | 'subs' | 'dashboard' | 'customers' | 'products'>('orders');
  const [orders, setOrders] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('ALL');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  
  const [productForm, setProductForm] = useState({
    id: '',
    category: 'tshirts',
    title: '',
    price: '',
    status: '',
    description: '',
    description_ua: '', 
    variants: [] as { size: string; stock: number }[],
    imagesStr: '',
    colorVariants: [] as { name: string; hex: string; id: string }[],
    position: 0,
  });
  const [newColorVariant, setNewColorVariant] = useState({ name: '', hex: '#000000', id: '' });
  const [productSaving, setProductSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [customerFilter, setCustomerFilter] = useState<string>('ALL');

  const [subStatusFilter, setSubStatusFilter] = useState<string>('ALL');
  const [subLangFilter, setSubLangFilter] = useState<string>('ALL');

  const [sendingId, setSendingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isCopiedAll, setIsCopiedAll] = useState(false);

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const fetchData = async () => {
    if (orders.length === 0) {
      fetch('/api/get-orders').then((r) => r.json()).then((j) => setOrders(Array.isArray(j) ? j : []));
    }
    if (subs.length === 0) {
      fetch('/api/get-subs').then((r) => r.json()).then((j) => setSubs(Array.isArray(j) ? j : []));
    }
    if (profiles.length === 0) {
      fetch('/api/get-profiles').then((r) => r.json()).then((j) => {
        const cleanedProfiles = (Array.isArray(j) ? j : []).map((p) => ({
          ...p,
          client_status: p.client_status ? p.client_status.replace(/['"]/g, '').trim() : 'NEW',
        }));
        setProfiles(cleanedProfiles);
      });
    }
    if (products.length === 0 || activeTab === 'products') {
      fetch('/api/get-products').then((r) => r.json()).then((j) => setProducts(Array.isArray(j) ? j : []));
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const updateOrder = async (id: string, updates: any) => {
    setOrders((prev: any[]) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    await fetch('/api/update-order', {
      method: 'POST',
      body: JSON.stringify({ id, updates }),
    });
  };

  const updateProfile = async (email: string, updates: any) => {
    if (updates.client_status) {
      updates.client_status = updates.client_status.replace(/['"]/g, '').trim();
    }
    setProfiles((prev: any[]) => prev.map((p) => (p.email === email ? { ...p, ...updates } : p)));
    if (selectedProfile && selectedProfile.email === email) {
      setSelectedProfile((prev: any) => (prev ? { ...prev, ...updates } : null));
    }
    await fetch('/api/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, updates }),
    });
  };

  const deleteSub = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    setSubs((prev: any[]) => prev.filter((s) => s.email !== email));
    await fetch('/api/delete-sub', {
      method: 'POST',
      body: JSON.stringify({ email }),
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

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductForm({
      id: '',
      category: 'tshirts',
      title: '',
      price: '',
      status: '',
      description: '',
      description_ua: '', 
      variants: [],
      imagesStr: '',
      colorVariants: [],
      position: 0,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      id: p.id || '',
      category: p.category || 'tshirts',
      title: p.title || '',
      price: p.price || '',
      status: p.status || '',
      description: p.description || '',
      description_ua: p.description_ua || '', 
      variants: p.product_variants || p.variants || [],
      imagesStr: Array.isArray(p.images) ? p.images.join(', ') : p.images || '',
      colorVariants: p.color_variants || p.colorVariants || [],
      position: p.position || 0,
    });
    setIsProductModalOpen(true);
  };

  const saveProduct = async () => {
    if (!productForm.id || !productForm.title) {
      alert('ID and Title are required!');
      return;
    }
    setProductSaving(true);

    const imagesArray = productForm.imagesStr 
      ? productForm.imagesStr.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      id: productForm.id?.trim(),
      category: productForm.category,
      title: productForm.title?.trim(),
      price: productForm.price?.toString().trim(),
      status: productForm.status || null,
      description: productForm.description?.trim(),
      description_ua: productForm.description_ua?.trim() || null, 
      images: imagesArray,
      color_variants: productForm.colorVariants,
      is_active: true,
      variants: productForm.variants,
      position: Number(productForm.position) || 0,
    };

    const endpoint = editingProduct ? '/api/update-product' : '/api/add-product';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success || res.ok) {
        setIsProductModalOpen(false);
        fetch('/api/get-products').then((r) => r.json()).then((j) => setProducts(Array.isArray(j) ? j : []));
      } else {
        alert('Error saving product: ' + (result.error || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Save crash: ' + e.message);
    } finally {
      setProductSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm(`Delete product ${id}?`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await fetch('/api/delete-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  const updateProductStatus = async (id: string, newStatus: string) => {
    const statusVal = newStatus === 'DEFAULT' ? null : newStatus;
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: statusVal } : p)));
    await fetch('/api/update-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: statusVal }),
    });
  };

  const newOrdersCount = orders.filter((o) => o.status === 'NEW').length;
  const shippedOrders = orders.filter((o) => o.status === 'SHIPPED');
  const totalRevenue = shippedOrders.reduce((acc, o) => acc + (parseFloat(o.total) || 0), 0);

  const topItems: [string, number][] = useMemo(() => {
    const map: Record<string, number> = {};
    shippedOrders.forEach((o) => {
      if (o.items) {
        o.items.split(',').forEach((item: string) => {
          const [name, qtyStr] = item.split(' x');
          const qty = parseInt(qtyStr || '1', 10);
          const cleanName = name.trim();
          map[cleanName] = (map[cleanName] || 0) + qty;
        });
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [shippedOrders]);

  const totalItemsSold: number = topItems.reduce((acc, curr) => acc + curr[1], 0);

  const filtered = useMemo(() => {
    let data: any[] = [];
    if (activeTab === 'orders') data = orders;
    else if (activeTab === 'subs') {
      data = subs.map((s) => {
        const profile = profiles.find((p) => p.email === s.email);
        return { ...s, client_status: profile?.client_status || 'NEW' };
      });
    } else if (activeTab === 'customers') data = profiles;
    else if (activeTab === 'products') data = products;

    let result = [...data].filter((i) => {
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
      if (activeTab === 'products') {
        const matchesCategory = productCategoryFilter === 'ALL' || i.category === productCategoryFilter;
        return matchesSearch && matchesCategory;
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
  }, [orders, subs, profiles, products, activeTab, search, statusFilter, customerFilter, subStatusFilter, subLangFilter, productCategoryFilter]);

  const copyFilteredEmails = () => {
    if (activeTab !== 'subs') return;
    const allEmails = filtered.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setIsCopiedAll(true);
    setTimeout(() => setIsCopiedAll(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-[#ffffff] font-mono selection:bg-white selection:text-black">
      <aside className="w-64 border-r border-[#222] p-8 flex flex-col gap-6">
        <h2 className="text-sm font-bold tracking-widest uppercase">Stirol Admin</h2>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`text-left p-2 flex justify-between ${
              activeTab === 'orders' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'
            }`}
          >
            ORDERS{' '}
            {newOrdersCount > 0 && (
              <span className="bg-red-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-full">
                {newOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`text-left p-2 ${
              activeTab === 'products' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'
            }`}
          >
            PRODUCTS
          </button>
          <button
            onClick={() => setActiveTab('subs')}
            className={`text-left p-2 ${
              activeTab === 'subs' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'
            }`}
          >
            SUBSCRIBERS
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`text-left p-2 ${
              activeTab === 'dashboard' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'
            }`}
          >
            DASHBOARD
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`text-left p-2 ${
              activeTab === 'customers' ? 'bg-[#1a1a1a] text-white' : 'text-[#555] hover:text-white'
            }`}
          >
            CUSTOMERS
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          {activeTab !== 'dashboard' && (
            <div className="flex flex-col mb-8 gap-4">
              <div className="flex gap-4">
                <input
                  placeholder="SEARCH..."
                  className="flex-1 bg-[#111] border border-[#333] p-4 outline-none focus:border-white text-sm"
                  onChange={(e) => setSearch(e.target.value)}
                />
                {activeTab === 'subs' && (
                  <>
                    <button
                      onClick={copyFilteredEmails}
                      className="bg-white text-black px-6 py-4 text-xs font-bold hover:bg-gray-200 uppercase"
                    >
                      {isCopiedAll ? 'COPIED!' : 'Copy Filtered Emails'}
                    </button>
                    <button
                      onClick={() => setIsCampaignModalOpen(true)}
                      className="bg-red-600 text-white px-6 py-4 text-xs font-bold hover:bg-red-700 uppercase"
                    >
                      Create Campaign
                    </button>
                  </>
                )}
              </div>

              {activeTab === 'orders' && (
                <div className="flex gap-2">
                  {['ALL', 'NEW', 'PACKING', 'SHIPPED', 'CANCELLED'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-4 py-1 text-[10px] border ${
                        statusFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'products' && (
                <div className="flex justify-between items-center w-full">
                  <div className="flex gap-2">
                    {['ALL', 'tshirts', 'hoodies', 'shoppers'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setProductCategoryFilter(c)}
                        className={`px-4 py-1 text-[10px] uppercase border ${
                          productCategoryFilter === c ? 'bg-white text-black' : 'border-[#333] text-[#555]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={openAddProductModal}
                    className="bg-white text-black px-6 py-2.5 text-xs font-bold hover:bg-gray-200 uppercase"
                  >
                    + Add Product
                  </button>
                </div>
              )}

              {activeTab === 'subs' && (
                <div className="flex gap-6 items-center">
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#555] uppercase">Status:</span>
                    {['ALL', 'NEW', 'REGULAR', 'VIP'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubStatusFilter(s)}
                        className={`px-3 py-1 text-[10px] border ${
                          subStatusFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-[#555] uppercase">Lang:</span>
                    {['ALL', 'EN', 'UA'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setSubLangFilter(l)}
                        className={`px-3 py-1 text-[10px] border ${
                          subLangFilter === l ? 'bg-white text-black' : 'border-[#333] text-[#555]'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'customers' && (
                <div className="flex gap-2">
                  {['ALL', 'NEW', 'REGULAR', 'VIP'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCustomerFilter(s)}
                      className={`px-4 py-1 text-[10px] border ${
                        customerFilter === s ? 'bg-white text-black' : 'border-[#333] text-[#555]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <DashboardTab totalRevenue={totalRevenue} totalItemsSold={totalItemsSold} topItems={topItems} />
          )}
          {activeTab === 'orders' && (
            <OrdersTab
              orders={filtered}
              updateOrder={updateOrder}
              setOrders={setOrders}
              copy={copy}
              sendOrderEmail={sendOrderEmail}
              sendingId={sendingId}
              statusMsg={statusMsg}
            />
          )}
          {activeTab === 'products' && (
            <ProductsTab
              products={filtered}
              onEdit={openEditProductModal}
              onDelete={deleteProduct}
              onStatusChange={updateProductStatus}
            />
          )}
          {activeTab === 'subs' && <SubscribersTab subs={filtered} copy={copy} deleteSub={deleteSub} />}
          {activeTab === 'customers' && (
            <CustomersTab
              customers={filtered}
              subs={subs}
              onSelectCustomer={(c) => setSelectedProfile(c)}
            />
          )}
        </div>
      </main>

      <CampaignModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        subscribers={filtered}
      />
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        editingProduct={editingProduct}
        productForm={productForm}
        setProductForm={setProductForm}
        newColorVariant={newColorVariant}
        setNewColorVariant={setNewColorVariant}
        saveProduct={saveProduct}
        productSaving={productSaving}
      />
      <CustomerModal
        selectedProfile={selectedProfile}
        onClose={() => setSelectedProfile(null)}
        updateProfile={updateProfile}
        orders={orders}
        subs={subs}
      />
    </div>
  );
}