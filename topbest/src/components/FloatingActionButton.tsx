'use client';

import { FaPlus } from 'react-icons/fa';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-indigo-600 text-white p-5 rounded-full shadow-2xl hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-110"
      aria-label="Recommend a game"
    >
      <FaPlus size={24} />
    </button>
  );
}
