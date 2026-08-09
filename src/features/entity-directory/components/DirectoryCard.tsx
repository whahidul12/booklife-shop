import React from "react";
import Image from "next/image";
import { EntityType } from "../services/directoryService";

interface DirectoryCardProps {
  name: string;
  imageUrl: string;
  type: EntityType;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ name, imageUrl, type }) => {
  const isAuthor = type === "author";

  return (
    <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-gray-100 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm">
      <div
        className={`relative mb-4 flex h-24 w-24 items-center justify-center overflow-hidden bg-gray-100 ${
          isAuthor ? "rounded-full" : "rounded-md"
        }`}
      >
        <Image
          src={imageUrl}
          alt={name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>
      <h3 className="line-clamp-2 text-center text-xs font-medium text-gray-700">
        {name}
      </h3>
    </div>
  );
};