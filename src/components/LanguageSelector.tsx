'use client';

interface LanguageSelectorProps {
  language: 'fr' | 'en';
  onChange: (language: 'fr' | 'en') => void;
}

export const LanguageSelector = ({ language, onChange }: LanguageSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange('fr')}
        aria-label="Changer la langue en français"
        aria-pressed={language === 'fr'}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          language === 'fr'
            ? 'bg-white/30 text-white shadow-lg'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => onChange('en')}
        aria-label="Change language to English"
        aria-pressed={language === 'en'}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
          language === 'en'
            ? 'bg-white/30 text-white shadow-lg'
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        🇬🇧 EN
      </button>
    </div>
  );
};
