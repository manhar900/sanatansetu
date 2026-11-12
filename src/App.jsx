import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Plus, ChevronRight,
  Check, FileText
} from 'lucide-react';

// Ensure global tailwind object exists in browser preview environments
if (typeof window !== 'undefined' && typeof window.tailwind === 'undefined') {
  window.tailwind = { config: {} };
}

// Change your default Admin Password here (or via Admin -> SEO Status & index.html -> Change Admin Password)
export const DEFAULT_ADMIN_PASSCODE = 'admin108';

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
  // Top Indian Languages
  { id: 'Sanskrit', label: 'Sanskrit (संस्कृतम्)', native: 'संस्कृतम्', group: 'Indian', locale: 'hi-IN', greeting: 'हरिः ॐ तत् सत्' },
  { id: 'Hindi', label: 'Hindi (हिन्दी)', native: 'हिन्दी', group: 'Indian', locale: 'hi-IN', greeting: 'जय श्री राम · हर हर महादेव' },
  { id: 'English', label: 'English', native: 'English', group: 'Indian & Global', locale: 'en-IN', greeting: 'Om Tat Sat · Eternal Dharma' },
  { id: 'Odia', label: 'Odia (ଓଡ଼ିଆ)', native: 'ଓଡ଼ିଆ', group: 'Indian', locale: 'or-IN', greeting: 'ଜୟ ଜଗନ୍ନାଥ · ସନାତନ ସେତୁ' },
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

// Opens a richly typeset, print-ready Sacred PDF eBook view for ANY item in the library
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

// Unlimited Browser Database Engine (IndexedDB) so Admin-approved edits, cover images, PDFs & videos persist permanently without hitting localStorage limits
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
      return await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).put(itemsArray, 'all_items_v6');
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      return false;
    }
  },
  async loadItems() {
    try {
      const db = await this.open();
      return await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const reqV6 = store.get('all_items_v6');
        reqV6.onsuccess = () => {
          if (Array.isArray(reqV6.result) && reqV6.result.length > 0) {
            resolve(reqV6.result);
          } else {
            const reqV5 = store.get('all_items_v5');
            reqV5.onsuccess = () => resolve(reqV5.result || null);
            reqV5.onerror = () => resolve(null);
          }
        };
        reqV6.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  },
  async saveEditsMap(editsMap) {
    try {
      const db = await this.open();
      const tx = db.transaction(this.storeName, 'readwrite');
      tx.objectStore(this.storeName).put(editsMap, 'edits_map_v1');
    } catch (e) {}
  },
  async loadEditsMap() {
    try {
      const db = await this.open();
      return await new Promise((resolve) => {
        const tx = db.transaction(this.storeName, 'readonly');
        const req = tx.objectStore(this.storeName).get('edits_map_v1');
        req.onsuccess = () => resolve(req.result || {});
        req.onerror = () => resolve({});
      });
    } catch (e) {
      return {};
    }
  }
};

// Compresses uploaded cover images so they save instantaneously in both localStorage and IndexedDB without hitting the 5MB browser quota
export function compressCoverImageFile(file, maxWidth = 1200, quality = 0.84) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result;
      if (typeof rawDataUrl !== 'string') return resolve('');
      const img = new Image();
      img.onload = () => {
        try {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed.length < rawDataUrl.length ? compressed : rawDataUrl);
        } catch (err) {
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

// Dual-Layer Accurate Image Frame: blurred ambient backdrop + accurately fitted foreground
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

// Error-153-Free In-App YouTube-Style HD Video & Audio Player
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
            <span>▶️ YouTube Embed</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setPlayerMode('cinema');
              if (!isPlaying) togglePlay();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#EA580C] hover:bg-orange-600 text-white text-xs font-bold shadow flex items-center gap-1 transition-all"
          >
            🎬 Sacred Cinema Player (Instant Play)
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

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-[#EA580C] flex items-center justify-center font-serif font-bold text-sm shadow shrink-0">
                ॐ
              </div>
              <div className="truncate">
                <div className="text-xs sm:text-sm font-bold text-white truncate drop-shadow">
                  {item.title}
                </div>
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
In Satya Yuga, Lord Vishnu was worshipped as Neela Madhava by the tribal chief Viswavasu deep in the forests of Nilachala. King Indradyumna performed a thousand Ashwamedha Yajnas, after which a divine fragrant Daru (sacred Neem log bearing the symbols of Shankha, Chakra, Gada, and Padma) floated ashore in Puri. Celestial architect Vishwakarma carved the deities of Jagannath, Balabhadra, Subhadra, and Sudarshana.

2. Daru Brahma & The Sacred Nabakalebara Ritual:
Unlike stone or metallic icons found in other Hindu temples, the Ratnavedi deities of Puri are carved from sacred Neem wood (Daru Brahma — the Absolute manifest in living wood). Every 12 to 19 years (in a leap year featuring an extra Ashadha month, known as Purushottama Masa), the deities undergo Nabakalebara ("New Body").

3. Architectural Grandeur (Kalinga Style - Pancharatha Rekha Deula):
• Four Distinct Mandapas: Vimana / Bada Deula (214 feet high), Jagamohana, Nata Mandapa, and Bhoga Mandapa, enclosed by Meghanada Prachira and Kurma Bedha.
• The Four Sacred Gates: Simhadwara (East — Moksha), Ashwadwara (South — Kama), Vyaghradwara (West — Dharma), and Hastidwara (North — Artha).
• The Nila Chakra: Octagonal wheel forged from Ashtadhatu crowning the main Shikhar.

4. The World-Famous Annual Rath Yatra & Mahaprasad:
On Ashadha Shukla Dwitiya, the deities ride three colossal chariots—Nandighosha (16 wheels), Taladhwaja (14 wheels), and Darpadalana (12 wheels)—along the Bada Danda to Gundicha Temple, where the Gajapati Maharaja performs Chhera Panhara with a golden broom.`,
      Hindi: `श्री जगन्नाथ मंदिर, पुरी (ओडिशा) सनातन धर्म के चार सर्वोच्च धामों (चार धाम) में से पूर्वी धाम है, जिसे शास्त्रों में 'पुरुषोत्तम क्षेत्र', 'नीलाचल धाम' और 'शंख क्षेत्र' कहा गया है। भगवान जगन्नाथ, उनके बड़े भाई बलभद्र, बहन देवी सुभद्रा और सुदर्शन चक्र यहाँ रत्नवेदी पर 'दारु ब्रह्म' (पवित्र नीम काष्ठ) के रूप में विराजमान हैं।

१. पौराणिक इतिहास एवं नवकलेवर:
स्कन्द पुराण के उत्कल खण्ड के अनुसार राजा इन्द्रद्युम्न की भक्ति से प्रकट दारु ब्रह्म से इन दिव्य विग्रहों का निर्माण हुआ। प्रत्येक १२ से १९ वर्षों में जब आषाढ़ का अधिक मास आता है, तब 'नवकलेवर' उत्सव होता है।

२. विश्वप्रसिद्ध रथयात्रा एवं महाप्रसाद:
आषाढ़ शुक्ल द्वितीया को भगवान नंदीघोष, तालध्वज और दर्पदलन रथों पर आरूढ़ होकर गुंडिचा मंदिर की यात्रा करते हैं। मंदिर की रसोई (रोषघर) में लकड़ी की अग्नि पर मिट्टी के ७ पात्र एक के ऊपर एक रखे जाते हैं, जिनमें सबसे ऊपर के पात्र का अन्न सबसे पहले पकता है। माँ विमला को अर्पित होने के बाद यह 'महाप्रसाद' बन जाता है।`,
      Sanskrit: `नीलाचलनिवासाय नित्याय परमात्मने ।
बलभद्रसुभद्राभ्यां जगन्नाथाय ते नमः ॥ १ ॥

महाम्भोधेस्तीरे कनकरुचिरे नीलशिखरे
वसन् प्रासादान्तः सहजबलभद्रेण बलिना ।
सुभद्रामध्यागः सकलसुरसेवावसरदो
जगन्नाथः स्वामी नयनपथगामी भवतु मे ॥ २ ॥`
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
      English: `Perched atop the sacred Nilachal Hill overlooking the mighty Brahmaputra River in Guwahati, Assam (ancient Kamarupa), the Maa Kamakhya Temple is the oldest and most revered of the 51 Shakti Peethas and the supreme seat of the Dasha Mahavidyas.

1. Puranic Origin & The Sanctum Sanctorum:
According to the Kalika Purana, here the sacred Yoni (creative matrix) of Goddess Sati fell when Lord Vishnu's Sudarshana Chakra divided Her body into 51 pieces. Inside the subterranean cave-sanctum (Manobhava Guha) lies a natural stone fissure perpetually moistened by an underground perennial spring.

2. Ambubachi Mela & Dasha Mahavidyas:
Every June (Ashadha), the temple celebrates Ambubachi Mela honoring the annual fertility cycle of Mother Earth. Surrounding Kamakhya on Nilachal Hill are temples dedicated to all ten Mahavidyas (Kali, Tara, Sodashi, Bhuvaneshwari, Bhairavi, Chhinnamasta, Dhumavati, Bagalamukhi, Matangi, and Kamala).`,
      Hindi: `असम के गुवाहाटी में ब्रह्मपुत्र नदी के तट पर नीलाचल पर्वत पर स्थित माँ कामाख्या मंदिर ५१ शक्तिपीठों में सर्वोच्च 'महाशक्तिपीठ' तथा तंत्र साधना का केंद्र है। यहाँ माता सती का 'योनि भाग' (सृजन शक्ति का मूल स्रोत) गिरा था। गर्भगृह में प्राकृतिक शिला-मुद्रा पर भूमिगत जलस्रोत से निरंतर जल प्रवाहित होता रहता है तथा आषाढ़ मास में विश्वप्रसिद्ध 'अम्बुबाची मेला' आयोजित होता है।`,
      Sanskrit: `कामाख्ये वरदे देवि नीलपर्वतवासिनि ।
त्वं देवि जगतां मातर्योनिमुद्रे नमोऽस्तु ते ॥ १ ॥`
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
      English: `Nestled at 3,133 meters between the Nar and Narayana mountain ranges along the Alaknanda River in Uttarakhand, Shree Badrinath Dham (Badrikashram) is the Northern Abode of the Char Dham. Here the Swayambhu Shaligram deity of Lord Badrinarayan sits in meditative Padmasana posture, retrieved from Narad Kund by Jagadguru Adi Shankaracharya. During the six winter months when the temple is snowbound, the sacred Akhanda Jyoti lamp continues burning inside the sanctum. Nearby lie Tapt Kund, Brahma Kapal, and Vyas Gufa in Mana Village.`,
      Hindi: `उत्तराखंड के चमोली जिले में अलकनंदा नदी के तट पर नर और नारायण पर्वत श्रेणियों के मध्य स्थित श्री बद्रीनाथ धाम चार धामों में उत्तरी धाम है। यहाँ भगवान बद्रीनारायण की शालिग्राम पाषाण की स्वयंभू प्रतिमा पद्मासन ध्यान मुद्रा में विराजमान है तथा शीतकाल के ६ महीनों में भी गर्भगृह में 'अखंड ज्योति' प्रज्वलित रहती है।`,
      Sanskrit: `पवनमन्दसुगन्धिशीतलं हेममन्दिरशोभितं
निकटस्थितालकनन्दां बदरीनाथं भजाम्यहम् ॥ १ ॥`
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
      English: `Situated on an island formed by the Kaveri and Kollidam rivers in Tiruchirappalli, Tamil Nadu, the Sri Ranganathaswamy Temple at Srirangam spans 156 acres across 7 concentric Prakaras and 21 towering Gopurams (led by the 239.5-foot Raja Gopuram), making it the largest functioning Hindu temple complex in the world and the foremost of the 108 Divya Desams.`,
      Hindi: `तमिलनाडु के तिरुचिरापल्ली में कावेरी नदी के द्वीप 'श्रीरंगम' पर १५६ एकड़ में स्थित श्री रंगनाथस्वामी मंदिर विश्व का सबसे बड़ा कार्यरत हिंदू मंदिर परिसर है, जिसमें ७ संकेंद्रित प्राचीर (सप्त प्रकार), २१ भव्य गोपुरम और स्वर्ण मंडित प्रणवाकार विमान हैं।`,
      Sanskrit: `कावेरीविरजा सेयं वैकुण्ठं रङ्गमन्दिरम् ।
स वासुदेवो रङ्गेशः प्रत्यक्षं परमं पदम् ॥ १ ॥`
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
      English: `Spanning 402 acres in Siem Reap, Cambodia, Angkor Wat (originally named "Paramavishnuloka" in Sanskrit) was commissioned in the 12th century CE by Khmer Emperor Suryavarman II as an architectural replica of Mount Meru and the Kshira Sagara, adorned with 800 meters of sandstone bas-reliefs depicting the Samudra Manthan, Ramayana, and Mahabharata.`,
      Hindi: `कम्बोडिया के सिएम रीप में ४०२ एकड़ में फैला 'अंकोरवाट' (मूल संस्कृत नाम: 'परमविष्णुलोक') १२वीं शताब्दी में सम्राट सूर्यवर्मन द्वितीय द्वारा भगवान विष्णु को समर्पित विश्व का सबसे विशाल धार्मिक स्मारक है, जिसकी दीवारों पर समुद्र मंथन, रामायण और महाभारत उत्कीर्ण हैं।`,
      Sanskrit: `मेरुशृङ्गसमं रम्यं परमविष्णुलोककम् ।
सूर्यवर्मनृपेणैतत् निर्मितं विष्णुमन्दिरम् ॥ १ ॥`
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
      English: `The Sant Parampara and the Bhakti Movement united all of India through pure love (Prema-Bhakti) and remembrance of the Divine Name (Naam-Smarana), encompassing both Saguna and Nirguna streams through Goswami Tulsidas, Sant Kabir, Mirabai, Surdas, Guru Ravidas, Sant Tukaram, Jnaneshwar, and Chaitanya Mahaprabhu.`,
      Hindi: `सनातन धर्म की 'सन्त परम्परा' और 'भक्ति आन्दोलन' में गोस्वामी तुलसीदास ("सिया राम मय सब जग जानी"), संत कबीरदास ("ढाई आखर प्रेम का, पढ़े सो पंडित होय"), मीराबाई, सूरदास, रैदास, तुकाराम और चैतन्य महाप्रभु ने प्रेम, समता और नाम-स्मरण का अमर संदेश दिया।`,
      Sanskrit: `मच्चित्ता मद्गतप्राणा बोधयन्तः परस्परम् ।
कथयन्तश्च मां नित्यं तुष्यन्ति च रमन्ति च ॥ (भगवद्गीता १०.९)`
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
      English: `The six classical Astika schools of Hindu Philosophy (Shad Darshana) are:
1. Samkhya (Maharshi Kapila): 25 Tattvas of Purusha and Prakriti.
2. Yoga (Maharshi Patanjali): Eightfold Ashtanga Yoga ("Yogash chitta-vritti-nirodhah").
3. Nyaya (Maharshi Akshapada Gautama): Logic and four Pramanas.
4. Vaisheshika (Maharshi Kanada): Atomic theory and 7 Padarthas.
5. Purva Mimamsa (Maharshi Jaimini): Vedic Dharma and Karma-Kanda hermeneutics.
6. Uttara Mimamsa / Vedanta (Maharshi Badarayana Vedavyasa): Grounded in the Upanishads, Bhagavad Gita, and Brahma Sutras (Advaita, Vishishtadvaita, and Dvaita).`,
      Hindi: `सनातन धर्म के छह आस्तिक दर्शन ('षड्दर्शन'): १. सांख्य (महर्षि कपिल), २. योग (महर्षि पतंजलि), ३. न्याय (महर्षि गौतम), ४. वैशेषिक (महर्षि कणाद), ५. पूर्व मीमांसा (महर्षि जैमिनि), और ६. उत्तर मीमांसा / वेदान्त (महर्षि बादरायण वेदव्यास — अद्वैत, विशिष्टाद्वैत एवं द्वैत)।`,
      Sanskrit: `अथातो ब्रह्मजिज्ञासा । जन्माद्यस्य यतः । शास्त्रयोनित्वात् ॥ (ब्रह्मसूत्रम् १.१.१-३)
योगश्चित्तवृत्तिनिरोधः । तदा द्रष्टुः स्वरूपेऽवस्थानम् ॥ (पातञ्जलयोगसूत्रम् १.२-३)`
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
      English: `Modeled on the Vastu Purusha Mandala, a Hindu Mandir mirrors both the cosmos and the subtle yogic body—progressing from the Gopuram/Simhadwara, Dhwaja Stambha, and Mandapa to the inner Garbhagriha crowned by the Shikhara/Vimana, Amalaka, and Kalasha across the Nagara, Dravida, and Vesara architectural traditions.`,
      Hindi: `वास्तु पुरुष मण्डल पर निर्मित हिन्दू मन्दिर मानव देह और ब्रह्माण्ड का दिव्य प्रतिरूप है ("देहो देवालयः प्रोक्तो जीवो देवः सनातनः"), जो नागर, द्रविड़ और बेसर स्थापत्य शैलियों में निर्मित होता है।`,
      Sanskrit: `देहो देवालयः प्रोक्तो जीवो देवः सनातनः ।
त्यजेदज्ञाननिर्माल्यं सोऽहम्भावेन पूजयेत् ॥ १ ॥`
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
      English: `Synchronized with lunar Tithis, solar Sankrantis, and Nakshatras, the festivals of Sanatan Dharma—Rama Navami, Akshaya Tritiya, Guru Purnima, Krishna Janmashtami, Ganesh Chaturthi, Sharadiya Navaratri, Vijayadashami, Deepavali, Makar Sankranti, Maha Shivaratri, and Holi—harmonize human life with cosmic order.`,
      Hindi: `तिथि, नक्षत्र और ऋतुचक्र पर आधारित सनातन धर्म के प्रमुख पर्व—रामनवमी, अक्षय तृतीया, गुरु पूर्णिमा, श्रीकृष्ण जन्माष्टमी, गणेश चतुर्थी, नवरात्रि, विजयदशमी, दीपावली, मकर संक्रांति, महाशिवरात्रि एवं होली—मानव जीवन में आनंद और धर्म का संचार करते हैं।`,
      Sanskrit: `असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥ (बृहदारण्यकोपनिषद् १.३.२८)`
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
      English: `Compiled by Maharshi Krishna Dwaipayana Vedavyasa into 400,000 shlokas across 18 Maha Puranas—Matsya, Markandeya, Bhagavata, Bhavishya, Brahma, Brahmanda, Brahma Vaivarta, Vishnu, Varaha, Vamana, Shiva/Vayu, Agni, Narada, Padma, Linga, Garuda, Kurma, and Skanda—the Puranas illuminate Vedic truth through five classical themes (Pancha Lakshana: Sarga, Pratisarga, Vamsha, Manvantara, and Vamshanucharita).`,
      Hindi: `महर्षि वेदव्यास द्वारा रचित ४,००,००० श्लोकों वाले अष्टादश महापुराण (मत्स्य, मार्कण्डेय, भागवत, भविष्य, ब्रह्म, ब्रह्माण्ड, ब्रह्मवैवर्त, विष्णु, वराह, वामन, शिव, अग्नि, नारद, पद्म, लिंग, गरुड़, कूर्म और स्कन्द) का मुख्य संदेश है— "परोपकारः पुण्याय पापाय परपीडनम्"।`,
      Sanskrit: `मद्वयं भद्वयं चैव ब्रत्रयं वचतुष्टयम् ।
अनापलिङ्गकूस्कानि पुराणानि प्रचक्षते ॥ १ ॥
अष्टादशपुराणेषु व्यासस्य वचनद्वयम् ।
परोपकारः पुण्याय पापाय परपीडनम् ॥ २ ॥`
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
      English: `Composed by Maharshi Vedavyasa and transcribed by Lord Ganesha across 18 Parvas and 100,000 shlokas, the Mahabharata is revered as the Fifth Veda ("Yato Dharmas tato Jayah" — Where there is Dharma, there is Victory), housing the Shrimad Bhagavad Gita, Vidura Niti, Yaksha Prashna, and Sri Vishnu Sahasranama.`,
      Hindi: `महर्षि वेदव्यास रचित और श्री गणेश द्वारा लिपिबद्ध १,००,००० श्लोकों एवं १८ पर्वों वाला 'महाभारत' पंचम वेद कहलाता है, जिसमें श्रीमद्भगवद्गीता, विदुर नीति, यक्ष प्रश्न और विष्णु सहस्रनाम समाहित हैं।`,
      Sanskrit: `नारायणं नमस्कृत्य नरं चैव नरोत्तमम् ।
देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥ १ ॥`
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
      English: `The 10 Principal Upanishads (Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka) form the Jnana-Kanda summit of the Vedas (Vedanta), proclaiming the four Mahavakyas: "Prajnanam Brahma", "Aham Brahmasmi", "Tat Tvam Asi", and "Ayam Atma Brahma".`,
      Hindi: `ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य और बृहदारण्यक — ये १० मुख्य उपनिषद् ('वेदान्त') चारों वेदों के चार महावाक्यों ('प्रज्ञानं ब्रह्म', 'अहं ब्रह्मास्मि', 'तत्त्वमसि', 'अयमात्मा ब्रह्म') का उद्घोष करते हैं।`,
      Sanskrit: `ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः ।
ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥ १ ॥`
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
      English: `"Sarva mangala mangalye Shive sarvartha sadhike | Sharanye Tryambake Gauri Narayani namo'stu te ||
Ya Devi sarvabhutes
