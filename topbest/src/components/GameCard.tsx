
'use client';

import Image from 'next/image';

interface Game {
  id: number;
  steamAppId: number;
  name: string;
  headerImage: string;
  recommendations: number;
  shortReview: string | null;
  shortDescription: string | null;
}

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <Image
          src={game.headerImage}
          alt={`${game.name} header image`}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-opacity duration-300"></div>
        <div className="absolute top-2 right-2 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
          👍 {game.recommendations}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 truncate">{game.name}</h3>
      </div>
    </div>
  );
}
