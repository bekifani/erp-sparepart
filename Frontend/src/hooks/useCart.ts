import { useState, useEffect } from 'react';
import { Cart, CartItem, Product } from '@/types/product';
import { toast } from '@/hooks/use-toast';

const CART_STORAGE_KEY = 'komiparts_cart';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert date strings back to Date objects
        parsedCart.lastEditDate = new Date(parsedCart.lastEditDate);
        parsedCart.firstEditDate = new Date(parsedCart.firstEditDate);
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          dateAdded: new Date(item.dateAdded)
        }));
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const createCart = (customer: string) => {
    const newCart: Cart = {
      id: Date.now().toString(),
      customer,
      items: [],
      totalWeight: 0,
      totalVolume: 0,
      totalAmount: 0,
      lastEditDate: new Date(),
      firstEditDate: new Date(),
      status: 'active'
    };
    setCart(newCart);
    return newCart;
  };

  const addToCart = (product: Product, quantity: number = 1, customPrice?: number) => {
    if (!cart) {
      // For demo purposes, create a default cart
      const newCart = createCart('Demo Customer');
      const item: CartItem = {
        product,
        quantity,
        dateAdded: new Date(),
        customPrice
      };
      newCart.items = [item];
      updateCartTotals(newCart);
      setCart(newCart);
      toast({
        title: "Added to Cart",
        description: `${product.description} has been added to your cart.`,
      });
      return;
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.id === product.id
    );

    const updatedCart = { ...cart };

    if (existingItemIndex >= 0) {
      // Update existing item
      updatedCart.items[existingItemIndex].quantity += quantity;
      updatedCart.items[existingItemIndex].dateAdded = new Date();
      if (customPrice !== undefined) {
        updatedCart.items[existingItemIndex].customPrice = customPrice;
      }
    } else {
      // Add new item
      const newItem: CartItem = {
        product,
        quantity,
        dateAdded: new Date(),
        customPrice
      };
      updatedCart.items.push(newItem);
    }

    updatedCart.lastEditDate = new Date();
    updateCartTotals(updatedCart);
    setCart(updatedCart);

    toast({
      title: "Added to Cart",
      description: `${product.description} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: number) => {
    if (!cart) return;

    const updatedCart = {
      ...cart,
      items: cart.items.filter(item => item.product.id !== productId),
      lastEditDate: new Date()
    };

    updateCartTotals(updatedCart);
    setCart(updatedCart);

    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!cart) return;

    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = {
      ...cart,
      items: cart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity, dateAdded: new Date() }
          : item
      ),
      lastEditDate: new Date()
    };

    updateCartTotals(updatedCart);
    setCart(updatedCart);
  };

  const updateCartTotals = (cart: Cart) => {
    cart.totalWeight = cart.items.reduce((total, item) => {
      const weight = item.product.net_weight || 0;
      return total + (weight * item.quantity);
    }, 0);

    cart.totalVolume = cart.items.reduce((total, item) => {
      const volume = item.product.volume || 0;
      return total + (volume * item.quantity);
    }, 0);

    cart.totalAmount = cart.items.reduce((total, item) => {
      const price = item.customPrice || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const clearCart = () => {
    setCart(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast({
      title: "Cart Cleared",
      description: "Your cart has been cleared.",
    });
  };

  const getTotalItems = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const confirmCart = () => {
    if (!cart) return;

    const updatedCart = {
      ...cart,
      status: 'confirmed' as const,
      lastEditDate: new Date()
    };

    setCart(updatedCart);
    toast({
      title: "Order Confirmed",
      description: "Your order has been confirmed and sent for processing.",
    });
  };

  return {
    cart,
    createCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    confirmCart
  };
};