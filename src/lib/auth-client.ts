/**
 * BetterAuth React client.
 *
 * Import this in Client Components for:
 *  - authClient.signIn.email()
 *  - authClient.signUp.email()
 *  - authClient.signOut()
 *  - authClient.useSession()  ← reactive hook
 *  - authClient.admin.*       ← admin operations (role changes, user list, etc.)
 *
 * Never import this in Server Components or Server Actions — use auth.api.* instead.
 */
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import {
  ac,
  adminRole,
  moderatorRole,
  customerRole,
  booksModeratorRole,
  authorsModeratorRole,
  publishersModeratorRole,
  subjectsModeratorRole,
  reviewsModeratorRole,
  couponsModeratorRole,
  marketingModeratorRole,
  ordersModeratorRole,
} from "@/lib/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        customer: customerRole,
        moderator: moderatorRole,
        admin: adminRole,
        books_mod: booksModeratorRole,
        authors_mod: authorsModeratorRole,
        publishers_mod: publishersModeratorRole,
        subjects_mod: subjectsModeratorRole,
        reviews_mod: reviewsModeratorRole,
        coupons_mod: couponsModeratorRole,
        marketing_mod: marketingModeratorRole,
        orders_mod: ordersModeratorRole,
      },
    }),
  ],
});

// Re-export the most-used hooks/methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
