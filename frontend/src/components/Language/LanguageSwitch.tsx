import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-teal-600 rounded-lg px-3 py-2 shadow-sm">
      <Globe className="w-4 h-4 text-white" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-white text-teal-600'
            : 'text-white hover:bg-white/20'
        }`}
      >
        EN
      </button>
      <span className="text-white/50">|</span>
      <button
        onClick={() => setLanguage('es')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'es'
            ? 'bg-white text-teal-600'
            : 'text-white hover:bg-white/20'
        }`}
      >
        ES
      </button>
    </div>
  );
}
