// frontend/src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth(); // Updated to use user and loading
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      setCartItems(response.data.items || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    if (user && user.role === 'customer') {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user, authLoading]);

  const addToCart = async (product) => {
    if (!user || user.role !== 'customer') {
      alert('Please sign in as a customer to add items to your cart.');
      return;
    }
  
    try {
      console.log('Sending add to cart request:', product);
      const response = await api.post('/cart/add', {
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
      console.log('Add to cart response:', response.data);
      setCartItems(response.data.items);
    } catch (err) {
      console.error('Error adding to cart:', err.response ? err.response.data : err.message);
    }
  };

  const updateQuantity = async (productId, change) => {
    const item = cartItems.find((item) => item.productId === productId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    try {
      const response = await api.put('/cart/update', {
        productId,
        quantity: newQuantity,
      });
      setCartItems(response.data.items);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/remove/${productId}`);
      setCartItems(response.data.items);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}