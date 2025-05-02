import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartStore {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

type CartState = {
  items: CartItem[]
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (item: CartItem) =>
        set((state: CartState) => {
          const existingItem = state.items.find((i: CartItem) => i.id === item.id)
          if (existingItem) {
            return {
              items: state.items.map((i: CartItem) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeFromCart: (id: string) =>
        set((state: CartState) => ({
          items: state.items.filter((item: CartItem) => item.id !== id),
        })),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => ({
          items: state.items.map((item: CartItem) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
) 