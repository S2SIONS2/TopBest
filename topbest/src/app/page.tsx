'use client';

import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';
import FloatingActionButton from '@/components/FloatingActionButton';
import RecommendModal from '@/components/RecommendModal';
import GameDetailModal from '@/components/GameDetailModal';
import GameCardSkeleton from '@/components/GameCardSkeleton';

interface Game {
  id: number;
  steamAppId: number;
  name: string;
  headerImage: string;
  recommendations: number;
  shortReview: string | null;
  shortDescription: string | null;
}


export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games. Please try again later.');
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();

    // Check localStorage for first visit
    const hasVisited = localStorage.getItem('hasVisitedTopBest');
    if (!hasVisited) {
      setIsRecommendModalOpen(true);
      localStorage.setItem('hasVisitedTopBest', 'true');
    }
  }, []);

  const handleGameRecommended = () => {
    fetchGames(); // Re-fetch games to update the list
  };

  const handleCardClick = (game: Game) => {
    setSelectedGame(game);
  };

  const closeDetailModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight">TopBest Games</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">커뮤니티가 직접 추천하고 순위를 매기는 최고의 Steam 게임들을 만나보세요.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-gray-700 bg-gray-100 p-4 rounded-lg max-w-md mx-auto">
            <p className="font-bold">데이터를 불러오는 데 문제가 발생했습니다.</p>
            <p>오류 내용: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {games.length > 0 ? (
              games.map((game) => <GameCard key={game.id} game={game} onClick={() => handleCardClick(game)} />)
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-2xl font-semibold text-gray-700">아직 추천된 게임이 없어요!</h3>
                <p className="text-gray-500 mt-2">가장 먼저 좋아하는 게임을 추천해보세요.</p>
                <button onClick={() => setIsRecommendModalOpen(true)} className="mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200">
                  첫 게임 추천하기
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <FloatingActionButton onClick={() => setIsRecommendModalOpen(true)} />

      <RecommendModal
        isOpen={isRecommendModalOpen}
        onClose={() => setIsRecommendModalOpen(false)}
        onGameRecommended={handleGameRecommended}
      />

      <GameDetailModal
        isOpen={selectedGame !== null}
        onClose={closeDetailModal}
        game={selectedGame}
      />
    </div>
  );
}
