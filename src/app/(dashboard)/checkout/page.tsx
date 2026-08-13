import { CheckoutPage } from "@/features/checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "শপিং ব্যাগ - Cart | Wafilife",
  description: "View and manage your shopping cart items.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <CheckoutPage />
    </div>
  );
}
