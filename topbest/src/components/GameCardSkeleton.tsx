'use client';

export default function GameCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="relative">
        <div className="w-full h-48 bg-gray-300"></div> {/* Placeholder for image */}
        <div className="absolute top-2 right-2 bg-gray-400 h-6 w-16 rounded-full"></div> {/* Placeholder for recommendations */}
      </div>
      <div className="p-5">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div> {/* Placeholder for title */}
        <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Placeholder for subtitle/short description */}
      </div>
    </div>
  );
}
