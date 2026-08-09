import { ReactNode } from "react";

interface SectorCardProps {
  icon: ReactNode;
  title: string;
}

export function SectorCard({ icon, title }: SectorCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-gray-100 bg-white p-6 text-center transition-shadow hover:shadow-md">
      <div className="text-4xl text-gray-700">{icon}</div>
      <span className="text-sm font-medium text-gray-700">{title}</span>
    </div>
  );
}
