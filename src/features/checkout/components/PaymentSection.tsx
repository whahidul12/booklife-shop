import { PaymentOptionCard } from "./PaymentOptionCard";

interface PaymentSectionProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

export function PaymentSection({
  selectedMethod,
  onMethodSelect,
}: PaymentSectionProps) {
  return (
    <div className="space-y-6">
      {/* Cash On Delivery Section */}
      <div className="space-y-4 rounded border border-gray-200 bg-white p-5">
        <h4 className="text-sm font-semibold text-gray-600">
          পণ্য হাতে পেয়ে টাকা পরিশোধ করুন
        </h4>
        <div className="grid grid-cols-1">
          <PaymentOptionCard
            id="cod"
            name="ক্যাশ অন ডেলিভারি"
            isSelected={selectedMethod === "cod"}
            onSelect={() => onMethodSelect("cod")}
            isFullWidth
          />
        </div>
      </div>

      {/* Mobile Wallet / Cards Section */}
      <div className="space-y-4 rounded border border-gray-200 bg-white p-5">
        <h4 className="text-sm font-semibold text-gray-600">
          মোবাইল ওয়ালেটের অথবা কার্ডের মাধ্যমে টাকা পরিশোধ করুন
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <PaymentOptionCard
            id="bkash"
            name="bKash"
            logoUrl="/brand_logos/bKash.png"
            isSelected={selectedMethod === "bkash"}
            onSelect={() => onMethodSelect("bkash")}
          />
          <PaymentOptionCard
            id="nagad"
            name="Nagad"
            logoUrl="/brand_logos/nagad.png"
            isSelected={selectedMethod === "nagad"}
            onSelect={() => onMethodSelect("nagad")}
          />
          <PaymentOptionCard
            id="rocket"
            name="Rocket"
            logoUrl="/brand_logos/rocket.png"
            isSelected={selectedMethod === "rocket"}
            onSelect={() => onMethodSelect("rocket")}
          />
          <PaymentOptionCard
            id="visa"
            name="Visa / Mastercard"
            logoUrl="/brand_logos/visa.png"
            isSelected={selectedMethod === "visa"}
            onSelect={() => onMethodSelect("visa")}
          />
        </div>
      </div>
    </div>
  );
}
