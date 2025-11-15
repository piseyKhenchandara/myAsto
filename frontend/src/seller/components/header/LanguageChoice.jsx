import React, { useEffect, useState } from 'react';
import cambodia_flag from '../../../assets/flag/cambodia_flag.png';
import england_flag from '../../../assets/flag/england_flag.png';
import china_flag from '../../../assets/flag/china_flag.png';

const langs = [
  { code: 'en', name: 'English', flag: england_flag, alt: 'England Flag' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: cambodia_flag, alt: 'Cambodia Flag' },
  { code: 'zh-CN', name: '中文', flag: china_flag, alt: 'China Flag' },
];

function getLangFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) return null;
  const val = decodeURIComponent(match[1]);
  const parts = val.split('/').filter(Boolean);
  return parts[1] || null;
}

function setTranslateCookie(targetLang) {
  const host = window.location.hostname;
  const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
  const value = `/en/${targetLang}`;
  document.cookie = `googtrans=${value}; expires=${expires}; path=/`;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (!isLocal) document.cookie = `googtrans=${value}; expires=${expires}; path=/; domain=.${host}`;
}

function getInitialLang() {
  const stored = localStorage.getItem('app_lang');
  if (stored) return stored;
  const cookieLang = getLangFromCookie();
  if (cookieLang) return cookieLang;
  return 'en';
}

export default function LanguageChoice() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(getInitialLang());

  useEffect(() => {
    setTranslateCookie(currentLang);
  }, []); 

  const handleSelect = (code) => {
    if (code === currentLang) {
      setOpen(false);
      return;
    }
    localStorage.setItem('app_lang', code);
    setTranslateCookie(code);
    setCurrentLang(code);
    setOpen(false);
    window.location.reload();
  };

  const flagMap = { 'en': england_flag, 'km': cambodia_flag, 'zh-CN': china_flag };
  const currentFlag = flagMap[currentLang] || england_flag;

  return (
    <nav className="relative notranslate" translate='no' data-gt-ignore="true">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        aria-label="Select language"
      >
        <img src={currentFlag} alt="Current Language" className="h-5 w-6 sm:h-6 sm:w-7 object-cover rounded-sm" />
        <svg className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <menu className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-[120px] sm:min-w-[150px] z-50 list-none">
            {langs.map(l => (
              <div key={l.code}>
                <button
                  onClick={() => handleSelect(l.code)}
                  className="w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-gray-700 text-sm sm:text-base cursor-pointer"
                >
                  <img src={l.flag} alt={l.alt} className="h-4 w-5 sm:h-5 sm:w-7 object-cover rounded-sm" />
                  <span className="truncate">{l.name}</span>
                </button>
              </div>
            ))}
          </menu>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        </>
      )}
    </nav>
  );
}
