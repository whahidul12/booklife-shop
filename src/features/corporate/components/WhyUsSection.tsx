import { UserCheck, FileText, HeadphonesIcon } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function WhyUsSection() {
  const features = [
    {
      icon: <UserCheck size={28} />,
      title: "বিশেষ কর্পোরেট মূল্য",
      description:
        "আপনার প্রতিষ্ঠানের জন্য একজন নিবেদিত একাউন্ট ম্যানেজার থাকবেন।",
    },
    {
      icon: <FileText size={28} />,
      title: "দ্রুত ডেলিভারি",
      description: "প্রতিষ্ঠানের জন্য সুবিধাজনক ইনভয়েস ও পেমেন্ট ব্যবস্থা।",
    },
    {
      icon: <HeadphonesIcon size={28} />,
      title: "বিশ্বস্ত মানসম্পন্ন বই",
      description: "যেকোনো সমস্যায় আমাদের কাস্টমার সাপোর্ট টিম সবসময় প্রস্তুত।",
    },
    {
      icon: <UserCheck size={28} />,
      title: "ডেডিকেটেড একাউন্ট ম্যানেজার",
      description:
        "আপনার প্রতিষ্ঠানের জন্য একজন নিবেদিত একাউন্ট ম্যানেজার থাকবেন।",
    },
    {
      icon: <FileText size={28} />,
      title: "সহজ ইনভয়েসিং",
      description: "প্রতিষ্ঠানের জন্য সুবিধাজনক ইনভয়েস ও পেমেন্ট ব্যবস্থা।",
    },
    {
      icon: <HeadphonesIcon size={28} />,
      title: "সাপোর্ট",
      description: "যেকোনো সমস্যায় আমাদের কাস্টমার সাপোর্ট টিম সবসময় প্রস্তুত।",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          কেন ওয়াফিলাইফ কর্পোরেট সার্ভিস?
        </h2>
        <p className="text-gray-500">
          আমরা আপনার প্রতিষ্ঠানের বই সংক্রান্ত সব প্রয়োজন পূরণ করতে
          প্রতিশ্রুতিবদ্ধ
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </div>
    </section>
  );
}
