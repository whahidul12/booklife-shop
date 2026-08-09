import { ReactNode } from "react";

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {icon && <div className="mb-2 text-red-500">{icon}</div>}
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
