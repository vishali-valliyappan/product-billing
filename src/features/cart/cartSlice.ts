// src/features/cart/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../types";

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      const existing = state.items.find((i) => i.id === action.payload);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

// ---------- Selectors ----------
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ---------- Offers ----------
export const selectOffers = (state: { cart: CartState }) => {
  const items = state.cart.items;
  const offers: { productId: number; description: string; saving: number }[] =
    [];

  const getQty = (name: string) =>
    items.find((i) => i.name === name)?.quantity ?? 0;
  const getPrice = (name: string) =>
    items.find((i) => i.name === name)?.price ?? 0;

  // Cheese: Buy 1 get 1 free
  const cheeseQty = getQty("Cheese");
  const cheesePrice = getPrice("Cheese");
  if (cheeseQty >= 2) {
    const freeCheese = Math.floor(cheeseQty / 2);
    const saving = freeCheese * cheesePrice;
    const cheeseItem = items.find((i) => i.name === "Cheese");
    if (cheeseItem) {
      offers.push({
        productId: cheeseItem.id,
        description: "Buy one Cheese, get one free",
        saving,
      });
    }
  }

  // Bread: Half-price with Soup
  const soupQty = getQty("Soup");
  const breadQty = getQty("Bread");
  const breadPrice = getPrice("Bread");
  if (soupQty > 0 && breadQty > 0) {
    const eligibleBreads = Math.min(soupQty, breadQty);
    const saving = eligibleBreads * (breadPrice / 2);
    const breadItem = items.find((i) => i.name === "Bread");
    if (breadItem) {
      offers.push({
        productId: breadItem.id,
        description: "Half price Bread with Soup",
        saving,
      });
    }
  }

  // Butter: 1/3 off
  const butterQty = getQty("Butter");
  const butterPrice = getPrice("Butter");
  if (butterQty > 0) {
    const saving = (1 / 3) * butterPrice * butterQty;
    const butterItem = items.find((i) => i.name === "Butter");
    if (butterItem) {
      offers.push({
        productId: butterItem.id,
        description: "One third off Butter",
        saving,
      });
    }
  }

  return offers;
};

export const selectTotal = (state: { cart: CartState }) => {
  const subtotal = selectSubtotal(state);
  const offers = selectOffers(state);
  const totalSavings = offers.reduce((sum, o) => sum + o.saving, 0);
  return subtotal - totalSavings;
};

export default cartSlice.reducer;
