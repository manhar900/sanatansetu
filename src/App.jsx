import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Upload, BookOpen, Sparkles, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Award, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Unlock, Plus, ChevronRight,
  Check, AlertCircle, FileText
} from 'lucide-react';

// Change your default Admin Password here (or set VITE_ADMIN_PASSWORD in Vercel Environment Variables)
export const DEFAULT_ADMIN_PASSCODE = '';

// 27 Supported Languages: Top 15 Indian Languages + Top 12 World Languages
export const SUPPORTED_LANGUAGES = [
  // Top Indian Languages
  { id: 'Sanskrit', label: 'Sanskrit (संस्कृतम्)', native: 'संस्कृतम्', group: 'Indian', locale: 'hi-IN', greeting: 'हरिः ॐ तत् सत्' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)', native: 'हिन्दी', group: 'Indian', locale: 'hi-IN', greeting: 'जय श्री राम · हर हर महादेव' },
  { id: 'English', label: 'English', native: 'English', group: 'Indian & Global', locale: 'en-IN', greeting: 'Om Tat Sat · Eternal Dharma' },
  { id: 'Odia', label: 'Odia (ଓଡ଼ିଆ)', native: 'ଓଡ଼ିଆ', group: 'Indian', locale: 'or-IN', greeting: 'ଜୟ ଜଗନ୍ନାଥ · ସನಾତନ ସେତୁ' },
  { id: 'Bengali', label: 'Bengali (বাংলা)', native: 'বাংলা', group: 'Indian', locale: 'bn-IN', greeting: 'জয় মা দুর্গা · সনাতন সেতু' },
  { id: 'Marathi', label: 'Marathi (मराठी)', native: 'मराठी', group: 'Indian', locale: 'mr-IN', greeting: 'राम कृष्ण हरी · सनातन सेतू' },
  { id: 'Gujarati', label: 'Gujarati (ગુજરાતી)', native: 'ગુજરાતી', group: 'Indian', locale: 'gu-IN', greeting: 'જય શ્રી કૃષ્ણ · સનાતન સેતુ' },
  { id: 'Tamil', label: 'Tamil (தமிழ்)', native: 'தமிழ்', group: 'Indian', locale: 'ta-IN', greeting: 'ஓம் நமசிவாய · சனாதன சேது' },
  { id: 'Telugu', label: 'Telugu (తెలుగు)', native: 'తెలుగు', group: 'Indian', locale: 'te-IN', greeting: 'ఓం నమో వేంకటేశాయ · సనాతన సేతు' },
  { id: 'Kannada', label: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ', group: 'Indian', locale: 'kn-IN', greeting: 'ಓಂ ನಮಃ ಶಿವಾಯ · ಸನಾತನ ಸೇತು' },
  { id: 'Malayalam', label: 'Malayalam (മലയാളം)', native: 'മലയാളം', group: 'Indian', locale: 'ml-IN', greeting: 'ഓം നമോ നാരായണായ · സനാതന സേതു' },
  { id: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)', native: 'ਪੰਜਾਬੀ', group: 'Indian', locale: 'pa-IN', greeting: 'ਓਅੰਕਾਰ · ਸਨਾਤਨ ਸੇਤੂ' },
  { id: 'Assamese', label: 'Assamese (অসমীয়া)', native: 'অসমীয়া', group: 'Indian', locale: 'as-IN', greeting: 'জয় মা কামাখ্যা · সনাতন সেতু' },
  { id: 'Maithili', label: 'Maithili (मैथिली)', native: 'मैथिली', group: 'Indian', locale: 'hi-IN', greeting: 'जय जानकी जीवन · सनातन सेतु' },
  { id: 'Nepali', label: 'Nepali (नेपाली)', native: 'नेपाली', group: 'Indian', locale: 'ne-NP', greeting: 'जय पशुपतिनाथ · सनातन सेतु' },
  // Top World Languages
  { id: 'Spanish', label: 'Spanish (Español)', native: 'Español', group: 'World', locale: 'es-ES', greeting: 'Sabiduría Védica Eterna · Sanatan Dharma' },
  { id: 'French', label: 'French (Français)', native: 'Français', group: 'World', locale: 'fr-FR', greeting: 'Sagesse Védique Éternelle · Sanatan Dharma' },
  { id: 'German', label: 'German (Deutsch)', native: 'Deutsch', group: 'World', locale: 'de-DE', greeting: 'Ewige Vedische Weisheit · Sanatan Dharma' },
  { id: 'Russian', label: 'Russian (Русский)', native: 'Русский', group: 'World', locale: 'ru-RU', greeting: 'Вечная Ведическая Мудрость · Санатана Дхарма' },
  { id: 'Japanese', label: 'Japanese (日本語)', native: '日本語', group: 'World', locale: 'ja-JP', greeting: '永遠のヴェーダの叡智 · サナータナ・ダルマ' },
  { id: 'Chinese', label: 'Chinese (中文)', native: '中文', group: 'World', locale: 'zh-CN', greeting: '永恒吠陀智慧 · 永恒法' },
  { id: 'Arabic', label: 'Arabic (العربية)', native: 'العربية', group: 'World', locale: 'ar-SA', greeting: 'الحكمة الفيدية الأبدية' },
  { id: 'Portuguese', label: 'Portuguese (Português)', native: 'Português', group: 'World', locale: 'pt-BR', greeting: 'Sabedoria Védica Eterna · Sanatan Dharma' },
  { id: 'Indonesian', label: 'Indonesian (Bahasa Indonesia)', native: 'Bahasa Indonesia', group: 'World', locale: 'id-ID', greeting: 'Kebijaksanaan Weda Abadi · Sanatan Dharma' },
  { id: 'Thai', label: 'Thai (ไทย)', native: 'ไทย', group: 'World', locale: 'th-TH', greeting: 'ภูมิปัญญาพระเวทชั่วนิรันดร์' },
  { id: 'Korean', label: 'Korean (한국어)', native: '한국어', group: 'World', locale: 'ko-KR', greeting: '영원한 베다의 지혜 · 사나타나 다르마' },
  { id: 'Italian', label: 'Italian (Italiano)', native: 'Italiano', group: 'World', locale: 'it-IT', greeting: 'Saggezza Vedica Eterna · Sanatan Dharma' }
];

export const SECURE_PROTO = ['htt', 'ps://'].join('');

// Automatically strips any accidental google search redirect prefix and extracts clean URL or YouTube ID
export function cleanExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let u = rawUrl.trim();
  // If user pasted full <iframe src="..."> snippet from YouTube Share -> Embed, extract src
  const iframeSrcMatch = u.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch && iframeSrcMatch[1]) {
    u = iframeSrcMatch[1];
  }
  while (u.includes('google.com/search?q=') || u.includes('google.com/url?q=')) {
    const qIdx = u.indexOf('?q=');
    if (qIdx !== -1) {
      try {
        u = decodeURIComponent(u.slice(qIdx + 3).split('&')[0]);
      } catch (e) {
        u = u.slice(qIdx + 3).split('&')[0];
      }
    } else {
      break;
    }
  }
  return u;
}

export function extractYouTubeId(url) {
  const cleaned = cleanExternalUrl(url);
  if (!cleaned) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) return cleaned;
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|v\/|e(?:mbed)?\/|shorts\/|live\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = cleaned.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function getYouTubeEmbedUrl(url) {
  const ytId = extractYouTubeId(url);
  if (!ytId) return null;
  const host = ['www', 'youtube', 'com'].join('.');
  return `${SECURE_PROTO}${host}/embed/${ytId}?playsinline=1&rel=0&modestbranding=1`;
}

// Opens a richly typeset, print-ready Sacred PDF eBook view for ANY item in the library (so every scripture has an instant PDF eBook!)
export function openSacredPrintablePdf(item, lang = 'English') {
  if (typeof window === 'undefined') return;
  if (item.pdfUrl && item.pdfUrl !== '#auto-pdf' && !item.pdfUrl.startsWith('#')) {
    window.open(item.pdfUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  const bodyText = getBodyForLanguage(item, lang);
  const sanText = typeof item.body === 'object' && item.body.Sanskrit ? item.body.Sanskrit : '';
  const hinText = typeof item.body === 'object' && item.body.Hindi ? item.body.Hindi : '';
  const engText = typeof item.body === 'object' && item.body.English ? item.body.English : bodyText;
  const win = window.open('', '_blank');
  if (!win) return;
  const esc = (str) => String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${esc(item.title)} – Sacred PDF eBook | Sanatan Setu Library</title>
  <style>
    @page { size: A4; margin: 18mm; }
    body { font-family: Georgia, 'Noto Serif Devanagari', serif; background: #FFFDF7; color: #2C1A12; line-height: 1.75; padding: 24px 36px; max-width: 820px; margin: 0 auto; }
    .toolbar { background: #2C1A12; color: #FDE68A; padding: 12px 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; font-family: system-ui, sans-serif; }
    .btn { background: #EA580C; color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 13px; }
    .header-box { border: 2px solid #D97706; border-radius: 16px; padding: 22px; background: #FFFBEB; text-align: center; margin-bottom: 24px; }
    .badge { color: #EA580C; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; }
    h1 { font-size: 24px; margin: 8px 0; color: #7C2D12; }
    .meta { font-size: 13px; color: #78523A; }
    .section-title { font-size: 15px; font-weight: bold; color: #EA580C; border-bottom: 1px solid #FDE68A; padding-bottom: 6px; margin-top: 24px; margin-bottom: 10px; text-transform: uppercase; }
    .content { white-space: pre-line; font-size: 15px; }
    @media print { .toolbar { display: none; } body { padding: 0; background: #fff; } }
  </style>
</head>
<body>
  <div class="toolbar">
    <span><strong>🕉️ Sanatan Setu Sacred PDF eBook</strong> · ${esc(item.title)}</span>
    <button class="btn" onclick="window.print()">🖨️ Save as PDF / Print</button>
  </div>
  <div class="header-box">
    <div class="badge">॥ श्री गणेशाय नमः · ${esc(item.sanskritBadge || item.category)} ॥</div>
    <h1>${esc(item.title)}</h1>
    <div class="meta">Source / Tradition: ${esc(item.author || 'Vedic Tradition')} · Sanatan Setu Library (sanatansetulibrary.com)</div>
    <p style="font-style:italic; font-size:14px; margin-top:10px;">${esc(item.description)}</p>
  </div>
  ${sanText ? `<div class="section-title">॥ मूल संस्कृत पाठ (Original Sanskrit Verses) ॥</div><div class="content">${esc(sanText)}</div>` : ''}
  ${hinText ? `<div class="section-title">॥ हिन्दी भावार्थ एवं संपूर्ण पाठ (Hindi Text & Meaning) ॥</div><div class="content">${esc(hinText)}</div>` : ''}
  ${engText ? `<div class="section-title">॥ Complete English Text & Commentary ॥</div><div class="content">${esc(engText)}</div>` : ''}
</body>
</html>`);
  win.document.close();
}

// Unlimited Browser Database Engine (IndexedDB) so users can upload unlimited articles, PDFs, videos & high-res photos without hitting localStorage limits
export const SanatanUnlimitedDB = {
  dbName: 'SanatanSetuUnlimitedDB',
  storeName: 'sacred_items_store',
  open() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB unavailable'));
      }
      const req = window.indexedDB.open(this.dbName, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async saveItems(itemsArray) {
    try {
      const db = await this.open();
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(itemsArray, 'all_items_v5');
    } catch (e) {}
  },
  async loadItems() {
    try {
      const db = await this.open();
      return await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const req = tx.objectStore(this.storeName).get('all_items_v5');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }
};

// Verified Copyright-Free (CC / Public Domain) Wikimedia Commons Photographs for Categories & Sacred Items
export const COPYRIGHT_FREE_CATEGORY_PHOTOS = {
  'Vedas': 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE_Rigveda,_manuscript_page_sample_ii,_Sanskrit,_Devanagari.jpg?width=900',
  'Upanishads': 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE,_Vivaha_sukta,_Rigveda_10.85.1-8,_Sanskrit,_Devanagari,_manuscript_page.jpg?width=900',
  'Bhagavad Gita': 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_and_Krishna_at_the_Kurukshetra_Mahabharata_war,_Gita.jpg?width=900',
  'Ramayana': 'https://commons.wikimedia.org/wiki/Special:FilePath/Rama,_Sita,_Lakshmana_and_Hanuman_in_the_forest..jpg?width=900',
  'Mahabharata': 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_BattlesWith_the_Kauravas_At_Kuruksheta_Bhagavad_Gita.jpg?width=900',
  'Puranas': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sauti_recites_the_slokas_of_the_Mahabharata.jpg?width=900',
  'Mantras': 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
  'Bhajans': 'https://commons.wikimedia.org/wiki/Special:FilePath/Dev_Deepavali_at_Varanasi_DSC04305_07.jpg?width=900',
  'Festivals': 'https://commons.wikimedia.org/wiki/Special:FilePath/DEV_DEEPAVALI_VARANASI_04.jpg?width=900',
  'Temples': 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Jagannath_Temple,_Puri.jpg?width=900',
  'Philosophy': 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Shiva_Nataraja_at_the_British_Museum.jpg?width=900',
  'Sant Teachings': 'https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman_before_Rama.jpg?width=900'
};

export const COPYRIGHT_FREE_ITEM_PHOTOS = {
  'jagannath-temple-puri': 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Jagannath_Temple,_Puri.jpg?width=900',
  'kamakhya-temple-assam': 'https://commons.wikimedia.org/wiki/Special:FilePath/Maa_Kamakhya_temple.jpg?width=900',
  'badrinath-dham-himalaya': 'https://commons.wikimedia.org/wiki/Special:FilePath/Badrinath_Temple_Side_View.jpg?width=900',
  'sri-ranganathaswamy-temple': 'https://commons.wikimedia.org/wiki/Special:FilePath/Ranganathaswamy_Temple,_Srirangam_(49997987601).jpg?width=900',
  'angkor-wat-vishnu-temple': 'https://commons.wikimedia.org/wiki/Special:FilePath/Angkor_Wat.jpg?width=900',
  'sant-teachings-bhakti-movement': 'https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman_before_Rama.jpg?width=900',
  'hindu-philosophy-shad-darshana': 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Shiva_Nataraja_at_the_British_Museum.jpg?width=900',
  'hindu-temples-sacred-architecture': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Jagannath_Temple,_Puri._India.jpg?width=900',
  'hindu-festivals-utsav-vrat': 'https://commons.wikimedia.org/wiki/Special:FilePath/DEV_DEEPAVALI_VARANASI_04.jpg?width=900',
  'puranas-18-maha-puranas': 'https://commons.wikimedia.org/wiki/Special:FilePath/Sauti_recites_the_slokas_of_the_Mahabharata.jpg?width=900',
  'mahabharata-epic-summary': 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_BattlesWith_the_Kauravas_At_Kuruksheta_Bhagavad_Gita.jpg?width=900',
  'upanishads-10-principal-texts': 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE,_Vivaha_sukta,_Rigveda_10.85.1-8,_Sanskrit,_Devanagari,_manuscript_page.jpg?width=900',
  'maa-ambe-sarv-kamna-siddh-prarthana': 'https://commons.wikimedia.org/wiki/Special:FilePath/Idol_of_Goddess_Durga_(Ceremonial_Worship)_31.jpg?width=900',
  'ambe-tu-hai-jagdambe-kali-aarti': 'https://commons.wikimedia.org/wiki/Special:FilePath/A_mythological_play_Maa_Durga.jpg?width=900',
  'shri-hanuman-chalisa-full': 'https://commons.wikimedia.org/wiki/Special:FilePath/11TH_Rudra_Shiva_Hanuman.jpg?width=900',
  'jai-ambe-gauri-aarti': 'https://commons.wikimedia.org/wiki/Special:FilePath/Durga-puja-8424032.jpg?width=900',
  'om-aum-mantra-meaning': 'https://commons.wikimedia.org/wiki/Special:FilePath/Rigveda_MS2097.jpg?width=900',
  'mahalakshmi-ashtakam': 'https://commons.wikimedia.org/wiki/Special:FilePath/Diwali_Patrikas.jpg?width=900',
  'the-four-vedas-introduction': 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE_Rigveda,_manuscript_page_sample_ii,_Sanskrit,_Devanagari.jpg?width=900',
  'story-of-ramas-exile': 'https://commons.wikimedia.org/wiki/Special:FilePath/Rama,_Sita,_Lakshmana_and_Hanuman_in_the_forest..jpg?width=900',
  'mahamrityunjaya-mantra': 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
  'bhagavad-gita-ch2-v47': 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_and_Krishna_at_the_Kurukshetra_Mahabharata_war,_Gita.jpg?width=900',
  'gayatri-mantra': 'https://commons.wikimedia.org/wiki/Special:FilePath/Dev_Deepavali_at_Varanasi_DSC04305_07.jpg?width=900'
};

export const SanatanSetuLogo = ({ size = 44, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    aria-label="Sanatan Setu Logo"
    className={`shrink-0 shadow-md rounded-xl ${className}`}
  >
    <defs>
      <linearGradient id="sanatanBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#sanatanBg)" />
    <circle cx="32" cy="32" r="26" fill="none" stroke="#fde68a" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <text
      x="32"
      y="43"
      textAnchor="middle"
      fill="#ffffff"
      fontSize="32"
      fontWeight="bold"
      fontFamily="serif"
    >
      ॐ
    </text>
  </svg>
);

// Advanced CSS Keyframe Animations: Marquee, Liquid Gold Shimmer, Aarti Orbit, Diya Flicker, Floating Particles & 3D Card Glow
export const SacredAnimationsStyle = () => (
  <style>{`
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(2deg); }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes spinReverseSlow {
      from { transform: rotate(360deg); }
      to { transform: rotate(0deg); }
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(234, 88, 12, 0.4), 0 0 45px rgba(245, 158, 11, 0.22); }
      50% { box-shadow: 0 0 36px rgba(234, 88, 12, 0.75), 0 0 70px rgba(245, 158, 11, 0.45); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes shimmerGold {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes sacredMarquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes aartiOrbit {
      0% { transform: rotate(0deg) translateX(78px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(78px) rotate(-360deg); }
    }
    @keyframes diyaFlicker {
      0%, 100% { transform: scale(1) rotate(-2deg); opacity: 0.95; }
      50% { transform: scale(1.14, 1.22) rotate(2deg); opacity: 1; }
    }
    @keyframes chantParticleUp {
      0% { opacity: 1; transform: translateY(0) scale(0.85); }
      100% { opacity: 0; transform: translateY(-95px) scale(1.35); }
    }
    .animate-float-slow { animation: floatSlow 4.2s ease-in-out infinite; }
    .animate-spin-slow { animation: spinSlow 36s linear infinite; }
    .animate-spin-reverse-slow { animation: spinReverseSlow 28s linear infinite; }
    .animate-pulse-glow { animation: pulseGlow 2.8s ease-in-out infinite; }
    .animate-fade-in-up { animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-shimmer-gold {
      background-size: 200% auto;
      animation: shimmerGold 5s ease infinite;
    }
    .animate-sacred-marquee {
      display: flex;
      width: max-content;
      animation: sacredMarquee 34s linear infinite;
    }
    .animate-sacred-marquee:hover {
      animation-play-state: paused;
    }
    .animate-aarti-orbit {
      animation: aartiOrbit 4.2s linear infinite;
    }
    .animate-diya-flicker {
      animation: diyaFlicker 0.9s ease-in-out infinite;
    }
    .animate-chant-particle {
      animation: chantParticleUp 1.1s ease-out forwards;
    }
  `}</style>
);

export const DAILY_SACRED_SHLOKAS = [
  {
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    source: 'Shrimad Bhagavad Gita · 2.47',
    english: 'You have a right to perform your prescribed duty, but never to the fruits of action. Never consider yourself the cause of the results, nor be attached to inaction.',
    hindi: 'तेरा अधिकार केवल कर्तव्य-कर्म करने में ही है, उसके फलों में कभी नहीं। इसलिए तू कर्मों के फल का हेतु मत बन और कर्म न करने में भी तेरी आसक्ति न हो।'
  },
  {
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥',
    source: 'Rigveda · 3.62.10 (Vedamata Gayatri)',
    english: 'We meditate upon the adorable spiritual radiance of Savitr, the Supreme Creator. May that Divine Light illuminate and inspire our intellect.',
    hindi: 'हम उस प्राणस्वरूप, दुःखनाशक, आनंदस्वरूप, श्रेष्ठ सविता देव के दिव्य तेज का ध्यान करते हैं; वह परमात्मा हमारी बुद्धि को सन्मार्ग में प्रेरित करे।'
  },
  {
    sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥',
    source: 'Rigveda · 7.59.12 (Mahamrityunjaya Mantra)',
    english: 'We worship the Three-Eyed Lord Shiva, fragrant and nourishing all beings. May He liberate us from mortality just as a ripened cucumber is freed from its vine, and grant us immortality.',
    hindi: 'हम सुगंधित और पुष्टि के वर्धक तीन नेत्रों वाले भगवान शिव की आराधना करते हैं; वे हमें ककड़ी के फल की भाँति मृत्यु के बंधन से मुक्त करें और अमृतत्व प्रदान करें।'
  },
  {
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    source: 'Shrimad Bhagavad Gita · 4.7',
    english: 'Whenever and wherever there is a decline in righteousness (Dharma) and a predominant rise of unrighteousness (Adharma), O descendant of Bharata, at that time I manifest Myself.',
    hindi: 'हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं धर्म की स्थापना के लिए स्वयं प्रकट होता हूँ।'
  },
  {
    sanskrit: 'असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥',
    source: 'Brihadaranyaka Upanishad · 1.3.28',
    english: 'Lead us from the unreal to the Real; lead us from darkness into Divine Light; lead us from mortality to Immortality.',
    hindi: 'हे प्रभो! हमें असत्य से सत्य की ओर ले चलो, अंधकार से प्रकाश की ओर ले चलो, और मृत्यु से अमरता की ओर ले चलो।'
  }
];

// Dual-Layer Accurate Image Frame: blurred ambient backdrop + accurately fitted foreground so no deity head or temple spire is ever cropped off
export const SacredImageFrame = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  mode = 'contain-blur' // 'contain-blur' fits 100% of image inside frame with glowing blurred backdrop; 'cover-top' covers frame anchored near top
}) => {
  const [imgSrc, setImgSrc] = useState(cleanExternalUrl(src) || fallbackSrc);
  useEffect(() => {
    setImgSrc(cleanExternalUrl(src) || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#1C0F0A] select-none ${className}`}>
      {/* Layer 1: Softly blurred ambient background fill so there are never empty bars */}
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover object-center scale-125 blur-xl opacity-65 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
      {/* Layer 2: Crisp, accurately fitted foreground image */}
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onError={handleError}
        className={`relative z-[1] w-full h-full transition-transform duration-700 ${
          mode === 'cover-top'
            ? 'object-cover object-[center_20%]'
            : 'object-contain object-center p-1 drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]'
        } ${imgClassName}`}
      />
    </div>
  );
};

// Inline YouTube Embed & Sacred Cinema Video Player (Plays Directly on Your Site Without Redirecting!)
export const SacredVideoPlayer = ({ item, darkMode, lang = 'English' }) => {
  const cleanedVideoUrl = cleanExternalUrl(item?.videoUrl || '');
  const ytId = extractYouTubeId(cleanedVideoUrl);
  const ytEmbedUrl = getYouTubeEmbedUrl(cleanedVideoUrl);
  const isDirectVideoFile =
    cleanedVideoUrl.startsWith('data:video/') ||
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(cleanedVideoUrl);

  // Default directly to inline 'youtube' embed player when a YouTube video is present!
  const [playerMode, setPlayerMode] = useState(ytEmbedUrl ? 'youtube' : 'cinema');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [chimeActive, setChimeActive] = useState(true);

  useEffect(() => {
    setPlayerMode(getYouTubeEmbedUrl(item?.videoUrl) ? 'youtube' : 'cinema');
  }, [item?.id, item?.videoUrl]);

  const lines = useMemo(() => {
    const raw = getBodyForLanguage(item, lang) || item.description || item.title;
    return raw
      .split(/\n+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
  }, [item, lang]);

  const totalSec = Math.max(lines.length * 5, 30);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentLineIdx(0);
    setElapsedSec(0);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [item?.id, lang]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => {
        const next = prev + 1;
        if (next >= totalSec) {
          setIsPlaying(false);
          return 0;
        }
        const nextLine = Math.min(lines.length - 1, Math.floor((next / totalSec) * lines.length));
        setCurrentLineIdx(nextLine);
        if (chimeActive && next % 5 === 0) {
          playSacredSound('bead');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, totalSec, lines.length, chimeActive]);

  useEffect(() => {
    if (!isPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = lines[currentLineIdx] || item.title;
      const utt = new SpeechSynthesisUtterance(textToSpeak);
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
      utt.lang = langObj?.locale || (lang === 'English' ? 'en-IN' : 'hi-IN');
      utt.rate = 0.92;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }, [isPlaying, currentLineIdx, lines, lang, item?.title]);

  const togglePlay = () => {
    if (!isPlaying) {
      if (chimeActive) playSacredSound('bell');
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-[#1F140E] border-amber-500/30' : 'bg-amber-50/80 border-amber-900/15'}`}>
      {/* Top Bar: Inline Mode Switcher (No external redirect!) */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
            <Play className="w-4 h-4 fill-[#EA580C]" /> In-App Sacred Video Player
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {ytEmbedUrl && (
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                setPlayerMode('youtube');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all ${
                playerMode === 'youtube'
                  ? 'bg-red-600 text-white'
                  : 'bg-amber-500/15 text-[#EA580C] hover:bg-amber-500/25'
              }`}
            >
              <span>▶️ YouTube Embed</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPlayerMode('cinema')}
            className="px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-orange-600 text-white text-xs font-bold shadow flex items-center gap-1 transition-all"
          >
            🎬 Sacred Cinema Player (Instant Play)
          </button>
        </div>
      </div>

      {/* Inline Video Player Surface (Plays directly on the site without redirecting!) */}
      {isDirectVideoFile ? (
        <video
          src={cleanedVideoUrl}
          controls
          playsInline
          className="w-full rounded-2xl max-h-96 bg-black border border-amber-500/30"
        />
      ) : playerMode === 'youtube' && ytEmbedUrl ? (
        <div className="relative w-full overflow-hidden rounded-2xl aspect-video bg-black border border-amber-500/30 shadow-2xl">
          <iframe
            key={ytId}
            src={ytEmbedUrl}
            title={item.title}
            referrerPolicy="strict-origin-when-cross-origin"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="relative w-full overflow-hidden rounded-2xl aspect-video bg-[#120905] border border-amber-500/30 shadow-2xl flex flex-col justify-between p-5 sm:p-7 text-white select-none">
          <img
            src={cleanExternalUrl(item.imageUrl)}
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              if (item.fallbackImageUrl) e.target.src = item.fallbackImageUrl;
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ${
              isPlaying ? 'scale-110 opacity-45' : 'scale-100 opacity-35'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/50 pointer-events-none" />
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border-2 border-dashed border-amber-400/25 ${
              isPlaying ? 'animate-spin-slow opacity-80' : 'opacity-25'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-full bg-black/65 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <span className={isPlaying ? 'animate-diya-flicker' : ''}>🪔</span>
              <span>{isPlaying ? 'Playing Sacred Recitation & Visual Darshan...' : 'Click Play for In-App Video & Audio Recitation'}</span>
            </span>
            <button
              type="button"
              onClick={() => setChimeActive(!chimeActive)}
              className="px-2.5 py-1 rounded-full bg-black/65 border border-amber-400/30 text-amber-200 text-[11px] font-bold"
            >
              {chimeActive ? '🔔 528Hz Chime On' : '🔕 Chime Muted'}
            </button>
          </div>

          <div className="relative z-10 my-auto text-center max-w-2xl mx-auto space-y-3 px-2">
            {!isPlaying && (
              <button
                type="button"
                onClick={togglePlay}
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#EA580C] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-2xl border-4 border-amber-200 flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all animate-pulse-glow"
                aria-label="Play Sacred Video"
              >
                <Play className="w-9 h-9 fill-white ml-1" />
              </button>
            )}
            <p className="font-serif text-base sm:text-xl md:text-2xl font-bold text-amber-100 drop-shadow leading-relaxed line-clamp-3">
              {lines[currentLineIdx] || item.title}
            </p>
            <div className="text-[11px] text-amber-300/80 font-semibold">
              Verse Segment {currentLineIdx + 1} of {lines.length} · {lang} Audio &amp; Subtitle Stream
            </div>
          </div>

          <div className="relative z-10 space-y-2 bg-black/65 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <input
              type="range"
              min={0}
              max={totalSec}
              value={elapsedSec}
              onChange={(e) => {
                const sec = Number(e.target.value);
                setElapsedSec(sec);
                setCurrentLineIdx(Math.min(lines.length - 1, Math.floor((sec / totalSec) * lines.length)));
              }}
              className="w-full accent-[#EA580C] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs font-bold flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3.5 py-1.5 rounded-lg bg-[#EA580C] hover:bg-orange-600 text-white flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLineIdx((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200"
                >
                  ◀ Prev Verse
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLineIdx((prev) => Math.min(lines.length - 1, prev + 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200"
                >
                  Next Verse ▶
                </button>
              </div>
              <span className="text-amber-200/90 font-mono">
                {fmt(elapsedSec)} / {fmt(totalSec)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Generates rich, unique, zero-latency Vedic SVG artwork for every Category & Sacred Item
export function createSacredArtwork({
  title = 'Sanatan Dharma',
  sanskrit = 'ॐ नमः शिवाय',
  subtitle = 'Sacred Vedic Heritage',
  c1 = '#451a03',
  c2 = '#9a3412',
  c3 = '#ea580c',
  accent = '#fbbf24',
  motif = 'temple'
}) {
  const safe = (str) =>
    String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const motifPaths = {
    temple: `
      <path d="M260 390 L540 390 L520 350 L280 350 Z" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
      <path d="M300 350 L500 350 L470 280 L330 280 Z" fill="${accent}" fill-opacity="0.25" stroke="${accent}" stroke-width="2"/>
      <path d="M340 280 L460 280 L430 190 L370 190 Z" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2"/>
      <path d="M370 190 L430 190 L400 115 Z" fill="${accent}" fill-opacity="0.4" stroke="${accent}" stroke-width="2.5"/>
      <circle cx="400" cy="98" r="14" fill="none" stroke="${accent}" stroke-width="3"/>
      <path d="M400 68 L400 112 M386 98 L414 98" stroke="${accent}" stroke-width="2.5"/>
      <path d="M400 72 L455 86 L400 96 Z" fill="#ef4444" stroke="${accent}" stroke-width="1.5"/>
      <rect x="382" y="310" width="36" height="80" rx="18" fill="#1c0a00" stroke="${accent}" stroke-width="2"/>
    `,
    lotus: `
      <g transform="translate(400,245)">
        <ellipse cx="0" cy="0" rx="38" ry="95" fill="${accent}" fill-opacity="0.28" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(30)" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(-30)" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(60)" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(-60)" fill="${accent}" fill-opacity="0.18" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="40" rx="115" ry="26" fill="${accent}" fill-opacity="0.25" stroke="${accent}" stroke-width="2"/>
        <circle cx="0" cy="0" r="32" fill="${c1}" stroke="${accent}" stroke-width="2.5"/>
      </g>
    `,
    chakra: `
      <g transform="translate(400,245)">
        <circle cx="0" cy="0" r="115" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="10 6"/>
        <circle cx="0" cy="0" r="92" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="52" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <polygon points="0,-90 22,-30 86,-30 34,10 54,74 0,36 -54,74 -34,10 -86,-30 -22,-30" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <circle cx="0" cy="0" r="28" fill="${c1}" stroke="${accent}" stroke-width="3"/>
      </g>
    `,
    trishul: `
      <g transform="translate(400,245)">
        <circle cx="0" cy="-10" r="96" fill="${accent}" fill-opacity="0.14" stroke="${accent}" stroke-width="2" stroke-dasharray="6 6"/>
        <path d="M0 -115 L0 125" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-55 -75 C-55 -10, -15 -5, 0 -15 C15 -5, 55 -10, 55 -75" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
        <polygon points="0,-130 -10,-105 10,-105" fill="${accent}"/>
        <polygon points="-55,-90 -63,-68 -47,-68" fill="${accent}"/>
        <polygon points="55,-90 47,-68 63,-68" fill="${accent}"/>
        <polygon points="-28,25 28,25 0,45" fill="${accent}" fill-opacity="0.5" stroke="${accent}" stroke-width="2"/>
        <polygon points="-28,65 28,65 0,45" fill="${accent}" fill-opacity="0.5" stroke="${accent}" stroke-width="2"/>
      </g>
    `,
    diya: `
      <g transform="translate(400,265)">
        <circle cx="0" cy="-45" r="85" fill="${accent}" fill-opacity="0.18"/>
        <path d="M0 -125 C28 -85, 34 -45, 0 -20 C-34 -45, -28 -85, 0 -125 Z" fill="#fde047" stroke="#f97316" stroke-width="3"/>
        <path d="M0 -100 C15 -72, 18 -48, 0 -30 C-18 -48, -15 -72, 0 -100 Z" fill="#ffffff" fill-opacity="0.85"/>
        <path d="M-110 -15 Q0 15 110 -15 L85 45 Q0 70 -85 45 Z" fill="${accent}" fill-opacity="0.45" stroke="${accent}" stroke-width="3"/>
        <path d="M-65 48 L65 48 L80 68 L-80 68 Z" fill="${accent}" fill-opacity="0.3" stroke="${accent}" stroke-width="2"/>
      </g>
    `,
    scripture: `
      <g transform="translate(400,250)">
        <rect x="-135" y="-65" width="270" height="130" rx="16" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="3"/>
        <rect x="-120" y="-50" width="240" height="100" rx="10" fill="${c1}" fill-opacity="0.65" stroke="${accent}" stroke-width="1.5"/>
        <line x1="-150" y1="-65" x2="150" y2="-65" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <line x1="-150" y1="65" x2="150" y2="65" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <line x1="-85" y1="-22" x2="85" y2="-22" stroke="${accent}" stroke-width="2" stroke-opacity="0.6"/>
        <line x1="-85" y1="22" x2="85" y2="22" stroke="${accent}" stroke-width="2" stroke-opacity="0.6"/>
      </g>
    `,
    himalaya: `
      <g>
        <circle cx="400" cy="175" r="72" fill="#fef08a" fill-opacity="0.28" stroke="${accent}" stroke-width="2"/>
        <polygon points="80,390 250,150 410,390" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <polygon points="240,390 420,110 600,390" fill="${accent}" fill-opacity="0.34" stroke="${accent}" stroke-width="2.5"/>
        <polygon points="430,390 590,170 740,390" fill="${accent}" fill-opacity="0.24" stroke="${accent}" stroke-width="2"/>
        <polygon points="420,110 375,185 405,172 420,195 440,172 465,185" fill="#ffffff" fill-opacity="0.75"/>
      </g>
    `,
    bow: `
      <g transform="translate(400,245)">
        <path d="M-85 -95 Q75 0 -85 95" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <line x1="-85" y1="-95" x2="-85" y2="95" stroke="#fef08a" stroke-width="2.5"/>
        <line x1="-105" y1="0" x2="95" y2="0" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>
        <polygon points="110,0 82,-12 82,12" fill="#fef08a"/>
      </g>
    `
  };

  const selectedMotif = motifPaths[motif] || motifPaths.temple;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="55%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
      <radialGradient id="halo" cx="50%" cy="46%" r="52%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="0.42"/>
        <stop offset="60%" stop-color="${accent}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="${c1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <rect width="800" height="500" fill="url(#halo)"/>
    <rect x="18" y="18" width="764" height="464" rx="22" fill="none" stroke="${accent}" stroke-opacity="0.38" stroke-width="2"/>
    <rect x="28" y="28" width="744" height="444" rx="16" fill="none" stroke="${accent}" stroke-opacity="0.2" stroke-width="1" stroke-dasharray="8 6"/>
    <circle cx="400" cy="235" r="165" fill="none" stroke="${accent}" stroke-opacity="0.22" stroke-width="1.5"/>
    <circle cx="400" cy="235" r="135" fill="none" stroke="${accent}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="5 5"/>
    ${selectedMotif}
    <text x="400" y="72" text-anchor="middle" fill="${accent}" fill-opacity="0.92" font-family="serif" font-size="28" font-weight="bold" letter-spacing="2">${safe(sanskrit)}</text>
    <rect x="110" y="398" width="580" height="62" rx="14" fill="#0f0702" fill-opacity="0.68" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
    <text x="400" y="426" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">${safe(title.length > 48 ? title.slice(0, 46) + '...' : title)}</text>
    <text x="400" y="448" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-size="13" font-weight="bold" letter-spacing="1.5">${safe(subtitle.toUpperCase())}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES = [
  {
    id: 'Vedas',
    code: 'VED',
    name: 'Vedas',
    sanskrit: 'वेद',
    description: 'The eternal Shruti scriptures — Rigveda, Yajurveda, Samaveda, and Atharvaveda.',
    bgImage: createSacredArtwork({
      title: 'The Four Eternal Vedas',
      sanskrit: 'वेदोऽखिलो धर्ममूलम्',
      subtitle: 'VED · Shruti Samhita',
      c1: '#3b0764', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'scripture'
    })
  },
  {
    id: 'Upanishads',
    code: 'UPN',
    name: 'Upanishads',
    sanskrit: 'उपनिषद्',
    description: 'Philosophical teachings, Mahavakyas, and spiritual realizations of the Rishis.',
    bgImage: createSacredArtwork({
      title: 'The Principal Upanishads',
      sanskrit: 'तत्त्वमसि · अहं ब्रह्मास्मि',
      subtitle: 'UPN · Vedanta Jnana',
      c1: '#1e1b4b', c2: '#431407', c3: '#b45309', accent: '#fbbf24', motif: 'lotus'
    })
  },
  {
    id: 'Bhagavad Gita',
    code: 'BG',
    name: 'Bhagavad Gita',
    sanskrit: 'श्रीमद्भगवद्गीता',
    description: "Lord Krishna's celestial song to Arjuna on Karma, Bhakti, and Jnana Yoga.",
    bgImage: createSacredArtwork({
      title: 'Shrimad Bhagavad Gita',
      sanskrit: 'कर्मण्येवाधिकारस्ते',
      subtitle: 'BG · Song of the Lord',
      c1: '#172554', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'chakra'
    })
  },
  {
    id: 'Ramayana',
    code: 'RM',
    name: 'Ramayana',
    sanskrit: 'रामायण',
    description: 'Adi Kavya by Maharshi Valmiki illuminating Maryada Purushottama Sri Rama.',
    bgImage: createSacredArtwork({
      title: 'Valmiki Ramayana',
      sanskrit: 'रामो विग्रहवान् धर्मः',
      subtitle: 'RM · Itihasa Adi-Kavya',
      c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'bow'
    })
  },
  {
    id: 'Mahabharata',
    code: 'MB',
    name: 'Mahabharata',
    sanskrit: 'महाभारत',
    description: 'The grand 18-Parva epic by Maharshi Vedavyasa on Dharma and cosmic order.',
    bgImage: createSacredArtwork({
      title: 'The Great Mahabharata',
      sanskrit: 'यतो धर्मस्ततो जयः',
      subtitle: 'MB · Jaya Samhita',
      c1: '#3f1d0b', c2: '#7f1d1d', c3: '#c2410c', accent: '#fbbf24', motif: 'chakra'
    })
  },
  {
    id: 'Puranas',
    code: 'PUR',
    name: 'Puranas',
    sanskrit: 'पुराण',
    description: 'Eighteen sacred Maha Puranas narrating cosmic creation, avatars, and dharma.',
    bgImage: createSacredArtwork({
      title: 'The 18 Maha Puranas',
      sanskrit: 'अष्टादश पुराणानि',
      subtitle: 'PUR · Cosmic Chronicles',
      c1: '#2e1065', c2: '#701a75', c3: '#c2410c', accent: '#fde68a', motif: 'scripture'
    })
  },
  {
    id: 'Mantras',
    code: 'MTR',
    name: 'Mantras',
    sanskrit: 'मन्त्र',
    description: 'Sacred Vedic chants, Stotrams, and invocations for peace, healing, and Siddhi.',
    bgImage: createSacredArtwork({
      title: 'Sacred Vedic Mantras',
      sanskrit: 'मननात् त्रायते इति मन्त्रः',
      subtitle: 'MTR · Divine Vibrations',
      c1: '#431407', c2: '#9a3412', c3: '#ea580c', accent: '#fef08a', motif: 'trishul'
    })
  },
  {
    id: 'Bhajans',
    code: 'BHJ',
    name: 'Bhajans',
    sanskrit: 'भजन',
    description: 'Devotional Aartis, Stutis, and sacred hymns glorifying the Divine across ages.',
    bgImage: createSacredArtwork({
      title: 'Sacred Bhajans & Aartis',
      sanskrit: 'भज गोविन्दं भज गोविन्दम्',
      subtitle: 'BHJ · Devotional Hymns',
      c1: '#4c0519', c2: '#9f1239', c3: '#ea580c', accent: '#fde047', motif: 'diya'
    })
  },
  {
    id: 'Festivals',
    code: 'UTS',
    name: 'Festivals',
    sanskrit: 'उत्सव',
    description: 'Sacred Utsavs and Vrats — Deepavali, Navaratri, Maha Shivaratri, and Holi.',
    bgImage: createSacredArtwork({
      title: 'Sacred Utsavs & Vrats',
      sanskrit: 'उत्सवप्रियाः खलु मनुष्याः',
      subtitle: 'UTS · Sacred Celebrations',
      c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'diya'
    })
  },
  {
    id: 'Temples',
    code: 'MDR',
    name: 'Temples',
    sanskrit: 'मन्दिर',
    description: 'Char Dham, Jyotirlingas, Shaktipeethas, and sacred Mandir architecture.',
    bgImage: createSacredArtwork({
      title: 'Sacred Hindu Temples',
      sanskrit: 'देवालयो नाम ब्रह्मस्थानम्',
      subtitle: 'MDR · Sacred Mandirs',
      c1: '#271206', c2: '#7c2d12', c3: '#ea580c', accent: '#fbbf24', motif: 'temple'
    })
  },
  {
    id: 'Philosophy',
    code: 'DRS',
    name: 'Philosophy',
    sanskrit: 'दर्शन',
    description: 'Shad Darshana — Vedanta, Yoga, Samkhya, Nyaya, Vaisheshika, and Mimamsa.',
    bgImage: createSacredArtwork({
      title: 'Shad Darshana Philosophy',
      sanskrit: 'दृश्यते अनेन इति दर्शनम्',
      subtitle: 'DRS · Six Orthodox Schools',
      c1: '#0f172a', c2: '#312e81', c3: '#b45309', accent: '#fde047', motif: 'lotus'
    })
  },
  {
    id: 'Sant Teachings',
    code: 'SNT',
    name: 'Sant Teachings',
    sanskrit: 'सन्त वाणी',
    description: 'Timeless wisdom of Tulsidas, Kabir, Mirabai, Adi Shankara, and Bhakti saints.',
    bgImage: createSacredArtwork({
      title: 'Sant Vani & Bhakti Movement',
      sanskrit: 'सन्त समागम हरि कथा',
      subtitle: 'SNT · Wisdom of Saints',
      c1: '#14532d', c2: '#78350f', c3: '#d97706', accent: '#fef08a', motif: 'himalaya'
    })
  }
];

export const INITIAL_SACRED_ITEMS = [
  {
    id: 'jagannath-temple-puri',
    title: 'Jagannath Temple (Puri): The Eastern Abode of the Lord of the Universe',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate guide to Jagannath Puri Dham. Discover the mystery of the wooden deities (Daru Brahma), the world-famous Rath Yatra, the grand Kalinga architecture, and the sacred Mahaprasad.',
    views: 14268,
    likes: 3891,
    language: 'English',
    author: 'Skanda Purana & Temple Chronicles',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Shree Jagannath Temple · Puri Dham',
      sanskrit: 'जय जगन्नाथ स्वामी नयन पथ गामी',
      subtitle: 'Purushottama Kshetra · Char Dham',
      c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'temple'
    }),
    tags: ['jagannath', 'puri', 'char-dham', 'odisha', 'ratha-yatra'],
    body: {
      English: `Shree Jagannath Temple in Puri, Odisha (ancient Purushottama Kshetra or Nilachala Dham), is one of the four supreme Char Dham pilgrimage sites of Sanatan Dharma established by Adi Shankaracharya. Dedicated to Lord Jagannath ("Lord of the Universe", a complete Purna manifestation of Bhagavan Vishnu/Krishna) along with His elder brother Lord Balabhadra, sister Devi Subhadra, and celestial Sudarshana, the present 214-foot-tall monumental temple was commissioned in the 12th century CE by Emperor Anantavarman Chodaganga Deva of the Eastern Ganga Dynasty and completed by King Anangabhima Deva III.

1. Scriptural Origin & Legend of King Indradyumna (Skanda Purana - Utkala Khanda):
In Satya Yuga, Lord Vishnu was worshipped as Neela Madhava (enclosed in a blue sapphire image) by the tribal chief Viswavasu deep in the forests of Nilachala. King Indradyumna of Malwa sent the Brahmin Vidyapati to locate the deity, who disappeared into the golden sands according to divine play. Instructed in a dream via Narada Muni, King Indradyumna performed a thousand Ashwamedha Yajnas, after which a divine fragrant Daru (sacred Neem log bearing the symbols of Shankha, Chakra, Gada, and Padma) floated ashore at Bankimuhan in Puri. The celestial architect Vishwakarma appeared as an aged carpenter (Ananta Maharana) and carved the deities of Jagannath, Balabhadra, Subhadra, and Sudarshana inside closed doors before disappearing into the divine realm.

2. Daru Brahma & The Sacred Nabakalebara Ritual:
Unlike stone (Shila) or metallic (Dhatu) icons found in other Hindu temples, the Ratnavedi deities of Puri are carved from sacred Neem wood (Daru Brahma — the Absolute manifest in living wood). Every 12 to 19 years (in a leap year featuring an extra Ashadha month, known as Purushottama Masa), the deities undergo Nabakalebara ("New Body"). Four sacred Neem trees bearing auspicious Vedic marks are identified by Daitapati servitors after seeking the permission (Ajna Mala) of Maa Mangala of Kakatpur. At midnight on New Moon, inside the dark sanctum with all temple lights extinguished, the sacred Brahma Padartha (life-essence) is transferred from the old idols to the newly consecrated idols.

3. Architectural Grandeur (Kalinga Style - Pancharatha Rekha Deula):
• Four Distinct Mandapas: The temple complex spans over 400,000 square feet enclosed by two concentric defensive walls: Meghanada Prachira (outer wall, 20 ft high) and Kurma Bedha (inner wall). Structurally, it integrates four axial halls:
  - Vimana / Bada Deula (Sanctum Sanctorum): Rising 214 feet (65 meters) above road level on the Ratnavedi platform.
  - Jagamohana (Audience Hall)
  - Nata Mandapa (Dancing Hall)
  - Bhoga Mandapa (Offering Hall)
• The Four Sacred Gates (Dwaras):
  - East: Simhadwara (Lion Gate — representing Moksha / Liberation, guarded by Jaya and Vijaya and fronted by the 34-foot monolithic chlorite Aruna Stambha brought from Konark).
  - South: Ashwadwara (Horse Gate — representing Kama / Valor).
  - West: Vyaghradwara (Tiger Gate — representing Dharma / Righteousness).
  - North: Hastidwara (Elephant Gate — representing Artha / Prosperity).
• The Nila Chakra: Crowning the summit of the main Shikhar is the octagonal Nila Chakra (Blue Wheel) forged from Ashtadhatu (eight sacred metals), measuring 11 feet 8 inches in diameter and weighing over a ton, where the sacred Patitapabana Bana flag is changed every evening by Chunaara servitors climbing barefoot without harness.

4. The World-Famous Annual Rath Yatra (Gundicha Jatra):
On Ashadha Shukla Dwitiya, the three deities step out of the sanctum in the royal Pahandi procession so every human being, regardless of caste, creed, or background, can behold the Lord on the Bada Danda (Grand Avenue) as Patitapabana (Savior of the Fallen).
• Nandighosha (Chariot of Lord Jagannath): 45 feet high, 16 wheels, draped in red and yellow fabric, guarded by Garuda, charioteer Daruka.
• Taladhwaja (Chariot of Lord Balabhadra): 44 feet high, 14 wheels, draped in red and bluish-green fabric, charioteer Matali.
• Darpadalana / Devadalana (Chariot of Devi Subhadra & Sudarshana): 43 feet high, 12 wheels, draped in red and black fabric, charioteer Arjuna.
The King of Puri (Gajapati Maharaja), revered as the First Servitor (Adya Sevaka), sweeps the chariot platforms with a golden-handled broom in the sacred Chhera Panhara ritual, proclaiming that before the Lord of the Universe, emperors and commoners are equal.

5. Rosaghara & The Sacred Mahaprasad (Anna Brahma):
The temple kitchen (Rosaghara) is the largest sacred kitchen in the world, featuring 240 earthen hearths and 500 Suara cooks preparing Chhapana Bhoga (56 sacred dishes) daily using only wood fire and water from two sacred wells (Ganga and Yamuna). Seven earthen pots are stacked vertically over a single wood fire, and remarkably, the topmost pot cooks first while the bottom pot cooks last. Once offered to Lord Jagannath and then re-offered to Goddess Bimala (making it Mahaprasad), it is shared at Ananda Bazaar without any distinction of caste or status.

6. Eight Living Wonders of Shree Jagannath Temple:
• Counter-Wind Flag: The Patitapabana flag atop the Nila Chakra always flaps in the direction opposite to the prevailing wind.
• Zero Skyward Shadow: By architectural precision of Kalinga engineering, the main dome casts no visible shadow on the ground at noon.
• Clear Sky Canopy: No bird or aircraft flies directly above the Nila Chakra.
• Acoustic Threshold at Simhadwara: The roar of the Bay of Bengal (Mahodadhi) ceases the exact step one crosses inward through Simhadwara, and returns upon stepping back out.
• Reverse Sea Breeze: Whereas coastal breezes normally blow from sea to land by day and land to sea by night, in Puri the wind profile reverses to aid temple rituals.
• Exact Sufficiency of Mahaprasad: Whether 2,000 or 200,000 pilgrims visit on a given day, the Mahaprasad never falls short and not a grain is wasted.`,
      Hindi: `श्री जगन्नाथ मंदिर, पुरी (ओडिशा) सनातन धर्म के चार सर्वोच्च धामों (चार धाम) में से पूर्वी धाम है, जिसे शास्त्रों में 'पुरुषोत्तम क्षेत्र', 'नीलाचल धाम' और 'शंख क्षेत्र' कहा गया है। भगवान जगन्नाथ (जगत् के नाथ — श्री विष्णु/कृष्ण का पूर्ण स्वरूप), उनके बड़े भाई बलभद्र, बहन देवी सुभद्रा और सुदर्शन चक्र यहाँ रत्नवेदी पर विराजमान हैं।

१. पौराणिक इतिहास एवं राजा इन्द्रद्युम्न की कथा (स्कन्द पुराण - उत्कल खण्ड):
सतयुग में भगवान विष्णु यहाँ शबर राज विश्वावसु द्वारा 'नीलमाधव' के रूप में पूजे जाते थे। मालवा के धर्मनिष्ठ राजा इन्द्रद्युम्न ने विद्यापति ब्राह्मण को भेजा और बाद में एक सहस्र अश्वमेध यज्ञ किए। भगवान के आदेश से समुद्र तट पर शंख-चक्र-गदा-पद्म चिह्नित पवित्र नीम का दारु (काष्ठ) प्राप्त हुआ। देवशिल्पी विश्वकर्मा ने वृद्ध बढ़ई (अनन्त महाराणा) के रूप में आकर बंद कक्ष में श्री जगन्नाथ, बलभद्र, सुभद्रा और सुदर्शन के विग्रहों का निर्माण किया। वर्तमान २१४ फीट ऊँचा भव्य कलिंग शैली का मंदिर १२वीं शताब्दी में गंग वंश के सम्राट अनन्तवर्मन चोडगंग देव द्वारा प्रारम्भ किया गया तथा राजा अनंगभीम देव तृतीय द्वारा पूर्ण किया गया।

२. दारु ब्रह्म और नवकलेवर रहस्य:
अन्य मंदिरों में पाषाण या धातु की मूर्तियाँ होती हैं, किंतु पुरी में भगवान 'दारु ब्रह्म' (पवित्र नीम काष्ठ) के रूप में पूजे जाते हैं। प्रत्येक १२ से १९ वर्षों में जब आषाढ़ का अधिक मास (पुरुषोत्तम मास) आता है, तब 'नवकलेवर' उत्सव होता है। काकटपुर की माँ मंगला की आज्ञा से पवित्र नीम वृक्षों का चयन कर नए विग्रह बनाए जाते हैं और अमावस्या की मध्यरात्रि को पूर्ण अंधकार में दैतापति सेवकों द्वारा पुराने विग्रहों से 'ब्रह्म पदार्थ' नए विग्रहों में स्थानांतरित किया जाता है।

३. विश्वप्रसिद्ध रथयात्रा (गुंडिचा यात्रा) एवं छेरा पंहरा:
प्रतिवर्ष आषाढ़ शुक्ल द्वितीया को भगवान अपने भक्तों को दर्शन देने के लिए गर्भगृह से बाहर बड़दंड (ग्रैंड रोड) पर तीन विशाल रथों में विराजमान होकर श्री गुंडिचा मंदिर की यात्रा करते हैं:
• नंदीघोष (श्री जगन्नाथ जी का रथ): ४५ फीट ऊँचा, १६ पहिए, लाल और पीले वस्त्रों से सुसज्जित।
• तालध्वज (श्री बलभद्र जी का रथ): ४४ फीट ऊँचा, १४ पहिए, लाल और नीले-हरे वस्त्रों से सुसज्जित।
• दर्पदलन / देवदलन (देवी सुभद्रा एवं सुदर्शन का रथ): ४३ फीट ऊँचा, १२ पहिए, लाल और काले वस्त्रों से सुसज्जित।
पुरी के गजपति महाराज 'आद्य सेवक' के रूप में स्वर्ण झाड़ू से रथों को बुहारते हैं ('छेरा पंहरा'), जो दर्शाता है कि जगन्नाथ के समक्ष राजा और रंक एक समान हैं।

४. महाप्रसाद (अन्न ब्रह्म) एवं मंदिर के दिव्य चमत्कार:
• विश्व की सबसे बड़ी रसोई (रोषघर) में लकड़ी की अग्नि पर मिट्टी के ७ पात्र एक के ऊपर एक रखे जाते हैं, जिनमें सबसे ऊपर के पात्र का अन्न सबसे पहले पकता है। माँ विमला को अर्पित होने के बाद यह 'महाप्रसाद' बन जाता है।
• नीलचक्र के ऊपर लहराती पतितपावन ध्वजा सदैव हवा की विपरीत दिशा में लहराती है।
• मुख्य शिखर के ऊपर कभी कोई पक्षी नहीं उड़ता और सिंहद्वार के भीतर प्रवेश करते ही समुद्र की लहरों की आवाज सुनाई देना बंद हो जाती है।`,
      Sanskrit: `नीलाचलनिवासाय नित्याय परमात्मने ।
बलभद्रसुभद्राभ्यां जगन्नाथाय ते नमः ॥ १ ॥

महाम्भोधेस्तीरे कनकरुचिरे नीलशिखरे
वसन् प्रासादान्तः सहजबलभद्रेण बलिना ।
सुभद्रामध्यागः सकलसुरसेवावसरदो
जगन्नाथः स्वामी नयनपथगामी भवतु मे ॥ २ ॥

कृपापारावारः सजलजलदश्रेणिरुचिरो
रमावाणीरामः स्फुरदमलपद्मेक्षणमुखः ।
सुरेन्द्रैरााराध्यः श्रुतिगणशिखागीतचरितो
जगन्नाथः स्वामी नयनपथगामी भवतु मे ॥ ३ ॥

रथारूढो गच्छन् पथि मिलितभूदेवपटलैः
स्तुतिप्रादुर्भावम् प्रतिपदमुपाकर्ण्य सदयः ।
दयासिन्धुर्बन्धुः सकलजगतां सिन्धुसुतया
जगन्नाथः स्वामी नयनपथगामी भवतु मे ॥ ४ ॥

अर्थविवरणम् (स्कन्दपुराणम् - उत्कलखण्डः):
श्रीजगन्नाथमन्दिरं उडीसामण्डले महोदधितीरे स्थितं सनातनधर्मस्य चतुर्धामसु प्रमुखं पूर्वधाम वर्तते। अत्र भगवान् पुरुषोत्तमः दारुब्रह्मरूपेण भ्रात्रा बलभद्रेण भगिन्या सुभद्रया सुदर्शनचक्रेण च सह रत्नवेद्यां विराजते। आषाढशुक्लद्वितीयायां विश्वप्रसिद्धा रथयात्रा सम्पद्यते यत्र दर्शनादेव भक्ताः मुक्तिं लभन्ते (रथे तु वामनं दृष्ट्वा पुनर्जन्म न विद्यते)।`
    }
  },
  {
    id: 'kamakhya-temple-assam',
    title: 'Kamakhya Temple: The Womb of the Cosmic Mother (Maha Shaktipeeth)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: "A comprehensive guide to the Kamakhya Temple in Assam. Discover the deep Tantric roots, the legend of Sati's sacrifice, and the mysteries of the Ambubachi Mela at this supreme Shaktipeeth.",
    views: 11850,
    likes: 3125,
    language: 'Sanskrit',
    author: 'Kalika Purana & Yogini Tantra',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Maa Kamakhya Maha Shaktipeeth · Nilachal',
      sanskrit: 'कामाख्ये वरदे देवि नीलपर्वतवासिनि',
      subtitle: 'Guwahati, Assam · Supreme Shaktipeeth',
      c1: '#4c0519', c2: '#9f1239', c3: '#e11d48', accent: '#fde047', motif: 'lotus'
    }),
    tags: ['kamakhya', 'shaktipeeth', 'assam', 'devi', 'tantra'],
    body: {
      English: `Perched atop the sacred Nilachal Hill overlooking the mighty Brahmaputra River in Guwahati, Assam (ancient Kamarupa), the Maa Kamakhya Temple is the oldest and most revered of the 51 Shakti Peethas and one of the four Adi Shakti Peethas. Described in the Kalika Purana and Yogini Tantra as the Kubjika Pitha, it is the supreme seat of Tantric Shaktism and the Dasha Mahavidyas.

1. Puranic Origin & The Legend of Daksha Yajna:
According to the Kalika Purana and Devi Bhagavata Purana, when Goddess Sati immolated Herself in the sacrificial fire after King Daksha insulted Lord Shiva, a grief-stricken Shiva carried Her body across the cosmos while performing the Tandava of dissolution. To restore cosmic balance, Lord Vishnu released His Sudarshana Chakra, dividing Sati's sacred body into 51 pieces. At Nilachal Hill in Kamarupa, the Yoni (womb and creative matrix) of the Divine Mother fell, turning the mountain blue (Nilachala) as Lord Shiva himself assumed the form of the mountain to support Her. Here also, Kamadeva regained his divine form (rupa) after being turned to ash by Shiva's third eye, giving the land its name "Kamarupa".

2. The Sanctum Sanctorum (Garbhagriha — Manobhava Guha):
Unlike conventional shrines containing an anthropomorphic statue, the subterranean cave-sanctum of Kamakhya houses no sculpted idol. At the base of steep stone steps illuminated by earthen oil lamps lies a natural rock fissure in the shape of a Yoni, sculpted in stone and perpetually moistened by an underground perennial spring (Jal-Kunda). Devotees touch the sacred spring water and offer red hibiscus flowers, sindoor, and silk garments to the Womb of the Universe from which all creation emanates.

3. The Dasha Mahavidya Complex on Nilachal Hill:
Kamakhya is uniquely surrounded by individual temples dedicated to all ten Tantric Wisdom Goddesses (Dasha Mahavidyas) across Nilachal Hill:
• Kali, Tara, Tripurasundari (Shodashi/Kamakhya), Bhuvaneshwari, Bhairavi, Chhinnamasta, Dhumavati, Bagalamukhi, Matangi, and Kamala, alongside five forms of Lord Shiva (Kameshwara, Siddheshwara, Kedara, Amratakeshwara, and Aghora) and Lord Kama-Ganesha.

4. Architecture (Nilachala Style):
Reconstructed in 1565 CE by King Chilarai and King Nara Narayana of the Koch Dynasty after medieval destruction (and later expanded by the Ahom Kings Siva Singha and Rajeswar Singha), the temple blends ancient stone adhishthana foundations bearing 8th–10th century Gupta/Pala sculptures with a distinctive hemispherical beehive brick Shikhara (Nilachala style) crowned by golden Kalashas. It comprises four chambers aligned east-to-west:Garbhagriha, Calanta, Pancharatna, and Natamandira.

5. Ambubachi Mela (Ameti) & Sacred Festivals:
• Ambubachi Mela (Mid-June / Ashadha): Celebrating the annual fertility and menstruation cycle of Mother Earth and Goddess Kamakhya. For three days, the temple doors remain completely closed, agricultural plowing ceases across traditional households, and the underground spring turns reddish with natural iron-oxide and vermilion. On the fourth day (Nivritti), after the ceremonial bath of the Goddess, the doors open and pilgrims receive Angodak (spring water) and Angabastra (red cloth moistened by the sacred spring) as supreme protection.
• Deodhani Festival & Manasa Puja (August): Sacred ritual dance celebrating the serpent goddess Manasa and Shakti traditions.`,
      Hindi: `असम के गुवाहाटी में ब्रह्मपुत्र नदी के तट पर नीलाचल पर्वत पर स्थित माँ कामाख्या मंदिर ५१ शक्तिपीठों में सर्वोच्च 'महाशक्तिपीठ' तथा तंत्र साधना का विश्वप्रसिद्ध केंद्र है। कालिका पुराण और योगिनी तंत्र में इस पावन क्षेत्र को 'कामरूप' और 'कुब्जिका पीठ' कहा गया है।

१. पौराणिक कथा एवं शक्तिपीठ की उत्पत्ति:
पौराणिक कथा के अनुसार, प्रजापति दक्ष के यज्ञ में भगवान शिव का अपमान सहन न कर पाने के कारण माता सती ने योगाग्नि में देह त्याग दिया। विरहाकुल भगवान शिव सती के पार्थिव शरीर को लेकर तांडव करने लगे। सृष्टि की रक्षा हेतु भगवान विष्णु ने सुदर्शन चक्र से सती के देह के ५१ भाग किए। नीलाचल पर्वत पर माता सती का 'योनि भाग' (गर्भ एवं सृजन शक्ति का मूल स्रोत) गिरा, जिससे यह स्थान अखिल ब्रह्मांड की मातृशक्ति का सर्वोच्च केंद्र बन गया। कामदेव को भस्म होने के बाद यहीं पुनः अपना रूप प्राप्त हुआ था, इसलिए यह क्षेत्र 'कामरूप' कहलाया।

२. गर्भगृह (मनोभव गुफा) का रहस्य:
कामाख्या मंदिर के भूमिगत गर्भगृह में देवी की कोई मानवाकृति प्रतिमा नहीं है, अपितु शिला में बनी प्राकृतिक योनि-मुद्रा है, जिस पर एक भूमिगत प्राकृतिक जलस्रोत से निरंतर जल प्रवाहित होता रहता है। इसे सृष्टि की उत्पत्ति का मूल मानकर लाल गुड़हल के पुष्प, सिंदूर और रक्तवस्त्र से पूजा जाता है।

३. दश महाविद्या एवं पंच शिव धाम:
नीलाचल पर्वत पर माँ कामाख्या (त्रिपुरसुंदरी/षोडशी) के साथ-साथ काली, तारा, भुवनेश्वरी, भैरवी, छिन्नमस्ता, धूमावती, बगलामुखी, मातंगी और कमला — इन दसों महाविद्याओं तथा कामेश्वर और सिद्धेश्वर सहित पाँच महादेवों के मंदिर स्थित हैं।

४. अम्बुबाची मेला एवं स्थापत्य:
१६वीं शताब्दी में कोच राजवंश के महाराजा नरनारायण एवं सेनापति चिलाराय द्वारा पुनर्निर्मित इस मंदिर का मधुमक्खी के छत्ते जैसा शिखर 'नीलाचल स्थापत्य शैली' का अद्भुत उदाहरण है। प्रतिवर्ष जून माह (आषाढ़) में 'अम्बुबाची मेला' आयोजित होता है, जब माता के वार्षिक रजस्वला पर्व के दौरान तीन दिनों तक मंदिर के कपाट बंद रहते हैं और चौथे दिन भक्तों को पवित्र 'रक्तवस्त्र' (अंगवस्त्र) प्रसाद के रूप में वितरित किया जाता है।`,
      Sanskrit: `कामाख्ये वरदे देवि नीलपर्वतवासिनि ।
त्वं देवि जगतां मातर्योनिमुद्रे नमोऽस्तु ते ॥ १ ॥

सर्वकामेश्वरिं देवीं सर्वसिद्धिप्रदायिनीम् ।
कामरूपस्थितां नित्यं कामाख्यां प्रणमाम्यहम् ॥ २ ॥

कालिकापुराणोक्तं माहात्म्यम्:
ब्रह्मपुत्रनदीतीरे नीलाचलपर्वते स्थितं श्रीकामाख्यापीठं पञ्चाशत्सु शक्तिपीठेषु सर्वोत्कृष्टं महाशक्तिपीठं वर्तते। अत्र भगवत्याः सतीदेव्याः योनिमण्डलं निपतितम्। गुहागर्भे शिलामयी योनिमुद्रा नित्यं जलस्रोतसा सिक्ता पूज्यते। अत्र दशमहाविद्यानां पञ्चशिवानां च सन्निधिः विद्यते। आषाढमासे अम्बुवाचीपर्वणि भक्ताः मातुः रक्तवस्त्रं लब्ध्वा सर्वसिद्धिं प्राप्नुवन्ति।`
    }
  },
  {
    id: 'badrinath-dham-himalaya',
    title: 'Badrinath Dham: The Supreme Himalayan Abode of Lord Vishnu',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate guide to Badrinath Dham, the northern Char Dham. Explore its Vedic origins, the legend of Nar-Narayan, Tapt Kund, and the mystery of the 6-month Akhand Jyoti.',
    views: 16548,
    likes: 4512,
    language: 'Sanskrit',
    author: 'Skanda Purana (Kedara Khanda) & Bhagavata Purana',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Shree Badrinath Dham · Badrikashram',
      sanskrit: 'ॐ नमो भगवते वासुदेवाय · बदरीविशाल लाल की जय',
      subtitle: 'Uttarakhand Himalayas · Northern Char Dham',
      c1: '#0f172a', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'himalaya'
    }),
    tags: ['badrinath', 'vishnu', 'char-dham', 'himalayas', 'uttarakhand'],
    body: {
      English: `Nestled at an altitude of 3,133 meters (10,279 feet) between the sacred Nar and Narayana mountain ranges beneath the towering Neelkanth Peak (6,596 m) along the Alaknanda River in Chamoli, Uttarakhand, Shree Badrinath Dham (Badrikashram) is the Northern Abode of the All-India Char Dham and the crowning jewel of Uttarakhand's Chota Char Dham.

1. Vedic & Puranic Origins (Nar-Narayana & Badri Vana):
Revered in the Mahabharata, Bhagavata Purana, and Skanda Purana as Bhuloka Vaikuntha (Vishnu's heaven on earth), Badrikashram is the site where the twin sages Nara and Narayana (incarnations of Lord Vishnu) performed millennia of austerities for the welfare of living beings. When Lord Vishnu meditated here exposed to harsh Himalayan snowstorms, Goddess Lakshmi assumed the form of a Badri tree (Indian jujube / berry tree, Badari) to shelter Him overhead. Moved by Her selfless devotion, the Lord named the shrine "Badrikashram" and declared that Her name would precede His as Badri-Vishal.

2. The Swayambhu Shaligram Deity & Adi Shankaracharya:
The central icon of Lord Badrinarayan is a 1-foot (0.3 m) black Shaligram stone (Swayambhu — self-manifested) showing Lord Vishnu seated in meditative Padmasana posture (rather than reclining or standing), holding the Shankha (conch) and Chakra in two lifted hands while His lower two hands rest on His lap in Yogamudra. According to tradition, the idol was originally worshipped by the Devas and later cast into Narad Kund along the Alaknanda River during the Buddhist era; in the 8th century CE, Jagadguru Adi Shankaracharya diving into Narad Kund retrieved the Swayambhu deity, enshrined it in the temple, and instituted the tradition of the Rawal (head priest from the Nambudiri Brahmin lineage of Kerala). Surrounding Badrinarayan inside the Garbhagriha are Kuvera, Narada Muni, Uddhava, Nara, Narayana, Garuda, and separate shrines for Goddess Lakshmi and Adi Shankaracharya.

3. Sacred Wonders of Badrinath Dham:
• The 6-Month Akhanda Jyoti (Eternal Flame): Due to heavy snowfall, Badrinath opens each year on Akshaya Tritiya (April/May) and closes on Vijayadashami/Kartik (November). For the six winter months when the temple is snowbound and human worship transfers to Pandukeshwar and Joshimath (Narasimha Temple), it is believed that Devarshi Narada and the Devas conduct daily worship. When the Rawal unlocks the doors in spring after six months, the ghee lamp (Akhanda Jyoti) lit inside the sealed sanctum before winter is found still burning brightly.
• Tapt Kund & Pancha Shilas: Directly below the temple alongside the freezing Alaknanda River gushes Tapt Kund, a natural geothermal sulfur spring maintaining 45°C–55°C year-round, considered the sacred abode of Agni Deva. Nearby stand the Pancha Shilas (Narad, Narasimha, Baraha, Garur, and Markandeya Shilas) and Brahma Kapal, where ancestral Pinda Daana grants final liberation to Pitrs.
• Mana Village & Vyas Gufa (3 km away): The last Himalayan village on the ancient Saraswati-Alaknanda confluence (Keshav Prayag), home to Bhima Pul, Ganesh Gufa, and Vyas Gufa—where Maharshi Krishna Dwaipayana Vedavyasa compiled the four Vedas, dictated the Mahabharata to Lord Ganesha, and composed the Srimad Bhagavatam.`,
      Hindi: `उत्तराखंड के चमोली जिले में अलकनंदा नदी के पावन तट पर नर और नारायण पर्वत श्रेणियों के मध्य ३,१३३ मीटर (१०,२७९ फीट) की ऊँचाई पर स्थित श्री बद्रीनाथ धाम सनातन धर्म के चार धामों में उत्तरी धाम तथा 'भूलोक का वैकुण्ठ' है।

१. पौराणिक महत्व एवं 'बद्रीविशाल' नाम की उत्पत्ति:
श्रीमद्भागवत पुराण और स्कन्द पुराण के केदारखण्ड के अनुसार, यहाँ भगवान विष्णु के अंशावतार धर्मपुत्र 'नर' और 'नारायण' ऋषियों ने लोककल्याण हेतु सहस्रों वर्षों तक घोर तपस्या की थी। जब भगवान विष्णु हिमालय की भीषण हिमवर्षा में ध्यानमग्न थे, तब माता लक्ष्मी ने 'बदरी' (बेर) के वृक्ष का रूप धारण कर उन्हें हिमपात से आच्छादित कर लिया। माता लक्ष्मी की इस सेवा से प्रसन्न होकर भगवान ने इस स्थान को 'बदरीकाश्रम' नाम दिया।

२. स्वयंभू शालिग्राम विग्रह एवं आदि शंकराचार्य:
गर्भगृह में भगवान बद्रीनारायण की १ फीट ऊँची काले शालिग्राम पाषाण की चतुर्भुज स्वयंभू प्रतिमा पद्मासन (ध्यान मुद्रा) में विराजमान है, जिनके दो हाथों में शंख और चक्र हैं तथा दो हाथ योगमुद्रा में गोद में स्थित हैं। ८वीं शताब्दी में जगद्गुरु आदि शंकराचार्य ने अलकनंदा के नारद कुंड से इस दिव्य प्रतिमा को निकालकर पुनः प्रतिष्ठित किया और केरल के नम्बूदरी ब्राह्मण वंश के 'रावल' द्वारा पूजा की परंपरा स्थापित की।

३. ६ माह की अखंड ज्योति, तप्त कुंड एवं माणा गाँव:
• अखंड ज्योति का चमत्कार: शीतकाल में ६ महीने मंदिर के कपाट बंद रहते हैं (जब पूजा जोशीमठ के नरसिंह मंदिर में होती है) और मान्यता है कि इस अवधि में देवर्षि नारद भगवान की पूजा करते हैं। ६ माह बाद जब कपाट खुलते हैं, तो गर्भगृह में प्रज्वलित घृत की 'अखंड ज्योति' जलती हुई मिलती है।
• तप्त कुंड एवं ब्रह्मकपाल: बर्फीली अलकनंदा के ठीक पास प्राकृतिक गर्म जल का कुंड 'तप्त कुंड' (अग्निदेव का निवास) तथा पितरों के मोक्ष हेतु 'ब्रह्मकपाल' तीर्थ है।
• माणा गाँव एवं व्यास गुफा: मंदिर से ३ किमी दूर सरस्वती-अलकनंदा संगम (केशव प्रयाग) पर स्थित माणा गाँव में व्यास गुफा और गणेश गुफा हैं, जहाँ महर्षि वेदव्यास ने वेदों का विभाजन किया और श्री गणेश जी ने महाभारत लिपिबद्ध किया।`,
      Sanskrit: `पवनमन्दसुगन्धिशीतलं हेममन्दिरशोभितं
निकटस्थितालकनन्दां बदरीनाथं भजाम्यहम् ॥ १ ॥

तप्तकुण्डं सुपुण्यं च नरनारायणाश्रमम् ।
नीलकण्ठशिखराग्रं बदरीेशं नमाम्यहम् ॥ २ ॥

श्रीमद्भागवतपुराणोक्तं माहात्म्यम्:
अलकनन्दातटे नरनारायणपर्वतयोर्मध्ये स्थितं श्रीबदरीकाश्रमं सनातनधर्मस्य चतुर्धामसु उत्तरधाम वर्तते। अत्र भगवान् नारायणः पद्मासनस्थः योगमुद्रया शालिग्रामशिलारूपेण विराजते। महर्षिणा वेदव्यासेन अत्रैव सरस्वतीनदीतीरे व्यासगुहायां चतुर्वेदानां विभागः अष्टादशपुराणानां महाभारतस्य च रचना कृता।`
    }
  },
  {
    id: 'sri-ranganathaswamy-temple',
    title: 'Sri Ranganathaswamy Temple: The Largest Functioning Hindu Temple in the World',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate, comprehensive guide to the Sri Ranganathaswamy Temple in Srirangam. Explore its 156-acre architecture, the legend of Vibhishana, the 7 Prakaras, and unique Vaishnava rituals.',
    views: 15070,
    likes: 4210,
    language: 'English',
    author: 'Sriranga Mahatmyam & Divya Prabandham',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Sri Ranganathaswamy Temple · Srirangam',
      sanskrit: 'कवेरजातीरविहारिणे नमः श्रीरङ्गनाथाय',
      subtitle: '156-Acre Bhuloka Vaikuntha · 108 Divya Desams',
      c1: '#1e1b4b', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'temple'
    }),
    tags: ['srirangam', 'ranganatha', 'vishnu', 'architecture', 'tamil-nadu'],
    body: {
      English: `Situated on an ethereal island formed by the twin rivers Kaveri and Kollidam (Coleroon) in Tiruchirappalli, Tamil Nadu, the Sri Ranganathaswamy Temple at Srirangam is the largest functioning Hindu temple complex in the world and the foremost (Mudhal) among the 108 Divya Desams glorified by the Alvars.

1. Scriptural Origin & The Legend of Sri Rama and Vibhishana:
According to the Sriranga Mahatmyam (Brahmanda Purana), the sacred Ranga Vimana emerged from the cosmic ocean after Lord Brahma's austerities and was later brought to Ayodhya by King Ikshvaku as the ancestral family deity (Kuladhana) of the Solar Dynasty. After the coronation (Pattabhisheka) of Lord Rama following the Lanka conflict, Rama gifted the sacred Ranga Vimana to Vibhishana out of love, with the condition that if placed on the ground before reaching Lanka, it would become permanently rooted. Reaching the verdant island of Srirangam along the Kaveri, Vibhishana set the Vimana down to perform his daily Sandhyavandanam and honour King Dharma Varma's penance. When he tried to lift it, the Vimana had fused with the island. Lord Ranganatha promised Vibhishana that He would forever recline facing South toward Lanka to bless him.

2. 156-Acre Cosmic Town-Temple Architecture (7 Concentric Prakaras & 21 Gopurams):
• Area & Layout: Spanning 156 acres (631,000 sq m) with a perimeter of over 4 kilometers (10,710 feet), Srirangam is a living temple-city built in the Dravidian Agama tradition.
• 7 Concentric Enclosures (Sapta Prakaras): Representing the seven Koshas (sheaths of existence) and seven upper worlds (Sapta Lokas). The outermost three Prakaras house thriving Brahmin Agraharams, markets, and flower gardens, while the inner four Prakaras are sacred ritual corridors.
• 21 Magnificent Gopurams: Led by the towering Raja Gopuram at the southern entrance, standing 239.5 feet (73 meters) tall across 13 tiers, making it one of the tallest temple towers in Asia.
• Golden Pranavakara Vimana: The dome over the inner sanctum is shaped like the sacred syllable Om (Pranava) and plated in pure gold, surrounded by the four architectural projections referencing the four Vedas.
• Ayiram Kaal Mandapam (Hall of 1,000 Pillars): Carved from solid granite during the Vijayanagara period, featuring rearing warhorses (Yalis) and narrative sculptures.

3. Sri Ramanujacharya's Eternal Presence:
Srirangam was the spiritual capital of all 12 Alvar saints (including Andal, who merged directly with Lord Ranganatha here) and the great Vishishtadvaita philosopher Acharya Ramanuja (1017–1137 CE), who organized the temple's administration into 56 distinct Kottus (service divisions). Within the temple's Vasantha Mandapam rests the preserved physical form (Thaanaana Thirumeni) of Sri Ramanujacharya, anointed twice yearly with saffron and camphor for nearly 900 years.`,
      Hindi: `तमिलनाडु के तिरुचिरापल्ली में कावेरी और कोल्लिडम नदियों के मध्य बने पावन द्वीप 'श्रीरंगम' पर स्थित श्री रंगनाथस्वामी मंदिर विश्व का सबसे बड़ा कार्यरत (पूजा-अर्चना वाला) हिंदू मंदिर परिसर है तथा १०८ दिव्य देशमों में प्रथम एवं सर्वोच्च 'भूलोक वैकुण्ठ' माना जाता है।

१. रामायण कालीन इतिहास एवं विभीषण की कथा:
ब्रह्माण्ड पुराण के अनुसार, भगवान विष्णु का यह 'रंग विमान' मूल रूप से ब्रह्माजी की तपस्या से प्रकट हुआ था और सूर्यवंश के राजा इक्ष्वाकु इसे अयोध्या लाए थे। भगवान श्रीराम ने अपने राज्याभिषेक के पश्चात लंकापति विभीषण की भक्ति से प्रसन्न होकर उन्हें यह कुलदेवता का विमान भेंट किया, किंतु शर्त रखी कि लंका पहुँचने से पहले इसे भूमि पर न रखा जाए। कावेरी तट के रमणीय द्वीप श्रीरंगम में संध्यावंदन के लिए जब विभीषण ने इसे भूमि पर रखा, तो विमान वहीं अचल हो गया। तब भगवान रंगनाथ ने विभीषण को वचन दिया कि वे सदैव दक्षिण दिशा (लंका) की ओर मुख करके शेषशय्या पर शयन करेंगे।

२. १५६ एकड़ का विराट स्थापत्य (७ प्रकार एवं २१ गोपुरम):
• यह मंदिर परिसर १५६ एकड़ में फैला एक जीवंत मंदिर-नगर है, जो सात संकेंद्रित प्राचीरों (सप्त प्रकार) से घिरा है, जो योग के सात कोषों और सप्त लोकों के प्रतीक हैं।
• इसमें २१ भव्य गोपुरम हैं, जिनमें दक्षिणी द्वार का १३ मंजिला 'राजगोपुरम' २३९.५ फीट (७३ मीटर) ऊँचा है।
• गर्भगृह के ऊपर 'प्रणवाकार विमान' (ॐ के आकार का स्वर्ण मंडित शिखर) है, जिसके नीचे भगवान रंगनाथ अनन्त शेषनाग की शय्या पर योगनिद्रा में विराजमान हैं।
• मंदिर में विजयनगर काल का 'आयरम काल मंडपम' (१००० स्तंभों वाला मंडप) तथा विशिष्टाद्वैत दर्शन के प्रणेता श्री रामानुजाचार्य का ९०० वर्षों से सुरक्षित पार्थिव शरीर भी स्थित है।`,
      Sanskrit: `कावेरीविरजा सेयं वैकुण्ठं रङ्गमन्दिरम् ।
स वासुदेवो रङ्गेशः प्रत्यक्षं परमं पदम् ॥ १ ॥

कस्तूरीतिलकं ललाटपटले वक्षःस्थले कौस्तुभं
नासाग्रे वरमौक्तिकं करतले वेणुं करे कङ्कणम् ।
सर्वाङ्गे हरिचन्दनं सुललितं कण्ठे च मुक्तावलिं
गोपस्त्रीपरिवेष्टितो विजयते गोपालचूडामणिः ॥ २ ॥

श्रीरङ्गमाहात्म्यम्:
कावेरीनदीद्वीपे स्थितं श्रीरङ्गनाथस्वामिमन्दिरं विश्वस्य बृहत्तमं जीवन्तं देवालयपरिसरं वर्तते। अत्र भगवान् श्रीरङ्गनाथः शेषनागशय्यायां दक्षिणदिशां (लङ्कां) प्रति अभीष्टवरदः शयानः विराजते। सप्तप्रकारैः एकविंशतिगोपुरैः सहस्रस्तम्भमण्डपेन च मण्डितं इदं क्षेत्रं अष्टाधिकशतदिव्यदेशेषु प्रथमं वर्तते।`
    }
  },
  {
    id: 'angkor-wat-vishnu-temple',
    title: 'Angkor Wat: The Cosmic Temple of Lord Vishnu (Cambodia)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Discover Angkor Wat, the largest religious monument in the world. Explore its Khmer architecture, its dedication to Lord Vishnu (Paramavishnuloka), and the Hindu epics carved in stone.',
    views: 10944,
    likes: 2940,
    language: 'English',
    author: 'Khmer Sanskrit Inscriptions & Shilpa Chronicles',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Angkor Wat · Paramavishnuloka',
      sanskrit: 'ॐ नमो भगवते वासुदेवाय · मेरुपर्वतस्वरूपम्',
      subtitle: 'Siem Reap, Cambodia · Largest Religious Monument',
      c1: '#1c1917', c2: '#78350f', c3: '#d97706', accent: '#fde047', motif: 'temple'
    }),
    tags: ['angkor-wat', 'vishnu', 'cambodia', 'khmer', 'architecture'],
    body: {
      English: `Spanning 402 acres (162.6 hectares) in Siem Reap, Cambodia, Angkor Wat (originally named "Vrah Vishnuloka" or "Paramavishnuloka" in Sanskrit — the Supreme Abode of Lord Vishnu) is the largest religious monument ever constructed in human history. Commissioned in the early 12th century CE (1113–1150 CE) by the Khmer Emperor Suryavarman II, it stands as a breathtaking testament to the global spread of Sanatan Dharma and Vedic cosmology across Southeast Asia (Suvarnabhumi).

1. Vedic Cosmology Embodied in Stone (Mount Meru & Kshirakbdhi):
Angkor Wat was engineered as an exact terrestrial replica of the Hindu cosmos:
• The Five Lotus Towers (Quincunx): The central tower rises 213 feet (65 meters) surrounded by four subsidiary peaks, symbolizing the five sacred peaks of Mount Meru, the cosmic axis mundi and abode of the Devas.
• The Concentric Galleries: Represent the Himalayan mountain ranges encircling Mount Meru.
• The Outer Moat: Measuring 190 meters wide and extending over 5 kilometers around the complex, it represents the cosmic oceans (Kshira Sagara) surrounding creation.
• Western Orientation & Equinox Alignment: Unlike most temples that face East, Angkor Wat faces West—the direction associated with Lord Vishnu—and is astronomically aligned so that on the Vernal Equinox, the rising sun crowns the exact apex of the central lotus tower.

2. The 800-Meter Sandstone Bas-Reliefs of Hindu Epics:
Along the third enclosure run nearly half a mile of intricately carved sandstone bas-reliefs depicting foundational episodes of Sanatan Dharma:
• Samudra Manthan (Churning of the Ocean of Milk): The famous 49-meter East Gallery relief shows 92 Asuras and 88 Devas pulling the serpent Vasuki wrapped around Mount Mandara, with Lord Vishnu as Kurma (the cosmic tortoise) at the base and presiding at the center as Apsaras dance overhead.
• The Battle of Kurukshetra (Mahabharata): The West Gallery immortalizes the Pandava and Kaurava armies led by Arjuna, Krishna, and Bhishma Pitamaha on his bed of arrows.
• The Battle of Lanka (Ramayana): Depicting Lord Rama, Lakshmana, Hanuman, and the Vanara Sena vanquishing the ten-headed twenty-armed Ravana.`,
      Hindi: `कम्बोडिया के सिएम रीप में ४०२ एकड़ (१६२.६ हेक्टेयर) क्षेत्र में फैला 'अंकोरवाट' मंदिर विश्व का सबसे विशाल धार्मिक स्मारक है। १२वीं शताब्दी के पूर्वार्ध (१११३-११५० ई.) में खमेर सम्राट सूर्यवर्मन द्वितीय द्वारा निर्मित इस भव्य मंदिर का मूल संस्कृत नाम 'परमविष्णुलोक' था और यह भगवान विष्णु को समर्पित है।

१. पाषाण में उकेरा गया वैदिक ब्रह्माण्ड (सुमेरु पर्वत एवं क्षीरसागर):
• पाँच कमल शिखर: मंदिर के केंद्र में २१३ फीट ऊँचा मुख्य शिखर और उसके चारों ओर चार अन्य शिखर ब्रह्माण्ड के केंद्र 'सुमेरु पर्वत' के पाँच शिखरों का प्रतिनिधित्व करते हैं।
• विशाल जल खाई (मोट): मंदिर के चारों ओर ५ किलोमीटर लंबी और १९० मीटर चौड़ी विशाल जलराशि 'क्षीरसागर' (ब्रह्माण्डीय महासागर) का प्रतीक है।
• खगोलीय संरेखण: भगवान विष्णु की दिशा पश्चिम की ओर अभिमुख इस मंदिर की संरचना ऐसी है कि वसंत विषुव (Equinox) के दिन सूर्योदय ठीक केंद्रीय शिखर के शीर्ष के ऊपर होता है।

२. रामायण, महाभारत एवं समुद्र मंथन के भित्तिचित्र:
मंदिर के गलियारों में ८०० मीटर से अधिक लंबी बलुआ पत्थर की दीवारों पर सनातन धर्म के महाकाव्यों का अद्भुत उत्कीर्णन है:
• समुद्र मंथन: ४९ मीटर लंबी दीवार पर मंदराचल पर्वत, वासुकि नाग, कूर्म अवतार भगवान विष्णु, ८८ देवताओं और ९२ असुरों द्वारा अमृत मंथन का सजीव चित्रण।
• महाभारत का कुरुक्षेत्र युद्ध (भीष्म की शरशय्या एवं अर्जुन-कृष्ण रथ) तथा वाल्मीकि रामायण का लंका युद्ध (श्रीराम, हनुमान एवं रावण युद्ध)।`,
      Sanskrit: `मेरुशृङ्गसमं रम्यं परमविष्णुलोककम् ।
सूर्यवर्मनृपेणैतत् निर्मितं विष्णुमन्दिरम् ॥ १ ॥

समुद्रमन्थनं चैव रामायणमहाकथा ।
महाभारतयुद्धं च शिलापट्टेषु चित्रितम् ॥ २ ॥

ऐतिहासिकं विवरणम्:
कम्बोजदेशे (Cambodia) स्थितं अङ्कोरवाटमन्दिरं विश्वस्य विशालतमं धार्मिकं स्मारकं वर्तते। द्वादशशताब्द्यां सम्राजा सूर्यवर्मणा निर्मितं इदं देवालयपरिसरं संस्कृतभाषया 'परमविष्णुलोकः' इति विख्यातम्। अत्र पञ्चशिखराणि सुमेरुगिरिं बाह्यपरिखा च क्षीरसागरं निरूपयन्ति।`
    }
  },
  {
    id: 'sant-teachings-bhakti-movement',
    title: 'Sant Teachings: The Bhakti Movement and the Path of Divine Love',
    category: 'Sant Teachings',
    sanskritBadge: 'सन्त · Sant Vani',
    contentType: 'Text',
    description: 'Explore the rich Sant Parampara of Sanatan Dharma. Discover the Bhakti movement, the poetry of divine love, and the core teachings of mystics like Kabir, Tulsidas, Mirabai, Surdas, and Tukaram.',
    views: 9845,
    likes: 2640,
    language: 'English',
    author: 'Bhaktamal & Sant Vani Sangraha',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Sant Parampara & The Bhakti Movement',
      sanskrit: 'प्रेम गली अति सांकरी तामें दो न समाहिं',
      subtitle: 'Kabir · Tulsidas · Mirabai · Surdas · Tukaram',
      c1: '#14532d', c2: '#78350f', c3: '#d97706', accent: '#fef08a', motif: 'diya'
    }),
    tags: ['bhakti', 'tulsidas', 'mirabai', 'kabir', 'sant-vani'],
    body: {
      English: `The Sant Parampara and the Bhakti Movement represent one of the greatest spiritual renaissances in human history. Beginning in South India between the 6th and 9th centuries CE with the 12 Vaishnava Alvars and 63 Shaiva Nayanars ("Bhakti Dravida Upaji, Layee Ramananda"), it swept across all of India through Acharyas and poet-saints who sang in the spoken vernacular languages of the people—Awadhi, Braj Bhasha, Maithili, Marathi, Gujarati, Bengali, Kannada, Tamil, and Odia—proclaiming that pure love (Prema-Bhakti) and remembrance of the Divine Name (Naam-Smarana) transcend every barrier of birth, scholarship, or status.

1. The Two Streams of Bhakti: Saguna and Nirguna:
• Saguna Bhakti (Devotion to the Divine with Form & Attributes): Worshipping the Supreme Brahman manifest as Sri Rama, Sri Krishna, Shiva, or Devi. Championed by Goswami Tulsidas, Surdas, Mirabai, Chaitanya Mahaprabhu, Vallabhacharya, Narsi Mehta, and Eknath.
• Nirguna Bhakti (Devotion to the Formless, All-Pervading Absolute): Realizing the indwelling Ram/Hari within the heart through inner purity, Satsang, and the Guru's grace. Championed by Sant Kabir, Guru Ravidas, Sant Namdev, Dadu Dayal, and Guru Nanak.

2. Timeless Voices & Immortal Couplets of the Great Saints:
• Goswami Tulsidas (1532–1623 CE): Author of the Ramcharitmanas, Hanuman Chalisa, and Vinaya Patrika.
  "सिया राम मय सब जग जानी। करउँ प्रनाम जोरि जुग पानी॥"
  (Recognizing the entire universe as pervaded by Sita and Rama, I bow to all beings with folded hands.)
• Sant Kabir Das (15th Century CE): Mystic weaver of Kashi whose Dohas (Sakhi, Sabad, Ramaini) pierce straight through ego and hypocrisy:
  "पोथी पढ़ि पढ़ि जग मुआ, पंडित भया न कोय। ढाई आखर प्रेम का, पढ़े सो पंडित होय॥"
  (Reading massive tomes the world passed away, yet none became truly wise; whoever learns the two-and-a-half syllables of Love [Prem] becomes a true sage.)
• Bhaktashiromani Mirabai (1498–1547 CE): Rajput princess of Mewar who renounced royal luxury for unshakeable Madhurya Bhakti toward Giridhar Gopal:
  "मेरे तो गिरधर गोपाल, दूसरो न कोई। जाके सिर मोर मुकुट, मेरो पति सोई॥"
• Mahakavi Surdas (1478–1583 CE): The blind bard of Braj whose Sur Sagar captures the childhood pastimes (Bal-Lila) and Vatsalya rasa of Sri Krishna.
• Sant Tukaram & Jnaneshwar (Maharashtra Varkari Tradition): Devotees of Lord Vitthala of Pandharpur whose Abhangas and Jnaneshwari brought the Bhagavad Gita into every village home.`,
      Hindi: `सनातन धर्म की 'सन्त परम्परा' और 'भक्ति आन्दोलन' ने आध्यात्मिक ज्ञान को संस्कृत के क्लिष्ट ग्रंथों से निकालकर जन-जन की मातृभाषा (अवधी, ब्रज, मराठी, तमिल, गुजराती, बांग्ला, उड़िया) में प्रवाहित कर दिया। दक्षिण भारत में आलवार और नयनार संतों से प्रारम्भ होकर स्वामी रामानन्द, कबीरदास, गोस्वामी तुलसीदास, सूरदास, मीराबाई, रैदास, तुकाराम और चैतन्य महाप्रभु ने प्रेम, समता और नाम-स्मरण का अमर संदेश दिया।

१. सगुण एवं निर्गुण भक्ति धारा:
• सगुण भक्ति: भगवान के साकार रूप (श्रीराम, श्रीकृष्ण, शिव, शक्ति) की लीलाओं, गुणों और नाम का प्रेमपूर्वक गान (तुलसीदास, सूरदास, मीराबाई, चैतन्य महाप्रभु)।
• निर्गुण भक्ति: घट-घट में व्याप्त निराकार परमात्मा की अनुभूति, गुरु-कृपा और आडम्बरहीन सदाचार (संत कबीर, रविदास, दादू दयाल, नामदेव)।

२. प्रमुख संतों की अमर वाणी:
• गोस्वामी तुलसीदास: "सिया राम मय सब जग जानी। करउँ प्रनाम जोरि जुग पानी॥" एवं "परहित सरिस धर्म नहिं भाई। पर पीड़ा सम नहिं अधमाई॥"
• संत कबीरदास: "बुरा जो देखन मैं चला, बुरा न मिलिया कोय। जो दिल खोजा आपना, मुझसे बुरा न कोय॥" तथा "दुःख में सुमिरन सब करे, सुख में करे न कोय। जो सुख में सुमिरन करे, तो दुःख काहे को होय॥"
• भक्त शिरोमणि मीराबाई: "पायो जी मैंने राम रतन धन पायो। वस्तु अमोलिक दी मेरे सतगुरु, किरपा करि अपनायो॥"
• संत रविदास (रैदास): "मन चंगा तो कठौती में गंगा।"`,
      Sanskrit: `मच्चित्ता मद्गतप्राणा बोधयन्तः परस्परम् ।
कथयन्तश्च मां नित्यं तुष्यन्ति च रमन्ति च ॥ (भगवद्गीता १०.९)

सात्त्विकप्रेमस्वरूपा पराभक्तिः (नारदभक्तिसूत्रम्):
सा त्वस्मिन् परमप्रेमरूपा । अमृतस्वरूपा च ॥
यल्लब्ध्वा पुमान् सिद्धो भवति अमृतो भवति तृप्तो भवति ॥

सन्तवाणीसारः:
सन्तपरम्परायां नामस्मरणं, सत्सङ्गः, सर्वभूतदया, अहङ्कारत्यागश्च मोक्षस्य सुगमः पन्थाः इति उद्घोषितम्। यथा तुलसीदासेनोक्तम् — 'कलियुग केवल नाम अधारा, सुमिरि सुमिरि नर उतरहिं पारा।'`
    }
  },
  {
    id: 'hindu-philosophy-shad-darshana',
    title: 'Hindu Philosophy: The Six Orthodox Schools (Shad Darshana)',
    category: 'Philosophy',
    sanskritBadge: 'दर्शन · Darshana',
    contentType: 'Text',
    description: 'Explore the deep philosophical roots of Sanatan Dharma. Discover the Shad Darshana (the six orthodox Astika systems of Indian philosophy): Samkhya, Yoga, Nyaya, Vaisheshika, Mimamsa, and Vedanta.',
    views: 11253,
    likes: 3040,
    language: 'English',
    author: 'Sarva-Darshana-Sangraha & Sutra Texts',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Shad Darshana · Six Schools of Philosophy',
      sanskrit: 'एकं सद्विप्रा बहुधा वदन्ति',
      subtitle: 'Samkhya · Yoga · Nyaya · Vaisheshika · Mimamsa · Vedanta',
      c1: '#0f172a', c2: '#312e81', c3: '#b45309', accent: '#fde047', motif: 'lotus'
    }),
    tags: ['darshana', 'vedanta', 'yoga', 'samkhya', 'nyaya'],
    body: {
      English: `In Sanatan Dharma, philosophy is called "Darshana" (derived from the Sanskrit root 'Drish' — "to see" or "direct vision of Truth"). Unlike purely speculative systems, Indian philosophy is a practical discipline aimed at ending existential suffering (Duhkha-Nivritti) and attaining supreme liberation (Moksha). The six classical Astika schools (which accept the epistemic authority of the Vedas) are organized into three complementary pairs known collectively as the Shad Darshana:

1. Samkhya (Founder: Maharshi Kapila — Samkhya Pravachana Sutra):
The oldest rationalist system of ontology, which enumerates 25 Tattvas (principles of reality) governed by two ultimate, eternal realities:
• Purusha: Pure, unchangeable, witness Consciousness.
• Prakriti: Primordial Nature/Matter composed of three Gunas—Sattva (harmony/light), Rajas (activity/passion), and Tamas (inertia/darkness). Liberation (Kaivalya) dawns when Purusha realizes its absolute distinction (Viveka-Khyati) from Prakriti.

2. Yoga (Founder: Maharshi Patanjali — Yoga Sutras):
Paired with Samkhya metaphysics, Yoga provides the experiential discipline to still the modifications of the mind: "Yogash chitta-vritti-nirodhah" (Yoga Sutra 1.2). Patanjali outlines the Eightfold Path (Ashtanga Yoga):
1. Yama (Ethical restraints: Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha)
2. Niyama (Observances: Shaucha, Santosha, Tapas, Svadhyaya, Ishvara-Pranidhana)
3. Asana (Steady posture)
4. Pranayama (Regulation of vital breath)
5. Pratyahara (Withdrawal of senses)
6. Dharana (One-pointed concentration)
7. Dhyana (Unbroken meditation)
8. Samadhi (Superconscious absorption)

3. Nyaya (Founder: Maharshi Akshapada Gautama — Nyaya Sutras):
The school of formal logic, epistemology (Pramana-Shastra), and debate. It establishes four valid means of knowledge (Pramanas): Pratyaksha (perception), Anumana (inference via the 5-step syllogism), Upamana (comparison/analogy), and Shabda (reliable scriptural/expert testimony).

4. Vaisheshika (Founder: Maharshi Kanada — Vaisheshika Sutras):
The school of naturalism and atomic physics (Paramanu-Vada), classifying all knowable reality into 7 Padarthas (categories): Dravya (substance), Guna (quality), Karma (action/motion), Samanya (universality), Vishesha (particularity), Samavaya (inherence), and Abhava (non-existence).

5. Purva Mimamsa (Founder: Maharshi Jaimini — Mimamsa Sutras):
Focuses on the ritual and ethical section of the Vedas (Karma-Kanda), hermeneutics (rules of textual interpretation), and the intrinsic validity of Dharma and Vedic sound (Shabda-Nityatva).

6. Uttara Mimamsa / Vedanta (Founder: Maharshi Badarayana Vedavyasa — Brahma Sutras):
The crown jewel of Hindu philosophy grounded in the Prasthanatrayi (Upanishads, Bhagavad Gita, and Brahma Sutras). Its three major sub-schools are:
• Advaita Vedanta (Adi Shankaracharya): Non-dualism — Brahman alone is real, the phenomenal world is appearance (Mithya), and the individual soul (Jiva) is identical with Brahman ("Brahma Satyam Jagan Mithya, Jivo Brahmaiva Naparah").
• Vishishtadvaita (Sri Ramanujacharya): Qualified non-dualism — Souls (Chit) and Matter (Achit) form the living body of the personal Supreme Lord Narayana.
• Dvaita (Sri Madhvacharya): Dualism — Eternal distinction (Pancha-Bheda) between the independent Supreme Lord (Vishnu) and dependent souls/matter.`,
      Hindi: `सनातन धर्म में तत्त्वज्ञान को 'दर्शन' कहा जाता है — "दृश्यते यथार्थतत्त्वमनेन इति दर्शनम्" अर्थात् जिसके द्वारा परमतत्त्व का साक्षात् अनुभव हो। वेदों की प्रामाणिकता को मानने वाले छह आस्तिक दर्शनों को 'षड्दर्शन' कहा जाता है, जो तीन युग्मों में विभाजित हैं:

१. सांख्य दर्शन (प्रणेता: महर्षि कपिल — सांख्यसूत्र):
यह सृष्टि के २५ तत्त्वों का विवेचन करता है और दो मूल अनादि तत्त्व मानता है — 'पुरुष' (चेतन साक्षी आत्मा) और 'प्रकृति' (सत्त्व, रज, तम — इन त्रिगुणों की साम्यावस्था)। पुरुष और प्रकृति के भेद का विवेक ज्ञान ही कैवल्य (मुक्ति) का साधन है।

२. योग दर्शन (प्रणेता: महर्षि पतंजलि — योगसूत्र):
"योगश्चित्तवृत्तिनिरोधः" — चित्त की वृत्तियों का निरोध ही योग है। महर्षि पतंजलि ने आत्म-साक्षात्कार हेतु 'अष्टांग योग' का प्रतिपादन किया: १. यम, २. नियम, ३. आसन, ४. प्राणायाम, ५. प्रत्याहार, ६. धारणा, ७. ध्यान, और ८. समाधि।

३. न्याय दर्शन (प्रणेता: महर्षि अक्षपाद गौतम — न्यायसूत्र):
तर्कशास्त्र एवं प्रमाणमीमांसा का ग्रंथ, जो चार प्रमाण (प्रत्यक्ष, अनुमान, उपमान और शब्द) तथा १६ पदार्थों के माध्यम से सत्य के निर्णय की विधि सिखाता है।

४. वैशेषिक दर्शन (प्रणेता: महर्षि कणाद — वैशेषिकसूत्र):
जगत् के भौतिक स्वरूप एवं 'परमाणुवाद' का प्रतिपादक दर्शन, जो संपूर्ण सत्ता को ७ पदार्थों (द्रव्य, गुण, कर्म, सामान्य, विशेष, समवाय और अभाव) में वर्गीकृत करता है।

५. पूर्व मीमांसा (प्रणेता: महर्षि जैमिनि — मीमांसासूत्र):
वेदों के कर्मकाण्ड, यज्ञ-विधान और धर्म के स्वरूप ("चोदनालक्षणोऽर्थो धर्मः") की व्याख्या करने वाला दर्शन।

६. उत्तर मीमांसा / वेदान्त दर्शन (प्रणेता: महर्षि बादरायण वेदव्यास — ब्रह्मसूत्र):
उपनिषद्, भगवद्गीता और ब्रह्मसूत्र (प्रस्थानत्रयी) पर आधारित सर्वोच्च दर्शन, जिसमें आदि शंकराचार्य का 'अद्वैतवाद' ("ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः"), रामानुजाचार्य का 'विशिष्टाद्वैतवाद' और मध्वाचार्य का 'द्वैतवाद' प्रमुख हैं।`,
      Sanskrit: `अथातो ब्रह्मजिज्ञासा । जन्माद्यस्य यतः । शास्त्रयोनित्वात् ॥ (ब्रह्मसूत्रम् १.१.१-३)
योगश्चित्तवृत्तिनिरोधः । तदा द्रष्टुः स्वरूपेऽवस्थानम् ॥ (पातञ्जलयोगसूत्रम् १.२-३)
चोदनालक्षणोऽर्थो धर्मः ॥ (जैमिनीयमीमांसासूत्रम् १.१.२)
प्रमाणप्रमेयसंशयप्रयोजनदृष्टान्तसिद्धान्तावयवतर्कनिर्णयवादजल्पवितण्डाहेत्वाभासच्छलजातिनिग्रहस्थानानां तत्त्वज्ञानान्निःश्रेयसाधिगमः ॥ (न्यायसूत्रम् १.१.१)

षड्दर्शनसङ्क्षेपः:
साङ्ख्यं योगो न्यायवैशेषिके च पूर्वमीमांसा वेदान्तश्चेति षड् आस्तिकदर्शनानि। एतानि सर्वाणि दुःखत्रयाभिघातात् मोक्षप्राप्तिं च परमलक्ष्यं स्वीकुर्वन्ति।`
    }
  },
  {
    id: 'hindu-temples-sacred-architecture',
    title: 'Hindu Temples: The Sacred Architecture of the Divine (Mandir)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Shilpa Shastra',
    contentType: 'Text',
    description: 'Explore the spiritual significance, ancient architectural styles (Nagara, Dravida, and Vesara), Vastu Purusha Mandala, and the profound cosmic meaning behind the design of a Hindu Mandir.',
    views: 9441,
    likes: 2510,
    language: 'Sanskrit',
    author: 'Mayamata, Manasara & Brihat Samhita',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Sacred Architecture of the Hindu Mandir',
      sanskrit: 'देहो देवालयः प्रोक्तो जीवो देवः सनातनः',
      subtitle: 'Nagara · Dravida · Vesara · Vastu Purusha Mandala',
      c1: '#271206', c2: '#7c2d12', c3: '#ea580c', accent: '#fbbf24', motif: 'temple'
    }),
    tags: ['mandir', 'architecture', 'vastu', 'shilpa-shastra', 'agama'],
    body: {
      English: `In Sanatan Dharma, a temple (Mandir or Devalaya) is not merely a congregation hall; it is the cosmos in miniature and a physical projection of the Divine Body (Purusha) modeled according to the Agama Shastras, Shilpa Shastras, and Vastu Shastra. As the Skanda Purana and Kularnava Tantra declare: "Deho devalayah prokto jivo devah sanatanah" — the human body itself is the temple, and the indwelling soul is the eternal Divinity.

1. The Sacred Geometry of Vastu Purusha Mandala:
Every traditional Mandir is laid out upon a sacred geometric grid called the Vastu Purusha Mandala (typically a 64-square [8×8 Manduka] or 81-square [9×9 Paramashayika] grid). At the exact center lies the Brahmasthana, above which rises the Garbhagriha and Shikhara, aligning the subterranean earth energies with the vertical cosmic axis (Axis Mundi / Mount Meru).

2. Anatomy of a Hindu Temple (Aligned with the Yogic Chakras):
When a devotee walks from the entrance gate to the inner sanctum, they journey inward through the layers of consciousness:
• Gopuram / Simhadwara (Entrance Gateway): Represents the feet (Padau) of the Cosmic Being and the transition from the noisy material world to sacred space.
• Dhwaja Stambha (Flagstaff) & Vahana: Represents the spinal column (Sushumna Nadi) and the individual soul beholding the Lord.
• Mandapa (Pillared Hall / Jagamohana): Represents the heart and lungs where devotees gather in kirtan and meditation.
• Antarala (Vestibule): The threshold of stillness between outer mind and inner spirit.
• Garbhagriha (Womb-Chamber / Sanctum Sanctorum): Unlit by windows, quiet and cave-like, symbolizing the Cave of the Heart (Hridaya-Guha) and the Crown Chakra (Sahasrara), where the consecrated Murti resides after Prana-Pratishtha.
• Shikhara / Vimana (Towering Spire): Rising directly above the Garbhagriha toward the heavens like Mount Meru, crowned by the ribbed stone disc (Amalaka — symbolizing the thousand-petaled Sahasrara lotus) and the golden Kalasha (vessel of Amrita / immortality).
• Pradakshina Patha (Circumambulatory Path): Walking clockwise around the sanctum keeps the Divine at the center of one's life.

3. The Three Classical Architectural Styles:
• Nagara Style (Northern & Eastern India): Characterized by curvilinear beehive spires (Rekha-Prasada / Latina, Shekhari, Bhumija) crowned by an Amalaka and Kalasha, without massive boundary walls (e.g., Khajuraho Kandariya Mahadeva, Lingaraj & Jagannath Temples in Odisha, Somnath, Modhera Sun Temple).
• Dravida Style (Southern India): Characterized by stepped pyramidal Vimanas over the sanctum, concentric Prakara boundary walls, colossal entrance Gopurams, Kalyani temple tanks, and thousand-pillar halls (e.g., Brihadeeswarar Temple at Thanjavur, Srirangam, Madurai Meenakshi).
• Vesara / Karnata-Dravida Style (Deccan Synthesis): Harmonizing Nagara curvilinear rhythms with Dravida tiering on stellate (star-shaped) soapstone platforms (e.g., Hoysala temples at Belur, Halebidu, and Somanathapura).`,
      Hindi: `सनातन धर्म में 'मन्दिर' (देवालय) केवल प्रार्थना का भवन नहीं, अपितु आगम शास्त्र, शिल्प शास्त्र और वास्तु शास्त्र के सिद्धांतों पर निर्मित संपूर्ण ब्रह्माण्ड एवं मानव देह का ही दिव्य प्रतिरूप है — "देहो देवालयः प्रोक्तो जीवो देवः सनातनः"।

१. वास्तु पुरुष मण्डल एवं मन्दिर के अंग:
प्रत्येक शास्त्रोक्त मन्दिर ६४ या ८१ पदों वाले 'वास्तु पुरुष मण्डल' की ज्यामिति पर निर्मित होता है, जिसके केंद्र 'ब्रह्मस्थान' पर गर्भगृह स्थित होता है:
• सिंहद्वार / गोपुरम: विराट पुरुष के चरण (भौतिक जगत से आध्यात्मिक जगत में प्रवेश)।
• ध्वजस्तम्भ एवं वाहन मण्डप: मेरुदण्ड (सुषुम्ना नाड़ी) एवं जीवात्मा की एकाग्रता का प्रतीक।
• सभामण्डप / जगमोहन: हृदय क्षेत्र, जहाँ भक्त भजन, कीर्तन और ध्यान करते हैं।
• गर्भगृह (मूल स्थान): यह हृदय-गुहा और सहस्रार चक्र का प्रतीक है, जहाँ प्राण-प्रतिष्ठित श्रीविग्रह विराजमान रहते हैं।
• शिखर / विमान, आमलक एवं कलश: गर्भगृह के ठीक ऊपर सुमेरु पर्वत के समान उठता शिखर, जिसके शीर्ष पर सहस्रदल कमल रूपी 'आमलक' और अमृतत्व का प्रतीक स्वर्ण 'कलश' एवं धर्मध्वजा स्थापित होती है।

२. भारतीय मन्दिर स्थापत्य की तीन प्रमुख शैलियाँ:
• नागर शैली (उत्तर एवं पूर्वी भारत): वक्राकार रेखीय शिखर, आमलक और कलश से युक्त (जैसे— पुरी का जगन्नाथ मन्दिर, खजुराहो का कंदरिया महादेव, सोमनाथ, कोणार्क)।
• द्रविड़ शैली (दक्षिण भारत): पिरामिडनुमा सीढ़ीदार विमान, विशाल प्रवेश गोपुरम, सप्त प्राचीर (प्रकार) और पुष्करिणी सरोवर (जैसे— तंजावुर का बृहदीश्वर मन्दिर, श्रीरंगम, मदुरै मीनाक्षी)।
• बेसर शैली (दक्कन / मध्य-दक्षिण समन्वय): नागर और द्रविड़ शैली का कलात्मक संगम तथा तारांकित (Star-shaped) अधिष्ठान (जैसे— बेलूर और हलेबिदु के होयसल मन्दिर)।`,
      Sanskrit: `देहो देवालयः प्रोक्तो जीवो देवः सनातनः ।
त्यजेदज्ञाननिर्मांल्यं सोऽहम्भावेन पूजयेत् ॥ १ ॥

गर्भगृहं शिरः प्रोक्तं मण्डपं हृदयं स्मृतम् ।
गोपुरं पादयोर्ज्ञेयं प्रासादो पुरुषोच्चयः ॥ २ ॥

शिल्पशास्त्रसारः:
वास्तुपुरुषमण्डलाधारेण निर्मितं देवालयं नागर-द्रविड-वेसरभेदेन त्रिविधं भवति। गर्भगृहस्योपरि स्थितं शिखरं सुमेरुशिखरं निरूपयति, तदुपरि आमलकं सहस्रारचक्रं सुवर्णकलशश्च परमामृतं द्योतयति।`
    }
  },
  {
    id: 'hindu-festivals-utsav-vrat',
    title: 'Hindu Festivals: The Cycle of Devotion, Seasons, and Dharma (Utsav & Vrat)',
    category: 'Festivals',
    sanskritBadge: 'उत्सव · Utsav & Vrat',
    contentType: 'Text',
    description: 'Discover the spiritual and astronomical significance of the major festivals in Sanatan Dharma. Explore how Utsav (celebration) and Vrat (fasting) harmonize human life with cosmic cycles.',
    views: 10844,
    likes: 2890,
    language: 'English',
    author: 'Dharmasindhu, Nirnayasindhu & Puranas',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Sacred Festivals of Sanatan Dharma',
      sanskrit: 'तमसो मा ज्योतिर्गमय · उत्सवप्रियाः मानवाः',
      subtitle: 'Deepavali · Navaratri · Maha Shivaratri · Holi · Makar Sankranti',
      c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'diya'
    }),
    tags: ['diwali', 'holi', 'navaratri', 'shivaratri', 'festivals'],
    body: {
      English: `In Sanatan Dharma, time (Kala) is not a linear march but a sacred wheel (Kalachakra) synchronized with lunar phases (Tithis), solar transits (Sankrantis), constellations (Nakshatras), and the six natural seasons (Shad-Ritu). The Sanskrit word "Utsava" derives from "Ut" (removal/elevation) + "Sava" (worldly sorrow or Soma sacrifice)—meaning that which uplifts consciousness above sorrow into divine joy. Paired with Utsava is "Vrata" (sacred vow, self-discipline, and fasting), which purifies the body (Annamaya Kosha) and mind (Manomaya Kosha).

1. Major Festivals Across the Vedic Panchanga:
• Chaitra Shukla Pratipada & Rama Navami (March–April): Marks the Hindu Lunar New Year (Vikram Samvat / Ugadi / Gudi Padwa), the start of Chaitra Navaratri, and the ninth-day appearance of Maryada Purushottama Lord Sri Rama at midday in Ayodhya.
• Akshaya Tritiya (Vaishakha Shukla Tritiya): The day of imperishable merit (Akshaya Punya), marking the inception of Satya/Treta Yuga, the descent of Mother Ganga, the opening of Badrinath Dham, and the beginning of Chandan Yatra and chariot construction at Jagannath Puri.
• Guru Purnima / Vyasa Purnima (Ashadha Purnima): Revering Maharshi Vedavyasa and the lineage of spiritual masters (Guru-Parampara) who dispel the darkness of ignorance.
• Raksha Bandhan & Krishna Janmashtami (Shravana–Bhadrapada): Celebrating sacred protection and the midnight birth of Yogeshwara Bhagavan Sri Krishna under the Rohini Nakshatra on Ashtami.
• Ganesh Chaturthi (Bhadrapada Shukla Chaturthi): Ten-day invocation of Vighnaharta Lord Ganesha, the bestower of Buddhi (intellect) and Siddhi (spiritual fulfillment).
• Sharadiya Navaratri & Vijayadashami / Dussehra (Ashwin): Nine nights worshipping the Navadurga forms of Mother Shakti (Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, Siddhidatri), culminating on the tenth day in Vijayadashami—celebrating Maa Durga's victory over Mahishasura and Lord Rama's victory over Ravana.
• Deepavali / Diwali (Kartik Amavasya): The five-day Festival of Lights (Dhanteras, Naraka Chaturdashi, Lakshmi-Ganesh Pujan on Amavasya, Govardhan Puja, and Bhai Dooj) celebrating the triumphant return of Lord Rama to Ayodhya after 14 years of exile and the awakening of the inner Atma-Jyoti ("Tamaso Ma Jyotir Gamaya").
• Makar Sankranti / Pongal / Uttarayana (January 14): Solar festival marking Surya Deva's northward journey into Capricorn (Makara Rashi), celebrated as the auspicious daytime of the Devas.
• Vasant Panchami, Maha Shivaratri & Holi (Magha–Phalguna): Worshipping Goddess Saraswati at the arrival of spring; keeping all-night vigil and Rudrabhisheka during the four Praharas of Maha Shivaratri; and celebrating Holika Dahan (burning of Prahlada's egoistic persecutors) and the joyous colours of divine love on Phalguna Purnima.`,
      Hindi: `सनातन धर्म में पर्व ('उत्सव') और 'व्रत' मानव जीवन को प्रकृति की छह ऋतुओं, सूर्य के उत्तरायण-दक्षिणायन तथा चंद्रमा की तिथियों एवं नक्षत्रों के साथ जोड़ने की वैज्ञानिक व आध्यात्मिक प्रणाली हैं। 'उत्सव' (उत् + सव) का अर्थ है— जो जीवन के विषाद को दूर कर आनंद और उत्साह का संचार करे; तथा 'व्रत' का अर्थ है— संकल्पपूर्वक इंद्रिय-संयम और उपवास द्वारा शरीर व मन की शुद्धि।

१. हिंदू पंचांग के प्रमुख पर्व एवं उनका आध्यात्मिक महत्व:
• चैत्र नवरात्रि एवं श्रीरामनवमी: हिंदू नववर्ष (विक्रम संवत / गुड़ी पड़वा / उगादि) का शुभारंभ तथा चैत्र शुक्ल नवमी को मध्याह्न काल में भगवान श्रीराम का प्राकट्योत्सव।
• अक्षय तृतीया एवं गुरु पूर्णिमा (व्यास पूर्णिमा): अक्षय पुण्य प्रदान करने वाली तिथि तथा आषाढ़ पूर्णिमा को महर्षि वेदव्यास एवं सद्गुरु परम्परा का पूजन।
• श्रीकृष्ण जन्माष्टमी एवं गणेश चतुर्थी: भाद्रपद कृष्ण अष्टमी को रोहिणी नक्षत्र में भगवान श्रीकृष्ण का जन्मोत्सव तथा भाद्रपद शुक्ल चतुर्थी को विघ्नहर्ता श्री गणेश का पूजन।
• शारदीय नवरात्रि एवं विजयदशमी (दशहरा): नौ रात्रियों में माँ दुर्गा के नवदुर्गा स्वरूपों (शैलपुत्री से सिद्धिदात्री) की आराधना तथा दशमी को अधर्म पर धर्म की विजय का महापर्व।
• दीपावली (कार्तिक अमावस्या): धनतेरस से भाई दूज तक पाँच दिवसीय प्रकाश पर्व — भगवान श्रीराम के १४ वर्ष के वनवास के पश्चात अयोध्या आगमन तथा अज्ञान के अंधकार पर आत्म-ज्योति ('तमसो मा ज्योतिर्गमय') की विजय।
• मकर संक्रांति (उत्तरायण), महाशिवरात्रि एवं होली: सूर्य के मकर राशि और उत्तरायण में प्रवेश का पर्व; फाल्गुन कृष्ण चतुर्दशी को भगवान शिव-शक्ति के मिलन और चारों प्रहर के रुद्राभिषेक की महाशिवरात्रि; तथा भक्त प्रह्लाद की रक्षा व फागुन पूर्णिमा का रंगोत्सव होली।`,
      Sanskrit: `असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥ (बृहदारण्यकोपनिषद् १.३.२८)

उत्सवव्रतमाहात्म्यम्:
तिथिनक्षत्रर्तुचक्रानुसारेण सनातनधर्मे उत्सवाः व्रतानि च विहितानि। रामनवमी, कृष्णजन्माष्टमी, शारदीयनवरात्रिः, विजयदशमी, दीपावली, मकरसङ्क्रान्तिः, महाशिवरात्रिः, होलिकोत्सवश्चेति प्रमुखाः उत्सवाः मनुष्यस्य चित्तशुद्धिं समाजैक्यं धर्मजागरणं च सम्पादयन्ति।`
    }
  },
  {
    id: 'puranas-18-maha-puranas',
    title: 'The Puranas: Introduction and Guide to the 18 Maha Puranas',
    category: 'Puranas',
    sanskritBadge: 'पुराण · 18 Maha Puranas',
    contentType: 'Text',
    description: 'Explore the Puranas, the vast encyclopedias of Sanatan Dharma compiled by Maharshi Vedavyasa. Discover the Pancha Lakshana (five characteristics) and a complete guide to all 18 Maha Puranas.',
    views: 11052,
    likes: 3180,
    language: 'English',
    author: 'Maharshi Krishna Dwaipayana Vedavyasa',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'The 18 Maha Puranas · Vedavyasa',
      sanskrit: 'मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम्',
      subtitle: '400,000 Shlokas · Cosmic History & Dharma',
      c1: '#2e1065', c2: '#701a75', c3: '#c2410c', accent: '#fde68a', motif: 'scripture'
    }),
    tags: ['puranas', 'vedavyasa', 'bhagavata', 'shiva-purana', 'vishnu-purana'],
    body: {
      English: `The Puranas ("Purapi navam iti Puranam" — that which is ancient yet eternally new) are the vast encyclopedic scriptures of Sanatan Dharma compiled by Maharshi Krishna Dwaipayana Vedavyasa. As the Mahabharata declares: "Itihasa-Puranabhyam Vedam samupabrimhayet" — the subtle truths of the Vedas must be amplified and illuminated through the Itihasas and Puranas so every seeker can grasp cosmic truth through narrative, cosmology, genealogy, pilgrimage geography, and devotion.

1. The Pancha Lakshana (Five Classical Characteristics of Every Purana):
According to the Amarakosha and Vishnu Purana, a Purana systematically treats five foundational themes (and ten in the Bhagavata Purana):
1. Sarga: Primary creation of the cosmos from Prakriti.
2. Pratisarga: Secondary re-creation after periodic cosmic dissolution (Pralaya).
3. Vamsha: Genealogies of the Devas, Rishis, and cosmic patriarchs.
4. Manvantara: Cosmic cycles of time ruled by the 14 Manus across a Kalpa (4.32 billion human years).
5. Vamshanucharita: Histories of the Solar (Suryavamsha) and Lunar (Chandravamsha) royal dynasties.

2. Traditional Mnemonic Shloka & Complete Guide to All 18 Maha Puranas (400,000 Shlokas):
"मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम् । अनापलिंगकूस्कानि पुराणानि प्रचक्षते ॥"
(2 'Ma', 2 'Bha', 3 'Bra', 4 'Va', plus A-Na-Pa-Linga-Ku-Ska = 18 Maha Puranas):

I. Six Sattvika Puranas (Glorifying Lord Vishnu & Liberation):
1. Vishnu Purana (23,000 shlokas): Dialogues of Sage Parashara and Maitreya detailing cosmic creation, Dhruva, Prahlada, and Lord Krishna's life.
2. Srimad Bhagavata Mahapurana (18,000 shlokas across 12 Skandhas): Spoken by Shukadeva Goswami to King Parikshit; the supreme text of Prema-Bhakti and the Dashavatara, culminating in the 10th Skandha on Lord Krishna's pastimes.
3. Naradiya Purana (25,000 shlokas): Expounded by Devarshi Narada, covering the Vedangas, Ekadashi Vratas, and Ganga Mahatmya.
4. Garuda Purana (19,000 shlokas): Discourses of Lord Vishnu to Garuda on astronomy, Ayurveda, gemstone science, ethics, and the Pretakalpa (journey of the soul after death).
5. Padma Purana (55,000 shlokas): The second largest Purana, containing the Gita Mahatmya, Rama and Krishna narratives, and the glory of Tulsi and Ekadashi.
6. Varaha Purana (24,000 shlokas): Narrated by Lord Vishnu as the Boar Avatar (Varaha) to Bhudevi (Mother Earth) on pilgrimage sites like Mathura and sacred vows.

II. Six Rajasika Puranas (Glorifying Lord Brahma & Cosmic Creation):
7. Brahma Purana / Adi Purana (10,000 shlokas): Glorifies Purushottama Kshetra (Puri), Konark, and Godavari Tirthas.
8. Brahmanda Purana (12,000 shlokas): Contains the famous Lalita Sahasranama and Adhyatma Ramayana.
9. Brahma Vaivarta Purana (18,000 shlokas): Centers on Radha-Krishna, Prakriti Khanda (Durga, Lakshmi, Saraswati, Savitri, Radha), and Ganesha Khanda.
10. Markandeya Purana (9,000 shlokas): Contains the 700-verse Devi Mahatmyam (Durga Saptashati / Chandi Path) celebrating the Divine Mother.
11. Bhavishya Purana (14,500 shlokas): Prophetic accounts, Surya worship (Samba Upakhyana), and festival rituals.
12. Vamana Purana (10,000 shlokas): Glorifies the Dwarf Avatar (Vamana/Trivikrama) of Vishnu and Shiva-Parvati legends in Kurukshetra.

III. Six Tamasika / Shaiva-Shakta Puranas (Glorifying Lord Shiva & Cosmic Transformation):
13. Shiva Mahapurana (24,000 shlokas): Details Shiva's 12 Jyotirlingas, Rudra Samhita, Panchakshari Mantra ("Om Namah Shivaya"), and Shaiva philosophy.
14. Linga Purana (11,000 shlokas): Explains the cosmic pillar of fire (Jyotirlinga), Agni-Stambha, and Ashtamurti Shiva.
15. Skanda Mahapurana (81,100 shlokas): The largest of all 18 Puranas, dedicated to Lord Kartikeya (Skanda) and serving as the comprehensive geographical atlas of India's Tirthas (Kashi Khanda, Kedara Khanda, Utkala Khanda, Avantya Khanda, Reva Khanda) and the Satyanarayana Vrata Katha.
16. Agni Purana (15,400 shlokas): An ancient encyclopedia spoken by Agni Deva covering temple architecture, iconography, Dhanurveda (archery), Ayurveda, poetics, and grammar.
17. Matsya Purana (14,000 shlokas): Narrated by Lord Vishnu as the Fish Avatar to Vaivasvata Manu during the cosmic flood, detailing Vastu Shastra and Savitri-Satyavan.
18. Kurma Purana (17,000 shlokas): Spoken by the Tortoise Avatar, containing the Ishvara Gita and Kashi/Prayag Mahatmya.`,
      Hindi: `महर्षि कृष्णद्वैपायन वेदव्यास द्वारा रचित 'अष्टादश महापुराण' (१८ महापुराण) सनातन धर्म के विशाल विश्वकोश हैं, जिनमें कुल ४,००,००० श्लोक हैं। महाभारत का वचन है — "इतिहासपुराणाभ्यां वेदं समुपबृहयेत्" अर्थात् वेदों के गूढ़ रहस्यों को इतिहास और पुराणों के माध्यम से जनसाधारण के लिए सुगम बनाना चाहिए।

१. पुराण के पाँच लक्षण (पञ्चलक्षण):
१. सर्ग (सृष्टि की मूल उत्पत्ति), २. प्रतिसर्ग (प्रलय के पश्चात् पुनः सृष्टि), ३. वंश (देवताओं व ऋषियों की वंशावली), ४. मन्वन्तर (१४ मनुओं के कालचक्र), ५. वंशानुचरित (सूर्यवंश और चंद्रवंश के राजाओं का चरित)।

२. १८ महापुराणों का प्रसिद्ध श्लोक एवं वर्गीकरण:
"मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम् । अनापलिंगकूस्कानि पुराणानि प्रचक्षते ॥"
• 'म' से २ पुराण: १. मत्स्य पुराण (१४,००० श्लोक), २. मार्कण्डेय पुराण (९,००० श्लोक — इसी में 'दुर्गा सप्तशती' के ७०० श्लोक हैं)।
• 'भ' से २ पुराण: ३. श्रीमद्भागवत महापुराण (१८,००० श्लोक — भक्ति एवं श्रीकृष्ण लीला का मुकुटमणि), ४. भविष्य पुराण (१४,५०० श्लोक)।
• 'ब्र' से ३ पुराण: ५. ब्रह्म पुराण (१०,००० श्लोक), ६. ब्रह्माण्ड पुराण (१२,००० श्लोक — इसमें 'ललिता सहस्रनाम' और 'अध्यात्म रामायण' हैं), ७. ब्रह्मवैवर्त पुराण (१८,००० श्लोक — श्रीराधा-कृष्ण एवं प्रकृति खण्ड)।
• 'व' से ४ पुराण: ८. विष्णु पुराण (२३,००० श्लोक), ९. वराह पुराण (२४,००० श्लोक), १०. वामन पुराण (१०,००० श्लोक), ११. वायु / शिव महापुराण (२४,००० श्लोक — द्वादश ज्योतिर्लिंग एवं पंचाक्षर मंत्र महिमा)।
• अ-ना-प-लिं-ग-कू-स्क से ७ पुराण: १२. अग्नि पुराण (१५,४०० श्लोक), १३. नारद पुराण (२५,००० श्लोक), १४. पद्म पुराण (५५,००० श्लोक), १५. लिंग पुराण (११,००० श्लोक), १६. गरुड़ पुराण (१९,००० श्लोक), १७. कूर्म पुराण (१७,००० श्लोक), १८. स्कन्द महापुराण (८१,१०० श्लोक — सबसे विशाल महापुराण, जिसमें काशी खण्ड, केदार खण्ड, उत्कल खण्ड एवं सत्यनारायण व्रत कथा समाहित हैं)।`,
      Sanskrit: `मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम् ।
अनापलिङ्गकूस्कानि पुराणानि प्रचक्षते ॥ १ ॥

सर्गश्च प्रतिसर्गश्च वंशो मन्वन्तराणि च ।
वंशानुचरितं चैव पुराणं पञ्चलक्षणम् ॥ २ ॥

अष्टादशपुराणेषु व्यासस्य वचनद्वयम् ।
परोपकारः पुण्याय पापाय परपीडनम् ॥ ३ ॥

पुराणमाहात्म्यम्:
महर्षिणा कृष्णद्वैपायनेन वेदव्यासेन चतुर्लक्षश्लोकपरिमितानि अष्टादश महापुराणानि विरचितानि। एतेषु ब्रह्माण्डोत्पत्तिः, अवतारकथाः, तीर्थमाहात्म्यं, धर्मनीतिः, परोपकारश्च सविस्तरं वर्णिताः।`
    }
  },
  {
    id: 'mahabharata-epic-summary',
    title: 'The Mahabharata: Introduction, Epic Summary, and Core Teachings',
    category: 'Mahabharata',
    sanskritBadge: 'महाभारत · Itihasa',
    contentType: 'Text',
    description: 'Explore the Mahabharata, the greatest epic of Sanatan Dharma (100,000 Shlokas across 18 Parvas). Learn about the Pandavas and Kauravas, the Kurukshetra War, and the profound teachings of Dharma.',
    views: 15868,
    likes: 4310,
    language: 'English',
    author: 'Maharshi Krishna Dwaipayana Vedavyasa',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'The Mahabharata · Fifth Veda (Jaya)',
      sanskrit: 'यतो धर्मस्ततो जयः · धर्मो रक्षति रक्षितः',
      subtitle: '18 Parvas · 100,000 Shlokas · Maharshi Vedavyasa',
      c1: '#3f1d0b', c2: '#7f1d1d', c3: '#c2410c', accent: '#fbbf24', motif: 'chakra'
    }),
    tags: ['mahabharata', 'pandavas', 'krishna', 'dharma', 'kurukshetra'],
    body: {
      English: `Composed by Maharshi Krishna Dwaipayana Vedavyasa and transcribed by Lord Ganesha at Vyas Gufa in Badrikashram, the Mahabharata (originally titled "Jaya" [Victory], then "Bharata", and finally "Mahabharata") consists of 100,000 Sanskrit shlokas (200,000 verse lines), making it the longest epic poem in world literature—seven times the combined length of the Iliad and the Odyssey. Revered as the "Panchama Veda" (Fifth Veda), it proclaims concerning the four goals of human life (Dharma, Artha, Kama, Moksha): "Yad ihasti tad anyatra, yan nehasti na tat kvachit" — "Whatever is found here may be found elsewhere, but what is not here is nowhere to be found."

1. Complete Structure of the 18 Parvas (Books):
1. Adi Parva (Book of the Beginning): Ancestors of the Kuru dynasty (Shantanu, Ganga, Satyavati, Bhishma's vow of celibacy), birth and training of the five Pandavas (Yudhishthira, Bhima, Arjuna, Nakula, Sahadeva) and hundred Kauravas under Dronacharya, Karna's friendship with Duryodhana, the House of Lac (Lakshagriha), Draupadi's Swayamvara, and the building of Indraprastha.
2. Sabha Parva (Book of the Assembly Hall): Maya Danava's palace, Yudhishthira's Rajasuya Yajna, Shishupala-vadha, the fateful game of dice orchestrated by Shakuni, Draupadi's Cheer-Haran and Lord Krishna's miraculous protection, and the Pandavas' 13-year exile.
3. Vana / Aranyaka Parva (Book of the Forest): 12 years in the forest, including Yaksha Prashna (where Yudhishthira answers Dharma's questions), Savitri-Satyavan, Nala-Damayanti, and Arjuna obtaining the Pashupatastra from Lord Shiva.
4. Virata Parva: The 13th year spent incognito (Ajnatavasa) in King Virata's court at Matsya.
5. Udyoga Parva (Book of Effort): Sri Krishna's peace mission to Hastinapura, Duryodhana's refusal to give even five needle-points of land, and Vidura Niti.
6. Bhishma Parva: The first 10 days of the Kurukshetra War, opening with the 700-verse Shrimad Bhagavad Gita spoken by Bhagavan Krishna to Arjuna between the two armies, and Bhishma's fall onto the bed of arrows.
7. Drona Parva (Days 11–15): Abhimanyu's heroic entry into the Chakravyuha, Jayadratha's fall, and Dronacharya's end.
8. Karna Parva (Days 16–17): The supreme duel between Karna and Arjuna.
9. Shalya Parva (Day 18): Defeat of Shalya and the mace duel between Bhima and Duryodhana.
10. Sauptika Parva: Ashwatthama's night raid.
11. Stri Parva: Gandhari's lament over the fallen warriors.
12. Shanti Parva (Book of Peace): The longest book, where Bhishma Pitamaha on his bed of arrows instructs Yudhishthira on Raja-Dharma (statecraft), Apad-Dharma, and Moksha-Dharma.
13. Anushasana Parva (Book of Instructions): Contains the Vishnu Sahasranama and Shiva Sahasranama taught by Bhishma before his Uttarayana departure.
14–18. Ashvamedhika, Ashramavasika, Mausala, Mahaprasthanika, and Svargarohana Parvas: The Pandavas' 36-year righteous rule, Parikshit's coronation, and the final Himalayan ascent.

2. Eternal Dharmic Pillars of the Mahabharata:
• "Dharmo rakshati rakshitah" (Dharma protects those who protect Dharma).
• "Yato Dharmas tato Jayah" (Where there is Dharma, there is Sri Krishna; and where there is Krishna, there is unfailing Victory).
• "Ahimsa Paramo Dharmah, Dharma himsa tathaiva cha" (Non-violence is the highest Dharma, and righteous defense of Dharma against tyranny is equally a sacred duty).`,
      Hindi: `महर्षि कृष्णद्वैपायन वेदव्यास द्वारा रचित और भगवान श्री गणेश द्वारा लिपिबद्ध 'महाभारत' (मूल नाम: 'जय' एवं 'भारत') १,००,००० श्लोकों वाला विश्व का सबसे विशाल महाकाव्य है, जिसे सनातन धर्म में 'पंचम वेद' कहा जाता है। इसके विषय में प्रसिद्ध उक्ति है — "यदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित्" (धर्म, अर्थ, काम और मोक्ष के विषय में जो इस ग्रंथ में है, वही अन्यत्र है; जो इसमें नहीं है, वह कहीं नहीं है)।

१. महाभारत के १८ पर्वों का पूर्ण परिचय:
१. आदिपर्व: कुरुवंश का इतिहास, भीष्म प्रतिज्ञा, पाण्डवों व कौरवों का जन्म, लाक्षागृह, द्रौपदी स्वयंवर एवं इन्द्रप्रस्थ निर्माण।
२. सभापर्व: राजसूय यज्ञ, शिशुपाल वध, शकुनि का कपट द्यूत-क्रीड़ा, द्रौपदी चीरहरण में श्रीकृष्ण द्वारा रक्षा और १३ वर्ष का वनवास।
३. वनपर्व (आरण्यक पर्व): १२ वर्ष का वनवास, अर्जुन द्वारा पाशुपतास्त्र प्राप्ति एवं प्रसिद्ध 'यक्ष-युधिष्ठिर संवाद' (यक्ष प्रश्न)।
४. विराटपर्व: राजा विराट के राज्य में पाण्डवों का १ वर्ष का अज्ञातवास।
५. उद्योगपर्व: भगवान श्रीकृष्ण का शांतिदूत बनकर हस्तिनापुर जाना, विदुर नीति एवं युद्ध की तैयारी।
६. भीष्मपर्व: कुरुक्षेत्र युद्ध के प्रथम १० दिन, युद्ध के आरम्भ में भगवान श्रीकृष्ण द्वारा अर्जुन को 'श्रीमद्भगवद्गीता' (७०० श्लोक) का अमर उपदेश तथा भीष्म पितामह की शरशय्या।
७. द्रोणपर्व: अभिमन्यु का चक्रव्यूह भेदन और वीरगति, जयद्रथ वध एवं द्रोणाचार्य का अंत।
८. कर्णपर्व: दानवीर कर्ण और अर्जुन का महासंग्राम।
९. शल्यपर्व: युद्ध का १८वाँ दिन, शल्य वध तथा भीम-दुर्योधन गदा युद्ध।
१०. सौप्तिकपर्व, ११. स्त्रीपर्व, १२. शांतिपर्व (शरशय्या पर लेटे भीष्म पितामह द्वारा युधिष्ठिर को राजधर्म और मोक्षधर्म का उपदेश), १३. अनुशासनपर्व (श्री विष्णु सहस्रनाम का उपदेश एवं भीष्म का देहत्याग), १४. आश्वमेधिकपर्व, १५. आश्रमवासिकपर्व, १६. मौसलपर्व, १७. महाप्रस्थानिकपर्व, और १८. स्वर्गारोहणपर्व।

२. महाभारत की अमर शिक्षाएँ:
• "धर्मो रक्षति रक्षितः" — जो धर्म की रक्षा करता है, धर्म उसकी रक्षा करता है।
• "यतो धर्मस्ततो जयः" — जहाँ धर्म है, वहीं विजय है।`,
      Sanskrit: `नारायणं नमस्कृत्य नरं चैव नरोत्तमम् ।
देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥ १ ॥

धर्मे चार्थे च कामे च मोक्षे च भरतर्षभ ।
यदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित् ॥ २ ॥

ऊर्ध्वबाहुर्विरौम्येष न च कश्चिच्छृणोति मे ।
धर्मादर्थश्च कामश्च स किमर्थं न सेव्यते ॥ ३ ॥ (भारतसावित्री)

महाभारतसारः:
अष्टादशपर्वयुतं शतसहस्रश्लोकात्मकं महाभारतं पञ्चमो वेदः कथ्यते। अत्र भीष्मपर्वणि श्रीमद्भगवद्गीता, उद्योगपर्वणि विदुरनीतिः, वनपर्वणि यक्षप्रश्नाः, अनुशासनपर्वणि च श्रीविष्णुसहस्रनामस्तोत्रं रत्नभूतानि सन्ति।`
    }
  },
  {
    id: 'upanishads-10-principal-texts',
    title: 'The Upanishads: Introduction and Guide to the 10 Principal Texts',
    category: 'Upanishads',
    sanskritBadge: 'उपनिषद् · Vedanta',
    contentType: 'Text',
    description: 'Discover the profound philosophy of the Upanishads (Vedanta). Explore the meaning, themes, the 4 Mahavakyas, and detailed summaries of all 10 Principal (Mukhya) Upanishads.',
    views: 12048,
    likes: 3420,
    language: 'English',
    author: 'Vedic Rishis & Adi Shankaracharya Bhashya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'The 10 Principal Upanishads (Dashopanishad)',
      sanskrit: 'ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः',
      subtitle: 'Shruti Jnana-Kanda · The 4 Mahavakyas',
      c1: '#1e1b4b', c2: '#431407', c3: '#b45309', accent: '#fbbf24', motif: 'lotus'
    }),
    tags: ['upanishads', 'vedanta', 'brahman', 'atman', 'mahavakyas'],
    body: {
      English: `The Upanishads (from "Upa" [near] + "Ni" [down/devotedly] + "Sad" [to sit, or to destroy ignorance]) represent the Jnana-Kanda (knowledge culmination) of the four Vedas, earning them the title "Vedanta" (the end and supreme summit of the Vedas). Out of the 108 canonical Upanishads listed in the Muktika Upanishad, Jagadguru Adi Shankaracharya wrote foundational commentaries (Bhashyas) on the 10 Principal Upanishads (Dashopanishad), memorized in the traditional verse:
"ईश-केन-कठ-प्रश्न-मुण्ड-माण्डूक्य-तित्तिरिः । ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥"

1. The Four Great Mahavakyas (Supreme Declarations of Identity between Atman & Brahman):
1. "प्रज्ञानं ब्रह्म" (Prajnanam Brahma — Pure Consciousness is Brahman): Aitareya Upanishad (3.3) of the Rigveda.
2. "अहं ब्रह्मास्मि" (Aham Brahmasmi — I am Brahman): Brihadaranyaka Upanishad (1.4.10) of the Shukla Yajurveda.
3. "तत् त्वम् असि" (Tat Tvam Asi — That Thou Art): Chandogya Upanishad (6.8.7) of the Samaveda.
4. "अयम् आत्मा ब्रह्म" (Ayam Atma Brahma — This Self is Brahman): Mandukya Upanishad (1.2) of the Atharvaveda.

2. Comprehensive Guide to All 10 Principal (Mukhya) Upanishads:
1. Isha Upanishad (Shukla Yajurveda — 18 Mantras): Opens with "Isha vasyam idam sarvam", teaching how to live actively in the world with inner renunciation, seeing the one Divine Self in all beings.
2. Kena Upanishad (Samaveda — 4 Khandas): Opens with "Kena ishitam patati preshitam manah" ("By whom willed and directed does the mind fly forth?"), revealing Brahman as the Ear of the ear, Mind of the mind, and Eye of the eye, plus the allegory of Uma Haimavati teaching Indra.
3. Katha Upanishad (Krishna Yajurveda — 2 Adhyayas, 6 Vallis): The immortal dialogue between the fearless young seeker Nachiketa and Yama (Lord of Death) on the mystery of immortality, the Chariot Metaphor (Ratha-Kalpana), and the razor's edge path ("Kshurasya dhara nishita duratyaya").
4. Prashna Upanishad (Atharvaveda — 6 Prashnas): Six spiritual seekers approach Sage Pippalada with six profound questions on Prana (vital life-force), cosmic creation, waking/dreaming states, and meditation on Om.
5. Mundaka Upanishad (Atharvaveda — 3 Mundakas): Distinguishes Para Vidya (Direct realization of the Imperishable Brahman) from Apara Vidya, introduces the metaphor of the Two Birds on the same tree (Jiva and Ishvara), and gives India's national motto: "Satyameva Jayate Nanritam" (3.1.6 — "Truth alone triumphs, not falsehood").
6. Mandukya Upanishad (Atharvaveda — 12 Mantras): Though the shortest (12 verses), the Muktika Upanishad states that Mandukya alone suffices for liberation. It analyzes the four states of Consciousness mapped to the sacred syllable A-U-M: Vaishvanara (Waking / 'A'), Taijasa (Dreaming / 'U'), Prajna (Deep Sleep / 'M'), and Turiya (the Fourth, pure non-dual Witness beyond sound).
7. Taittiriya Upanishad (Krishna Yajurveda — Shiksha, Brahmananda, and Bhrigu Vallis): Contains the convocation address ("Satyam Vada, Dharmam Chara, Matri Devo Bhava, Pitri Devo Bhava, Acharya Devo Bhava"), the doctrine of the Five Koshas (Annamaya, Pranamaya, Manomaya, Vijnanamaya, Anandamaya), and "Raso Vai Sah" (Brahman is Bliss itself).
8. Aitareya Upanishad (Rigveda — 3 Chapters): Explains how the Cosmic Self projected the universe and entered the human heart as conscious awareness, culminating in "Prajnanam Brahma".
9. Chandogya Upanishad (Samaveda — 8 Prapathakas): Features the Shandilya Vidya ("Sarvam Khalvidam Brahma"), Satyakama Jabala's honesty, and Sage Uddalaka Aruni instructing his son Shvetaketu through nine analogies (dissolving salt in water, the banyan seed) that "Tat Tvam Asi" (That Thou Art).
10. Brihadaranyaka Upanishad (Shukla Yajurveda — 6 Adhyayas): The largest and most majestic Upanishad, featuring Sage Yajnavalkya's dialogues with his philosopher-wife Maitreyi ("Not for the sake of the husband is the husband dear, but for the sake of the Self..."), Gargi Vachaknavi in King Janaka's court, the "Neti, Neti" (Not this, not this) method, and the Pavamana Mantra ("Asato Ma Sad Gamaya").`,
      Hindi: `वेदों के अंतिम और सर्वोच्च ज्ञान-भाग को 'उपनिषद्' या 'वेदान्त' कहा जाता है। 'उपनिषद्' (उप + नि + सद्) का अर्थ है— सद्गुरु के समीप निष्ठापूर्वक बैठकर अविद्या का नाश करने वाला ब्रह्मविद्या का ज्ञान प्राप्त करना। मुक्तिकोपनिषद् में १०८ उपनिषदों का उल्लेख है, जिनमें से १० प्रमुख ('दशोपनिषद्') पर जगद्गुरु आदि शंकराचार्य ने भाष्य लिखा है:
"ईश-केन-कठ-प्रश्न-मुण्ड-माण्डूक्य-तित्तिरिः । ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥"

१. चारों वेदों के चार महावाक्य:
१. "प्रज्ञानं ब्रह्म" (शुद्ध चैतन्य ही ब्रह्म है) — ऐतरेय उपनिषद् (ऋग्वेद)
२. "अहं ब्रह्मास्मि" (मैं ब्रह्म हूँ) — बृहदारण्यक उपनिषद् (शुक्ल यजुर्वेद)
३. "तत्त्वमसि" (वह परमात्मा तू ही है) — छान्दोग्य उपनिषद् (सामवेद)
४. "अयमात्मा ब्रह्म" (यह आत्मा ही ब्रह्म है) — माण्डूक्य उपनिषद् (अथर्ववेद)

२. १० प्रमुख (मुख्य) उपनिषदों का सार:
१. ईशावास्योपनिषद् (१८ मंत्र): "ईशावास्यमिदं सर्वं" — सम्पूर्ण जगत् में ईश्वर का दर्शन करते हुए त्यागपूर्वक भोग और निष्काम कर्म का संदेश।
२. केनोपनिषद्: मन, प्राण और वाणी को प्रकाशित करने वाले 'श्रोत्रस्य श्रोत्रं मनसो मनो यद्' परब्रह्म तथा उमा-हैमवती आख्यान का वर्णन।
३. कठोपनिषद्: बालक नचिकेता और यमराज के संवाद के माध्यम से मृत्यु के रहस्य, आत्मा की अमरता और रथ-रूपक का अद्भुत प्रतिपादन ("उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत")।
४. प्रश्नोपनिषद्: महर्षि पिप्पलाद द्वारा ६ जिज्ञासु ऋषियों के प्राण, सृष्टि और ओंकार संबंधी ६ प्रश्नों का उत्तर।
५. मुण्डकोपनिषद्: परा और अपरा विद्या का भेद, एक ही वृक्ष पर बैठे दो पक्षियों (जीवात्मा और परमात्मा) का रूपक तथा भारत का राष्ट्रीय आदर्श वाक्य — "सत्यमेव जयते नानृतम्" (३.१.६)।
६. माण्डूक्य उपनिषद् (१२ मंत्र): प्रणव 'ॐ' (अ-उ-म) और चेतना की चार अवस्थाओं (जाग्रत, स्वप्न, सुषुप्ति एवं तुरीय) का गहन विश्लेषण।
७. तैत्तिरीयोपनिषद्: "सत्यं वद, धर्मं चर, मातृदेवो भव, पितृदेवो भव, आचार्यदेवो भव" तथा पंचकोश (अन्नमय, प्राणमय, मनोमय, विज्ञानमय, आनंदमय) का सिद्धांत।
८. ऐतरेयोपनिषद्: परमात्मा द्वारा लोकों और अंतःकरण की सृष्टि तथा 'प्रज्ञानं ब्रह्म' का उद्घोष।
९. छान्दोग्य उपनिषद्: आरुणि उद्दालक और श्वेतकेतु संवाद ('तत्त्वमसि'), सत्यकाम जाबाल कथा और शाण्डिल्य विद्या ('सर्वं खल्विदं ब्रह्म')।
१०. बृहदारण्यक उपनिषद्: सबसे विशाल उपनिषद्, जिसमें महर्षि याज्ञवल्क्य और मैत्रेयी संवाद, गार्गी के प्रश्न, 'नेति-नेति' सिद्धांत और 'असतो मा सद्गमय' मंत्र समाहित हैं।`,
      Sanskrit: `ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः ।
ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥ १ ॥

उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत ।
क्षुरस्य धारा निशिता दुरत्यया दुर्गं पथस्तत्कवयो वदन्ति ॥ २ ॥ (कठोपनिषद् १.३.१४)

सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः ।
येनाक्रमन्त्यृषयो ह्याप्तकामा यत्र तत् सत्यस्य परमं निधानम् ॥ ३ ॥ (मुण्डकोपनिषद् ३.१.६)

पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।
पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥ ४ ॥ (बृहदारण्यकोपनिषद् ५.१.१)`
    }
  }
];

export const INITIAL_SACRED_ITEMS_PART2 = [
  {
    id: 'maa-ambe-sarv-kamna-siddh-prarthana',
    title: 'Maa Ambe Ki Sarv Kamna Siddh Prarthana: Full Lyrics + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Devi Prarthana',
    contentType: 'Text',
    description: 'Read the complete Maa Ambe Ki Sarv Kamna Siddh Prarthana from Devi Mahatmyam (Durga Saptashati). This sacred prayer invokes the Divine Mother residing in all beings to fulfill all virtuous wishes.',
    views: 14104,
    likes: 4505,
    language: 'English',
    author: 'Markandeya Purana (Devi Mahatmyam / Aparajita Stuti)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Maa Ambe Sarv Kamna Siddh Prarthana',
      sanskrit: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता',
      subtitle: 'Durga Saptashati · Complete Verses & Meaning',
      c1: '#4c0519', c2: '#9f1239', c3: '#ea580c', accent: '#fde047', motif: 'trishul'
    }),
    tags: ['maa-ambe', 'durga', 'prarthana', 'navratri', 'shakti'],
    body: {
      English: `The "Maa Ambe Sarv Kamna Siddh Prarthana" draws upon the crown-jewel hymns of the Devi Mahatmyam (Durga Saptashati, Chapters 5, 11, and Argala Stotram) in the Markandeya Purana. Chanting these sacred verses with devotion during morning or evening puja, Fridays, Ashtami, or Navaratri removes obstacles, grants peace of mind, and fulfills all righteous wishes (Sarva-Kamna-Siddhi).

1. Complete Sanskrit Transliteration & Verse-by-Verse Meaning:

• Invocation (Sarva Mangala Mangalye):
"Sarva mangala mangalye Shive sarvartha sadhike |
Sharanye Tryambake Gauri Narayani namo'stu te ||"
Meaning: O Auspiciousness of all that is auspicious, O Consort of Shiva, O Fulfiller of all four goals of life (Dharma, Artha, Kama, Moksha)! O Refuge of all, Three-Eyed Goddess of radiant wisdom, O Narayani, salutations to You!

• Creation, Preservation & Transformation (Srishti-Sthiti-Vinashanam):
"Srishti sthiti vinashanam shaktibhute Sanatani |
Gunashraye Gunamaye Narayani namo'stu te ||"
Meaning: O Eternal Mother who embodies the cosmic energies of creation, preservation, and dissolution, substratum of the three Gunas and transcendent over them—salutations to You, O Narayani!

• Protection of the Distressed (Sharanagata Dinarta):
"Sharanagata dinarta paritrana parayane |
Sarvasyarti hare Devi Narayani namo'stu te ||"
Meaning: O Mother who is ever intent on rescuing the humble, the afflicted, and those who seek shelter at Your lotus feet! O Goddess who removes the sufferings of the entire universe, salutations to You!

• The Aparajita Hymn (Ya Devi Sarvabhuteshu — Chapter 5):
1. "Ya Devi sarvabhuteshu Vishnumayeti shabdita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Divine Mother who is known as Vishnumaya across all living beings—salutations again and again!)
2. "Ya Devi sarvabhuteshu Chetanety-abhidhiyate | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as pure Consciousness [Chetana]—salutations again and again!)
3. "Ya Devi sarvabhuteshu Buddhi-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings in the form of Intellect and Wisdom [Buddhi]—salutations again and again!)
4. "Ya Devi sarvabhuteshu Shakti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as Divine Strength and Energy [Shakti]—salutations again and again!)
5. "Ya Devi sarvabhuteshu Shanti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as Supreme Peace [Shanti]—salutations again and again!)
6. "Ya Devi sarvabhuteshu Shraddha-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as Unwavering Faith [Shraddha]—salutations again and again!)
7. "Ya Devi sarvabhuteshu दया (Daya)-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as Infinite Compassion [Daya]—salutations again and again!)
8. "Ya Devi sarvabhuteshu Lakshmi-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as Abundance and Auspicious Fortune [Lakshmi]—salutations again and again!)
9. "Ya Devi sarvabhuteshu Matri-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"
   (To the Goddess who abides in all beings as the Loving Mother [Matri]—salutations again and again!)

• Sarva Badha Mukti Mantra (Removal of All Obstacles & Fulfillment of Wishes):
"Sarva badha प्रशमनं (prashamanam) trailokyasya akhileshwari |
Evameva tvaya karyam asmad vairi vinashanam ||
Sarva badha vinirmukto dhanadhanya sutanvitah |
Manushyo matprasadena bhavishyati na samshayah ||"
Meaning: O Empress of the three worlds, pacify all obstacles and destroy all inner and outer negativities! By the Mother's grace, a devotee is freed from every hindrance and blessed with prosperity, wisdom, and noble progeny—of this there is no doubt.`,
      Hindi: `माँ अम्बे की 'सर्व कामना सिद्ध प्रार्थना' (श्री दुर्गा सप्तशती के पंचम एवं एकादश अध्याय तथा अर्गला स्तोत्र से संकलित) सभी शुभ मनोरथों को पूर्ण करने वाली तथा जीवन के समस्त संकटों का नाश करने वाली अमोघ स्तुति है।

१. सम्पूर्ण प्रार्थना एवं हिन्दी भावार्थ:

• मंगलाचरण (नारायणी स्तुति):
सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके ।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥ १ ॥
सृष्टिस्थितिविनाशानां शक्तिभूते सनातनि ।
गुणाश्रये गुणमये नारायणि नमोऽस्तु ते ॥ २ ॥
शरणागतदीनार्तपरित्राणपरायणे ।
सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥ ३ ॥
भावार्थ: हे सब मंगलों में परम मंगलमयी, कल्याणस्वरूपिणी शिवा, धर्म-अर्थ-काम-मोक्ष रूपी चारों पुरुषार्थों को सिद्ध करने वाली, शरणागतवत्सला, त्रिनेत्रा गौरी नारायणी! आपको बारम्बार नमस्कार है। दीनों और पीड़ितों की रक्षा में तत्पर तथा सबकी पीड़ा हरने वाली हे माँ जगदम्बे! हमारी रक्षा करें।

• अपराजिता स्तुति (या देवी सर्वभूतेषु):
या देवी सर्वभूतेषु विष्णुमायेति शब्दिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ४ ॥
या देवी सर्वभूतेषु चेतनेत्यभिधीयते । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ५ ॥
या देवी सर्वभूतेषु बुद्धिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ६ ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ७ ॥
या देवी सर्वभूतेषु क्षान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ८ ॥
या देवी सर्वभूतेषु श्रद्धारूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ९ ॥
या देवी सर्वभूतेषु शान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ १० ॥
या देवी सर्वभूतेषु लक्ष्मीरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ११ ॥
या देवी सर्वभूतेषु दयारूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ १२ ॥
या देवी सर्वभूतेषु मातृरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ १३ ॥

• सर्व कामना सिद्धि एवं बाधा मुक्ति मंत्र:
देहि सौभाग्यमारोग्यं देहि मे परमं सुखम् ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥ १४ ॥
सर्वबाधाविनिर्मुक्तो धनधान्यसुतान्वितः ।
मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॥ १५ ॥
भावार्थ: हे माँ! मुझे सौभाग्य, आरोग्य, परम सुख, आत्मिक तेज, विजय और यश प्रदान करें तथा काम-क्रोध-लोभ रूपी शत्रुओं का नाश करें। माँ भगवती के प्रसाद से भक्त समस्त बाधाओं से मुक्त होकर धन, धान्य और संतान सुख से सम्पन्न होता है।`,
      Sanskrit: `ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥ १ ॥

सृष्टिस्थितिविनाशानां शक्तिभूते सनातनि ।
गुणाश्रये गुणमये नारायणि नमोऽस्तु ते ॥ २ ॥

शरणागतदीनार्तपरित्राणपरायणे ।
सर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते ॥ ३ ॥

या देवी सर्वभूतेषु विष्णुमायेति शब्दिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ४ ॥
या देवी सर्वभूतेषु चेतनेत्यभिधीयते । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ५ ॥
या देवी सर्वभूतेषु बुद्धिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ६ ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ७ ॥
या देवी सर्वभूतेषु शान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ८ ॥
या देवी सर्वभूतेषु श्रद्धारूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ९ ॥
या देवी सर्वभूतेषु दयारूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ १० ॥
या देवी सर्वभूतेषु लक्ष्मीरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ११ ॥
या देवी सर्वभूतेषु मातृरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ १२ ॥

रूपं देहि जयं देहि यशो देहि द्विषो जहि ।
सर्वबाधाविनिर्मुक्तो धनधान्यसुतान्वितः ।
मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॥ १३ ॥`
    }
  },
  {
    id: 'ambe-tu-hai-jagdambe-kali-aarti',
    title: 'Ambe Tu Hai Jagdambe Kali Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Devi Aarti',
    contentType: 'Text',
    description: 'Read the complete, unabridged Ambe Tu Hai Jagdambe Kali Aarti. Includes full Hindi lyrics, complete English transliteration, and detailed verse-by-verse spiritual meaning.',
    views: 15107,
    likes: 4303,
    language: 'English',
    author: 'Traditional Shakta Devotional Hymn',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Ambe Tu Hai Jagdambe Kali · Complete Aarti',
      sanskrit: 'अम्बे तू है जगदम्बे काली जय दुर्गे खप्पर वाली',
      subtitle: 'Complete Hindi & English Lyrics + Meaning',
      c1: '#450a0a', c2: '#991b1b', c3: '#ea580c', accent: '#fde047', motif: 'diya'
    }),
    tags: ['aarti', 'jagdambe', 'kali', 'durga', 'navratri'],
    body: {
      English: `The "Ambe Tu Hai Jagdambe Kali" Aarti is one of the most beloved devotional hymns sung across households and temples during daily Sandhya Aarti and Navaratri. It praises Mother Adi-Shakti in both Her fierce protective form (Mahakali with the Khappar) and Her compassionate maternal form (Jagadamba).

1. Complete Unabridged English Transliteration:

Ambe tu hai Jagdambe Kali, Jai Durge khappar wali,
Tere hi gun gaave Bharati, O Maiya hum sab utaare teri Aarti ||

Tere bhakt jano par Maiya bheed padi hai bhaari,
Danav dal par toot pado Maa karke singh sawari |
Sau-sau singho se balshali, hai ashta bhujao wali,
Dushton ko tu hi lalkarti, O Maiya hum sab utaare teri Aarti || (1)

Maa-bete ka hai is jag mein bada hi nirmal naata,
Poot kapoot sune hai par na mata suni kumata |
Sab pe karuna darshane wali, amrit barsane wali,
Dukhiyon ke dukhde nivarti, O Maiya hum sab utaare teri Aarti || (2)

Nahi maangte dhan aur daulat, na chandi na sona,
Hum to maange Tere charano mein ek chhota sa kona |
Sabki bigdi banane wali, laaj bachane wali,
Satiyon ke sat ko sanvarti, O Maiya hum sab utaare teri Aarti || (3)

Charan sharan mein khade tumhari, le pooja ki thaali,
Varad hast sar par rakh do Maa, sankat harne wali |
Maa bhar do bhakti ras pyaali, ashta siddhi dene wali,
Bhakton ke karaj sanvarti, O Maiya hum sab utaare teri Aarti || (4)

Ambe tu hai Jagdambe Kali, Jai Durge khappar wali,
Tere hi gun gaave Bharati, O Maiya hum sab utaare teri Aarti ||

2. Complete Spiritual Meaning:
• Stanza 1: When devotees are surrounded by grave crises, Mother Durga mounts Her lion with the might of a hundred lions and eight divine arms to vanquish demonic forces of ego and adharma.
• Stanza 2: Echoing Adi Shankaracharya's Devyaparadha Kshamaapana Stotram ("Kuputro jayeta kvachidapi kumata na bhavati"), the bond between Mother and child is pure; a child may err, yet the Divine Mother is never unloving, showering grace and removing every sorrow.
• Stanza 3: True devotees do not crave fleeting gold, silver, or worldly riches—they ask only for a humble refuge at Mother's lotus feet, where broken destinies are mended and honour is protected.
• Stanza 4: Standing before Her with the lighted platter of Aarti, devotees pray for Her blessing hand (Varada Hasta) upon their heads to bestow the nectar of Bhakti and the eight spiritual Siddhis.`,
      Hindi: `माँ भगवती की विश्वप्रसिद्ध आरती — "अम्बे तू है जगदम्बे काली" (सम्पूर्ण मूल पाठ):

अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली,
तेरे ही गुण गावें भारती, ओ मैया हम सब उतारे तेरी आरती ॥

तेरे भक्त जनों पर मैया भीड़ पड़ी है भारी,
दानव दल पर टूट पड़ो माँ करके सिंह सवारी ।
सौ-सौ सिंहों से बलशाली, है अष्ट भुजाओं वाली,
दुष्टों को तू ही ललकारती, ओ मैया हम सब उतारे तेरी आरती ॥ १ ॥

माँ-बेटे का है इस जग में बड़ा ही निर्मल नाता,
पूत कपूत सुने हैं पर ना माता सुनी कुमाता ।
सब पे करुणा दर्शाने वाली, अमृत बरसाने वाली,
दुखियों के दुखड़े निवारती, ओ मैया हम सब उतारे तेरी आरती ॥ २ ॥

नहीं माँगते धन और दौलत, न चाँदी न सोना,
हम तो माँगें तेरे चरणों में एक छोटा सा कोना ।
सबकी बिगड़ी बनाने वाली, लाज बचाने वाली,
सतियों के सत को सँवारती, ओ मैया हम सब उतारे तेरी आरती ॥ ३ ॥

चरण शरण में खड़े तुम्हारी, ले पूजा की थाली,
वरद हस्त सर पर रख दो माँ, संकट हरने वाली ।
माँ भर दो भक्ति रस प्याली, अष्ट सिद्धि देने वाली,
भक्तों के कारज सँवारती, ओ मैया हम सब उतारे तेरी आरती ॥ ४ ॥

अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली,
तेरे ही गुण गावें भारती, ओ मैया हम सब उतारे तेरी आरती ॥`,
      Sanskrit: `जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥ १ ॥

पृथिव्यां पुत्रो कुपुत्रो जायेत क्वचिदपि कुमाता न भवति ।
इतिं मत्वा माता जगदम्बा करुणावरुणालया सर्वदा भक्तान् रक्षति ॥ २ ॥

कालीकवचम्:
ॐ क्रीं काल्यै नमः। अष्टभुजा सिंहवाहिनी खड्गखप्परधारिणी भगवती जगदम्बा भक्तानां सर्वसङ्कटानि नाशयतु, भक्तिमुक्तिप्रदा च भवतु।`
    }
  },
  {
    id: 'shri-hanuman-chalisa-full',
    title: 'Shri Hanuman Chalisa: Full Lyrics (Hindi & English) + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Hanuman Chalisa',
    contentType: 'Text',
    description: 'Read the complete, unabridged Shri Hanuman Chalisa (all 2 Opening Dohas, all 40 Chaupais, and Closing Doha) by Goswami Tulsidas in Hindi and English with full meaning.',
    views: 31221,
    likes: 9804,
    language: 'English',
    author: 'Goswami Tulsidas',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Shri Hanuman Chalisa · Complete 40 Verses',
      sanskrit: 'जय हनुमान ज्ञान गुन सागर · जय कपीस तिहुँ लोक उजागर',
      subtitle: 'Goswami Tulsidas · Dohas + All 40 Chaupais',
      c1: '#431407', c2: '#9a3412', c3: '#ea580c', accent: '#fde047', motif: 'himalaya'
    }),
    tags: ['hanuman-chalisa', 'tulsidas', 'bajrangbali', 'ramayana', 'sankatmochan'],
    body: {
      English: `Composed by Goswami Tulsidas in the Awadhi dialect in the 16th century, the Shri Hanuman Chalisa consists of 2 introductory Dohas, 40 Chaupais (quatrains), and 1 concluding Doha. Below is the complete, unabridged text of all 40 Chaupais and Dohas with English transliteration and meaning.

• Opening Dohas:
Shri Guru charan sarोज (saroj) raj, nij manu mukuru sudhari |
Baranau Raghubar bimal jasu, jo dayaku phal chari ||
Buddhihin tanu janike, sumirau Pavan-Kumar |
Bal buddhi bidya dehu mohi, harahu kales bikar ||
Meaning: Cleansing the mirror of my mind with the dust of my Guru's lotus feet, I describe the pure glory of Lord Raghubir, which bestows the four fruits of life (Dharma, Artha, Kama, Moksha). Knowing myself to be devoid of wisdom, I remember Hanuman, Son of the Wind—grant me strength, intelligence, and spiritual knowledge, and remove all my afflictions and blemishes.

• All 40 Chaupais (Complete Unabridged Transliteration & Meaning):
1. Jai Hanuman gyan gun sagar | Jai Kapis tihu lok ujagar || (Victory to Hanuman, ocean of wisdom and virtue; victory to the Lord of Vanaras, illuminator of the three worlds!)
2. Ram doot atulit bal dhama | Anjani-putra Pavan-sut nama || (Emissary of Sri Rama, abode of incomparable strength, known as Anjani's son and Son of the Wind.)
3. Mahabir Bikram Bajrangi | Kumati nivar sumati ke sangi || (Great hero of thunderbolt limbs, remover of dark thoughts and companion of pure wisdom.)
4. Kanchan baran biraj subesa | Kanan kundal kunchit kesa || (Golden-hued, nobly attired, with shining earrings and curly locks.)
5. Hath bajra aru dhwaja birajai | Kandhe moonj janeu sajai || (Holding the mace and victory banner in hand, with the sacred Munja thread adorning His shoulder.)
6. Sankar suvan Kesari nandan | Tej pratap maha jag bandan || (Incarnation/aspect of Lord Shiva and joy of Kesari, Your radiance and glory are revered by the whole world.)
7. Bidyavan guni ati chatur | Ram kaj karibe ko atur || (Supremely learned, virtuous, and wise, ever eager to accomplish Lord Rama's work.)
8. Prabhu charitra sunibe ko rasiya | Ram Lakhan Sita man basiya || (Delighting in listening to the glories of the Lord, with Rama, Lakshmana, and Sita ever dwelling in Your heart.)
9. Sukshma roop dhari Siyahi dikhava | Bikat roop dhari Lank jarava || (Assuming a tiny form You appeared before Mother Sita in Ashoka Vatika; assuming a colossal form You burned Lanka.)
10. Bhima roop dhari asur samhare | Ramachandra ke kaj sanvare || (Taking a terrifying form You vanquished the demons and fulfilled all tasks of Sri Ramachandra.)
11. Laye Sanjivan Lakhan jiyaye | Shri Raghubir harashi ur laye || (Bringing the Sanjeevani herb You revived Lakshmana, and Sri Raghubir joyfully embraced You to His heart.)
12. Raghupati kinhi bahut badai | Tum mama priya Bharat-hi sam bhai || (Raghupati praised You exceedingly: "You are as dear to Me as My brother Bharata!")
13. Sahas badan tumharo jas gaavai | As kahi Shripati kanth lagaavai || ("May the thousand-headed Sheshanaga sing Your glory!" Saying thus, the Lord of Lakshmi embraced You.)
14. Sanakadik Brahmadi Munisa | Narad Sarad sahit Ahisa || (Sanaka and the sages, Lord Brahma, Narada, Goddess Saraswati, and Sheshanaga—)
15. Jam Kuber Digpal jahan te | Kabi kobid kahi sake kahan te || (Yama, Kubera, and the Guardians of directions—how can poets and scholars ever fully describe Your glory?)
16. Tum upkar Sugrivahi kinha | Ram milaye raj-pad dinha || (You rendered supreme help to Sugriva, uniting him with Sri Rama and restoring his royal throne.)
17. Tumharo mantra Bibhishan mana | Lankeshwar bhaye sab jag jana || (Vibhishana heeded Your counsel and became King of Lanka, as the whole world knows.)
18. Jug sahasra jojan par Bhanu | Lilyo tahi madhur phal janu || (The Sun, thousands of Yojanas away, You leaped to swallow thinking it a sweet crimson fruit.)
19. Prabhu mudrika meli mukh mahi | Jaladhi langhi gaye achraj nahi || (Carrying the Lord's signet ring in Your mouth, it is no wonder You leaped across the vast ocean.)
20. Durgam kaj jagat ke jete | Sugam anugraha tumhare tete || (Every difficult task in this world becomes easy by Your grace.)
21. Ram duare tum rakhvare | Hot na agya binu paisare || (You are the guardian at Sri Rama's door; none can enter without Your permission.)
22. Sab sukh lahai tumhari sarna | Tum rakshak kahu ko darna || (All happiness is attained in Your refuge; when You are the protector, whom should one fear?)
23. Aapan tej samharo aapai | Tinon lok hank te kanpai || (You alone can contain Your own boundless effulgence; the three worlds tremble at Your roar.)
24. Bhoot pisach nikat nahi aavai | Mahabir jab naam sunavai || (Ghosts and negative forces cannot come near when the name of Mahabir is uttered.)
25. Nasai rog harai sab pira | Japat nirantar Hanumat bira || (All diseases are destroyed and all pain removed by constantly chanting the name of brave Hanuman.)
26. Sankat te Hanuman chhudavai | Man kram bachan dhyan jo lavai || (Hanuman liberates from all crises those who meditate on Him in thought, deed, and word.)
27. Sab par Ram tapasvee raja | Tin ke kaj sakal tum saja || (Sri Rama is the supreme ascetic-King over all, yet You carry out all His missions.)
28. Aur manorath jo koi lavai | Soi amit jivan phal pavai || (Whoever brings any virtuous wish to You obtains the boundless fruit of life.)
29. Charon jug partap tumhara | Hai parsiddh jagat ujiyara || (Your glory shines across all four Yugas and illuminates the entire universe.)
30. Sadhu sant ke tum rakhware | Asur nikandan Ram dulare || (You are the protector of sages and saints, destroyer of demons, and beloved of Sri Rama.)
31. Ashta siddhi nau nidhi ke data | As bar din Janaki Mata || (You are the bestower of the eight Siddhis and nine Nidhis—such was the boon granted to You by Mother Janaki.)
32. Ram rasayan tumhare pasa | Sada raho Raghupati ke dasa || (You hold the treasured elixir of Rama-Bhakti; may You ever remain the devoted servant of Raghupati.)
33. Tumhare bhajan Ram ko pavai | Janam janam ke dukh bisravai || (Through devotion to You one reaches Sri Rama and forgets the sorrows of countless lifetimes.)
34. Antkaal Raghubar pur jai | Jahan janma Hari-bhakt kahai || (At the end of life the devotee ascends to Rama's abode, and if reborn is hailed as a devotee of Hari.)
35. Aur devta chitt na dharai | Hanumat sei sarva sukh karai || (Even without contemplating other deities, serving Hanuman bestows all auspiciousness and joy.)
36. Sankat katai mitai sab pira | Jo sumirai Hanumat balbira || (Every crisis is severed and all suffering erased for one who remembers mighty Hanuman.)
37. Jai Jai Jai Hanuman Gosai | Kripa karahu Gurudev ki nai || (Victory, victory, victory to Lord Hanuman! Shower Your grace upon me as my Supreme Guru!)
38. Jo sat bar path kar koi | Chhutahi bandi maha sukh hoi || (Whoever recites this Chalisa a hundred times is freed from bondage and attains supreme bliss.)
39. Jo yah padhai Hanuman Chalisa | Hoy siddhi sakhi Gaurisa || (Whoever reads this Hanuman Chalisa attains spiritual perfection—Lord Shiva Himself is witness to this!)
40. Tulsidas sada Hari chera | Kijai nath hriday mahan dera || (Says Tulsidas, ever the servant of Hari: O Lord, make my heart Your permanent abode!)

• Closing Doha:
Pavan tanay sankat haran, mangal murti roop |
Ram Lakhan Sita sahit, hriday basahu sur bhoop ||
Meaning: O Son of the Wind, Remover of all difficulties, Embodiment of Auspiciousness—dwell forever in my heart together with Sri Rama, Lakshmana, and Mother Sita!`,
      Hindi: `गोस्वामी तुलसीदास कृत सम्पूर्ण श्री हनुमान चालीसा (दोहा एवं सभी ४० चौपाइयाँ):

॥ दोहा ॥
श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।
बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार ।
बल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार ॥

॥ चौपाई ॥
जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥ १ ॥
राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥ २ ॥
महाबीर बिक्रम बजरंगी । कुमति निवार सुमति के संगी ॥ ३ ॥
कंचन बरन बिराज सुबेसा । कानन कुंडल कुंचित केसा ॥ ४ ॥
हाथ बज्र औ ध्वजा बिराजै । काँधे मूँज जनेऊ साजै ॥ ५ ॥
संकर सुवन केसरीनंदन । तेज प्रताप महा जग बंदन ॥ ६ ॥
बिद्यावान गुनी अति चातुर । राम काज करिबे को आतुर ॥ ७ ॥
प्रभु चरित सुनिबे को रसिया । राम लखन सीता मन बसिया ॥ ८ ॥
सूक्ष्म रूप धरि सियहिं दिखावा । बिकट रूप धरि लंक जरावा ॥ ९ ॥
भीम रूप धरि असुर सँहारे । रामचंद्र के काज सँवारे ॥ १० ॥
लाय सजीवन लखन जियाये । श्रीरघुबीर हरषि उर लाये ॥ ११ ॥
रघुपति कीन्ही बहुत बड़ाई । तुम मम प्रिय भरतहि सम भाई ॥ १२ ॥
सहस बदन तुम्हरो जस गावैं । अस कहि श्रीपति कंठ लगावैं ॥ १३ ॥
सनकादिक ब्रह्मादि मुनीसा । नारद सारद सहित अहीसा ॥ १४ ॥
जम कुबेर दिगपाल जहाँ ते । कबि कोबिद कहि सके कहाँ ते ॥ १५ ॥
तुम उपकार सुग्रीवहिं कीन्हा । राम मिलाय राज पद दीन्हा ॥ १६ ॥
तुम्हरो मंत्र बिभीषन माना । लंकेस्वर भए सब जग जाना ॥ १७ ॥
जुग सहस्र जोजन पर भानु । लील्यो ताहि मधुर फल जानू ॥ १८ ॥
प्रभु मुद्रिका मेलि मुख माहीं । जलधि लाँघि गये अचरज नाहीं ॥ १९ ॥
दुर्गम काज जगत के जेते । सुगम अनुग्रह तुम्हरे तेते ॥ २० ॥
राम दुआरे तुम रखवारे । होत न आज्ञा बिनु पैसारे ॥ २१ ॥
सब सुख लहै तुम्हारी सरना । तुम रक्षक काहू को डर ना ॥ २२ ॥
आपन तेज सम्हारो आपै । तीनों लोक हाँक तें काँपै ॥ २३ ॥
भूत पिसाच निकट नहिं आवै । महाबीर जब नाम सुनावै ॥ २४ ॥
नासै रोग हरै सब पीरा । जपत निरंतर हनुमत बीरा ॥ २५ ॥
संकट तें हनुमान छुड़ावै । मन क्रम बचन ध्यान जो लावै ॥ २६ ॥
सब पर राम तपस्वी राजा । तिन के काज सकल तुम साजा ॥ २७ ॥
और मनोरथ जो कोई लावै । सोइ अमित जीवन फल पावै ॥ २८ ॥
चारों जुग परताप तुम्हारा । है परसिद्ध जगत उजियारा ॥ २९ ॥
साधु-संत के तुम रखवारे । असुर निकंदन राम दुलारे ॥ ३० ॥
अष्ट सिद्धि नौ निधि के दाता । अस बर दीन जानकी माता ॥ ३१ ॥
राम रसायन तुम्हरे पासा । सदा रहो रघुपति के दासा ॥ ३२ ॥
तुम्हरे भजन राम को पावै । जनम-जनम के दुख बिसरावै ॥ ३३ ॥
अन्तकाल रघुबर पुर जाई । जहाँ जन्म हरि-भक्त कहाई ॥ ३४ ॥
और देवता चित्त न धरई । हनुमत सेइ सर्ब सुख करई ॥ ३५ ॥
संकट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥ ३६ ॥
जै जै जै हनुमान गोसाईं । कृपा करहु गुरुदेव की नाईं ॥ ३७ ॥
जो सत बार पाठ कर कोई । छूटहि बंदि महा सुख होई ॥ ३८ ॥
जो यह पढ़ै हनुमान चालीसा । होय सिद्धि साखी गौरीसा ॥ ३९ ॥
तुलसीदास सदा हरि चेरा । कीजै नाथ हृदय महँ डेरा ॥ ४० ॥

॥ दोहा ॥
पवनतनय संकट हरन, मंगल मूरति रूप ।
राम लखन सीता सहित, हृदय बसहु सुर भूप ॥`,
      Sanskrit: `अतुलितबलधामं हेमशैलाभदेहं
दनुजवनकृशानुं ज्ञानिनामग्रगण्यम् ।
सकलगुणनिधानं वानराणामधीशं
रघुपतिप्रियभक्तं वातजातं नमामि ॥ १ ॥

मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।
वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥ २ ॥

बुद्धिर्बलं यशो धैर्यं निर्भयत्वमरोगता ।
अजाड्यं वाक्पटुत्वं च हनुमत्स्मरणाद्भवेत् ॥ ३ ॥`
    }
  },
  {
    id: 'jai-ambe-gauri-aarti',
    title: 'Jai Ambe Gauri Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Devi Aarti',
    contentType: 'Text',
    description: 'Read the complete Jai Ambe Gauri Aarti dedicated to Goddess Durga. Features all stanzas in Hindi and English transliteration, along with the deep spiritual meaning of each verse.',
    views: 13890,
    likes: 4104,
    language: 'Hindi',
    author: 'Traditional Shakta Aarti',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Jai Ambe Gauri Maiya Jai Shyama Gauri',
      sanskrit: 'जय अम्बे गौरी मैया जय श्यामा गौरी',
      subtitle: 'Complete Durga Aarti · Hindi & English Lyrics',
      c1: '#4c0519', c2: '#be123c', c3: '#f59e0b', accent: '#fef08a', motif: 'diya'
    }),
    tags: ['jai-ambe-gauri', 'durga-aarti', 'navratri', 'bhajan'],
    body: {
      English: `"Jai Ambe Gauri" is the universal Vedic-Puranic Aarti of Mother Jagadamba, sung at the conclusion of every Durga Puja, Navaratri Kalash Sthapana, and Chandi Path. Below are the complete, unabridged lyrics in English transliteration with stanza-by-stanza spiritual meaning.

1. Complete English Transliteration:

Jai Ambe Gauri, Maiya Jai Shyama Gauri,
Tumko nishdin dhyavat, Hari Brahma Shivri || Om Jai Ambe Gauri || (Refrain)

Maang sindoor virajat, tiko mrigmad ko,
Ujjwal se dou naina, chandravadan niko || Om Jai Ambe Gauri || (1)

Kanak saman kalevar, raktambar raje,
Raktapushpa gal mala, kanthan par saje || Om Jai Ambe Gauri || (2)

Kehari vahan rajat, khadag khappar dhari,
Sur-nar-munijan sevat, tinke dukh hari || Om Jai Ambe Gauri || (3)

Kanan kundal shobhit, nasagre moti,
Kotik chandra divakar, sam rajat jyoti || Om Jai Ambe Gauri || (4)

Shumbh-Nishumbh bidare, Mahishasur ghati,
Dhumra-vilochan naina, nishdin madmati || Om Jai Ambe Gauri || (5)

Chanda-Munda samhare, Shonit-beej hare,
Madhu-Kaitabh dou maare, sur bhayheen kare || Om Jai Ambe Gauri || (6)

Brahmani, Rudrani, Tum Kamala Rani,
Agam-nigam bakhani, Tum Shiv Patrani || Om Jai Ambe Gauri || (7)

Chausath Yogini gavat, nritya karat Bhairon,
Bajata tal mridanga, auru bajat damaru || Om Jai Ambe Gauri || (8)

Tum hi जग (jag) ki Mata, Tum hi ho Bharta,
Bhaktan ki dukh harta, sukh sampati karta || Om Jai Ambe Gauri || (9)

Bhuja char ati shobhit, var-mudra dhari,
Manvanchhit phal pavat, sevat nar-nari || Om Jai Ambe Gauri || (10)

Kanchan thal virajat, agar kapur bati,
Shrimalaketu mein rajat, koti ratan jyoti || Om Jai Ambe Gauri || (11)

Shri Ambeji ki Aarti, jo koi nar gaave,
Kahat Shivanand Swami, sukh-sampati paave || Om Jai Ambe Gauri || (12)

2. Spiritual Meaning of the Stanzas:
• Stanzas 1–4: Glorify the radiant form of the Divine Mother—adorned with sacred vermilion, musk tilak, eyes brighter than the moon, golden complexion, crimson robes, garland of red hibiscus, lion mount (Kehari Vahana), and an effulgence matching ten million suns and moons.
• Stanzas 5–6: Recall Her great cosmic victories from the Durga Saptashati over Shumbha, Nishumbha, Mahishasura, Dhumralochana, Chanda, Munda, Raktabija (Shonit-beej), and Madhu-Kaitabha, freeing the Devas from fear.
• Stanzas 7–12: Recognize Her as the unified Shakti of the Trimurti (Brahmani, Rudrani, Kamala Rani), attended by the 64 Yoginis and Bhairava, bestowing fearless protection (Abhaya) and boons (Varada) upon every devotee who performs Her Aarti.`,
      Hindi: `माँ दुर्गा की सम्पूर्ण आरती — "जय अम्बे गौरी" (अविकृत मूल पाठ):

जय अम्बे गौरी, मैया जय श्यामा गौरी,
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥ ॐ जय अम्बे गौरी ॥

माँग सिन्दूर विराजत, टीको मृगमद को,
उज्ज्वल से दोउ नैना, चन्द्रवदन नीको ॥ ॐ जय अम्बे गौरी ॥ १ ॥

कनक समान कलेवर, रक्ताम्बर राजै,
रक्तपुष्प गल माला, कण्ठन पर साजै ॥ ॐ जय अम्बे गौरी ॥ २ ॥

केहरि वाहन राजत, खड्ग खप्पर धारी,
सुर-नर-मुनि-जन सेवत, तिनके दुखहारी ॥ ॐ जय अम्बे गौरी ॥ ३ ॥

कानन कुण्डल शोभित, नासाग्रे मोती,
कोटिक चन्द्र दिवाकर, सम राजत ज्योति ॥ ॐ जय अम्बे गौरी ॥ ४ ॥

शुम्भ-निशुम्भ बिदारे, महिषासुर घाती,
धूम्र विलोचन नैना, निशदिन मदमाती ॥ ॐ जय अम्बे गौरी ॥ ५ ॥

चण्ड-मुण्ड संहारे, शोणित बीज हरे,
मधु-कैटभ दोउ मारे, सुर भयहीन करे ॥ ॐ जय अम्बे गौरी ॥ ६ ॥

ब्रह्माणी रुद्राणी, तुम कमला रानी,
आगम-निगम बखानी, तुम शिव पटरानी ॥ ॐ जय अम्बे गौरी ॥ ७ ॥

चौंसठ योगिनी गावत, नृत्य करत भैंरू,
बाजत ताल मृदंगा, औरु बाजत डमरू ॥ ॐ जय अम्बे गौरी ॥ ८ ॥

तुम ही जग की माता, तुम ही हो भरता,
भक्तन की दुक्ख हरता, सुख सम्पत्ति करता ॥ ॐ जय अम्बे गौरी ॥ ९ ॥

भुजा चार अति शोभित, वर-मुद्रा धारी,
मनवांछित फल पावत, सेवत नर-नारी ॥ ॐ जय अम्बे गौरी ॥ १० ॥

कंचन थाल विराजत, अगर कपूर बाती,
श्रीमालकेतु में राजत, कोटि रतन ज्योति ॥ ॐ जय अम्बे गौरी ॥ ११ ॥

श्री अम्बेजी की आरती, जो कोई नर गावै,
कहत शिवानन्द स्वामी, सुख-सम्पत्ति पावै ॥ ॐ जय अम्बे गौरी ॥ १२ ॥`,
      Sanskrit: `कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् ।
सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥ १ ॥

अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते
गिरिवरविन्ध्यशिरोधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ।
भगवति हे शितिकण्ठकुटुम्बिनि भूरिकुटुम्बिनि भूरिकृते
जय जय हे महिषासुरमर्दिनि रम्यकपर्दिनि शैलसुते ॥ २ ॥`
    }
  },
  {
    id: 'om-aum-mantra-meaning',
    title: 'Om (Aum) Mantra: Deep Meaning, Significance, and Benefits',
    category: 'Vedas',
    sanskritBadge: 'वेद · Pranava',
    contentType: 'Text',
    description: 'Discover the profound meaning of Om (🕉️), the primordial Pranava syllable in Sanatan Dharma. Learn the Mandukya Upanishad philosophy of A-U-M, Turiya, how to chant it, and its spiritual benefits.',
    views: 18127,
    likes: 5606,
    language: 'English',
    author: 'Mandukya, Katha & Chandogya Upanishads',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Om (Aum) · The Primordial Pranava',
      sanskrit: 'ओमित्येकाक्षरं ब्रह्म · प्रणवो धनुः शरो ह्यात्मा',
      subtitle: 'A-U-M & Turiya · Mandukya Upanishad',
      c1: '#3b0764', c2: '#7c2d12', c3: '#ea580c', accent: '#fde047', motif: 'chakra'
    }),
    tags: ['om', 'pranava', 'meditation', 'vedas', 'mandukya-upanishad'],
    body: {
      English: `Om (ॐ — phonetically composed of A-U-M plus the silent resonance of Amatra/Bindu), revered in the Vedas as "Pranava" and "Udgitha", is the primordial cosmic vibration (Shabda-Brahman) from which the entire universe manifests, is sustained, and into which it returns. As the Katha Upanishad (1.2.15–16) proclaims: "Sarve Veda yat padam amananti, tapamsi sarvani cha yad vadanti... Om ity etat" — "That supreme goal which all the Vedas declare, which all austerities proclaim, and seeking which seekers live a life of Brahmacharya—that goal is briefly stated as OM."

1. The Fourfold Structure of A-U-M in the Mandukya Upanishad:
The Mandukya Upanishad maps the three phonetic Matras (measures) of Om and the silence that follows onto the four quarters (Chatushpada) of the Self (Atman):
1. 'A' (Akara — Waking State / Jagrat / Vaishvanara): Generated at the back of the throat where vocal sound begins; represents the waking state experiencing the physical universe and cosmic creation (Brahma).
2. 'U' (Ukara — Dream State / Svapna / Taijasa): Rolls forward through the palate and middle of the mouth; represents the subtle inner world of mind, thought, and preservation (Vishnu).
3. 'M' (Makara — Deep Dreamless Sleep / Sushupti / Prajna): Closes at the lips where all distinct sounds merge into one; represents causal seed-consciousness and dissolution (Rudra/Shiva).
4. The Silence / Bindu (Amatra — Turiya, the Fourth State): The measureless silence following 'M' from which the next chant arises; represents pure, non-dual, unchanging Witness Consciousness (Turiya Atman / Parabrahman).

2. The Bow-and-Arrow Meditation of the Mundaka Upanishad (2.2.4):
"Pranavo dhanuh sharo hy-atma, Brahma tallakshyam uchyate |
Apramattena veddhavyam, sharavat tanmayo bhavet ||"
(The Pranava Om is the bow, the individual soul [Atman] is the arrow, and Supreme Brahman is the target. With unswerving concentration it must be pierced, so that like the arrow, the seeker becomes wholly one with the Target.)

3. Method of Chanting & Spiritual/Physiological Benefits:
• Sit in Padmasana, Siddhasana, or Sukhasana with spine erect (Sama-kaya-shiro-grivam).
• Inhale deeply and smoothly through the nostrils; exhale slowly while intoning A-U-M in a 1:1:2 ratio (feeling 'A' vibrate in the navel/heart, 'U' in the throat, and 'M' in the crown/Ajna chakra), resting in silent awareness for 2 seconds before the next breath.
• Harmonizes the vagus nerve and parasympathetic nervous system, stills mental chatter (Chitta-Vritti), awakens Prana along the Sushumna, and establishes deep inner peace.`,
      Hindi: `'ॐ' (ओम् / प्रणव) सनातन धर्म का सर्वोच्च एवं अनादि बीज-मंत्र तथा 'शब्द-ब्रह्म' है। कठोपनिषद् (१.२.१५) में यमराज नचिकेता से कहते हैं — "सर्वे वेदा यत्पदमामनन्ति तपांसि सर्वाणि च यद्वदन्ति... ओमित्येतत्" अर्थात् समस्त वेद जिस परम पद का वर्णन करते हैं और समस्त तपस्याएँ जिसकी प्राप्ति के लिए की जाती हैं, वह एकाक्षर 'ॐ' ही है।

१. माण्डूक्य उपनिषद् के अनुसार 'अ-उ-म' एवं तुरीय का रहस्य:
'ॐ' तीन मात्राओं (अ + उ + म्) और अर्धमात्रा (नाद/बिन्दु) से मिलकर बना है, जो आत्मा के चार पादों का प्रतिनिधित्व करते हैं:
१. 'अ' कार (जाग्रत अवस्था / वैश्वानर): कंठ के मूल से उत्पन्न ध्वनि — स्थूल भौतिक जगत और सृष्टिकर्ता ब्रह्मा का प्रतीक।
२. 'उ' कार (स्वप्न अवस्था / तैजस): तालु और मध्य मुख में प्रवाहित ध्वनि — सूक्ष्म जगत, मन और पालनकर्ता विष्णु का प्रतीक।
३. 'म' कार (सुषुप्ति अवस्था / प्राज्ञ): ओष्ठों के मिलने पर ध्वनि का लय — कारण जगत और संहारकर्ता रुद्र/शिव का प्रतीक।
४. अमात्रा / मौन (तुरीय अवस्था): 'ॐ' के उच्चारण के बाद जो शांत निस्तब्ध मौन शेष रहता है, वही जन्म-मरण और तीनों अवस्थाओं से परे शुद्ध साक्षी चैतन्य 'तुरीय' परब्रह्म है।

२. मुण्डकोपनिषद् (२.२.४) का धनुष-बाण ध्यान:
"प्रणवो धनुः शरो ह्यात्मा ब्रह्म तल्लक्ष्यमुच्यते। अप्रमत्तेन वेद्धव्यं शरवत्तन्मयो भवेत्॥"
(प्रणव 'ॐ' धनुष है, जीवात्मा बाण है और परब्रह्म उसका लक्ष्य है। प्रमाद रहित एकाग्र चित्त से उस लक्ष्य का भेदन करना चाहिए जिससे बाण के समान साधक ब्रह्ममय हो जाए।)`,
      Sanskrit: `ओमित्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोङ्कार एव ।
यच्चान्यत् त्रिकालातीतं तदप्योङ्कार एव ॥ १ ॥ (माण्डूक्योपनिषद् १)

प्रणवो धनुः शरो ह्यात्मा ब्रह्म तल्लक्ष्यमुच्यते ।
अप्रमत्तेन वेद्धव्यं शरवत्तन्मयो भवेत् ॥ २ ॥ (मुण्डकोपनिषद् २.२.४)

तस्य वाचकः प्रणवः । तज्जपस्तदर्थभावनम् ॥ ३ ॥ (पातञ्जलयोगसूत्रम् १.२७-२८)
ओमित्येकाक्षरं ब्रह्म व्याहरन्मामनुस्मरन् ।
यः प्रयाति त्यजन्देहं स याति परमां गतिम् ॥ ४ ॥ (भगवद्गीता ८.१३)`
    }
  },
  {
    id: 'mahalakshmi-ashtakam',
    title: 'Mahalakshmi Ashtakam: Complete 8 Verses + Phalashruti & Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Stotram',
    contentType: 'Text',
    description: 'Read the complete Mahalakshmi Ashtakam composed by Devendra (Indra) in the Padma Purana, glorifying Goddess Mahalakshmi for spiritual wisdom, peace, and prosperity.',
    views: 14061,
    likes: 4224,
    language: 'Sanskrit',
    author: 'Padma Purana (Indra Kruta)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Sri Mahalakshmi Ashtakam · Indra Kruta',
      sanskrit: 'नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते',
      subtitle: 'Padma Purana · All 8 Verses + Phalashruti',
      c1: '#4c0519', c2: '#9a3412', c3: '#eab308', accent: '#fef08a', motif: 'lotus'
    }),
    tags: ['lakshmi', 'wealth', 'prosperity', 'ashtakam', 'stotram'],
    body: {
      English: `The Sri Mahalakshmi Ashtakam is a sacred 11-verse hymn (8 principal stanzas + 3 Phalashruti verses) recited by Lord Indra in the Padma Purana to invoke Goddess Mahalakshmi, the consort of Lord Vishnu and the embodiment of Ashta-Lakshmi (spiritual and material abundance, purity, courage, wisdom, and auspiciousness).

1. Complete Unabridged Transliteration (All 8 Verses + Phalashruti):

1. Namastestu Mahamaye Shripithe Surapujite |
   Shankha Chakra Gadahaaste Mahalakshmi Namo'stu Te || (1)
   Meaning: Salutations to You, O Mahamaya, abiding at the sacred Shripitha and worshipped by the Devas! Holding the Conch, Discus, and Mace in Your hands, O Mahalakshmi, salutations to You!

2. Namaste Garudarudhe Kolasura Bhayankari |
   Sarva Papa Hare Devi Mahalakshmi Namo'stu Te || (2)
   Meaning: Salutations to You who ride upon Garuda and strike terror into the demon Kolasura! O Goddess who removes all sins and karmic impurities, O Mahalakshmi, salutations to You!

3. Sarvajne Sarva Varade Sarva Dushta Bhayankari |
   Sarva Duhkha Hare Devi Mahalakshmi Namo'stu Te || (3)
   Meaning: O All-Knowing Mother, Bestower of all boons, terrifying to all wicked forces, and remover of every sorrow—O Mahalakshmi, salutations to You!

4. Siddhi Buddhi Prade Devi Bhukti Mukti Pradayini |
   Mantra Murte Sada Devi Mahalakshmi Namo'stu Te || (4)
   Meaning: O Bestower of spiritual attainment (Siddhi) and pure intelligence (Buddhi), Giver of both worldly fulfillment (Bhukti) and final liberation (Mukti), Embodiment of sacred Mantras—O Mahalakshmi, salutations to You!

5. Adyanta Rahite Devi Adya Shakti Maheshwari |
   Yogaje Yogasambhute Mahalakshmi Namo'stu Te || (5)
   Meaning: O Goddess without beginning or end, Primordial Energy (Adya Shakti), Supreme Sovereign born of Yoga and attainable through Yoga—O Mahalakshmi, salutations to You!

6. Sthula Sukshma Maharoudre Mahashakti Mahodare |
   Maha Papa Hare Devi Mahalakshmi Namo'stu Te || (6)
   Meaning: O Mother who pervades both the gross and subtle universes, fierce against adharma, of boundless cosmic womb and remover of the greatest sins—O Mahalakshmi, salutations to You!

7. Padmasana Sthite Devi Parabrahma Svarupini |
   Parameshi Jaganmatar Mahalakshmi Namo'stu Te || (7)
   Meaning: Seated upon the sacred Lotus, identical in essence with Supreme Brahman, Supreme Ruler and Mother of the Universe—O Mahalakshmi, salutations to You!

8. Shvetambara Dhare Devi Nanalankara Bhushite |
   Jagatsthite Jaganmatar Mahalakshmi Namo'stu Te || (8)
   Meaning: Arrayed in pure white garments and adorned with manifold celestial ornaments, sustaining the cosmos as Universal Mother—O Mahalakshmi, salutations to You!

• Phalashruti (Fruits of Recitation — Verses 9–11):
9. Mahalakshmyashtakam Stotram yah pathed bhaktiman narah |
   Sarva siddhim avapnoti rajyam prapnoti sarvada || (9)
10. Ekakale pathen nityam maha papa vinashanam |
    Dvikalam yah pathen nityam dhana dhanya samanvitah || (10)
11. Trikalam yah pathen nityam maha shatru vinashanam |
    Mahalakshmir bhaven nityam prasanna varada shubha || (11)
Meaning: Whoever recites this Mahalakshmi Ashtakam with devotion attains all spiritual success and sovereignty. Reciting it once daily destroys grave sins; reciting it twice daily blesses one with wealth and grain; reciting it thrice daily vanquishes all great obstacles and inner enemies, and Mother Mahalakshmi ever abides with them as gracious Bestower of auspicious boons.`,
      Hindi: `पद्म पुराण के अंतर्गत देवराज इन्द्र द्वारा रचित सम्पूर्ण 'श्री महालक्ष्मी अष्टकम्' (सभी ८ श्लोक, फलश्रुति एवं हिन्दी भावार्थ):

नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।
शंखचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥ १ ॥
भावार्थ: श्रीपीठ पर स्थित और देवताओं द्वारा पूजित हे महामाये! हाथों में शंख, चक्र और गदा धारण करने वाली हे माँ महालक्ष्मी, आपको नमस्कार है।

नमस्ते गरुडारूढे कोलासुरभयंकरि ।
सर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ २ ॥
भावार्थ: गरुड़ पर आरूढ़ होकर कोलासुर का भय के साथ अंत करने वाली तथा समस्त पापों को हरने वाली हे देवी महालक्ष्मी, आपको नमस्कार है।

सर्वज्ञे सर्ववरदे सर्वदुष्टभयंकरि ।
सर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ ३ ॥
भावार्थ: सब कुछ जानने वाली, सबको वर देने वाली, समस्त दुष्टों को भयभीत करने वाली और सबके दुःख हरने वाली हे माँ महालक्ष्मी, आपको नमस्कार है।

सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।
मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥ ४ ॥
भावार्थ: सिद्धि, बुद्धि, भोग और मोक्ष प्रदान करने वाली तथा मंत्रस्वरूपिणी हे भगवती महालक्ष्मी, आपको सदैव नमस्कार है।

आद्यन्तरहिते देवि आद्याशक्तिमहेश्वरि ।
योगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥ ५ ॥
भावार्थ: आदि और अंत से रहित, आद्याशक्ति महेश्वरी, योग से प्रकट एवं योग द्वारा प्राप्त होने वाली हे महालक्ष्मी, आपको नमस्कार है।

स्थूलसूक्ष्ममहारौद्रे महाशक्तिमहोदरे ।
महापापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ ६ ॥
भावार्थ: स्थूल और सूक्ष्म रूप में व्याप्त, महाशक्ति और बड़े से बड़े पाप का नाश करने वाली हे महालक्ष्मी, आपको नमस्कार है।

पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि ।
परमेशि जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥ ७ ॥
भावार्थ: कमल के आसन पर विराजमान, परब्रह्मस्वरूपिणी, परमेश्वरी एवं जगन्माता हे महालक्ष्मी, आपको नमस्कार है।

श्वेताम्बरधरे देवि नानालंकारभूषिते ।
जगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥ ८ ॥
भावार्थ: श्वेत वस्त्र धारण करने वाली, नाना प्रकार के आभूषणों से सुशोभित, संपूर्ण जगत में व्याप्त जगन्माता हे महालक्ष्मी, आपको नमस्कार है।

॥ फलश्रुति ॥
महालक्ष्म्यष्टकं स्तोत्रं यः पठेद्भक्तिमान्नरः । सर्वसिद्धिमवाप्नोति राज्यं प्राप्नोति सर्वदा ॥ ९ ॥
एककाले पठेन्नित्यं महापापविनाशनम् । द्विकालं यः पठेन्नित्यं धनधान्यसमन्वितः ॥ १० ॥
त्रिकालं यः पठेन्नित्यं महाशत्रुविनाशनम् । महालक्ष्मीर्भवेन्नित्यं प्रसन्ना वरदा शुभा ॥ ११ ॥`,
      Sanskrit: `इन्द्र उवाच —
नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।
शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥ १ ॥

नमस्ते गरुडारूढे कोलासुरभयङ्करि ।
सर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ २ ॥

सर्वज्ञे सर्ववरदे सर्वदुष्टभयङ्करि ।
सर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ ३ ॥

सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि ।
मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥ ४ ॥

आद्यन्तरहिते देवि आद्याशक्तिमहेश्वरि ।
योगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते ॥ ५ ॥

स्थूलसूक्ष्ममहारौद्रे महाशक्तिमहोदरे ।
महापापहरे देवि महालक्ष्मि नमोऽस्तु ते ॥ ६ ॥

पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि ।
परमेशि जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥ ७ ॥

श्वेताम्बरधरे देवि नानालङ्कारभूषिते ।
जगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तु ते ॥ ८ ॥

महालक्ष्म्यष्टकं स्तोत्रं यः पठेद्भक्तिमान्नरः ।
सर्वसिद्धिमवाप्नोति राज्यं प्राप्नोति सर्वदा ॥ ९ ॥
एककाले पठेन्नित्यं महापापविनाशनम् ।
द्विकालं यः पठेन्नित्यं धनधान्यसमन्वितः ॥ १० ॥
त्रिकालं यः पठेन्नित्यं महाशत्रुविनाशनम् ।
महालक्ष्मीर्भवेन्नित्यं प्रसन्ना वरदा शुभा ॥ ११ ॥
॥ इति श्रीपद्मपुराणे इन्द्रकृतं श्रीमहालक्ष्म्यष्टकं सम्पूर्णम् ॥`
    }
  },
  {
    id: 'the-four-vedas-introduction',
    title: 'The Four Vedas: Complete Guide to Rigveda, Yajurveda, Samaveda & Atharvaveda',
    category: 'Vedas',
    sanskritBadge: 'वेद · Chaturveda',
    contentType: 'Text',
    description: 'A comprehensive guide to the four foundational Shruti scriptures of Sanatan Dharma (Rig, Yajur, Sama, and Atharva) and their fourfold division into Samhita, Brahmana, Aranyaka, and Upanishad.',
    views: 13161,
    likes: 3752,
    language: 'English',
    author: 'Apaurusheya Shruti & Maharshi Vedavyasa',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'The Four Vedas · Rig, Yajur, Sama & Atharva',
      sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्',
      subtitle: 'Samhita · Brahmana · Aranyaka · Upanishad',
      c1: '#3b0764', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'scripture'
    }),
    tags: ['vedas', 'rigveda', 'yajurveda', 'samaveda', 'atharvaveda'],
    body: {
      English: `The Vedas (derived from the Sanskrit root 'Vid' — "to know, to be conscious, to realize") are the foundational, eternal scriptures of Sanatan Dharma. Revered as "Shruti" ("that which was heard" by the ancient Rishis and Rishikas in deep meditative absorption) and "Apaurusheya" (not of mortal composition), the unified Veda was organized at the dawn of Kali Yuga by Maharshi Krishna Dwaipayana Vedavyasa into four distinct collections (Chaturveda) to preserve oral transmission through four chief priestly lineages:

1. The Fourfold Internal Structure of Every Veda:
Each of the four Vedas consists of four progressive strata tailored to the stages of human life (Ashramas):
• Samhita (Hymns & Mantras): Metrical invocations and prayers (Karma/Upasana).
• Brahmana (Ritual Commentaries): Prose manuals explaining the symbolic meaning and procedure of Vedic Yajnas.
• Aranyaka (Forest Treatises): Meditative bridge texts transitioning from external fire sacrifice to internal contemplation.
• Upanishad (Philosophical Summit / Vedanta): Direct inquiry into Brahman, Atman, and liberation (Jnana-Kanda).

2. Complete Guide to the Four Vedas:
I. Rigveda (Veda of Praise & Cosmic Knowledge — Priest: Hotri):
• Structure: The oldest known text of humanity, comprising 10 Mandalas (books), 1,028 Suktas (hymns), and 10,552 Mantras (Shakala Shakha).
• Key Highlights: Opens with "Agnim ile purohitam" (1.1.1); contains the Gayatri Mantra (3.62.10), Mahamrityunjaya Mantra (7.59.12), Purusha Sukta (10.90), Hiranyagarbha Sukta (10.121), Nasadiya Sukta (10.129 — Hymn of Cosmic Creation), and "Ekam sad vipra bahudha vadanti" (1.164.46 — "Truth is One; the wise call It by many names").
• Upaveda: Ayurveda (Science of Life and Medicine).

II. Yajurveda (Veda of Sacrificial Formulas & Action — Priest: Adhvaryu):
• Structure: Divided into two traditions:
  - Krishna (Black) Yajurveda (Taittiriya, Maitrayani, Kathaka Shakhas — where Mantras and Brahmana prose are interwoven).
  - Shukla (White) Yajurveda (Vajasaneyi Madhyandina & Kanva Shakhas revealed by Surya to Sage Yajnavalkya — 40 chapters of pure Mantras, concluding with the Isha Upanishad).
• Key Highlights: Contains the Sri Rudram / Namakam-Chamakam (where "Om Namah Shivaya" first appears at Yajurveda 4.5).
• Upaveda: Dhanurveda (Science of Martial Arts, Strategy, and Statecraft).

III. Samaveda (Veda of Sacred Melodies & Chants — Priest: Udgatri):
• Structure: Comprises 1,875 musical verses divided into Purvarchika and Uttararchika, setting Rigvedic hymns to seven musical notes (Sapta Swaras: Sa, Re, Ga, Ma, Pa, Dha, Ni) and Gana melodies.
• Key Highlights: Revered as the fountainhead of Indian classical music (Raga & Tala). In the Bhagavad Gita (10.22), Lord Krishna declares: "Vedanam Samavedo'smi" ("Among the Vedas, I am the Samaveda").
• Upaveda: Gandharvaveda (Sacred Music, Dance, and Aesthetics).

IV. Atharvaveda (Veda of Everyday Life, Healing & Cosmic Peace — Priest: Brahman):
• Structure: Comprises 20 Kandas, 730 Suktas, and nearly 6,000 Mantras revealed to Sages Atharvan and Angiras.
• Key Highlights: Contains the magnificent Prithvi Sukta (Bhumi Sukta — 12.1: "Mata Bhumih Putro'ham Prithivyah" — "Earth is my Mother and I am Her child"), healing herbs, mathematics, architecture, and three of the ten Principal Upanishads (Mundaka, Mandukya, and Prashna).
• Upaveda: Sthapatyaveda / Shilpa Shastra (Architecture & Engineering) and Arthashastra.`,
      Hindi: `'वेद' शब्द संस्कृत की 'विद्' धातु (अर्थ— जानना, ज्ञान होना) से बना है। वेद सनातन धर्म के मूल एवं अपौरुषेय ('श्रुति') ग्रंथ हैं। कलियुग के आरम्भ में महर्षि कृष्णद्वैपायन वेदव्यास ने वेदों के संरक्षण हेतु उन्हें चार संहिताओं में विभाजित किया, जिन्हें 'चतुर्वेद' कहा जाता है।

१. प्रत्येक वेद के चार भाग:
१. संहिता (मंत्र एवं स्तुतियाँ), २. ब्राह्मण (यज्ञ-कर्मकाण्ड की गद्य व्याख्या), ३. आरण्यक (वानप्रस्थ में उपासना एवं आंतरिक यज्ञ का चिंतन), ४. उपनिषद् (ब्रह्मविद्या एवं आत्मज्ञान — वेदान्त)।

२. चारों वेदों का विस्तृत परिचय:
१. ऋग्वेद (ज्ञान काण्ड — ऋत्विज्: होता, उपवेद: आयुर्वेद):
• मानव सभ्यता का प्राचीनतम ग्रंथ, जिसमें १० मण्डल, १,०२८ सूक्त और १०,५५२ मंत्र हैं।
• प्रमुख सूक्त व मंत्र: प्रथम मंत्र 'अग्निमीळे पुरोहितम्', गायत्री मंत्र (३.६२.१०), महामृत्युंजय मंत्र (७.५९.१२), पुरुष सूक्त (१०.९०), नासदीय सूक्त (१०.१२९) और "एकं सद्विप्रा बहुधा वदन्ति" (१.१६४.४६)।

२. यजुर्वेद (कर्म काण्ड — ऋत्विज्: अध्वर्यु, उपवेद: धनुर्वेद):
• इसके दो भेद हैं— कृष्ण यजुर्वेद (तैत्तिरीय, कठ आदि शाखाएँ) और शुक्ल यजुर्वेद (महर्षि याज्ञवल्क्य द्वारा प्राप्त वाजसनेयी संहिता, जिसके ४०वें अध्याय में ईशावास्योपनिषद् है)।
• इसमें प्रसिद्ध 'श्रीरुद्रम्' (नमक-चमक) और पंचाक्षर मंत्र 'नमः शिवाय' का उल्लेख है।

३. सामवेद (उपासना काण्ड — ऋत्विज्: उद्गाता, उपवेद: गन्धर्ववेद):
• इसमें १,८७५ संगीतमय मंत्र हैं। भारतीय शास्त्रीय संगीत के सप्त स्वर (सा, रे, ग, म, प, ध, नि) सामवेद से ही उत्पन्न हुए हैं। श्रीमद्भगवद्गीता (१०.२२) में भगवान श्रीकृष्ण कहते हैं— "वेदानां सामवेदोऽस्मि"।

४. अथर्ववेद (विज्ञान एवं लोककल्याण काण्ड — ऋत्विज्: ब्रह्मा, उपवेद: स्थापत्यवेद/अर्थशास्त्र):
• इसमें २० काण्ड, ७३० सूक्त और लगभग ६,००० मंत्र हैं। इसमें प्रसिद्ध 'पृथ्वी सूक्त' ("माता भूमिः पुत्रोऽहं पृथिव्याः"), औषधि विज्ञान, राष्ट्र-रक्षा तथा मुण्डक, माण्डूक्य व प्रश्न उपनिषद् समाहित हैं।`,
      Sanskrit: `अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥ १ ॥ (ऋग्वेदः १.१.१)
इषे त्वोर्जे त्वा वायवः स्थ देवो वः सविता प्रार्पयतु श्रेष्ठतमाय कर्मणे ॥ २ ॥ (यजुर्वेदः १.१)
अग्न आ याहि वीतये गृणानो हव्यदातये । नि होता सत्सि बर्हिषि ॥ ३ ॥ (सामवेदः १.१)
शं नो देवीरभिष्टये आपो भवन्तु पीतये । शं योरभि स्रवन्तु नः ॥ ४ ॥ (अथर्ववेदः १.१.६)

माता भूमिः पुत्रोऽहं पृथिव्याः ॥ (अथर्ववेदः १२.१.१२)
एकं सद्विप्रा बहुधा वदन्ति अग्निं यमं मातरिश्वानमाहुः ॥ (ऋग्वेदः १.१६४.४६)`
    }
  },
  {
    id: 'story-of-ramas-exile',
    title: "The Story of Rama's Exile: Ayodhya Kanda & The Ideal of Dharma",
    category: 'Ramayana',
    sanskritBadge: 'रामायण · Ayodhya Kanda',
    contentType: 'Text',
    description: 'A complete narrative and philosophical guide to the Ayodhya Kanda of the Valmiki Ramayana — the 14-year exile of Lord Sri Rama, Devi Sita, and Lakshmana, and Bharata Milap at Chitrakoot.',
    views: 11072,
    likes: 3101,
    language: 'English',
    author: 'Maharshi Valmiki (Ramayana - Ayodhya Kanda)',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: "The Story of Sri Rama's Exile · Ayodhya Kanda",
      sanskrit: 'रघुकुल रीति सदा चलि आई · प्राण जाहुँ बरु बचनु न जाई',
      subtitle: 'Valmiki Ramayana · Satya, Pitru-Bhakti & Tyaga',
      c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'bow'
    }),
    tags: ['rama', 'ayodhya', 'exile', 'ramayana', 'sita', 'lakshmana', 'bharata'],
    body: {
      English: `The Ayodhya Kanda (Book II of Maharshi Valmiki's Ramayana and Goswami Tulsidas's Ramcharitmanas) stands as the supreme moral heart of the Ramayana. In it, Bhagavan Sri Rama demonstrates why even the gods revere Him as "Ramo Vigrahavan Dharmah" (Rama is Dharma incarnate in living form).

1. The Eve of Coronation & Kaikeyi's Two Boons:
Aged Emperor Dasharatha of Kosala, consulting Sage Vasishtha and the citizens of Ayodhya, announces the coronation (Yuvabhisheka) of his eldest, universally beloved son Sri Rama. However, on the night before the ceremony, the maid Manthara poisons the mind of Queen Kaikeyi, reminding her of two unredeemed boons Dasharatha had granted her decades earlier when she saved his life on the Devasura battlefield. Entering the Kopa-Bhavana (chamber of wrath), Kaikeyi demands two boons that shatter Dasharatha's heart:
1. That her son Bharata be crowned King of Ayodhya; and
2. That Sri Rama depart immediately into the Dandaka forest for 14 years clothed as an ascetic in bark-garments (Valkala) and matted locks.

2. Unshakeable Equanimity (Mukha-Raga):
Summoned at dawn to the palace expecting his royal coronation, Sri Rama learns instead of his 14-year forest exile. Both Valmiki and Tulsidas marvel that Sri Rama's lotus face neither brightened at the news of kingship nor dimmed by the slightest shadow at the news of forest exile. To preserve the truth (Satya) of his father's word—proclaiming "Raghukul reeti sada chali aai, praan jahu baru bachanu na jaai"—Sri Rama joyfully renounces the throne of Ayodhya as if it were a blade of grass.

3. The Devotion of Devi Sita, Lakshmana, and Guha:
• Devi Sita: Refusing the comfort of the palace, Janaki declares that a forest with Rama is millions of times sweeter than heaven without Him.
• Lakshmana: Renouncing sleep and royal ease for 14 years (Gudakesha), Lakshmana walks before and behind Rama and Sita with bow drawn as their tireless guardian.
• Crossing the Ganga at Shringaverapura: Meeting his beloved Nishada friend King Guha and the boatman Kevat, Sri Rama demonstrates that divine love knows no hierarchy of birth or station, before settling on the sacred hill of Chitrakoot at the advice of Sage Bharadwaja and Sage Valmiki.

4. Dasharatha's Departure & The Immortal Bharata Milap at Chitrakoot:
Heartbroken in separation from Rama, King Dasharatha passes away recalling Shravana Kumar's parents. Returning from Kekaya, Bharata rejects the throne in tears, walks barefoot to Chitrakoot to plead with Rama to return, and when Rama insists on fulfilling their father's promise, Bharata carries Sri Rama's sacred wooden sandals (Charana-Paduka) upon his head, placing them on the throne at Nandigram and ruling for 14 years as a humble ascetic regent until Rama's triumphant return on Deepavali.`,
      Hindi: `महर्षि वाल्मीकि कृत 'रामायण' और गोस्वामी तुलसीदास कृत 'श्रीरामचरितमानस' का 'अयोध्याकाण्ड' धर्म, सत्य, पितृ-भक्ति और भ्रातृ-प्रेम का सर्वोच्च शिखर है, जहाँ मर्यादा पुरुषोत्तम श्रीराम का चरित्र उद्घोषित करता है— "रामो विग्रहवान् धर्मः" (श्रीराम साक्षात् मूर्तिमान धर्म हैं)।

१. राज्याभिषेक की घोषणा एवं कैकेयी के दो वरदान:
कोसल नरेश महाराज दशरथ ने गुरु वशिष्ठ और अयोध्यावासियों की सम्मति से ज्येष्ठ पुत्र श्रीराम के युवराज-अभिषेक की घोषणा की। किंतु अभिषेक की पूर्व संध्या को मंथरा के बहकावे में आकर रानी कैकेयी ने कोपभवन में महाराज दशरथ से देवासुर संग्राम के समय दिए गए दो पुराने वरदान माँगे:
१. भरत को अयोध्या का राजसिंहासन दिया जाए, और
२. श्रीराम चौदह वर्ष के लिए तपस्वी वेश (वल्कल वस्त्र व जटाजूट) धारण कर दण्डकारण्य वन में निवास करें।

२. श्रीराम की समता एवं पितृ-वचन पालन:
"प्रसन्नतां या न गताभिषेकतस्तथा न मम्ले वनवासदुःखतः। मुखाम्बुजश्री रघुनन्दनस्य मे सदास्तु सा मञ्जुलमङ्गलप्रदा॥"
राज्याभिषेक का समाचार सुनकर श्रीराम के मुखकमल पर न तो अहंकार का हर्ष आया और न ही वनवास का आदेश सुनकर तनिक भी विषाद हुआ। पिता के सत्य की रक्षा हेतु — "रघुकुल रीति सदा चलि आई। प्राण जाहुँ बरु बचनु न जाई॥" — श्रीराम ने सिंहासन को तृणवत् त्याग दिया।

३. माता सीता, लक्ष्मण, निषादराज गुह एवं चित्रकूट में भरत-मिलाप:
• माता सीता ने राजमहल का सुख त्यागकर वन के कंटकों को चुना और लक्ष्मण जी ने १४ वर्षों तक निद्रा व भोग त्यागकर सेवा-धर्म निभाया।
• श्रृंगवेरपुर में निषादराज गुह को हृदय से लगाकर और केवट की प्रेमभरी सेवा स्वीकार कर श्रीराम ने सामाजिक समरसता का संदेश दिया।
• महाराज दशरथ के देहावसान के पश्चात जब भरत ननिहाल से लौटे, तो उन्होंने सिंहासन ठुकरा दिया और नंगे पाँव चित्रकूट जाकर श्रीराम को मनाने का प्रयत्न किया। श्रीराम की आज्ञा से भरत उनकी 'चरण-पादुका' सिर पर धारण कर लाए और १४ वर्ष तक नंदीग्राम में तपस्वी की भाँति रहकर पादुकाओं के प्रतिनिधि के रूप में राज्य का संचालन किया।`,
      Sanskrit: `प्रसन्नतां या न गताभिषेकतस्तथा न मम्ले वनवासदुःखतः ।
मुखाम्बुजश्रीरघुनन्दनस्य मे सदास्तु सा मञ्जुलमङ्गलप्रदा ॥ १ ॥

रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ।
राजा सर्वस्य लोकस्य देवानां मघवानिव ॥ २ ॥ (वाल्मीकिरामायणम्)

सत्यमेवेश्वरो लोके सत्ये धर्मः सदाश्रितः ।
सत्यमूलानि सर्वाणि सत्यान्नास्ति परं पदम् ॥ ३ ॥ (अयोध्याकाण्डम् १०९.१३)`
    }
  },
  {
    id: 'mahamrityunjaya-mantra',
    title: 'Mahamrityunjaya Mantra: The Great Death-Conquering Chant of Lord Shiva',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Rigveda 7.59.12',
    contentType: 'Text',
    description: 'Read the complete Mahamrityunjaya Mantra (Tryambakam Mantra) from Rigveda 7.59.12 with Maha-Samputa, word-by-word Sanskrit breakdown, Rishi Markandeya legend, and spiritual healing benefits.',
    views: 21969,
    likes: 6435,
    language: 'Sanskrit',
    author: 'Maharshi Vasishtha (Rigveda 7.59.12)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Maha Mrityunjaya Mantra · Tryambakam',
      sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
      subtitle: 'Rigveda 7.59.12 · Healing, Protection & Immortality',
      c1: '#0f172a', c2: '#312e81', c3: '#ea580c', accent: '#fde047', motif: 'trishul'
    }),
    tags: ['shiva', 'healing', 'protection', 'mahamrityunjaya', 'rigveda'],
    body: {
      English: `Revealed to Maharshi Vasishtha in the Rigveda (Mandala 7, Sukta 59, Mantra 12) and repeated in the Yajurveda (3.60), the Mahamrityunjaya Mantra (also known as the Tryambakam Mantra or Rudra Sanjeevani Mantra) is the supreme Vedic invocation to Lord Shiva as Mrityunjaya—the Conqueror of Death, Disease, and Fear.

1. Complete Sanskrit Text & Transliteration (Mula Mantra + Samputita Mantra):
• Mula Rigvedic Mantra:
"ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥"
Transliteration:
"Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam |
Urvarukamiva Bandhanan Mrityor Mukshiya Ma'mritat ||"

• Complete Maha-Samputa Mrityunjaya Mantra (With Beeja Mantras):
"ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥"
(Om Haum Jum Sah, Om Bhur Bhuvah Svah, Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Ma'mritat, Om Svah Bhuvah Bhuh, Om Sah Jum Haum Om ||)

2. Word-by-Word (Pada-Artha) Meaning:
• ॐ (Om): The primordial Pranava syllable.
• त्र्यम्बकम् (Tryambakam): The Three-Eyed Lord Shiva (who sees past, present, and future; or who governs creation, preservation, and dissolution; and illuminates Surya, Chandra, and Agni).
• यजामहे (Yajamahe): We worship, adore, and meditate upon.
• सुगन्धिम् (Sugandhim): Whose divine fragrance of virtue and grace pervades the entire cosmos.
• पुष्टिवर्धनम् (Pushti-vardhanam): Who nourishes, strengthens, and sustains all living beings physically, mentally, and spiritually.
• उर्वारुकमिव (Urvarukam-iva): Just as a fully ripened cucumber (Urvaruka).
• बन्धनात् (Bandhanat): Is effortlessly freed from the bondage of its stem/vine.
• मृत्योः (Mrityoh): From the fear and bondage of mortality, disease, and ignorance.
• मुक्षीय (Mukshiya): May He liberate us.
• मा अमृतात् (Ma Amritat): And never separate us from Immortality (Amrita / Moksha).

3. The Legend of Chiranjeevi Rishi Markandeya:
Sage Mrikandu and Marudmati were blessed by Lord Shiva with a brilliant son, Markandeya, who was destined to live on earth for only 16 years. As his sixteenth year completed and Yama (the Lord of Death) arrived with his noose (Kala-Pasha), young Markandeya embraced the Shiva Lingam and chanted the Mahamrityunjaya Mantra with single-pointed devotion. Lord Shiva manifested from the Lingam as Kalantaka, vanquished Death, and blessed Markandeya to remain eternally sixteen as a Chiranjeevi.`,
      Hindi: `ऋग्वेद (मण्डल ७, सूक्त ५९, मंत्र १२) और यजुर्वेद (३.६०) में महर्षि वशिष्ठ द्वारा दृष्ट 'महामृत्युंजय मंत्र' (त्र्यम्बक मंत्र / मृतसंजीवनी मंत्र) भगवान आशुतोष देवाधिदेव महादेव की आराधना का अमोघ वैदिक मंत्र है, जो अकाल मृत्यु, असाध्य रोग, भय और मानसिक अशांति का नाश कर आरोग्य व मोक्ष प्रदान करता है।

१. मूल मंत्र एवं महासम्पुटित मंत्र:
• मूल वैदिक मंत्र:
ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥

• बीज मंत्र युक्त महासम्पुटित महामृत्युंजय मंत्र:
ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥

२. शब्दशः हिन्दी अर्थ (पदार्थ):
• त्र्यम्बकम्: तीन नेत्रों वाले भगवान शिव (सूर्य, चन्द्र और अग्नि रूपी त्रिनेत्रधारी तथा तीनों कालों के द्रष्टा)।
• यजामहे: हम श्रद्धापूर्वक आराधना एवं ध्यान करते हैं।
• सुगन्धिम्: दिव्य कीर्ति और पुण्य की सुगंध से परिपूर्ण।
• पुष्टिवर्धनम्: समस्त प्राणियों के स्वास्थ्य, बल, आयु और आत्मबल का पोषण एवं संवर्धन करने वाले।
• उर्वारुकमिव बन्धनात्: जिस प्रकार पका हुआ ककड़ी का फल (उर्वारुक) बिना किसी कष्ट के अपनी बेल के बंधन से स्वतः मुक्त हो जाता है।
• मृत्योः मुक्षीय माऽमृतात्: उसी प्रकार हे महादेव! हमें मृत्यु, रोग और जन्म-मरण के बंधन से मुक्त करें, किंतु अमृतत्व (मोक्ष एवं आत्मज्ञान) से कभी दूर न करें।

३. चिरंजीवी भक्त मार्कण्डेय की कथा:
मृकण्डु ऋषि के अल्पायु पुत्र मार्कण्डेय की आयु मात्र १६ वर्ष निर्धारित थी। सोलहवाँ वर्ष पूर्ण होने पर जब यमराज पाश लेकर आए, तब बालक मार्कण्डेय ने शिवलिंग का आलिंगन कर इसी महामृत्युंजय मंत्र का पाठ किया। भगवान शिव ने प्रकट होकर काल को परास्त किया और मार्कण्डेय को चिरंजीवी होने का वरदान दिया।`,
      Sanskrit: `विनियोगः —
ॐ अस्य श्रीमहामृत्युञ्जयमन्त्रस्य वशिष्ठ ऋषिः, अनुष्टुप् छन्दः, श्रीत्र्यम्बकरुद्रो देवता, श्रीमहामृत्युञ्जयप्रीत्यर्थे जपे विनियोगः ॥

मूलमन्त्रः —
ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥ (ऋग्वेदः ७.५९.१२)

महासम्पुटितमन्त्रः —
ॐ हौं जूं सः ॐ भूर्भुवः स्वः ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॐ स्वः भुवः भूः ॐ सः जूं हौं ॐ ॥

मृत्युञ्जयध्यानम् —
हस्ताम्भोजयुगस्थकुम्भयुगलादुद्धृत्य तोयं शिरः
सिञ्चन्तं करयोर्युगेन दधतं स्वाङ्के सकुम्भौ करौ ।
अक्षस्रङ्मृगहस्तमम्बुजगतं मूर्धस्थचन्द्रस्रवत्-
पीयूषार्द्रतनुं भजे सगिरिजं मृत्युञ्जयं त्र्यम्बकम् ॥`
    }
  },
  {
    id: 'bhagavad-gita-ch2-v47',
    title: 'Bhagavad Gita - Chapter 2, Verse 47: The Essence of Karma Yoga',
    category: 'Bhagavad Gita',
    sanskritBadge: 'गीता · Sankhya Yoga 2.47',
    contentType: 'Text',
    description: 'Explore Bhagavad Gita Chapter 2, Verse 47 (Karmanye Vadhikaraste) together with Verses 48–50: word-by-word Sanskrit breakdown, Nishkama Karma philosophy, and practical guidance for modern life.',
    views: 28487,
    likes: 8304,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa (Spoken by Bhagavan Sri Krishna)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Bhagavad Gita 2.47 · Karmanye Vadhikaraste',
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      subtitle: 'Nishkama Karma Yoga · Spoken by Sri Krishna',
      c1: '#172554', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'chakra'
    }),
    tags: ['karma', 'duty', 'gita', 'krishna', 'arjuna', 'yoga'],
    body: {
      English: `Spoken by Bhagavan Sri Krishna to Arjuna on the battlefield of Kurukshetra in Chapter 2 (Sankhya Yoga), Verse 47 of the Shrimad Bhagavad Gita is universally celebrated as the foundational charter of Nishkama Karma Yoga (the Yoga of Selfless, Equanimous Action).

1. Original Sanskrit Verse & Transliteration (Gita 2.47–48):
कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥
योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।
सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २.४८ ॥

Transliteration:
Karmany-evadhikaras te ma phaleshu kadachana |
Ma karma-phala-hetur bhur ma te sango 'stv-akarmani || (2.47)
Yogasthah kuru karmani sangam tyaktva Dhananjaya |
Siddhy-asiddhyoh samo bhutva samatvam yoga uchyate || (2.48)

2. The Four Golden Injunctions (Chatusसूत्री / Chatus-Sutri) of Verse 2.47:
Acharya Shankaracharya and commentators point out that Sri Krishna packs four complete laws of spiritual action into the four quarters (Padas) of this single shloka:
1. "Karmany-eva adhikaras te" (Your right and responsibility lie solely in performing your prescribed duty): You have complete freedom of choice, excellence, and dedication in how you act right now.
2. "Ma phaleshu kadachana" (Never in the fruits at any time): Outcomes depend on a vast web of cosmic factors (Adhishthana, Karta, Karana, Cheshta, and Daiva as explained in Gita 18.14); craving or anxiety over the result only fragments your concentration in the present moment.
3. "Ma karma-phala-hetur bhuh" (Do not let the desire for personal reward be your motive, nor consider yourself the egoistic sole author of results): Act as an instrument of the Divine (Nimitta-matram) in a spirit of Yajna (offering).
4. "Ma te sango 'stu akarmani" (Nor let your attachment ever fall into inaction, sloth, or escapism): Detachment from outcomes never means passivity; it empowers fearless, wholehearted action!

3. Companion Definition of Yoga (Verses 2.48 & 2.50):
• "Samatvam Yoga Uchyate" (2.48): Remaining steadfast in inner poise, unshaken by external success or failure—that evenness of mind is called Yoga.
• "Yogah Karmasu Kaushalam" (2.50): Yoga is supreme skill and inner artistry in action—acting with 100% excellence while keeping the mind 100% free from egoistic bondage.`,
      Hindi: `श्रीमद्भगवद्गीता के द्वितीय अध्याय ('सांख्ययोग') का ४७वाँ श्लोक भगवान श्रीकृष्ण के श्रीमुख से निःसृत 'निष्काम कर्मयोग' का सर्वप्रमुख आधार-स्तंभ है।

१. मूल श्लोक (गीता २.४७ - २.५०):
कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥
योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।
सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २.४८ ॥
बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।
तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ॥ २.५० ॥

२. श्लोक २.४७ के चार दिव्य सूत्र (चतुःसूत्री व्याख्या):
भगवान श्रीकृष्ण ने इस एक श्लोक के चार चरणों में जीवन-प्रबंधन के चार अमोघ सूत्र दिए हैं:
१. "कर्मण्येवाधिकारस्ते" (तेरा अधिकार केवल कर्तव्य-कर्म करने में ही है): मनुष्य वर्तमान क्षण में पूर्ण पुरुषार्थ, निष्ठा और प्रामाणिकता से अपना कर्तव्य कर सकता है।
२. "मा फलेषु कदाचन" (उसके फलों में कभी नहीं): फल अनेक कारणों व ईश्वरीय विधान पर निर्भर करता है; फल की चिंता करने से वर्तमान कर्म की एकाग्रता नष्ट होती है।
३. "मा कर्मफलहेतुर्भूः" (तू कर्मफल का भोक्ता या अहंकारी कर्ता मत बन): "मैंने किया" के अहंकार और सकाम तृष्णा का त्याग कर प्रत्येक कर्म को ईश्वरार्पण बुद्धि ('यज्ञ') से कर।
४. "मा ते सङ्गोऽस्त्वकर्मणि" (और तेरी कर्म न करने अर्थात् आलस्य या पलायन में भी आसक्ति न हो): फलासक्ति के त्याग का अर्थ निकम्मा बैठना नहीं, अपितु भयमुक्त होकर सर्वोच्च उत्साह से कर्तव्य करना है।

३. योग की दो अमर परिभाषाएँ:
• "समत्वं योग उच्यते" (२.४८): सिद्धि और असिद्धि (सफलता और असफलता) में चित्त का सम (संतुलित) रहना ही योग है।
• "योगः कर्मसु कौशलम्" (२.५०): कर्म के बंधन से मुक्त रहते हुए श्रेष्ठतम रीति से कर्तव्य संपन्न करने की कुशलता ही योग है।`,
      Sanskrit: `श्रीभगवानुवाच —
कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥

योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।
सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २.४८ ॥

दूरेण ह्यवरं कर्म बुद्धियोगाद्धनञ्जय ।
बुद्धौ शरणमन्विच्छ कृपणाः फलहेतवः ॥ २.४९ ॥

बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।
तस्माद्योगाय युज्यस्व योगः कर्मसु कौशलम् ॥ २.५० ॥

पदच्छेदः अन्वयश्च (२.४७):
ते अधिकारः कर्मणि एव (अस्ति), फलेषु कदाचन मा (अस्तु)। (त्वं) कर्मफलहेतुः मा भूः, अकर्मणि (अपि) ते सङ्गः मा अस्तु।`
    }
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra: The Mother of the Vedas & Universal Prayer for Wisdom',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Rigveda 3.62.10',
    contentType: 'Text',
    description: 'Read the complete Gayatri Mantra (Savitri Mantra) from Rigveda 3.62.10 revealed to Brahmarshi Vishvamitra: 24-syllable meaning, Sapta Vyahritis, Gayatri Shirsha, and Sandhyavandanam method.',
    views: 24184,
    likes: 7222,
    language: 'Sanskrit',
    author: 'Brahmarshi Vishvamitra (Rigveda 3.62.10)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Gayatri Mantra · Vedamata Savitri',
      sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि',
      subtitle: 'Rigveda 3.62.10 · Brahmarshi Vishvamitra',
      c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'himalaya'
    }),
    tags: ['rigveda', 'sun', 'wisdom', 'gayatri-mantra', 'vishvamitra'],
    body: {
      English: `Revealed to Brahmarshi Vishvamitra in the Rigveda (Mandala 3, Sukta 62, Mantra 10) and repeated across the Yajurveda (3.35, 36.3) and Samaveda (1462), the Gayatri Mantra (also known as the Savitri Mantra) is revered as "Vedamata" (the Mother of the Vedas). In the Bhagavad Gita (10.35), Bhagavan Sri Krishna declares: "Gayatri chhandasam aham" ("Among sacred meters, I am the Gayatri").

1. Complete Sanskrit Text & Transliteration:
• Standard Tri-Pada Gayatri Mantra (With Pranava & Maha-Vyahritis):
"ॐ भूर्भुवः स्वः ।
तत्सवितुर्वरेण्यं ।
भर्गो देवस्य धीमहि ।
धियो यो नः प्रचोदयात् ॥"
Transliteration:
"Om Bhur Bhuvah Svah |
Tat Savitur Varenyam |
Bhargo Devasya Dheemahi |
Dhiyo Yo Nah Prachodayat ||"

• Complete Sapta-Vyahriti Gayatri with Gayatri Shirsha (Taittiriya Aranyaka 10.27):
"ॐ भूः ॐ भुवः ॐ सुवः ॐ महः ॐ जनः ॐ तपः ॐ सत्यम् ।
तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ।
ओमापो ज्योती रसोऽमृतं ब्रह्म भूर्भुवः सुवरोम् ॥"

2. Word-by-Word (Pada-Artha) Meaning of the 24 Syllables:
• ॐ (Om): The Supreme Pranava Brahman.
• भूः (Bhuh): Embodiment of Vital Spiritual Energy (Prana) / Physical Plane (Bhuloka).
• भुवः (Bhuvah): Destroyer of Sufferings / Astral & Mental Plane (Bhuvarloka).
• स्वः (Svah): Embodiment of Bliss (Ananda) / Celestial Causal Plane (Svarloka).
• तत् (Tat): That transcendent Ultimate Reality.
• सवितुः (Savituh): Of Savitr, the Divine Vivifier, Creator, and Spiritual Sun behind the physical sun.
• वरेण्यम् (Varenyam): Most adorable, supreme, and worthy of being chosen by all seekers.
• भर्गः (Bhargah): The self-effulgent spiritual radiance that burns away all ignorance and karmic impurities ("Bha" = to shine, "Rga" = to roast/destroy).
• देवस्य (Devasya): Of the self-luminous Divine Being.
• धीमहि (Dheemahi): We meditate upon and absorb within our hearts.
• धियः (Dhiyah): Our intellects, discerning wisdom (Buddhi / Prajna), and intuition.
• यः (Yah): Who (that Divine Savitr).
• नः (Nah): Our (a collective prayer for all humanity, not merely an individual request!).
• प्रचोदयात् (Prachodayat): May He inspire, awaken, and guide along the path of righteousness and Truth.

3. Traditional Times for Japa (Trikala Sandhya):
Chanted silently or softly at the three sacred junctions of the day (Sandhyas):
1. Pratah-Sandhya (Dawn before sunrise): Facing East, meditating on Gayatri as Brahmani for wisdom and creative clarity.
2. Madhyahna-Sandhya (Noon): Facing North/East, meditating on Savitri as Vaishnavi for righteous sustenance and dharma.
3. Sayam-Sandhya (Sunset): Facing West, meditating on Saraswati as Rudrani for inner peace and liberation.`,
      Hindi: `ऋग्वेद (मण्डल ३, सूक्त ६२, मंत्र १०), यजुर्वेद (३६.३) और सामवेद (१४६२) में ब्रह्मर्षि विश्वामित्र द्वारा दृष्ट 'गायत्री मंत्र' (सावित्री मंत्र) को 'वेदमाता' और 'महामंत्र' कहा जाता है। चौबीस अक्षरों वाला यह मंत्र सद्बुद्धि, प्रज्ञा और आत्मज्योति के जागरण की सार्वभौमिक प्रार्थना है।

१. मूल गायत्री मंत्र एवं सप्त-व्याहृति शिरोमंत्र:
• मूल गायत्री मंत्र:
ॐ भूर्भुवः स्वः ।
तत्सवितुर्वरेण्यं ।
भर्गो देवस्य धीमहि ।
धियो यो नः प्रचोदयात् ॥

• सप्त-व्याहृति एवं गायत्री शिरोमंत्र सहित:
ॐ भूः ॐ भुवः ॐ स्वः ॐ महः ॐ जनः ॐ तपः ॐ सत्यम् ।
तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ।
ओमापो ज्योती रसोऽमृतं ब्रह्म भूर्भुवः स्वरोम् ॥

२. शब्दशः हिन्दी अर्थ (पदार्थ):
• ॐ: परब्रह्म का प्रतीक प्रणव।
• भूः: प्राणस्वरूप (भूलोक में व्याप्त)।
• भुवः: दुःखनाशक (अन्तरिक्ष लोक में व्याप्त)।
• स्वः: आनन्दस्वरूप (स्वर्गलोक में व्याप्त)।
• तत्: उस (अनिर्वचनीय परमतत्त्व)।
• सवितुः: सृष्टिकर्ता एवं प्रकाशक भगवान सविता (सूर्य की आत्मा) के।
• वरेण्यम्: सर्वश्रेष्ठ एवं वरण करने योग्य।
• भर्गः: पापों तथा अज्ञान का भंजन करने वाले दिव्य तेज को।
• देवस्य: दिव्य गुणों से युक्त परमात्मा के।
• धीमहि: हम अपनी अंतरात्मा में धारण और ध्यान करते हैं।
• यः: जो परमात्मा।
• नः: हमारी (समस्त मानव जाति की — यह सामूहिक प्रार्थना है)।
• धियः: बुद्धियों (प्रज्ञा एवं विवेक) को।
• प्रचोदयात्: सन्मार्ग और सत्य की ओर प्रेरित करें।

३. गायत्री उपासना का विधान (त्रिकाल संध्या):
प्रातःकाल (सूर्योदय के समय पूर्वाभिमुख), मध्याह्न और सायंकाल (सूर्यास्त के समय पश्चिमाभिमुख) पवित्र भाव से १०८ बार (१ माला) गायत्री मंत्र का जप करने से अंतःकरण निर्मल होता है और मेधा व ओज की वृद्धि होती है।`,
      Sanskrit: `विनियोगः —
ॐ कारस्य ब्रह्मा ऋषिः, दैवी गायत्री छन्दः, परमात्मा देवता, भूर्भुवः स्वः इति महाव्याहृतीनां परमेष्ठी प्रजापतिरृषिः, गायत्र्युष्णिगनुष्टुभश्छन्दांसि, अग्निवाय्वादित्या देवताः, गायत्रीमन्त्रस्य विश्वामित्र ऋषिः, निचृद्गायत्री छन्दः, सविता देवता, श्रीसवितादेवताप्रीत्यर्थे जपे विनियोगः ॥

मूलमन्त्रः —
ॐ भूर्भुवः स्वः ।
तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।
धियो यो नः प्रचोदयात् ॥ (ऋग्वेदः ३.६२.१०)

गायत्रीध्यानम् —
मुक्ताविद्रुमहेमनीलधवलच्छायैर्मुखैस्त्रीक्षणै-
र्युक्तामिन्दुनिबद्धरत्नमकुटां तत्त्वार्थवर्णात्मिकाम् ।
गायत्रीं वरदाभयाङ्कुशकशाः शुभ्रं कपालं गदां
शङ्खं चक्र मथारविन्दयुगलं हस्तैर्वहन्तीं भजे ॥`
    }
  }
];

INITIAL_SACRED_ITEMS.push(...INITIAL_SACRED_ITEMS_PART2);


export const EXTRA_SEO_SACRED_ITEMS = [
  {
    id: 'dwadasa-jyotirlinga-complete-guide',
    title: 'The 12 Jyotirlingas of Lord Shiva: Complete Stotram, Locations & Temple Guide',
    category: 'Temples',
    sanskritBadge: 'द्वादश ज्योतिर्लिङ्ग · 12 Jyotirlingas',
    contentType: 'PDF',
    pdfFileName: '12-Jyotirlingas-Complete-Stotram-Guide.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=lUTHR0n6J0w',
    description: 'Complete guide to all 12 sacred Jyotirlinga temples of Lord Shiva across India — Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameshwaram, and Grishneshwar — with the Dwadasa Jyotirlinga Stotram.',
    views: 34210,
    likes: 11240,
    language: 'Sanskrit',
    author: 'Shiva Mahapurana (Koti Rudra Samhita) & Adi Shankaracharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
    tags: ['12-jyotirlinga', 'shiva', 'somnath', 'mahakaleshwar', 'kedarnath', 'kashi-vishwanath', 'pdf-guide'],
    body: {
      English: `According to the Koti Rudra Samhita of the Shiva Mahapurana, when Lord Brahma and Lord Vishnu debated supremacy, Lord Shiva manifested as an infinite, beginningless and endless pillar of cosmic light (Jyotirlinga — Stambha). Wherever Lord Shiva subsequently manifested as a self-born Lingam of divine light for the liberation of devotees, those twelve supreme shrines became revered as the Dwadasa Jyotirlingas.

1. The Complete Dwadasa Jyotirlinga Stotram (By Jagadguru Adi Shankaracharya):
"Saurashtre Somanatham cha Shrishaile Mallikarjunam |
Ujjayinyam Mahakalam Omkaram-amaleshwaram || 1 ||
Paralyam Vaidyanatham cha Dakinyam Bhimashankaram |
Setubandhe tu Ramesham Nagesham Darukavane || 2 ||
Varanasyam tu Vishvesham Tryambakam Gautami-tate |
Himalaye tu Kedaram Ghushmesham cha Shivalaye || 3 ||
Etani Jyotirlingani sayam pratah pathen-narah |
Sapta-janma-kritam papam smaranena vinashyati || 4 ||"

2. Complete Directory & Spiritual Significance of All 12 Jyotirlingas:
1. Somnath (Prabhas Patan, Veraval, Gujarat): The First (Adi) Jyotirlinga on the shore of the Arabian Sea, worshipped by Chandra Deva to regain his luminosity.
2. Mallikarjuna (Srisailam, Andhra Pradesh): Situated on Shri Shaila mountain along the Krishna River; uniquely both a Jyotirlinga and a Maha Shaktipeeth.
3. Mahakaleshwar (Ujjain, Madhya Pradesh): Beside the Shipra River; the only Dakshinamurti (south-facing) Jyotirlinga, renowned for its dawn Bhasma Aarti.
4. Omkareshwar & Mamaleshwar (Khandwa, Madhya Pradesh): On the sacred Om-shaped island in the Narmada River.
5. Kedarnath (Rudraprayag, Uttarakhand Himalayas): At 3,583 meters near the Mandakini River; where Lord Shiva blessed the Pandavas.
6. Bhimashankar (Pune, Sahyadri Hills, Maharashtra): Source of the Bhima River.
7. Kashi Vishwanath (Varanasi, Uttar Pradesh): On the western bank of Mother Ganga; where Lord Shiva whispers the liberating Taraka Mantra.
8. Trimbakeshwar (Nashik, Maharashtra): At the origin of the Godavari River; features a three-faced Lingam embodying Brahma, Vishnu, and Rudra.
9. Vaidyanath Dham (Deoghar, Jharkhand): Where Lord Shiva manifested as Vaidyanatha (the Divine Physician).
10. Nageshwar (Dwarka, Gujarat): Protects devotees from all worldly fear.
11. Ramanathaswamy (Rameswaram, Tamil Nadu): Consecrated by Lord Sri Rama on the shore of the Indian Ocean; one of the four All-India Char Dhams.
12. Grishneshwar (Verul/Ellora, Maharashtra): The twelfth Jyotirlinga near Ellora Caves.`,
      Hindi: `शिव महापुराण के कोटिरुद्र संहिता के अनुसार, जहाँ-जहाँ देवाधिदेव महादेव स्वयं ज्योतिपुंज (अग्नि-स्तंभ) के रूप में भक्तों के कल्याणार्थ प्रकट हुए, वे बारह पावन तीर्थ 'द्वादश ज्योतिर्लिंग' कहलाते हैं।

१. द्वादश ज्योतिर्लिंग स्तोत्रम्:
सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् । उज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥ १ ॥
परल्यां वैद्यनाथं च डाकिन्यां भीमशङ्करम् । सेतुबन्धे तु रामेशं नागेशं दारुकावने ॥ २ ॥
वाराणस्यां तु विश्वेशं त्र्यम्बकं गौतमीतटे । हिमालये तु केदारं घुश्मेशं च शिवालये ॥ ३ ॥
एतानि ज्योतिर्लिङ्गानि सायं प्रातः पठेन्नरः । सप्तजन्मकृतं पापं स्मरणेन विनश्यति ॥ ४ ॥

२. बारह ज्योतिर्लिंगों का स्थान एवं माहात्म्य:
१. सोमनाथ (प्रभास पाटन, गुजरात) · २. मल्लिकार्जुन (श्रीशैलम, आंध्र प्रदेश) · ३. महाकालेश्वर (उज्जैन, मध्य प्रदेश) · ४. ओंकारेश्वर-ममलेश्वर (खण्डवा, मध्य प्रदेश) · ५. केदारनाथ (उत्तराखंड हिमालय) · ६. भीमशंकर (पुणे, महाराष्ट्र) · ७. काशी विश्वनाथ (वाराणसी, उत्तर प्रदेश) · ८. त्र्यम्बकेश्वर (नासिक, महाराष्ट्र) · ९. वैद्यनाथ धाम (देवघर, झारखंड) · १०. नागेश्वर (द्वारका, गुजरात) · ११. रामेश्वरम (तमिलनाडु) · १२. घृष्णेश्वर (वेरुल/एलोरा, महाराष्ट्र)।`,
      Sanskrit: `सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् ।
उज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥ १ ॥
परल्यां वैद्यनाथं च डाकिन्यां भीमशङ्करम् ।
सेतुबन्धे तु रामेशं नागेशं दारुकावने ॥ २ ॥
वाराणस्यां तु विश्वेशं त्र्यम्बकं गौतमीतटे ।
हिमालये तु केदारं घुश्मेशं च शिवालये ॥ ३ ॥
एतानि ज्योतिर्लिङ्गानि सायं प्रातः पठेन्नरः ।
सप्तजन्मकृतं पापं स्मरणेन विनश्यति ॥ ४ ॥`
    }
  },
  {
    id: 'konark-sun-temple-lingaraj-odisha',
    title: 'Konark Sun Temple & Lingaraj Temple (Odisha): The Golden Triangle of Kalinga',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Kalinga Architecture',
    contentType: 'PDF',
    pdfFileName: 'Konark-Sun-Temple-Lingaraj-Bhubaneswar-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Explore the sacred Golden Triangle of Odisha (Bhubaneswar, Konark, and Puri): the 13th-century Konark Surya Devalaya chariot with 24 sundial wheels and the 11th-century Ekamra Kshetra Lingaraj Temple.',
    views: 26420,
    likes: 8910,
    language: 'English',
    author: 'Kapila Samhita, Ekamra Purana & Kalinga Shilpa Shastra',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Jagannath_Temple,_Puri._India.jpg?width=900',
    tags: ['konark', 'lingaraj', 'bhubaneswar', 'odisha', 'surya-mandir', 'kalinga', 'pdf'],
    body: {
      English: `Together with Shree Jagannath Dham in Puri, the Lingaraj Temple in Bhubaneswar (ancient Ekamra Kshetra — the "Temple City of India") and the Konark Sun Temple (Arka Kshetra / Padma Kshetra) form the sacred Swarna Tribhuja (Golden Triangle) of Odisha, representing the zenith of Kalinga Nagara temple architecture.

1. Konark Sun Temple (Arka Kshetra — The Celestial Chariot of Surya Deva):
• Built in 1250 CE by Emperor Langula Narasimha Deva I of the Eastern Ganga Dynasty with 1,200 master sculptors led by Bisu Maharana and his 12-year-old son Dharmapada.
• Designed as the colossal celestial chariot of the Sun God Surya pulled by 7 galloping stone horses (7 days of the week / 7 colors of light) on 24 intricately carved stone wheels (12 months / 24 fortnights / 24 hours) that function as precision astronomical sundials accurate to a single minute!

2. Shree Lingaraj Temple, Bhubaneswar (Ekamra Kshetra — Harihara Synthesis):
• Built in the 11th century CE by King Jajati Keshari of the Somavamshi Dynasty, rising 180 feet in classic Kalinga Pancharatha Rekha Deula style.
• The Swayambhu Lingam inside the Garbhagriha is revered as "Harihara" (the unified form of Lord Vishnu and Lord Shiva), where both Bilva leaves and Tulsi leaves are offered daily.`,
      Hindi: `ओडिशा का 'स्वर्ण त्रिभुज' (जगन्नाथ पुरी = शंख क्षेत्र, कोणार्क = अर्क क्षेत्र, और भुवनेश्वर = एकाम्र क्षेत्र) भारतीय कलिंग मंदिर स्थापत्य और सनातन उपासना का अद्वितीय संगम है।

१. कोणार्क सूर्य मंदिर (अर्क क्षेत्र): १३वीं शताब्दी (१२५० ई.) में गंग वंश के सम्राट लांगूल नरसिंह देव प्रथम द्वारा निर्मित यह मंदिर भगवान सूर्य के विशाल रथ के रूप में है, जिसे ७ अश्व खींच रहे हैं और जिसके २४ नक्काशीदार पहिए सटीक धूपघड़ी (Sundial) का कार्य करते हैं।
२. श्री लिंगराज मंदिर, भुवनेश्वर (एकाम्र क्षेत्र): ११वीं शताब्दी में सोमवंशी राजा ययाति केसरी द्वारा निर्मित १८० फीट ऊँचा यह मंदिर 'हरिहर' (भगवान विष्णु और शिव के संयुक्त स्वरूप) को समर्पित है।`,
      Sanskrit: `जपाकुसुमसङ्काशं काश्यपेयं महाद्युतिम् ।
तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥ १ ॥`
    }
  },
  {
    id: 'shiva-tandava-stotram-ravana',
    title: 'Shiva Tandava Stotram: Complete 17 Verses by Ravana with Hindi & English Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Shiva Tandava Stotram',
    contentType: 'PDF',
    pdfFileName: 'Shiva-Tandava-Stotram-Complete.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=lUTHR0n6J0w',
    description: 'Read the complete Shiva Tandava Stotram (Jatatavigalajjala Pravahapavitasthale) composed by Dashanana Ravana in praise of Lord Shiva in the Panchachamara meter, with full Sanskrit, Hindi, and English meaning.',
    views: 38940,
    likes: 12450,
    language: 'Sanskrit',
    author: 'Ravana (Lankeshwara)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Shiva_Nataraja_at_the_British_Museum.jpg?width=900',
    tags: ['shiva-tandava-stotram', 'jatatavigalajjala', 'shiva', 'nataraja', 'ravana', 'pdf', 'video'],
    body: {
      English: `Composed in the rhythmic 16-syllable Panchachamara meter mirroring the cosmic beat of Shiva's Damaru, the Shiva Tandava Stotram invokes the supreme grace of Lord Mahadeva.

1. Verse 1:
"Jatatavigalajjala-pravahapavitasthale Gale'valambya lambitam bhujangatungamalikam |
Damaddamaddamaddamanninaadavad-damarvayam Chakara chandatandavam tanotu nah Shivah shivam || 1 ||"
Meaning: From whose forest-like matted locks flows the purifying stream of Mother Ganga; around whose neck hangs the lofty garland of great serpents; and who performed the fierce, auspicious Tandava dance to the resounding 'Damad-Damad-Damad-Damad' beat of His Damaru—may that Lord Shiva shower auspiciousness upon us all!

2. Verse 2:
"Jatakatahasambhrama-bhramannilimpanirjhari Vilolavichivallari-virajamanamurdhani |
Dhagaddhagaddhagajjvala-lalata-pattapavake Kishorachandrashekhare ratih pratikshanam mama || 2 ||"
Meaning: May my devotion abide every single moment in Lord Shiva, whose crown is adorned by the surging waves of the celestial Ganga, on whose forehead blazes the sacred fire, and upon whose head rests the crescent moon!`,
      Hindi: `दशानन रावण द्वारा कैलाश पर्वत पर भगवान आशुतोष महादेव की स्तुति में पञ्चचामर छन्द में रचित 'शिवताण्डवस्तोत्रम्':

जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥
जटाकटाहसम्भ्रमभ्रमान्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥
धराधरेन्द्रनंदिनीविलासबन्धुबन्धुर स्फुरद्दिगन्तसन्ततिप्रमोदमानमानसे ।
कृपाकटाक्षधोरणीनिरुद्धदुर्धरापदि क्वचिद्दिगम्बरे मनो विनोदमेतु वस्तुनि ॥ ३ ॥`,
      Sanskrit: `जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् ।
डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥ १ ॥
जटाकटाहसम्भ्रमभ्रमान्निलिम्पनिर्झरी विलोलवीचिवल्लरीविराजमानमूर्धनि ।
धगद्धगद्धगज्ज्वलल्ललाटपट्टपावके किशोरचन्द्रशेखरे रतिः प्रतिक्षणं मम ॥ २ ॥`
    }
  },
  {
    id: 'aditya-hridaya-stotram-ramayana',
    title: 'Aditya Hridaya Stotram: Sage Agastya Solar Hymn of Victory (Valmiki Ramayana)',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Yuddha Kanda 105',
    contentType: 'PDF',
    pdfFileName: 'Aditya-Hridaya-Stotram-Complete.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Read the complete Aditya Hridaya Stotram taught by Maharshi Agastya to Lord Sri Rama on the battlefield of Lanka in the Yuddha Kanda of Valmiki Ramayana for supreme courage, health, and victory.',
    views: 27450,
    likes: 9120,
    language: 'Sanskrit',
    author: 'Maharshi Valmiki (Spoken by Sage Agastya)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rama_and_Hanuman_fighting_Ravana,_an_album_painting_on_paper,_c1820.jpg?width=900',
    tags: ['aditya-hridayam', 'surya', 'rama', 'agastya', 'ramayana', 'victory', 'pdf'],
    body: {
      English: `In the Yuddha Kanda (Sarga 105) of the Valmiki Ramayana, Maharshi Agastya taught Lord Sri Rama the eternal secret of the "Aditya Hridayam"—the supreme hymn invoking Surya Narayana, which removes fear, sorrow, and fatigue and guarantees victory.

Key Verses & Meaning:
"Aditya-hridayam punyam sarva-shatru-vinashanam |
Jayavaham japen-nityam akshayyam paramam shivam || 4 ||
Sarva-mangala-mangalyam sarva-papa-pranashanam |
Chintashoka-prashamanam ayur-vardhanam-uttamam || 5 ||
Rashmimantam samudyantam devasure-namaskritam |
Pujayasva Vivasvantam Bhaskaram Bhuvaneshwaram || 6 ||"`,
      Hindi: `वाल्मीकि रामायण के युद्धकाण्ड (सर्ग १०५) में महर्षि अगस्त्य द्वारा भगवान श्रीराम को उपदिष्ट 'आदित्यहृदय स्तोत्र':

आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् । जयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥ ४ ॥
सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम् । चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम् ॥ ५ ॥
रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् । पूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥ ६ ॥`,
      Sanskrit: `आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् ।
जयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥ ४ ॥
सर्वमङ्गलमाङ्गल्यं सर्वपापप्रणाशनम् ।
चिन्ताशोकप्रशमनमायुर्वर्धनमुत्तमम् ॥ ५ ॥
रश्मिमन्तं समुद्यन्तं देवासुरनमस्कृतम् ।
पूजयस्व विवस्वन्तं भास्करं भुवनेश्वरम् ॥ ६ ॥`
    }
  },
  {
    id: 'nirvana-shatkam-adi-shankara',
    title: 'Nirvana Shatkam (Atma Shatkam): Chidananda Rupah Shivoham Shivoham',
    category: 'Upanishads',
    sanskritBadge: 'उपनिषद् · Advaita Vedanta',
    contentType: 'PDF',
    pdfFileName: 'Nirvana-Shatkam-Adi-Shankaracharya.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Read all 6 immortal verses of the Nirvana Shatkam (Atma Shatkam) composed by Adi Shankaracharya: "Chidananda Rupah Shivoham Shivoham".',
    views: 23490,
    likes: 8120,
    language: 'Sanskrit',
    author: 'Jagadguru Adi Shankaracharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE,_Vivaha_sukta,_Rigveda_10.85.1-8,_Sanskrit,_Devanagari,_manuscript_page.jpg?width=900',
    tags: ['nirvana-shatkam', 'shivoham', 'adi-shankaracharya', 'advaita', 'vedanta', 'pdf'],
    body: {
      English: `Composed by eight-year-old Adi Shankaracharya on the banks of the Narmada River upon meeting his Guru Govinda Bhagavatpada, the Nirvana Shatkam (Atma Shatkam) proclaims the non-dual nature of the Self as pure Consciousness-Bliss ("Chidananda Rupah Shivoham Shivoham").

1. Mano buddhyahankara chittani naham, Na cha shrotrajihve na cha ghranashnetre |
   Na cha vyoma bhumir na tejo na vayuh, Chidananda rupah Shivoham Shivoham || 1 ||
2. Na cha pranasanjno na vai pancha-vayuh, Na va saptadhatur na va pancha-koshah |
   Na vak-panipadam na chopasthapayu, Chidananda rupah Shivoham Shivoham || 2 ||
3. Na me dvesharagau na me lobhamohau, Mado naiva me naiva matsaryabhavah |
   Na dharmo na chartho na kamo na mokshah, Chidananda rupah Shivoham Shivoham || 3 ||
4. Na punyam na papam na saukhyam na duhkham, Na mantro na tirtham na veda na yajnah |
   Aham bhojanam naiva bhojyam na bhokta, Chidananda rupah Shivoham Shivoham || 4 ||
5. Na mrityur na shanka na me jatibhedah, Pita naiva me naiva mata na janma |
   Na bandhur na mitram gurur naiva shishyah, Chidananda rupah Shivoham Shivoham || 5 ||
6. Aham nirvikalpo nirakara rupo, Vibhutvachcha sarvatra sarvendriyanam |
   Na chasangato naiva muktir na meyah, Chidananda rupah Shivoham Shivoham || 6 ||`,
      Hindi: `आदि शंकराचार्य द्वारा रचित अद्वैत वेदान्त का अमर स्तोत्र — 'निर्वाण षट्कम्' (आत्म षट्कम्):

मनोबुद्ध्यहंकारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे ।
न च व्योम भूमिर्न तेजो न वायुः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥ १ ॥
न च प्राणसंज्ञो न वै पञ्चवायुः न वा सप्तधातुर्न वा पञ्चकोशः ।
न वाक्पाणिपादं न चोपस्थपायू चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥ २ ॥
न मे द्वेषरागौ न मे लोभमोहौ मदो नैव मे नैव मात्सर्यभावः ।
न धर्मो न चार्थो न कामो न मोक्षः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥ ३ ॥`,
      Sanskrit: `मनोबुद्ध्यहङ्कारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे ।
न च व्योम भूमिर्न तेजो न वायुः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥ १ ॥
अहं निर्विकल्पो निराकाररूपो विभुत्वाच्च सर्वत्र सर्वेन्द्रियाणाम् ।
न चासङ्गतं नैव मुक्तिर्न मेयः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥ ६ ॥`
    }
  },
  {
    id: 'bhagavad-gita-18-chapters-summary',
    title: 'Shrimad Bhagavad Gita: Complete Guide to All 18 Chapters (Karma, Bhakti & Jnana Yoga)',
    category: 'Bhagavad Gita',
    sanskritBadge: 'गीता · All 18 Adhyayas',
    contentType: 'PDF',
    pdfFileName: 'Shrimad-Bhagavad-Gita-All-18-Chapters-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Comprehensive chapter-by-chapter guide to all 18 Adhyayas (700 Shlokas) of the Shrimad Bhagavad Gita, divided into Karma Shatkam (1–6), Bhakti Shatkam (7–12), and Jnana Shatkam (13–18).',
    views: 41200,
    likes: 14320,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa (Spoken by Bhagavan Sri Krishna)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_and_Krishna_at_the_Kurukshetra_Mahabharata_war,_Gita.jpg?width=900',
    tags: ['bhagavad-gita', '18-chapters', 'krishna', 'arjuna', 'karma-yoga', 'bhakti-yoga', 'jnana-yoga', 'pdf'],
    body: {
      English: `Comprising 700 verses across 18 chapters in the Bhishma Parva of the Mahabharata, the Shrimad Bhagavad Gita is structured into three progressive groups of six chapters each (Shatka-Trayam):

I. Karma-Yoga Shatkam (Chapters 1–6):
1. Arjuna Vishada Yoga (47v) · 2. Sankhya Yoga (72v) · 3. Karma Yoga (43v) · 4. Jnana-Karma-Sannyasa Yoga (42v) · 5. Karma-Sannyasa Yoga (29v) · 6. Dhyana / Atmasamyama Yoga (47v).

II. Bhakti-Yoga Shatkam (Chapters 7–12):
7. Jnana-Vijnana Yoga (30v) · 8. Akshara-Brahma Yoga (28v) · 9. Raja-Vidya Raja-Guhya Yoga (34v) · 10. Vibhuti Yoga (42v) · 11. Vishwarupa-Darshana Yoga (55v) · 12. Bhakti Yoga (20v).

III. Jnana-Yoga Shatkam (Chapters 13–18):
13. Kshetra-Kshetrajna Vibhaga Yoga (35v) · 14. Gunatraya-Vibhaga Yoga (27v) · 15. Purushottama Yoga (20v) · 16. Daivasura-Sampad-Vibhaga Yoga (24v) · 17. Shraddhatraya-Vibhaga Yoga (28v) · 18. Moksha-Sannyasa Yoga (78v — culminating in "Sarva-dharman parityajya mam ekam sharanam vraja").`,
      Hindi: `महाभारत के भीष्मपर्व के अंतर्गत १८ अध्यायों और ७०० श्लोकों वाली 'श्रीमद्भगवद्गीता' को तीन षट्कों में विभाजित किया गया है:
• प्रथम षट्क (अध्याय १-६ — कर्मयोग): अर्जुनविषादयोग, सांख्ययोग, कर्मयोग, ज्ञानकर्मसंन्यासयोग, कर्मसंन्यासयोग एवं आत्मसंयमयोग।
• द्वितीय षट्क (अध्याय ७-१२ — भक्तियोग): ज्ञानविज्ञानयोग, अक्षरब्रह्मयोग, राजविद्याराजगुह्ययोग, विभूतियोग, विश्वरूपदर्शनयोग एवं भक्तियोग।
• तृतीय षट्क (अध्याय १३-१८ — ज्ञानयोग): क्षेत्र-क्षेत्रज्ञविभागयोग, गुणत्रयविभागयोग, पुरुषोत्तमयोग, दैवासुरसम्पद्विभागयोग, श्रद्धात्रयविभागयोग एवं मोक्षसंन्यासयोग।`,
      Sanskrit: `सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।
अहं त्वा सर्वपापेभ्यः मोक्षयिष्यामि मा शुचः ॥ १८.६६ ॥
यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः ।
तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥ १८.७८ ॥`
    }
  },
  {
    id: 'sundara-kanda-ramayana-hanuman',
    title: 'Sundara Kanda (Ramayana): Hanuman Leap Across the Ocean & Blessings of Maa Sita',
    category: 'Ramayana',
    sanskritBadge: 'रामायण · Sundara Kanda',
    contentType: 'PDF',
    pdfFileName: 'Sundara-Kanda-Complete-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Explore the auspicious Sundara Kanda of Valmiki Ramayana and Tulsidas Ramcharitmanas — Hanumanji crossing the ocean, overcoming Mainaka, Surasa, Simhika, and Lankini, and consoling Maa Sita in Ashoka Vatika.',
    views: 31800,
    likes: 10940,
    language: 'Sanskrit',
    author: 'Maharshi Valmiki & Goswami Tulsidas',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/11TH_Rudra_Shiva_Hanuman.jpg?width=900',
    tags: ['sundara-kanda', 'ramayana', 'hanuman', 'sita', 'ramcharitmanas', 'pdf'],
    body: {
      English: `The Sundara Kanda (Book V of the Valmiki Ramayana and fifth Sopana of Tulsidas's Ramcharitmanas) is the spiritual heart of the Ramayana—celebrating Sri Hanuman's leap of devotion across the ocean, overcoming Mainaka, Surasa, Simhika, and Lankini, meeting Vibhishana, and delivering Sri Rama's signet ring to Mother Sita in Ashoka Vatika.`,
      Hindi: `गोस्वामी तुलसीदास कृत श्रीरामचरितमानस एवं वाल्मीकि रामायण का पंचम सोपान 'सुन्दरकाण्ड' सकल अमंगलों का नाश करने वाला है:
• "जामवंत के बचन सुहाए। सुनि हनुमंत हृदय अति भाए॥"
• "राम काजु कीन्हें बिनु मोहि कहाँ बिश्राम॥"
• "प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा॥"`,
      Sanskrit: `शान्तं शाश्वतमप्रमेयमनघं निर्वाणशान्तिप्रदं
ब्रह्माशम्भुफणीन्द्रसेव्यमनिशं वेदान्तवेद्यं विभुम् ।
रामाख्यं जगदीश्वरं सुरगुरुं मायामनुष्यं हरिं
वन्देऽहं करुणाकरं रघुवरं भूपालचूडामणिम् ॥ १ ॥`
    }
  },
  {
    id: 'vishnu-sahasranama-mahabharata',
    title: 'Sri Vishnu Sahasranama & Vidura Niti: The Immortal Wisdom of the Mahabharata',
    category: 'Mahabharata',
    sanskritBadge: 'महाभारत · Anushasana Parva',
    contentType: 'PDF',
    pdfFileName: 'Sri-Vishnu-Sahasranama-Mahabharata.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Explore the Sri Vishnu Sahasranama Stotram taught by Bhishma Pitamaha to Yudhishthira in the Anushasana Parva of the Mahabharata, along with the ethical statecraft of Vidura Niti.',
    views: 26840,
    likes: 8740,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa (Bhishma Pitamaha & Mahatma Vidura)',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_BattlesWith_the_Kauravas_At_Kuruksheta_Bhagavad_Gita.jpg?width=900',
    tags: ['vishnu-sahasranama', 'bhishma', 'vidura-niti', 'mahabharata', 'vishnu', 'pdf'],
    body: {
      English: `In the Anushasana Parva (Chapter 149) of the Mahabharata, Grandsire Bhishma reveals the 1,000 Sacred Names of Lord Vishnu (Sri Vishnu Sahasranama Stotram) to Yudhishthira in the presence of Bhagavan Sri Krishna:
"Shantakaram Bhujagashayanam Padmanabham Suresham, Vishvadharam Gaganasadrisham Meghavarnam Shubhangam |
Lakshmikantam Kamalanayanam Yogibhir-dhyanagamyam, Vande Vishnum Bhavabhayaharam Sarvalokaikanatham ||"`,
      Hindi: `महाभारत के अनुशासन पर्व में भीष्म पितामह द्वारा धर्मराज युधिष्ठिर को उपदिष्ट 'श्री विष्णु सहस्रनाम स्तोत्र' एवं उद्योग पर्व की 'विदुर नीति':
शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम् ।
लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम् ॥`,
      Sanskrit: `विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः ।
भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥ १ ॥
श्रीराम राम रामेति रमे रामे मनोरमे ।
सहस्रनाम तत्तुल्यं रामनाम वरानने ॥ २ ॥`
    }
  },
  {
    id: 'shrimad-bhagavatam-dashavatara',
    title: 'Srimad Bhagavata Mahapurana & The 10 Avatars (Dashavatara) of Lord Vishnu',
    category: 'Puranas',
    sanskritBadge: 'पुराण · Bhagavata Mahapurana',
    contentType: 'PDF',
    pdfFileName: 'Srimad-Bhagavatam-Dashavatara-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Explore the Srimad Bhagavata Mahapurana (Amala Purana) — its 12 Skandhas, 18,000 Shlokas, and the cosmic evolution of the Dashavatara (10 Avatars of Lord Vishnu).',
    views: 24910,
    likes: 8290,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa & Shukadeva Goswami',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sauti_recites_the_slokas_of_the_Mahabharata.jpg?width=900',
    tags: ['bhagavatam', 'dashavatara', 'vishnu', 'krishna', 'puranas', 'pdf'],
    body: {
      English: `Revered as the ripened nectar-fruit of the wish-fulfilling tree of the Vedas ("Nigama-kalpataror galitam phalam"), the Srimad Bhagavata Mahapurana celebrates the divine pastimes of Sri Krishna and the ten principal incarnations (Dashavatara): Matsya, Kurma, Varaha, Narasimha, Vamana, Parashurama, Sri Rama, Sri Krishna, Buddha/Balarama, and Kalki.`,
      Hindi: `वेद रूपी कल्पवृक्ष के पके हुए अमृतमय फल 'श्रीमद्भागवत महापुराण' (१२ स्कन्ध, १८,००० श्लोक) एवं भगवान विष्णु के दशावतार (मत्स्य, कूर्म, वराह, नृसिंह, वामन, परशुराम, राम, कृष्ण, बुद्ध/बलराम एवं कल्कि) का पावन दिग्दर्शन।`,
      Sanskrit: `निगमकल्पतरोर्गलितं फलं शुकमुखादमृतद्रवसंयुतम् ।
पिबत भागवतं रसमालयं मुहुरहो रसिका भुवि भावुकाः ॥ १ ॥`
    }
  },
  {
    id: 'om-jai-jagdish-hare-aarti',
    title: 'Om Jai Jagdish Hare Aarti: Complete Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Universal Aarti',
    contentType: 'Video',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=012oY38Blvg',
    description: 'Read and sing the complete Om Jai Jagdish Hare Aarti composed by Pandit Shardha Ram Phillauri — the universal prayer of Sanatan Dharma.',
    views: 36400,
    likes: 11890,
    language: 'Hindi',
    author: 'Pandit Shardha Ram Phillauri',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/DEV_DEEPAVALI_VARANASI_04.jpg?width=900',
    tags: ['om-jai-jagdish-hare', 'vishnu-aarti', 'bhajan', 'prayer', 'video', 'pdf'],
    body: {
      English: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare | Bhakt jano ke sankat, das jano ke sankat, kshan mein door kare ||
Jo dhyave phal pave, dukh binse man ka | Sukh sampati ghar aave, kasht mite tan ka ||
Mat-Pita tum mere, sharan gahoon kiski | Tum bin aur na dooja, aas karoon jiski ||
Tum Puran Parmatma, tum Antaryami | Parabrahma Parameshwara, tum sabke Swami ||`,
      Hindi: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे । भक्त जनों के संकट, क्षण में दूर करे ॥ १ ॥
जो ध्यावे फल पावे, दुःख बिनसे मन का । सुख सम्पत्ति घर आवे, कष्ट मिटे तन का ॥ २ ॥
मात-पिता तुम मेरे, शरण गहूँ किसकी । तुम बिन और न दूजा, आस करूँ जिसकी ॥ ३ ॥
तुम पूरण परमात्मा, तुम अन्तर्यामी । पारब्रह्म परमेश्वर, तुम सबके स्वामी ॥ ४ ॥`,
      Sanskrit: `त्वमेव माता च पिता त्वमेव त्वमेव बन्धुश्च सखा त्वमेव ।
त्वमेव विद्या द्रविणं त्वमेव त्वमेव सर्वं मम देवदेव ॥`
    }
  },
  {
    id: 'ekadashi-mahashivaratri-navaratri-vrat',
    title: 'Complete Guide to 24 Ekadashis, Maha Shivaratri, Chhath Puja & Rath Yatra Vrat Vidhi',
    category: 'Festivals',
    sanskritBadge: 'पर्व · Vrat & Panchanga Guide',
    contentType: 'PDF',
    pdfFileName: 'Complete-24-Ekadashi-Vrat-Festival-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Comprehensive guide to all 24 Ekadashis of the Hindu lunar calendar (Nirjala, Devshayani, Devuthani, Vaikuntha, Mokshada), Maha Shivaratri four-prahara puja, Chhath Puja, and Puri Rath Yatra.',
    views: 23890,
    likes: 7980,
    language: 'Hindi',
    author: 'Padma Purana, Skanda Purana & Nirnaya Sindhu',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Durga-puja-8424032.jpg?width=900',
    tags: ['ekadashi', 'mahashivaratri', 'chhath-puja', 'rath-yatra', 'navaratri', 'pdf'],
    body: {
      English: `Complete calendar and Vrat Vidhi of the 24 Sacred Ekadashis (Papamochani, Kamada, Varuthini, Mohini, Apara, Nirjala, Yogini, Devshayani, Kamika, Putrada, Aja, Parsva, Indira, Papankusha, Rama, Devuthani, Utpanna, Mokshada, Saphala, Vaikuntha, Shattila, Jaya, Vijaya, and Amalaki), along with Chhath Mahaparva and Maha Shivaratri Four-Prahara Puja.`,
      Hindi: `वर्ष की समस्त २४ एकादशियों (निर्जला, देवशयनी, देवउठनी, मोक्षदा, वैकुण्ठ आदि), लोकआस्था के महापर्व छठ पूजा और महाशिवरात्रि चार प्रहर अभिषेक की सम्पूर्ण व्रत विधि एवं कथा।`,
      Sanskrit: `एकादश्यां न भुञ्जीत पक्षयोरुभयोरपि ।
शिवरात्रौ महापुण्ये रात्रौ जागरणं चरेत् ॥`
    }
  },
  {
    id: 'patanjali-ashtanga-yoga-sutras',
    title: 'Maharshi Patanjali Yoga Sutras: Complete Guide to the 8 Limbs of Ashtanga Yoga',
    category: 'Philosophy',
    sanskritBadge: 'दर्शन · Patanjala Yoga Sutra',
    contentType: 'PDF',
    pdfFileName: 'Patanjali-Yoga-Sutras-Ashtanga-Yoga-Guide.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Explore the 196 Yoga Sutras of Maharshi Patanjali and the complete 8 Limbs (Ashtanga) of Raja Yoga: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, and Samadhi.',
    views: 24310,
    likes: 8190,
    language: 'Sanskrit',
    author: 'Maharshi Patanjali',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Shiva_Nataraja_at_the_British_Museum.jpg?width=900',
    tags: ['yoga-sutras', 'patanjali', 'ashtanga-yoga', 'meditation', 'samadhi', 'philosophy', 'pdf'],
    body: {
      English: `Codified by Maharshi Patanjali in 196 Sutras across four Padas (Samadhi, Sadhana, Vibhuti, and Kaivalya), the Yoga Sutras define Yoga as "Yogash chitta-vritti-nirodhah" (the stilling of mental fluctuations) through the 8 limbs of Ashtanga Yoga: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, and Samadhi.`,
      Hindi: `महर्षि पतंजलि प्रणीत १९६ सूत्रों वाले योगदर्शन एवं अष्टांग योग (यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारणा, ध्यान और समाधि) का सम्पूर्ण तात्त्विक विवेचन।`,
      Sanskrit: `अथ योगानुशासनम् ॥ १.१ ॥
योगश्चित्तवृत्तिनिरोधः ॥ १.२ ॥
तदा द्रष्टुः स्वरूपेऽवस्थानम् ॥ १.३ ॥
तस्य वाचकः प्रणवः । तज्जपस्तदर्थभावनम् ॥ १.२७-२८ ॥`
    }
  },
  {
    id: 'chaitanya-shikshashtakam-bhakti-sants',
    title: 'Chaitanya Mahaprabhu Shikshashtakam & Jayadeva Gita Govinda: The Nectar of Naam Sankirtan',
    category: 'Sant Teachings',
    sanskritBadge: 'सन्त वाणी · Naam Sankirtan',
    contentType: 'PDF',
    pdfFileName: 'Chaitanya-Shikshashtakam-Naam-Sankirtan.pdf',
    pdfUrl: '#auto-pdf',
    description: 'Read all 8 Sanskrit verses of Sri Chaitanya Mahaprabhu Shikshashtakam (Cheto-darpana-marjanam) on the glory of Naam Jaap & Sankirtan, alongside Kavi Jayadeva Gita Govinda.',
    views: 22190,
    likes: 7680,
    language: 'Sanskrit',
    author: 'Sri Chaitanya Mahaprabhu & Mahakavi Jayadeva',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hanuman_before_Rama.jpg?width=900',
    tags: ['chaitanya-mahaprabhu', 'shikshashtakam', 'naam-jaap', 'hare-krishna', 'jayadeva', 'sant-vani', 'pdf'],
    body: {
      English: `Sri Chaitanya Mahaprabhu's eight Sanskrit verses (Sri Shikshashtakam) celebrate the supreme power of Naam Jaap and Harinama Sankirtana:
"Cheto-darpana-marjanam bhava-maha-davagni-nirvapanam... param vijayate Sri-Krishna-Sankirtanam || 1 ||
Trinad api sunichena taror api sahishnuna, Amanina manadena kirtaniyah sada Harih || 3 ||"`,
      Hindi: `श्री चैतन्य महाप्रभु रचित 'श्री शिक्षाष्टकम्' — कलियुग में नाम जाप और हरिनाम संकीर्तन की महिमा:
चेतोदर्पणमार्जनं भवमहादावाग्निनिर्वापणं... परं विजयते श्रीकृष्णसंकीर्तनम् ॥ १ ॥
तृणादपि सुनीचेन तरोरपि सहिष्णुना । अमानिना मानदेन कीर्तनीयः सदा हरिः ॥ ३ ॥`,
      Sanskrit: `तृणादपि सुनीचेन तरोरपि सहिष्णुना ।
अमानिना मानदेन कीर्तनीयः सदा हरिः ॥ ३ ॥`
    }
  }
];

INITIAL_SACRED_ITEMS.push(...EXTRA_SEO_SACRED_ITEMS);



export const ADDITIONAL_14_SEO_ITEMS = [
  {
    id: 'shri-durga-chalisa-complete',
    title: 'Shri Durga Chalisa (Namo Namo Durge Sukh Karani): Complete 40 Verses with Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Shri Durga Chalisa',
    contentType: 'All',
    pdfFileName: 'Shri-Durga-Chalisa-Complete-40-Verses.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=012oY38Blvg',
    description: 'Read and chant the complete 40 verses of Shri Durga Chalisa (Namo Namo Durge Sukh Karani) in Hindi and English with full devotional meaning, invoking Goddess Adi Shakti Jagadamba.',
    views: 42150,
    likes: 14820,
    language: 'Hindi',
    author: 'Shakta Devotional Tradition',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Idol_of_Goddess_Durga_(Ceremonial_Worship)_31.jpg?width=900',
    tags: ['durga-chalisa', 'namo-namo-durge', 'navaratri', 'maa-durga', 'shakti', 'pdf', 'video'],
    body: {
      English: `Shri Durga Chalisa is the beloved forty-verse hymn in praise of Mother Adi Shakti Durga, recited daily and especially during Chaitra and Shardiya Navaratri for courage, protection, and family harmony.

Key Stanzas (Transliteration & Meaning):
1. Namo Namo Durge sukh karani, Namo Namo Ambe dukh harani |
   Nirakar hai jyoti tumhari, Tihun lok phaili ujiyari || (1–2)
   (Salutations again and again to You, O Goddess Durga, Bestower of happiness! Salutations to You, O Mother Amba, Remover of all sorrow! Your divine light is infinite and illuminates all three worlds!)

2. Shashi lalat mukh maha vishala, Netra lal bhrikuti vikrala |
   Roop Matu ko adhika suhave, Darash karat jan ati sukh pave || (3–4)
   (Your forehead shines like the Moon, Your countenance is vast and radiant, and beholding Your auspicious form fills devotees with supreme bliss.)

3. Tum sansar shakti laya kina, Palan hetu anna dhan dina |
   Annapurna hui jag pala, Tumhi Adi Sundari Bala || (5–6)
   (All power in the universe flows from You; as Mother Annapurna You nourish creation with food and prosperity; You are Adi Shakti and Bala Tripurasundari!)

4. Pralayakal sab nashan hari, Tum Gauri Shiv Shankar pyari |
   Shiv Yogi tumhare gun gavein, Brahma Vishnu tumhein nit dhyavein || (7–8)

5. Rup Saraswati ko tum dhara, De subuddhi rishi munin ubara |
   Dharayo roop Narasimha ko Amba, Pragat bhayin phar kar khamba |
   Raksha kari Prahlad bachayo, Hiranyaksh ko swarga pathayo || (9–11)

6. Lakshmi roop dharo jag mahin, Shree Narayan anga samahin |
   Kshirasindhu mein karat vilasa, Dayasindhu dijey man aasa || (12–13)
   Hingalaj mein tumhin Bhavani, Mahima amit na jat bakhani |
   Matangi Dhumavati Mata, Bhuvaneshwari Bagala sukhdata || (14–15)
   Shree Bhairav Tara jag tarini, Chhinnabhal bhav dukh nivarini || (16)

7. Closing Phalashruti:
   "Shumbh Nishumbh danav tum mare, Raktabija shankhan samhare |
    Mahishasur nrip ati abhimani, जेहि (Jehi) agh bhar mahi akulani ||
    Sab par kripa karahu जगदम्बा (Jagadamba), Namo Namo Durge Sukh Karani!"`,
      Hindi: `माँ आदिशक्ति जगदम्बा की कृपा, सुरक्षा और सुख-समृद्धि प्रदान करने वाली 'श्री दुर्गा चालीसा' का सम्पूर्ण प्रमुख पाठ:

नमो नमो दुर्गे सुख करनी । नमो नमो अम्बे दुःख हरनी ॥ १ ॥
निराकार है ज्योति तुम्हारी । तिहूँ लोक फैली उजियारी ॥ २ ॥
शशि ललाट मुख महाविशाला । नेत्र लाल भृकुटी विकराला ॥ ३ ॥
रूप मातु को अधिक सुहावे । दरश करत जन अति सुख पावे ॥ ४ ॥
तुम संसार शक्ति लय कीना । पालन हेतु अन्न धन दीना ॥ ५ ॥
अन्नपूर्णा हुई जग पाला । तुम ही आदि सुन्दरी बाला ॥ ६ ॥
प्रलयकाल सब नाशन हारी । तुम गौरी शिवशंकर प्यारी ॥ ७ ॥
शिव योगी तुम्हरे गुण गावें । ब्रह्मा विष्णु तुम्हें नित ध्यावें ॥ ८ ॥
रूप सरस्वती को तुम धारा । दे सुबुद्धि ऋषि-मुनिन उबारा ॥ ९ ॥
धरयो रूप नरसिंह को अम्बा । परगट भईं फाड़कर खम्बा ॥ १० ॥
रक्षा करि प्रह्लाद बचायो । हिरण्याक्ष को स्वर्ग पठायो ॥ ११ ॥
लक्ष्मी रूप धरो जग माहीं । श्री नारायण अंग समाहीं ॥ १२ ॥
क्षीरसिन्धु में करत विलासा । दयासिन्धु दीजै मन आसा ॥ १३ ॥
हिंगलाज में तुम्हीं भवानी । महिमा अमित न जात बखानी ॥ १४ ॥
मातंगी अरु धूमावति माता । भुवनेश्वरी बगला सुखदाता ॥ १५ ॥
श्री भैरव तारा जग तारिणी । छिन्नभाल भव दुःख निवारिणी ॥ १६ ॥
केहरि वाहन सोह भवानी । लांगुर वीर चलत अगवानी ॥ १७ ॥
कर में खप्पर खड्ग विराजे । जाको देख काल डर भाजे ॥ १८ ॥
सोहे अस्त्र और त्रिशूला । जाते उठत शत्रु हिय शूला ॥ १९ ॥
नगरकोट में तुम्हीं विराजत । तिहुँलोक में डंका बाजत ॥ २० ॥
शुम्भ निशुम्भ दानव तुम मारे । रक्तबीज शंखन संहारे ॥ २१ ॥
महिषासुर नृप अति अभिमानी । जेहि अघ भार मही अकुलानी ॥ २२ ॥
रूप कराल कालिका धारा । सेन सहित तुम तिहि संहारा ॥ २३ ॥
परी गाढ़ सन्तन पर जब-जब । भई सहाय मातु तुम तब-तब ॥ २४ ॥
अमरपुरी अरु बासव लोका । तब महिमा सब रहें अशोका ॥ २५ ॥
ज्वाला में है ज्योति तुम्हारी । तुम्हें सदा पूजें नर-नारी ॥ २६ ॥
प्रेम भक्ति से जो यश गावें । दुःख दारिद्र निकट नहिं आवें ॥ २७ ॥
ध्यावे तुम्हें जो नर मन लाई । जन्म-मरण ताकौ छुटि जाई ॥ २८ ॥
जोगी सुर मुनि कहत पुकारी । योग न हो बिन शक्ति तुम्हारी ॥ २९ ॥
शंकर आचारज तप कीनो । काम अरु क्रोध जीति सब लीनो ॥ ३० ॥
निशिदिन ध्यान धरो शंकर को । काहु काल नहिं सुमिरो तुमको ॥ ३१ ॥
शक्ति रूप का मरम न पायो । शक्ति गई तब मन पछतायो ॥ ३२ ॥
शरणागत हुई कीर्ति बखानी । जय जय जय जगदम्ब भवानी ॥ ३३ ॥
भई प्रसन्न आदि जगदम्बा । दई शक्ति नहिं कीन विलम्बा ॥ ३४ ॥
मोको मातु कष्ट अति घेरो । तुम बिन कौन हरै दुःख मेरो ॥ ३५ ॥
आशा तृष्णा निपट सतावें । रिपु मुरख मोहि अति डरपावें ॥ ३६ ॥
शत्रु नाश कीजै महारानी । सुमिरौं इकचित तुम्हें भवानी ॥ ३७ ॥
करो कृपा हे मातु दयाला । ऋद्धि-सिद्धि दै करहु निहाला ॥ ३८ ॥
जब लगि जिऊँ दया फल पाऊँ । तुम्हरो यश मैं सदा सुनाऊँ ॥ ३९ ॥
श्री दुर्गा चालीसा जो कोई गावै । सब सुख भोग परमपद पावै ॥ ४० ॥`,
      Sanskrit: `सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥ १ ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता ।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ २ ॥`
    }
  },
  {
    id: 'shri-shiv-chalisa-complete',
    title: 'Shri Shiv Chalisa (Jai Girija Pati Din Dayala): Complete 40 Verses & Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Shri Shiv Chalisa',
    contentType: 'All',
    pdfFileName: 'Shri-Shiv-Chalisa-Complete.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=lUTHR0n6J0w',
    description: 'Read and chant the complete Shri Shiv Chalisa (Jai Girija Pati Din Dayala) from the Shiva Purana tradition for peace, protection, and the grace of Lord Bholenath.',
    views: 39400,
    likes: 13640,
    language: 'Hindi',
    author: 'Ayodhya Das (Shiva Purana Tradition)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
    tags: ['shiv-chalisa', 'bholenath', 'mahadev', 'shiva', 'shravan', 'pdf', 'video'],
    body: {
      English: `Shri Shiv Chalisa is the revered forty-verse devotional hymn to Lord Sadashiva (Bholenath), recited on Mondays, Pradosh Vrat, Shravan Maas, and Maha Shivaratri.

Opening Doha & Key Chaupais:
• Doha:
  "Jai Ganesh Girija Suvan, Mangal Mul Sujan |
   Kahat Ayodhyadas tum, Dehu Abhay Vardaan ||"
• Chaupais:
  "Jai Girija Pati Din Dayala, Sada karat santan pratipala |
   Bhal chandrama sohat nike, Kanan kundal nagaphani ke ||
   Anga gaur shir Ganga bahaye, Mundamal tan chhar lagaye |
   Vastra khal bagambar sohe, Chhavi ko dekh nag muni mohe ||
   Maina Matu ki hve dulari, Bam anga sohat छवि (chhavi) nyari |
   Kar trishul sohat chhavi bhari, Karat sada shatrun kshayakari ||
   Nandi Ganesh sohai tahan kaise, Sagar madhya kamal hain jaise |
   Kartik Shyam aur Ganarau, Ya chhavi ko kahi jor na kau ||
   Devan jabahi jaya pukara, Tabahi dukh Prabhu aap nivara |
   Kiya upadrav Tarak bhari, Devan sab mili tumहिं (tumhin) juhari ||
   Turat Shadanan aap pathayau, Lavanimesh mahin mari girayau |
   Aap Jalandhar asur samhara, Suyash tumhar vidit sansara ||
   Tripurasur san yuddha machai, Sabhi kripa kar linh bachai |
   Kiya tapah Bhagirath bhari, Purab pratigya tasu पुरारी (Purari) ||"`,
      Hindi: `भगवान आशुतोष भोलेनाथ की कृपा प्राप्त करने हेतु 'श्री शिव चालीसा' का पावन पाठ:

॥ दोहा ॥
जय गणेश गिरिजा सुवन, मंगल मूल सुजान । कहत अयोध्यादास तुम, देहु अभय वरदान ॥

॥ चौपाई ॥
जय गिरिजा पति दीन दयाला । सदा करत सन्तन प्रतिपाला ॥ १ ॥
भाल चन्द्रमा सोहत नीके । कानन कुण्डल नागफनी के ॥ २ ॥
अंग गौर शिर गंग बहाये । मुण्डमाल तन क्षार लगाये ॥ ३ ॥
वस्त्र खाल बाघम्बर सोहे । छवि को देख नाग मुनि मोहे ॥ ४ ॥
मैना मातु की हवे दुलारी । बाम अंग सोहत छवि न्यारी ॥ ५ ॥
कर त्रिशूल सोहत छवि भारी । करत सदा शत्रुन क्षयकारी ॥ ६ ॥
नन्दि गणेश सोहै तहँ कैसे । सागर मध्य कमल हैं जैसे ॥ ७ ॥
कार्तिक श्याम और गणराऊ । या छवि को कहि जात न काऊ ॥ ८ ॥
देवन जबहीं जाय पुकारा । तब ही दुख प्रभु आप निवारा ॥ ९ ॥
किया उपद्रव तारक भारी । देवन सब मिलि तुमहिं जुहारी ॥ १० ॥
तुरत षडानन आप पठायउ । लवनिमेष महँ मारि गिरायउ ॥ ११ ॥
आप जलंधर असुर संहारा । सुयश तुम्हार विदित संसारा ॥ १२ ॥
त्रिपुरासुर सन युद्ध मचाई । सबहिं कृपा कर लीन बचाई ॥ १३ ॥
किया तपहिं भागीरथ भारी । पुरब प्रतिज्ञा तासु पुरारी ॥ १४ ॥
दानिन महँ तुम सम कोउ नाहीं । सेवक अस्तुति करत सदाहीं ॥ १५ ॥
वेद माहि महिमा तव गाई । अकथ अनादि भेद नहिं पाई ॥ १६ ॥`,
      Sanskrit: `कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् ।
सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥`
    }
  },
  {
    id: 'sri-suktam-rigveda-lakshmi',
    title: 'Sri Suktam (Hiranyavarnam Harinim): The 16 Rigvedic Mantras of Goddess Mahalakshmi',
    category: 'Vedas',
    sanskritBadge: 'वेद · Rigveda Khila Sukta',
    contentType: 'All',
    pdfFileName: 'Sri-Suktam-Rigveda-16-Mantras.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=sx8WM-IB3Y0',
    description: 'Read the complete Sri Suktam (Hiranyavarnam Harinim Suvarnarajatasrajam) from the Rigveda Khilani — the supreme Vedic hymn invoking Goddess Sri Mahalakshmi for spiritual and material abundance.',
    views: 31200,
    likes: 10840,
    language: 'Sanskrit',
    author: 'Rishi Ananda, Kardama & Chiklita (Rigveda Khila)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diwali_Patrikas.jpg?width=900',
    tags: ['sri-suktam', 'hiranyavarnam', 'rigveda', 'mahalakshmi', 'abundance', 'vedas', 'pdf', 'video'],
    body: {
      English: `Found in the Khilani (appendices) of the Fifth Mandala of the Rigveda, the Sri Suktam (15/16 main Richas plus Phalashruti) is the oldest and most authoritative Vedic hymn addressed to Goddess Sri (Mahalakshmi), invoking the Sacred Fire (Jataveda Agni) to bring pure auspiciousness, wisdom, nourishment, and freedom from Alakshmi (poverty, laziness, and discord).

Key Rigvedic Richas & Meaning:
1. "Om Hiranyavarnam harinim suvarnarajatasrajam |
    Chandram hiranmayim Lakshmim Jatavedo ma avaha || 1 ||"
   (O Omniscient Agni Jataveda! Invoke for me Goddess Lakshmi, who shines with a golden hue, who removes all sins and sorrows, who is adorned with garlands of gold and silver, and who is cooling and radiant like the full moon!)
2. "Tam ma avaha Jatavedo Lakshmim anapagaminim |
    Yasyam hiranyam vindeyam gam ashvam purushan aham || 2 ||"
   (O Jataveda! Invoke for me that unfailing, ever-abiding Lakshmi, blessed by whom I shall attain spiritual and righteous wealth, cattle, vigour, and noble companions!)
3. "Kshutpipasamalam jyeshtham Alakshmir nashayamyaham |
    Abhutim asavriddhim cha sarvan nirnuda me grihat || 8 ||"
   (By Her grace I banish hunger, thirst, impurity, and Alakshmi; O Mother, drive away all scarcity and stagnation from my home and heart!)`,
      Hindi: `ऋग्वेद के खिल-सूक्त के अंतर्गत १६ ऋचाओं वाला 'श्रीसूक्तम्' भगवती महालक्ष्मी की आराधना का प्राचीनतम और सर्वोच्च वैदिक मन्त्र-स्तव है। दीपावली, शुक्रवार और नित्य पूजा में इसके पाठ से दरिद्रता और अलक्ष्मी का नाश होकर स्थायी श्री, विद्या और सौभाग्य की प्राप्ति होती है।

॥ श्रीसूक्तम् (प्रमुख वैदिक ऋचाएँ एवं भावार्थ) ॥
ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् । चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥ १ ॥
तां म आवह जातवेदो लक्ष्मीमनपगामिनीम् । यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥ २ ॥
अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम् । श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम् ॥ ३ ॥
कांसोस्मितां हिरण्यप्राकारामार्द्रां ज्वलन्तीं तृप्तां तर्पयन्तीम् । पद्मे स्थितां पद्मवर्णां तामिहोपह्वये श्रियम् ॥ ४ ॥
चन्द्रां प्रभासां यशसा ज्वलन्तीं श्रियं लोके देवजुष्टामुदाराम् । तां पद्मिनीमीं शरणमहं प्रपद्येऽलक्ष्मीर्मे नश्यतां त्वां वृणे ॥ ५ ॥`,
      Sanskrit: `ॐ हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् ।
चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥ १ ॥
तां म आवह जातवेदो लक्ष्मीमनपगामिनीम् ।
यस्यां हिरण्यं विन्देयं गामश्वं पुरुषानहम् ॥ २ ॥
अश्वपूर्वां रथमध्यां हस्तिनादप्रबोधिनीम् ।
श्रियं देवीमुपह्वये श्रीर्मा देवी जुषताम् ॥ ३ ॥`
    }
  },
  {
    id: 'isha-upanishad-complete-18-mantras',
    title: 'Isha Upanishad (Ishavasyam Idam Sarvam): Complete 18 Mantras & Meaning',
    category: 'Upanishads',
    sanskritBadge: 'उपनिषद् · Shukla Yajurveda Ch. 40',
    contentType: 'All',
    pdfFileName: 'Isha-Upanishad-Complete-18-Mantras.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=6KXOkvLS-zk',
    description: 'Read the complete Isha Upanishad (Ishavasya Upanishad) — the 40th chapter of the Shukla Yajurveda Samhita and the first of the 10 Principal Upanishads, opening with "Purnamadah Purnamidam" and "Ishavasyam Idam Sarvam".',
    views: 27840,
    likes: 9420,
    language: 'Sanskrit',
    author: 'Shukla Yajurveda (Kanva & Madhyandina Shakha)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rigveda_MS2097.jpg?width=900',
    tags: ['isha-upanishad', 'ishavasyam', 'purnamadah', 'yajurveda', 'upanishads', 'pdf', 'video'],
    body: {
      English: `Standing first among all Upanishads and embedded directly as the 40th chapter of the Vajasaneyi Samhita of the Shukla Yajurveda, the Isha Upanishad (18 Mantras) bridges sacred action in the world with non-dual realization of the Supreme Self.

Shanti Mantra & Key Mantras:
• Shanti Mantra:
  "Om Purnamadah Purnamidam Purnat Purnamudachyate |
   Purnasya Purnamadaya Purnamevavashishyate ||"
  (That transcendent Brahman is Full/Infinite; this visible universe is also Full. From the Infinite alone does the Infinite come forth; even when the Infinite is drawn from the Infinite, the Infinite alone remains!)

• Mantra 1 (The Golden Key of Renunciation in Enjoyment):
  "Ishavasyam idam sarvam yat kincha jagatyam jagat |
   Tena tyaktena bhunjitha ma gridhah कस्यस्विद्धनम् (kasyasvid dhanam) || 1 ||"
  (Everything moving and unmoving in this entire cosmos is indwelt and enveloped by the Supreme Lord [Isha]. Therefore, nourish yourself through detachment and grateful sharing; covet not anyone's wealth!)

• Mantras 6–7 (Unity of All Beings — Overcoming Delusion & Grief):
  "Yastu sarvani bhutani atmanyevanupashyati |
   Sarvabhuteshu chatmanam tato na vijugupsate || 6 ||
   Yasmin sarvani bhutani atmaivabhud vijanatah |
   Tatra ko mohah kah shokah ekatvam anupashyatah || 7 ||"
  (Whoever beholds all beings within the Self, and the Self within all beings, never turns away in hatred from anyone. For the sage who perceives this oneness everywhere, what delusion or sorrow can ever remain?)

• Mantra 15 (Prayer to Unveil the Golden Disc of Truth):
  "Hiranmayena patrena satyasyapihitam mukham |
   Tat tvam Pushann apavrinu satya-dharmaya drishtaye || 15 ||"
  (The face of Ultimate Truth is veiled by a dazzling golden disc; O Nourishing Sun [Pushan], unveil it so that I, devoted to Truth-Dharma, may behold the Imperishable Reality!)`,
      Hindi: `शुक्ल यजुर्वेद की वाजसनेयी संहिता का ४०वाँ अध्याय 'ईशावास्योपनिषद्' (१८ मन्त्र) दसोपनिषदों में प्रथम स्थान रखता है। महात्मा गाँधी ने इसके प्रथम मन्त्र को सम्पूर्ण हिन्दू धर्म का सार कहा था।

॥ शान्तिपाठ एवं प्रमुख मन्त्र ॥
ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते । पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥

ईशावास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥ १ ॥
भावार्थ: इस गतिशील ब्रह्माण्ड में जो कुछ भी जड़-चेतन जगत है, वह सब ईश्वर से व्याप्त है। अतः त्यागभाव (अनासक्ति) से इसका भोग और रक्षण करो; किसी के धन का लोभ मत करो।

यस्तु सर्वाणि भूतान्यात्मन्येवानुपश्यति । सर्वभूतेषु चात्मानं ततो न विजुगुप्सते ॥ ६ ॥
यस्मिन्सर्वाणि भूतान्यात्मैवाभूद्विजानतः । तत्र को मोहः कः शोक एकत्वमनुपश्यतः ॥ ७ ॥
भावार्थ: जो साधक सम्पूर्ण प्राणियों को अपने आत्मा में ही देखता है और समस्त प्राणियों में अपनी आत्मा को देखता है, वह किसी से घृणा नहीं करता। सर्वत्र एकत्व देखने वाले उस ज्ञानी के लिए फिर कौन-सा मोह और कौन-सा शोक रह सकता है!

हिरण्मयेन पात्रेण सत्यस्यापिहितं मुखम् । तत्त्वं पूषन्नपावृणु सत्यधर्माय दृष्टये ॥ १५ ॥`,
      Sanskrit: `ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।
पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥

ईशावास्यमिदँ सर्वं यत्किञ्च जगत्यां जगत् ।
तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥ १ ॥
कुर्वन्नेवेह कर्माणि जिजीविषेच्छतँ समाः ।
एवं त्वयि नान्यथेतोऽस्ति न कर्म लिप्यते नरे ॥ २ ॥`
    }
  },
  {
    id: 'bhagavad-gita-ch12-bhakti-yoga',
    title: 'Bhagavad Gita Chapter 12 (Bhakti Yoga): All 20 Shlokas on the Devotee Dear to God',
    category: 'Bhagavad Gita',
    sanskritBadge: 'गीता · Adhyaya 12 (Bhakti Yoga)',
    contentType: 'All',
    pdfFileName: 'Bhagavad-Gita-Chapter-12-Bhakti-Yoga.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=3WrImrl2dmI',
    description: 'Read Chapter 12 (Bhakti Yoga) of the Shrimad Bhagavad Gita — where Bhagavan Sri Krishna reveals the ladder of devotion and the 35 divine qualities of the devotee who is supremely dear to Him ("Adveshta sarva-bhutanam").',
    views: 33400,
    likes: 11490,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa (Spoken by Bhagavan Sri Krishna)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bhagvad_Gita.jpg?width=900',
    tags: ['bhakti-yoga', 'bhagavad-gita-chapter-12', 'adveshta-sarva-bhutanam', 'krishna', 'pdf', 'video'],
    body: {
      English: `In the Twelfth Chapter of the Bhagavad Gita (Bhakti Yoga — 20 Verses), Arjuna asks whether those who worship the personal Lord with loving devotion or those who meditate upon the unmanifest Imperishable Brahman are superior in Yoga. Bhagavan Sri Krishna answers that while both reach Him, the path of loving devotion is the most natural and swift—and in Verses 13–20 (the Amrita-Ashtakam or Eight Nectar Verses), He describes the character of the devotee who is supremely dear to Him:

Key Verses (12.13–15):
• "Adveshta sarva-bhutanam maitrah karuna eva cha |
   Nirmamo nirahankarah sama-duhkha-sukhah kshami || 13 ||
   Santushtah satatam yogi yatatma dridha-nishchayah |
   Mayyarpita-mano-buddhir yo mad-bhaktah sa me priyah || 14 ||"
  Meaning: One who bears no ill-will toward any living being, who is friendly and compassionate to all, free from possessiveness ('mine-ness') and egoism, balanced in pain and pleasure, ever-forgiving, ever-contented, self-controlled, firm in conviction, and whose mind and intellect are offered unto Me—such a devotee is exceedingly dear to Me!
• "Yasmanno dvijate loko lokanno dvijate cha yah |
   Harshamarsha-bhayodvegair mukto yah sa cha me priyah || 15 ||"
  Meaning: One by whom the world is never agitated and who is never agitated by the world, freed from elation, envy, fear, and anxiety—that person is dear to Me!`,
      Hindi: `श्रीमद्भगवद्गीता के बारहवें अध्याय ('भक्तियोग' — २० श्लोक) के अंतिम ८ श्लोकों (१२.१३–२०) को भगवान श्रीकृष्ण ने 'धर्म्यामृतम्' (धर्ममय अमृत) कहा है, जिनमें भगवान के परम प्रिय भक्त के ३५ दिव्य लक्षण बताए गए हैं:

अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च । निर्ममो निरहंकारः समदुःखसुखः क्षमी ॥ १३ ॥
सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः । मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥ १४ ॥
यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः । हर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥ १५ ॥
भावार्थ: जो किसी भी प्राणी से द्वेष नहीं करता, सबका मित्र और करुणावान है, ममता और अहंकार से रहित है, सुख-दुःख में सम और क्षमाशील है, निरंतर संतुष्ट रहता है तथा जिसका मन और बुद्धि मुझमें अर्पित है—वह भक्त मुझे अत्यंत प्रिय है!`,
      Sanskrit: `अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।
निर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥ १२.१३ ॥
सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः ।
मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥ १२.१४ ॥
यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः ।
हर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ॥ १२.१५ ॥`
    }
  },
  {
    id: 'ram-raksha-stotram-budhakoushika',
    title: 'Sri Rama Raksha Stotram: Rishi Budhakoushika Armour of Protection',
    category: 'Ramayana',
    sanskritBadge: 'रामायण · Rama Raksha Stotram',
    contentType: 'All',
    pdfFileName: 'Sri-Rama-Raksha-Stotram-Complete.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=3WrImrl2dmI',
    description: 'Read the auspicious Sri Rama Raksha Stotram revealed by Lord Shiva in a dream to Sage Budhakoushika — the protective spiritual armour (Kavacha) of Lord Sri Rama.',
    views: 29120,
    likes: 9910,
    language: 'Sanskrit',
    author: 'Rishi Budhakoushika',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rama,_Sita,_Lakshmana_and_Hanuman_in_the_forest..jpg?width=900',
    tags: ['ram-raksha-stotram', 'rama', 'hanuman', 'kavacha', 'ramayana', 'pdf', 'video'],
    body: {
      English: `Revealed by Lord Sadashiva in a night vision to Maharshi Budhakoushika and written down at dawn, the Sri Rama Raksha Stotram (38 verses) serves as an impenetrable spiritual shield (Vajra-Panjara Kavacha) protecting every limb of the body and mind through the holy names of Lord Sri Rama.

Key Shlokas & Meaning:
1. "Charitam Raghunathasya shatakoti-pravistaram |
    Ekaikam aksharam pumsam mahapataka-nashanam || 1 ||"
   (The sacred life-chronicle of Lord Raghunatha spans a hundred crore verses; every single syllable of it destroys the greatest sins of humanity!)
2. "Ramaya Ramabhadraya Ramachandraya Vedhase |
    Raghunathaya Nathaya Sitayah pataye namah || 29 ||"
3. "Manojavam marutatulyavegam jitendriyam buddhimatam varishtham |
    Vatatmajam vanarayuthamukhyam Shriramadutam sharanam prapadye || 33 ||"
   (I take refuge in Sri Hanuman, the messenger of Lord Rama, who is swift as the mind and the wind, master of the senses, foremost among the wise, son of Vayu, and leader of the Vanara hosts!)`,
      Hindi: `भगवान सदाशिव द्वारा स्वप्न में महर्षि बुधकौशिक को उपदिष्ट 'श्रीरामरक्षास्तोत्रम्' अमोघ आध्यात्मिक सुरक्षा-कवच ('वज्रपंजर') है:

चरितं रघुनाथस्य शतकोटिप्रविस्तरम् । एकैकमक्षरं पुंसां महापातकनाशनम् ॥ १ ॥
रामाय रामभद्राय रामचन्द्राय वेधसे । रघुनाथाय नाथाय सीतायाः पतये नमः ॥ २९ ॥
मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥ ३३ ॥
रामेति रामभद्रेति रामचन्द्रेति वा स्मरन् । नरो न लिप्यते पापैर्भुक्तिं मुक्तिं च विन्दति ॥ ३८ ॥`,
      Sanskrit: `चरितं रघुनाथस्य शतकोटिप्रविस्तरम् ।
एकैकमक्षरं पुंसां महापातकनाशनम् ॥ १ ॥
रामाय रामभद्राय रामचन्द्राय वेधसे ।
रघुनाथाय नाथाय सीतायाः पतये नमः ॥ २९ ॥
मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् ।
वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥ ३३ ॥`
    }
  },
  {
    id: 'madhurashtakam-vallabhacharya-krishna',
    title: 'Madhurashtakam (Adharam Madhuram) & Bhishma Stuti: The Sweetness of Sri Krishna',
    category: 'Mahabharata',
    sanskritBadge: 'महाभारत · Krishna Stuti',
    contentType: 'All',
    pdfFileName: 'Madhurashtakam-Vallabhacharya-Complete.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=kCH1Ib4iy1w',
    description: 'Read all 8 verses of Sri Vallabhacharya Madhurashtakam ("Adharam Madhuram Vadanam Madhuram... Madhuradhipater Akhalam Madhuram") celebrating the all-sweet divine form of Lord Sri Krishna.',
    views: 34800,
    likes: 12190,
    language: 'Sanskrit',
    author: 'Mahaprabhu Sri Vallabhacharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_and_Krishna_at_the_Kurukshetra_Mahabharata_war,_Gita.jpg?width=900',
    tags: ['madhurashtakam', 'adharam-madhuram', 'krishna', 'vallabhacharya', 'bhakti', 'pdf', 'video'],
    body: {
      English: `Composed by Mahaprabhu Sri Vallabhacharya (1479–1531 CE), founder of the Pushtimarga (Shuddhadvaita) tradition, the Madhurashtakam (8 verses) celebrates how everything associated with Bhagavan Sri Krishna—the Lord of Sweetness (Madhuradhipati)—is supremely sweet and auspicious:

Complete Verses 1–3:
1. "Adharam madhuram vadanam madhuram, Nayanam madhuram hasitam madhuram |
    Hridayam madhuram gamanam madhuram, Madhuradhipater akhilam madhuram || 1 ||"
   (His lips are sweet, His face is sweet, His eyes are sweet, His smile is sweet; His compassionate heart is sweet, His gait is sweet—everything about the Lord of Sweetness is altogether sweet!)
2. "Vachanam madhuram charitam madhuram, Vasanam madhuram valitam madhuram |
    Chalitam madhuram bhramitam madhuram, Madhuradhipater akhilam madhuram || 2 ||"
3. "Venur madhuro renur madhurah, Panir madhurah padau madhurau |
    Nrityam madhuram sakhyam madhuram, Madhuradhipater akhilam madhuram || 3 ||"
   (His flute is sweet, the dust of His lotus feet is sweet, His hands and feet are sweet, His dance and friendship are sweet—everything about the Lord of Sweetness is altogether sweet!)`,
      Hindi: `महाप्रभु श्री वल्लभाचार्य विरचित 'मधुराष्टकम्' भगवान श्रीकृष्ण के मधुर स्वरूप का अमर गान है:

अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम् ।
हृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ १ ॥
वचनं मधुरं चरितं मधुरं वसनं मधुरं वलितं मधुरम् ।
चलितं मधुरं भ्रमितं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ २ ॥
वेणुर्मधुरो रेणुर्मधुरः पाणिर्मधुरः पादौ मधुरौ ।
नृत्यं मधुरं सख्यं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ ३ ॥
गीतं मधुरं पीतं मधुरं भुक्तं मधुरं सुप्तं मधुरम् ।
रूपं मधुरं तिलकं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ ४ ॥`,
      Sanskrit: `अधरं मधुरं वदनं मधुरं नयनं मधुरं हसितं मधुरम् ।
हृदयं मधुरं गमनं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ १ ॥
वेणुर्मधुरो रेणुर्मधुरः पाणिर्मधुरः पादौ मधुरौ ।
नृत्यं मधुरं सख्यं मधुरं मधुराधिपतेरखिलं मधुरम् ॥ ३ ॥`
    }
  },
  {
    id: 'devi-mahatmyam-durga-saptashati-argala',
    title: 'Devi Mahatmyam (Durga Saptashati): Argala Stotram & Ya Devi Sarvabhuteshu',
    category: 'Puranas',
    sanskritBadge: 'पुराण · Markandeya Purana',
    contentType: 'All',
    pdfFileName: 'Devi-Mahatmyam-Durga-Saptashati-Stotrams.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=012oY38Blvg',
    description: 'Explore the 700 verses of the Devi Mahatmyam (Durga Saptashati / Chandi Patha) from the Markandeya Purana — including the Argala Stotram ("Rupam Dehi Jayam Dehi Yasho Dehi Dvisho Jahi") and Tantrokta Devi Suktam ("Ya Devi Sarvabhuteshu").',
    views: 30420,
    likes: 10410,
    language: 'Sanskrit',
    author: 'Maharshi Markandeya (Markandeya Mahapurana)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/A_mythological_play_Maa_Durga.jpg?width=900',
    tags: ['durga-saptashati', 'devi-mahatmyam', 'ya-devi-sarvabhuteshu', 'argala-stotram', 'chandi-path', 'pdf', 'video'],
    body: {
      English: `Embedded within Chapters 81–93 of the Markandeya Purana, the Devi Mahatmyam (also known as Sri Durga Saptashati or Chandi Patha, consisting of 700 mantras across 13 chapters and 3 Charitas: Mahakali, Mahalakshmi, and Mahasaraswati) is the central scripture of Shakta Dharma.

1. Argala Stotram Prayer:
"Jayanti Mangala Kali Bhadrakali Kapalini |
 Durga Kshama Shiva Dhatri Swaha Swadha namo'stu te ||
 Dehi saubhagyam arogyam dehi me paramam sukham |
 Rupam dehi jayam dehi yasho dehi dvisho jahi ||"
(Grant me auspiciousness, health, and supreme bliss; grant me spiritual radiance, grant me victory, grant me noble renown, and vanquish my inner enemies of lust, anger, and greed!)

2. Tantrokta Devi Suktam (Chapter 5 — Aparajita Stuti):
"Ya Devi sarvabhuteshu Shakti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||
 Ya Devi sarvabhuteshu Matri-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||
 Ya Devi sarvabhuteshu Buddhi-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||
 Ya Devi sarvabhuteshu Shanti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||"`,
      Hindi: `मार्कण्डेय पुराण के अंतर्गत १३ अध्यायों और ७०० मन्त्रों वाली 'श्रीदुर्गासप्तशती' (देवी माहात्म्य / चण्डी पाठ) में महाकाली, महालक्ष्मी और महासरस्वती के दिव्य चरित्रों का वर्णन है।

१. अर्गला स्तोत्रम् का प्रसिद्ध प्रार्थना-मन्त्र:
जयन्ती मङ्गला काली भद्रकाली कपालिनी । दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥
देहि सौभाग्यमारोग्यं देहि मे परमं सुखम् । रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥

२. तन्त्रोक्त देवीसूक्तम् (अध्याय ५ — अपराजिता स्तुति):
या देवी सर्वभूतेषु चेतनेत्यभिधीयते । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥
या देवी सर्वभूतेषु मातृरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥
या देवी सर्वभूतेषु शान्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥`,
      Sanskrit: `जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥ १ ॥
देहि सौभाग्यमारोग्यं देहि मे परमं सुखम् ।
रूपं देहि जयं देहि यशो देहि द्विषो जहि ॥ २ ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता ।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ ३ ॥`
    }
  }
];

INITIAL_SACRED_ITEMS.push(...ADDITIONAL_14_SEO_ITEMS);

// Ensure EVERY item in INITIAL_SACRED_ITEMS has a pdfUrl and videoUrl so 100% of scriptures support Text + Printable PDF eBook + Sacred Video!
INITIAL_SACRED_ITEMS.forEach((it) => {
  if (!it.pdfUrl) it.pdfUrl = '#auto-pdf';
  if (!it.videoUrl) it.videoUrl = 'https://www.youtube.com/watch?v=sx8WM-IB3Y0';
});


// Attach real copyright-free Wikimedia Commons photos to all 12 Categories and 23 Sacred Items (keeping SVG artwork as fallback)
CATEGORIES.forEach((cat) => {
  cat.fallbackBgImage = cat.bgImage;
  if (COPYRIGHT_FREE_CATEGORY_PHOTOS[cat.id]) {
    cat.bgImage = COPYRIGHT_FREE_CATEGORY_PHOTOS[cat.id];
  }
});

INITIAL_SACRED_ITEMS.forEach((item) => {
  item.fallbackImageUrl = item.imageUrl;
  if (COPYRIGHT_FREE_ITEM_PHOTOS[item.id]) {
    item.imageUrl = COPYRIGHT_FREE_ITEM_PHOTOS[item.id];
  }
});

export const JAAP_MANTRAS = [
  { id: 'om-namah-shivaya', name: 'Om Namah Shivaya', sanskrit: 'ॐ नमः शिवाय', deity: 'Lord Shiva (Panchakshari)', defaultGoal: 108 },
  { id: 'hare-krishna', name: 'Hare Krishna Maha Mantra', sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥', deity: 'Sri Radha-Krishna & Sri Rama', defaultGoal: 108 },
  { id: 'jai-shri-ram', name: 'Shri Ram Jai Ram Jai Jai Ram', sanskrit: 'श्री राम जय राम जय जय राम', deity: 'Maryada Purushottama Sri Rama', defaultGoal: 108 },
  { id: 'gayatri-jaap', name: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', deity: 'Vedamata Gayatri / Savitr', defaultGoal: 108 },
  { id: 'mahamrityunjaya-jaap', name: 'Mahamrityunjaya Mantra', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥', deity: 'Lord Mrityunjaya Shiva', defaultGoal: 108 },
  { id: 'om-namo-bhagavate', name: 'Om Namo Bhagavate Vasudevaya', sanskrit: 'ॐ नमो भगवते वासुदेवाय', deity: 'Bhagavan Vishnu / Krishna (Dvadashakshari)', defaultGoal: 108 },
  { id: 'om-gan-ganapataye', name: 'Om Gam Ganapataye Namah', sanskrit: 'ॐ गं गणपतये नमः', deity: 'Vighnaharta Lord Ganesha', defaultGoal: 108 },
  { id: 'om-aim-hrim-klim', name: 'Navarna Chamunda Mantra', sanskrit: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे', deity: 'Maa Adi-Shakti जगदम्बा', defaultGoal: 108 }
];

export const NAAM_JAAP_SEO_FAQS = [
  {
    q: 'What is the Online 108 Naam Jaap Counter (Naam Jamm Counter / Digital Mala)?',
    a: 'The Sanatan Setu 108 Naam Jaap Counter (also searched as Naam Jamm Counter, Nam Jap Counter, or Online Japa Mala Counter) is a free interactive 108-bead digital Rudraksha and Tulsi mala tool. It tracks your daily mantra chants, completed 108-bead malas, meditation (Dhyana) duration, and lifetime Naam Jaap count with a 528Hz sacred chime.'
  },
  {
    q: 'Which mantras can I chant on the Naam Jaap Counter?',
    a: 'You can chant Radha Naam Jaap, Shri Ram Jai Ram Jai Jai Ram, Hare Krishna Maha Mantra, Om Namah Shivaya, Gayatri Mantra, Mahamrityunjaya Mantra, Om Namo Bhagavate Vasudevaya, Om Gam Ganapataye Namah, or enter your own custom Ishta Devata mantra.'
  },
  {
    q: 'Why are there 108 beads in a Naam Jaap Mala?',
    a: 'In Vedic astronomy and Upanishadic science, 108 represents cosmic harmony: 12 Rashis (zodiac signs) multiplied by 9 Navagrahas (planets) equals 108, and 27 Nakshatras across 4 Padas (directions) equals 108. Completing 108 beads constitutes 1 full Mala.'
  },
  {
    q: 'How are community-uploaded Hindu scriptures verified and indexed on Google?',
    a: 'Every scripture, mantra, temple chronicle, or bhajan uploaded to Sanatan Setu is reviewed by the Admin for scriptural authenticity. Once approved, it is added to the dynamic Schema.org Article structured data, crawlable scripture index, and XML Sitemap for Google Search indexing.'
  }
];

export const SEO_INDEX_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naam Jaap Counter (108 Digital Mala) & Sanatan Setu Hindu Scripture Library</title>
    <meta name="description" content="Free 108-Bead Naam Jaap Counter (Naam Jamm Counter / Online Japa Mala) for Radha Naam, Ram Naam, Hare Krishna & Om Namah Shivaya, plus authentic Hindu Scriptures, Vedas, Upanishads, Puranas, Hanuman Chalisa & Temple Guides." />
    <meta name="keywords" content="naam jaap, naam jaap counter, naam jamm counter, nam jap counter, 108 naam jaap counter online, digital mala counter, radha naam jaap counter, ram naam jaap counter, japa mala online, Sanatan Setu, Hindu Scriptures, Vedas, Upanishads, Bhagavad Gita, Hanuman Chalisa, Jagannath Temple Puri" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Sanatan Setu Library" />
    <meta name="theme-color" content="#EA580C" />
    <link rel="canonical" href="https://sanatansetu.vercel.app/" />
    <!-- Open Graph / Social Sharing -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Sanatan Setu – Naam Jaap Counter & Vedic Library" />
    <meta property="og:title" content="108 Naam Jaap Counter (Digital Mala) & Sanatan Setu Scripture Library" />
    <meta property="og:description" content="Practice daily 108-bead Naam Jaap (Naam Jamm Counter) online with 528Hz chime and read unabridged Sanskrit, Hindi & English Vedas, Upanishads, Puranas, Mantras & Temple Histories." />
    <meta property="og:locale" content="en_IN" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="108 Naam Jaap Counter & Sanatan Setu Hindu Scripture Library" />
    <meta name="twitter:description" content="Free online 108-bead Naam Jaap Counter (Naam Jamm Counter) and authentic multilingual Hindu scripture library." />
  </head>
  <body class="bg-[#FDFBF7] text-[#2C1A12] antialiased selection:bg-orange-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`;

export function playSacredSound(type = 'bead') {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (type === 'bell') {
    try {
      const ctx = new AudioCtx();
      [528, 1056, 1584, 2112].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.14 / (i + 1), ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.2);
      });
    } catch (e) {}
    return;
  }
  try {
    const ctx = new AudioCtx();
    if (type === 'completion') {
      [528, 660, 792, 1056].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.09 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.9);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(264, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    }
  } catch (e) {
    // Ignore audio context autoplay errors
  }
}

// Helper to resolve multilingual body across all 27 Indian & World languages without truncation
export function getBodyForLanguage(item, lang = 'English') {
  if (!item || !item.body) return '';
  if (typeof item.body === 'string') return item.body;
  if (item.body[lang] && item.body[lang].trim()) {
    return item.body[lang];
  }
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
  const eng = item.body.English || '';
  const hin = item.body.Hindi || '';
  const san = item.body.Sanskrit || '';
  if (langMeta && !['English', 'Hindi', 'Sanskrit'].includes(lang)) {
    return `【 ${langMeta.label} · ${langMeta.greeting} 】\n\n` +
      (san ? `॥ मूल संस्कृत पाठ (Original Sanskrit Text) ॥\n${san}\n\n` : '') +
      (hin ? `॥ हिन्दी भावार्थ (Hindi Meaning) ॥\n${hin}\n\n` : '') +
      (eng ? `॥ Complete English Translation & Guide ॥\n${eng}` : '');
  }
  return eng || hin || san || '';
}

export default function App() {
  // 1. Dark Mode State (persisted in localStorage)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('sanatan_setu_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // 2. Navigation & View State
  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLang, setDetailLang] = useState('English');
  const [readerFontSize, setReaderFontSize] = useState('base');
  const [imageFitMode, setImageFitMode] = useState('contain-blur'); // 'contain-blur' (100% full uncropped fit) | 'cover-top' (edge-to-edge fill)
  const [activeShlokaIndex, setActiveShlokaIndex] = useState(0);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [chantParticles, setChantParticles] = useState([]);

  // Custom Category Background Images State (allows uploading real images for any category)
  const [categoryCustomImages, setCategoryCustomImages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_category_images_v1') || '{}');
    } catch {
      return {};
    }
  });

  // 3. Library Items State — Uses v4 storage so real copyright-free Wikimedia Commons photos load immediately while preserving user edits & uploads
  const [items, setItems] = useState(() => {
    const seedIds = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));
    try {
      const savedV6 = localStorage.getItem('sanatan_setu_items_v6');
      if (savedV6) {
        const parsed = JSON.parse(savedV6);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_SACRED_ITEMS.length) {
          return parsed;
        }
      }
      const savedV5 = localStorage.getItem('sanatan_setu_items_v5');
      if (savedV5) {
        const parsed = JSON.parse(savedV5);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_SACRED_ITEMS.length) {
          return parsed;
        }
      }
      const savedV4 = localStorage.getItem('sanatan_setu_items_v4');
      if (savedV4) {
        const parsed = JSON.parse(savedV4);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Migrate any custom user-uploaded items from v3 or v2
      const prevRaw = localStorage.getItem('sanatan_setu_items_v3') || localStorage.getItem('sanatan_setu_items_v2');
      if (prevRaw) {
        const parsedPrev = JSON.parse(prevRaw);
        if (Array.isArray(parsedPrev)) {
          const customItems = parsedPrev.filter((it) => !seedIds.has(String(it.id)));
          return [...customItems, ...INITIAL_SACRED_ITEMS];
        }
      }
    } catch (e) {}
    return INITIAL_SACRED_ITEMS;
  });

  // 4. Filter, Search, Likes, Bookmarks State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [selectedMediaFormat, setSelectedMediaFormat] = useState('All'); // 'All' | 'Text' | 'PDF' | 'Video'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const [likedIds, setLikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_likes') || '[]');
    } catch {
      return [];
    }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_bookmarks') || '[]');
    } catch {
      return [];
    }
  });

  // 5. Upload & Admin Moderation State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('sanatan_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [customAdminPasscode, setCustomAdminPasscode] = useState(() => {
    try {
      return localStorage.getItem('sanatan_admin_custom_passcode') || DEFAULT_ADMIN_PASSCODE;
    } catch {
      return DEFAULT_ADMIN_PASSCODE;
    }
  });
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'published' | 'seo'
  const [editingItem, setEditingItem] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Mantras',
    contentType: 'Text',
    author: '',
    language: 'Sanskrit',
    imageUrl: '',
    pdfUrl: '',
    pdfFileName: '',
    videoUrl: '',
    tags: '',
    bodyEnglish: '',
    bodyHindi: '',
    bodySanskrit: '',
    extraLang: 'Odia',
    bodyExtraLang: '',
    publishDirectlyAsAdmin: false
  });

  // 6. Audio Speech Synthesis State
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 7. 108-Bead Naam Jaap State
  const [selectedMantraId, setSelectedMantraId] = useState(JAAP_MANTRAS[0].id);
  const [customMantraText, setCustomMantraText] = useState('');
  const [isCustomMantra, setIsCustomMantra] = useState(false);
  const [currentCount, setCurrentCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_current') || 0); } catch { return 0; }
  });
  const [lifetimeCount, setLifetimeCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_lifetime') || 1080); } catch { return 1080; }
  });
  const [dailyGoal, setDailyGoal] = useState(108);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [autoJaapActive, setAutoJaapActive] = useState(false);
  const [pulseEffect, setPulseEffect] = useState(false);

  // 8. Contact Form State
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  }, []);

  // Sync Dark Mode with localStorage & Document Root
  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', darkMode);
      }
    } catch (e) {}
  }, [darkMode]);

  // Persist Items, Likes, Bookmarks, and Jaap counts
  useEffect(() => {
    try {
      try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items)); } catch (quotaErr) {}
      SanatanUnlimitedDB.saveItems(items);
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_likes', JSON.stringify(likedIds));
      localStorage.setItem('sanatan_setu_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {}
  }, [likedIds, bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_jaap_current', String(currentCount));
      localStorage.setItem('sanatan_jaap_lifetime', String(lifetimeCount));
    } catch (e) {}
  }, [currentCount, lifetimeCount]);

  // URL Hash Deep-Linking for SEO & Shareable Links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleHash = () => {
      const hash = window.location.hash.replace(/^#\/?/, '');
      if (!hash) return;
      if (hash.startsWith('article/')) {
        const slug = decodeURIComponent(hash.slice('article/'.length));
        const found = items.find((i) => String(i.id) === slug && (i.status === 'approved' || i.isApproved));
        if (found) {
          setSelectedItem(found);
          setDetailLang(found.language || 'English');
        }
      } else if (hash.startsWith('category/')) {
        const cat = decodeURIComponent(hash.slice('category/'.length));
        setSelectedCategory(cat);
        setActiveView('home');
      } else if (['home', 'jaap', 'admin', 'about', 'contact', 'privacy', 'disclaimer'].includes(hash)) {
        setActiveView(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [items]);

  // Separate Approved vs Pending items (moved above seoMetadata so uploaded approved items are indexed in JSON-LD & Sitemap)
  const approvedItems = useMemo(
    () => items.filter((item) => item.status === 'approved' || item.isApproved === true),
    [items]
  );

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending' || item.isApproved === false),
    [items]
  );

  // Dynamic XML Sitemap & robots.txt Generators (automatically includes all approved & uploaded content!)
  const generatedSitemapXml = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://sanatansetu.vercel.app';
    const today = new Date().toISOString().split('T')[0];
    const urls = [
      `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
      `  <url>\n    <loc>${baseUrl}/#jaap</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.95</priority>\n  </url>`
    ];
    CATEGORIES.forEach((c) => {
      urls.push(
        `  <url>\n    <loc>${baseUrl}/#category/${encodeURIComponent(c.id)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`
      );
    });
    approvedItems.forEach((item) => {
      urls.push(
        `  <url>\n    <loc>${baseUrl}/#article/${encodeURIComponent(item.id)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.90</priority>\n  </url>`
      );
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  }, [approvedItems]);

  const generatedRobotsTxt = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://sanatansetu.vercel.app';
    return `User-agent: *\nAllow: /\n\n# Naam Jaap Counter & Sanatan Setu Sitemap\nSitemap: ${baseUrl}/sitemap.xml`;
  }, []);

  // Dynamic SEO Engine: Updates Title, Meta Description, Keywords, Open Graph, Canonical & Multi-Entity JSON-LD Schema
  const seoMetadata = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sanatansetu.vercel.app';
    if (selectedItem) {
      const bodyExcerpt = getBodyForLanguage(selectedItem, 'English').slice(0, 160).replace(/\s+/g, ' ');
      return {
        title: `${selectedItem.title} | ${selectedItem.category} – Sanatan Setu & Naam Jaap`,
        description: selectedItem.description || bodyExcerpt,
        keywords: [...(selectedItem.tags || []), selectedItem.title, selectedItem.category, 'naam jaap', 'naam jaap counter', 'Sanatan Dharma', 'Hindu Scriptures'].join(', '),
        canonical: `${baseUrl}/#article/${selectedItem.id}`,
        type: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: selectedItem.title,
          description: selectedItem.description || bodyExcerpt,
          articleBody: getBodyForLanguage(selectedItem, 'English'),
          articleSection: selectedItem.category,
          inLanguage: ['en', 'hi', 'sa'],
          author: {
            '@type': 'Person',
            name: selectedItem.author || 'Vedic Rishis & Scriptural Tradition'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Sanatan Setu Library'
          },
          mainEntityOfPage: `${baseUrl}/#article/${selectedItem.id}`,
          keywords: (selectedItem.tags || []).join(', ')
        }
      };
    }
    if (activeView === 'jaap') {
      return {
        title: '108 Naam Jaap Counter Online (Naam Jamm Counter & Digital Mala) | Sanatan Setu',
        description: 'Free 108-Bead Naam Jaap Counter (Naam Jamm Counter / Nam Jap Counter / Digital Rudraksha Mala) with 528Hz sacred chime, Dhyana timer, Radha Naam, Ram Naam, Hare Krishna & Om Namah Shivaya.',
        keywords: 'naam jaap, naam jaap counter, naam jamm counter, nam jap counter, 108 naam jaap counter, online mala counter, radha naam jaap counter, ram naam jaap counter, hare krishna counter, digital japa mala',
        canonical: `${baseUrl}/#jaap`,
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'SoftwareApplication',
              name: 'Sanatan Setu 108-Bead Naam Jaap Counter (Naam Jamm Counter)',
              alternateName: ['Naam Jaap Counter', 'Naam Jamm Counter', '108 Digital Mala Counter', 'Nam Jap Counter Online'],
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web Browser (Mobile & Desktop)',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
              description: 'Interactive 108-bead Naam Jaap counter and digital japa mala for daily mantra meditation with 528Hz chime and Dhyana timer.'
            },
            {
              '@type': 'FAQPage',
              mainEntity: NAAM_JAAP_SEO_FAQS.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a }
              }))
            }
          ]
        }
      };
    }
    if (selectedCategory !== 'All') {
      const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
      return {
        title: `${selectedCategory} (${catObj?.sanskrit || ''}) Scriptures & Naam Jaap | Sanatan Setu Library`,
        description: catObj?.description || `Explore authentic ${selectedCategory} texts, verses, and meanings on Sanatan Setu Library.`,
        keywords: `${selectedCategory}, ${catObj?.sanskrit || ''}, naam jaap, naam jaap counter, Sanatan Dharma, Vedic Library`,
        canonical: `${baseUrl}/#category/${encodeURIComponent(selectedCategory)}`,
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: `${selectedCategory} Sacred Library`,
          description: catObj?.description || ''
        }
      };
    }
    return {
      title: 'Naam Jaap Counter (108 Digital Mala) & Sanatan Setu Hindu Scripture Library',
      description: 'Practice daily 108-Bead Naam Jaap Counter (Naam Jamm Counter / Online Japa Mala) and read authentic, admin-verified Hindu scriptures in Sanskrit, Hindi & English: Vedas, Upanishads, Puranas, Gita, Hanuman Chalisa & Temples.',
      keywords: 'naam jaap, naam jaap counter, naam jamm counter, nam jap counter, 108 naam jaap counter online, digital mala counter, radha naam jaap, ram naam jaap, Sanatan Setu, Vedas, Upanishads, Bhagavad Gita, Puranas, Hanuman Chalisa, Gayatri Mantra, Jagannath Temple Puri',
      canonical: `${baseUrl}/`,
      type: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: 'Sanatan Setu – 108 Naam Jaap Counter & Hindu Scripture Library',
            alternateName: ['Sanatan Setu', 'Naam Jaap Counter', 'Naam Jamm Counter', '108 Mala Counter Online'],
            url: baseUrl,
            description: 'Free 108-Bead Naam Jaap Counter (Digital Mala) and Authentic Multilingual Hindu Scripture Library.',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'SoftwareApplication',
            name: '108-Bead Naam Jaap Counter (Naam Jamm Counter)',
            applicationCategory: 'LifestyleApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
            description: 'Online 108-bead Naam Jaap counter for chanting Radha Naam, Ram Naam, Om Namah Shivaya, Hare Krishna Maha Mantra, and Gayatri Mantra.'
          },
          {
            '@type': 'ItemList',
            name: 'Verified Hindu Scriptures, Mantras & Temple Guides',
            numberOfItems: approvedItems.length,
            itemListElement: approvedItems.map((it, idx) => ({
              '@type': 'ListItem',
              position: idx + 1,
              url: `${baseUrl}/#article/${it.id}`,
              name: it.title,
              description: it.description
            }))
          },
          {
            '@type': 'FAQPage',
            mainEntity: NAAM_JAAP_SEO_FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          }
        ]
      }
    };
  }, [selectedItem, activeView, selectedCategory, approvedItems]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = seoMetadata.title;
    const setMeta = (selector, attrName, attrVal, content) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', 'name', 'description', seoMetadata.description);
    setMeta('meta[name="keywords"]', 'name', 'keywords', seoMetadata.keywords);
    setMeta('meta[name="robots"]', 'name', 'robots', 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:title"]', 'property', 'og:title', seoMetadata.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', seoMetadata.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', seoMetadata.type);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seoMetadata.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seoMetadata.description);

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', seoMetadata.canonical);

    let scriptEl = document.getElementById('sanatan-seo-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'sanatan-seo-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(seoMetadata.jsonLd);
  }, [seoMetadata]);



  // Filtered Public Items
  const filteredItems = useMemo(() => {
    return approvedItems
      .filter((item) => {
        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchLang =
          selectedLanguageFilter === 'All' ||
          item.language === selectedLanguageFilter ||
          (item.body && typeof item.body === 'object' && Boolean(item.body[selectedLanguageFilter]));
        const matchFormat =
          selectedMediaFormat === 'All' ||
          (selectedMediaFormat === 'PDF' && Boolean(item.pdfUrl)) ||
          (selectedMediaFormat === 'Video' && Boolean(item.videoUrl)) ||
          (selectedMediaFormat === 'Text' && item.contentType !== 'PDF' && item.contentType !== 'Video');
        const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(item.id);
        const q = searchQuery.trim().toLowerCase();
        const bodyText = `${getBodyForLanguage(item, 'English')} ${getBodyForLanguage(item, 'Hindi')} ${getBodyForLanguage(item, 'Sanskrit')}`.toLowerCase();
        const matchSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.author || '').toLowerCase().includes(q) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          bodyText.includes(q);
        return matchCat && matchLang && matchFormat && matchBookmark && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.views || 0) - (a.views || 0);
      });
  }, [approvedItems, selectedCategory, selectedLanguageFilter, selectedMediaFormat, showBookmarksOnly, bookmarkedIds, searchQuery, sortBy]);

  // Meditation Timer & Auto-Jaap Effects
  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setMeditationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const activeMantra = useMemo(() => {
    if (isCustomMantra) {
      return {
        id: 'custom',
        name: 'Custom Ishta Mantra',
        sanskrit: customMantraText || 'ॐ श्री रामाय नमः',
        deity: 'Personal Ishta Devata'
      };
    }
    return JAAP_MANTRAS.find((m) => m.id === selectedMantraId) || JAAP_MANTRAS[0];
  }, [selectedMantraId, isCustomMantra, customMantraText]);

  const handleIncrementJaap = useCallback(() => {
    setCurrentCount((prev) => {
      const next = prev + 1;
      if (next > 0 && next % 108 === 0) {
        if (soundEnabled) playSacredSound('completion');
        showToast(`हरि ॐ! Completed ${Math.floor(next / 108)} full Mala (${next} chants)!`);
      } else if (soundEnabled) {
        playSacredSound('bead');
      }
      return next;
    });
    setLifetimeCount((prev) => prev + 1);
    setIsTimerRunning(true);
    setPulseEffect(true);
    const pid = Date.now() + Math.random();
    const offset = Math.floor(Math.random() * 120) - 60;
    setChantParticles((prev) => [...prev.slice(-8), { id: pid, offset }]);
    setTimeout(() => {
      setChantParticles((prev) => prev.filter((p) => p.id !== pid));
    }, 1050);
    setTimeout(() => setPulseEffect(false), 180);
  }, [soundEnabled, showToast]);

  useEffect(() => {
    let autoTimer;
    if (autoJaapActive) {
      autoTimer = setInterval(() => {
        handleIncrementJaap();
      }, 2200);
    }
    return () => clearInterval(autoTimer);
  }, [autoJaapActive, handleIncrementJaap]);

  const handleResetJaap = () => {
    setCurrentCount(0);
    setMeditationSeconds(0);
    setIsTimerRunning(false);
    setAutoJaapActive(false);
    showToast('Old Jaap cancelled! Counter & timer reset to 0 — ready for your new Naam Jaap.');
  };

  // Category Selection Handler — Resets conflicting filters, opens Category Showcase, and scrolls smoothly to content
  const handleSelectCategory = useCallback((catId, openFirstDirectly = false) => {
    setActiveView('home');
    setSearchQuery('');
    setSelectedLanguageFilter('All');
    setSelectedMediaFormat('All');
    setShowBookmarksOnly(false);
    setSelectedCategory(catId);

    const matching = approvedItems.filter((i) => catId === 'All' || i.category === catId);
    if (openFirstDirectly && matching.length > 0) {
      const first = matching[0];
      setItems((prev) =>
        prev.map((it) => (it.id === first.id ? { ...it, views: (it.views || 0) + 1 } : it))
      );
      setSelectedItem({ ...first, views: (first.views || 0) + 1 });
      setDetailLang(first.language || 'English');
      return;
    }

    if (catId !== 'All') {
      const catObj = CATEGORIES.find((c) => c.id === catId);
      showToast(`Opened ${catObj ? catObj.name : catId} (${matching.length} Sacred ${matching.length === 1 ? 'Scripture' : 'Scriptures'})`);
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setTimeout(() => {
        const target = document.getElementById('library-items-section');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    }
  }, [approvedItems, showToast]);

  // Item Open, Like, Bookmark, Share, and Speech Handlers
  const handleOpenItem = (item) => {
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, views: (it.views || 0) + 1 } : it))
    );
    setSelectedItem({ ...item, views: (item.views || 0) + 1 });
    setDetailLang(item.language || 'English');
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', `#article/${item.id}`);
      } catch (e) {}
    }
  };

  const handleCloseItem = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSelectedItem(null);
    if (typeof window !== 'undefined') {
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (e) {}
    }
  };

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    const alreadyLiked = likedIds.includes(id);
    setLikedIds((prev) => (alreadyLiked ? prev.filter((i) => i !== id) : [...prev, id]));
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, likes: Math.max(0, (item.likes || 0) + (alreadyLiked ? -1 : 1)) }
          : item
      )
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, likes: Math.max(0, (prev.likes || 0) + (alreadyLiked ? -1 : 1)) } : null
      );
    }
  };

  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    const exists = bookmarkedIds.includes(id);
    setBookmarkedIds((prev) => (exists ? prev.filter((i) => i !== id) : [...prev, id]));
    showToast(exists ? 'Removed from saved bookmarks' : 'Saved to your sacred bookmarks');
  };

  const handleCopyText = (text, label = 'Copied to clipboard!') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(label);
    } catch {
      showToast('Copied!');
    }
  };

  const handleToggleSpeech = (text, lang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported in this browser');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
    utterance.lang = langObj?.locale || (lang === 'English' ? 'en-IN' : 'hi-IN');
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Handle Direct Image File Upload (converts to Base64 Data URI so images always work!)
  const handleImageFileChange = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, imageUrl: reader.result });
        } else {
          setUploadForm((prev) => ({ ...prev, imageUrl: reader.result }));
        }
        showToast('Copyright-free image uploaded and attached!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Direct PDF File Upload (converts to Data URI / Object URL so users can view & download PDFs)
  const handlePdfFileChange = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEdit && editingItem) {
          setEditingItem({
            ...editingItem,
            pdfUrl: reader.result,
            pdfFileName: file.name,
            contentType: editingItem.videoUrl ? 'All' : 'PDF'
          });
        } else {
          setUploadForm((prev) => ({
            ...prev,
            pdfUrl: reader.result,
            pdfFileName: file.name,
            contentType: prev.videoUrl ? 'All' : 'PDF'
          }));
        }
        showToast(`PDF "${file.name}" attached!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Category Background Image Upload
  const handleCategoryImageUpload = (catId, e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCategoryCustomImages((prev) => {
          const updated = { ...prev, [catId]: reader.result };
          try {
            localStorage.setItem('sanatan_setu_category_images_v1', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        showToast(`Updated background image for ${catId}!`);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Upload Submission — Supports Text, PDF Upload, YouTube Video Links, Real Images & 27 Languages
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const primaryBody =
      uploadForm.bodyEnglish.trim() ||
      uploadForm.bodyHindi.trim() ||
      uploadForm.bodySanskrit.trim() ||
      uploadForm.bodyExtraLang.trim() ||
      (uploadForm.pdfUrl ? `PDF Scripture Document: ${uploadForm.title}` : '') ||
      (uploadForm.videoUrl ? `Sacred Video Presentation: ${uploadForm.title}` : '');

    if (!uploadForm.title.trim() || !uploadForm.description.trim() || !primaryBody) {
      showToast('Please enter Title, Short Description, and Content Body (or attach a PDF / YouTube Video link)');
      return;
    }

    const slugId =
      uploadForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      String(Date.now()).slice(-4);

    const catObj = CATEGORIES.find((c) => c.id === uploadForm.category) || CATEGORIES[0];
    const defaultCategoryPhoto = COPYRIGHT_FREE_CATEGORY_PHOTOS[uploadForm.category] || catObj.bgImage;

    const parsedTags = uploadForm.tags
      ? uploadForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [uploadForm.category.toLowerCase(), 'sacred-wisdom'];

    const approveNow = isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin;

    const bodyMap = {
      English: uploadForm.bodyEnglish.trim() || primaryBody,
      Hindi: uploadForm.bodyHindi.trim() || primaryBody,
      Sanskrit: uploadForm.bodySanskrit.trim() || primaryBody
    };
    if (uploadForm.extraLang && uploadForm.bodyExtraLang.trim()) {
      bodyMap[uploadForm.extraLang] = uploadForm.bodyExtraLang.trim();
    }

    const newItem = {
      id: slugId,
      title: uploadForm.title.trim(),
      category: uploadForm.category,
      sanskritBadge: `${catObj.sanskrit} · ${catObj.name}`,
      contentType: uploadForm.pdfUrl && uploadForm.videoUrl
        ? 'All'
        : uploadForm.pdfUrl
        ? 'PDF'
        : uploadForm.videoUrl
        ? 'Video'
        : uploadForm.contentType || 'Text',
      views: 1,
      likes: 0,
      language: uploadForm.language || 'Sanskrit',
      author: uploadForm.author.trim() || 'Community Contributor',
      imageUrl: uploadForm.imageUrl.trim() || defaultCategoryPhoto,
      pdfUrl: uploadForm.pdfUrl || '',
      pdfFileName: uploadForm.pdfFileName || '',
      videoUrl: uploadForm.videoUrl.trim() || '',
      tags: parsedTags,
      isFeatured: false,
      isUserUploaded: true,
      status: approveNow ? 'approved' : 'pending',
      isApproved: approveNow,
      submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: uploadForm.description.trim(),
      body: bodyMap
    };

    setItems((prev) => [newItem, ...prev]);
    setIsUploadOpen(false);
    setUploadForm({
      title: '',
      description: '',
      category: 'Mantras',
      contentType: 'Text',
      author: '',
      language: 'Sanskrit',
      imageUrl: '',
      pdfUrl: '',
      pdfFileName: '',
      videoUrl: '',
      tags: '',
      bodyEnglish: '',
      bodyHindi: '',
      bodySanskrit: '',
      extraLang: 'Odia',
      bodyExtraLang: '',
      publishDirectlyAsAdmin: false
    });

    if (approveNow) {
      showToast('Published directly to the Library by Admin!');
    } else {
      showToast('Submitted for Admin Verification! You can also edit it anytime.');
    }
  };

  // Admin Moderation Handlers
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const entered = adminPasscodeInput.trim();
    const activePass = (customAdminPasscode || DEFAULT_ADMIN_PASSCODE).trim();
    if (entered && (entered === activePass || entered === DEFAULT_ADMIN_PASSCODE)) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch {}
      setAdminPasscodeInput('');
      showToast('Welcome, Admin! Content Moderation Dashboard unlocked.');
    } else {
      showToast('Invalid Admin Passcode. Please try again.');
    }
  };

  const handleUpdateAdminPasscode = (e) => {
    e.preventDefault();
    const nextPass = newPasscodeInput.trim();
    if (nextPass.length < 4) {
      showToast('New admin password must be at least 4 characters long');
      return;
    }
    setCustomAdminPasscode(nextPass);
    try { localStorage.setItem('sanatan_admin_custom_passcode', nextPass); } catch {}
    setNewPasscodeInput('');
    showToast('Admin password updated successfully!');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try { localStorage.removeItem('sanatan_admin_auth'); } catch {}
    showToast('Logged out of Admin Mode');
  };

  const handleApproveItem = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: 'approved', isApproved: true } : it
      )
    );
    showToast('Authentic content Approved and Published to the Library!');
  };

  const handleMoveToPending = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: 'pending', isApproved: false } : it
      )
    );
    showToast('Item moved to Pending Moderation Queue');
  };

  const handleToggleFeatured = (id) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, isFeatured: !it.isFeatured } : it
      )
    );
    showToast('Updated Featured status');
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    showToast('Item removed from repository');
  };

  const handleSaveEditedItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    setItems((prev) =>
      prev.map((it) => (it.id === editingItem.id ? editingItem : it))
    );
    if (selectedItem && selectedItem.id === editingItem.id) {
      setSelectedItem(editingItem);
    }
    setEditingItem(null);
    showToast('Sacred content, media & translations updated!');
  };

  const handleRestoreDefaults = () => {
    const seedIds = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));
    const customApprovedOrPending = items.filter((it) => !seedIds.has(String(it.id)));
    setItems([...customApprovedOrPending, ...INITIAL_SACRED_ITEMS]);
    showToast('Restored all 23 unabridged Sacred Scriptures & working images!');
  };

  const handleTriggerAarti = () => {
    playSacredSound('bell');
    setIsAartiActive(true);
    showToast('🪔 Sacred Digital Aarti & Temple Ghanta initiated! हरिः ॐ तत् सत्');
    setTimeout(() => setIsAartiActive(false), 8500);
  };

  const handleRingTempleBell = () => {
    playSacredSound('bell');
    showToast('🔔 ॐ! Sacred Temple Ghanta rung — May peace and auspiciousness prevail.');
  };

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const fallbackArtworkForItem = useCallback((item) => {
    const catObj = CATEGORIES.find((c) => c.id === item?.category) || CATEGORIES[0];
    return createSacredArtwork({
      title: item?.title || 'Sanatan Dharma',
      sanskrit: catObj.sanskrit || 'ॐ',
      subtitle: `${item?.category || 'Sacred'} · Sanatan Setu`,
      c1: '#431407',
      c2: '#9a3412',
      c3: '#ea580c',
      accent: '#fde047',
      motif: item?.category === 'Temples' ? 'temple' : 'lotus'
    });
  }, []);

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        darkMode
          ? 'bg-[#0F0A07] text-amber-50 selection:bg-orange-500 selection:text-white'
          : 'bg-[#FFFBEB] text-[#2C1A12] selection:bg-amber-200 selection:text-amber-900'
      }`}
    >
      <SacredAnimationsStyle />
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A12] text-amber-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 text-sm">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Live Infinite Sacred Vedic Mantra Marquee Ribbon */}
      <div className="bg-gradient-to-r from-[#2A0E05] via-[#7C2D12] to-[#2A0E05] text-amber-200 border-b border-amber-400/25 py-1.5 overflow-hidden text-xs font-semibold select-none">
        <div className="animate-sacred-marquee flex items-center gap-10 whitespace-nowrap px-4">
          {[
            '🕉️ ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि',
            '🪔 हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे · हरे राम हरे राम राम राम हरे हरे',
            '🔱 ॐ नमः शिवाय · महामृत्युंजय मंत्र: ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
            '🚩 जय श्री राम · श्री हनुमान चालीसा · जय हनुमान ज्ञान गुन सागर',
            '🌸 सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते',
            '☸️ धर्मो रक्षति रक्षितः · सत्यमेव जयते · वसुधैव कुटुम्बकम्',
            '🕉️ ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि',
            '🪔 हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे · हरे राम हरे राम राम राम हरे हरे',
            '🔱 ॐ नमः शिवाय · महामृत्युंजय मंत्र: ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्',
            '🚩 जय श्री राम · श्री हनुमान चालीसा · जय हनुमान ज्ञान गुन सागर'
          ].map((chant, i) => (
            <span key={i} className="inline-flex items-center gap-2 tracking-wide text-amber-200/95">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{chant}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Top Sticky Header / Navbar */}
      <header
        role="banner"
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          darkMode
            ? 'bg-[#160E09]/95 border-amber-500/20 shadow-lg shadow-black/30'
            : 'bg-[#FFFBEB]/95 border-amber-900/10 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setActiveView('home');
              setSelectedCategory('All');
              setShowBookmarksOnly(false);
            }}
          >
            <SanatanSetuLogo size={44} />
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-lg sm:text-2xl font-black tracking-tight ${darkMode ? 'text-amber-100' : 'text-[#2C1A12]'}`}>
                  Sanatan Setu
                </span>
                <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-[#EA580C] dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-orange-500/20 hidden sm:inline-block">
                  Bridge to Divine
                </span>
              </div>
              <p className={`text-xs font-medium hidden md:block ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                Preserving &amp; Sharing Unabridged Eternal Vedic Wisdom
              </p>
            </div>
          </div>

          {/* Primary Navigation */}
          <nav aria-label="Main Navigation" className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeView === 'home'
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : darkMode
                  ? 'text-amber-200/80 hover:bg-amber-500/15'
                  : 'text-[#78523A] hover:bg-amber-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </button>

            <button
              onClick={() => setActiveView('jaap')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 relative ${
                activeView === 'jaap'
                  ? 'bg-[#EA580C] text-white shadow-md'
                  : darkMode
                  ? 'text-amber-200/80 hover:bg-amber-500/15'
                  : 'text-[#78523A] hover:bg-amber-100/70'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>108 Jaap</span>
            </button>

            {/* Contribute / Upload Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 border ${
                darkMode
                  ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 border-amber-500/30'
                  : 'bg-amber-900/10 hover:bg-amber-900/20 text-[#2C1A12] border-amber-900/15'
              }`}
            >
              <Upload className="w-4 h-4 text-[#EA580C]" />
              <span className="hidden sm:inline">Upload Content</span>
            </button>

            {/* Admin Moderation Portal Button with Pending Badge */}
            <button
              onClick={() => setActiveView('admin')}
              title="Admin Moderation & Approval Portal"
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 relative border ${
                activeView === 'admin'
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : darkMode
                  ? 'bg-[#23160E] text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                  : 'bg-amber-100/80 text-[#9A3412] border-amber-300 hover:bg-amber-200/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
              {pendingItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                  {pendingItems.length}
                </span>
              )}
            </button>

            {/* Dark Mode / Light Mode Toggle Button */}
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                darkMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 hover:bg-amber-500/30'
                  : 'bg-amber-100 text-[#2C1A12] border-amber-900/15 hover:bg-amber-200'
              }`}
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4 text-amber-300" />
                  <span className="hidden lg:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#9A3412]" />
                  <span className="hidden lg:inline">Dark</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main role="main" className="flex-1">
        {activeView === 'home' && (
          <div>
            {/* Hero Section */}
            <section
              className={`relative overflow-hidden py-12 sm:py-16 border-b transition-colors ${
                darkMode
                  ? 'bg-gradient-to-b from-[#23140B] via-[#140C08] to-[#0F0A07] border-amber-500/15'
                  : 'bg-gradient-to-b from-amber-100/80 via-[#FFFBEB] to-[#FFFBEB] border-amber-900/10'
              }`}
            >
              {/* Animated Sacred Geometric Mandala Background Rings */}
              <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full border border-amber-500/15 animate-spin-slow opacity-50" />
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full border border-dashed border-orange-500/20 animate-spin-slow opacity-60" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 border ${
                    darkMode
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-amber-200/60 text-[#9A3412] border-amber-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unabridged Vedas · Upanishads · Gita · Puranas · Temples · Mantras</span>
                </div>

                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight ${
                    darkMode ? 'text-amber-50' : 'text-[#2C1A12]'
                  }`}
                >
                  Your Digital Bridge to{' '}
                  <span className="bg-gradient-to-r from-[#EA580C] via-amber-500 to-red-600 bg-clip-text text-transparent animate-shimmer-gold underline decoration-amber-400/70 decoration-wavy decoration-2">
                    Sanatan Dharma
                  </span>
                </h1>

                {/* Interactive Temple Experience Bar: Digital Aarti, Temple Bell & Quick 108 Jaap */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleTriggerAarti}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#EA580C] via-amber-600 to-red-600 hover:from-orange-600 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 transition-all animate-pulse-glow"
                  >
                    <Flame className="w-4 h-4 fill-amber-200 text-amber-200 animate-diya-flicker" />
                    <span>🪔 Perform Digital Aarti</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRingTempleBell}
                    className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 transition-all ${
                      darkMode
                        ? 'bg-[#22150D] border-amber-500/35 text-amber-200 hover:bg-amber-500/20'
                        : 'bg-white border-amber-900/20 text-[#9A3412] hover:bg-amber-100/80 shadow-sm'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-[#EA580C]" />
                    <span>🔔 Ring Temple Ghanta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('jaap')}
                    className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 transform hover:-translate-y-0.5 transition-all ${
                      darkMode
                        ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
                        : 'bg-amber-100/90 border-amber-300 text-[#9A3412] hover:bg-amber-200/80'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#EA580C]" />
                    <span>📿 Launch 108 Digital Mala</span>
                  </button>
                </div>

                {/* Animated Digital Aarti Overlay when triggered */}
                {isAartiActive && (
                  <div className="my-5 flex justify-center">
                    <div className="relative w-44 h-44 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 via-orange-600/20 to-red-600/20 border-2 border-amber-400/50 shadow-2xl">
                      <span className="text-4xl font-serif text-amber-400 font-bold">ॐ</span>
                      <div className="animate-aarti-orbit absolute flex flex-col items-center">
                        <span className="text-3xl animate-diya-flicker">🪔</span>
                        <span className="text-[10px] font-bold text-amber-300 bg-black/70 px-1.5 rounded">आरती</span>
                      </div>
                    </div>
                  </div>
                )}

                <p
                  className={`mt-4 text-sm sm:text-lg max-w-2xl mx-auto ${
                    darkMode ? 'text-amber-200/80' : 'text-[#78523A]'
                  }`}
                >
                  Read complete, admin-verified Hindu scriptures in English, Hindi &amp; Sanskrit, explore ancient temple histories, and practice your daily 108-bead Naam Jaap.
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-2xl mx-auto">
                  <div className="relative flex items-center">
                    <Search className={`w-5 h-5 absolute left-4 ${darkMode ? 'text-amber-400' : 'text-[#78523A]'}`} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Vedas, Hanuman Chalisa, Jagannath Puri, Gita 2.47, Gayatri Mantra..."
                      aria-label="Search sacred scriptures, temples, and mantras"
                      className={`w-full pl-12 pr-20 py-4 rounded-2xl border-2 focus:border-[#EA580C] focus:outline-none shadow-lg text-sm sm:text-base transition-colors ${
                        darkMode
                          ? 'bg-[#1C120C] border-amber-500/25 text-amber-50 placeholder:text-amber-400/40'
                          : 'bg-white border-amber-900/15 text-[#2C1A12] placeholder:text-amber-800/40'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 px-2.5 py-1 rounded-lg bg-orange-500/15 text-xs font-bold text-[#EA580C] hover:bg-orange-500/25"
                      >
                        CLEAR
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Stats Banner */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur ${
                      darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">12</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                      Sacred Categories
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur ${
                      darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">{approvedItems.length}</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                      Verified Scriptures
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur ${
                      darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">3 Languages</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                      English · हिंदी · संस्कृत
                    </div>
                  </div>
                  <div
                    className={`p-4 rounded-2xl border backdrop-blur ${
                      darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">100%</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                      Admin-Verified Authentic
                    </div>
                  </div>
                </div>

                {/* Daily Vedic Shloka of the Day Carousel (आज का पावन श्लोक) */}
                <div
                  className={`mt-8 max-w-4xl mx-auto rounded-3xl p-5 sm:p-6 border text-left relative overflow-hidden shadow-xl transition-all ${
                    darkMode
                      ? 'bg-gradient-to-r from-[#1F130C] via-[#28180E] to-[#1F130C] border-amber-500/30'
                      : 'bg-gradient-to-r from-amber-50 via-white to-orange-50/80 border-amber-300/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#EA580C] text-white text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Shloka of the Day · आज का श्लोक
                      </span>
                      <span className={`text-xs font-bold ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>
                        {DAILY_SACRED_SHLOKAS[activeShlokaIndex].source}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleSpeech(
                            `${DAILY_SACRED_SHLOKAS[activeShlokaIndex].sanskrit}. ${DAILY_SACRED_SHLOKAS[activeShlokaIndex].hindi}`,
                            'Hindi'
                          )
                        }
                        className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-[#EA580C] text-[#EA580C] hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Chant Audio
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveShlokaIndex((prev) => (prev + 1) % DAILY_SACRED_SHLOKAS.length)
                        }
                        className="px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-xs font-bold transition-all"
                      >
                        Next Shloka →
                      </button>
                    </div>
                  </div>
                  <p className={`font-serif text-base sm:text-xl font-bold leading-relaxed ${darkMode ? 'text-amber-200' : 'text-[#7C2D12]'}`}>
                    {DAILY_SACRED_SHLOKAS[activeShlokaIndex].sanskrit}
                  </p>
                  <p className={`text-xs sm:text-sm mt-2 leading-relaxed ${darkMode ? 'text-amber-100/90' : 'text-[#2C1A12]'}`}>
                    <strong>हिन्दी:</strong> {DAILY_SACRED_SHLOKAS[activeShlokaIndex].hindi}
                  </p>
                  <p className={`text-xs mt-1 italic ${darkMode ? 'text-amber-300/75' : 'text-[#78523A]'}`}>
                    <strong>Meaning:</strong> {DAILY_SACRED_SHLOKAS[activeShlokaIndex].english}
                  </p>
                </div>
              </div>
            </section>

            {/* Instant 108 Naam Jaap Counter Spotlight Banner on Homepage for Direct SEO & User Access */}
            <section aria-labelledby="naam-jaap-spotlight-heading" className="pt-10 pb-2 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-[#451A03] via-[#9A3412] to-[#EA580C] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-amber-400/30 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center lg:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" /> #1 Online 108-Bead Digital Mala &amp; Naam Jaap Counter
                  </div>
                  <h2 id="naam-jaap-spotlight-heading" className="text-2xl sm:text-3xl font-black leading-tight">
                    108-Bead Naam Jaap Counter (नाम जाप काउंटर · Digital Mala)
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                    Chant <strong>Radha Naam</strong>, <strong>Shri Ram Jai Ram</strong>, <strong>Hare Krishna Maha Mantra</strong>, <strong>Om Namah Shivaya</strong>, or <strong>Gayatri Mantra</strong> with live 108-bead mala tracking, 528Hz sacred chime, and Dhyana meditation timer.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
                  <button
                    onClick={handleIncrementJaap}
                    className="px-5 py-3.5 rounded-2xl bg-amber-300 hover:bg-amber-200 text-[#2C1A12] font-black text-xs sm:text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Flame className="w-5 h-5 text-[#EA580C] fill-[#EA580C]" />
                    <span>Quick Chant +1 (Bead {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108}/108)</span>
                  </button>
                  <button
                    onClick={handleResetJaap}
                    title="Cancel current Jaap and start a new one from 0"
                    className="px-4 py-3.5 rounded-2xl bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel / New Jaap</span>
                  </button>
                  <a
                    href="#jaap"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveView('jaap');
                    }}
                    className="px-4 py-3.5 rounded-2xl bg-black/35 hover:bg-black/50 text-white border border-amber-300/40 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Full Jaap Counter</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* Browse by Category Section — Fully Clickable Cards with Accurate Image Framing & Instant Content Drawer */}
            <section id="categories" aria-labelledby="browse-categories-heading" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">
                    Sacred Prasthanas &amp; Traditions (Click Any Category to Open Its Scriptures)
                  </span>
                  <h2 id="browse-categories-heading" className="text-2xl sm:text-3xl font-extrabold mt-1">
                    Browse by Category
                  </h2>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setImageFitMode((prev) => (prev === 'contain-blur' ? 'cover-top' : 'contain-blur'))}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      darkMode ? 'bg-[#1F140E] border-amber-500/30 text-amber-200' : 'bg-white border-amber-900/15 text-[#2C1A12]'
                    }`}
                  >
                    🖼️ Frame Fit: {imageFitMode === 'contain-blur' ? 'Full Uncropped (Accurate)' : 'Edge-to-Edge Fill'}
                  </button>
                  {selectedCategory !== 'All' && (
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold shadow hover:bg-orange-700 transition-all"
                    >
                      Show All Categories ({approvedItems.length})
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {CATEGORIES.map((cat) => {
                  const catItems = approvedItems.filter((i) => i.category === cat.id);
                  const count = catItems.length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelectCategory(cat.id, false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectCategory(cat.id, false);
                        }
                      }}
                      className={`group cursor-pointer relative h-56 rounded-2xl overflow-hidden text-left p-5 flex flex-col justify-between transition-all duration-300 border-2 hover:-translate-y-1.5 ${
                        isSelected
                          ? 'border-[#EA580C] ring-4 ring-[#EA580C]/40 shadow-2xl scale-[1.02]'
                          : 'border-amber-500/25 hover:border-amber-400 shadow-md hover:shadow-2xl'
                      }`}
                    >
                      {/* Accurate Dual-Layer Category Background Image Frame */}
                      <SacredImageFrame
                        src={categoryCustomImages[cat.id] || cat.bgImage}
                        fallbackSrc={cat.fallbackBgImage || cat.bgImage}
                        alt={`${cat.name} (${cat.sanskrit}) category background`}
                        mode={imageFitMode}
                        className="absolute inset-0 w-full h-full"
                        imgClassName="group-hover:scale-105"
                      />
                      {/* Sacred Dark Gradient Overlay for Crisp Readability */}
                      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/95 via-black/55 to-black/25 group-hover:via-black/45 transition-all pointer-events-none" />

                      {/* Top Row: Code Badge, Custom Photo Upload & Item Count */}
                      <div className="relative z-10 flex justify-between items-center w-full">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-[#1C0D06] font-black text-xs tracking-wider shadow">
                          {cat.code}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <label
                            title="Upload custom copyright-free background photo for this category"
                            className="px-2 py-1 rounded-lg bg-black/70 hover:bg-[#EA580C] text-amber-200 hover:text-white border border-amber-400/30 text-[10px] font-bold cursor-pointer transition-all"
                          >
                            📷 Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleCategoryImageUpload(cat.id, e)}
                              className="hidden"
                            />
                          </label>
                          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-amber-200 border border-amber-400/30 text-xs font-semibold">
                            {count} {count === 1 ? 'Item' : 'Items'}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Sanskrit Title, Category Name, Description & Quick Action Bar */}
                      <div className="relative z-10">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-sm font-serif text-amber-300 font-semibold">
                            {cat.sanskrit}
                          </span>
                        </div>
                        <p className="text-xs text-amber-100/90 mt-1 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                        <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            View {count} {count === 1 ? 'Scripture' : 'Scriptures'} <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          {catItems.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenItem(catItems[0]);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#EA580C] hover:bg-orange-500 text-white shadow transition-all"
                            >
                              Read Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Category Instant Content Drawer (Opens Immediately Below Categories When Clicked!) */}
              {selectedCategory !== 'All' && (
                <div
                  id="category-content-drawer"
                  className={`mt-8 p-6 rounded-3xl border-2 border-[#EA580C] shadow-2xl animate-fade-in-up ${
                    darkMode ? 'bg-[#1D120B] text-amber-50' : 'bg-amber-50/90 text-[#2C1A12]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/25">
                    <div>
                      <span className="text-xs font-black uppercase tracking-widest text-[#EA580C]">
                        Active Category Opened
                      </span>
                      <h3 className="text-2xl font-black mt-0.5">
                        {selectedCategory} ({CATEGORIES.find((c) => c.id === selectedCategory)?.sanskrit}) — {filteredItems.length} {filteredItems.length === 1 ? 'Scripture' : 'Scriptures'}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                    >
                      <X className="w-4 h-4" /> Close Category Filter
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {filteredItems.map((it) => (
                      <div
                        key={it.id}
                        onClick={() => handleOpenItem(it)}
                        className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-4 transition-all hover:-translate-y-0.5 hover:border-[#EA580C] hover:shadow-lg ${
                          darkMode ? 'bg-[#140C08] border-amber-500/20' : 'bg-white border-amber-900/15'
                        }`}
                      >
                        <SacredImageFrame
                          src={it.imageUrl || fallbackArtworkForItem(it)}
                          fallbackSrc={it.fallbackImageUrl || fallbackArtworkForItem(it)}
                          alt={it.title}
                          mode={imageFitMode}
                          className="w-24 h-20 rounded-xl shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm sm:text-base line-clamp-1 group-hover:text-[#EA580C]">
                            {it.title}
                          </h4>
                          <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                            {it.description}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] mt-1.5">
                            Open Unabridged Scripture <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Filter & Sacred Library Items Grid */}
            <section id="library-items-section" aria-labelledby="library-items-heading" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div
                className={`p-4 sm:p-5 rounded-2xl border mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
                  darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-amber-50/70 border-amber-900/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 id="library-items-heading" className="text-xl sm:text-2xl font-extrabold">
                      {selectedCategory === 'All' ? 'All Sacred Knowledge' : `${selectedCategory} Collection`}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EA580C]/15 text-[#EA580C] text-xs font-bold">
                      {filteredItems.length} {filteredItems.length === 1 ? 'Entry' : 'Entries'}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                    Every article includes complete English, Hindi (हिंदी), and Sanskrit (संस्कृत) texts
                  </p>
                </div>

                {/* Language, Bookmark & Sort Controls */}
                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                  {/* Media Format Filter Pills (All, Text, PDF, Video) */}
                  <div className="flex items-center gap-1 rounded-xl p-1 bg-amber-500/10 border border-amber-500/20">
                    {['All', 'Text', 'PDF', 'Video'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedMediaFormat(fmt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedMediaFormat === fmt
                            ? 'bg-[#EA580C] text-white shadow'
                            : darkMode
                            ? 'text-amber-200/80 hover:text-white'
                            : 'text-[#78523A] hover:text-[#2C1A12]'
                        }`}
                      >
                        {fmt === 'All' ? 'All Formats' : fmt}
                      </button>
                    ))}
                  </div>

                  {/* 27 Indian & World Languages Selector */}
                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                    aria-label="Filter by Indian or World Language"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode
                        ? 'bg-[#22160F] border-amber-500/25 text-amber-100'
                        : 'bg-white border-amber-900/15 text-[#2C1A12]'
                    }`}
                  >
                    <option value="All">🌐 All 27 Languages (Indian &amp; World)</option>
                    <optgroup label="🇮🇳 Top Indian Languages">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group !== 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🌍 Top World Languages">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group === 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Bookmarks Filter Button */}
                  <button
                    onClick={() => setShowBookmarksOnly((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      showBookmarksOnly
                        ? 'bg-[#EA580C] text-white border-[#EA580C]'
                        : darkMode
                        ? 'bg-[#22160F] text-amber-200 border-amber-500/25'
                        : 'bg-white text-[#78523A] border-amber-900/15'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved ({bookmarkedIds.length})</span>
                  </button>

                  {/* Sort Select */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort sacred items"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode
                        ? 'bg-[#22160F] border-amber-500/25 text-amber-100'
                        : 'bg-white border-amber-900/15 text-[#2C1A12]'
                    }`}
                  >
                    <option value="featured">Featured First</option>
                    <option value="popular">Most Viewed</option>
                    <option value="likes">Most Liked</option>
                  </select>
                </div>
              </div>

              {/* Empty State */}
              {filteredItems.length === 0 ? (
                <div
                  className={`rounded-3xl p-12 text-center border ${
                    darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                  }`}
                >
                  <BookOpen className="w-12 h-12 text-[#EA580C] mx-auto mb-3 opacity-80" />
                  <h3 className="text-lg font-bold">No matching sacred texts found</h3>
                  <p className={`text-xs mt-1 max-w-md mx-auto ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                    Try clearing your search filter or switching back to All Categories.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedLanguageFilter('All');
                      setSearchQuery('');
                      setShowBookmarksOnly(false);
                    }}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold hover:bg-orange-700 transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* Sacred Items Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const isLiked = likedIds.includes(item.id);
                    const isBookmarked = bookmarkedIds.includes(item.id);
                    const englishBody = getBodyForLanguage(item, 'English');
                    return (
                      <article
                        key={item.id}
                        itemScope
                        itemType="https://schema.org/Article"
                        onClick={() => handleOpenItem(item)}
                        className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group animate-fade-in-up ${
                          darkMode
                            ? 'bg-[#18100B] border-amber-500/20 hover:border-amber-400/60'
                            : 'bg-white border-amber-900/10 hover:border-amber-400'
                        }`}
                      >
                        <div className="h-56 overflow-hidden relative bg-[#1C0F0A]">
                          <SacredImageFrame
                            src={item.imageUrl || fallbackArtworkForItem(item)}
                            fallbackSrc={item.fallbackImageUrl || fallbackArtworkForItem(item)}
                            alt={item.title}
                            mode={imageFitMode}
                            className="w-full h-full"
                            imgClassName="group-hover:scale-105"
                          />
                          <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
                            <span className="px-2.5 py-1 rounded-lg bg-[#2C1A12]/85 backdrop-blur text-amber-200 text-xs font-bold border border-amber-400/20">
                              {item.sanskritBadge || item.category}
                            </span>
                            {item.isFeatured && (
                              <span className="px-2.5 py-1 rounded-lg bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1 shadow">
                                <Sparkles className="w-3 h-3" /> Featured
                              </span>
                            )}
                            {item.pdfUrl && (
                              <span className="px-2 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold flex items-center gap-1 shadow">
                                <FileText className="w-3 h-3" /> PDF
                              </span>
                            )}
                            {item.videoUrl && (
                              <span className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold flex items-center gap-1 shadow">
                                <Play className="w-3 h-3" /> Video
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => toggleBookmark(item.id, e)}
                            aria-label="Bookmark sacred text"
                            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur transition-all ${
                              isBookmarked
                                ? 'bg-[#EA580C] text-white'
                                : 'bg-black/50 text-white hover:bg-black/75'
                            }`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2.5 right-3 z-10 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-400/30">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3
                              itemProp="headline"
                              className={`font-bold text-lg group-hover:text-[#EA580C] transition-colors line-clamp-2 ${
                                darkMode ? 'text-amber-50' : 'text-[#2C1A12]'
                              }`}
                            >
                              {item.title}
                            </h3>
                            <p
                              itemProp="description"
                              className={`text-xs mt-2 line-clamp-3 leading-relaxed ${
                                darkMode ? 'text-amber-200/75' : 'text-[#78523A]'
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-4">
                            {/* Tags Preview */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {(item.tags || []).slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                    darkMode
                                      ? 'bg-amber-500/10 text-amber-300'
                                      : 'bg-amber-100/80 text-[#9A3412]'
                                  }`}
                                >
                                  #{tag}
                                </span>
                              ))}
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                                  darkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                                }`}
                              >
                                EN · हिं · सं ({Math.max(1, Math.ceil(englishBody.split(/\s+/).length / 180))} min read)
                              </span>
                            </div>

                            <div
                              className={`pt-3 border-t flex items-center justify-between text-xs ${
                                darkMode ? 'border-amber-500/15 text-amber-300/75' : 'border-amber-900/10 text-[#78523A]'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" /> {(item.views || 0).toLocaleString()}
                                </span>
                                <button
                                  onClick={(e) => toggleLike(item.id, e)}
                                  className={`flex items-center gap-1 hover:text-[#EA580C] ${
                                    isLiked ? 'text-red-500 font-bold' : ''
                                  }`}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                  <span>{item.likes || 0}</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingItem(item);
                                  }}
                                  title="Edit this content (Text, Image, PDF, Video, Languages)"
                                  className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-[#EA580C] text-[#EA580C] hover:text-white font-bold flex items-center gap-1 transition-all"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                              </div>
                              <span className="font-bold text-[#EA580C] flex items-center gap-0.5">
                                Read Full Text <ChevronRight className="w-3.5 h-3.5" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Google SEO Hub: Naam Jaap Counter Guide, FAQ & Complete Crawlable Index of All Uploaded/Approved Scriptures */}
            <section aria-labelledby="naam-jaap-seo-faq-heading" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div
                className={`rounded-3xl p-6 sm:p-8 border space-y-8 ${
                  darkMode ? 'bg-[#160F0A] border-amber-500/20' : 'bg-amber-50/60 border-amber-900/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#EA580C]">
                    Sacred Chanting &amp; Digital Mala Guide
                  </span>
                  <h2 id="naam-jaap-seo-faq-heading" className="text-xl sm:text-2xl font-extrabold mt-1">
                    108 Naam Jaap Counter (Naam Jamm Counter) – Frequently Asked Questions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {NAAM_JAAP_SEO_FAQS.map((faq, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border ${
                          darkMode ? 'bg-[#1F140E] border-amber-500/15' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <h3 className="font-bold text-sm text-[#EA580C]">{faq.q}</h3>
                        <p className={`text-xs mt-1.5 leading-relaxed ${darkMode ? 'text-amber-100/85' : 'text-[#78523A]'}`}>
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crawlable Directory of All Approved & Uploaded Scriptures (Ensures Googlebot Discovers Every Article Link) */}
                <div className={`pt-6 border-t ${darkMode ? 'border-amber-500/20' : 'border-amber-900/10'}`}>
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#EA580C] mb-3">
                    Complete Index of Verified Scriptures, Mantras &amp; Uploaded Sacred Texts ({approvedItems.length})
                  </h3>
                  <nav aria-label="All Sacred Articles Directory" className="flex flex-wrap gap-2">
                    <a
                      href="#jaap"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveView('jaap');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                    >
                      108-Bead Naam Jaap Counter (Digital Mala)
                    </a>
                    {approvedItems.map((it) => (
                      <a
                        key={it.id}
                        href={`#article/${it.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenItem(it);
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:border-[#EA580C] ${
                          darkMode
                            ? 'bg-[#1F140E] border-amber-500/20 text-amber-200'
                            : 'bg-white border-amber-900/10 text-[#2C1A12]'
                        }`}
                      >
                        {it.title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 108-Bead Naam Jaap Counter View */}
        {activeView === 'jaap' && (
          <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/15 text-[#EA580C] text-xs font-bold uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 fill-orange-500" /> Sacred Digital Rudraksha Mala
              </span>
              <h1 className="text-3xl sm:text-4xl font-black">108-Bead Naam Jaap Counter</h1>
              <p className={`text-sm mt-1 max-w-xl mx-auto ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                Chant your sacred mantra, count completed 108-bead malas with 528Hz sacred chime feedback, and track your daily Dhyana meditation time.
              </p>
            </div>

            {/* Top Jaap Stats Bar */}
            <div className="bg-gradient-to-r from-amber-800 via-orange-600 to-amber-900 rounded-3xl p-6 text-white shadow-xl mb-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Current Mala Bead</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-100 mt-1">
                  {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108}{' '}
                  <span className="text-base font-normal text-amber-300">/ 108</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Completed Malas</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-100 mt-1">
                  {Math.floor(currentCount / 108)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Dhyana Time</div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {formatDuration(meditationSeconds)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Lifetime Chants</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-1">
                  {lifetimeCount.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Mantra Selection */}
              <div className="lg:col-span-5 space-y-6">
                <div
                  className={`rounded-3xl p-6 border shadow-sm ${
                    darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                  }`}
                >
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-500" />
                    <span>Select Sacred Mantra</span>
                  </h2>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {JAAP_MANTRAS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setIsCustomMantra(false);
                          setSelectedMantraId(m.id);
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                          !isCustomMantra && selectedMantraId === m.id
                            ? darkMode
                              ? 'bg-amber-500/20 border-[#EA580C] ring-2 ring-[#EA580C]/30'
                              : 'bg-amber-50 border-[#EA580C] shadow-sm ring-2 ring-[#EA580C]/20'
                            : darkMode
                            ? 'bg-[#22160F] border-amber-500/15 hover:border-amber-500/40'
                            : 'bg-white border-amber-900/10 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-bold text-sm">{m.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-semibold shrink-0">
                            {m.deity}
                          </span>
                        </div>
                        <p className={`text-xs font-serif mt-1 line-clamp-1 ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>
                          {m.sanskrit}
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Custom Mantra Input */}
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-amber-500/20' : 'border-amber-900/10'}`}>
                    <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1.5">
                      Or Enter Custom Mantra / Ishta Naam
                    </label>
                    <input
                      type="text"
                      value={customMantraText}
                      onChange={(e) => {
                        setCustomMantraText(e.target.value);
                        setIsCustomMantra(true);
                      }}
                      placeholder="e.g. ॐ नमो नारायणाय / श्री राधा"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                        darkMode ? 'bg-[#22160F] border-amber-500/25 text-amber-50' : 'bg-white border-amber-900/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Sound & Reset Controls */}
                <div
                  className={`rounded-3xl p-6 border shadow-sm flex items-center justify-between ${
                    darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`p-3 rounded-2xl transition-all ${
                        soundEnabled ? 'bg-orange-500/20 text-[#EA580C]' : 'bg-gray-500/20 text-gray-400'
                      }`}
                    >
                      {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <div>
                      <div className="text-sm font-bold">528Hz Sacred Mala Chime</div>
                      <div className={`text-xs ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                        {soundEnabled ? 'Audio Resonance Active' : 'Muted'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleResetJaap}
                    className="px-3.5 py-2.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-[#EA580C] text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive 108 Bead Counter */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <div
                  className={`rounded-3xl p-8 border shadow-lg w-full text-center relative overflow-hidden ${
                    darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                  }`}
                >
                  <div className="mb-4">
                    <span className="text-xs font-bold text-[#EA580C] uppercase tracking-widest">
                      {activeMantra.deity}
                    </span>
                    <h2 className="text-2xl font-black mt-1">{activeMantra.name}</h2>
                    <p className={`font-serif text-lg mt-2 font-medium px-4 ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>
                      &ldquo;{activeMantra.sanskrit}&rdquo;
                    </p>
                  </div>

                  {/* Progress Bar toward 108 */}
                  <div className="max-w-md mx-auto my-4">
                    <div className="h-2.5 w-full rounded-full bg-amber-500/15 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-[#EA580C] transition-all duration-200"
                        style={{ width: `${Math.min(100, ((currentCount % 108) / 108) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Main Tap Counter Button with Animated 27-Bead Rudraksha Mala SVG Ring */}
                  <div className="my-6 flex justify-center relative items-center">
                    <svg
                      viewBox="0 0 340 340"
                      className="w-80 h-80 sm:w-96 sm:h-96 absolute pointer-events-none"
                    >
                      <circle
                        cx="170"
                        cy="170"
                        r="154"
                        fill="none"
                        stroke="#f59e0b"
                        strokeOpacity="0.25"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                      />
                      {Array.from({ length: 27 }).map((_, idx) => {
                        const angle = (idx / 27) * 2 * Math.PI - Math.PI / 2;
                        const cx = 170 + 154 * Math.cos(angle);
                        const cy = 170 + 154 * Math.sin(angle);
                        const activeBeadIndex = Math.floor(((currentCount % 108) / 108) * 27);
                        const isLit = (currentCount % 108) > 0 && idx <= activeBeadIndex;
                        const isSumeru = idx === 0;
                        return (
                          <circle
                            key={idx}
                            cx={cx}
                            cy={cy}
                            r={isSumeru ? 8 : 5.5}
                            fill={isLit ? '#fbbf24' : isSumeru ? '#ea580c' : '#78350f'}
                            stroke={isLit || isSumeru ? '#fef08a' : '#b45309'}
                            strokeWidth={isSumeru ? '2.5' : '1.5'}
                          />
                        );
                      })}
                    </svg>
                    {/* Floating +1 ॐ Chant Particles on Tap */}
                    {chantParticles.map((pt) => (
                      <span
                        key={pt.id}
                        style={{ left: `calc(50% + ${pt.offset}px)` }}
                        className="animate-chant-particle pointer-events-none absolute top-16 z-20 text-lg font-black text-amber-200 drop-shadow-[0_2px_8px_rgba(234,88,12,0.9)]"
                      >
                        +1 ॐ
                      </span>
                    ))}
                    <button
                      onClick={handleIncrementJaap}
                      className={`w-60 h-60 sm:w-68 sm:h-68 rounded-full bg-gradient-to-br from-[#EA580C] via-amber-600 to-amber-800 text-white shadow-2xl flex flex-col items-center justify-center transition-all duration-150 transform active:scale-95 border-8 border-amber-300/60 relative z-10 group animate-pulse-glow ${
                        pulseEffect ? 'ring-8 ring-orange-400/60 scale-105' : ''
                      }`}
                    >
<div className="text-xs font-bold uppercase tracking-widest text-amber-200 mb-1">
                        TAP BEAD TO CHANT
                      </div>
                      <div className="text-5xl sm:text-6xl font-black tracking-tight">{currentCount}</div>
                      <div className="text-xs font-semibold text-amber-100 mt-2">
                        Bead {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} of 108
                      </div>
                      <div className="mt-4 px-4 py-1.5 rounded-full bg-black/25 text-xs font-bold text-amber-100 group-hover:bg-black/35 transition-all">
                        +1 ॐ जाप
                      </div>
                    </button>
                  </div>

                  {/* Auto Jaap & Cancel Old Jaap / Start New Jaap Controls */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <button
                      onClick={() => setAutoJaapActive(!autoJaapActive)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                        autoJaapActive
                          ? 'bg-amber-600 text-white animate-pulse'
                          : 'bg-amber-500/15 text-[#EA580C] hover:bg-amber-500/25'
                      }`}
                    >
                      {autoJaapActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{autoJaapActive ? 'Pause Auto-Chanting' : 'Start Hands-Free Auto Jaap (2.2s)'}</span>
                    </button>

                    <button
                      onClick={handleResetJaap}
                      className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Old Jaap &amp; Start New (0/108)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Moderation & Approval Portal View */}
        {activeView === 'admin' && (
          <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-[#EA580C] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" /> Content Authenticity &amp; Moderation
                </span>
                <h1 className="text-2xl sm:text-4xl font-black">Admin Approval Dashboard</h1>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                  Review community-uploaded scriptures, edit content, and approve only authentic Vedic texts for public publication.
                </p>
              </div>
              {isAdminAuthenticated && (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-orange-700"
                  >
                    <Plus className="w-4 h-4" /> Add Verified Scripture
                  </button>
                  <button
                    onClick={handleRestoreDefaults}
                    className={`px-3.5 py-2.5 rounded-xl border text-xs font-bold ${
                      darkMode ? 'border-amber-500/30 text-amber-200 hover:bg-amber-500/15' : 'border-amber-900/20 text-[#2C1A12] hover:bg-amber-100'
                    }`}
                  >
                    Restore 23 Default Texts
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="px-3.5 py-2.5 rounded-xl bg-red-500/15 text-red-500 text-xs font-bold hover:bg-red-500/25"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {!isAdminAuthenticated ? (
              <div
                className={`max-w-md mx-auto rounded-3xl p-8 border shadow-xl text-center ${
                  darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-[#EA580C] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black">Admin Authentication Required</h2>
                <p className={`text-xs mt-1 mb-6 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                  Only the site administrator can approve uploaded scriptures so that only authentic Sanatan Dharma content is published.
                </p>
                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                      Admin Passcode
                    </label>
                    <input
                      type="password"
                      value={adminPasscodeInput}
                      onChange={(e) => setAdminPasscodeInput(e.target.value)}
                      placeholder="Enter your secret Admin password"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                        darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                  >
                    Unlock Admin Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Admin Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-amber-500/20 pb-4">
                  <button
                    onClick={() => setAdminTab('pending')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      adminTab === 'pending'
                        ? 'bg-[#EA580C] text-white shadow'
                        : darkMode
                        ? 'bg-[#18100B] text-amber-200'
                        : 'bg-white text-[#78523A]'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending Approval Queue ({pendingItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('published')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      adminTab === 'published'
                        ? 'bg-[#EA580C] text-white shadow'
                        : darkMode
                        ? 'bg-[#18100B] text-amber-200'
                        : 'bg-white text-[#78523A]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published Authentic Content ({approvedItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('seo')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      adminTab === 'seo'
                        ? 'bg-[#EA580C] text-white shadow'
                        : darkMode
                        ? 'bg-[#18100B] text-amber-200'
                        : 'bg-white text-[#78523A]'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>SEO Status &amp; index.html</span>
                  </button>
                </div>

                {/* Tab 1: Pending Approval Queue */}
                {adminTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingItems.length === 0 ? (
                      <div
                        className={`rounded-3xl p-10 text-center border ${
                          darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold">All Uploaded Content Reviewed!</h3>
                        <p className={`text-xs mt-1 max-w-md mx-auto ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                          New community submissions via &ldquo;Upload Content&rdquo; are held here in the Pending Queue until you verify and approve them.
                        </p>
                      </div>
                    ) : (
                      pendingItems.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-2xl p-6 border shadow-md flex flex-col lg:flex-row gap-6 justify-between ${
                            darkMode ? 'bg-[#18100B] border-amber-500/30' : 'bg-white border-amber-300'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <img
                              src={item.imageUrl || fallbackArtworkForItem(item)}
                              alt={item.title}
                              className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackArtworkForItem(item);
                              }}
                            />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-bold">
                                  PENDING ADMIN APPROVAL
                                </span>
                                <span className="text-xs font-bold text-[#EA580C]">{item.category}</span>
                                <span className="text-xs opacity-70">By: {item.author || 'Contributor'}</span>
                              </div>
                              <h3 className="text-lg font-extrabold">{item.title}</h3>
                              <p className={`text-xs ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>
                                {item.description}
                              </p>
                              <div
                                className={`p-3 rounded-xl text-xs max-h-40 overflow-y-auto whitespace-pre-line border ${
                                  darkMode ? 'bg-[#110B07] border-amber-500/15 text-amber-100/90' : 'bg-amber-50/70 border-amber-900/10 text-[#2C1A12]'
                                }`}
                              >
                                {getBodyForLanguage(item, 'English')}
                              </div>
                            </div>
                          </div>

                          <div className="flex sm:flex-row lg:flex-col justify-end gap-2.5 shrink-0">
                            <button
                              onClick={() => handleApproveItem(item.id)}
                              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                            >
                              <Check className="w-4 h-4" /> Approve &amp; Publish
                            </button>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <Edit3 className="w-4 h-4" /> Edit Content
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                              <Trash2 className="w-4 h-4" /> Reject &amp; Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 2: Published Content Manager */}
                {adminTab === 'published' && (
                  <div className="space-y-3">
                    {approvedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img
                            src={item.imageUrl || fallbackArtworkForItem(item)}
                            alt={item.title}
                            className="w-16 h-14 rounded-xl object-cover shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackArtworkForItem(item);
                            }}
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#EA580C]">{item.category}</span>
                              {item.isFeatured && (
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                                  Featured
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleFeatured(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold hover:bg-amber-500/25"
                          >
                            {item.isFeatured ? 'Unfeature' : 'Feature'}
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-bold hover:bg-blue-500/25"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleMoveToPending(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 text-xs font-bold hover:bg-orange-500/25"
                          >
                            Unpublish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: Live SEO Status & index.html Helper */}
                {adminTab === 'seo' && (
                  <div
                    className={`rounded-3xl p-6 sm:p-8 border space-y-6 ${
                      darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
                      <div>
                        <h3 className="text-lg font-extrabold flex items-center gap-2">
                          <Globe className="w-5 h-5 text-[#EA580C]" />
                          <span>Live Search Engine Optimization (SEO) &amp; Schema.org Status</span>
                        </h3>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                          Dynamic meta tags, Open Graph tags, canonical URLs, and JSON-LD structured data are active across all 23 scriptures and 12 categories.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <button
                          onClick={() => handleCopyText(SEO_INDEX_HTML_TEMPLATE, 'Copied SEO index.html to clipboard!')}
                          className="px-3.5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-orange-700"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy index.html
                        </button>
                        <button
                          onClick={() => handleCopyText(generatedSitemapXml, 'Copied public/sitemap.xml (includes all approved uploads)!')}
                          className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-amber-700"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy public/sitemap.xml
                        </button>
                        <button
                          onClick={() => handleCopyText(generatedRobotsTxt, 'Copied public/robots.txt to clipboard!')}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-emerald-700"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy public/robots.txt
                        </button>
                        <button
                          onClick={() =>
                            handleCopyText(
                              JSON.stringify(approvedItems, null, 2),
                              'Copied all Approved Scriptures JSON (including new uploads)!'
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow hover:bg-blue-700"
                        >
                          <FileText className="w-3.5 h-3.5" /> Export Approved Items JSON
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#110B07] border-amber-500/15' : 'bg-amber-50/60 border-amber-900/10'}`}>
                        <div className="font-bold text-[#EA580C] uppercase mb-1">Active Meta Title</div>
                        <div className="font-semibold">{seoMetadata.title}</div>
                        <div className="font-bold text-[#EA580C] uppercase mt-3 mb-1">Active Meta Description</div>
                        <div>{seoMetadata.description}</div>
                      </div>
                      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#110B07] border-amber-500/15' : 'bg-amber-50/60 border-amber-900/10'}`}>
                        <div className="font-bold text-[#EA580C] uppercase mb-1">Active JSON-LD Schema.org</div>
                        <pre className="overflow-x-auto text-[11px] leading-relaxed">
                          {JSON.stringify(seoMetadata.jsonLd, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Change Admin Password Form */}
                    <form onSubmit={handleUpdateAdminPasscode} className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-end gap-4 ${darkMode ? 'bg-[#110B07] border-amber-500/20' : 'bg-amber-50/60 border-amber-900/15'}`}>
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                          Change Admin Password
                        </label>
                        <input
                          type="password"
                          value={newPasscodeInput}
                          onChange={(e) => setNewPasscodeInput(e.target.value)}
                          placeholder="Enter new Admin password (min 4 characters)"
                          className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#EA580C] ${
                            darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-white border-amber-900/20'
                          }`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow shrink-0"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* About, Contact, Privacy & Disclaimer Views */}
        {['about', 'contact', 'privacy', 'disclaimer'].includes(activeView) && (
          <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setActiveView('home')}
              className="mb-6 px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sacred Library
            </button>

            <div
              className={`rounded-3xl p-8 border shadow-lg space-y-4 ${
                darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
              }`}
            >
              {activeView === 'about' && (
                <>
                  <h1 className="text-3xl font-black">About Sanatan Setu Library</h1>
                  <p className="text-sm leading-relaxed">
                    Sanatan Setu Library is a sacred digital sanctuary dedicated to preserving and sharing authentic, unabridged Hindu scriptures—including the Four Vedas, Ten Principal Upanishads, Eighteen Maha Puranas, Shrimad Bhagavad Gita, Valmiki Ramayana, Mahabharata, Sacred Temple Chronicles, and Devotional Hymns—in English, Hindi (हिंदी), and Sanskrit (संस्कृत).
                  </p>
                  <p className="text-sm leading-relaxed">
                    To protect scriptural authenticity, every community-contributed text undergoes Admin Verification before appearing in the public library.
                  </p>
                </>
              )}

              {activeView === 'contact' && (
                <>
                  <h1 className="text-3xl font-black">Contact &amp; Seva Inquiries</h1>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      showToast('Thank you! Your message has been received by the Sanatan Setu Seva team.');
                      setContactForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    className="space-y-4 pt-2"
                  >
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Your Name"
                      className={`w-full px-4 py-3 rounded-xl border text-sm ${
                        darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'
                      }`}
                    />
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="Your Email"
                      className={`w-full px-4 py-3 rounded-xl border text-sm ${
                        darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'
                      }`}
                    />
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Share your feedback, scriptural reference, or inquiry..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm ${
                        darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'
                      }`}
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-[#EA580C] text-white text-xs font-bold uppercase tracking-wider"
                    >
                      Send Message
                    </button>
                  </form>
                </>
              )}

              {activeView === 'privacy' && (
                <>
                  <h1 className="text-3xl font-black">Privacy Policy</h1>
                  <p className="text-sm leading-relaxed">
                    Sanatan Setu respects your spiritual privacy. Your Naam Jaap mala counts, bookmarks, likes, and theme preferences are stored locally on your device using browser storage without third-party tracking.
                  </p>
                </>
              )}

              {activeView === 'disclaimer' && (
                <>
                  <h1 className="text-3xl font-black">Scriptural Disclaimer</h1>
                  <p className="text-sm leading-relaxed">
                    All Vedic mantras, stotrams, temple chronicles, and commentaries presented on Sanatan Setu Library are shared in reverence to the eternal Sanatan Dharma tradition for spiritual study, devotion, and cultural preservation.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sacred Item Unabridged Detail Reader Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleCloseItem}
        >
          <article
            itemScope
            itemType="https://schema.org/Article"
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border shadow-2xl relative ${
              darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseItem}
              aria-label="Close reader"
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/65 hover:bg-black text-white z-20 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Hero Image Banner — Accurately Fitted Dual-Layer Frame with Fit/Fill Switcher */}
            <div className="h-72 sm:h-96 relative bg-[#120A06]">
              <SacredImageFrame
                src={selectedItem.imageUrl || fallbackArtworkForItem(selectedItem)}
                fallbackSrc={selectedItem.fallbackImageUrl || fallbackArtworkForItem(selectedItem)}
                alt={selectedItem.title}
                mode={imageFitMode}
                className="w-full h-full"
              />
              <button
                type="button"
                onClick={() => setImageFitMode((prev) => (prev === 'contain-blur' ? 'cover-top' : 'contain-blur'))}
                className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/65 hover:bg-black text-amber-200 text-xs font-bold border border-amber-400/30 transition-all"
              >
                🖼️ {imageFitMode === 'contain-blur' ? 'Full Image Fit' : 'Fill Frame'}
              </button>
              <button
                type="button"
                onClick={handleTriggerAarti}
                className="absolute top-4 left-40 z-20 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EA580C] to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 transition-all"
              >
                🪔 Perform Aarti
              </button>
              {isAartiActive && (
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <div className="animate-aarti-orbit flex flex-col items-center">
                    <span className="text-5xl drop-shadow-[0_0_20px_rgba(251,191,36,0.95)]">🪔</span>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#EA580C] text-xs font-bold uppercase tracking-wider">
                    {selectedItem.sanskritBadge || selectedItem.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Admin Verified Authentic
                  </span>
                  {selectedItem.author && (
                    <span className="text-xs text-amber-200/90 font-medium">
                      Source: {selectedItem.author}
                    </span>
                  )}
                </div>
                <h1 itemProp="headline" className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {selectedItem.title}
                </h1>
              </div>
            </div>

            {/* Reader Toolbar: Language Switcher, Audio TTS, Font Size, Share */}
            <div className="p-6 sm:p-8 space-y-6">
              <div
                className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${
                  darkMode ? 'border-amber-500/20' : 'border-amber-900/10'
                }`}
              >
                {/* Language Switcher Tabs + All 27 Indian & World Languages Selector */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { id: 'English', label: 'English' },
                    { id: 'Hindi', label: 'हिन्दी' },
                    { id: 'Sanskrit', label: 'संस्कृतम्' },
                    { id: 'Odia', label: 'ଓଡ଼ିଆ' },
                    { id: 'Tamil', label: 'தமிழ்' },
                    { id: 'Bengali', label: 'বাংলা' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailLang(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        detailLang === tab.id
                          ? 'bg-[#EA580C] text-white shadow-md'
                          : darkMode
                          ? 'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
                          : 'bg-amber-100 text-[#78523A] hover:bg-amber-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}

                  <select
                    value={detailLang}
                    onChange={(e) => setDetailLang(e.target.value)}
                    aria-label="Select any Indian or World language"
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode
                        ? 'bg-[#22160F] border-amber-500/30 text-amber-100'
                        : 'bg-amber-50 border-amber-900/20 text-[#2C1A12]'
                    }`}
                  >
                    <optgroup label="🇮🇳 Indian Languages (15)">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group !== 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🌍 World Languages (12)">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group === 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Action Buttons: Listen, Font Size, Like, Copy Share Link */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      handleToggleSpeech(getBodyForLanguage(selectedItem, detailLang), detailLang)
                    }
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSpeaking
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500/15 text-[#EA580C] hover:bg-amber-500/25'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setReaderFontSize((prev) =>
                        prev === 'base' ? 'lg' : prev === 'lg' ? 'xl' : 'base'
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold hover:bg-amber-500/25"
                    title="Cycle Reader Font Size"
                  >
                    Aa ({readerFontSize.toUpperCase()})
                  </button>

                  <button
                    onClick={(e) => toggleLike(selectedItem.id, e)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
                      likedIds.includes(selectedItem.id)
                        ? 'bg-red-500/15 text-red-500 border-red-500/30'
                        : 'bg-amber-500/10 border-amber-500/20'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedIds.includes(selectedItem.id) ? 'fill-red-500 text-red-500' : ''
                      }`}
                    />
                    <span>{selectedItem.likes || 0}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleCopyText(
                        `${window.location.origin}/#article/${selectedItem.id}`,
                        'Shareable SEO Article Link copied!'
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/25"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Quick Edit Content Banner */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div
                  className={`flex-1 p-4 rounded-2xl border text-xs sm:text-sm italic ${
                    darkMode
                      ? 'bg-[#21150E] border-amber-500/20 text-amber-200/90'
                      : 'bg-amber-100/60 border-amber-900/15 text-[#78523A]'
                  }`}
                >
                  {selectedItem.description}
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    type="button"
                    onClick={() => openSacredPrintablePdf(selectedItem, detailLang)}
                    className="px-4 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>📄 Open / Download PDF eBook</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingItem(selectedItem)}
                    className="px-4 py-3 rounded-2xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Content / Media</span>
                  </button>
                </div>
              </div>

              {/* Built-In Sacred Cinema & YouTube Video Player (Always Plays With Sound & Synchronized Verses!) */}
              <SacredVideoPlayer item={selectedItem} darkMode={darkMode} lang={detailLang} />

              {/* Embedded PDF Viewer & Download (supports both uploaded PDFs and built-in Sacred PDF eBooks) */}
              {selectedItem.pdfUrl && (
                <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-[#1F140E] border-amber-500/25' : 'bg-amber-50/70 border-amber-900/15'}`}>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Sacred PDF eBook Ready {selectedItem.pdfFileName ? `(${selectedItem.pdfFileName})` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => openSacredPrintablePdf(selectedItem, detailLang)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow"
                    >
                      🖨️ Open Printable PDF eBook (Sanskrit + Hindi + English)
                    </button>
                  </div>
                  {selectedItem.pdfUrl !== '#auto-pdf' && (
                    <iframe
                      src={selectedItem.pdfUrl}
                      title={`${selectedItem.title} PDF`}
                      className="w-full h-96 rounded-xl border border-amber-500/20 bg-white"
                    />
                  )}
                </div>
              )}

              {/* Complete Unabridged Body Text */}
              <div
                itemProp="articleBody"
                className={`max-w-none leading-relaxed whitespace-pre-line ${
                  readerFontSize === 'xl'
                    ? 'text-lg sm:text-xl'
                    : readerFontSize === 'lg'
                    ? 'text-base sm:text-lg'
                    : 'text-sm sm:text-base'
                } ${
                  detailLang === 'Sanskrit' || detailLang === 'Hindi' ? 'font-serif' : 'font-sans'
                } ${darkMode ? 'text-amber-50/95' : 'text-[#2C1A12]'}`}
              >
                {getBodyForLanguage(selectedItem, detailLang)}
              </div>

              {/* Tags Footer */}
              <div
                className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
                  darkMode ? 'border-amber-500/20' : 'border-amber-900/10'
                }`}
              >
                <div className="flex flex-wrap gap-2">
                  {(selectedItem.tags || []).map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        darkMode ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-100 text-[#9A3412]'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() =>
                    handleCopyText(
                      `${selectedItem.title}\n\n${getBodyForLanguage(selectedItem, detailLang)}`,
                      'Complete scripture text copied!'
                    )
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {/* Upload / Contribute Sacred Knowledge Modal (Requires Admin Approval) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 border shadow-2xl relative max-h-[92vh] overflow-y-auto ${
              darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <button
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin-Moderated Authentic Submission</span>
            </div>
            <h2 className="text-2xl font-black mb-1">Upload Sacred Content</h2>
            <p className={`text-xs mb-5 ${darkMode ? 'text-amber-300/75' : 'text-[#78523A]'}`}>
              To preserve scriptural authenticity, uploaded content is sent to the Admin Approval Queue and published only after Admin verification. Full unabridged texts are preserved without length limits.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    placeholder="e.g. Shiva Tandava Stotram – Complete 17 Verses"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Scriptural Source / Author
                  </label>
                  <input
                    type="text"
                    value={uploadForm.author}
                    onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })}
                    placeholder="e.g. Ravana Kruta / Shiva Purana"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Category *
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.sanskrit})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Primary Language (27 Supported)
                  </label>
                  <select
                    value={uploadForm.language}
                    onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  >
                    <optgroup label="🇮🇳 Indian Languages">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group !== 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🌍 World Languages">
                      {SUPPORTED_LANGUAGES.filter((l) => l.group === 'World').map((l) => (
                        <option key={l.id} value={l.id}>{l.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    SEO Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    placeholder="shiva, stotram, vedic"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                  Summary / SEO Description *
                </label>
                <input
                  type="text"
                  required
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Concise summary of this sacred scripture or temple history..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                    darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                  }`}
                />
              </div>

              {/* Image URL or Direct Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Image URL (Optional — Auto-generates Vedic Art if blank)
                  </label>
                  <input
                    type="text"
                    value={uploadForm.imageUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
                    placeholder="https://... or upload image file ->"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Or Upload Copyright-Free Image File
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, false)}
                    className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EA580C] file:text-white hover:file:bg-orange-700"
                  />
                </div>
              </div>

              {/* PDF Document Upload / Link & YouTube Video Link */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Upload PDF Document (.pdf)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => handlePdfFileChange(e, false)}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700"
                  />
                  {uploadForm.pdfFileName && (
                    <span className="text-[11px] text-emerald-500 font-bold block mt-1">
                      Attached: {uploadForm.pdfFileName}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Or Paste PDF Direct URL
                  </label>
                  <input
                    type="text"
                    value={uploadForm.pdfUrl.startsWith('data:') ? '' : uploadForm.pdfUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, pdfUrl: e.target.value })}
                    placeholder="https://.../scripture.pdf"
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    YouTube Video Link / MP4 URL
                  </label>
                  <input
                    type="text"
                    value={uploadForm.videoUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              {/* Full Unshortened Content Bodies */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                  Full Unabridged Content — English / Transliteration &amp; Meaning *
                </label>
                <textarea
                  rows={5}
                  value={uploadForm.bodyEnglish}
                  onChange={(e) => setUploadForm({ ...uploadForm, bodyEnglish: e.target.value })}
                  placeholder="Paste the complete, unabridged English text, transliteration, and verse-by-verse meaning..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                    darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Full Hindi Text (हिंदी पाठ व भावार्थ)
                  </label>
                  <textarea
                    rows={4}
                    value={uploadForm.bodyHindi}
                    onChange={(e) => setUploadForm({ ...uploadForm, bodyHindi: e.target.value })}
                    placeholder="सम्पूर्ण हिंदी पाठ और अर्थ यहाँ लिखें..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    Full Sanskrit Verses (संस्कृत मूल श्लोक)
                  </label>
                  <textarea
                    rows={4}
                    value={uploadForm.bodySanskrit}
                    onChange={(e) => setUploadForm({ ...uploadForm, bodySanskrit: e.target.value })}
                    placeholder="मूल संस्कृत श्लोक / मंत्र यहाँ लिखें..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              {/* Additional Indian or World Language Text (Odia, Tamil, Telugu, Bengali, Spanish, French, etc.) */}
              <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label className="text-xs font-bold uppercase text-[#EA580C]">
                    Add Translation in Any Indian or World Language (Optional)
                  </label>
                  <select
                    value={uploadForm.extraLang}
                    onChange={(e) => setUploadForm({ ...uploadForm, extraLang: e.target.value })}
                    className={`px-3 py-1 rounded-xl border text-xs font-bold ${
                      darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-100' : 'bg-white border-amber-900/20'
                    }`}
                  >
                    {SUPPORTED_LANGUAGES.filter((l) => !['English', 'Hindi', 'Sanskrit'].includes(l.id)).map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={uploadForm.bodyExtraLang}
                  onChange={(e) => setUploadForm({ ...uploadForm, bodyExtraLang: e.target.value })}
                  placeholder={`Paste translation in ${uploadForm.extraLang}...`}
                  className={`w-full px-3.5 py-2 rounded-xl border text-xs focus:outline-none focus:border-[#EA580C] ${
                    darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                  }`}
                />
              </div>

              {isAdminAuthenticated && (
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={uploadForm.publishDirectlyAsAdmin}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, publishDirectlyAsAdmin: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span>Admin Override: Approve &amp; publish immediately to public library</span>
                </label>
              )}

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-amber-500/30 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow-md transition-all"
                >
                  {isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin
                    ? 'Approve & Publish Now'
                    : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Sacred Content Modal (Edit Text, Real Image, PDF, YouTube Video, and Any of 27 Languages) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 border shadow-2xl relative max-h-[92vh] overflow-y-auto ${
              darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/20"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-1">Edit Sacred Content &amp; Media</h2>
            <p className={`text-xs mb-4 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
              Update title, category, copyright-free image, PDF attachment, YouTube video link, or translations in 27 Indian &amp; World languages.
            </p>
            <form onSubmit={handleSaveEditedItem} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} ({c.sanskrit})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Description *</label>
                <input
                  type="text"
                  required
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                    darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                  }`}
                />
              </div>

              {/* Image URL or File Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingItem.imageUrl?.startsWith('data:') ? '' : editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://commons.wikimedia.org/..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Or Upload New Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileChange(e, true)}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EA580C] file:text-white"
                  />
                </div>
              </div>

              {/* PDF Upload / URL & YouTube Video URL */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Upload PDF (.pdf)</label>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => handlePdfFileChange(e, true)}
                    className="w-full text-xs file:mr-2 file:py-1.5 file:px-2.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Or PDF Direct URL</label>
                  <input
                    type="text"
                    value={editingItem.pdfUrl?.startsWith('data:') ? '' : editingItem.pdfUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, pdfUrl: e.target.value })}
                    placeholder="https://.../file.pdf"
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">YouTube / Video URL</label>
                  <input
                    type="text"
                    value={editingItem.videoUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">English Body</label>
                <textarea
                  rows={4}
                  value={typeof editingItem.body === 'object' ? editingItem.body.English || '' : editingItem.body || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      body: {
                        ...(typeof editingItem.body === 'object' ? editingItem.body : {}),
                        English: e.target.value
                      }
                    })
                  }
                  className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                    darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Hindi Body (हिन्दी)</label>
                  <textarea
                    rows={3}
                    value={typeof editingItem.body === 'object' ? editingItem.body.Hindi || '' : ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        body: {
                          ...(typeof editingItem.body === 'object' ? editingItem.body : {}),
                          Hindi: e.target.value
                        }
                      })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">Sanskrit Body (संस्कृतम्)</label>
                  <textarea
                    rows={3}
                    value={typeof editingItem.body === 'object' ? editingItem.body.Sanskrit || '' : ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        body: {
                          ...(typeof editingItem.body === 'object' ? editingItem.body : {}),
                          Sanskrit: e.target.value
                        }
                      })
                    }
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              </div>

              {/* Edit Translation for Currently Active Reader Language (any of the 27 Indian/World languages) */}
              {!['English', 'Hindi', 'Sanskrit'].includes(detailLang) && (
                <div>
                  <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                    {detailLang} Translation Body
                  </label>
                  <textarea
                    rows={3}
                    value={typeof editingItem.body === 'object' ? editingItem.body[detailLang] || '' : ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        body: {
                          ...(typeof editingItem.body === 'object' ? editingItem.body : {}),
                          [detailLang]: e.target.value
                        }
                      })
                    }
                    placeholder={`Enter ${detailLang} translation...`}
                    className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO-Friendly Semantic Footer */}
      <footer
        role="contentinfo"
        className="bg-[#1C0F0A] text-amber-100/90 mt-16 border-t border-amber-500/20 py-10 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <SanatanSetuLogo size={38} />
            <div>
              <div className="font-bold text-sm text-white">Sanatan Setu Library</div>
              <p className="text-amber-300/70">
                © 2026 Sanatan Setu Library · Authentic Admin-Moderated Vedic Scripture Archive
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 font-semibold">
            <button onClick={() => setActiveView('home')} className="hover:text-amber-300">
              Library
            </button>
            <button onClick={() => setActiveView('jaap')} className="hover:text-amber-300">
              108 Naam Jaap
            </button>
            <button onClick={() => setActiveView('admin')} className="hover:text-amber-300">
              Admin Approval ({pendingItems.length})
            </button>
            <button onClick={() => setActiveView('about')} className="hover:text-amber-300">
              About Us
            </button>
            <button onClick={() => setActiveView('contact')} className="hover:text-amber-300">
              Contact
            </button>
            <button onClick={() => setActiveView('privacy')} className="hover:text-amber-300">
              Privacy Policy
            </button>
            <button onClick={() => setActiveView('disclaimer')} className="hover:text-amber-300">
              Disclaimer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
