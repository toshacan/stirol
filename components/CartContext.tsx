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
        const newCart = [...prevCart];
        newCart[existingItemIdx] = {
          ...newCart[existingItemIdx],
          quantity: (newCart[existingItemIdx].quantity || 1) + 1
        };
        return newCart;
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // ФУНКЦИЯ ИЗМЕНЕНИЯ КОЛИЧЕСТВА (- / +)
  const updateQuantity = (index: number, action: 'increment' | 'decrement') => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const currentQty = newCart[index].quantity || 1;

      if (action === 'increment') {
        newCart[index].quantity = currentQty + 1;
      } else if (action === 'decrement') {
        if (currentQty > 1) {
          newCart[index].quantity = currentQty - 1;
        } else {
          // Если жмут минус при количестве 1 — полностью удаляем айтем
          return prevCart.filter((_, i) => i !== index);
        }
      }
      return newCart;
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