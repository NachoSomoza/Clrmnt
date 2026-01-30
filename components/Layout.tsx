
import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { AppMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  mode: AppMode;
  onNavigateHome: () => void;
  onBack: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, mode, onNavigateHome, onBack }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className="bg-white border-b border-gray-100 py-4 px-6 flex items-center justify-between sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onNavigateHome}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <span className="font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">Claramente</h1>
        </div>

        <nav className="flex items-center gap-4">
          {mode !== 'UPLOAD' && mode !== 'SELECTION' && (
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
          )}
          <button 
            onClick={onNavigateHome}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Inicio"
          >
            <Home className="w-6 h-6" />
          </button>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer className="py-6 text-center text-gray-400 text-sm">
        Claramente © 2024 • Hecho con amor para mentes brillantes
      </footer>
    </div>
  );
};
