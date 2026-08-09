import React from "react";
import { DirectoryCard } from "./DirectoryCard";
import { DirectoryEntity, EntityType } from "../services/directoryService";

interface DirectoryGridProps {
  items: DirectoryEntity[];
  type: EntityType;
}

export const DirectoryGrid: React.FC<DirectoryGridProps> = ({
  items,
  type,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <DirectoryCard
          key={item.id}
          name={item.name}
          imageUrl={item.imageUrl}
          type={type}
        />
      ))}
    </div>
  );
};
