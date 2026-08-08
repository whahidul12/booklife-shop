import type { AppState } from "./types";

/**
 * INITIAL_STATE — always starts empty.
 *
 * Cart and wishlist are empty for every new user/session.
 * Data is persisted to sessionStorage and restored on page reload.
 * Demo / seed items have been removed — real data comes from the DB.
 */
export const INITIAL_STATE: AppState = {
  cart: [],
  wishlist: [],
  orders: [],
  profile: {
    name: "",
    gender: "Male",
    bloodGroup: "B+",
    phone: "",
    email: "",
  },
  addresses: [],
  reviews: [],
};
