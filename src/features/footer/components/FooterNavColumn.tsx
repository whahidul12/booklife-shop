import Link from "next/link";
import { FooterLink } from "../constants/footerData.const";

interface FooterNavColumnProps {
  title: string;
  links: FooterLink[];
}

export function FooterNavColumn({ title, links }: FooterNavColumnProps) {
  return (
    <div className="space-y-3.5">
      <h3 className="text-sm font-bold tracking-wide text-gray-800">{title}</h3>
      <ul className="space-y-2 text-xs text-gray-600">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="inline-block transition-colors duration-150 hover:text-[#d92328]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
