'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Define types for the data we expect from the API
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

// Debounce function to limit API calls
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
}

export default function AddBestPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);

  const fetchSearchResults = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/steam?search=${encodeURIComponent(term)}`);
      if (!response.ok) throw new Error('Failed to fetch search results.');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSearchResults(data);
      setIsDropdownVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 300), []);

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const handleSelectGame = async (appid: number) => {
    setIsLoading(true);
    setError(null);
    setSelectedGame(null);
    setSearchTerm('');
    setSearchResults([]);
    setIsDropdownVisible(false);

    try {
      const response = await fetch(`/api/steam?appid=${appid}`);
      if (!response.ok) throw new Error('Failed to fetch game details.');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSelectedGame(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24">
      <div className="w-full max-w-2xl relative">
        <h1 className="text-4xl font-bold mb-8 text-center">내가 플레이했던 최고의 스팀 게임</h1>
        <div className="relative mb-4">
          <p className="text-sm text-gray-400 mb-2">검색이 안된다면 영어로 검색해주세요.</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="스팀 게임을 검색해주세요."
            className="border p-2 rounded w-full text-black bg-gray-100 focus:bg-white"
            onFocus={() => setIsDropdownVisible(true)}
          />
          {isLoading && <p className="absolute right-3 top-2.5 text-sm text-gray-500">Searching...</p>}
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {searchResults.map((game) => (
                  <li key={game.appid} onMouseDown={() => handleSelectGame(game.appid)} className="p-3 hover:bg-gray-100 cursor-pointer text-black">
                    {game.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}

        {selectedGame && (
          <article className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full">
            <Image
              src={selectedGame.header_image}
              alt={selectedGame.name}
              width={600}
              height={300}
              className="w-full h-auto rounded-md mb-4"
              style={{ objectFit: 'cover' }}
              priority
            />
            <p className="text-sm text-gray-400 mb-4" dangerouslySetInnerHTML={{ __html: selectedGame.short_description }}></p>
            <div className="text-sm">
              <p><strong className="font-semibold">Release Date:</strong> {selectedGame.release_date.date}</p>
              <p><strong className="font-semibold">Developers:</strong> {selectedGame.developers?.join(', ')}</p>
              <p><strong className="font-semibold">Publishers:</strong> {selectedGame.publishers?.join(', ')}</p>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}