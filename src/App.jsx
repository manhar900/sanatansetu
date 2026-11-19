import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Plus, ChevronRight,
  Check, FileText
} from 'lucide-react';

// Default Admin Passcode (override via VITE_ADMIN_PASSWORD in Vercel Environment Variables if desired)
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
      } catch {
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

// IndexedDB Engine for Large Media / Content Storage
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
    } catch {}
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
    } catch {
      return null;
    }
  }
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
  { id: 'Vedas', code: 'VED', name: 'Vedas', sanskrit: 'वेद', description: 'Rigveda, Yajurveda, Samaveda, and Atharvaveda.' },
  { id: 'Upanishads', code: 'UPN', name: 'Upanishads', sanskrit: 'उपनिषद्', description: 'Vedanta philosophy and spiritual realizations of the Rishis.' },
  { id: 'Bhagavad Gita', code: 'BG', name: 'Bhagavad Gita', sanskrit: 'श्रीमद्भगवद्गीता', description: 'Teachings on Karma, Bhakti, and Jnana Yoga.' },
  { id: 'Ramayana', code: 'RM', name: 'Ramayana', sanskrit: 'रामायण', description: 'Chronicles of Maryada Purushottama Sri Rama.' },
  { id: 'Mahabharata', code: 'MB', name: 'Mahabharata', sanskrit: 'महाभारत', description: 'Epic narrative of Dharma, Kurukshetra, and statecraft.' },
  { id: 'Puranas', code: 'PUR', name: 'Puranas', sanskrit: 'पुराण', description: 'Sacred Maha Puranas on cosmic traditions and avatars.' },
  { id: 'Mantras', code: 'MTR', name: 'Mantras', sanskrit: 'मन्त्र', description: 'Vedic chants, Stotrams, and daily invocations.' },
  { id: 'Bhajans', code: 'BHJ', name: 'Bhajans', sanskrit: 'भजन', description: 'Devotional Aartis, Stutis, and sacred hymns.' },
  { id: 'Festivals', code: 'UTS', name: 'Festivals', sanskrit: 'उत्सव', description: 'Sacred Utsavs and Vrats across the Vedic calendar.' },
  { id: 'Temples', code: 'MDR', name: 'Temples', sanskrit: 'मन्दिर', description: 'Char Dham, Jyotirlingas, Shaktipeethas, and Mandir heritage.' },
  { id: 'Philosophy', code: 'DRS', name: 'Philosophy', sanskrit: 'दर्शन', description: 'Shad Darshana — Vedanta, Yoga, Samkhya, Nyaya, Vaisheshika, Mimamsa.' },
  { id: 'Sant Teachings', code: 'SNT', name: 'Sant Teachings', sanskrit: 'सन्त वाणी', description: 'Wisdom of Bhakti saints and spiritual acharyas.' }
].map((c) => ({
  ...c,
  bgImage: createSacredArtwork({
    title: c.name,
    sanskrit: c.sanskrit,
    subtitle: `${c.code} · Sanatan Setu`,
    c1: '#3b0764',
    c2: '#7c2d12',
    c3: '#d97706',
    accent: '#fde047',
    motif: c.id === 'Temples' ? 'temple' : c.id === 'Mantras' ? 'trishul' : 'lotus'
  })
}));

export const INITIAL_SACRED_ITEMS = [
  {
    id: 'jagannath-temple-puri',
    title: 'Jagannath Temple (Puri): Eastern Char Dham Guide',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Overview of Shree Jagannath Puri Dham, Daru Brahma, Rath Yatra, and Mahaprasad tradition.',
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
      English: 'Shree Jagannath Temple in Puri, Odisha is one of the four Char Dham pilgrimage sites dedicated to Lord Jagannath, Lord Balabhadra, and Devi Subhadra, renowned for its Kalinga architecture, annual Rath Yatra, and Mahaprasad.',
      Hindi: 'श्री जगन्नाथ मंदिर, पुरी (ओडिशा) सनातन धर्म के चार धामों में प्रमुख है, जहाँ भगवान जगन्नाथ, बलभद्र और सुभद्रा विराजमान हैं।',
      Sanskrit: 'नीलाचलनिवासाय नित्याय परमात्मने । बलभद्रसुभद्राभ्यां जगन्नाथाय ते नमः ॥'
    }
  },
  {
    id: 'bhagavad-gita-ch2-v47',
    title: 'Bhagavad Gita – Chapter 2, Verse 47: Karma Yoga',
    category: 'Bhagavad Gita',
    sanskritBadge: 'गीता · Sankhya Yoga 2.47',
    contentType: 'Text',
    description: 'Karmanye Vadhikaraste Ma Phaleshu Kadachana — verse and meaning on equanimous action.',
    views: 28487,
    likes: 8304,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Bhagavad Gita 2.47',
      sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      subtitle: 'Nishkama Karma Yoga',
      c1: '#172554', c2: '#1e3a8a', c3: '#d97706', accent: '#fde047', motif: 'chakra'
    }),
    tags: ['karma', 'gita', 'krishna', 'yoga'],
    body: {
      English: 'You have a right to perform your prescribed duty, but never to the fruits of action; let not fruit be your motive, nor let your attachment be to inaction.',
      Hindi: 'तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं; इसलिए कर्मफल का हेतु मत बन और अकर्म में भी आसक्ति न रख।',
      Sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥'
    }
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra: Rigveda 3.62.10 Prayer for Wisdom',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Rigveda 3.62.10',
    contentType: 'Text',
    description: 'Vedamata Gayatri Mantra invoking divine illumination and righteous intellect.',
    views: 24184,
    likes: 7222,
    language: 'Sanskrit',
    author: 'Brahmarshi Vishvamitra',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: createSacredArtwork({
      title: 'Gayatri Mantra',
      sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं',
      subtitle: 'Rigveda 3.62.10',
      c1: '#451a03', c2: '#b45309', c3: '#f59e0b', accent: '#fef9c3', motif: 'himalaya'
    }),
    tags: ['gayatri', 'rigveda', 'mantra', 'wisdom'],
    body: {
      English: 'We meditate upon the adorable radiance of Savitr, the Supreme Creator; may He illuminate and inspire our intellect.',
      Hindi: 'हम सविता देव के दिव्य तेज का ध्यान करते हैं, जो हमारी बुद्धि को सन्मार्ग में प्रेरित करे।',
      Sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥'
    }
  }
];

export const JAAP_MANTRAS = [
  { id: 'om-namah-shivaya', name: 'Om Namah Shivaya', sanskrit: 'ॐ नमः शिवाय', deity: 'Lord Shiva' },
  { id: 'hare-krishna', name: 'Hare Krishna Maha Mantra', sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥', deity: 'Sri Radha-Krishna & Sri Rama' },
  { id: 'jai-shri-ram', name: 'Shri Ram Jai Ram Jai Jai Ram', sanskrit: 'श्री राम जय राम जय जय राम', deity: 'Sri Rama' },
  { id: 'gayatri-jaap', name: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', deity: 'Vedamata Gayatri' },
  { id: 'mahamrityunjaya-jaap', name: 'Mahamrityunjaya Mantra', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥', deity: 'Lord Mrityunjaya Shiva' }
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
    osc.frequency.setValueAtTime(type === 'bell' ? 528 : 440, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + (type === 'bell' ? 1.2 : 0.25));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (type === 'bell' ? 1.2 : 0.25));
  } catch {}
}

export function getBodyForLanguage(item, lang = 'English') {
  if (!item || !item.body) return item?.description || '';
  if (typeof item.body === 'string') return item.body;
  return item.body[lang] || item.body.English || item.body.Hindi || item.body.Sanskrit || item.description || '';
}

function normalizeItemApproval(it, forcePendingForUserUpload = false) {
  if (!it || !it.id) return null;
  if (forcePendingForUserUpload && it.isUserUploaded) {
    return { ...it, status: 'pending', isApproved: false };
  }
  const isApproved = it.status === 'approved' || it.isApproved === true;
  return {
    ...it,
    status: isApproved ? 'approved' : 'pending',
    isApproved
  };
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_dark_mode') || 'false');
    } catch {
      return false;
    }
  });

  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLang, setDetailLang] = useState('English');

  // Global sync endpoint / GitHub config (optional, configured in Admin -> Global Sync)
  const [syncEndpointUrl, setSyncEndpointUrl] = useState(() => {
    try {
      return localStorage.getItem('sanatan_global_sync_endpoint') || '/api/sync';
    } catch {
      return '/api/sync';
    }
  });
  const [globalReadUrl, setGlobalReadUrl] = useState(() => {
    try {
      return localStorage.getItem('sanatan_global_read_url') || '/sanatan-global-db.json';
    } catch {
      return '/sanatan-global-db.json';
    }
  });
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sanatan_setu_items_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((x) => normalizeItemApproval(x, false)).filter(Boolean);
        }
      }
    } catch {}
    return INITIAL_SACRED_ITEMS;
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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
    bodyEnglish: '',
    bodyHindi: '',
    bodySanskrit: ''
  });

  const [selectedMantraId, setSelectedMantraId] = useState(JAAP_MANTRAS[0].id);
  const [currentCount, setCurrentCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_current') || 0); } catch { return 0; }
  });
  const [lifetimeCount, setLifetimeCount] = useState(() => {
    try { return Number(localStorage.getItem('sanatan_jaap_lifetime') || 0); } catch { return 0; }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoJaapActive, setAutoJaapActive] = useState(false);

  const videoContainerRef = useRef(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Push global snapshot to server endpoint (e.g., Vercel serverless function /api/sync writing to GitHub)
  const pushGlobalSnapshot = useCallback(async (nextItems) => {
    if (!syncEndpointUrl || typeof fetch === 'undefined') return;
    setIsSyncingGlobal(true);
    try {
      const payload = {
        updatedAt: new Date().toISOString(),
        items: nextItems
      };
      const res = await fetch(syncEndpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('Synced changes to global store for all browsers.');
      }
    } catch {
      // Saved locally in browser; configure /api/sync or export JSON for other browsers
    } finally {
      setIsSyncingGlobal(false);
    }
  }, [syncEndpointUrl, showToast]);

  // Fetch global snapshot on startup so other browsers see globally published updates
  useEffect(() => {
    if (!globalReadUrl || typeof fetch === 'undefined') return;
    let active = true;
    fetch(`${globalReadUrl}?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const remoteList = Array.isArray(data) ? data : data.items;
        if (!Array.isArray(remoteList) || remoteList.length === 0) return;
        setItems((prev) => {
          const remoteMap = new Map(remoteList.map((it) => [String(it.id), normalizeItemApproval(it, false)]));
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
      })
      .catch(() => {});
    return () => { active = false; };
  }, [globalReadUrl]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items));
      SanatanUnlimitedDB.saveItems(items);
    } catch {}
  }, [darkMode, items]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_likes', JSON.stringify(likedIds));
      localStorage.setItem('sanatan_setu_bookmarks', JSON.stringify(bookmarkedIds));
      localStorage.setItem('sanatan_jaap_current', String(currentCount));
      localStorage.setItem('sanatan_jaap_lifetime', String(lifetimeCount));
    } catch {}
  }, [likedIds, bookmarkedIds, currentCount, lifetimeCount]);

  // Browser back button support for views and modals
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
      } catch {}
    }
  }, []);

  // Strict Admin-Approved Public Items vs Pending Queue
  const approvedItems = useMemo(
    () => items.filter((it) => it.status === 'approved' || it.isApproved === true),
    [items]
  );

  const pendingItems = useMemo(
    () => items.filter((it) => it.status === 'pending' && it.isApproved !== true),
    [items]
  );

  const filteredItems = useMemo(() => {
    return approvedItems.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchLang =
        selectedLanguageFilter === 'All' ||
        item.language === selectedLanguageFilter ||
        Boolean(item.body && typeof item.body === 'object' && item.body[selectedLanguageFilter]);
      const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(item.id);
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        (item.category || '').toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q) ||
        (item.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchCat && matchLang && matchBookmark && matchSearch;
    });
  }, [approvedItems, selectedCategory, selectedLanguageFilter, showBookmarksOnly, bookmarkedIds, searchQuery]);

  const handleIncrementJaap = useCallback(() => {
    setCurrentCount((prev) => {
      const next = prev + 1;
      if (soundEnabled) {
        playSacredSound(next % 108 === 0 ? 'bell' : 'bead');
      }
      return next;
    });
    setLifetimeCount((prev) => prev + 1);
  }, [soundEnabled]);

  useEffect(() => {
    if (!autoJaapActive) return;
    const t = setInterval(handleIncrementJaap, 2200);
    return () => clearInterval(t);
  }, [autoJaapActive, handleIncrementJaap]);

  // Any user can upload; items start as 'pending' unless Admin approves them
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const bodyText =
      uploadForm.bodyEnglish.trim() ||
      uploadForm.bodyHindi.trim() ||
      uploadForm.bodySanskrit.trim() ||
      uploadForm.description.trim();

    if (!uploadForm.title.trim() || !uploadForm.description.trim() || !bodyText) {
      showToast('Please fill in Title, Description, and Content.');
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === uploadForm.category) || CATEGORIES[0];
    const nowIso = new Date().toISOString();
    const newItem = {
      id: `${uploadForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32)}-${Date.now().toString().slice(-5)}`,
      title: uploadForm.title.trim(),
      category: uploadForm.category,
      sanskritBadge: `${catObj.sanskrit} · ${catObj.name}`,
      contentType: uploadForm.videoUrl ? 'Video' : uploadForm.pdfUrl ? 'PDF' : 'Text',
      views: 0,
      likes: 0,
      language: uploadForm.language || 'English',
      author: uploadForm.author.trim() || 'Community Contributor',
      imageUrl: cleanExternalUrl(uploadForm.imageUrl) || catObj.bgImage,
      pdfUrl: cleanExternalUrl(uploadForm.pdfUrl),
      pdfFileName: uploadForm.pdfFileName || '',
      videoUrl: cleanExternalUrl(uploadForm.videoUrl),
      tags: [uploadForm.category.toLowerCase(), 'community'],
      isFeatured: false,
      isUserUploaded: true,
      status: 'pending',
      isApproved: false,
      updatedAt: nowIso,
      description: uploadForm.description.trim(),
      body: {
        English: uploadForm.bodyEnglish.trim() || bodyText,
        Hindi: uploadForm.bodyHindi.trim() || bodyText,
        Sanskrit: uploadForm.bodySanskrit.trim() || bodyText
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
      bodyEnglish: '',
      bodyHindi: '',
      bodySanskrit: ''
    });
    showToast('Submitted! Content is in the Admin Pending Queue until Admin approves it.');
  };

  // Admin approves & publishes item + pushes global update
  const handleApproveItem = (id) => {
    const updated = items.map((it) =>
      it.id === id
        ? { ...it, status: 'approved', isApproved: true, updatedAt: new Date().toISOString() }
        : it
    );
    setItems(updated);
    pushGlobalSnapshot(updated);
    showToast('Approved and published.');
  };

  const handleRejectOrDeleteItem = (id) => {
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    pushGlobalSnapshot(updated);
    showToast('Item removed.');
  };

  const handleSaveEditedItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const cleanedEdit = {
      ...editingItem,
      imageUrl: cleanExternalUrl(editingItem.imageUrl),
      pdfUrl: cleanExternalUrl(editingItem.pdfUrl),
      videoUrl: cleanExternalUrl(editingItem.videoUrl),
      // Non-admins proposing an edit stay pending unless Admin is logged in
      status: isAdminAuthenticated ? (editingItem.status || 'approved') : 'pending',
      isApproved: isAdminAuthenticated ? (editingItem.isApproved !== false) : false,
      updatedAt: new Date().toISOString()
    };
    const updated = items.map((it) => (it.id === cleanedEdit.id ? cleanedEdit : it));
    setItems(updated);
    if (selectedItem && selectedItem.id === cleanedEdit.id) {
      setSelectedItem(cleanedEdit);
    }
    setEditingItem(null);
    if (isAdminAuthenticated) {
      pushGlobalSnapshot(updated);
      showToast('Changes saved and synced.');
    } else {
      showToast('Edit submitted to Admin Pending Queue for approval.');
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
    if (adminPasscodeInput.trim() === DEFAULT_ADMIN_PASSCODE) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch {}
      setAdminPasscodeInput('');
      showToast('Admin unlocked.');
    } else {
      showToast('Incorrect Admin passcode.');
    }
  };

  const activeMantra = useMemo(
    () => JAAP_MANTRAS.find((m) => m.id === selectedMantraId) || JAAP_MANTRAS[0],
    [selectedMantraId]
  );

  const ytId = extractYouTubeId(selectedItem?.videoUrl || '');
  const ytEmbedUrl = getYouTubeEmbedUrl(selectedItem?.videoUrl || '');

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        darkMode ? 'bg-[#0F0A07] text-amber-50' : 'bg-[#FFFBEB] text-[#2C1A12]'
      }`}
    >
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A12] text-amber-100 px-5 py-3 rounded-2xl shadow-xl border border-amber-500/40 text-sm flex items-center gap-2">
          <SacredLotusIcon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur ${
          darkMode ? 'bg-[#160E09]/95 border-amber-500/20' : 'bg-[#FFFBEB]/95 border-amber-900/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigateToView('home')}
            className="flex items-center gap-2.5 text-left font-black text-lg sm:text-xl"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-[#EA580C] text-white flex items-center justify-center font-serif text-xl shadow">
              ॐ
            </span>
            <span>Sanatan Setu</span>
          </button>

          <nav className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => navigateToView('home')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                activeView === 'home' ? 'bg-[#EA580C] text-white' : 'hover:bg-amber-500/15'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('jaap')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                activeView === 'jaap' ? 'bg-[#EA580C] text-white' : 'hover:bg-amber-500/15'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>108 Jaap</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border border-amber-500/30 hover:bg-amber-500/15 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4 text-[#EA580C]" />
              <span>Upload</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToView('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'border-amber-500/30 hover:bg-amber-500/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
              {pendingItems.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px]">
                  {pendingItems.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle dark mode"
              className="p-2 rounded-xl border border-amber-500/30 hover:bg-amber-500/15"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {activeView === 'home' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Search & Language Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-2xl">
                <Search className="w-4 h-4 text-[#EA580C] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scriptures, temples, mantras..."
                  className={`w-full pl-10 pr-10 py-3 rounded-2xl border text-sm focus:outline-none focus:border-[#EA580C] ${
                    darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#EA580C]"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={selectedLanguageFilter}
                  onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold ${
                    darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                  }`}
                >
                  <option value="All">All 27 Languages</option>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowBookmarksOnly((b) => !b)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    showBookmarksOnly ? 'bg-[#EA580C] text-white border-[#EA580C]' : 'border-amber-500/25'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved ({bookmarkedIds.length})</span>
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('All')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                  selectedCategory === 'All'
                    ? 'bg-[#EA580C] text-white'
                    : darkMode
                    ? 'bg-[#18100B] border border-amber-500/20'
                    : 'bg-white border border-amber-900/15'
                }`}
              >
                All ({approvedItems.length})
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#EA580C] text-white'
                      : darkMode
                      ? 'bg-[#18100B] border border-amber-500/20'
                      : 'bg-white border border-amber-900/15'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Approved Sacred Content Grid */}
            {filteredItems.length === 0 ? (
              <div className={`rounded-3xl p-10 text-center border ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                <p className="font-bold text-sm">No matching approved content found.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedLanguageFilter('All');
                    setSearchQuery('');
                    setShowBookmarksOnly(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  const isBookmarked = bookmarkedIds.includes(item.id);
                  return (
                    <article
                      key={item.id}
                      onClick={() => {
                        setSelectedItem(item);
                        setDetailLang(selectedLanguageFilter !== 'All' ? selectedLanguageFilter : item.language || 'English');
                      }}
                      className={`rounded-2xl border overflow-hidden cursor-pointer flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl ${
                        darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                      }`}
                    >
                      <div className="h-48 relative bg-[#1C0F0A] overflow-hidden">
                        <img
                          src={cleanExternalUrl(item.imageUrl) || CATEGORIES[0].bgImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 text-amber-200 text-xs font-bold">
                          {item.category}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookmarkedIds((prev) =>
                              prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                            );
                          }}
                          aria-label="Bookmark item"
                          className={`absolute top-3 right-3 p-2 rounded-full ${
                            isBookmarked ? 'bg-[#EA580C] text-white' : 'bg-black/60 text-white'
                          }`}
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div>
                          <h2 className="font-bold text-lg line-clamp-2">{item.title}</h2>
                          <p className={`text-xs mt-1.5 line-clamp-3 ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> {item.views || 0}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLikedIds((prev) =>
                                  prev.includes(item.id) ? prev.filter((x) => x !== item.id) : [...prev, item.id]
                                );
                                setItems((prev) =>
                                  prev.map((it) =>
                                    it.id === item.id
                                      ? { ...it, likes: Math.max(0, (it.likes || 0) + (isLiked ? -1 : 1)) }
                                      : it
                                  )
                                );
                              }}
                              className={`flex items-center gap-1 ${isLiked ? 'text-red-500 font-bold' : ''}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                              <span>{item.likes || 0}</span>
                            </button>
                            <button
                              type="button"
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
            )}
          </div>
        )}

        {/* 108-Bead Naam Jaap Counter View */}
        {activeView === 'jaap' && (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            <button
              type="button"
              onClick={() => navigateToView('home')}
              className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/15"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Library</span>
            </button>

            <div className={`rounded-3xl p-6 sm:p-8 border text-center space-y-6 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
              <h1 className="text-2xl sm:text-3xl font-black">108-Bead Naam Jaap Counter</h1>

              <div className="flex flex-wrap justify-center gap-2">
                {JAAP_MANTRAS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
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
                type="button"
                onClick={handleIncrementJaap}
                className="mx-auto w-52 h-52 rounded-full bg-gradient-to-br from-[#EA580C] to-amber-700 text-white shadow-2xl flex flex-col items-center justify-center active:scale-95 transition-transform border-8 border-amber-300/50"
              >
                <span className="text-5xl font-black">{currentCount}</span>
                <span className="text-xs font-bold mt-1">
                  Bead {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} / 108
                </span>
                <span className="text-[11px] opacity-90 mt-1">
                  Malas: {Math.floor(currentCount / 108)} · Total: {lifetimeCount}
                </span>
              </button>

              <div className="flex justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setAutoJaapActive((a) => !a)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                >
                  {autoJaapActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{autoJaapActive ? 'Stop Auto Jaap' : 'Auto Jaap'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled((s) => !s)}
                  className="px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </button>
                <button
                  type="button"
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

        {/* Admin Approval & Global Sync View */}
        {activeView === 'admin' && (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
                <ShieldCheck className="w-7 h-7 text-[#EA580C]" />
                <span>Admin Moderation &amp; Global Sync</span>
              </h1>
              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminAuthenticated(false);
                    try { localStorage.removeItem('sanatan_admin_auth'); } catch {}
                  }}
                  className="px-3.5 py-2 rounded-xl bg-red-600/15 text-red-500 text-xs font-bold"
                >
                  Lock Admin
                </button>
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
                  placeholder="Admin passcode"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${
                    darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-amber-50/50 border-amber-900/20'
                  }`}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold uppercase"
                >
                  Unlock Admin Panel
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setAdminTab('pending')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'pending' ? 'bg-[#EA580C] text-white' : 'bg-amber-500/15'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending Approval ({pendingItems.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('published')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'published' ? 'bg-[#EA580C] text-white' : 'bg-amber-500/15'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published ({approvedItems.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('sync')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      adminTab === 'sync' ? 'bg-[#EA580C] text-white' : 'bg-amber-500/15'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Global Cross-Browser Sync</span>
                  </button>
                </div>

                {adminTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingItems.length === 0 ? (
                      <div className={`p-8 rounded-2xl border text-center text-sm ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                        No items waiting for approval.
                      </div>
                    ) : (
                      pendingItems.map((it) => (
                        <div
                          key={it.id}
                          className={`p-5 rounded-2xl border flex flex-col sm:flex-row justify-between gap-4 ${
                            darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-amber-500">{it.category} · By {it.author}</span>
                            <h3 className="font-bold text-lg">{it.title}</h3>
                            <p className="text-xs opacity-80">{it.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleApproveItem(it.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                            >
                              <Check className="w-4 h-4" /> Approve &amp; Publish
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem(it)}
                              className="px-3 py-2 rounded-xl bg-amber-500/20 text-xs font-bold"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectOrDeleteItem(it.id)}
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
                            type="button"
                            onClick={() => setEditingItem(it)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-xs font-bold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectOrDeleteItem(it.id)}
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
                  <div className={`p-6 rounded-3xl border space-y-4 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                    <h2 className="font-bold text-lg">Share Updates Across All Browsers &amp; Devices</h2>
                    <p className="text-xs opacity-80 leading-relaxed">
                      Other browsers read from the Global JSON URL below on startup. When you approve or edit content as Admin, changes post to the Sync Endpoint (such as a Vercel API route writing to GitHub) and can also be exported as <code>sanatan-global-db.json</code> inside <code>public/</code>.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1">Global Read URL (for all visitors)</label>
                        <input
                          type="text"
                          value={globalReadUrl}
                          onChange={(e) => {
                            setGlobalReadUrl(e.target.value);
                            try { localStorage.setItem('sanatan_global_read_url', e.target.value); } catch {}
                          }}
                          className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                            darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/50 border-amber-900/20'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1">Admin Sync POST Endpoint</label>
                        <input
                          type="text"
                          value={syncEndpointUrl}
                          onChange={(e) => {
                            setSyncEndpointUrl(e.target.value);
                            try { localStorage.setItem('sanatan_global_sync_endpoint', e.target.value); } catch {}
                          }}
                          className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                            darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/50 border-amber-900/20'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isSyncingGlobal}
                        onClick={() => pushGlobalSnapshot(items)}
                        className="px-4 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
                      >
                        {isSyncingGlobal ? 'Syncing...' : 'Push Current State Now'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadGlobalJson}
                        className="px-4 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold"
                      >
                        Download sanatan-global-db.json
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            navigator.clipboard?.writeText(JSON.stringify(items, null, 2));
                            showToast('Copied library JSON to clipboard.');
                          } catch {}
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

      {/* Reader Modal (Includes Inline YouTube / Video Player Without Leaving Site) */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border space-y-5 ${
              darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-xs font-bold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="flex items-center gap-2">
                <select
                  value={detailLang}
                  onChange={(e) => setDetailLang(e.target.value)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold ${
                    darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-white border-amber-900/20'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-full bg-amber-500/15"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-black">{selectedItem.title}</h1>
            <p className="text-xs opacity-75">{selectedItem.description}</p>

            {/* On-Site YouTube Embed or Direct Video Player */}
            {selectedItem.videoUrl && (
              <div ref={videoContainerRef} className="space-y-2">
                {ytEmbedUrl && ytId ? (
                  <div className="aspect-video w-full rounded-2xl overflow-hidden border border-amber-500/30 bg-black">
                    <iframe
                      src={ytEmbedUrl}
                      title={selectedItem.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={cleanExternalUrl(selectedItem.videoUrl)}
                    controls
                    playsInline
                    className="w-full max-h-96 rounded-2xl bg-black border border-amber-500/30"
                  />
                )}
              </div>
            )}

            {selectedItem.pdfUrl && selectedItem.pdfUrl !== '#auto-pdf' && (
              <div className="p-3 rounded-2xl border border-amber-500/25 flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-red-600" />
                  <span>{selectedItem.pdfFileName || 'Attached PDF Document'}</span>
                </span>
                <a
                  href={cleanExternalUrl(selectedItem.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Open PDF
                </a>
              </div>
            )}

            <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed">
              {getBodyForLanguage(selectedItem, detailLang)}
            </div>

            <div className="pt-3 border-t border-amber-500/20 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setEditingItem(selectedItem)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Item
              </button>
              <button
                type="button"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/#article/${selectedItem.id}`;
                  navigator.clipboard?.writeText(shareUrl);
                  showToast('Link copied.');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal (Any User Can Submit; Goes to Admin Pending Queue) */}
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
                <span>Submit Content (Pending Admin Approval)</span>
              </h2>
              <button type="button" onClick={() => setIsUploadOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

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
                placeholder="Your Name / Source"
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
              placeholder="Short description *"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <input
              type="text"
              value={uploadForm.imageUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })}
              placeholder="Image URL (optional)"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <input
              type="text"
              value={uploadForm.videoUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
              placeholder="YouTube or MP4 video URL (optional)"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <textarea
              rows={4}
              value={uploadForm.bodyEnglish}
              onChange={(e) => setUploadForm({ ...uploadForm, bodyEnglish: e.target.value })}
              placeholder="Full text / meaning *"
              className={`w-full px-3.5 py-2 rounded-xl border text-sm ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
              >
                Submit for Admin Approval
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

            <input
              type="text"
              value={editingItem.imageUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
              placeholder="Image URL"
              className={`w-full px-3.5 py-2 rounded-xl border text-xs ${
                darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'
              }`}
            />

            <input
              type="text"
              value={editingItem.videoUrl || ''}
              onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })}
              placeholder="YouTube or MP4 video URL"
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
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold"
              >
                {isAdminAuthenticated ? 'Save & Sync' : 'Submit Edit for Approval'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
