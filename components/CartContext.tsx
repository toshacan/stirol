'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

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
            
            // Если в корзине уже лежит максимум, не увеличиваем количество
            if (currentQty >= maxStock) {
              return cartItem;
            }
            return { ...cartItem, quantity: currentQty + 1 };
          }
          return cartItem;
        });
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // ЛОГИКА С ПРОВЕРКОЙ ОСТАТКОВ НА СКЛАДЕ
  const updateQuantity = (index: number, action: 'increment' | 'decrement') => {
    setCart((prevCart) => {
      const item = prevCart[index];
      const currentQty = item.quantity || 1;
      const maxStock = Number(item.stock ?? 99); // Запасной вариант 99, если сток не прилетел

      if (action === 'increment') {
        // Жесткая проверка: если достигли лимита склада, блокируем инкремент
        if (currentQty >= maxStock) {
          return prevCart;
        }
        return prevCart.map((c, i) => 
          i === index ? { ...c, quantity: currentQty + 1 } : c
        );
      } else if (action === 'decrement') {
        if (currentQty > 1) {
          return prevCart.map((c, i) => 
            i === index ? { ...c, quantity: currentQty - 1 } : c
          );
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

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, totalItemsCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);