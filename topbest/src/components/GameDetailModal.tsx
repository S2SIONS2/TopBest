'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaTimes, FaThumbsUp, FaSpinner } from 'react-icons/fa';

interface Game {
  id: number;
  steamAppId: number;
  name: string;
  headerImage: string;
  shortDescription: string | null; // Added shortDescription
  recommendations: number;
}


interface Review {
  id: number;
  gameId: number;
  text: string;
  createdAt: string;
}

interface GameDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
}

export default function GameDetailModal({ isOpen, onClose, game }: GameDetailModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && game) {
      const fetchReviews = async () => {
        setIsLoadingReviews(true);
        setReviewsError(null);
        try {
          const response = await fetch(`/api/games/${game.id}/reviews`);
          if (!response.ok) {
            throw new Error('Failed to fetch reviews.');
          }
          const data = await response.json();
          setReviews(data);
        } catch (err) {
          setReviewsError(err instanceof Error ? err.message : 'An unknown error occurred while fetching reviews.');
        } finally {
          setIsLoadingReviews(false);
        }
      };
      fetchReviews();
    } else {
      setReviews([]); // Clear reviews when modal is closed or game changes
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 transform transition-all duration-300 ease-in-out scale-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-4 -right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-900 transition-colors z-10">
          <FaTimes size={20} />
        </button>

        <article>
          <div className="relative">
            <Image
              src={game.headerImage}
              alt={`${game.name} header image`}
              width={700}
              height={400}
              className="w-full h-64 object-cover rounded-t-2xl"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-t-2xl"></div>
            <h2 className="absolute bottom-0 left-0 p-6 text-4xl font-bold text-white">{game.name}</h2>
            <div className="absolute top-4 right-4 bg-indigo-600 text-white text-lg font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
              <FaThumbsUp />
              <span>{game.recommendations}</span>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">게임 소개</h3>
            {game.shortDescription ? (
              <div className="text-gray-700 text-base" dangerouslySetInnerHTML={{ __html: game.shortDescription }}></div>
            ) : (
              <p className="text-gray-500 italic">제공되는 게임 소개가 없습니다.</p>
            )}

            <h3 className="text-2xl font-bold text-gray-900 mb-4">한줄평</h3>
            {isLoadingReviews ? (
              <div className="text-center">
                <FaSpinner className="animate-spin text-indigo-500 text-3xl" />
                <p className="text-gray-600 mt-2">한줄평 불러오는 중...</p>
              </div>
            ) : reviewsError ? (
              <div className="text-red-600 bg-red-50 p-3 rounded-lg">
                <p>⚠️ {reviewsError}</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="max-h-60 overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <blockquote key={review.id} className="text-lg text-gray-800 border-l-4 border-indigo-500 pl-4 italic mb-4 last:mb-0">
                    <p>&quot;{review.text}&quot;</p>
                    {/* <p className="text-sm text-gray-500 mt-1">- {new Date(review.createdAt).toLocaleDateString()}</p> */}
                  </blockquote>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">아직 작성된 한줄평이 없습니다.</p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
