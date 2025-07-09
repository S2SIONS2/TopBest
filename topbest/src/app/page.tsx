import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FaBeer } from 'react-icons/fa';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Icon Libraries Demo</h1>
      
      <div className="flex items-center gap-8">
        <div>
          <h2 className="text-2xl mb-4">Font Awesome</h2>
          <p className="text-center">
            <FontAwesomeIcon icon={faCoffee} size="3x" />
          </p>
        </div>
        
        <div className="border-l-2 border-gray-300 h-24"></div>

        <div>
          <h2 className="text-2xl mb-4">react-icons</h2>
          <p className="text-center text-5xl">
            <FaBeer />
          </p>
        </div>
      </div>

      <p className="mt-12 text-lg">
        You can now use icons from both libraries in your project.
      </p>
    </main>
  );
}