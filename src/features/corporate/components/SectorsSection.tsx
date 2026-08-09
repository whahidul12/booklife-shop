import {
  Building2,
  BookOpen,
  GraduationCap,
  Landmark,
  Users,
  Briefcase,
  Library,
} from "lucide-react";
import { SectorCard } from "./SectorCard";

export function SectorsSection() {
  const sectors = [
    {
      icon: <Building2 size={40} className="text-red-800" />,
      title: "স্কুল ও কলেজ",
    },
    {
      icon: <BookOpen size={40} className="text-green-700" />,
      title: "মাদ্রাসা",
    },
    {
      icon: <GraduationCap size={40} className="text-blue-700" />,
      title: "বিশ্ববিদ্যালয়",
    },
    {
      icon: <Landmark size={40} className="text-teal-700" />,
      title: "মসজিদ ও ইসলামিক সেন্টার",
    },
    {
      icon: <Landmark size={40} className="text-gray-600" />,
      title: "সরকারি প্রতিষ্ঠান",
    },
    {
      icon: <Users size={40} className="text-yellow-600" />,
      title: "বেসরকারি সংস্থা (NGO)",
    },
    {
      icon: <Briefcase size={40} className="text-blue-500" />,
      title: "কর্পোরেট অফিস",
    },
    {
      icon: <Library size={40} className="text-indigo-800" />,
      title: "লাইব্রেরি",
    },
  ];

  return (
    <section className="bg-gray-50/50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            আমরা যাদের সেবা দিই
          </h2>
          <p className="text-gray-500">
            সব ধরনের প্রতিষ্ঠানের জন্য কাস্টমাইজড সমাধান
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {sectors.map((sector, idx) => (
            <SectorCard key={idx} {...sector} />
          ))}
        </div>
      </div>
    </section>
  );
}
