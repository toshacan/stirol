'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // 1. Загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const parsedCart = JSON.parse(saved);
      setCart(parsedCart);
      syncPricesWithDB(parsedCart); // Синхронизируем сразу после загрузки
    }
  }, []);

  // 2. Функция синхронизации цен с БД
  const syncPricesWithDB = async (currentCart: any[]) => {
    if (currentCart.length === 0) return;

    const ids = currentCart.map(item => item.id);
    try {
      const res = await fetch('/api/get-cart-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      const { prices } = await res.json();

      // Обновляем цены в корзине, если они изменились
      setCart(prev => prev.map(item => ({
        ...item,
        price: prices[item.id] || item.price // Берем цену из БД, если она есть
      })));
    } catch (e) {
      console.error("Ошибка синхронизации цен", e);
    }
  };

  // 3. Сохранение в localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: any) => {
    setCart((prevCart) => {
      const existingItemIdx = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItemIdx > -1) {
        return prevCart.map((cartItem, idx) => {
          if (idx === existingItemIdx) {
            const currentQty = cartItem.quantity || 1;
            const maxStock = Number(cartItem.stock ?? 99);
            if (currentQty >= maxStock) return cartItem;
            return { ...cartItem, quantity: currentQty + 1 };
          }
          return cartItem;
        });
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (index: number, action: 'increment' | 'decrement') => {
    setCart((prevCart) => {
      const item = prevCart[index];
      const currentQty = item.quantity || 1;
      const maxStock = Number(item.stock ?? 99);

      if (action === 'increment') {
        if (currentQty >= maxStock) return prevCart;
        return prevCart.map((c, i) => (i === index ? { ...c, quantity: currentQty + 1 } : c));
      } else if (action === 'decrement') {
        if (currentQty > 1) {
          return prevCart.map((c, i) => (i === index ? { ...c, quantity: currentQty - 1 } : c));
        } else {
          return prevCart.filter((_, i) => i !== index);
        }
      }
      return prevCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const totalItemsCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItemsCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);