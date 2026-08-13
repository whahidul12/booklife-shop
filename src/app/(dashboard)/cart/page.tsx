import { Metadata } from "next";
import { CartContainer } from "@/features/cart/components/CartContainer";

export const metadata: Metadata = {
  title: "শপিং ব্যাগ - Cart | Wafilife",
  description: "View and manage your shopping cart items.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      <CartContainer />
    </div>
  );
}
