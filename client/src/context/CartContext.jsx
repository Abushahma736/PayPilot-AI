import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], budget: null });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart/add', { productId, quantity });
    setCart(data);
    return data;
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await api.put('/cart/update', { productId, quantity });
    setCart(data);
    return data;
  };

  const removeFromCart = async (productId) => {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    setCart(data);
    return data;
  };

  const clearCart = async () => {
    const { data } = await api.delete('/cart/clear');
    setCart({ ...cart, items: [], budget: null });
    return data;
  };

  const setBudget = async (budget) => {
    const { data } = await api.put('/cart/budget', { budget });
    setCart(data);
    return data;
  };

  const cartTotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const isOverBudget = cart.budget && cartTotal > cart.budget;
  const remainingBudget = cart.budget ? cart.budget - cartTotal : null;

  return (
    <CartContext.Provider value={{
      cart, loading, cartTotal, cartCount, isOverBudget, remainingBudget,
      addToCart, updateQuantity, removeFromCart, clearCart, setBudget, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
