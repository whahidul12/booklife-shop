"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AppState,
  CartItem,
  WishlistItem,
  Order,
  Address,
  UserProfile,
  BookReview,
} from "./types";
import { INITIAL_STATE } from "./initialState";
import {
  getCartAction,
  addToCartAction,
  updateCartQuantityAction,
  removeFromCartAction,
  clearCartAction,
} from "@/features/cart/actions/cart.actions";
import {
  getWishlistAction,
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/features/wishlist/actions/wishlist.actions";

const SESSION_KEY = "booklife_store_v2";
const DELIVERY_FEE = 65;

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

function loadState(): AppState {
  if (typeof window === "undefined") return INITIAL_STATE;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return INITIAL_STATE;
    const stored = JSON.parse(raw) as Partial<AppState>;
    // Stored value always wins — never fall back to seeded demo data
    return {
      ...INITIAL_STATE,
      ...stored,
    };
  } catch {
    return INITIAL_STATE;
  }
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* quota exceeded — ignore */
  }
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─────────────────────────────────────────────
//  Context shape
// ─────────────────────────────────────────────

interface CartCalculations {
  rawPrice: number;
  totalDiscount: number;
  currentSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
}

interface AppStoreContextValue {
  // ── State ──────────────────────────────────
  cart: CartItem[];
  wishlist: WishlistItem[];
  orders: Order[];
  profile: UserProfile;
  addresses: Address[];
  reviews: BookReview[];

  // ── Derived ────────────────────────────────
  cartCount: number;
  wishlistCount: number;
  cartCalc: CartCalculations;

  // ── Cart ───────────────────────────────────
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;

  // ── Wishlist ────────────────────────────────
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  moveToCart: (id: string) => void;

  // ── Orders ──────────────────────────────────
  placeOrder: (
    paymentMethod: string,
    deliveryNote: string,
    couponDiscount: number,
  ) => Order;

  // ── Profile ─────────────────────────────────
  updateProfile: (data: Partial<UserProfile>) => void;

  // ── Addresses ───────────────────────────────
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, data: Partial<Omit<Address, "id">>) => void;
  deleteAddress: (id: string) => void;

  // ── Reviews ─────────────────────────────────
  submitReview: (review: Omit<BookReview, "id" | "date">) => void;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

// ─────────────────────────────────────────────
//  Provider
// ─────────────────────────────────────────────

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const isHydrated = useRef(false);

  // Hydrate from localStorage + sync from Neon DB on mount
  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    isHydrated.current = true;

    // Load cart from DB if user is authenticated
    getCartAction().then((res) => {
      if (res.data) {
        setState((prev) => ({
          ...prev,
          cart: res.data.map((item) => ({
            id: item.bookId,
            title: item.title,
            author: item.author,
            currentPrice: item.currentPrice,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        }));
      }
    });

    // Load wishlist from DB if user is authenticated
    getWishlistAction().then((res) => {
      if (res.data) {
        setState((prev) => ({
          ...prev,
          wishlist: res.data.map((item) => ({
            id: item.bookId,
            title: item.title,
            author: item.author,
            currentPrice: item.currentPrice,
            originalPrice: item.originalPrice,
            imageUrl: item.imageUrl,
          })),
        }));
      }
    });
  }, []);

  // Persist to localStorage on every state change (after hydration)
  useEffect(() => {
    if (isHydrated.current) {
      saveState(state);
    }
  }, [state]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const cartCount = useMemo(
    () => state.cart.reduce((sum, i) => sum + i.quantity, 0),
    [state.cart],
  );

  const wishlistCount = useMemo(() => state.wishlist.length, [state.wishlist]);

  const cartCalc = useMemo((): CartCalculations => {
    const rawPrice = state.cart.reduce(
      (s, i) => s + i.originalPrice * i.quantity,
      0,
    );
    const currentSubtotal = state.cart.reduce(
      (s, i) => s + i.currentPrice * i.quantity,
      0,
    );
    const totalDiscount = rawPrice - currentSubtotal;
    const fee = state.cart.length > 0 ? DELIVERY_FEE : 0;
    const grandTotal = state.cart.length > 0 ? currentSubtotal + fee : 0;
    return {
      rawPrice,
      totalDiscount,
      currentSubtotal,
      deliveryFee: fee,
      grandTotal,
    };
  }, [state.cart]);

  // ── Cart ────────────────────────────────────────────────────────────────

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    // Persist to DB
    addToCartAction(item.id, 1).catch(() => {});

    // Update optimistic UI
    setState((prev) => {
      const exists = prev.cart.find((c) => c.id === item.id);
      if (exists) {
        return {
          ...prev,
          cart: prev.cart.map((c) =>
            c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
          ),
        };
      }
      return { ...prev, cart: [...prev.cart, { ...item, quantity: 1 }] };
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    // Persist to DB
    removeFromCartAction(id).catch(() => {});

    // Update optimistic UI
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((c) => c.id !== id),
    }));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    // Persist to DB
    updateCartQuantityAction(id, delta).catch(() => {});

    // Update optimistic UI
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((c) =>
          c.id === id ? { ...c, quantity: c.quantity + delta } : c,
        )
        .filter((c) => c.quantity > 0),
    }));
  }, []);

  const clearCart = useCallback(() => {
    // Persist to DB
    clearCartAction().catch(() => {});

    // Update optimistic UI
    setState((prev) => ({ ...prev, cart: [] }));
  }, []);

  const isInCart = useCallback(
    (id: string) => state.cart.some((c) => c.id === id),
    [state.cart],
  );

  // ── Wishlist ───────────────────────────────────────────────────────────

  const addToWishlist = useCallback((item: WishlistItem) => {
    // Persist to DB
    addToWishlistAction(item.id).catch(() => {});

    // Update optimistic UI
    setState((prev) => {
      if (prev.wishlist.some((w) => w.id === item.id)) return prev;
      return { ...prev, wishlist: [...prev.wishlist, item] };
    });
  }, []);

  const removeFromWishlist = useCallback((id: string) => {
    // Persist to DB
    removeFromWishlistAction(id).catch(() => {});

    // Update optimistic UI
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
  }, []);

  const isInWishlist = useCallback(
    (id: string) => state.wishlist.some((w) => w.id === id),
    [state.wishlist],
  );

  const moveToCart = useCallback((id: string) => {
    removeFromWishlistAction(id).catch(() => {});
    addToCartAction(id, 1).catch(() => {});

    setState((prev) => {
      const item = prev.wishlist.find((w) => w.id === id);
      if (!item) return prev;
      const newWishlist = prev.wishlist.filter((w) => w.id !== id);
      const exists = prev.cart.find((c) => c.id === id);
      const newCart = exists
        ? prev.cart.map((c) =>
            c.id === id ? { ...c, quantity: c.quantity + 1 } : c,
          )
        : [
            ...prev.cart,
            {
              id: item.id,
              title: item.title,
              author: item.author,
              currentPrice: item.currentPrice,
              originalPrice: item.originalPrice,
              quantity: 1,
              imageUrl: item.imageUrl,
            },
          ];
      return { ...prev, wishlist: newWishlist, cart: newCart };
    });
  }, []);

  // ── Orders ─────────────────────────────────────────────────────────────

  const placeOrder = useCallback(
    (
      paymentMethod: string,
      deliveryNote: string,
      couponDiscount: number,
    ): Order => {
      let createdOrder!: Order;
      setState((prev) => {
        const rawPrice = prev.cart.reduce(
          (s, i) => s + i.originalPrice * i.quantity,
          0,
        );
        const subtotal = prev.cart.reduce(
          (s, i) => s + i.currentPrice * i.quantity,
          0,
        );
        const fee = prev.cart.length > 0 ? DELIVERY_FEE : 0;
        const total = Math.max(0, subtotal - couponDiscount + fee);

        createdOrder = {
          id: `ORD-${generateId().toUpperCase()}`,
          date: new Date().toISOString(),
          status: "Processing",
          total,
          items: [...prev.cart],
          paymentMethod,
          deliveryNote,
        };
        return { ...prev, cart: [], orders: [createdOrder, ...prev.orders] };
      });
      return createdOrder;
    },
    [],
  );

  // ── Profile ────────────────────────────────────────────────────────────

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setState((prev) => ({ ...prev, profile: { ...prev.profile, ...data } }));
  }, []);

  // ── Addresses ─────────────────────────────────────────────────────────

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setState((prev) => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { ...address, id: `addr-${generateId()}` },
      ],
    }));
  }, []);

  const updateAddress = useCallback(
    (id: string, data: Partial<Omit<Address, "id">>) => {
      setState((prev) => ({
        ...prev,
        addresses: prev.addresses.map((a) =>
          a.id === id ? { ...a, ...data } : a,
        ),
      }));
    },
    [],
  );

  const deleteAddress = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
  }, []);

  // ── Reviews ────────────────────────────────────────────────────────────

  const submitReview = useCallback(
    (review: Omit<BookReview, "id" | "date">) => {
      setState((prev) => ({
        ...prev,
        reviews: [
          {
            ...review,
            id: `rev-${generateId()}`,
            date: new Date().toISOString(),
          },
          ...prev.reviews,
        ],
      }));
    },
    [],
  );

  // ── Value ──────────────────────────────────────────────────────────────

  const value = useMemo<AppStoreContextValue>(
    () => ({
      cart: state.cart,
      wishlist: state.wishlist,
      orders: state.orders,
      profile: state.profile,
      addresses: state.addresses,
      reviews: state.reviews,
      cartCount,
      wishlistCount,
      cartCalc,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart,
      placeOrder,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      submitReview,
    }),
    [
      state,
      cartCount,
      wishlistCount,
      cartCalc,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      moveToCart,
      placeOrder,
      updateProfile,
      addAddress,
      updateAddress,
      deleteAddress,
      submitReview,
    ],
  );

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreContextValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore must be used inside <AppStoreProvider>");
  }
  return ctx;
}
