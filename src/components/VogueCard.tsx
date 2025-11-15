// VogueCard.tsx
import { VogueMetadata } from "@/app/types/document";
import Link from "next/link";
import React from "react";

interface VogueCardProps {
    author: string;
    date: string;
    description: string;
    id: string;
    image_url: string;
    name: string;
    source_url: string;
}


export const VogueCard = ({author, date, description, id, image_url, name, source_url}: VogueCardProps) => {


  return (
    <div className="flex flex-col sm:flex-row gap-4 border-b border-gray-100 p-4 hover:shadow-lg transition-shadow duration-200 rounded-md">
      <img
        src={image_url}
        alt={name}
        className="w-full sm:w-48 h-48 object-cover rounded-md"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>By {author}</p>
          <p>{date}</p>
          <Link
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Source
          </Link>
        </div>
      </div>
    </div>
  );
};
