
import React, { useState } from 'react';
import { AppState, AppMode } from './types';
import { Layout } from './components/Layout';
import { UploadModule } from './components/UploadModule';
import { AdaptiveReader } from './components/AdaptiveReader';
import { ExplainMode } from './components/ExplainMode';
import { ComicMode } from './components/ComicMode';
import { VideoNarrado } from './components/VideoNarrado';
import { MODULE_CARDS } from './constants';
import { Sparkles, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    text: '',
    isProcessing: false,
    mode: 'UPLOAD'
  });

  const handleTextExtracted = (text: string, fileName: string) => {
    setState({
      ...state,
      text,
      originalFileName: fileName,
      mode: 'SELECTION'
    });
  };

  const navigateToMode = (mode: AppMode) => {
    setState(prev => ({ ...prev, mode }));
  };

  const handleBack = () => {
    if (state.mode === 'SELECTION') {
      setState(prev => ({ ...prev, mode: 'UPLOAD', text: '' }));
    } else {
      setState(prev => ({ ...prev, mode: 'SELECTION' }));
    }
  };

  const renderContent = () => {
    switch (state.mode) {
      case 'UPLOAD':
        return <UploadModule onTextExtracted={handleTextExtracted} />;
      
      case 'SELECTION':
        return (
          <div className="max-w-4xl mx-auto py-10">
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>¡Texto listo!</span>
              </div>
              <h2 className="text-4xl font-extrabold text-gray-800 mb-4">¿Cómo quieres explorarlo?</h2>
              <p className="text-lg text-gray-600">Elige la experiencia que mejor se adapte a ti.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MODULE_CARDS.map((card) => (
                <button
                  key={card.id}
                  onClick={() => !card.disabled && navigateToMode(card.id as AppMode)}
                  className={`relative p-8 text-left rounded-[2.5rem] border-4 transition-all group ${
                    card.disabled 
                      ? 'opacity-60 grayscale cursor-not-allowed border-gray-100 bg-gray-50' 
                      : `hover:shadow-xl hover:-translate-y-1 ${card.color} cursor-pointer`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-4 bg-white rounded-3xl shadow-sm mb-6">
                      {card.icon}
                    </div>
                    {card.disabled && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wide">
                        Próximamente
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-6">{card.description}</p>
                  
                  {!card.disabled && (
                    <div className="flex items-center gap-2 font-bold text-blue-600 group-hover:gap-4 transition-all">
                      <span>Empezar ahora</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-12 p-6 bg-white border border-gray-100 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                  <span className="font-bold text-lg uppercase">{state.originalFileName?.substring(0, 2)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{state.originalFileName}</p>
                  <p className="text-xs text-gray-500">Documento cargado correctamente</p>
                </div>
              </div>
              <button 
                onClick={() => setState(prev => ({ ...prev, mode: 'UPLOAD', text: '' }))}
                className="text-sm font-bold text-red-500 hover:text-red-600 p-2"
              >
                Cambiar archivo
              </button>
            </div>
          </div>
        );

      case 'READER':
        return <AdaptiveReader text={state.text} />;
      
      case 'EXPLAIN':
        return <ExplainMode text={state.text} />;

      case 'COMIC':
        return <ComicMode text={state.text} />;

      case 'VIDEO':
        return <VideoNarrado text={state.text} />;

      default:
        return <div>Próximamente...</div>;
    }
  };

  return (
    <Layout 
      mode={state.mode} 
      onNavigateHome={() => setState({ ...state, mode: 'UPLOAD', text: '' })}
      onBack={handleBack}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
