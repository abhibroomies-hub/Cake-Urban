import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, options?: Partial<CartItem>) => void;
  removeItem: (productId: string, weight?: number) => void;
  updateQuantity: (productId: string, quantity: number, weight?: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, options) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.id === product.id && item.selectedWeight === options?.selectedWeight
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id && item.selectedWeight === options?.selectedWeight
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1, ...options }] });
        }
      },
      removeItem: (productId, weight) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedWeight === weight)
          ),
        });
      },
      updateQuantity: (productId, quantity, weight) => {
        if (quantity <= 0) {
          get().removeItem(productId, weight);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === productId && item.selectedWeight === weight
              ? { ...item, quantity }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    { name: 'cakeurban-cart' }
  )
);

interface UIState {
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  isSearchOpen: false,
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
