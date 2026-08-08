import { MapPin, Phone, Mail } from "lucide-react";
import { CONTACT_INFO } from "../constants/footerData.const";

export function FooterContact() {
  return (
    <div className="space-y-3.5">
      <h3 className="text-sm font-bold tracking-wide text-gray-800">যোগাযোগ</h3>
      <div className="space-y-3 text-xs text-gray-600">
        {/* Head Office Address */}
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 size-4 shrink-0 text-gray-400" />
          <p className="leading-snug">
            <span className="font-semibold text-gray-700">Head Office:</span>
            <br />
            {CONTACT_INFO.address}
          </p>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-2.5">
          <Phone className="size-4 shrink-0 text-gray-400" />
          <p>
            <span className="font-semibold text-gray-700">Phone:</span>
            <br />
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className="transition-colors hover:text-[#d92328]"
            >
              {CONTACT_INFO.phone}
            </a>
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2.5">
          <Mail className="size-4 shrink-0 text-gray-400" />
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="transition-colors hover:text-[#d92328]"
          >
            {CONTACT_INFO.email}
          </a>
        </div>
      </div>
    </div>
  );
}
