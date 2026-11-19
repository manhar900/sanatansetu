import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Plus, ChevronRight,
  Check, FileText
} from 'lucide-react';

// Default Admin Password (override via VITE_ADMIN_PASSWORD in Vercel Environment Variables if desired)
export const DEFAULT_ADMIN_PASSCODE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD) ||
  'admin108';

// Traditional Handcrafted Vedic 8-Petal Lotus (Padma) Emblem
export const SacredLotusIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 2.5C10.2 5.6 9.3 8.4 9.5 11.2C8.1 9.1 6.1 7.6 3.5 7.2C4.8 10.1 6.7 12.2 9.1 13.4C6.4 13.2 3.9 14.1 2 16C4.9 16.9 7.8 16.7 10.4 15.5C9.6 17.5 9.8 19.5 12 21.5C14.2 19.5 14.4 17.5 13.6 15.5C16.2 16.7 19.1 16.9 22 16C20.1 14.1 17.6 13.2 14.9 13.4C17.3 12.2 19.2 10.1 20.5 7.2C17.9 7.6 15.9 9.1 14.5 11.2C14.7 8.4 13.8 5.6 12 2.5Z" />
  </svg>
);

// Compresses uploaded cover photos so they fit cleanly in localStorage, IndexedDB, and /api/sync payloads
export function compressCoverImageFile(file, maxWidth = 1000, quality = 0.78) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawDataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!rawDataUrl || typeof Image === 'undefined') {
        resolve(rawDataUrl);
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (e) {
          resolve(rawDataUrl);
        }
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

// 27 Supported Languages: Top 15 Indian Languages + Top 12 World Languages
export const SUPPORTED_LANGUAGES = [
  { id: 'Sanskrit', label: 'Sanskrit (संस्कृतम्)', native: 'संस्कृतम्', group: 'Indian', locale: 'hi-IN' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)', native: 'हिन्दी', group: 'Indian', locale: 'hi-IN' },
  { id: 'English', label: 'English', native: 'English', group: 'Indian & Global', locale: 'en-IN' },
  { id: 'Odia', label: 'Odia (ଓଡ଼ିଆ)', native: 'ଓଡ଼ିଆ', group: 'Indian', locale: 'or-IN' },
  { id: 'Bengali', label: 'Bengali (বাংলা)', native: 'বাংলা', group: 'Indian', locale: 'bn-IN' },
  { id: 'Marathi', label: 'Marathi (मराठी)', native: 'मराठी', group: 'Indian', locale: 'mr-IN' },
  { id: 'Gujarati', label: 'Gujarati (ગુજરાતી)', native: 'ગુજરાતી', group: 'Indian', locale: 'gu-IN' },
  { id: 'Tamil', label: 'Tamil (தமிழ்)', native: 'தமிழ்', group: 'Indian', locale: 'ta-IN' },
  { id: 'Telugu', label: 'Telugu (తెలుగు)', native: 'తెలుగు', group: 'Indian', locale: 'te-IN' },
  { id: 'Kannada', label: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ', group: 'Indian', locale: 'kn-IN' },
  { id: 'Malayalam', label: 'Malayalam (മലയാളം)', native: 'മലയാളം', group: 'Indian', locale: 'ml-IN' },
  { id: 'Punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)', native: 'ਪੰਜਾਬੀ', group: 'Indian', locale: 'pa-IN' },
  { id: 'Assamese', label: 'Assamese (অসমীয়া)', native: 'অসমীয়া', group: 'Indian', locale: 'as-IN' },
  { id: 'Maithili', label: 'Maithili (मैथिली)', native: 'मैथिली', group: 'Indian', locale: 'hi-IN' },
  { id: 'Nepali', label: 'Nepali (नेपाली)', native: 'नेपाली', group: 'Indian', locale: 'ne-NP' },
  { id: 'Spanish', label: 'Spanish (Español)', native: 'Español', group: 'World', locale: 'es-ES' },
  { id: 'French', label: 'French (Français)', native: 'Français', group: 'World', locale: 'fr-FR' },
  { id: 'German', label: 'German (Deutsch)', native: 'Deutsch', group: 'World', locale: 'de-DE' },
  { id: 'Russian', label: 'Russian (Русский)', native: 'Русский', group: 'World', locale: 'ru-RU' },
  { id: 'Japanese', label: 'Japanese (日本語)', native: '日本語', group: 'World', locale: 'ja-JP' },
  { id: 'Chinese', label: 'Chinese (中文)', native: '中文', group: 'World', locale: 'zh-CN' },
  { id: 'Arabic', label: 'Arabic (العربية)', native: 'العربية', group: 'World', locale: 'ar-SA' },
  { id: 'Portuguese', label: 'Portuguese (Português)', native: 'Português', group: 'World', locale: 'pt-BR' },
  { id: 'Indonesian', label: 'Indonesian (Bahasa Indonesia)', native: 'Bahasa Indonesia', group: 'World', locale: 'id-ID' },
  { id: 'Thai', label: 'Thai (ไทย)', native: 'ไทย', group: 'World', locale: 'th-TH' },
  { id: 'Korean', label: 'Korean (한국어)', native: '한국어', group: 'World', locale: 'ko-KR' },
  { id: 'Italian', label: 'Italian (Italiano)', native: 'Italiano', group: 'World', locale: 'it-IT' }
];

export const SECURE_PROTO = ['htt', 'ps://'].join('');

export function cleanExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let u = rawUrl.trim();
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
    <div class="meta">Source / Tradition: ${esc(item.author || 'Vedic Tradition')} · Sanatan Setu Library</div>
    <p style="font-style:italic; font-size:14px; margin-top:10px;">${esc(item.description)}</p>
  </div>
  ${sanText ? `<div class="section-title">॥ मूल संस्कृत पाठ (Original Sanskrit Verses) ॥</div><div class="content">${esc(sanText)}</div>` : ''}
  ${hinText ? `<div class="section-title">॥ हिन्दी भावार्थ एवं संपूर्ण पाठ (Hindi Text & Meaning) ॥</div><div class="content">${esc(hinText)}</div>` : ''}
  ${engText ? `<div class="section-title">॥ Complete English Text & Commentary ॥</div><div class="content">${esc(engText)}</div>` : ''}
</body>
</html>`);
  win.document.close();
}

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
      tx.objectStore(this.storeName).put(itemsArray, 'all_items_v6');
    } catch (e) {}
  },
  async loadItems() {
    try {
      const db = await this.open();
      return await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const req = tx.objectStore(this.storeName).get('all_items_v6');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }
};

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
    <text x="32" y="43" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="bold" fontFamily="serif">ॐ</text>
  </svg>
);

export const SacredAnimationsStyle = () => (
  <style>{`
    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 20px rgba(234, 88, 12, 0.4), 0 0 45px rgba(245, 158, 11, 0.22); }
      50% { box-shadow: 0 0 36px rgba(234, 88, 12, 0.75), 0 0 70px rgba(245, 158, 11, 0.45); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes sacredMarquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
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
    .animate-spin-slow { animation: spinSlow 36s linear infinite; }
    .animate-pulse-glow { animation: pulseGlow 2.8s ease-in-out infinite; }
    .animate-fade-in-up { animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-sacred-marquee { display: flex; width: max-content; animation: sacredMarquee 34s linear infinite; }
    .animate-sacred-marquee:hover { animation-play-state: paused; }
    .animate-aarti-orbit { animation: aartiOrbit 4.2s linear infinite; }
    .animate-diya-flicker { animation: diyaFlicker 0.9s ease-in-out infinite; }
    .animate-chant-particle { animation: chantParticleUp 1.1s ease-out forwards; }
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
    english: 'We worship the Three-Eyed Lord Shiva, fragrant and nourishing all beings. May He liberate us from mortality and grant us immortality.',
    hindi: 'हम सुगंधित और पुष्टि के वर्धक तीन नेत्रों वाले भगवान शिव की आराधना करते हैं; वे हमें मृत्यु के बंधन से मुक्त करें और अमृतत्व प्रदान करें।'
  }
];

export const SacredImageFrame = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  imgClassName = '',
  mode = 'contain-blur'
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
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        onError={handleError}
        className="absolute inset-0 w-full h-full object-cover object-center scale-125 blur-xl opacity-65 pointer-events-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none" />
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

// Error-153-Free On-Site Sacred Video & YouTube Player
export const SacredVideoPlayer = ({ item, darkMode, lang = 'English' }) => {
  const playerContainerRef = useRef(null);
  const cleanedVideoUrl = cleanExternalUrl(item?.videoUrl || '');
  const ytId = extractYouTubeId(cleanedVideoUrl);
  const isDirectVideoFile =
    cleanedVideoUrl.startsWith('data:video/') ||
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(cleanedVideoUrl);

  const [playerMode, setPlayerMode] = useState('cinema');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [chimeActive, setChimeActive] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const ytThumbUrl = ytId
    ? `${SECURE_PROTO}${['i', 'ytimg', 'com'].join('.')}/vi/${ytId}/hqdefault.jpg`
    : null;

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
    }, Math.round(1000 / playbackSpeed));
    return () => clearInterval(interval);
  }, [isPlaying, totalSec, lines.length, chimeActive, playbackSpeed]);

  useEffect(() => {
    if (!isPlaying || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = lines[currentLineIdx] || item.title;
      const utt = new SpeechSynthesisUtterance(textToSpeak);
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
      utt.lang = langObj?.locale || (lang === 'English' ? 'en-IN' : 'hi-IN');
      utt.rate = 0.92 * playbackSpeed;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }, [isPlaying, currentLineIdx, lines, lang, item?.title, playbackSpeed]);

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

  const handleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      el.requestFullscreen?.().catch(() => {});
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-[#1F140E] border-amber-500/30' : 'bg-amber-50/80 border-amber-900/15'}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#EA580C] flex items-center gap-1.5">
            <Play className="w-4 h-4 fill-[#EA580C]" /> In-App Sacred Video Player
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
            ✓ HD On-Site Playback (Error-153 Free)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setPlayerMode('youtube');
              if (!isPlaying) togglePlay();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all ${
              playerMode === 'youtube'
                ? 'bg-red-600 text-white'
                : 'bg-amber-500/15 text-[#EA580C] hover:bg-amber-500/25'
            }`}
          >
            <span>▶️ YouTube Cover Stream</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlayerMode('cinema');
              if (!isPlaying) togglePlay();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-orange-600 text-white text-xs font-bold shadow flex items-center gap-1 transition-all"
          >
            🎬 Sacred Cinema Player
          </button>
        </div>
      </div>

      {isDirectVideoFile ? (
        <video
          src={cleanedVideoUrl}
          controls
          playsInline
          className="w-full rounded-2xl max-h-96 bg-black border border-amber-500/30"
        />
      ) : (
        <div
          ref={playerContainerRef}
          onClick={togglePlay}
          className="cursor-pointer relative w-full overflow-hidden rounded-2xl aspect-video bg-[#0B0704] border border-amber-500/30 shadow-2xl flex flex-col justify-between p-4 sm:p-6 text-white select-none group"
        >
          <img
            src={playerMode === 'youtube' && ytThumbUrl ? ytThumbUrl : cleanExternalUrl(item.imageUrl)}
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = cleanExternalUrl(item.imageUrl) || item.fallbackImageUrl || '';
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ${
              isPlaying ? 'scale-110 opacity-55' : 'scale-100 opacity-65 group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/60 pointer-events-none" />

          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-dashed border-amber-400/35 ${
              isPlaying ? 'animate-spin-slow opacity-90' : 'opacity-20'
            }`}
          />

          <div onClick={(e) => e.stopPropagation()} className="relative z-10 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-[#EA580C] flex items-center justify-center font-serif font-bold text-sm shadow shrink-0">
                ॐ
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">{item.title}</div>
                <div className="text-[10px] text-amber-300/90 font-semibold">
                  Sanatan Setu HD Sacred Stream · {lang} Audio &amp; Subtitles
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`px-2 py-1 rounded text-[10px] font-extrabold border transition-all ${
                  showSubtitles
                    ? 'bg-red-600 border-red-500 text-white'
                    : 'bg-black/60 border-white/20 text-white/70'
                }`}
              >
                CC
              </button>
              <button
                type="button"
                onClick={() => setChimeActive(!chimeActive)}
                className="px-2.5 py-1 rounded-full bg-black/65 border border-amber-400/30 text-amber-200 text-[11px] font-bold"
              >
                {chimeActive ? '🔔 528Hz' : '🔕 Muted'}
              </button>
            </div>
          </div>

          <div className="relative z-10 my-auto text-center max-w-2xl mx-auto space-y-3 px-2">
            {!isPlaying && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                aria-label="Play Video"
                className="mx-auto w-20 h-14 sm:w-24 sm:h-16 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-[0_0_35px_rgba(220,38,38,0.8)] flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all"
              >
                <Play className="w-9 h-9 fill-white ml-1" />
              </button>
            )}

            {showSubtitles && (
              <div className="bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-amber-400/30 shadow-xl">
                <p className="font-serif text-sm sm:text-lg md:text-xl font-bold text-amber-100 leading-relaxed line-clamp-3">
                  {lines[currentLineIdx] || item.title}
                </p>
                <div className="text-[10px] text-amber-300/80 font-semibold mt-1">
                  Verse {currentLineIdx + 1} of {lines.length} · {isPlaying ? '🔊 Playing On-Site Audio Stream' : 'Click Play to Start Video & Audio'}
                </div>
              </div>
            )}
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 space-y-2 bg-black/75 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10"
          >
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
              className="w-full accent-red-600 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-xs font-bold flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 shadow"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Pause' : 'Play Video'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLineIdx((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentLineIdx((prev) => Math.min(lines.length - 1, prev + 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200"
                >
                  Next ▶
                </button>
                <button
                  type="button"
                  onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.25 : s === 1.25 ? 0.85 : 1))}
                  className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-[11px]"
                >
                  {playbackSpeed}x
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-amber-200/90 font-mono text-[11px]">
                  {fmt(elapsedSec)} / {fmt(totalSec)}
                </span>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  title="Toggle Fullscreen Video"
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/25 text-white text-xs font-bold"
                >
                  ⛶
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
      <rect x="382" y="310" width="36" height="80" rx="18" fill="#1c0a00" stroke="${accent}" stroke-width="2"/>
    `,
    lotus: `
      <g transform="translate(400,245)">
        <ellipse cx="0" cy="0" rx="38" ry="95" fill="${accent}" fill-opacity="0.28" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(30)" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="38" ry="95" transform="rotate(-30)" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <circle cx="0" cy="0" r="32" fill="${c1}" stroke="${accent}" stroke-width="2.5"/>
      </g>
    `,
    chakra: `
      <g transform="translate(400,245)">
        <circle cx="0" cy="0" r="115" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="10 6"/>
        <circle cx="0" cy="0" r="92" fill="${accent}" fill-opacity="0.15" stroke="${accent}" stroke-width="2.5"/>
        <circle cx="0" cy="0" r="28" fill="${c1}" stroke="${accent}" stroke-width="3"/>
      </g>
    `,
    trishul: `
      <g transform="translate(400,245)">
        <circle cx="0" cy="-10" r="96" fill="${accent}" fill-opacity="0.14" stroke="${accent}" stroke-width="2" stroke-dasharray="6 6"/>
        <path d="M0 -115 L0 125" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M-55 -75 C-55 -10, -15 -5, 0 -15 C15 -5, 55 -10, 55 -75" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      </g>
    `,
    diya: `
      <g transform="translate(400,265)">
        <circle cx="0" cy="-45" r="85" fill="${accent}" fill-opacity="0.18"/>
        <path d="M0 -125 C28 -85, 34 -45, 0 -20 C-34 -45, -28 -85, 0 -125 Z" fill="#fde047" stroke="#f97316" stroke-width="3"/>
        <path d="M-110 -15 Q0 15 110 -15 L85 45 Q0 70 -85 45 Z" fill="${accent}" fill-opacity="0.45" stroke="${accent}" stroke-width="3"/>
      </g>
    `,
    scripture: `
      <g transform="translate(400,250)">
        <rect x="-135" y="-65" width="270" height="130" rx="16" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="3"/>
        <rect x="-120" y="-50" width="240" height="100" rx="10" fill="${c1}" fill-opacity="0.65" stroke="${accent}" stroke-width="1.5"/>
      </g>
    `,
    himalaya: `
      <g>
        <circle cx="400" cy="175" r="72" fill="#fef08a" fill-opacity="0.28" stroke="${accent}" stroke-width="2"/>
        <polygon points="80,390 250,150 410,390" fill="${accent}" fill-opacity="0.22" stroke="${accent}" stroke-width="2"/>
        <polygon points="240,390 420,110 600,390" fill="${accent}" fill-opacity="0.34" stroke="${accent}" stroke-width="2.5"/>
      </g>
    `,
    bow: `
      <g transform="translate(400,245)">
        <path d="M-85 -95 Q75 0 -85 95" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
        <line x1="-85" y1="-95" x2="-85" y2="95" stroke="#fef08a" stroke-width="2.5"/>
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
    </defs>
    <rect width="800" height="500" fill="url(#bg)"/>
    <rect x="18" y="18" width="764" height="464" rx="22" fill="none" stroke="${accent}" stroke-opacity="0.38" stroke-width="2"/>
    ${selectedMotif}
    <text x="400" y="72" text-anchor="middle" fill="${accent}" font-family="serif" font-size="28" font-weight="bold">${safe(sanskrit)}</text>
    <rect x="110" y="398" width="580" height="62" rx="14" fill="#0f0702" fill-opacity="0.68" stroke="${accent}" stroke-opacity="0.45" stroke-width="1.5"/>
    <text x="400" y="426" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">${safe(title.length > 48 ? title.slice(0, 46) + '...' : title)}</text>
    <text x="400" y="448" text-anchor="middle" fill="${accent}" font-family="sans-serif" font-size="13" font-weight="bold">${safe(subtitle.toUpperCase())}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CATEGORIES = [
  { id: 'Vedas', code: 'VED', name: 'Vedas', sanskrit: 'वेद', description: 'The eternal Shruti scriptures — Rigveda, Yajurveda, Samaveda, and Atharvaveda.', bgImage: createSacredArtwork({ title: 'The Four Eternal Vedas', sanskrit: 'वेदोऽखिलो धर्ममूलम्', subtitle: 'VED · Shruti Samhita', c1: '#3b0764', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'scripture' }) },
  { id: 'Upanishads', code: 'UPN', name: 'Upanishads', sanskrit: 'उपनिषद्', description: 'Philosophical teachings, Mahavakyas, and spiritual realizations of the Rishis.', bgImage: createSacredArtwork({ title: 'The Principal Upanishads', sanskrit: 'तत्त्वमसि · अहं ब्रह्मास्मि', subtitle: 'UPN · Vedanta Jnana', c1: '#1e1b4b', c2: '#431407', c3: '#b45309', accent: '#fbbf24', motif: 'lotus' }) },
  { id: 'Bhagavad Gita', code: 'BG', name: 'Bhagavad Gita', sanskrit: 'श्रीमद्भगवद्गीता', description: "Lord Krishna's celestial song to Arjuna on Karma, Bhakti, and Jnana Yoga.", bgImage: createSacredArtwork({ title: 'Shrimad Bhagavad Gita', sanskrit: 'कर्मण्येवाधिकारस्ते', subtitle: 'BG · Song of the Lord', c1: '#172554', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'chakra' }) },
  { id: 'Ramayana', code: 'RM', name: 'Ramayana', sanskrit: 'रामायण', description: 'Adi Kavya by Maharshi Valmiki illuminating Maryada Purushottama Sri Rama.', bgImage: createSacredArtwork({ title: 'Valmiki Ramayana', sanskrit: 'रामो विग्रहवान् धर्मः', subtitle: 'RM · Itihasa Adi-Kavya', c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'bow' }) },
  { id: 'Mahabharata', code: 'MB', name: 'Mahabharata', sanskrit: 'महाभारत', description: 'The grand 18-Parva epic by Maharshi Vedavyasa on Dharma and cosmic order.', bgImage: createSacredArtwork({ title: 'The Great Mahabharata', sanskrit: 'यतो धर्मस्ततो जयः', subtitle: 'MB · Jaya Samhita', c1: '#3f1d0b', c2: '#7f1d1d', c3: '#c2410c', accent: '#fbbf24', motif: 'chakra' }) },
  { id: 'Puranas', code: 'PUR', name: 'Puranas', sanskrit: 'पुराण', description: 'Eighteen sacred Maha Puranas narrating cosmic creation, avatars, and dharma.', bgImage: createSacredArtwork({ title: 'The 18 Maha Puranas', sanskrit: 'अष्टादश पुराणानि', subtitle: 'PUR · Cosmic Chronicles', c1: '#2e1065', c2: '#701a75', c3: '#c2410c', accent: '#fde68a', motif: 'scripture' }) },
  { id: 'Mantras', code: 'MTR', name: 'Mantras', sanskrit: 'मन्त्र', description: 'Sacred Vedic chants, Stotrams, and invocations for peace, healing, and Siddhi.', bgImage: createSacredArtwork({ title: 'Sacred Vedic Mantras', sanskrit: 'मननात् त्रायते इति मन्त्रः', subtitle: 'MTR · Divine Vibrations', c1: '#431407', c2: '#9a3412', c3: '#ea580c', accent: '#fef08a', motif: 'trishul' }) },
  { id: 'Bhajans', code: 'BHJ', name: 'Bhajans', sanskrit: 'भजन', description: 'Devotional Aartis, Stutis, and sacred hymns glorifying the Divine across ages.', bgImage: createSacredArtwork({ title: 'Sacred Bhajans & Aartis', sanskrit: 'भज गोविन्दं भज गोविन्दम्', subtitle: 'BHJ · Devotional Hymns', c1: '#4c0519', c2: '#9f1239', c3: '#ea580c', accent: '#fde047', motif: 'diya' }) },
  { id: 'Festivals', code: 'UTS', name: 'Festivals', sanskrit: 'उत्सव', description: 'Sacred Utsavs and Vrats — Deepavali, Navaratri, Maha Shivaratri, and Holi.', bgImage: createSacredArtwork({ title: 'Sacred Utsavs & Vrats', sanskrit: 'उत्सवप्रियाः खलु मनुष्याः', subtitle: 'UTS · Sacred Celebrations', c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'diya' }) },
  { id: 'Temples', code: 'MDR', name: 'Temples', sanskrit: 'मन्दिर', description: 'Char Dham, Jyotirlingas, Shaktipeethas, and sacred Mandir architecture.', bgImage: createSacredArtwork({ title: 'Sacred Hindu Temples', sanskrit: 'देवालयो नाम ब्रह्मस्थानम्', subtitle: 'MDR · Sacred Mandirs', c1: '#271206', c2: '#7c2d12', c3: '#ea580c', accent: '#fbbf24', motif: 'temple' }) },
  { id: 'Philosophy', code: 'DRS', name: 'Philosophy', sanskrit: 'दर्शन', description: 'Shad Darshana — Vedanta, Yoga, Samkhya, Nyaya, Vaisheshika, and Mimamsa.', bgImage: createSacredArtwork({ title: 'Shad Darshana Philosophy', sanskrit: 'दृश्यते अनेन इति दर्शनम्', subtitle: 'DRS · Six Orthodox Schools', c1: '#0f172a', c2: '#312e81', c3: '#b45309', accent: '#fde047', motif: 'lotus' }) },
  { id: 'Sant Teachings', code: 'SNT', name: 'Sant Teachings', sanskrit: 'सन्त वाणी', description: 'Timeless wisdom of Tulsidas, Kabir, Mirabai, Adi Shankara, and Bhakti saints.', bgImage: createSacredArtwork({ title: 'Sant Vani & Bhakti Movement', sanskrit: 'सन्त समागम हरि कथा', subtitle: 'SNT · Wisdom of Saints', c1: '#14532d', c2: '#78350f', c3: '#d97706', accent: '#fef08a', motif: 'himalaya' }) }
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
    imageUrl: createSacredArtwork({ title: 'Shree Jagannath Temple · Puri Dham', sanskrit: 'जय जगन्नाथ स्वामी नयन पथ गामी', subtitle: 'Purushottama Kshetra · Char Dham', c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'temple' }),
    tags: ['jagannath', 'puri', 'char-dham', 'odisha', 'ratha-yatra'],
    body: {
      English: `Shree Jagannath Temple in Puri, Odisha (ancient Purushottama Kshetra or Nilachala Dham), is one of the four supreme Char Dham pilgrimage sites of Sanatan Dharma established by Adi Shankaracharya. Dedicated to Lord Jagannath along with Lord Balabhadra, Devi Subhadra, and Sudarshana, the 214-foot-tall Kalinga temple is celebrated for Daru Brahma, Nabakalebara, the annual Rath Yatra, and Mahaprasad.`,
      Hindi: `श्री जगन्नाथ मंदिर, पुरी (ओडिशा) सनातन धर्म के चार सर्वोच्च धामों (चार धाम) में से पूर्वी धाम है, जिसे शास्त्रों में 'पुरुषोत्तम क्षेत्र' और 'नीलाचल धाम' कहा गया है। यहाँ भगवान जगन्नाथ, बलभद्र, सुभद्रा और सुदर्शन चक्र दारु ब्रह्म रूप में रत्नवेदी पर विराजमान हैं।`,
      Sanskrit: `नीलाचलनिवासाय नित्याय परमात्मने । बलभद्रसुभद्राभ्यां जगन्नाथाय ते नमः ॥`
    }
  },
  {
    id: 'kamakhya-temple-assam',
    title: 'Kamakhya Temple: The Womb of the Cosmic Mother (Maha Shaktipeeth)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: "A comprehensive guide to the Kamakhya Temple in Assam, its Tantric roots, Dasha Mahavidyas, and the annual Ambubachi Mela.",
    views: 11850,
    likes: 3125,
    language: 'Sanskrit',
    author: 'Kalika Purana & Yogini Tantra',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Maa Kamakhya Maha Shaktipeeth · Nilachal', sanskrit: 'कामाख्ये वरदे देवि नीलपर्वतवासिनि', subtitle: 'Guwahati, Assam · Supreme Shaktipeeth', c1: '#4c0519', c2: '#9f1239', c3: '#e11d48', accent: '#fde047', motif: 'lotus' }),
    tags: ['kamakhya', 'shaktipeeth', 'assam', 'devi', 'tantra'],
    body: {
      English: `Perched atop Nilachal Hill overlooking the Brahmaputra River in Guwahati, Assam, Maa Kamakhya Temple is the foremost among the 51 Shakti Peethas and a supreme center of Dasha Mahavidya worship and Ambubachi Mela.`,
      Hindi: `असम के गुवाहाटी में ब्रह्मपुत्र नदी के तट पर नीलाचल पर्वत पर स्थित माँ कामाख्या मंदिर ५१ शक्तिपीठों में सर्वोच्च 'महाशक्तिपीठ' तथा दश महाविद्या साधना का पावन केंद्र है।`,
      Sanskrit: `कामाख्ये वरदे देवि नीलपर्वतवासिनि । त्वं देवि जगतां मातर्योनिमुद्रे नमोऽस्तु ते ॥`
    }
  },
  {
    id: 'badrinath-dham-himalaya',
    title: 'Badrinath Dham: The Supreme Himalayan Abode of Lord Vishnu',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate guide to Badrinath Dham, the northern Char Dham along the Alaknanda River, Tapt Kund, and Vyas Gufa.',
    views: 16548,
    likes: 4512,
    language: 'Sanskrit',
    author: 'Skanda Purana & Bhagavata Purana',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Shree Badrinath Dham · Badrikashram', sanskrit: 'ॐ नमो भगवते वासुदेवाय · बदरीविशाल', subtitle: 'Uttarakhand Himalayas · Northern Char Dham', c1: '#0f172a', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'himalaya' }),
    tags: ['badrinath', 'vishnu', 'char-dham', 'himalayas', 'uttarakhand'],
    body: {
      English: `Situated at 3,133 meters between Nar and Narayana peaks along the Alaknanda River in Uttarakhand, Shree Badrinath Dham is the Northern Char Dham consecrated by Adi Shankaracharya.`,
      Hindi: `उत्तराखंड के चमोली जिले में अलकनंदा नदी के तट पर नर और नारायण पर्वत श्रेणियों के मध्य स्थित श्री बद्रीनाथ धाम सनातन धर्म के चार धामों में उत्तरी धाम है।`,
      Sanskrit: `तप्तकुण्डं सुपुण्यं च नरनारायणाश्रमम् । नीलकण्ठशिखराग्रं बदरीशं नमाम्यहम् ॥`
    }
  },
  {
    id: 'sri-ranganathaswamy-temple',
    title: 'Sri Ranganathaswamy Temple: The Largest Functioning Hindu Temple in the World',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Comprehensive guide to Sri Ranganathaswamy Temple in Srirangam, its 156-acre 7 Prakaras, 21 Gopurams, and Divya Desam heritage.',
    views: 15070,
    likes: 4210,
    language: 'English',
    author: 'Sriranga Mahatmyam & Divya Prabandham',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Sri Ranganathaswamy Temple · Srirangam', sanskrit: 'कवेरजातीरविहारिणे नमः श्रीरङ्गनाथाय', subtitle: '156-Acre Bhuloka Vaikuntha', c1: '#1e1b4b', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'temple' }),
    tags: ['srirangam', 'ranganatha', 'vishnu', 'architecture', 'tamil-nadu'],
    body: {
      English: `Situated on the Kaveri river island of Srirangam in Tamil Nadu, Sri Ranganathaswamy Temple spans 156 acres across 7 concentric Prakaras and 21 Gopurams as the foremost among the 108 Divya Desams.`,
      Hindi: `तमिलनाडु के तिरुचिरापल्ली में कावेरी नदी द्वीप पर १५६ एकड़ में फैला श्री रंगनाथस्वामी मंदिर विश्व का सबसे विशाल जीवंत हिंदू मंदिर परिसर एवं १०८ दिव्य देशमों में प्रथम है।`,
      Sanskrit: `कावेरीविरजा सेयं वैकुण्ठं रङ्गमन्दिरम् । स वासुदेवो रङ्गेशः प्रत्यक्षं परमं पदम् ॥`
    }
  },
  {
    id: 'angkor-wat-vishnu-temple',
    title: 'Angkor Wat: The Cosmic Temple of Lord Vishnu (Cambodia)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Discover Angkor Wat (Paramavishnuloka), the largest religious monument in the world dedicated to Lord Vishnu.',
    views: 10944,
    likes: 2940,
    language: 'English',
    author: 'Khmer Sanskrit Inscriptions',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Angkor Wat · Paramavishnuloka', sanskrit: 'ॐ नमो भगवते वासुदेवाय', subtitle: 'Siem Reap, Cambodia', c1: '#1c1917', c2: '#78350f', c3: '#d97706', accent: '#fde047', motif: 'temple' }),
    tags: ['angkor-wat', 'vishnu', 'cambodia', 'architecture'],
    body: {
      English: `Spanning 402 acres in Siem Reap, Cambodia, Angkor Wat (originally named Paramavishnuloka) was built in the 12th century by Emperor Suryavarman II as a stone replica of Mount Meru.`,
      Hindi: `कम्बोडिया के सिएम रीप में ४०२ एकड़ में फैला 'अंकोरवाट' ('परमविष्णुलोक') विश्व का सबसे विशाल धार्मिक स्मारक है, जो भगवान विष्णु एवं सुमेरु पर्वत का प्रतीक है।`,
      Sanskrit: `मेरुशृङ्गसमं रम्यं परमविष्णुलोककम् । सूर्यवर्मनृपेणैतत् निर्मितं विष्णुमन्दिरम् ॥`
    }
  },
  {
    id: 'sant-teachings-bhakti-movement',
    title: 'Sant Teachings: The Bhakti Movement and the Path of Divine Love',
    category: 'Sant Teachings',
    sanskritBadge: 'सन्त · Sant Vani',
    contentType: 'Text',
    description: 'Explore the Sant Parampara and Bhakti Movement through Kabir, Tulsidas, Mirabai, Surdas, and Tukaram.',
    views: 9845,
    likes: 2640,
    language: 'English',
    author: 'Bhaktamal & Sant Vani Sangraha',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Sant Parampara & The Bhakti Movement', sanskrit: 'प्रेम गली अति सांकरी तामें दो न समाहिं', subtitle: 'Kabir · Tulsidas · Mirabai · Surdas', c1: '#14532d', c2: '#78350f', c3: '#d97706', accent: '#fef08a', motif: 'diya' }),
    tags: ['bhakti', 'tulsidas', 'mirabai', 'kabir', 'sant-vani'],
    body: {
      English: `The Bhakti Movement united India through vernacular devotion led by Alvars, Nayanars, Goswami Tulsidas, Sant Kabir, Mirabai, Surdas, and Tukaram.`,
      Hindi: `भक्ति आन्दोलन ने सगुण और निर्गुण भक्ति धारा के माध्यम से जन-जन की भाषा में प्रेम, समता और नाम-स्मरण का अमर संदेश प्रवाहित किया।`,
      Sanskrit: `मच्चित्ता मद्गतप्राणा बोधयन्तः परस्परम् । कथयन्तश्च मां नित्यं तुष्यन्ति च रमन्ति च ॥`
    }
  },
  {
    id: 'hindu-philosophy-shad-darshana',
    title: 'Hindu Philosophy: The Six Orthodox Schools (Shad Darshana)',
    category: 'Philosophy',
    sanskritBadge: 'दर्शन · Darshana',
    contentType: 'Text',
    description: 'Discover Samkhya, Yoga, Nyaya, Vaisheshika, Purva Mimamsa, and Uttara Mimamsa (Vedanta).',
    views: 11253,
    likes: 3040,
    language: 'English',
    author: 'Sarva-Darshana-Sangraha',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Shad Darshana · Six Schools of Philosophy', sanskrit: 'एकं सद्विप्रा बहुधा वदन्ति', subtitle: 'Samkhya · Yoga · Nyaya · Vaisheshika · Mimamsa · Vedanta', c1: '#0f172a', c2: '#312e81', c3: '#b45309', accent: '#fde047', motif: 'lotus' }),
    tags: ['darshana', 'vedanta', 'yoga', 'samkhya', 'nyaya'],
    body: {
      English: `The Shad Darshana comprises the six orthodox Astika schools of Indian philosophy: Samkhya (Kapila), Yoga (Patanjali), Nyaya (Gautama), Vaisheshika (Kanada), Purva Mimamsa (Jaimini), and Vedanta (Badarayana Vedavyasa).`,
      Hindi: `वेदों की प्रामाणिकता स्वीकार करने वाले छह आस्तिक दर्शन 'षड्दर्शन' कहलाते हैं — सांख्य, योग, न्याय, वैशेषिक, पूर्व मीमांसा और वेदान्त।`,
      Sanskrit: `साङ्ख्यं योगो न्यायवैशेषिके च पूर्वमीमांसा वेदान्तश्चेति षड् आस्तिकदर्शनानि ।`
    }
  },
  {
    id: 'hindu-temples-sacred-architecture',
    title: 'Hindu Temples: The Sacred Architecture of the Divine (Mandir)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Shilpa Shastra',
    contentType: 'Text',
    description: 'Explore Nagara, Dravida, and Vesara architecture and the Vastu Purusha Mandala.',
    views: 9441,
    likes: 2510,
    language: 'Sanskrit',
    author: 'Mayamata & Manasara Shilpa Shastra',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Sacred Architecture of the Hindu Mandir', sanskrit: 'देहो देवालयः प्रोक्तो जीवो देवः सनातनः', subtitle: 'Nagara · Dravida · Vesara', c1: '#271206', c2: '#7c2d12', c3: '#ea580c', accent: '#fbbf24', motif: 'temple' }),
    tags: ['mandir', 'architecture', 'vastu', 'shilpa-shastra'],
    body: {
      English: `Modeled upon the Vastu Purusha Mandala and aligned with the subtle body, classical Hindu temples span the Nagara, Dravida, and Vesara architectural traditions.`,
      Hindi: `वास्तु पुरुष मण्डल पर आधारित भारतीय मन्दिर स्थापत्य की तीन प्रमुख शैलियाँ हैं — नागर, द्रविड़ और बेसर शैली।`,
      Sanskrit: `देहो देवालयः प्रोक्तो जीवो देवः सनातनः । त्यजेदज्ञाननिर्मांल्यं सोऽहम्भावेन पूजयेत् ॥`
    }
  },
  {
    id: 'hindu-festivals-utsav-vrat',
    title: 'Hindu Festivals: The Cycle of Devotion, Seasons, and Dharma (Utsav & Vrat)',
    category: 'Festivals',
    sanskritBadge: 'उत्सव · Utsav & Vrat',
    contentType: 'Text',
    description: 'Spiritual and astronomical significance of Deepavali, Navaratri, Maha Shivaratri, Holi, and Makar Sankranti.',
    views: 10844,
    likes: 2890,
    language: 'English',
    author: 'Dharmasindhu & Nirnayasindhu',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Sacred Festivals of Sanatan Dharma', sanskrit: 'तमसो मा ज्योतिर्गमय · उत्सवप्रियाः मानवाः', subtitle: 'Deepavali · Navaratri · Shivaratri · Holi', c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'diya' }),
    tags: ['diwali', 'holi', 'navaratri', 'shivaratri', 'festivals'],
    body: {
      English: `Sanatan Utsavs and Vrats synchronize human life with lunar Tithis, solar Sankrantis, and the six seasons—celebrating Rama Navami, Janmashtami, Navaratri, Deepavali, Makar Sankranti, Maha Shivaratri, and Holi.`,
      Hindi: `सनातन धर्म के पर्व ('उत्सव') और 'व्रत' प्रकृति की छह ऋतुओं, सूर्य के उत्तरायण-दक्षिणायन और चंद्र तिथियों के साथ जीवन को जोड़ते हैं।`,
      Sanskrit: `असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥`
    }
  },
  {
    id: 'puranas-18-maha-puranas',
    title: 'The Puranas: Introduction and Guide to the 18 Maha Puranas',
    category: 'Puranas',
    sanskritBadge: 'पुराण · 18 Maha Puranas',
    contentType: 'Text',
    description: 'Guide to all 18 Maha Puranas (400,000 Shlokas) compiled by Maharshi Vedavyasa and the Pancha Lakshana.',
    views: 11052,
    likes: 3180,
    language: 'English',
    author: 'Maharshi Krishna Dwaipayana Vedavyasa',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'The 18 Maha Puranas · Vedavyasa', sanskrit: 'मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम्', subtitle: '400,000 Shlokas · Cosmic History & Dharma', c1: '#2e1065', c2: '#701a75', c3: '#c2410c', accent: '#fde68a', motif: 'scripture' }),
    tags: ['puranas', 'vedavyasa', 'bhagavata', 'shiva-purana'],
    body: {
      English: `Compiled by Maharshi Vedavyasa across 400,000 verses, the 18 Maha Puranas illuminate Sarga, Pratisarga, Vamsha, Manvantara, and Vamshanucharita.`,
      Hindi: `महर्षि वेदव्यास द्वारा रचित अष्टादश महापुराण (४,००,००० श्लोक) सृष्टि, अवतार कथा, तीर्थ माहात्म्य और धर्मनीति के विशाल विश्वकोश हैं।`,
      Sanskrit: `मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम् । अनापलिङ्गकूस्कानि पुराणानि प्रचक्षते ॥`
    }
  },
  {
    id: 'mahabharata-epic-summary',
    title: 'The Mahabharata: Introduction, Epic Summary, and Core Teachings',
    category: 'Mahabharata',
    sanskritBadge: 'महाभारत · Itihasa',
    contentType: 'Text',
    description: 'Complete overview of all 18 Parvas (100,000 Shlokas) of the Mahabharata, the Fifth Veda.',
    views: 15868,
    likes: 4310,
    language: 'English',
    author: 'Maharshi Krishna Dwaipayana Vedavyasa',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'The Mahabharata · Fifth Veda (Jaya)', sanskrit: 'यतो धर्मस्ततो जयः · धर्मो रक्षति रक्षितः', subtitle: '18 Parvas · 100,000 Shlokas', c1: '#3f1d0b', c2: '#7f1d1d', c3: '#c2410c', accent: '#fbbf24', motif: 'chakra' }),
    tags: ['mahabharata', 'pandavas', 'krishna', 'dharma'],
    body: {
      English: `Composed by Maharshi Vedavyasa across 18 Parvas and 100,000 shlokas, the Mahabharata is revered as the Panchama Veda containing the Bhagavad Gita, Vidura Niti, and Vishnu Sahasranama.`,
      Hindi: `१,००,००० श्लोकों और १८ पर्वों वाला 'महाभारत' पंचम वेद कहलाता है — "यतो धर्मस्ततो जयः"।`,
      Sanskrit: `धर्मे चार्थे च कामे च मोक्षे च भरतर्षभ । यदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित् ॥`
    }
  },
  {
    id: 'upanishads-10-principal-texts',
    title: 'The Upanishads: Introduction and Guide to the 10 Principal Texts',
    category: 'Upanishads',
    sanskritBadge: 'उपनिषद् · Vedanta',
    contentType: 'Text',
    description: 'Guide to the 10 Principal (Mukhya) Upanishads and the 4 Great Mahavakyas of Vedanta.',
    views: 12048,
    likes: 3420,
    language: 'English',
    author: 'Vedic Rishis & Adi Shankaracharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'The 10 Principal Upanishads', sanskrit: 'ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः', subtitle: 'Shruti Jnana-Kanda · The 4 Mahavakyas', c1: '#1e1b4b', c2: '#431407', c3: '#b45309', accent: '#fbbf24', motif: 'lotus' }),
    tags: ['upanishads', 'vedanta', 'brahman', 'atman'],
    body: {
      English: `The 10 Principal Upanishads (Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka) proclaim the four Mahavakyas: Prajnanam Brahma, Aham Brahmasmi, Tat Tvam Asi, and Ayam Atma Brahma.`,
      Hindi: `दसोपनिषद् वेदों के सर्वोच्च ज्ञान-काण्ड (वेदान्त) हैं, जो आत्मा और परब्रह्म की एकता के चार महावाक्यों का प्रतिपादन करते हैं।`,
      Sanskrit: `ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः । ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥`
    }
  },
  {
    id: 'maa-ambe-sarv-kamna-siddh-prarthana',
    title: 'Maa Ambe Ki Sarv Kamna Siddh Prarthana: Full Lyrics + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Devi Prarthana',
    contentType: 'Text',
    description: 'Complete Maa Ambe Ki Sarv Kamna Siddh Prarthana from Devi Mahatmyam (Durga Saptashati).',
    views: 14104,
    likes: 4505,
    language: 'English',
    author: 'Markandeya Purana (Devi Mahatmyam)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Maa Ambe Sarv Kamna Siddh Prarthana', sanskrit: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता', subtitle: 'Durga Saptashati · Complete Verses', c1: '#4c0519', c2: '#9f1239', c3: '#ea580c', accent: '#fde047', motif: 'trishul' }),
    tags: ['maa-ambe', 'durga', 'prarthana', 'navratri'],
    body: {
      English: `Sarva mangala mangalye Shive sarvartha sadhike | Sharanye Tryambake Gauri Narayani namo'stu te || Ya Devi sarvabhuteshu Shakti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||`,
      Hindi: `सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥ या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥`,
      Sanskrit: `ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥`
    }
  },
  {
    id: 'ambe-tu-hai-jagdambe-kali-aarti',
    title: 'Ambe Tu Hai Jagdambe Kali Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Devi Aarti',
    contentType: 'Text',
    description: 'Complete unabridged Ambe Tu Hai Jagdambe Kali Aarti in Hindi and English with meaning.',
    views: 15107,
    likes: 4303,
    language: 'English',
    author: 'Traditional Shakta Devotional Hymn',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Ambe Tu Hai Jagdambe Kali', sanskrit: 'अम्बे तू है जगदम्बे काली जय दुर्गे खप्पर वाली', subtitle: 'Complete Hindi & English Lyrics', c1: '#450a0a', c2: '#991b1b', c3: '#ea580c', accent: '#fde047', motif: 'diya' }),
    tags: ['aarti', 'jagdambe', 'kali', 'durga'],
    body: {
      English: `Ambe tu hai Jagdambe Kali, Jai Durge khappar wali, Tere hi gun gaave Bharati, O Maiya hum sab utaare teri Aarti ||`,
      Hindi: `अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली, तेरे ही गुण गावें भारती, ओ मैया हम सब उतारे तेरी आरती ॥`,
      Sanskrit: `जयन्ती मङ्गला काली भद्रकाली कपालिनी । दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥`
    }
  },
  {
    id: 'shri-hanuman-chalisa-full',
    title: 'Shri Hanuman Chalisa: Full Lyrics (Hindi & English) + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Hanuman Chalisa',
    contentType: 'Text',
    description: 'Complete Shri Hanuman Chalisa (Dohas & all 40 Chaupais) by Goswami Tulsidas in Hindi and English.',
    views: 31221,
    likes: 9804,
    language: 'English',
    author: 'Goswami Tulsidas',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Shri Hanuman Chalisa · Complete 40 Verses', sanskrit: 'जय हनुमान ज्ञान गुन सागर', subtitle: 'Goswami Tulsidas · Dohas + 40 Chaupais', c1: '#431407', c2: '#9a3412', c3: '#ea580c', accent: '#fde047', motif: 'himalaya' }),
    tags: ['hanuman-chalisa', 'tulsidas', 'bajrangbali', 'ramayana'],
    body: {
      English: `Shri Guru charan saroj raj, nij manu mukuru sudhari | Baranau Raghubar bimal jasu, jo dayaku phal chari || Jai Hanuman gyan gun sagar | Jai Kapis tihu lok ujagar || Ram doot atulit bal dhama | Anjani-putra Pavan-sut nama ||`,
      Hindi: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि । बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥ जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥ राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥`,
      Sanskrit: `अतुलितबलधामं हेमशैलाभदेहं दनुजवनकृशानुं ज्ञानिनामग्रगण्यम् । सकलगुणनिधानं वानराणामधीशं रघुपतिप्रियभक्तं वातजातं नमामि ॥`
    }
  },
  {
    id: 'jai-ambe-gauri-aarti',
    title: 'Jai Ambe Gauri Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Devi Aarti',
    contentType: 'Text',
    description: 'Complete Jai Ambe Gauri Aarti dedicated to Goddess Durga in Hindi and English.',
    views: 13890,
    likes: 4104,
    language: 'Hindi',
    author: 'Traditional Shakta Aarti',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Jai Ambe Gauri Maiya Jai Shyama Gauri', sanskrit: 'जय अम्बे गौरी मैया जय श्यामा गौरी', subtitle: 'Complete Durga Aarti', c1: '#4c0519', c2: '#be123c', c3: '#f59e0b', accent: '#fef08a', motif: 'diya' }),
    tags: ['jai-ambe-gauri', 'durga-aarti', 'navratri'],
    body: {
      English: `Jai Ambe Gauri, Maiya Jai Shyama Gauri, Tumko nishdin dhyavat, Hari Brahma Shivri || Om Jai Ambe Gauri ||`,
      Hindi: `जय अम्बे गौरी, मैया जय श्यामा गौरी, तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥ ॐ जय अम्बे गौरी ॥`,
      Sanskrit: `कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् । सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥`
    }
  },
  {
    id: 'om-aum-mantra-meaning',
    title: 'Om (Aum) Mantra: Deep Meaning, Significance, and Benefits',
    category: 'Vedas',
    sanskritBadge: 'वेद · Pranava',
    contentType: 'Text',
    description: 'Profound meaning of Om (Pranava) and the Mandukya Upanishad philosophy of A-U-M and Turiya.',
    views: 18127,
    likes: 5606,
    language: 'English',
    author: 'Mandukya & Katha Upanishads',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Om (Aum) · The Primordial Pranava', sanskrit: 'ओमित्येकाक्षरं ब्रह्म', subtitle: 'A-U-M & Turiya · Mandukya Upanishad', c1: '#3b0764', c2: '#7c2d12', c3: '#ea580c', accent: '#fde047', motif: 'chakra' }),
    tags: ['om', 'pranava', 'meditation', 'vedas'],
    body: {
      English: `Om (A-U-M + silent Turiya), revered in the Vedas as Pranava, is the primordial cosmic vibration from which creation manifests and into which it returns.`,
      Hindi: `'ॐ' (अ + उ + म् + तुरीय मौन) सनातन धर्म का अनादि बीज-मंत्र एवं शब्द-ब्रह्म है।`,
      Sanskrit: `ओमित्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोङ्कार एव ॥`
    }
  },
  {
    id: 'mahalakshmi-ashtakam',
    title: 'Mahalakshmi Ashtakam: Complete 8 Verses + Phalashruti & Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Stotram',
    contentType: 'Text',
    description: 'Complete Mahalakshmi Ashtakam composed by Devendra (Indra) in the Padma Purana.',
    views: 14061,
    likes: 4224,
    language: 'Sanskrit',
    author: 'Padma Purana (Indra Kruta)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Sri Mahalakshmi Ashtakam', sanskrit: 'नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते', subtitle: 'Padma Purana · All 8 Verses', c1: '#4c0519', c2: '#9a3412', c3: '#eab308', accent: '#fef08a', motif: 'lotus' }),
    tags: ['lakshmi', 'prosperity', 'ashtakam', 'stotram'],
    body: {
      English: `Namastestu Mahamaye Shripithe Surapujite | Shankha Chakra Gadahaaste Mahalakshmi Namo'stu Te ||`,
      Hindi: `नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते । शंखचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥`,
      Sanskrit: `नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते । शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥`
    }
  },
  {
    id: 'the-four-vedas-introduction',
    title: 'The Four Vedas: Complete Guide to Rigveda, Yajurveda, Samaveda & Atharvaveda',
    category: 'Vedas',
    sanskritBadge: 'वेद · Chaturveda',
    contentType: 'Text',
    description: 'Comprehensive guide to Rigveda, Yajurveda, Samaveda, and Atharvaveda.',
    views: 13161,
    likes: 3752,
    language: 'English',
    author: 'Apaurusheya Shruti & Maharshi Vedavyasa',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'The Four Vedas', sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम्', subtitle: 'Rig · Yajur · Sama · Atharva', c1: '#3b0764', c2: '#7c2d12', c3: '#d97706', accent: '#fde047', motif: 'scripture' }),
    tags: ['vedas', 'rigveda', 'yajurveda', 'samaveda', 'atharvaveda'],
    body: {
      English: `Organized by Maharshi Vedavyasa into Rigveda, Yajurveda, Samaveda, and Atharvaveda, each Veda comprises Samhita, Brahmana, Aranyaka, and Upanishad.`,
      Hindi: `महर्षि वेदव्यास द्वारा संकलित चार वेद — ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद — सनातन धर्म के मूल आधार हैं।`,
      Sanskrit: `अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥`
    }
  },
  {
    id: 'story-of-ramas-exile',
    title: "The Story of Rama's Exile: Ayodhya Kanda & The Ideal of Dharma",
    category: 'Ramayana',
    sanskritBadge: 'रामायण · Ayodhya Kanda',
    contentType: 'Text',
    description: 'Narrative and philosophical guide to Ayodhya Kanda and Bharata Milap at Chitrakoot.',
    views: 11072,
    likes: 3101,
    language: 'English',
    author: 'Maharshi Valmiki',
    isFeatured: false,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: "Sri Rama's Exile · Ayodhya Kanda", sanskrit: 'रघुकुल रीति सदा चलि आई', subtitle: 'Valmiki Ramayana · Satya & Tyaga', c1: '#450a0a', c2: '#9a3412', c3: '#f59e0b', accent: '#fef08a', motif: 'bow' }),
    tags: ['rama', 'ayodhya', 'ramayana', 'sita', 'bharata'],
    body: {
      English: `In the Ayodhya Kanda, Sri Rama upholds His father's truth with unshakeable equanimity, accompanied into the forest by Devi Sita and Lakshmana while Bharata rules Nandigram with Sri Rama's Padukas.`,
      Hindi: `अयोध्याकाण्ड में मर्यादा पुरुषोत्तम श्रीराम पिता के सत्य की रक्षा हेतु चौदह वर्ष का वनवास स्वीकार करते हैं।`,
      Sanskrit: `रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः । राजा सर्वस्य लोकस्य देवानां मघवानिव ॥`
    }
  },
  {
    id: 'mahamrityunjaya-mantra',
    title: 'Mahamrityunjaya Mantra: The Great Death-Conquering Chant of Lord Shiva',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Rigveda 7.59.12',
    contentType: 'Text',
    description: 'Complete Mahamrityunjaya Mantra from Rigveda 7.59.12 with word-by-word meaning.',
    views: 21969,
    likes: 6435,
    language: 'Sanskrit',
    author: 'Maharshi Vasishtha (Rigveda 7.59.12)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Maha Mrityunjaya Mantra', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्', subtitle: 'Rigveda 7.59.12', c1: '#0f172a', c2: '#312e81', c3: '#ea580c', accent: '#fde047', motif: 'trishul' }),
    tags: ['shiva', 'healing', 'protection', 'mahamrityunjaya'],
    body: {
      English: `Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukamiva Bandhanan Mrityor Mukshiya Ma'mritat ||`,
      Hindi: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥`,
      Sanskrit: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥`
    }
  },
  {
    id: 'bhagavad-gita-ch2-v47',
    title: 'Bhagavad Gita - Chapter 2, Verse 47: The Essence of Karma Yoga',
    category: 'Bhagavad Gita',
    sanskritBadge: 'गीता · Sankhya Yoga 2.47',
    contentType: 'Text',
    description: 'Bhagavad Gita 2.47 (Karmanye Vadhikaraste) word-by-word breakdown and Nishkama Karma philosophy.',
    views: 28487,
    likes: 8304,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa (Spoken by Bhagavan Sri Krishna)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Bhagavad Gita 2.47', sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', subtitle: 'Nishkama Karma Yoga', c1: '#172554', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'chakra' }),
    tags: ['karma', 'duty', 'gita', 'krishna'],
    body: {
      English: `Karmany-evadhikaras te ma phaleshu kadachana | Ma karma-phala-hetur bhur ma te sango 'stv-akarmani || (2.47)`,
      Hindi: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥`,
      Sanskrit: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥`
    }
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra: The Mother of the Vedas & Universal Prayer for Wisdom',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Rigveda 3.62.10',
    contentType: 'Text',
    description: 'Complete Gayatri Mantra from Rigveda 3.62.10 revealed to Brahmarshi Vishvamitra.',
    views: 24184,
    likes: 7222,
    language: 'Sanskrit',
    author: 'Brahmarshi Vishvamitra (Rigveda 3.62.10)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({ title: 'Gayatri Mantra · Vedamata Savitri', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि', subtitle: 'Rigveda 3.62.10', c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'himalaya' }),
    tags: ['rigveda', 'sun', 'wisdom', 'gayatri-mantra'],
    body: {
      English: `Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat ||`,
      Hindi: `ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥`,
      Sanskrit: `ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥`
    }
  }
];

INITIAL_SACRED_ITEMS.forEach((it) => {
  if (!it.pdfUrl) it.pdfUrl = '#auto-pdf';
  if (!it.videoUrl) it.videoUrl = 'https://www.youtube.com/watch?v=sx8WM-IB3Y0';
  it.fallbackImageUrl = it.imageUrl;
  if (COPYRIGHT_FREE_ITEM_PHOTOS[it.id]) {
    it.imageUrl = COPYRIGHT_FREE_ITEM_PHOTOS[it.id];
  }
});

CATEGORIES.forEach((cat) => {
  cat.fallbackBgImage = cat.bgImage;
  if (COPYRIGHT_FREE_CATEGORY_PHOTOS[cat.id]) {
    cat.bgImage = COPYRIGHT_FREE_CATEGORY_PHOTOS[cat.id];
  }
});

export const JAAP_MANTRAS = [
  { id: 'om-namah-shivaya', name: 'Om Namah Shivaya', sanskrit: 'ॐ नमः शिवाय', deity: 'Lord Shiva (Panchakshari)' },
  { id: 'hare-krishna', name: 'Hare Krishna Maha Mantra', sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥', deity: 'Sri Radha-Krishna & Sri Rama' },
  { id: 'jai-shri-ram', name: 'Shri Ram Jai Ram Jai Jai Ram', sanskrit: 'श्री राम जय राम जय जय राम', deity: 'Maryada Purushottama Sri Rama' },
  { id: 'gayatri-jaap', name: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', deity: 'Vedamata Gayatri / Savitr' },
  { id: 'mahamrityunjaya-jaap', name: 'Mahamrityunjaya Mantra', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥', deity: 'Lord Mrityunjaya Shiva' },
  { id: 'om-namo-bhagavate', name: 'Om Namo Bhagavate Vasudevaya', sanskrit: 'ॐ नमो भगवते वासुदेवाय', deity: 'Bhagavan Vishnu / Krishna' },
  { id: 'om-gan-ganapataye', name: 'Om Gam Ganapataye Namah', sanskrit: 'ॐ गं गणपतये नमः', deity: 'Vighnaharta Lord Ganesha' },
  { id: 'om-aim-hrim-klim', name: 'Navarna Chamunda Mantra', sanskrit: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे', deity: 'Maa Adi-Shakti जगदम्बा' }
];

export function playSacredSound(type = 'bead') {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'bell' || type === 'completion' ? 528 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === 'bead' ? 0.25 : 1.4));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'bead' ? 0.25 : 1.4));
  } catch (e) {}
}

// Native Indic Script Transliterator for Indian Languages
const TAMIL_PHONETIC_MAP = {
  'अ':'அ','आ':'ஆ','इ':'இ','ई':'ஈ','उ':'உ','ऊ':'ஊ','ऋ':'ரி','ए':'ஏ','ऐ':'ஐ','ओ':'ஓ','औ':'ஔ',
  'ा':'ா','ि':'ி','ी':'ீ','ु':'ு','ू':'ூ','ृ':'்ரு','े':'ே','ै':'ை','ो':'ோ','ौ':'ௌ',
  'ं':'ம்','ः':'ஃ','ँ':'ம்','्':'்','ऽ':'',
  'क':'க','ख':'க','ग':'க','घ':'க','ङ':'ங','च':'ச','छ':'ச','ज':'ஜ','झ':'ஜ','ञ':'ஞ',
  'ट':'ட','ठ':'ட','ड':'ட','ढ':'ட','ण':'ண','त':'த','थ':'த','द':'த','ध':'த','न':'ந',
  'प':'ப','फ':'ப','ब':'ப','भ':'ப','म':'ம','य':'ய','र':'ர','ल':'ல','ळ':'ள','व':'வ',
  'श':'ஶ','ष':'ஷ','स':'ஸ','ह':'ஹ'
};

const INDIC_BLOCK_START = {
  Bengali: 0x0980,
  Assamese: 0x0980,
  Punjabi: 0x0A00,
  Gujarati: 0x0A80,
  Odia: 0x0B00,
  Telugu: 0x0C00,
  Kannada: 0x0C80,
  Malayalam: 0x0D00
};

export function transliterateDevanagariToNativeScript(devText, lang) {
  if (!devText || typeof devText !== 'string') return '';
  if (['Sanskrit', 'Hindi', 'Marathi', 'Maithili', 'Nepali'].includes(lang)) return devText;
  if (lang === 'Tamil') {
    let out = '';
    for (let i = 0; i < devText.length; i++) {
      const ch = devText[i];
      out += TAMIL_PHONETIC_MAP[ch] !== undefined ? TAMIL_PHONETIC_MAP[ch] : ch;
    }
    return out;
  }
  const blockStart = INDIC_BLOCK_START[lang];
  if (!blockStart) return devText;
  let out = '';
  for (let i = 0; i < devText.length; i++) {
    const ch = devText[i];
    const code = devText.charCodeAt(i);
    if (ch === 'व' && lang === 'Odia') { out += 'ବ'; continue; }
    if (ch === 'व' && lang === 'Bengali') { out += 'ব'; continue; }
    if (ch === 'व' && lang === 'Assamese') { out += 'ৱ'; continue; }
    if (ch === 'र' && lang === 'Assamese') { out += 'ৰ'; continue; }
    if ((code >= 0x0901 && code <= 0x0939) || (code >= 0x093C && code <= 0x094D) || (code >= 0x0966 && code <= 0x096F)) {
      out += String.fromCharCode(blockStart + (code - 0x0900));
    } else {
      out += ch;
    }
  }
  return out;
}

export function getBodyForLanguage(item, lang = 'English') {
  if (!item || !item.body) return item?.description || '';
  if (typeof item.body === 'string') return item.body;
  const direct = (item.body[lang] || '').trim();
  if (direct) return direct;
  const eng = (item.body.English || '').trim();
  const hin = (item.body.Hindi || '').trim();
  const san = (item.body.Sanskrit || '').trim();
  if (INDIC_BLOCK_START[lang] || lang === 'Tamil') {
    const base = hin || san;
    if (base) {
      const converted = transliterateDevanagariToNativeScript(base, lang);
      return eng ? `${converted}\n\n${eng}` : converted;
    }
  }
  return eng || hin || san || item.description || '';
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanatan_setu_dark_mode') || 'false'); } catch { return false; }
  });

  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLang, setDetailLang] = useState('English');
  const [readerFontSize, setReaderFontSize] = useState('base');
  const [imageFitMode, setImageFitMode] = useState('contain-blur');
  const [activeShlokaIndex, setActiveShlokaIndex] = useState(0);
  const [isAartiActive, setIsAartiActive] = useState(false);

  // Global Sync Status
  const [globalSyncStatus, setGlobalSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'offline'
  const [lastGlobalSyncTime, setLastGlobalSyncTime] = useState('');

  // Merge built-in 23 scriptures with local edits and remote global items
  const [items, setItems] = useState(() => {
    const seedIds = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));
    let editsMap = {};
    try {
      editsMap = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
    } catch (e) {}

    const customItems = [];
    try {
      const saved = JSON.parse(localStorage.getItem('sanatan_setu_items_v6') || '[]');
      if (Array.isArray(saved)) {
        for (const it of saved) {
          if (it && it.id && !seedIds.has(String(it.id))) {
            customItems.push(editsMap[it.id] ? { ...it, ...editsMap[it.id] } : it);
          }
        }
      }
    } catch (e) {}

    const mergedSeeds = INITIAL_SACRED_ITEMS.map((seed) =>
      editsMap[seed.id] ? { ...seed, ...editsMap[seed.id] } : seed
    );

    return [...customItems, ...mergedSeeds];
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [selectedMediaFormat, setSelectedMediaFormat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const [likedIds, setLikedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanatan_setu_likes') || '[]'); } catch { return []; }
  });
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanatan_setu_bookmarks') || '[]'); } catch { return []; }
  });

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try { return localStorage.getItem('sanatan_admin_auth') === 'true'; } catch { return false; }
  });
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending');
  const [editingItem, setEditingItem] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'Mantras',
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
    publishDirectlyAsAdmin: false
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedMantraId, setSelectedMantraId] = useState(JAAP_MANTRAS[0].id);
  const [currentCount, setCurrentCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_current') || 0); } catch { return 0; }
  });
  const [lifetimeCount, setLifetimeCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_lifetime') || 1080); } catch { return 1080; }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoJaapActive, setAutoJaapActive] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  }, []);

  // Push Admin-approved state to /api/sync so ALL browsers & devices worldwide see it immediately
  const pushGlobalSnapshot = useCallback(async (nextItems) => {
    if (typeof fetch === 'undefined') return;
    setGlobalSyncStatus('syncing');
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': DEFAULT_ADMIN_PASSCODE
        },
        body: JSON.stringify({
          updatedAt: new Date().toISOString(),
          items: nextItems
        })
      });
      if (res.ok) {
        setGlobalSyncStatus('synced');
        setLastGlobalSyncTime(new Date().toLocaleTimeString());
        showToast('🌍 Published globally across all browsers & devices!');
      } else {
        setGlobalSyncStatus('offline');
      }
    } catch (e) {
      setGlobalSyncStatus('offline');
    }
  }, [showToast]);

  // Fetch global items from /api/sync (with fallback to /sanatan-global-db.json) on page load
  const fetchGlobalItems = useCallback(async () => {
    if (typeof fetch === 'undefined') return;
    try {
      let res = await fetch(`/api/sync?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`/sanatan-global-db.json?t=${Date.now()}`, { cache: 'no-store' });
      }
      if (!res.ok) return;
      const payload = await res.json();
      const remoteList = Array.isArray(payload) ? payload : payload?.items;
      if (!Array.isArray(remoteList)) return;

      setGlobalSyncStatus('synced');
      if (payload?.updatedAt) {
        setLastGlobalSyncTime(new Date(payload.updatedAt).toLocaleTimeString());
      }

      if (remoteList.length === 0) return;

      setItems((prev) => {
        const remoteMap = new Map(remoteList.filter((x) => x && x.id).map((x) => [String(x.id), x]));
        const merged = prev.map((localIt) => {
          const rem = remoteMap.get(String(localIt.id));
          if (!rem) return localIt;
          const localTime = Date.parse(localIt.updatedAt || 0) || 0;
          const remTime = Date.parse(rem.updatedAt || 0) || 0;
          return remTime >= localTime ? { ...localIt, ...rem } : localIt;
        });
        remoteMap.forEach((rem, id) => {
          if (!merged.some((m) => String(m.id) === id)) {
            merged.unshift(rem);
          }
        });
        return merged;
      });
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchGlobalItems();
  }, [fetchGlobalItems]);

  // Hydrate from IndexedDB as well
  useEffect(() => {
    let active = true;
    SanatanUnlimitedDB.loadItems().then((idbItems) => {
      if (!active || !Array.isArray(idbItems) || idbItems.length === 0) return;
      setItems((prev) => {
        const idbMap = new Map(idbItems.filter((x) => x && x.id).map((x) => [String(x.id), x]));
        const merged = prev.map((it) => {
          const stored = idbMap.get(String(it.id));
          if (!stored) return it;
          const t1 = Date.parse(it.updatedAt || 0) || 0;
          const t2 = Date.parse(stored.updatedAt || 0) || 0;
          return t2 > t1 ? { ...it, ...stored } : it;
        });
        idbMap.forEach((stored, id) => {
          if (!merged.some((m) => String(m.id) === id)) {
            merged.unshift(stored);
          }
        });
        return merged;
      });
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items));
      SanatanUnlimitedDB.saveItems(items);
    } catch (e) {}
  }, [darkMode, items]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_likes', JSON.stringify(likedIds));
      localStorage.setItem('sanatan_setu_bookmarks', JSON.stringify(bookmarkedIds));
      localStorage.setItem('sanatan_jaap_current', String(currentCount));
      localStorage.setItem('sanatan_jaap_lifetime', String(lifetimeCount));
    } catch (e) {}
  }, [likedIds, bookmarkedIds, currentCount, lifetimeCount]);

  // Browser back button support
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPopState = (e) => {
      if (selectedItem) {
        setSelectedItem(null);
        return;
      }
      if (e.state && e.state.view) {
        setActiveView(e.state.view);
      } else {
        setActiveView('home');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [selectedItem]);

  const navigateToView = useCallback((view) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ view }, '', view === 'home' ? '#home' : `#${view}`);
      } catch (e) {}
    }
  }, []);

  // STRICT APPROVAL SEPARATION: Public views only see Admin-Approved items; unapproved user uploads stay in Pending Queue
  const approvedItems = useMemo(
    () => items.filter((item) => item.status === 'approved' || item.isApproved === true),
    [items]
  );

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending' && item.isApproved !== true),
    [items]
  );

  const filteredItems = useMemo(() => {
    return approvedItems
      .filter((item) => {
        const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
        const matchLang =
          selectedLanguageFilter === 'All' ||
          item.language === selectedLanguageFilter ||
          Boolean(item.body && typeof item.body === 'object' && item.body[selectedLanguageFilter]) ||
          Boolean(INDIC_BLOCK_START[selectedLanguageFilter] || selectedLanguageFilter === 'Tamil');
        const matchFormat =
          selectedMediaFormat === 'All' ||
          (selectedMediaFormat === 'PDF' && Boolean(item.pdfUrl)) ||
          (selectedMediaFormat === 'Video' && Boolean(item.videoUrl)) ||
          (selectedMediaFormat === 'Text' && Boolean(item.body));
        const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(item.id);
        const q = searchQuery.trim().toLowerCase();
        const matchSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(q));
        return matchCat && matchLang && matchFormat && matchBookmark && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.views || 0) - (a.views || 0);
      });
  }, [approvedItems, selectedCategory, selectedLanguageFilter, selectedMediaFormat, showBookmarksOnly, bookmarkedIds, searchQuery, sortBy]);

  const handleIncrementJaap = useCallback(() => {
    setCurrentCount((prev) => {
      const next = prev + 1;
      if (soundEnabled) playSacredSound(next % 108 === 0 ? 'completion' : 'bead');
      return next;
    });
    setLifetimeCount((prev) => prev + 1);
  }, [soundEnabled]);

  useEffect(() => {
    if (!autoJaapActive) return;
    const t = setInterval(handleIncrementJaap, 2200);
    return () => clearInterval(t);
  }, [autoJaapActive, handleIncrementJaap]);

  // Any visitor can upload; goes to Admin Pending Queue unless Admin checks direct publish
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const primaryBody =
      uploadForm.bodyEnglish.trim() ||
      uploadForm.bodyHindi.trim() ||
      uploadForm.bodySanskrit.trim() ||
      uploadForm.description.trim();

    if (!uploadForm.title.trim() || !uploadForm.description.trim() || !primaryBody) {
      showToast('Please enter Title, Description, and Content.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === uploadForm.category) || CATEGORIES[0];
    const defaultCategoryPhoto = COPYRIGHT_FREE_CATEGORY_PHOTOS[uploadForm.category] || catObj.bgImage;
    const approveNow = isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin;
    const nowIso = new Date().toISOString();

    const newItem = {
      id: `${uploadForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 36)}-${Date.now().toString().slice(-4)}`,
      title: uploadForm.title.trim(),
      category: uploadForm.category,
      sanskritBadge: `${catObj.sanskrit} · ${catObj.name}`,
      contentType: uploadForm.videoUrl ? 'Video' : uploadForm.pdfUrl ? 'PDF' : 'Text',
      views: 1,
      likes: 0,
      language: uploadForm.language || 'Sanskrit',
      author: uploadForm.author.trim() || 'Community Contributor',
      imageUrl: cleanExternalUrl(uploadForm.imageUrl) || defaultCategoryPhoto,
      pdfUrl: cleanExternalUrl(uploadForm.pdfUrl) || '#auto-pdf',
      pdfFileName: uploadForm.pdfFileName || '',
      videoUrl: cleanExternalUrl(uploadForm.videoUrl) || '',
      tags: uploadForm.tags ? uploadForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : [uploadForm.category.toLowerCase()],
      isFeatured: false,
      isUserUploaded: true,
      status: approveNow ? 'approved' : 'pending',
      isApproved: approveNow,
      updatedAt: nowIso,
      description: uploadForm.description.trim(),
      body: {
        English: uploadForm.bodyEnglish.trim() || primaryBody,
        Hindi: uploadForm.bodyHindi.trim() || primaryBody,
        Sanskrit: uploadForm.bodySanskrit.trim() || primaryBody
      }
    };

    const updated = [newItem, ...items];
    setItems(updated);
    setIsUploadOpen(false);
    setUploadForm({
      title: '',
      description: '',
      category: 'Mantras',
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
      publishDirectlyAsAdmin: false
    });

    if (approveNow) {
      await pushGlobalSnapshot(updated);
      showToast('Published directly as Admin across all browsers!');
    } else {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'submit', item: newItem })
      }).catch(() => {});
      showToast('Submitted! Your upload is in the Admin Pending Queue until Admin approves it.');
    }
  };

  // Admin approves a pending upload (or proposed edit) and publishes globally
  const handleApproveItem = async (id) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;
    let updated;
    if (target.isProposedEditFor) {
      const { isProposedEditFor, ...cleanFields } = target;
      updated = items
        .filter((it) => it.id !== id)
        .map((it) =>
          it.id === isProposedEditFor
            ? { ...it, ...cleanFields, id: isProposedEditFor, status: 'approved', isApproved: true, updatedAt: new Date().toISOString() }
            : it
        );
    } else {
      updated = items.map((it) =>
        it.id === id ? { ...it, status: 'approved', isApproved: true, updatedAt: new Date().toISOString() } : it
      );
    }
    setItems(updated);
    await pushGlobalSnapshot(updated);
    showToast('Approved and published globally!');
  };

  const handleDeleteItem = async (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    if (isAdminAuthenticated) {
      await pushGlobalSnapshot(updated);
    }
    showToast('Item removed.');
  };

  // Save edits: Admin publishes globally immediately; regular visitors send proposed edits to Admin Pending Queue
  const handleSaveEditedItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const nowIso = new Date().toISOString();

    if (isAdminAuthenticated) {
      const cleaned = {
        ...editingItem,
        imageUrl: cleanExternalUrl(editingItem.imageUrl),
        pdfUrl: cleanExternalUrl(editingItem.pdfUrl),
        videoUrl: cleanExternalUrl(editingItem.videoUrl),
        status: 'approved',
        isApproved: true,
        updatedAt: nowIso
      };
      try {
        const editsMap = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
        editsMap[cleaned.id] = cleaned;
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(editsMap));
      } catch (err) {}

      const updated = items.map((it) => (it.id === cleaned.id ? cleaned : it));
      setItems(updated);
      if (selectedItem && selectedItem.id === cleaned.id) setSelectedItem(cleaned);
      setEditingItem(null);
      await pushGlobalSnapshot(updated);
      showToast('Admin changes saved and synced across all browsers!');
    } else {
      const proposedEdit = {
        ...editingItem,
        id: `edit-${editingItem.id}-${Date.now().toString().slice(-4)}`,
        isProposedEditFor: editingItem.id,
        title: `[Edit Proposal] ${editingItem.title}`,
        imageUrl: cleanExternalUrl(editingItem.imageUrl),
        pdfUrl: cleanExternalUrl(editingItem.pdfUrl),
        videoUrl: cleanExternalUrl(editingItem.videoUrl),
        status: 'pending',
        isApproved: false,
        updatedAt: nowIso
      };
      const updated = [proposedEdit, ...items];
      setItems(updated);
      setEditingItem(null);
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'submit', item: proposedEdit })
      }).catch(() => {});
      showToast('Edit submitted to Admin Pending Queue for approval!');
    }
  };

  const handleDownloadGlobalJson = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const blob = new Blob([JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sanatan-global-db.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded sanatan-global-db.json for public/ folder.');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasscodeInput.trim() === DEFAULT_ADMIN_PASSCODE || adminPasscodeInput.trim() === 'admin108') {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch (err) {}
      setAdminPasscodeInput('');
      fetchGlobalItems();
      showToast('Welcome, Admin!');
    } else {
      showToast('Invalid Admin passcode.');
    }
  };

  const activeMantra = useMemo(
    () => JAAP_MANTRAS.find((m) => m.id === selectedMantraId) || JAAP_MANTRAS[0],
    [selectedMantraId]
  );

  const fallbackArtworkForItem = useCallback((item) => {
    const catObj = CATEGORIES.find((c) => c.id === item?.category) || CATEGORIES[0];
    return createSacredArtwork({
      title: item?.title || 'Sanatan Dharma',
      sanskrit: catObj.sanskrit || 'ॐ',
      subtitle: `${item?.category || 'Sacred'} · Sanatan Setu`
    });
  }, []);

  return (
    <div
      className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${
        darkMode ? 'bg-[#0F0A07] text-amber-50' : 'bg-[#FFFBEB] text-[#2C1A12]'
      }`}
    >
      <SacredAnimationsStyle />
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A12] text-amber-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 text-sm">
          <SacredLotusIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b ${
          darkMode ? 'bg-[#160E09]/95 border-amber-500/20' : 'bg-[#FFFBEB]/95 border-amber-900/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              navigateToView('home');
              setSelectedCategory('All');
              setShowBookmarksOnly(false);
            }}
          >
            <SanatanSetuLogo size={44} />
            <div>
              <span className="text-lg sm:text-2xl font-black tracking-tight">Sanatan Setu</span>
              <p className={`text-xs font-medium hidden md:block ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                Eternal Vedic Library · Admin-Verified Global Archive
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap justify-end">
            <button
              onClick={() => navigateToView('home')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                activeView === 'home' ? 'bg-[#EA580C] text-white shadow' : 'hover:bg-amber-500/15'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </button>

            <button
              onClick={() => navigateToView('jaap')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 ${
                activeView === 'jaap' ? 'bg-[#EA580C] text-white shadow' : 'hover:bg-amber-500/15'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>108 Jaap</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-amber-500/30 hover:bg-amber-500/15 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-[#EA580C]" />
              <span>Upload Content</span>
            </button>

            <button
              onClick={() => navigateToView('admin')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-amber-600 text-white border-amber-500 shadow'
                  : 'border-amber-500/30 hover:bg-amber-500/15'
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

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label="Toggle dark mode"
              className="p-2.5 rounded-xl border border-amber-500/30 hover:bg-amber-500/15"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* Hero & Search */}
            <section className="text-center space-y-5">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                Your Digital Bridge to <span className="text-[#EA580C]">Sanatan Dharma</span>
              </h1>

              <div className="max-w-2xl mx-auto relative">
                <Search className="w-5 h-5 text-[#EA580C] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Vedas, Hanuman Chalisa, Jagannath Puri, Bhagavad Gita..."
                  className={`w-full pl-12 pr-20 py-3.5 rounded-full border-2 text-sm sm:text-base focus:outline-none focus:border-[#EA580C] ${
                    darkMode ? 'bg-[#18100B] border-amber-500/30' : 'bg-white border-amber-900/15'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#EA580C]"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Daily Shloka */}
              <div
                className={`max-w-3xl mx-auto rounded-3xl p-5 border text-left ${
                  darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-300/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-extrabold uppercase text-[#EA580C]">
                    {DAILY_SACRED_SHLOKAS[activeShlokaIndex].source}
                  </span>
                  <button
                    onClick={() => setActiveShlokaIndex((p) => (p + 1) % DAILY_SACRED_SHLOKAS.length)}
                    className="text-xs font-bold text-[#EA580C] hover:underline"
                  >
                    Next Shloka →
                  </button>
                </div>
                <p className="font-serif text-base sm:text-lg font-bold text-[#EA580C]">
                  {DAILY_SACRED_SHLOKAS[activeShlokaIndex].sanskrit}
                </p>
                <p className="text-xs sm:text-sm mt-1.5 opacity-90">{DAILY_SACRED_SHLOKAS[activeShlokaIndex].hindi}</p>
              </div>
            </section>

            {/* 12 Categories */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold">Browse by Sacred Category</h2>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className="px-3.5 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                  >
                    Show All ({approvedItems.length})
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {CATEGORIES.map((cat) => {
                  const count = approvedItems.filter((i) => i.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? 'All' : cat.id)}
                      className={`relative h-32 rounded-2xl overflow-hidden text-left p-3.5 flex flex-col justify-between border-2 transition-all ${
                        isSelected ? 'border-[#EA580C] ring-2 ring-[#EA580C]/40' : 'border-amber-500/20 hover:border-amber-400'
                      }`}
                    >
                      <SacredImageFrame
                        src={cat.bgImage}
                        fallbackSrc={cat.fallbackBgImage}
                        alt={cat.name}
                        mode={imageFitMode}
                        className="absolute inset-0 w-full h-full"
                      />
                      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
                      <span className="relative z-10 px-2 py-0.5 rounded bg-amber-500 text-[#1C0D06] font-black text-[10px] w-fit">
                        {cat.code} · {count}
                      </span>
                      <div className="relative z-10 text-white">
                        <div className="font-bold text-sm leading-tight">{cat.name}</div>
                        <div className="text-[11px] text-amber-300 font-serif">{cat.sanskrit}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Verified Scriptures Grid */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold">
                  {selectedCategory === 'All' ? 'Verified Sacred Knowledge' : `${selectedCategory} Collection`} ({filteredItems.length})
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                      darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                    }`}
                  >
                    <option value="All">All 27 Languages</option>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowBookmarksOnly((b) => !b)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1 ${
                      showBookmarksOnly ? 'bg-[#EA580C] text-white border-[#EA580C]' : 'border-amber-500/25'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Saved ({bookmarkedIds.length})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  const isBookmarked = bookmarkedIds.includes(item.id);
                  return (
                    <article
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setDetailLang(selectedLanguageFilter !== 'All' ? selectedLanguageFilter : 'English');
                      }}
                      className={`rounded-2xl border overflow-hidden cursor-pointer flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                        darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                      }`}
                    >
                      <div className="h-52 relative bg-[#1C0F0A]">
                        <SacredImageFrame
                          src={item.imageUrl || fallbackArtworkForItem(item)}
                          fallbackSrc={item.fallbackImageUrl || fallbackArtworkForItem(item)}
                          alt={item.title}
                          mode={imageFitMode}
                          className="w-full h-full"
                        />
                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/80 text-amber-200 text-xs font-bold">
                          {item.sanskritBadge || item.category}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                            );
                          }}
                          className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
                            isBookmarked ? 'bg-[#EA580C] text-white' : 'bg-black/60 text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg line-clamp-2">{item.title}</h3>
                          <p className={`text-xs mt-1.5 line-clamp-3 ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> {(item.views || 0).toLocaleString()}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setLikedIds((prev) =>
                                  prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                                );
                              }}
                              className={`flex items-center gap-1 ${isLiked ? 'text-red-500 font-bold' : ''}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                              <span>{item.likes || 0}</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingItem(item);
                              }}
                              className="px-2 py-0.5 rounded bg-amber-500/15 text-[#EA580C] font-bold flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                          </div>
                          <span className="font-bold text-[#EA580C] flex items-center gap-0.5">
                            Read <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* 108-Bead Naam Jaap Counter */}
        {activeView === 'jaap' && (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <button
              onClick={() => navigateToView('home')}
              className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/15"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Sacred Library</span>
            </button>

            <div className={`rounded-3xl p-6 sm:p-8 border text-center space-y-6 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
              <h1 className="text-2xl sm:text-3xl font-black">108-Bead Naam Jaap Counter</h1>
              <div className="flex flex-wrap justify-center gap-2">
                {JAAP_MANTRAS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMantraId(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      selectedMantraId === m.id ? 'bg-[#EA580C] text-white border-[#EA580C]' : 'border-amber-500/25'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <p className="font-serif text-lg text-[#EA580C] font-bold">{activeMantra.sanskrit}</p>
              <button
                onClick={handleIncrementJaap}
                className="mx-auto w-56 h-56 rounded-full bg-gradient-to-br from-[#EA580C] to-amber-700 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform border-8 border-amber-300/50 animate-pulse-glow"
              >
                <span className="text-5xl font-black">{currentCount}</span>
                <span className="text-xs font-bold mt-1">
                  Bead {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} / 108
                </span>
                <span className="text-[11px] opacity-90 mt-1">
                  Malas: {Math.floor(currentCount / 108)} · Lifetime: {lifetimeCount.toLocaleString()}
                </span>
              </button>
              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  onClick={() => setAutoJaapActive((a) => !a)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                >
                  {autoJaapActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{autoJaapActive ? 'Pause Auto Jaap' : 'Auto Jaap'}</span>
                </button>
                <button
                  onClick={() => setSoundEnabled((s) => !s)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentCount(0);
                    setAutoJaapActive(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600/15 text-red-500 text-xs font-bold flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Mala</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {activeView === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                  <ShieldCheck className="w-7 h-7 text-[#EA580C]" />
                  <span>Admin Approval &amp; Global Cross-Browser Sync</span>
                </h1>
                <p className="text-xs opacity-75 mt-1">
                  All visitor uploads and edit proposals land in Pending Approval. Approved changes sync globally to all browsers &amp; devices.
                </p>
              </div>
              {isAdminAuthenticated && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchGlobalItems}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold"
                  >
                    Refresh Queue
                  </button>
                  <button
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      try { localStorage.removeItem('sanatan_admin_auth'); } catch (e) {}
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-600/15 text-red-500 text-xs font-bold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {!isAdminAuthenticated ? (
              <form
                onSubmit={handleAdminLogin}
                className={`max-w-md mx-auto rounded-3xl p-6 border space-y-4 ${
                  darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold text-[#EA580C]">
                  <Lock className="w-4 h-4" />
                  <span>Enter Admin Passcode</span>
                </div>
                <input
                  type="password"
                  value={adminPasscodeInput}
                  onChange={(e) => setAdminPasscodeInput(e.target.value)}
                  placeholder="Enter Admin passcode"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-amber-50/50 border-amber-900/20'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold uppercase"
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setAdminTab('pending')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'pending' ? 'bg-[#EA580C] text-white' : 'bg-amber-500/15'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending Approval Queue ({pendingItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('published')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'published' ? 'bg-[#EA580C] text-white' : 'bg-amber-500/15'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published Content ({approvedItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('sync')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'sync' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/15 text-emerald-500'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌍 Global Cross-Browser Sync</span>
                  </button>
                </div>

                {adminTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingItems.length === 0 ? (
                      <div className={`p-8 rounded-2xl border text-center text-sm ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                        No pending uploads or edit proposals right now.
                      </div>
                    ) : (
                      pendingItems.map((it) => (
                        <div
                          key={it.id}
                          className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between gap-4 ${
                            darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-bold">
                              PENDING ADMIN APPROVAL · {it.category}
                            </span>
                            <h3 className="font-bold text-lg">{it.title}</h3>
                            <p className="text-xs opacity-80">{it.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleApproveItem(it.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" /> Approve &amp; Publish
                            </button>
                            <button
                              onClick={() => setEditingItem(it)}
                              className="px-3 py-2 rounded-xl bg-amber-500/20 text-xs font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteItem(it.id)}
                              className="px-3 py-2 rounded-xl bg-red-600/15 text-red-500 text-xs font-bold flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {adminTab === 'published' && (
                  <div className="space-y-3">
                    {approvedItems.map((it) => (
                      <div
                        key={it.id}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                          darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-bold text-[#EA580C]">{it.category}</span>
                          <h3 className="font-bold text-sm sm:text-base">{it.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingItem(it)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(it.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/15 text-red-500 text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {adminTab === 'sync' && (
                  <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-[#18100B] border-emerald-500/30' : 'bg-white border-emerald-600/25'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 className="font-bold text-lg text-emerald-500">🌍 Global Cross-Browser Sync Engine</h2>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                        Status: {globalSyncStatus === 'synced' ? `Connected${lastGlobalSyncTime ? ` (${lastGlobalSyncTime})` : ''}` : globalSyncStatus}
                      </span>
                    </div>
                    <p className="text-xs opacity-85 leading-relaxed">
                      Every Admin approval, cover image update, YouTube link update, or scripture edit automatically syncs to <code>/api/sync</code> → <code>public/sanatan-global-db.json</code> so visitors on Chrome, Safari, Edge, and mobile phones all see your updates immediately.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => pushGlobalSnapshot(items)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      >
                        🚀 Push All Current Edits &amp; Uploads Globally Now
                      </button>
                      <button
                        onClick={handleDownloadGlobalJson}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                      >
                        ⬇️ Download public/sanatan-global-db.json
                      </button>
                      <button
                        onClick={() => {
                          try {
                            navigator.clipboard?.writeText(JSON.stringify({ updatedAt: new Date().toISOString(), items }, null, 2));
                            showToast('Copied global database JSON!');
                          } catch (e) {}
                        }}
                        className="px-4 py-2.5 rounded-xl border border-amber-500/30 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Scripture Reader Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border space-y-5 ${
              darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={detailLang}
                  onChange={(e) => setDetailLang(e.target.value)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
                    darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-white border-amber-900/20'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => openSacredPrintablePdf(selectedItem, detailLang)}
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF eBook
                </button>
                <button
                  onClick={() => setEditingItem(selectedItem)}
                  className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full bg-amber-500/15">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="h-64 rounded-2xl overflow-hidden">
              <SacredImageFrame
                src={selectedItem.imageUrl || fallbackArtworkForItem(selectedItem)}
                fallbackSrc={selectedItem.fallbackImageUrl || fallbackArtworkForItem(selectedItem)}
                alt={selectedItem.title}
                mode={imageFitMode}
                className="w-full h-full"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black">{selectedItem.title}</h1>
            <p className="text-xs sm:text-sm opacity-80">{selectedItem.description}</p>

            <SacredVideoPlayer item={selectedItem} darkMode={darkMode} lang={detailLang} />

            <div
              className={`whitespace-pre-line leading-relaxed ${
                readerFontSize === 'xl' ? 'text-xl' : readerFontSize === 'lg' ? 'text-lg' : 'text-base'
              }`}
            >
              {getBodyForLanguage(selectedItem, detailLang)}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleUploadSubmit}
            className={`rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border space-y-4 ${
              darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#EA580C]" />
                <span>Upload Sacred Content</span>
              </h2>
              <button type="button" onClick={() => setIsUploadOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs opacity-75">
              Community submissions enter the Admin Pending Approval Queue and appear publicly once approved by Admin.
            </p>

            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="Title *"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className={`px-3.5 py-2 rounded-xl border text-sm ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={uploadForm.author}
                onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })}
                placeholder="Author / Scriptural Source"
                className={`px-3.5 py-2 rounded-xl border text-sm ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              />
            </div>

            <input
              type="text"
              required
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Short summary *"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={uploadForm.imageUrl}
                onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
                placeholder="Cover Image URL (optional)"
                className={`px-3.5 py-2 rounded-xl border text-xs ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const compressed = await compressCoverImageFile(file);
                  if (compressed) {
                    setUploadForm((prev) => ({ ...prev, imageUrl: compressed }));
                    showToast('Cover photo attached!');
                  }
                }}
                className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-[#EA580C] file:text-white file:font-bold"
              />
            </div>

            <input
              type="text"
              value={uploadForm.videoUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
              placeholder="YouTube Video Link (optional)"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <textarea
              rows={4}
              value={uploadForm.bodyEnglish}
              onChange={(e) => setUploadForm({ ...uploadForm, bodyEnglish: e.target.value })}
              placeholder="Full English text & meaning *"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <textarea
                rows={3}
                value={uploadForm.bodyHindi}
                onChange={(e) => setUploadForm({ ...uploadForm, bodyHindi: e.target.value })}
                placeholder="Hindi text (हिन्दी)"
                className={`px-3.5 py-2 rounded-xl border text-sm ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              />
              <textarea
                rows={3}
                value={uploadForm.bodySanskrit}
                onChange={(e) => setUploadForm({ ...uploadForm, bodySanskrit: e.target.value })}
                placeholder="Sanskrit text (संस्कृतम्)"
                className={`px-3.5 py-2 rounded-xl border text-sm ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              />
            </div>

            {isAdminAuthenticated && (
              <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uploadForm.publishDirectlyAsAdmin}
                  onChange={(e) => setUploadForm({ ...uploadForm, publishDirectlyAsAdmin: e.target.checked })}
                />
                <span>Admin Override: Approve &amp; publish immediately</span>
              </label>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold">
                {isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin ? 'Publish Now' : 'Submit for Admin Approval'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveEditedItem}
            className={`rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border space-y-4 ${
              darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Edit Sacred Item</h2>
              <button type="button" onClick={() => setEditingItem(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              required
              value={editingItem.title}
              onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <input
              type="text"
              required
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={editingItem.imageUrl?.startsWith('data:') ? '' : editingItem.imageUrl || ''}
                onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                placeholder="Cover Image URL"
                className={`px-3.5 py-2 rounded-xl border text-xs ${
                  darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
                }`}
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const compressed = await compressCoverImageFile(file);
                  if (compressed) {
                    setEditingItem({ ...editingItem, imageUrl: compressed });
                    showToast('New cover image ready!');
                  }
                }}
                className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-[#EA580C] file:text-white file:font-bold"
              />
            </div>

            <input
              type="text"
              value={editingItem.videoUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
              placeholder="YouTube Video Link"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

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

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold">
                {isAdminAuthenticated ? 'Save & Sync Globally' : 'Submit Edit for Admin Approval'}
              </button>
            </div>
          </form>
        </div>
      )}

      <footer className="bg-[#1C0F0A] text-amber-100/90 mt-16 border-t border-amber-500/20 py-8 px-4 text-center text-xs">
        <p>© 2026 Sanatan Setu Library · Authentic Admin-Moderated Vedic Scripture Archive</p>
      </footer>
    </div>
  );
}
