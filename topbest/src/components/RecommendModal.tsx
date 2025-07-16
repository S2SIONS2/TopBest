'use client';

import { useState, useEffect, useCallback, useRef, KeyboardEvent, useMemo } from 'react';
import Image from 'next/image';
import { FaSearch, FaSpinner, FaTimes } from 'react-icons/fa';

interface SearchResult {
  appid: number;
  name: string;
}

interface GameDetails {
  name: string;
  steam_appid: number;
  header_image: string;
  short_description: string;
  release_date: { date: string };
  developers: string[];
  publishers: string[];
}

// Generic debounce function
function debounce<T extends (...args: any[]) => any>(func: T, waitFor: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
  return debounced;
}


interface RecommendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameRecommended: () => void;
}

export default function RecommendModal({ isOpen, onClose, onGameRecommended }: RecommendModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [shortReview, setShortReview] = useState('');
  const resultsListRef = useRef<HTMLUListElement>(null);

  const resetState = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedGame(null);
    setIsLoading(false);
    setError(null);
    setIsDropdownVisible(true);
    setHighlightedIndex(-1);
    setShortReview('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const fetchSearchResults = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/steam?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(data);
      setIsDropdownVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // fetchSearchResults has no external dependencies

  const debouncedSearch = useMemo(() => debounce(fetchSearchResults, 300), [fetchSearchResults]);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchResults]);

  useEffect(() => {
    if (highlightedIndex !== -1 && resultsListRef.current) {
      const item = resultsListRef.current.children[highlightedIndex];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelectGame = async (appid: number) => {
    setIsLoading(true);
    setError(null);
    setSearchTerm('');
    setSearchResults([]);
    setIsDropdownVisible(false);
    try {
      const response = await fetch(`/api/steam?appid=${appid}`);
      if (!response.ok) throw new Error('Failed to fetch game details');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSelectedGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommend = async () => {
    if (!selectedGame) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          steamAppId: selectedGame.steam_appid,
          name: selectedGame.name,
          headerImage: selectedGame.header_image,
          shortReview: shortReview,
          shortDescription: selectedGame.short_description, // Pass short_description
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to recommend the game');
      }
      onGameRecommended();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isDropdownVisible && searchResults.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectGame(searchResults[highlightedIndex].appid);
        }
      } else if (e.key === 'Escape') {
        setIsDropdownVisible(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" onClick={handleClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 p-8 transform transition-all duration-300 ease-in-out scale-100" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <FaTimes size={24} />
        </button>

        {!selectedGame ? (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">게임 추천하기</h2>
            <p className="text-gray-600 mb-6">추천하고 싶은 게임을 검색해주세요.</p>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                {isLoading && !selectedGame ? <FaSpinner className="animate-spin text-gray-400" /> : <FaSearch className="text-gray-400" />}
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="게임 이름 (영문)"
                className="w-full p-4 pl-12 text-lg text-black bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                onFocus={() => setIsDropdownVisible(true)}
                autoFocus
              />
              {isDropdownVisible && searchResults.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                  <ul ref={resultsListRef} className="divide-y divide-gray-100">
                    {searchResults.map((game, index) => (
                      <li
                        key={game.appid}
                        onMouseDown={() => handleSelectGame(game.appid)}
                        className={`p-4 cursor-pointer text-gray-800 ${index === highlightedIndex ? 'bg-indigo-100' : 'hover:bg-indigo-50'}`}>
                        {game.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <article className="-m-8">
             <div className="relative">
                <Image
                  src={selectedGame.header_image}
                  alt={`${selectedGame.name} header image`}
                  width={700}
                  height={400}
                  className="w-full h-64 object-cover rounded-t-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl"></div>
                <h2 className="absolute bottom-0 left-0 p-6 text-3xl font-bold text-white">{selectedGame.name}</h2>
              </div>
            <div className="p-6 space-y-4">
              <p className="text-gray-700 text-base" dangerouslySetInnerHTML={{ __html: selectedGame.short_description }}></p>
              
              <div>
                <label htmlFor="short-review" className="block text-lg font-medium text-gray-800 mb-2">한줄평</label>
                <textarea
                  id="short-review"
                  value={shortReview}
                  onChange={(e) => setShortReview(e.target.value)}
                  placeholder="이 게임에 대한 당신의 생각을 알려주세요! (선택 사항)"
                  className="w-full p-3 text-base text-black bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setSelectedGame(null)} className="text-gray-600 hover:text-gray-900 font-semibold transition-colors">← 뒤로가기</button>
                <button onClick={handleRecommend} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center">
                  {isLoading ? <FaSpinner className="animate-spin mr-2" /> : null}
                  이 게임 추천하기
                </button>
              </div>
            </div>
          </article>
        )}

        {error && (
          <div className="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
