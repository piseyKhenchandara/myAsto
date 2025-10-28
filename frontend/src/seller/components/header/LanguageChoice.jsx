// LanguageChoice.jsx
import React, { useEffect, useState } from 'react'
import cambodia_flag from '../../../assets/flag/cambodia_flag.png';
import england_flag from '../../../assets/flag/england_flag.png';
import china_flag from '../../../assets/flag/china_flag.png';



const langs = [
  { code: 'en', name: 'English', flag: england_flag, alt: 'England Flag' },
  { code: 'km', name: 'ភាសាខ្មែរ', flag: cambodia_flag, alt: 'Cambodia Flag' },
  { code: 'zh-CN', name: '中文', flag: china_flag, alt: 'China Flag' },
];

// Parse "googtrans" cookie like "/en/km" -> "km"
function getLangFromCookie() {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
  if (!match) return null;
  const val = decodeURIComponent(match[1]); // "/en/km"
  const parts = val.split('/').filter(Boolean);
  return parts[1] || null; // target lang
}

function setTranslateCookie(targetLang) {
  const host = window.location.hostname;
  const expires = new Date(Date.now() + 365*24*60*60*1000).toUTCString();
  const value = `/en/${targetLang}`; // change source if base language isn't English

  // Always set a root-scoped cookie
  document.cookie = `googtrans=${value}; expires=${expires}; path=/`;

  // Only set a domain cookie if not localhost/127.0.0.1
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  if (!isLocal) {
    document.cookie = `googtrans=${value}; expires=${expires}; path=/; domain=.${host}`;
  }
}

function getInitialLang() {
  // Priority: localStorage -> cookie -> 'en'
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
    // persist + cookie for Google Translate widget
    localStorage.setItem('app_lang', code);
    setTranslateCookie(code);
    setCurrentLang(code);
    setOpen(false);

    // Let the Google widget re-read the cookie
    window.location.reload();
  };

  const flagMap = {
  'en': england_flag,
  'km': cambodia_flag, 
  'zh-CN': china_flag
  };

  const currentFlag = flagMap[currentLang] || england_flag;

  return (
    <nav className="relative notranslate" translate='no' data-gt-ignore="true">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        aria-label="Select language"
      >
        <img src={currentFlag} alt="Current Language" className="h-8 w-9 object-cover rounded-sm" />
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <menu className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[150px] z-50">
            {langs.map(l => (
              <li key={l.code}>
                <button
                  onClick={() => handleSelect(l.code)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-gray-700 cursor-pointer"
                >
                  <img src={l.flag} alt={l.alt} className="h-5 w-7 object-cover rounded-sm " />
                  <span className="text-sm font-medium">{l.name}</span>
                </button>
              </li>
            ))}
          </menu>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
        </>
      )}
    </nav>
  );
}