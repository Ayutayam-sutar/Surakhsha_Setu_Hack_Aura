import React, { createContext, useState, useEffect, useCallback } from 'react';

export const LanguageContext = createContext(undefined);

const supportedLanguages = {
    en: "English",
    hi: "हिंदी (Hindi)",
    or: "ଓଡ଼ିଆ (Odia)",
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchTranslations = useCallback(async (lang) => {
    // Avoid refetching if already loaded
    if (translations[lang]) {
      return;
    }
    try {
      // Files are now in the public directory and fetched, not imported
      const response = await fetch(`/locales/${lang}/translation.json`);
      if (!response.ok) {
        throw new Error(`Could not load translations for ${lang}`);
      }
      const data = await response.json();
      setTranslations(prev => ({ ...prev, [lang]: data }));
    } catch (error) {
      console.error(error);
      // Fallback to English if a language fails to load, which is already loaded
    }
  }, [translations]);

  // Load English by default, which is required as a fallback
  useEffect(() => {
    fetchTranslations('en').then(() => {
      setIsLoaded(true);
    });
  }, [fetchTranslations]);
  
  // Fetch new language files when the language is changed
  useEffect(() => {
    if (language !== 'en') {
      fetchTranslations(language);
    }
  }, [language, fetchTranslations]);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  }, [language, translations]);

  // Prevent rendering children until the default language is loaded
  if (!isLoaded) {
    return null; 
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};
