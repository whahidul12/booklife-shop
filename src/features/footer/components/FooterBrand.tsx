import Link from "next/link";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";

export function FooterBrand() {
  return (
    <div className="space-y-4">
      {/* WafiLife Brand Logo */}
      <Link href="/" className="group inline-flex items-center gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-[#d92328]">
          WafiLife
        </span>
      </Link>

      {/* Description Text */}
      <p className="max-w-xs text-xs leading-relaxed text-gray-600">
        Wafilife is a leading book shop in Bangladesh. We offer thousands of
        islamic, general and academic books at a discounted price. We provide
        good packaging with low shipping cost all over the Bangladesh.
      </p>

      {/* Social Media Links */}
      <div className="flex items-center gap-2.5 pt-1">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="flex size-7 items-center justify-center rounded-full bg-[#3b5998] text-white transition-opacity hover:opacity-90"
        >
          <FaFacebook className="size-4 fill-current" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex size-7 items-center justify-center rounded-full bg-linear-to-tr from-amber-500 via-rose-500 to-purple-600 text-white transition-opacity hover:opacity-90"
        >
          <IoLogoInstagram className="size-4" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube"
          className="flex size-7 items-center justify-center rounded-full bg-[#ff0000] text-white transition-opacity hover:opacity-90"
        >
          <FaYoutube className="size-4 fill-current" />
        </a>
      </div>
    </div>
  );
}
