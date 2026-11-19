import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Award, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Unlock, Plus, ChevronRight,
  Check, AlertCircle, FileText
} from 'lucide-react';

// Change your default Admin Password here (or set VITE_ADMIN_PASSWORD in Vercel Environment Variables)
export const DEFAULT_ADMIN_PASSCODE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD) ||
  'admin108';

// Automatically compresses uploaded cover photos so they save cleanly in localStorage, IndexedDB & global sync
export function compressCoverImageFile(file, maxWidth = 960, quality = 0.75) {
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

// Traditional Handcrafted Vedic 8-Petal Lotus (Padma) Emblem — Zero AI Symbols
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
  try {
    const withProto = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
    const parsed = new URL(withProto);
    const host = parsed.hostname.replace(/^(www\.|m\.|music\.)/i, '').toLowerCase();
    if (host === 'youtu.be') {
      const seg = parsed.pathname.split('/').filter(Boolean)[0];
      if (seg && /^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;
      const parts = parsed.pathname.split('/').filter(Boolean);
      const markerIdx = parts.findIndex((p) => ['embed', 'shorts', 'live', 'v', 'e'].includes(p.toLowerCase()));
      if (markerIdx !== -1 && parts[markerIdx + 1] && /^[a-zA-Z0-9_-]{11}$/.test(parts[markerIdx + 1])) {
        return parts[markerIdx + 1];
      }
    }
  } catch (e) {}
  const regExp = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|v\/|e(?:mbed)?\/|shorts\/|live\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = cleaned.match(regExp);
  return match && match[1] ? match[1] : null;
}

export function getYouTubeEmbedUrl(url) {
  const ytId = extractYouTubeId(url);
  if (!ytId) return null;
  const host = ['www', 'youtube-nocookie', 'com'].join('.');
  return `${SECURE_PROTO}${host}/embed/${ytId}?rel=0&modestbranding=1&playsinline=1`;
}

export function getYouTubeWatchUrl(url) {
  const ytId = extractYouTubeId(url);
  if (!ytId) return cleanExternalUrl(url);
  const host = ['www', 'youtube', 'com'].join('.');
  return `${SECURE_PROTO}${host}/watch?v=${ytId}`;
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

export const SacredVideoPlayer = ({ item, darkMode, lang = 'English' }) => {
  const playerContainerRef = useRef(null);
  const cleanedVideoUrl = cleanExternalUrl(item?.videoUrl || '');
  const ytId = extractYouTubeId(cleanedVideoUrl);
  const ytEmbedUrl = getYouTubeEmbedUrl(cleanedVideoUrl);
  const ytWatchUrl = getYouTubeWatchUrl(cleanedVideoUrl);
  const isDirectVideoFile =
    cleanedVideoUrl.startsWith('data:video/') ||
    /\.(mp4|webm|ogg)(\?.*)?$/i.test(cleanedVideoUrl);

  const [playerMode, setPlayerMode] = useState(ytId ? 'youtube' : 'cinema');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [chimeActive, setChimeActive] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const lines = useMemo(() => {
    const raw = getBodyForLanguage(item, lang) || item.description || item.title;
    return raw
      .split(/\n+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
  }, [item, lang]);

  const totalSec = Math.max(lines.length * 5, 30);

  // Automatically switch to YouTube mode whenever a YouTube link is added or item changes
  useEffect(() => {
    setPlayerMode(ytId ? 'youtube' : 'cinema');
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
  }, [item?.id, ytId, lang]);

  useEffect(() => {
    if (!isPlaying || playerMode !== 'cinema') return;
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
  }, [isPlaying, playerMode, totalSec, lines.length, chimeActive, playbackSpeed]);

  useEffect(() => {
    if (!isPlaying || playerMode !== 'cinema' || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const textToSpeak = lines[currentLineIdx] || item.title;
      const utt = new SpeechSynthesisUtterance(textToSpeak);
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.id === lang);
      utt.lang = langObj?.locale || (lang === 'English' ? 'en-IN' : 'hi-IN');
      utt.rate = 0.92 * playbackSpeed;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }, [isPlaying, playerMode, currentLineIdx, lines, lang, item?.title, playbackSpeed]);

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
            <Play className="w-4 h-4 fill-[#EA580C]" /> {ytId && playerMode === 'youtube' ? 'YouTube Sacred Video' : 'In-App Sacred Video Player'}
          </span>
          {ytId && (
            <a
              href={ytWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-0.5 rounded-full bg-red-600/15 text-red-500 hover:bg-red-600 hover:text-white text-[10px] font-bold transition-all"
            >
              Open on YouTube ↗
            </a>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {ytId && (
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
              <span>▶️ YouTube Video</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setPlayerMode('cinema')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1 transition-all ${
              playerMode === 'cinema'
                ? 'bg-[#EA580C] text-white'
                : 'bg-amber-500/15 text-[#EA580C] hover:bg-amber-500/25'
            }`}
          >
            🎬 Sacred Cinema Audio
          </button>
        </div>
      </div>

      {isDirectVideoFile ? (
        <video
          key={cleanedVideoUrl}
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
            title={item.title || 'YouTube Sacred Video'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      ) : (
        <div
          ref={playerContainerRef}
          onClick={togglePlay}
          className="cursor-pointer relative w-full overflow-hidden rounded-2xl aspect-video bg-[#0B0704] border border-amber-500/30 shadow-2xl flex flex-col justify-between p-4 sm:p-6 text-white select-none group"
        >
          <img
            src={cleanExternalUrl(item.imageUrl) || item.fallbackImageUrl || ''}
            alt={item.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = item.fallbackImageUrl || '';
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
                  Sanatan Setu HD Sacred Audio · {lang} Subtitles
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
                aria-label="Play Audio"
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
                  Verse {currentLineIdx + 1} of {lines.length} · {isPlaying ? '🔊 Playing On-Site Audio Stream' : 'Click Play to Start Audio'}
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
                  <span>{isPlaying ? 'Pause' : 'Play Audio'}</span>
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
                  title="Toggle Fullscreen"
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
- Four Distinct Mandapas: The temple complex spans over 400,000 square feet enclosed by two concentric defensive walls: Meghanada Prachira (outer wall, 20 ft high) and Kurma Bedha (inner wall). Structurally, it integrates four axial halls: Vimana / Bada Deula (214 ft), Jagamohana, Nata Mandapa, and Bhoga Mandapa.
- The Four Sacred Gates (Dwaras): East Simhadwara (Lion Gate / Moksha), South Ashwadwara (Horse Gate / Kama), West Vyaghradwara (Tiger Gate / Dharma), North Hastidwara (Elephant Gate / Artha).
- The Nila Chakra: Octagonal Ashtadhatu wheel crowning the Shikhar where the sacred Patitapabana Bana flag is changed every evening.

4. The World-Famous Annual Rath Yatra (Gundicha Jatra):
On Ashadha Shukla Dwitiya, the three deities emerge onto the Bada Danda in three monumental chariots: Nandighosha (16 wheels, Lord Jagannath), Taladhwaja (14 wheels, Lord Balabhadra), and Darpadalana (12 wheels, Devi Subhadra & Sudarshana). The Gajapati Maharaja performs Chhera Panhara with a golden broom.

5. Rosaghara & The Sacred Mahaprasad (Anna Brahma):
The temple kitchen features 240 earthen hearths preparing Chhapana Bhoga (56 sacred dishes) daily. Seven earthen pots stacked vertically over wood fire cook from the topmost pot down. Offered to Jagannath and Maa Bimala, it is shared at Ananda Bazaar by all without distinction.`,
      Hindi: `श्री जगन्नाथ मंदिर, पुरी (ओडिशा) सनातन धर्म के चार सर्वोच्च धामों (चार धाम) में से पूर्वी धाम है, जिसे शास्त्रों में 'पुरुषोत्तम क्षेत्र', 'नीलाचल धाम' और 'शंख क्षेत्र' कहा गया है। भगवान जगन्नाथ, उनके बड़े भाई बलभद्र, बहन देवी सुभद्रा और सुदर्शन चक्र यहाँ रत्नवेदी पर दारु ब्रह्म रूप में विराजमान हैं।

१. पौराणिक इतिहास एवं राजा इन्द्रद्युम्न की कथा (स्कन्द पुराण - उत्कल खण्ड):
सतयुग में भगवान विष्णु यहाँ शबर राज विश्वावसु द्वारा 'नीलमाधव' के रूप में पूजे जाते थे। राजा इन्द्रद्युम्न के अश्वमेध यज्ञों के पश्चात समुद्र तट पर पवित्र नीम का दारु प्राप्त हुआ, जिससे देवशिल्पी विश्वकर्मा ने श्री जगन्नाथ, बलभद्र, सुभद्रा और सुदर्शन के विग्रहों का निर्माण किया।

२. नवकलेवर, विश्वप्रसिद्ध रथयात्रा एवं महाप्रसाद:
प्रत्येक १२ से १९ वर्षों में पुरुषोत्तम मास में 'नवकलेवर' होता है। प्रतिवर्ष आषाढ़ शुक्ल द्वितीया को नंदीघोष (१६ पहिए), तालध्वज (१४ पहिए) और दर्पदलन (१२ पहिए) रथों पर भगवान बड़दंड पर भक्तों को दर्शन देते हैं। विश्व की सबसे बड़ी रसोई में ५६ भोग (महाप्रसाद) तैयार होता है।`,
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
      English: `Perched atop the sacred Nilachal Hill overlooking the mighty Brahmaputra River in Guwahati, Assam (ancient Kamarupa), the Maa Kamakhya Temple is the oldest and most revered of the 51 Shakti Peethas and one of the four Adi Shakti Peethas. Described in the Kalika Purana and Yogini Tantra, it is the supreme seat of Tantric Shaktism and the Dasha Mahavidyas.

1. Puranic Origin & Sanctum (Manobhava Guha):
Where the Yoni (creative matrix) of Goddess Sati fell, Nilachal Hill turned blue. Inside the subterranean cave-sanctum lies a natural rock fissure perpetually moistened by an underground spring.

2. Ambubachi Mela (Mid-June / Ashadha):
Celebrating the annual fertility cycle of Mother Earth and Goddess Kamakhya, the temple remains closed for three days and reopens on the fourth day (Nivritti) with the distribution of sacred Angodak and Angabastra.`,
      Hindi: `असम के गुवाहाटी में ब्रह्मपुत्र नदी के तट पर नीलाचल पर्वत पर स्थित माँ कामाख्या मंदिर ५१ शक्तिपीठों में सर्वोच्च 'महाशक्तिपीठ' तथा तंत्र साधना और दश महाविद्या का विश्वप्रसिद्ध केंद्र है। प्रतिवर्ष आषाढ़ मास में यहाँ प्रसिद्ध 'अम्बुबाची मेला' आयोजित होता है।`,
      Sanskrit: `कामाख्ये वरदे देवि नीलपर्वतवासिनि ।
त्वं देवि जगतां मातर्योनिमुद्रे नमोऽस्तु ते ॥ १ ॥

सर्वकामेश्वरिं देवीं सर्वसिद्धिप्रदायिनीम् ।
कामरूपस्थितां नित्यं कामाख्यां प्रणमाम्यहम् ॥ २ ॥`
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
      English: `Nestled at 3,133 meters between the Nar and Narayana mountain ranges along the Alaknanda River in Chamoli, Uttarakhand, Shree Badrinath Dham (Badrikashram) is the Northern Abode of the All-India Char Dham. Consecrated by Jagadguru Adi Shankaracharya from Narad Kund, the Swayambhu black Shaligram deity of Badrinarayan sits in Padmasana Yogamudra, accompanied by the geothermal Tapt Kund, Brahma Kapal, and nearby Mana Village (Vyas Gufa).`,
      Hindi: `उत्तराखंड के चमोली जिले में अलकनंदा नदी के पावन तट पर नर और नारायण पर्वत श्रेणियों के मध्य स्थित श्री बद्रीनाथ धाम सनातन धर्म के चार धामों में उत्तरी धाम तथा 'भूलोक का वैकुण्ठ' है। यहाँ ६ माह की अखंड ज्योति, तप्त कुंड, ब्रह्मकपाल और माणा गाँव स्थित व्यास गुफा के दर्शन होते हैं।`,
      Sanskrit: `पवनमन्दसुगन्धिशीतलं हेममन्दिरशोभितं
निकटस्थितालकनन्दां बदरीनाथं भजाम्यहम् ॥ १ ॥
तप्तकुण्डं सुपुण्यं च नरनारायणाश्रमम् ।
नीलकण्ठशिखराग्रं बदरीशं नमाम्यहम् ॥ २ ॥`
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
      English: `Situated on the island formed by the Kaveri and Kollidam rivers in Tiruchirappalli, Tamil Nadu, the 156-acre Sri Ranganathaswamy Temple at Srirangam is the largest functioning Hindu temple complex in the world and the foremost of the 108 Divya Desams, featuring 7 concentric Prakaras, 21 Gopurams (led by the 239.5-ft Raja Gopuram), the golden Pranavakara Vimana, and the eternal presence of Sri Ramanujacharya.`,
      Hindi: `तमिलनाडु के तिरुचिरापल्ली में कावेरी नदी द्वीप पर १५६ एकड़ में फैला श्री रंगनाथस्वामी मंदिर विश्व का सबसे बड़ा कार्यरत हिंदू मंदिर परिसर तथा १०८ दिव्य देशमों में प्रथम 'भूलोक वैकुण्ठ' है। इसमें ७ प्रकार, २१ गोपुरम और स्वर्ण प्रणवाकार विमान हैं।`,
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
      English: `Spanning 402 acres in Siem Reap, Cambodia, Angkor Wat (originally named Paramavishnuloka — Supreme Abode of Lord Vishnu) was commissioned in the 12th century CE by Khmer Emperor Suryavarman II as a terrestrial replica of Mount Meru encircled by the cosmic ocean (Kshira Sagara), adorned with 800-meter sandstone bas-reliefs of Samudra Manthan, Kurukshetra, and the Battle of Lanka.`,
      Hindi: `कम्बोडिया के सिएम रीप में ४०२ एकड़ क्षेत्र में फैला 'अंकोरवाट' ('परमविष्णुलोक') विश्व का सबसे विशाल धार्मिक स्मारक है, जिसका निर्माण १२वीं शताब्दी में सम्राट सूर्यवर्मन द्वितीय ने भगवान विष्णु को समर्पित कर कराया था।`,
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
      English: `The Sant Parampara and Bhakti Movement brought eternal Vedic wisdom into the living vernaculars of India through both Saguna Bhakti (Goswami Tulsidas, Surdas, Mirabai, Chaitanya Mahaprabhu, Tukaram) and Nirguna Bhakti (Sant Kabir, Guru Ravidas, Namdev, Dadu Dayal), proclaiming that pure devotion and Naam-Smarana transcend all barriers.`,
      Hindi: `सनातन धर्म की सन्त परम्परा और भक्ति आन्दोलन ने सगुण (तुलसीदास, सूरदास, मीराबाई, चैतन्य महाप्रभु) एवं निर्गुण (कबीर, रविदास, नामदेव) धाराओं के माध्यम से प्रेम, समता और नाम-स्मरण का अमर संदेश दिया।`,
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
      English: `In Sanatan Dharma, philosophy is Darshana — direct vision of Truth. The six Astika schools form three complementary pairs: Samkhya (Kapila) & Yoga (Patanjali), Nyaya (Gautama) & Vaisheshika (Kanada), and Purva Mimamsa (Jaimini) & Uttara Mimamsa / Vedanta (Badarayana Vedavyasa — Advaita, Vishishtadvaita, and Dvaita).`,
      Hindi: `वेदों की प्रामाणिकता को मानने वाले छह आस्तिक दर्शनों को 'षड्दर्शन' कहा जाता है: १. सांख्य (महर्षि कपिल), २. योग (महर्षि पतंजलि), ३. न्याय (महर्षि गौतम), ४. वैशेषिक (महर्षि कणाद), ५. पूर्व मीमांसा (महर्षि जैमिनि), और ६. उत्तर मीमांसा / वेदान्त (महर्षि वेदव्यास)।`,
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
      English: `A Hindu Mandir is built on the sacred geometric grid of the Vastu Purusha Mandala as a living projection of the cosmic body—from Gopuram (feet) and Mandapa (heart) to the Garbhagriha (crown) and Shikhara/Amalaka/Kalasha—expressed through the Nagara (North/East), Dravida (South), and Vesara (Deccan) architectural traditions.`,
      Hindi: `सनातन धर्म में मन्दिर वास्तु पुरुष मण्डल की ज्यामिति पर निर्मित ब्रह्माण्ड एवं मानव देह का दिव्य प्रतिरूप है — "देहो देवालयः प्रोक्तो जीवो देवः सनातनः"। इसकी तीन प्रमुख शैलियाँ हैं: नागर, द्रविड़ और बेसर शैली।`,
      Sanskrit: `देहो देवालयः प्रोक्तो जीवो देवः सनातनः ।
त्यजेदज्ञाननिर्मांल्यं सोऽहम्भावेन पूजयेत् ॥ १ ॥`
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
      English: `Synchronized with the Vedic Panchanga of Tithis, Sankrantis, and Nakshatras, Hindu Utsavs and Vrats—including Rama Navami, Akshaya Tritiya, Guru Purnima, Krishna Janmashtami, Ganesh Chaturthi, Sharadiya Navaratri, Vijayadashami, Deepavali, Makar Sankranti, Maha Shivaratri, and Holi—purify mind and society.`,
      Hindi: `हिंदू पंचांग की तिथियों, नक्षत्रों और ऋतुचक्र के अनुसार मनाए जाने वाले उत्सव और व्रत (रामनवमी, जन्माष्टमी, नवरात्रि, विजयदशमी, दीपावली, मकर संक्रांति, महाशिवरात्रि एवं होली) मानव जीवन में धर्मजागरण और आनंद का संचार करते हैं।`,
      Sanskrit: `असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥`
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
      English: `Compiled by Maharshi Vedavyasa across 400,000 Shlokas, the 18 Maha Puranas (Vishnu, Bhagavata, Naradiya, Garuda, Padma, Varaha, Brahma, Brahmanda, Brahma Vaivarta, Markandeya, Bhavishya, Vamana, Shiva, Linga, Skanda, Agni, Matsya, and Kurma) illuminate Sarga, Pratisarga, Vamsha, Manvantara, and Vamshanucharita.`,
      Hindi: `महर्षि वेदव्यास द्वारा रचित अष्टादश महापुराण (४,००,००० श्लोक) वेदों के गूढ़ रहस्यों को कथाओं, तीर्थ माहात्म्य और धर्मनीति द्वारा सुगम बनाते हैं — "परोपकारः पुण्याय पापाय परपीडनम्"।`,
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
      English: `Composed by Maharshi Vedavyasa and transcribed by Lord Ganesha across 18 Parvas (Adi to Svargarohana) and 100,000 shlokas, the Mahabharata is revered as the Panchama Veda, containing the Shrimad Bhagavad Gita, Yaksha Prashna, Vidura Niti, and Sri Vishnu Sahasranama.`,
      Hindi: `महर्षि वेदव्यास द्वारा रचित १,००,००० श्लोकों और १८ पर्वों वाला 'महाभारत' पंचम वेद है — "धर्मो रक्षति रक्षितः" तथा "यतो धर्मस्ततो जयः"।`,
      Sanskrit: `नारायणं नमस्कृत्य नरं चैव नरोत्तमम् ।
देवीं सरस्वतीं व्यासं ततो जयमुदीरयेत् ॥ १ ॥
धर्मे चार्थे च कामे च मोक्षे च भरतर्षभ ।
यदिहास्ति तदन्यत्र यन्नेहास्ति न तत्क्वचित् ॥ २ ॥`
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
      English: `The 10 Principal Upanishads (Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, and Brihadaranyaka) form the philosophical summit of the Vedas (Vedanta) and proclaim the four Mahavakyas: Prajnanam Brahma, Aham Brahmasmi, Tat Tvam Asi, and Ayam Atma Brahma.`,
      Hindi: `वेदों के सर्वोच्च ज्ञान-काण्ड 'दसोपनिषद्' (ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य, बृहदारण्यक) आत्मा और ब्रह्म की एकता के चार महावाक्यों का उद्घोष करते हैं।`,
      Sanskrit: `ईशकेनकठप्रश्नमुण्डमाण्डूक्यतित्तिरिः ।
ऐतरेयं च छान्दोग्यं बृहदारण्यकं तथा ॥ १ ॥
सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः ॥ २ ॥`
    }
  },
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
      English: `Sarva mangala mangalye Shive sarvartha sadhike | Sharanye Tryambake Gauri Narayani namo'stu te ||
Ya Devi sarvabhuteshu Vishnumayeti shabdita | Namastasyai namastasyai namastasyai namo namah ||
Ya Devi sarvabhuteshu Shakti-rupena samsthita | Namastasyai namastasyai namastasyai namo namah ||
Sarva badha vinirmukto dhanadhanya sutanvitah | Manushyo matprasadena bhavishyati na samshayah ||`,
      Hindi: `सर्वमंगलमांगल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥
सर्वबाधाविनिर्मुक्तो धनधान्यसुतान्वितः । मनुष्यो मत्प्रसादेन भविष्यति न संशयः ॥`,
      Sanskrit: `ॐ सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ।
शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥ १ ॥
या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता ।
नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥ २ ॥`
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
      English: `Ambe tu hai Jagdambe Kali, Jai Durge khappar wali, Tere hi gun gaave Bharati, O Maiya hum sab utaare teri Aarti ||
Tere bhakt jano par Maiya bheed padi hai bhaari, Danav dal par toot pado Maa karke singh sawari |
Maa-bete ka hai is jag mein bada hi nirmal naata, Poot kapoot sune hai par na mata suni kumata |
Nahi maangte dhan aur daulat, na chandi na sona, Hum to maange Tere charano mein ek chhota sa kona ||`,
      Hindi: `अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली, तेरे ही गुण गावें भारती, ओ मैया हम सब उतारे तेरी आरती ॥
तेरे भक्त जनों पर मैया भीड़ पड़ी है भारी, दानव दल पर टूट पड़ो माँ करके सिंह सवारी ।
माँ-बेटे का है इस जग में बड़ा ही निर्मल नाता, पूत कपूत सुने हैं पर ना माता सुनी कुमाता ।
चरण शरण में खड़े तुम्हारी, ले पूजा की थाली, वरद हस्त सर पर रख दो माँ, संकट हरने वाली ॥`,
      Sanskrit: `जयन्ती मङ्गला काली भद्रकाली कपालिनी ।
दुर्गा क्षमा शिवा धात्री स्वाहा स्वधा नमोऽस्तु ते ॥`
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
      English: `Shri Guru charan saroj raj, nij manu mukuru sudhari | Baranau Raghubar bimal jasu, jo dayaku phal chari ||
Buddhihin tanu janike, sumirau Pavan-Kumar | Bal buddhi bidya dehu mohi, harahu kales bikar ||

1. Jai Hanuman gyan gun sagar | Jai Kapis tihu lok ujagar ||
2. Ram doot atulit bal dhama | Anjani-putra Pavan-sut nama ||
3. Mahabir Bikram Bajrangi | Kumati nivar sumati ke sangi ||
4. Kanchan baran biraj subesa | Kanan kundal kunchit kesa ||
5. Hath bajra aru dhwaja birajai | Kandhe moonj janeu sajai ||
6. Sankar suvan Kesari nandan | Tej pratap maha jag bandan ||
7. Bidyavan guni ati chatur | Ram kaj karibe ko atur ||
8. Prabhu charitra sunibe ko rasiya | Ram Lakhan Sita man basiya ||
...
39. Jo yah padhai Hanuman Chalisa | Hoy siddhi sakhi Gaurisa ||
40. Tulsidas sada Hari chera | Kijai nath hriday mahan dera ||
Pavan tanay sankat haran, mangal murti roop | Ram Lakhan Sita sahit, hriday basahu sur bhoop ||`,
      Hindi: `॥ दोहा ॥
श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि । बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार । बल बुद्धि बिद्या देहु मोहिं हरहु कलेस बिकार ॥

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
पवनतनय संकट हरन, मंगल मूरति रूप । राम लखन सीता सहित, हृदय बसहु सुर भूप ॥`,
      Sanskrit: `अतुलितबलधामं हेमशैलाभदेहं
दनुजवनकृशानुं ज्ञानिनामग्रगण्यम् ।
सकलगुणनिधानं वानराणामधीशं
रघुपतिप्रियभक्तं वातजातं नमामि ॥`
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
      English: `Jai Ambe Gauri, Maiya Jai Shyama Gauri, Tumko nishdin dhyavat, Hari Brahma Shivri || Om Jai Ambe Gauri ||
Maang sindoor virajat, tiko mrigmad ko, Ujjwal se dou naina, chandravadan niko || Om Jai Ambe Gauri ||
Shri Ambeji ki Aarti, jo koi nar gaave, Kahat Shivanand Swami, sukh-sampati paave || Om Jai Ambe Gauri ||`,
      Hindi: `जय अम्बे गौरी, मैया जय श्यामा गौरी, तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥ ॐ जय अम्बे गौरी ॥
माँग सिन्दूर विराजत, टीको मृगमद को, उज्ज्वल से दोउ नैना, चन्द्रवदन नीको ॥ ॐ जय अम्बे गौरी ॥
श्री अम्बेजी की आरती, जो कोई नर गावै, कहत शिवानन्द स्वामी, सुख-सम्पत्ति पावै ॥ ॐ जय अम्बे गौरी ॥`,
      Sanskrit: `कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् ।
सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥`
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
      English: `Om (A-U-M + the silent Turiya Bindu), revered in the Vedas as Pranava, maps the four states of consciousness in the Mandukya Upanishad: Waking ('A' / Vaishvanara), Dreaming ('U' / Taijasa), Deep Sleep ('M' / Prajna), and Turiya (pure Witness Consciousness).`,
      Hindi: `'ॐ' (अ + उ + म् + तुरीय मौन) सनातन धर्म का सर्वोच्च बीज-मंत्र एवं शब्द-ब्रह्म है। माण्डूक्य उपनिषद् में इसकी चार मात्राएँ जाग्रत, स्वप्न, सुषुप्ति एवं तुरीय अवस्था का प्रतीक हैं।`,
      Sanskrit: `ओमित्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोङ्कार एव ॥`
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
      English: `Namastestu Mahamaye Shripithe Surapujite | Shankha Chakra Gadahaaste Mahalakshmi Namo'stu Te ||
Siddhi Buddhi Prade Devi Bhukti Mukti Pradayini | Mantra Murte Sada Devi Mahalakshmi Namo'stu Te ||`,
      Hindi: `नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते । शंखचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥
सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि । मन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते ॥`,
      Sanskrit: `नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते ।
शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥ १ ॥`
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
      English: `Organized by Maharshi Vedavyasa into Rigveda (10,552 Mantras), Yajurveda, Samaveda (1,875 musical verses), and Atharvaveda (6,000 Mantras), each Veda encompasses Samhita, Brahmana, Aranyaka, and Upanishad.`,
      Hindi: `महर्षि वेदव्यास द्वारा संकलित चार वेद — ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद — सनातन धर्म के अपौरुषेय मूल आधार हैं।`,
      Sanskrit: `अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥`
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
      English: `In the Ayodhya Kanda, Lord Sri Rama cheerfully accepts 14 years of forest exile to uphold Emperor Dasharatha's truth, joined by Devi Sita and Lakshmana while Bharata rules Nandigram as an ascetic regent with Sri Rama's Padukas.`,
      Hindi: `अयोध्याकाण्ड में मर्यादा पुरुषोत्तम श्रीराम पिता दशरथ के सत्य की रक्षा हेतु चौदह वर्ष का वनवास स्वीकार करते हैं तथा भरत चित्रकूट से उनकी चरण-पादुकाएँ लाकर नंदीग्राम में राज्य का संचालन करते हैं।`,
      Sanskrit: `रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः । राजा सर्वस्य लोकस्य देवानां मघवानिव ॥`
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
      English: `Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukamiva Bandhanan Mrityor Mukshiya Ma'mritat ||
Revealed to Maharshi Vasishtha in Rigveda 7.59.12, this supreme healing mantra invokes Three-Eyed Lord Shiva for longevity, protection, and liberation.`,
      Hindi: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥
ऋग्वेद ७.५९.१२ में महर्षि वशिष्ठ द्वारा दृष्ट महामृत्युंजय मंत्र अकाल मृत्यु, रोग और भय का नाश कर आरोग्य व अमृतत्व प्रदान करता है।`,
      Sanskrit: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥ (ऋग्वेदः ७.५९.१२)`
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
      English: `Karmany-evadhikaras te ma phaleshu kadachana | Ma karma-phala-hetur bhur ma te sango 'stv-akarmani || (2.47)
Yogasthah kuru karmani sangam tyaktva Dhananjaya | Siddhy-asiddhyoh samo bhutva samatvam yoga uchyate || (2.48)`,
      Hindi: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥
योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय । सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥ २.४८ ॥`,
      Sanskrit: `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २.४७ ॥`
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
      English: `Om Bhur Bhuvah Svah | Tat Savitur Varenyam | Bhargo Devasya Dheemahi | Dhiyo Yo Nah Prachodayat ||
We meditate upon the adorable spiritual radiance of Savitr, the Supreme Creator; may that Divine Light inspire and awaken our collective intellect.`,
      Hindi: `ॐ भूर्भुवः स्वः । तत्सवितुर्वरेण्यं । भर्गो देवस्य धीमहि । धियो यो नः प्रचोदयात् ॥
हम उस प्राणस्वरूप, दुःखनाशक, आनंदस्वरूप सविता देव के दिव्य तेज का ध्यान करते हैं; वह परमात्मा हमारी बुद्धि को सन्मार्ग में प्रेरित करे।`,
      Sanskrit: `ॐ भूर्भुवः स्वः ।
तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि ।
धियो यो नः प्रचोदयात् ॥ (ऋग्वेदः ३.६२.१०)`
    }
  }
];

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
    description: 'Complete guide to all 12 sacred Jyotirlinga temples of Lord Shiva across India with the Dwadasa Jyotirlinga Stotram.',
    views: 34210,
    likes: 11240,
    language: 'Sanskrit',
    author: 'Shiva Mahapurana & Adi Shankaracharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
    tags: ['12-jyotirlinga', 'shiva', 'somnath', 'mahakaleshwar', 'kedarnath', 'kashi-vishwanath'],
    body: {
      English: `Saurashtre Somanatham cha Shrishaile Mallikarjunam | Ujjayinyam Mahakalam Omkaram-amaleshwaram || Paralyam Vaidyanatham cha Dakinyam Bhimashankaram | Setubandhe tu Ramesham Nagesham Darukavane || Varanasyam tu Vishvesham Tryambakam Gautami-tate | Himalaye tu Kedaram Ghushmesham cha Shivalaye ||`,
      Hindi: `सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् । उज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥ परल्यां वैद्यनाथं च डाकिन्यां भीमशङ्करम् । सेतुबन्धे तु रामेशं नागेशं दारुकावने ॥ वाराणस्यां तु विश्वेशं त्र्यम्बकं गौतमीतटे । हिमालये तु केदारं घुश्मेशं च शिवालये ॥`,
      Sanskrit: `सौराष्ट्रे सोमनाथं च श्रीशैले मल्लिकार्जुनम् । उज्जयिन्यां महाकालमोङ्कारममलेश्वरम् ॥`
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
    description: 'Explore the sacred Golden Triangle of Odisha (Bhubaneswar, Konark, and Puri): Konark Surya Devalaya and Ekamra Kshetra Lingaraj Temple.',
    views: 26420,
    likes: 8910,
    language: 'English',
    author: 'Kapila Samhita & Ekamra Purana',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sri_Jagannath_Temple,_Puri._India.jpg?width=900',
    tags: ['konark', 'lingaraj', 'bhubaneswar', 'odisha', 'surya-mandir'],
    body: {
      English: `Together with Shree Jagannath Dham in Puri, the 11th-century Lingaraj Temple in Bhubaneswar (Ekamra Kshetra) and the 13th-century Konark Sun Temple (Arka Kshetra) form the sacred Golden Triangle of Odisha.`,
      Hindi: `ओडिशा का स्वर्ण त्रिभुज — जगन्नाथ पुरी (शंख क्षेत्र), कोणार्क सूर्य मंदिर (अर्क क्षेत्र), और भुवनेश्वर श्री लिंगराज मंदिर (एकाम्र क्षेत्र) — कलिंग स्थापत्य का गौरव हैं।`,
      Sanskrit: `जपाकुसुमसङ्काशं काश्यपेयं महाद्युतिम् । तमोऽरिं सर्वपापघ्नं प्रणतोऽस्मि दिवाकरम् ॥`
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
    description: 'Read the complete Shiva Tandava Stotram (Jatatavigalajjala Pravahapavitasthale) composed by Ravana.',
    views: 38940,
    likes: 12450,
    language: 'Sanskrit',
    author: 'Ravana (Lankeshwara)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lord_Shiva_Nataraja_at_the_British_Museum.jpg?width=900',
    tags: ['shiva-tandava-stotram', 'shiva', 'nataraja', 'ravana'],
    body: {
      English: `Jatatavigalajjala-pravahapavitasthale Gale'valambya lambitam bhujangatungamalikam | Damaddamaddamaddamanninaadavad-damarvayam Chakara chandatandavam tanotu nah Shivah shivam ||`,
      Hindi: `जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् । डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥`,
      Sanskrit: `जटाटवीगलज्जलप्रवाहपावितस्थले गलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम् । डमड्डमड्डमड्डमन्निनादवड्डमर्वयं चकार चण्डताण्डवं तनोतु नः शिवः शिवम् ॥`
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
    description: 'Read the complete Aditya Hridaya Stotram taught by Maharshi Agastya to Lord Sri Rama in Valmiki Ramayana.',
    views: 27450,
    likes: 9120,
    language: 'Sanskrit',
    author: 'Maharshi Valmiki (Spoken by Sage Agastya)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rama_and_Hanuman_fighting_Ravana,_an_album_painting_on_paper,_c1820.jpg?width=900',
    tags: ['aditya-hridayam', 'surya', 'rama', 'ramayana'],
    body: {
      English: `Aditya-hridayam punyam sarva-shatru-vinashanam | Jayavaham japen-nityam akshayyam paramam shivam ||`,
      Hindi: `आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् । जयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥`,
      Sanskrit: `आदित्यहृदयं पुण्यं सर्वशत्रुविनाशनम् । जयावहं जपेन्नित्यमक्षय्यं परमं शिवम् ॥`
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
    description: 'Read all 6 immortal verses of Nirvana Shatkam composed by Adi Shankaracharya.',
    views: 23490,
    likes: 8120,
    language: 'Sanskrit',
    author: 'Jagadguru Adi Shankaracharya',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/1500-1200_BCE,_Vivaha_sukta,_Rigveda_10.85.1-8,_Sanskrit,_Devanagari,_manuscript_page.jpg?width=900',
    tags: ['nirvana-shatkam', 'shivoham', 'advaita', 'vedanta'],
    body: {
      English: `Mano buddhyahankara chittani naham, Na cha shrotrajihve na cha ghranashnetre | Na cha vyoma bhumir na tejo na vayuh, Chidananda rupah Shivoham Shivoham ||`,
      Hindi: `मनोबुद्ध्यहंकारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे । न च व्योम भूमिर्न तेजो न वायुः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥`,
      Sanskrit: `मनोबुद्ध्यहङ्कारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे । न च व्योम भूमिर्न तेजो न वायुः चिदानन्दरूपः शिवोऽहं शिवोऽहम् ॥`
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
    description: 'Comprehensive chapter-by-chapter guide to all 18 Adhyayas (700 Shlokas) of Shrimad Bhagavad Gita.',
    views: 41200,
    likes: 14320,
    language: 'Sanskrit',
    author: 'Maharshi Vedavyasa',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arjuna_and_Krishna_at_the_Kurukshetra_Mahabharata_war,_Gita.jpg?width=900',
    tags: ['bhagavad-gita', '18-chapters', 'krishna', 'karma-yoga'],
    body: {
      English: `Comprising 700 verses across 18 chapters divided into Karma Shatkam (1–6), Bhakti Shatkam (7–12), and Jnana Shatkam (13–18).`,
      Hindi: `महाभारत के भीष्मपर्व के अंतर्गत १८ अध्यायों और ७०० श्लोकों वाली श्रीमद्भगवद्गीता कर्मयोग (१-६), भक्तियोग (७-१२) और ज्ञानयोग (१३-१८) का पावन समन्वय है।`,
      Sanskrit: `सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वा सर्वपापेभ्यः मोक्षयिष्यामि मा शुचः ॥ १८.६६ ॥`
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
    description: 'Explore the auspicious Sundara Kanda of Valmiki Ramayana and Tulsidas Ramcharitmanas.',
    views: 31800,
    likes: 10940,
    language: 'Sanskrit',
    author: 'Maharshi Valmiki & Goswami Tulsidas',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/11TH_Rudra_Shiva_Hanuman.jpg?width=900',
    tags: ['sundara-kanda', 'ramayana', 'hanuman', 'sita'],
    body: {
      English: `The Sundara Kanda celebrates Sri Hanuman's leap across the ocean, meeting Vibhishana, and delivering Sri Rama's signet ring to Mother Sita in Ashoka Vatika.`,
      Hindi: `श्रीरामचरितमानस का पंचम सोपान 'सुन्दरकाण्ड' सकल अमंगलों का नाश करने वाला है — "प्रबिसि नगर कीजे सब काजा। हृदयँ राखि कोसलपुर राजा॥"`,
      Sanskrit: `शान्तं शाश्वतमप्रमेयमनघं निर्वाणशान्तिप्रदं ब्रह्माशम्भुफणीन्द्रसेव्यमनिशं वेदान्तवेद्यं विभुम् ॥`
    }
  },
  {
    id: 'shri-durga-chalisa-complete',
    title: 'Shri Durga Chalisa (Namo Namo Durge Sukh Karani): Complete 40 Verses with Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Shri Durga Chalisa',
    contentType: 'All',
    pdfFileName: 'Shri-Durga-Chalisa-Complete-40-Verses.pdf',
    pdfUrl: '#auto-pdf',
    videoUrl: 'https://www.youtube.com/watch?v=012oY38Blvg',
    description: 'Read and chant the complete 40 verses of Shri Durga Chalisa in Hindi and English.',
    views: 42150,
    likes: 14820,
    language: 'Hindi',
    author: 'Shakta Devotional Tradition',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Idol_of_Goddess_Durga_(Ceremonial_Worship)_31.jpg?width=900',
    tags: ['durga-chalisa', 'navaratri', 'maa-durga', 'shakti'],
    body: {
      English: `Namo Namo Durge sukh karani, Namo Namo Ambe dukh harani | Nirakar hai jyoti tumhari, Tihun lok phaili ujiyari ||`,
      Hindi: `नमो नमो दुर्गे सुख करनी । नमो नमो अम्बे दुःख हरनी ॥ निराकार है ज्योति तुम्हारी । तिहूँ लोक फैली उजियारी ॥`,
      Sanskrit: `सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥`
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
    description: 'Read and chant the complete Shri Shiv Chalisa for peace, protection, and the grace of Lord Bholenath.',
    views: 39400,
    likes: 13640,
    language: 'Hindi',
    author: 'Ayodhya Das (Shiva Purana Tradition)',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shiva_nataraja_hg.jpg?width=900',
    tags: ['shiv-chalisa', 'bholenath', 'mahadev', 'shiva'],
    body: {
      English: `Jai Ganesh Girija Suvan, Mangal Mul Sujan | Jai Girija Pati Din Dayala, Sada karat santan pratipala ||`,
      Hindi: `जय गणेश गिरिजा सुवन, मंगल मूल सुजान । जय गिरिजा पति दीन दयाला । सदा करत सन्तन प्रतिपाला ॥`,
      Sanskrit: `कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम् । सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि ॥`
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
    description: 'Read and sing the complete Om Jai Jagdish Hare Aarti composed by Pandit Shardha Ram Phillauri.',
    views: 36400,
    likes: 11890,
    language: 'Hindi',
    author: 'Pandit Shardha Ram Phillauri',
    isFeatured: true,
    status: 'approved',
    isApproved: true,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:FilePath/DEV_DEEPAVALI_VARANASI_04.jpg?width=900',
    tags: ['om-jai-jagdish-hare', 'vishnu-aarti', 'bhajan'],
    body: {
      English: `Om Jai Jagdish Hare, Swami Jai Jagdish Hare | Bhakt jano ke sankat, das jano ke sankat, kshan mein door kare ||`,
      Hindi: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे । भक्त जनों के संकट, क्षण में दूर करे ॥`,
      Sanskrit: `त्वमेव माता च पिता त्वमेव त्वमेव बन्धुश्च सखा त्वमेव ।`
    }
  }
];

INITIAL_SACRED_ITEMS.push(...EXTRA_SEO_SACRED_ITEMS);

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
    a: 'The Sanatan Setu 108 Naam Jaap Counter is a free interactive 108-bead digital Rudraksha and Tulsi mala tool tracking daily mantra chants, completed 108-bead malas, Dhyana time, and lifetime Naam Jaap count with a 528Hz sacred chime.'
  },
  {
    q: 'Which mantras can I chant on the Naam Jaap Counter?',
    a: 'You can chant Radha Naam Jaap, Shri Ram Jai Ram Jai Jai Ram, Hare Krishna Maha Mantra, Om Namah Shivaya, Gayatri Mantra, Mahamrityunjaya Mantra, Om Namo Bhagavate Vasudevaya, Om Gam Ganapataye Namah, or enter your own custom Ishta Devata mantra.'
  },
  {
    q: 'Why are there 108 beads in a Naam Jaap Mala?',
    a: 'In Vedic astronomy and Upanishadic science, 108 represents cosmic harmony: 12 Rashis multiplied by 9 Navagrahas equals 108, and 27 Nakshatras across 4 Padas equals 108.'
  },
  {
    q: 'How are community-uploaded Hindu scriptures verified and published?',
    a: 'Every scripture, mantra, temple chronicle, or edit uploaded to Sanatan Setu goes to the Admin Pending Approval Queue and is published globally across all browsers once approved by Admin.'
  }
];

export const SEO_INDEX_HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Naam Jaap Counter (108 Digital Mala) & Sanatan Setu Hindu Scripture Library</title>
  </head>
  <body class="bg-[#FDFBF7] text-[#2C1A12] antialiased">
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
  } catch (e) {}
}

export const LANGUAGE_GT_CODES = {
  Sanskrit: 'sa', Hindi: 'hi', English: 'en', Odia: 'or', Bengali: 'bn', Marathi: 'mr',
  Gujarati: 'gu', Tamil: 'ta', Telugu: 'te', Kannada: 'kn', Malayalam: 'ml', Punjabi: 'pa',
  Assamese: 'as', Maithili: 'mai', Nepali: 'ne', Spanish: 'es', French: 'fr', German: 'de',
  Russian: 'ru', Japanese: 'ja', Chinese: 'zh-CN', Arabic: 'ar', Portuguese: 'pt',
  Indonesian: 'id', Thai: 'th', Korean: 'ko', Italian: 'it'
};

const TAMIL_PHONETIC_MAP = {
  'अ':'அ','आ':'ஆ','इ':'இ','ई':'ஈ','उ':'உ','ऊ':'ஊ','ऋ':'ரி','ए':'ஏ','ऐ':'ஐ','ओ':'ஓ','औ':'ஔ',
  'ा':'ா','ि':'ி','ी':'ீ','ु':'ு','ू':'ூ','ृ':'்ரு','े':'ே','ै':'ை','ो':'ோ','ौ':'ௌ',
  'ं':'ம்','ः':'ஃ','ँ':'ம்','्':'்','ऽ':'',
  'क':'க','ख':'க','ग':'க','घ':'க','ङ':'ங','च':'ச','छ':'ச','ज':'ஜ','झ':'ஜ','ञ':'ஞ',
  'ट':'ட','ठ':'ட','ड':'ட','ढ':'ட','ण':'ண','त':'த','थ':'த','द':'த','ध':'த','न':'ந',
  'प':'ப','फ':'ப','ब':'ப','भ':'ப','म':'ம','य':'ய','र':'ர','ल':'ல','ळ':'ள','व':'வ',
  'श':'ஶ','ष':'ஷ','स':'ஸ','ह':'ஹ','०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'
};

const INDIC_BLOCK_START = {
  Bengali: 0x0980, Assamese: 0x0980, Punjabi: 0x0A00, Gujarati: 0x0A80,
  Odia: 0x0B00, Telugu: 0x0C00, Kannada: 0x0C80, Malayalam: 0x0D00
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
    if (ch === 'व') {
      if (lang === 'Bengali') { out += 'ব'; continue; }
      if (lang === 'Assamese') { out += 'ৱ'; continue; }
      if (lang === 'Odia') { out += 'ବ'; continue; }
    }
    if (ch === 'र' && lang === 'Assamese') { out += 'ৰ'; continue; }
    if (
      (code >= 0x0901 && code <= 0x0939) ||
      (code >= 0x093C && code <= 0x094D) ||
      (code >= 0x0950 && code <= 0x0954) ||
      (code >= 0x0960 && code <= 0x0963) ||
      (code >= 0x0966 && code <= 0x096F)
    ) {
      out += String.fromCharCode(blockStart + (code - 0x0900));
    } else {
      out += ch;
    }
  }
  return out;
}

const WORLD_LANG_HEADERS = {
  Spanish: { intro: 'Texto Sagrado Completo y Comentario Védico en Español', versesHeader: 'Versos Originales en Sánscrito', meaningHeader: 'Significado Espiritual' },
  French: { intro: 'Texte Sacré Complet et Commentaire Védique en Français', versesHeader: 'Versets Originaux en Sanskrit', meaningHeader: 'Signification Spirituelle' },
  German: { intro: 'Vollständiger Heiliger Text auf Deutsch', versesHeader: 'Originale Sanskrit-Verse', meaningHeader: 'Spirituelle Bedeutung' },
  Russian: { intro: 'Полный Священный Текст на Русском Языке', versesHeader: 'Санскритские Шлоки', meaningHeader: 'Духовное Значение' },
  Japanese: { intro: '日本語による完全な聖典テキスト', versesHeader: 'サンスクリット語原文', meaningHeader: '霊的な意味' },
  Chinese: { intro: '中文完整神圣经典文本', versesHeader: '梵文原文', meaningHeader: '精神内涵' },
  Arabic: { intro: 'النص المقدس الكامل باللغة العربية', versesHeader: 'الآيات السنسكريتية الأصلية', meaningHeader: 'المعنى الروحي' },
  Portuguese: { intro: 'Texto Sagrado Completo em Português', versesHeader: 'Versos em Sânscrito', meaningHeader: 'Significado Espiritual' },
  Indonesian: { intro: 'Teks Suci Lengkap dalam Bahasa Indonesia', versesHeader: 'Sloka Sanskerta Asli', meaningHeader: 'Makna Spiritual' },
  Thai: { intro: 'คัมภีร์ศักดิ์สิทธิ์ฉบับสมบูรณ์ภาษาไทย', versesHeader: 'โศลกสันสกฤตต้นฉบับ', meaningHeader: 'ความหมายทางจิตวิญญาณ' },
  Korean: { intro: '한국어 완역 성전 텍스트', versesHeader: '산스크리트어 원문', meaningHeader: '영적 의미' },
  Italian: { intro: 'Testo Sacro Completo in Italiano', versesHeader: 'Versi in Sanscrito', meaningHeader: 'Significato Spirituale' }
};

const INDIAN_REGIONAL_HEADERS = {
  Odia: { titlePrefix: '॥ ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ କୃପାରୁ ସମ୍ପୂର୍ଣ୍ଣ ଓଡ଼ିଆ ପାଠ ଓ ଅର୍ଥ ॥', mulaHeader: '॥ ମୂଳ ସଂସ୍କୃତ ଶ୍ଳୋକ (ଓଡ଼ିଆ ଲିପିରେ) ॥', bhavaHeader: '॥ ସମ୍ପୂର୍ଣ୍ଣ ଓଡ଼ିଆ ଭାବାର୍ଥ ଏବଂ ବ୍ୟାଖ୍ୟା ॥' },
  Bengali: { titlePrefix: '॥ সম্পূর্ণ বাংলা পাঠ, মূল শ্লোক ও বিস্তারিত ভাবার্থ ॥', mulaHeader: '॥ মূল সংস্কৃত পাঠ (বাংলা লিপিতে) ॥', bhavaHeader: '॥ সম্পূর্ণ বাংলা ভাবার্থ ও ব্যাখ্যা ॥' },
  Assamese: { titlePrefix: '॥ সম্পূৰ্ণ অসমীয়া পাঠ, মূল শ্লোক আৰু ভাবাৰ্থ ॥', mulaHeader: '॥ মূল সংস্কৃত পাঠ (অসমীয়া লিপিত) ॥', bhavaHeader: '॥ সম্পূৰ্ণ অসমীয়া ভাবাৰ্থ আৰু ব্যাখ্যা ॥' },
  Gujarati: { titlePrefix: '॥ સંપૂર્ણ ગુજરાતી પાઠ, મૂળ શ્લોક અને ભાવાર્થ ॥', mulaHeader: '॥ મૂળ સંસ્કૃત પાઠ (ગુજરાતી લિપિમાં) ॥', bhavaHeader: '॥ સંપૂર્ણ ગુજરાતી ભાવાર્થ અને સમજૂતી ॥' },
  Punjabi: { titlePrefix: '॥ ਸੰਪੂਰਨ ਪੰਜਾਬੀ ਪਾਠ, ਮੂਲ ਸ਼ਲੋਕ ਅਤੇ ਭਾਵ-ਅਰਥ ॥', mulaHeader: '॥ ਮੂਲ ਸੰਸਕ੍ਰਿਤ ਪਾਠ (ਗੁਰਮੁਖੀ ਲਿਪੀ ਵਿੱਚ) ॥', bhavaHeader: '॥ ਸੰਪੂਰਨ ਪੰਜਾਬੀ ਭਾਵ-ਅਰਥ ਅਤੇ ਵਿਆਖਿਆ ॥' },
  Tamil: { titlePrefix: '॥ முழுமையான தமிழ் பாடமும் மூல ஸ்லோகங்களும் விளக்கமும் ॥', mulaHeader: '॥ மூல ஸம்ஸ்கிருத ஸ்லோகங்கள் (தமிழ் எழுத்தில்) ॥', bhavaHeader: '॥ முழுமையான தமிழ் பொருள் மற்றும் விரிவான விளக்கம் ॥' },
  Telugu: { titlePrefix: '॥ సంపూర్ణ తెలుగు పాఠం, మూల శ్లోకాలు మరియు భావార్థం ॥', mulaHeader: '॥ మూల సంస్కృత శ్లోకాలు (తెలుగు లిపిలో) ॥', bhavaHeader: '॥ సంపూర్ణ తెలుగు భావార్థం మరియు వివరణ ॥' },
  Kannada: { titlePrefix: '॥ ಸಂಪೂರ್ಣ ಕನ್ನಡ ಪಾಠ, ಮೂಲ ಶ್ಲೋಕಗಳು ಮತ್ತು ಭಾವಾರ್ಥ ॥', mulaHeader: '॥ ಮೂಲ ಸಂಸ್ಕೃತ ಶ್ಲೋಕಗಳು (ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ) ॥', bhavaHeader: '॥ ಸಂಪೂರ್ಣ ಕನ್ನಡ ಭಾವಾರ್ಥ ಮತ್ತು ವಿವರಣೆ ॥' },
  Malayalam: { titlePrefix: '॥ സമ്പൂർണ്ണ മലയാളം പാഠം, മൂല ശ്ലോകങ്ങളും ഭാവാർത്ഥവും ॥', mulaHeader: '॥ മൂല സംസ്കൃത ശ്ലോകങ്ങൾ (മലയാളം ലിപിയിൽ) ॥', bhavaHeader: '॥ സമ്പൂർണ്ണ മലയാളം ഭാവാർത്ഥവും വ്യാഖ്യാനവും ॥' },
  Marathi: { titlePrefix: '॥ संपूर्ण मराठी पाठ, मूळ संस्कृत श्लोक आणि सविस्तर भावार्थ ॥', mulaHeader: '॥ मूळ संस्कृत श्लोक व संहिता ॥', bhavaHeader: '॥ संपूर्ण भावार्थ व सविस्तर विवेचन ॥' },
  Maithili: { titlePrefix: '॥ संपूर्ण मैथिली पाठ, मूल संस्कृत श्लोक आ भावार्थ ॥', mulaHeader: '॥ मूल संस्कृत श्लोक ॥', bhavaHeader: '॥ संपूर्ण भावार्थ आ व्याख्या ॥' },
  Nepali: { titlePrefix: '॥ सम्पूर्ण नेपाली पाठ, मूल संस्कृत श्लोक र भावार्थ ॥', mulaHeader: '॥ मूल संस्कृत श्लोक ॥', bhavaHeader: '॥ सम्पूर्ण भावार्थ र विस्तृत व्याख्या ॥' }
};

const LIVE_TRANSLATION_CACHE = {};
try {
  const savedTrans = typeof window !== 'undefined' ? localStorage.getItem('sanatan_live_translations_v1') : null;
  if (savedTrans) Object.assign(LIVE_TRANSLATION_CACHE, JSON.parse(savedTrans));
} catch (e) {}

export async function translateTextToLanguageAsync(sourceText, targetLang) {
  const gtCode = LANGUAGE_GT_CODES[targetLang];
  if (!gtCode || !sourceText || !sourceText.trim()) return null;
  const cacheKey = `${targetLang}::${sourceText.slice(0, 120)}::${sourceText.length}`;
  if (LIVE_TRANSLATION_CACHE[cacheKey]) return LIVE_TRANSLATION_CACHE[cacheKey];
  try {
    const proto = ['htt', 'ps://'].join('');
    const host = ['translate', 'googleapis', 'com'].join('.');
    const url = `${proto}${host}/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(gtCode)}&dt=t&q=${encodeURIComponent(sourceText.slice(0, 1600))}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const fullTranslated = Array.isArray(data?.[0]) ? data[0].map((seg) => seg?.[0] || '').join('') : '';
    if (fullTranslated && fullTranslated.trim()) {
      LIVE_TRANSLATION_CACHE[cacheKey] = fullTranslated;
      try { localStorage.setItem('sanatan_live_translations_v1', JSON.stringify(LIVE_TRANSLATION_CACHE)); } catch (e) {}
      return fullTranslated;
    }
  } catch (e) {}
  return null;
}

export function getBodyForLanguage(item, lang = 'English') {
  if (!item || !item.body) return '';
  if (typeof item.body === 'string') {
    item = { ...item, body: { English: item.body, Hindi: item.body, Sanskrit: item.body } };
  }
  const eng = (item.body.English || '').trim();
  const hin = (item.body.Hindi || '').trim();
  const san = (item.body.Sanskrit || '').trim();
  const fallbackSource = hin || eng || san || item.description || item.title || '';

  const direct = (item.body[lang] || '').trim();
  if (direct && (['English', 'Hindi', 'Sanskrit'].includes(lang) || direct !== eng)) {
    if (!(lang !== 'English' && direct === eng && !/[ऀ-ൿ]/.test(direct))) return direct;
  }

  const cacheKey = `${lang}::${fallbackSource.slice(0, 120)}::${fallbackSource.length}`;
  if (LIVE_TRANSLATION_CACHE[cacheKey]) {
    if (san && lang !== 'Sanskrit') {
      return `${transliterateDevanagariToNativeScript(san, lang)}\n\n${LIVE_TRANSLATION_CACHE[cacheKey]}`;
    }
    return LIVE_TRANSLATION_CACHE[cacheKey];
  }

  if (INDIAN_REGIONAL_HEADERS[lang]) {
    const hdr = INDIAN_REGIONAL_HEADERS[lang];
    const devBase = hin && /[ऀ-ॿ]/.test(hin) ? hin : san;
    const sanNative = san ? transliterateDevanagariToNativeScript(san, lang) : '';
    const hinNative = devBase ? transliterateDevanagariToNativeScript(devBase, lang) : '';
    return (
      `${hdr.titlePrefix}\n` +
      (sanNative ? `${hdr.mulaHeader}\n${sanNative}\n\n` : '') +
      (hinNative ? `${hdr.bhavaHeader}\n${hinNative}\n\n` : '') +
      (eng ? `॥ English Reference Text ॥\n${eng}` : '')
    ).trim();
  }

  if (WORLD_LANG_HEADERS[lang]) {
    const wh = WORLD_LANG_HEADERS[lang];
    return (
      `【 ${wh.intro} — ${item.title} 】\n\n` +
      (san ? `॥ ${wh.versesHeader} ॥\n${san}\n\n` : '') +
      `॥ ${wh.meaningHeader} (${lang}) ॥\n${eng || fallbackSource}`
    ).trim();
  }

  return direct || eng || hin || san || fallbackSource;
}

const SEED_IDS_SET = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));

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
  const [imageFitMode, setImageFitMode] = useState('contain-blur');
  const [activeShlokaIndex, setActiveShlokaIndex] = useState(0);
  const [isAartiActive, setIsAartiActive] = useState(false);
  const [chantParticles, setChantParticles] = useState([]);

  // Global Sync Status State
  const [globalSyncStatus, setGlobalSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'offline'
  const [lastGlobalSyncTime, setLastGlobalSyncTime] = useState('');
  const [deletedIds, setDeletedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_deleted_ids_v1') || '[]');
    } catch {
      return [];
    }
  });

  // Custom Category Background Images State
  const [categoryCustomImages, setCategoryCustomImages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_category_images_v1') || '{}');
    } catch {
      return {};
    }
  });

  // 3. Library Items State — Preserves built-in 23+ scriptures + merges local edits/uploads cleanly
  const [items, setItems] = useState(() => {
    let deletedSet = new Set();
    try {
      deletedSet = new Set(JSON.parse(localStorage.getItem('sanatan_setu_deleted_ids_v1') || '[]').map(String));
    } catch (e) {}

    let editsMap = {};
    try {
      editsMap = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
    } catch (e) {}

    const collectedCustomMap = new Map();
    try {
      const raw = localStorage.getItem('sanatan_setu_items_v6');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const it of parsed) {
            if (!it || !it.id) continue;
            const strId = String(it.id);
            if (deletedSet.has(strId)) continue;
            if (!SEED_IDS_SET.has(strId)) {
              const mergedCustom = editsMap[strId] ? { ...it, ...editsMap[strId] } : it;
              collectedCustomMap.set(strId, {
                ...mergedCustom,
                isUserUploaded: true,
                status: mergedCustom.status === 'approved' || mergedCustom.isApproved === true ? 'approved' : 'pending',
                isApproved: mergedCustom.status === 'approved' || mergedCustom.isApproved === true
              });
            }
          }
        }
      }
    } catch (e) {}

    const mergedSeeds = INITIAL_SACRED_ITEMS
      .filter((seed) => !deletedSet.has(String(seed.id)))
      .map((seed) => {
        const edited = editsMap[String(seed.id)];
        return edited ? { ...seed, ...edited, fallbackImageUrl: seed.fallbackImageUrl } : seed;
      });

    return [...Array.from(collectedCustomMap.values()), ...mergedSeeds];
  });

  // 4. Filter, Search, Likes, Bookmarks State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('All');
  const [selectedMediaFormat, setSelectedMediaFormat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_recent_searches_v1') || '["Hanuman Chalisa", "108 Naam Jaap Counter", "Jagannath Temple Puri", "Bhagavad Gita", "Shiva Tandava Stotram"]');
    } catch {
      return ['Hanuman Chalisa', '108 Naam Jaap Counter', 'Jagannath Temple Puri', 'Bhagavad Gita'];
    }
  });
  const [sortBy, setSortBy] = useState('featured');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const [likedIds, setLikedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanatan_setu_likes') || '[]'); } catch { return []; }
  });

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanatan_setu_bookmarks') || '[]'); } catch { return []; }
  });

  // 5. Upload & Admin Moderation State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try { return localStorage.getItem('sanatan_admin_auth') === 'true'; } catch { return false; }
  });
  const [adminPasscodeInput, setAdminPasscodeInput] = useState('');
  const [customAdminPasscode, setCustomAdminPasscode] = useState(() => {
    try { return localStorage.getItem('sanatan_admin_custom_passcode') || DEFAULT_ADMIN_PASSCODE; } catch { return DEFAULT_ADMIN_PASSCODE; }
  });
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'published' | 'sync' | 'seo'
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

  // Build compact global payload (only user-uploaded items + admin-modified built-in items, omitting heavy fallback SVGs)
  const buildCompactGlobalPayload = useCallback((allItems, delIds) => {
    const compactItems = allItems
      .filter((it) => it && it.id && (!SEED_IDS_SET.has(String(it.id)) || it.isModified || it.updatedAt))
      .map((it) => {
        const { fallbackImageUrl, ...rest } = it;
        return rest;
      });
    return {
      updatedAt: new Date().toISOString(),
      items: compactItems,
      deletedIds: delIds || []
    };
  }, []);

  // Push Admin-approved state to /api/sync so ALL browsers & devices worldwide see it immediately
  const pushGlobalSnapshot = useCallback(async (nextItems, nextDeletedIds = deletedIds) => {
    if (typeof fetch === 'undefined') return false;
    setGlobalSyncStatus('syncing');
    try {
      const payload = buildCompactGlobalPayload(nextItems, nextDeletedIds);
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': (customAdminPasscode || DEFAULT_ADMIN_PASSCODE).trim()
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setGlobalSyncStatus('synced');
        setLastGlobalSyncTime(new Date().toLocaleTimeString());
        return true;
      } else {
        setGlobalSyncStatus('offline');
        return false;
      }
    } catch (e) {
      setGlobalSyncStatus('offline');
      return false;
    }
  }, [buildCompactGlobalPayload, customAdminPasscode, deletedIds]);

  // Fetch global items from /api/sync (fallback to /sanatan-global-db.json) on load so ALL browsers stay synced
  const fetchGlobalItems = useCallback(async (notify = false) => {
    if (typeof fetch === 'undefined') return;
    try {
      let res = await fetch(`/api/sync?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) {
        res = await fetch(`/sanatan-global-db.json?t=${Date.now()}`, { cache: 'no-store' });
      }
      if (!res.ok) return;
      const payload = await res.json();
      const remoteList = Array.isArray(payload) ? payload : payload?.items;
      const remoteDeleted = Array.isArray(payload?.deletedIds) ? payload.deletedIds : [];
      if (!Array.isArray(remoteList)) return;

      setGlobalSyncStatus('synced');
      if (payload?.updatedAt) {
        setLastGlobalSyncTime(new Date(payload.updatedAt).toLocaleTimeString());
      }

      const deletedSet = new Set(remoteDeleted.map(String));
      if (remoteDeleted.length > 0) {
        setDeletedIds(remoteDeleted);
        try { localStorage.setItem('sanatan_setu_deleted_ids_v1', JSON.stringify(remoteDeleted)); } catch (e) {}
      }

      if (remoteList.length === 0 && remoteDeleted.length === 0) {
        if (notify) showToast('Connected to Global Sync. No new pending items.');
        return;
      }

      setItems((prev) => {
        const remoteMap = new Map(remoteList.filter((x) => x && x.id).map((x) => [String(x.id), x]));
        const merged = prev
          .filter((localIt) => !deletedSet.has(String(localIt.id)))
          .map((localIt) => {
            const rem = remoteMap.get(String(localIt.id));
            if (!rem) return localIt;
            const localTime = Date.parse(localIt.updatedAt || 0) || 0;
            const remTime = Date.parse(rem.updatedAt || 0) || 0;
            return remTime >= localTime
              ? { ...localIt, ...rem, fallbackImageUrl: localIt.fallbackImageUrl || rem.fallbackImageUrl }
              : localIt;
          });
        remoteMap.forEach((rem, id) => {
          if (!deletedSet.has(id) && !merged.some((m) => String(m.id) === id)) {
            merged.unshift(rem);
          }
        });
        return merged;
      });

      if (notify) showToast('Synced latest updates & pending queue from cloud!');
    } catch (e) {
      if (notify) showToast('Could not reach /api/sync yet — check Vercel Environment Variables.');
    }
  }, [showToast]);

  useEffect(() => {
    fetchGlobalItems(false);
  }, [fetchGlobalItems]);

  // Sync Dark Mode with localStorage & Document Root
  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', darkMode);
      }
    } catch (e) {}
  }, [darkMode]);

  // Hydrate from IndexedDB safely (respecting updatedAt timestamps)
  const isDbHydratedRef = useRef(false);
  useEffect(() => {
    let active = true;
    SanatanUnlimitedDB.loadItems().then((idbItems) => {
      isDbHydratedRef.current = true;
      if (!active || !Array.isArray(idbItems) || idbItems.length === 0) return;
      setItems((prev) => {
        const idbMap = new Map(idbItems.filter((x) => x && x.id).map((x) => [String(x.id), x]));
        const merged = prev.map((it) => {
          const stored = idbMap.get(String(it.id));
          if (!stored) return it;
          const t1 = Date.parse(it.updatedAt || 0) || 0;
          const t2 = Date.parse(stored.updatedAt || 0) || 0;
          return t2 > t1 ? { ...it, ...stored, fallbackImageUrl: it.fallbackImageUrl || stored.fallbackImageUrl } : it;
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
      try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items)); } catch (quotaErr) {}
      if (isDbHydratedRef.current) {
        SanatanUnlimitedDB.saveItems(items);
      }
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

  // URL Hash Deep-Linking & Browser Back Button Support
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
    const handlePopState = (e) => {
      const st = e.state;
      if (st && st.sanatanView) {
        if (!st.itemId) setSelectedItem(null);
        setActiveView(st.sanatanView);
        if (st.catId) setSelectedCategory(st.catId);
        return;
      }
      const currentHash = window.location.hash.replace(/^#\/?/, '');
      if (!currentHash || currentHash === 'home') {
        setSelectedItem(null);
        setActiveView('home');
        setSelectedCategory('All');
      } else {
        handleHash();
      }
    };
    window.addEventListener('hashchange', handleHash);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [items]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const targetHash = activeView === 'home' ? (selectedCategory !== 'All' ? `#category/${encodeURIComponent(selectedCategory)}` : '#home') : `#${activeView}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(
          { sanatanView: activeView, itemId: selectedItem?.id || null, catId: selectedCategory },
          '',
          targetHash
        );
      }
    } catch (e) {}
  }, [activeView, selectedCategory]);

  // STRICT ADMIN APPROVAL SEPARATION: Only Admin-approved items show publicly; visitor uploads & edits wait in Pending Queue
  const approvedItems = useMemo(
    () => items.filter((item) => item.status === 'approved' || item.isApproved === true),
    [items]
  );

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending' && item.isApproved !== true),
    [items]
  );

  const generatedSitemapXml = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://sanatansetulibrary.com';
    const today = new Date().toISOString().split('T')[0];
    const urls = [
      `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <priority>1.0</priority>\n  </url>`,
      `  <url>\n    <loc>${baseUrl}/#jaap</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.95</priority>\n  </url>`
    ];
    approvedItems.forEach((item) => {
      urls.push(`  <url>\n    <loc>${baseUrl}/#article/${encodeURIComponent(item.id)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>0.90</priority>\n  </url>`);
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  }, [approvedItems]);

  const generatedRobotsTxt = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' && window.location.origin.startsWith('http')
      ? window.location.origin
      : 'https://sanatansetulibrary.com';
    return `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`;
  }, []);

  const seoMetadata = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sanatansetulibrary.com';
    if (selectedItem) {
      return {
        title: `${selectedItem.title} | ${selectedItem.category} – Sanatan Setu`,
        description: selectedItem.description || selectedItem.title,
        keywords: [...(selectedItem.tags || []), selectedItem.category, 'Sanatan Setu'].join(', '),
        canonical: `${baseUrl}/#article/${selectedItem.id}`,
        type: 'article',
        jsonLd: { '@context': 'https://schema.org', '@type': 'Article', headline: selectedItem.title, description: selectedItem.description }
      };
    }
    return {
      title: 'Naam Jaap Counter (108 Digital Mala) & Sanatan Setu Hindu Scripture Library',
      description: 'Free 108-Bead Naam Jaap Counter and authentic Admin-verified Hindu scriptures in 27 languages.',
      keywords: 'naam jaap counter, Sanatan Setu, Vedas, Upanishads, Bhagavad Gita, Hanuman Chalisa, Jagannath Temple Puri',
      canonical: `${baseUrl}/`,
      type: 'website',
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Sanatan Setu Library', url: baseUrl }
    };
  }, [selectedItem]);

  useEffect(() => {
    if (typeof document !== 'undefined') document.title = seoMetadata.title;
  }, [seoMetadata]);

  // Live Full-Document Neural Translation Effect
  const [, setTranslationVersion] = useState(0);
  useEffect(() => {
    const targetItem = selectedItem;
    const targetLang = detailLang;
    if (!targetItem || !targetLang) return;
    const bodyObj = typeof targetItem.body === 'object' ? targetItem.body : { English: String(targetItem.body || '') };
    const existing = (bodyObj[targetLang] || '').trim();
    const eng = (bodyObj.English || '').trim();
    const hin = (bodyObj.Hindi || '').trim();
    const san = (bodyObj.Sanskrit || '').trim();
    const needsNeuralTranslation = !existing || (targetLang !== 'English' && existing === eng && !/[ऀ-ൿ]/.test(existing));
    if (!needsNeuralTranslation) return;
    const sourceToTranslate = eng || hin || san || targetItem.description || '';
    if (!sourceToTranslate) return;

    let cancelled = false;
    translateTextToLanguageAsync(sourceToTranslate, targetLang).then((translated) => {
      if (cancelled || !translated) return;
      const finalBodyForLang =
        san && targetLang !== 'Sanskrit' && targetLang !== 'English'
          ? `${transliterateDevanagariToNativeScript(san, targetLang)}\n\n${translated}`
          : translated;
      setSelectedItem((prev) =>
        prev && prev.id === targetItem.id
          ? { ...prev, body: { ...(typeof prev.body === 'object' ? prev.body : { English: String(prev.body || '') }), [targetLang]: finalBodyForLang } }
          : prev
      );
      setTranslationVersion((v) => v + 1);
    });
    return () => { cancelled = true; };
  }, [selectedItem?.id, detailLang]);

  const filteredItems = useMemo(() => {
    return approvedItems
      .filter((item) => {
        const matchCat =
          selectedCategory === 'All' ||
          (selectedCategory === 'Uploaded' ? Boolean(item.isUserUploaded) : item.category === selectedCategory);
        const matchLang = Boolean(selectedLanguageFilter);
        const matchFormat =
          selectedMediaFormat === 'All' ||
          (selectedMediaFormat === 'PDF' && Boolean(item.pdfUrl)) ||
          (selectedMediaFormat === 'Video' && Boolean(item.videoUrl)) ||
          (selectedMediaFormat === 'Text' && Boolean(item.body));
        const matchBookmark = !showBookmarksOnly || bookmarkedIds.includes(item.id);
        const q = searchQuery.trim().toLowerCase();
        const bodyText = `${getBodyForLanguage(item, 'English')} ${getBodyForLanguage(item, 'Hindi')} ${getBodyForLanguage(item, 'Sanskrit')}`.toLowerCase();
        const matchSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          (item.category || '').toLowerCase().includes(q) ||
          (item.description || '').toLowerCase().includes(q) ||
          (item.author || '').toLowerCase().includes(q) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(q)) ||
          bodyText.includes(q);
        return matchCat && matchLang && matchFormat && matchBookmark && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.views || 0) - (a.views || 0);
        if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
        const aUp = a.isUserUploaded ? 1 : 0;
        const bUp = b.isUserUploaded ? 1 : 0;
        if (aUp !== bUp) return bUp - aUp;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || (b.views || 0) - (a.views || 0);
      });
  }, [approvedItems, selectedCategory, selectedLanguageFilter, selectedMediaFormat, showBookmarksOnly, bookmarkedIds, searchQuery, sortBy]);

  const saveRecentSearch = useCallback((term) => {
    const cleaned = String(term || '').trim();
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const updated = [cleaned, ...prev.filter((t) => t.toLowerCase() !== cleaned.toLowerCase())].slice(0, 7);
      try { localStorage.setItem('sanatan_recent_searches_v1', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const googleSearchData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { isJaapMatch: false, matchedCategories: [], matchedItems: approvedItems.slice(0, 6), totalCount: approvedItems.length };
    }
    const jaapKeywords = ['jaap', 'jap', 'jamm', 'mala', 'counter', '108', 'chant', 'radha', 'ram naam', 'hare krishna', 'नाम जाप'];
    const isJaapMatch = jaapKeywords.some((kw) => q.includes(kw));
    const matchedCategories = CATEGORIES.filter(
      (cat) => cat.name.toLowerCase().includes(q) || cat.sanskrit.toLowerCase().includes(q) || cat.description.toLowerCase().includes(q)
    );
    const scoredItems = [];
    for (const item of approvedItems) {
      const titleL = item.title.toLowerCase();
      const catL = item.category.toLowerCase();
      const descL = (item.description || '').toLowerCase();
      const tagsL = (item.tags || []).join(' ').toLowerCase();
      let score = 0;
      if (titleL === q) score += 120;
      else if (titleL.startsWith(q)) score += 90;
      else if (titleL.includes(q)) score += 70;
      if (tagsL.includes(q)) score += 45;
      if (catL.includes(q)) score += 35;
      if (descL.includes(q)) score += 25;
      if (score > 0) scoredItems.push({ item, score });
    }
    scoredItems.sort((a, b) => b.score - a.score || (b.item.views || 0) - (a.item.views || 0));
    return { isJaapMatch, matchedCategories, matchedItems: scoredItems.map((s) => s.item), totalCount: scoredItems.length };
  }, [searchQuery, approvedItems]);

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      showToast('Voice search is supported in Chrome, Edge, and Safari browsers.');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      setIsVoiceListening(true);
      showToast('🎤 Listening... Speak any scripture, temple, or mantra name');
      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setSearchQuery(transcript);
          setIsSearchFocused(true);
          saveRecentSearch(transcript);
        }
        setIsVoiceListening(false);
      };
      recognition.onerror = () => setIsVoiceListening(false);
      recognition.onend = () => setIsVoiceListening(false);
      recognition.start();
    } catch {
      setIsVoiceListening(false);
    }
  };

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => setMeditationSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const activeMantra = useMemo(() => {
    if (isCustomMantra) {
      return { id: 'custom', name: 'Custom Ishta Mantra', sanskrit: customMantraText || 'ॐ श्री रामाय नमः', deity: 'Personal Ishta Devata' };
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
    setTimeout(() => setChantParticles((prev) => prev.filter((p) => p.id !== pid)), 1050);
    setTimeout(() => setPulseEffect(false), 180);
  }, [soundEnabled, showToast]);

  useEffect(() => {
    let autoTimer;
    if (autoJaapActive) autoTimer = setInterval(() => handleIncrementJaap(), 2200);
    return () => clearInterval(autoTimer);
  }, [autoJaapActive, handleIncrementJaap]);

  const handleResetJaap = () => {
    setCurrentCount(0);
    setMeditationSeconds(0);
    setIsTimerRunning(false);
    setAutoJaapActive(false);
    showToast('Old Jaap cancelled! Counter & timer reset to 0 — ready for your new Naam Jaap.');
  };

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
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }, [approvedItems, showToast]);

  const handleOpenItem = (item) => {
    setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, views: (it.views || 0) + 1 } : it)));
    setSelectedItem({ ...item, views: (item.views || 0) + 1 });
    setDetailLang(selectedLanguageFilter !== 'All' ? selectedLanguageFilter : 'English');
    setIsSearchFocused(false);
    if (typeof window !== 'undefined') {
      try {
        window.history.pushState({ sanatanView: activeView, itemId: item.id, catId: selectedCategory }, '', `#article/${item.id}`);
      } catch (e) {}
    }
  };

  const handleExecuteGoogleSearch = (overrideQuery) => {
    const q = String(overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    if (!q) {
      setIsSearchFocused(true);
      return;
    }
    saveRecentSearch(q);
    setIsSearchFocused(false);
    const qLower = q.toLowerCase();
    if (['naam jaap', 'naam jaap counter', 'naam jamm counter', 'jaap counter', 'digital mala', '108 mala'].some((k) => qLower.includes(k))) {
      setActiveView('jaap');
      showToast('📿 Redirected to 108-Bead Naam Jaap Counter!');
      return;
    }
    const topMatches = googleSearchData.matchedItems;
    if (activeSuggestionIdx >= 0 && topMatches[activeSuggestionIdx]) {
      handleOpenItem(topMatches[activeSuggestionIdx]);
      return;
    }
    const exactCat = CATEGORIES.find((c) => c.name.toLowerCase() === qLower || c.id.toLowerCase() === qLower);
    if (exactCat) {
      handleSelectCategory(exactCat.id, false);
      return;
    }
    if (topMatches.length > 0) {
      handleOpenItem(topMatches[0]);
    } else {
      showToast(`No exact match for "${q}" — showing all sacred categories below.`);
    }
  };

  const handleCloseItem = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedItem(null);
    if (typeof window !== 'undefined') {
      try { window.history.replaceState(null, '', window.location.pathname); } catch (e) {}
    }
  };

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    const alreadyLiked = likedIds.includes(id);
    setLikedIds((prev) => (alreadyLiked ? prev.filter((i) => i !== id) : [...prev, id]));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: Math.max(0, (item.likes || 0) + (alreadyLiked ? -1 : 1)) } : item))
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, likes: Math.max(0, (prev.likes || 0) + (alreadyLiked ? -1 : 1)) } : null));
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

  // Compressed Cover Image Upload
  const handleImageFileChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressCoverImageFile(file, 960, 0.75);
    if (compressed) {
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, imageUrl: compressed });
      } else {
        setUploadForm((prev) => ({ ...prev, imageUrl: compressed }));
      }
      showToast('Cover photo optimized and attached!');
    }
  };

  const handlePdfFileChange = (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, pdfUrl: reader.result, pdfFileName: file.name, contentType: editingItem.videoUrl ? 'All' : 'PDF' });
        } else {
          setUploadForm((prev) => ({ ...prev, pdfUrl: reader.result, pdfFileName: file.name, contentType: prev.videoUrl ? 'All' : 'PDF' }));
        }
        showToast(`PDF "${file.name}" attached!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCategoryImageUpload = async (catId, e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressCoverImageFile(file, 960, 0.75);
    if (compressed) {
      setCategoryCustomImages((prev) => {
        const updated = { ...prev, [catId]: compressed };
        try { localStorage.setItem('sanatan_setu_category_images_v1', JSON.stringify(updated)); } catch {}
        return updated;
      });
      showToast(`Updated background image for ${catId}!`);
    }
  };

  // STRICT USER UPLOAD -> ADMIN PENDING QUEUE (unless Admin checks direct publish)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const primaryBody =
      uploadForm.bodyEnglish.trim() ||
      uploadForm.bodyHindi.trim() ||
      uploadForm.bodySanskrit.trim() ||
      uploadForm.bodyExtraLang.trim() ||
      (uploadForm.pdfUrl ? `PDF Scripture Document: ${uploadForm.title}` : '') ||
      (uploadForm.videoUrl ? `Sacred Video Presentation: ${uploadForm.title}` : '');

    if (!uploadForm.title.trim() || !uploadForm.description.trim() || !primaryBody) {
      showToast('Please enter Title, Short Description, and Content Body');
      return;
    }

    const slugId =
      uploadForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') +
      '-' +
      String(Date.now()).slice(-4);

    const catObj = CATEGORIES.find((c) => c.id === uploadForm.category) || CATEGORIES[0];
    const defaultCategoryPhoto = COPYRIGHT_FREE_CATEGORY_PHOTOS[uploadForm.category] || catObj.bgImage;
    const parsedTags = uploadForm.tags
      ? uploadForm.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [uploadForm.category.toLowerCase(), 'sacred-wisdom'];

    const approveNow = isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin;
    const nowIso = new Date().toISOString();

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
      contentType: uploadForm.pdfUrl && uploadForm.videoUrl ? 'All' : uploadForm.pdfUrl ? 'PDF' : uploadForm.videoUrl ? 'Video' : 'Text',
      views: 1,
      likes: 0,
      language: uploadForm.language || 'Sanskrit',
      author: uploadForm.author.trim() || 'Community Contributor',
      imageUrl: cleanExternalUrl(uploadForm.imageUrl) || defaultCategoryPhoto,
      pdfUrl: cleanExternalUrl(uploadForm.pdfUrl) || '#auto-pdf',
      pdfFileName: uploadForm.pdfFileName || '',
      videoUrl: cleanExternalUrl(uploadForm.videoUrl) || '',
      tags: parsedTags,
      isFeatured: false,
      isUserUploaded: true,
      isModified: true,
      status: approveNow ? 'approved' : 'pending',
      isApproved: approveNow,
      updatedAt: nowIso,
      submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: uploadForm.description.trim(),
      body: bodyMap
    };

    const updated = [newItem, ...items];
    setItems(updated);
    setIsUploadOpen(false);
    setUploadForm({
      title: '', description: '', category: 'Mantras', contentType: 'Text', author: '',
      language: 'Sanskrit', imageUrl: '', pdfUrl: '', pdfFileName: '', videoUrl: '',
      tags: '', bodyEnglish: '', bodyHindi: '', bodySanskrit: '', extraLang: 'Odia',
      bodyExtraLang: '', publishDirectlyAsAdmin: false
    });

    if (approveNow) {
      const ok = await pushGlobalSnapshot(updated);
      showToast(ok ? 'Admin Approved & Published Globally across all browsers!' : 'Published locally! Configure Vercel env vars to sync globally.');
    } else {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'submit', item: newItem })
      }).catch(() => {});
      showToast('Submitted! Content is now waiting in the Admin Pending Approval Queue.');
    }
  };

  // Admin Moderation Handlers (All persist locally AND sync globally to all browsers)
  const handleAdminLogin = (e) => {
    e.preventDefault();
    const entered = adminPasscodeInput.trim();
    const activePass = (customAdminPasscode || DEFAULT_ADMIN_PASSCODE).trim();
    if (entered && (entered === activePass || entered === DEFAULT_ADMIN_PASSCODE)) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch {}
      setAdminPasscodeInput('');
      fetchGlobalItems(false);
      showToast('Welcome, Admin! Content Moderation & Global Sync unlocked.');
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

  const handleApproveItem = async (id) => {
    const target = items.find((it) => it.id === id);
    if (!target) return;
    const nowIso = new Date().toISOString();
    let updated;
    if (target.isProposedEditFor) {
      const { isProposedEditFor, ...cleanFields } = target;
      const cleanTitle = String(cleanFields.title || '').replace(/^\[Edit Proposal\]\s*/i, '');
      updated = items
        .filter((it) => it.id !== id)
        .map((it) =>
          it.id === isProposedEditFor
            ? { ...it, ...cleanFields, id: isProposedEditFor, title: cleanTitle, status: 'approved', isApproved: true, isModified: true, updatedAt: nowIso }
            : it
        );
      try {
        const editsMap = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
        const approvedTarget = updated.find((u) => u.id === isProposedEditFor);
        if (approvedTarget) editsMap[isProposedEditFor] = approvedTarget;
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(editsMap));
      } catch (e) {}
    } else {
      updated = items.map((it) =>
        it.id === id ? { ...it, status: 'approved', isApproved: true, isModified: true, updatedAt: nowIso } : it
      );
    }
    setItems(updated);
    const ok = await pushGlobalSnapshot(updated);
    showToast(ok ? 'Approved & Published Globally across all browsers!' : 'Approved locally! Check Vercel env vars for global sync.');
  };

  const handleMoveToPending = async (id) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, status: 'pending', isApproved: false, isModified: true, updatedAt: new Date().toISOString() } : it
    );
    setItems(updated);
    await pushGlobalSnapshot(updated);
    showToast('Item moved to Pending Moderation Queue');
  };

  const handleToggleFeatured = async (id) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, isFeatured: !it.isFeatured, isModified: true, updatedAt: new Date().toISOString() } : it
    );
    setItems(updated);
    await pushGlobalSnapshot(updated);
    showToast('Updated Featured status globally!');
  };

  const handleDeleteItem = async (id) => {
    const nextDeleted = SEED_IDS_SET.has(String(id))
      ? Array.from(new Set([...deletedIds, String(id)]))
      : deletedIds;
    setDeletedIds(nextDeleted);
    try { localStorage.setItem('sanatan_setu_deleted_ids_v1', JSON.stringify(nextDeleted)); } catch (e) {}
    const updated = items.filter((it) => it.id !== id);
    setItems(updated);
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    await pushGlobalSnapshot(updated, nextDeleted);
    showToast('Item removed globally.');
  };

  // STRICT ADMIN-ONLY EDIT PUBLISHING: Admin updates go live globally; Visitor edits go to Pending Queue
  const handleSaveEditedItem = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const nowIso = new Date().toISOString();

    if (isAdminAuthenticated) {
      const cleanedEdit = {
        ...editingItem,
        imageUrl: cleanExternalUrl(editingItem.imageUrl),
        pdfUrl: cleanExternalUrl(editingItem.pdfUrl),
        videoUrl: cleanExternalUrl(editingItem.videoUrl),
        isModified: true,
        updatedAt: nowIso
      };
      try {
        const editsMap = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
        editsMap[String(cleanedEdit.id)] = cleanedEdit;
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(editsMap));
      } catch (err) {}

      const updated = items.map((it) => (it.id === cleanedEdit.id ? cleanedEdit : it));
      setItems(updated);
      if (selectedItem && selectedItem.id === cleanedEdit.id) {
        setSelectedItem(cleanedEdit);
      }
      setEditingItem(null);
      const ok = await pushGlobalSnapshot(updated);
      showToast(ok ? 'Admin edits saved & synced globally across ALL browsers!' : 'Admin edits saved locally! Check Vercel env vars for global sync.');
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
        isUserUploaded: true,
        isModified: true,
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
      showToast('Edit submitted to Admin Pending Approval Queue! Live content stays unchanged until Admin approves.');
    }
  };

  const handleRestoreDefaults = async () => {
    const customItems = items.filter((it) => !SEED_IDS_SET.has(String(it.id)));
    const restored = [...customItems, ...INITIAL_SACRED_ITEMS];
    setDeletedIds([]);
    try {
      localStorage.removeItem('sanatan_setu_deleted_ids_v1');
      localStorage.removeItem('sanatan_setu_edits_map_v1');
    } catch (e) {}
    setItems(restored);
    await pushGlobalSnapshot(restored, []);
    showToast('Restored all default Sacred Scriptures & images!');
  };

  const handleDownloadGlobalJson = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const payload = buildCompactGlobalPayload(items, deletedIds);
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sanatan-global-db.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded public/sanatan-global-db.json!');
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
      c1: '#431407', c2: '#9a3412', c3: '#ea580c', accent: '#fde047',
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
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1A12] text-amber-100 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 text-sm">
          <SacredLotusIcon className="w-4 h-4 text-amber-400 shrink-0" />
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
            '🪔 हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे · हरे राम हरे राम राम राम हरे हरे'
          ].map((chant, i) => (
            <span key={i} className="inline-flex items-center gap-2 tracking-wide text-amber-200/95">
              <SacredLotusIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
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

            <button
              onClick={() => setActiveView('admin')}
              title="Admin Moderation & Global Sync Portal"
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

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
                  <SacredLotusIcon className="w-4 h-4" />
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

                {/* Interactive Temple Experience Bar */}
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
                    <SacredLotusIcon className="w-4 h-4 text-[#EA580C]" />
                    <span>📿 Launch 108 Digital Mala</span>
                  </button>
                </div>

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

                <p className={`mt-4 text-sm sm:text-lg max-w-2xl mx-auto ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>
                  Read complete, admin-verified Hindu scriptures in English, Hindi &amp; Sanskrit, explore ancient temple histories, and practice your daily 108-bead Naam Jaap.
                </p>

                {/* Google-Style Smart Omnibox Search Bar */}
                <div className="mt-8 max-w-3xl mx-auto relative z-40 text-left">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleExecuteGoogleSearch();
                    }}
                    className={`relative flex items-center rounded-full border-2 transition-all duration-200 ${
                      isSearchFocused
                        ? 'border-[#EA580C] ring-4 ring-[#EA580C]/25 shadow-2xl'
                        : darkMode
                        ? 'border-amber-500/35 shadow-xl hover:border-amber-400/60'
                        : 'border-amber-900/20 shadow-xl hover:border-[#EA580C]/60'
                    } ${darkMode ? 'bg-[#1C120C] text-amber-50' : 'bg-white text-[#2C1A12]'}`}
                  >
                    <Search className="w-5 h-5 ml-5 text-[#EA580C] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 220)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedCategory('All');
                        setActiveSuggestionIdx(-1);
                        setIsSearchFocused(true);
                      }}
                      onKeyDown={(e) => {
                        const maxIdx = Math.min(7, googleSearchData.matchedItems.length) - 1;
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setActiveSuggestionIdx((prev) => (prev < maxIdx ? prev + 1 : 0));
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setActiveSuggestionIdx((prev) => (prev > 0 ? prev - 1 : maxIdx));
                        } else if (e.key === 'Escape') {
                          setIsSearchFocused(false);
                        }
                      }}
                      placeholder="Search Vedas, Hanuman Chalisa, Jagannath Puri, Gita 2.47, Gayatri Mantra..."
                      aria-label="Search sacred scriptures, temples, and mantras"
                      className={`w-full pl-3.5 pr-36 py-4 rounded-full bg-transparent focus:outline-none text-sm sm:text-base font-medium ${
                        darkMode ? 'placeholder:text-amber-300/45' : 'placeholder:text-[#78523A]/60'
                      }`}
                    />

                    <div className="absolute right-2 flex items-center gap-1.5">
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => { setSearchQuery(''); setActiveSuggestionIdx(-1); }}
                          className="px-2.5 py-1.5 rounded-lg bg-orange-500/15 text-xs font-bold text-[#EA580C] hover:bg-orange-500/25"
                        >
                          CLEAR
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleVoiceSearch}
                        title="Voice Search"
                        className={`p-2.5 rounded-full transition-all ${
                          isVoiceListening ? 'bg-red-600 text-white animate-pulse' : 'hover:bg-amber-500/15 text-[#EA580C]'
                        }`}
                      >
                        🎤
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#EA580C] to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Floating Autocomplete Dropdown */}
                  {isSearchFocused && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      className={`absolute left-0 right-0 top-full mt-2 rounded-3xl border-2 border-[#EA580C]/50 shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden z-50 max-h-[72vh] overflow-y-auto animate-fade-in-up ${
                        darkMode ? 'bg-[#1A100A] text-amber-50' : 'bg-white text-[#2C1A12]'
                      }`}
                    >
                      <div className={`px-5 py-2.5 border-b flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${
                        darkMode ? 'bg-[#24160E] border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-900/10 text-[#9A3412]'
                      }`}>
                        <span>
                          {searchQuery.trim()
                            ? `🔍 Instant Suggestions (${googleSearchData.totalCount} matches)`
                            : '🔥 Popular Sacred Searches & Instant Page Links'}
                        </span>
                        <button type="button" onClick={() => setIsSearchFocused(false)} className="text-xs font-extrabold text-[#EA580C] hover:underline">
                          Close ✕
                        </button>
                      </div>
                      <div className="p-3 space-y-2">
                        {!searchQuery.trim() && recentSearches.length > 0 && (
                          <div className="px-2 pb-2 border-b border-amber-500/15">
                            <div className="text-[11px] font-bold text-[#EA580C] mb-2">Recent &amp; Trending Searches:</div>
                            <div className="flex flex-wrap gap-2">
                              {recentSearches.map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => { setSearchQuery(term); handleExecuteGoogleSearch(term); }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all hover:border-[#EA580C] hover:bg-[#EA580C] hover:text-white ${
                                    darkMode ? 'bg-[#251810] border-amber-500/25 text-amber-200' : 'bg-amber-50/90 border-amber-900/15 text-[#2C1A12]'
                                  }`}
                                >
                                  <Search className="w-3 h-3" />
                                  <span>{term}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {googleSearchData.matchedItems.slice(0, 6).map((it, idx) => (
                          <div
                            key={it.id}
                            onClick={() => { saveRecentSearch(it.title); handleOpenItem(it); }}
                            className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                              idx === activeSuggestionIdx ? 'bg-[#EA580C]/20 border border-[#EA580C]' : darkMode ? 'hover:bg-amber-500/10' : 'hover:bg-amber-50'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={cleanExternalUrl(it.imageUrl) || fallbackArtworkForItem(it)}
                                alt={it.title}
                                onError={(e) => { e.target.onerror = null; e.target.src = fallbackArtworkForItem(it); }}
                                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-amber-500/30 bg-[#1C0F0A]"
                              />
                              <div className="min-w-0">
                                <div className="font-bold text-sm truncate">{it.title}</div>
                                <p className={`text-xs line-clamp-1 mt-0.5 ${darkMode ? 'text-amber-200/70' : 'text-[#78523A]'}`}>{it.description}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold shrink-0">Open ↗</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Stats Banner */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  <div className={`p-4 rounded-2xl border backdrop-blur ${darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'}`}>
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">12</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>Sacred Categories</div>
                  </div>
                  <div className={`p-4 rounded-2xl border backdrop-blur ${darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'}`}>
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">{approvedItems.length}</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>Verified Scriptures</div>
                  </div>
                  <div className={`p-4 rounded-2xl border backdrop-blur ${darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'}`}>
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">27 Languages</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>Indian &amp; World Scripts</div>
                  </div>
                  <div className={`p-4 rounded-2xl border backdrop-blur ${darkMode ? 'bg-[#1A110B]/90 border-amber-500/20' : 'bg-white/85 border-amber-900/10'}`}>
                    <div className="text-xl sm:text-2xl font-black text-[#EA580C]">100%</div>
                    <div className={`text-xs font-semibold ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>Admin-Verified Global</div>
                  </div>
                </div>

                {/* Daily Vedic Shloka of the Day Carousel */}
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
                        <SacredLotusIcon className="w-3 h-3" /> Shloka of the Day · आज का श्लोक
                      </span>
                      <span className={`text-xs font-bold ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>
                        {DAILY_SACRED_SHLOKAS[activeShlokaIndex].source}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleSpeech(`${DAILY_SACRED_SHLOKAS[activeShlokaIndex].sanskrit}. ${DAILY_SACRED_SHLOKAS[activeShlokaIndex].hindi}`, 'Hindi')}
                        className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-[#EA580C] text-[#EA580C] hover:text-white text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Chant Audio
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveShlokaIndex((prev) => (prev + 1) % DAILY_SACRED_SHLOKAS.length)}
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

            {/* Instant 108 Naam Jaap Counter Spotlight Banner */}
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
                    className="px-4 py-3.5 rounded-2xl bg-red-600/90 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel / New Jaap</span>
                  </button>
                  <a
                    href="#jaap"
                    onClick={(e) => { e.preventDefault(); setActiveView('jaap'); }}
                    className="px-4 py-3.5 rounded-2xl bg-black/35 hover:bg-black/50 text-white border border-amber-300/40 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5"
                  >
                    <span>Full Jaap Counter</span>
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* Browse by Category Section — Original Full 12 Big Visual Cards */}
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
                      <SacredImageFrame
                        src={categoryCustomImages[cat.id] || cat.bgImage}
                        fallbackSrc={cat.fallbackBgImage || cat.bgImage}
                        alt={`${cat.name} (${cat.sanskrit}) category background`}
                        mode={imageFitMode}
                        className="absolute inset-0 w-full h-full"
                        imgClassName="group-hover:scale-105"
                      />
                      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/95 via-black/55 to-black/25 group-hover:via-black/45 transition-all pointer-events-none" />

                      <div className="relative z-10 flex justify-between items-center w-full">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-[#1C0D06] font-black text-xs tracking-wider shadow">
                          {cat.code}
                        </span>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <label
                            title="Upload custom background photo"
                            className="px-2 py-1 rounded-lg bg-black/70 hover:bg-[#EA580C] text-amber-200 hover:text-white border border-amber-400/30 text-[10px] font-bold cursor-pointer transition-all"
                          >
                            📷 Photo
                            <input type="file" accept="image/*" onChange={(e) => handleCategoryImageUpload(cat.id, e)} className="hidden" />
                          </label>
                          <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm text-amber-200 border border-amber-400/30 text-xs font-semibold">
                            {count} {count === 1 ? 'Item' : 'Items'}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">{cat.name}</h3>
                          <span className="text-sm font-serif text-amber-300 font-semibold">{cat.sanskrit}</span>
                        </div>
                        <p className="text-xs text-amber-100/90 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                        <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-amber-300 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                            View {count} {count === 1 ? 'Scripture' : 'Scriptures'} <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          {catItems.length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleOpenItem(catItems[0]); }}
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
            </section>

            {/* Filter & Sacred Library Items Grid */}
            <section id="library-items-section" aria-labelledby="library-items-heading" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div
                className={`p-4 sm:p-5 rounded-2xl border mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
                  darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-amber-50/70 border-amber-900/10'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 id="library-items-heading" className="text-xl sm:text-2xl font-extrabold">
                      {selectedCategory === 'All' ? 'All Sacred Knowledge' : `${selectedCategory} Collection`}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EA580C]/15 text-[#EA580C] text-xs font-bold">
                      {filteredItems.length} / {approvedItems.length} Entries
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                    Admin-approved scriptures synced globally across all browsers &amp; devices
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                  <div className="flex items-center gap-1 rounded-xl p-1 bg-amber-500/10 border border-amber-500/20">
                    {['All', 'Text', 'PDF', 'Video'].map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setSelectedMediaFormat(fmt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          selectedMediaFormat === fmt ? 'bg-[#EA580C] text-white shadow' : darkMode ? 'text-amber-200/80' : 'text-[#78523A]'
                        }`}
                      >
                        {fmt === 'All' ? 'All Formats' : fmt}
                      </button>
                    ))}
                  </div>

                  <select
                    value={selectedLanguageFilter}
                    onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25 text-amber-100' : 'bg-white border-amber-900/15 text-[#2C1A12]'
                    }`}
                  >
                    <option value="All">🌐 All 27 Languages (Indian &amp; World)</option>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setShowBookmarksOnly((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                      showBookmarksOnly ? 'bg-[#EA580C] text-white border-[#EA580C]' : darkMode ? 'bg-[#22160F] text-amber-200 border-amber-500/25' : 'bg-white text-[#78523A] border-amber-900/15'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved ({bookmarkedIds.length})</span>
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none ${
                      darkMode ? 'bg-[#22160F] border-amber-500/25 text-amber-100' : 'bg-white border-amber-900/15 text-[#2C1A12]'
                    }`}
                  >
                    <option value="featured">Featured First</option>
                    <option value="popular">Most Viewed</option>
                    <option value="likes">Most Liked</option>
                  </select>
                </div>
              </div>

              <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedCategory === 'All' ? 'bg-[#EA580C] text-white shadow-md' : darkMode ? 'bg-[#18100B] border border-amber-500/25 text-amber-200' : 'bg-white border border-amber-900/15 text-[#78523A]'
                  }`}
                >
                  All Content ({approvedItems.length})
                </button>
                {CATEGORIES.map((cat) => {
                  const catCount = approvedItems.filter((i) => i.category === cat.id).length;
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(active ? 'All' : cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                        active ? 'bg-[#EA580C] text-white shadow-md' : darkMode ? 'bg-[#18100B] border border-amber-500/20 text-amber-200/85' : 'bg-white border border-amber-900/15 text-[#78523A]'
                      }`}
                    >
                      {cat.name} ({catCount})
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  const isBookmarked = bookmarkedIds.includes(item.id);
                  const activeCardLang = selectedLanguageFilter !== 'All' ? selectedLanguageFilter : 'English';
                  const englishBody = getBodyForLanguage(item, activeCardLang);
                  return (
                    <article
                      key={item.id}
                      onClick={() => handleOpenItem(item)}
                      className={`rounded-2xl border overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col group animate-fade-in-up ${
                        darkMode ? 'bg-[#18100B] border-amber-500/20 hover:border-amber-400/60' : 'bg-white border-amber-900/10 hover:border-amber-400'
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
                              <SacredLotusIcon className="w-3 h-3" /> Featured
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
                          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur transition-all ${
                            isBookmarked ? 'bg-[#EA580C] text-white' : 'bg-black/50 text-white hover:bg-black/75'
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
                          <h3 className={`font-bold text-lg group-hover:text-[#EA580C] transition-colors line-clamp-2 ${darkMode ? 'text-amber-50' : 'text-[#2C1A12]'}`}>
                            {item.title}
                          </h3>
                          <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {(item.tags || []).slice(0, 3).map((tag, idx) => (
                              <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${darkMode ? 'bg-amber-500/10 text-amber-300' : 'bg-amber-100/80 text-[#9A3412]'}`}>
                                #{tag}
                              </span>
                            ))}
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${darkMode ? 'bg-emerald-500/15 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                              EN · हिं · सं ({Math.max(1, Math.ceil(englishBody.split(/\s+/).length / 180))} min read)
                            </span>
                          </div>

                          <div className={`pt-3 border-t flex items-center justify-between text-xs ${darkMode ? 'border-amber-500/15 text-amber-300/75' : 'border-amber-900/10 text-[#78523A]'}`}>
                            <div className="flex items-center gap-2.5">
                              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {(item.views || 0).toLocaleString()}</span>
                              <button onClick={(e) => toggleLike(item.id, e)} className={`flex items-center gap-1 hover:text-[#EA580C] ${isLiked ? 'text-red-500 font-bold' : ''}`}>
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                <span>{item.likes || 0}</span>
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setEditingItem(item); }}
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
            </section>

            {/* SEO FAQ Hub */}
            <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`rounded-3xl p-6 sm:p-8 border space-y-6 ${darkMode ? 'bg-[#160F0A] border-amber-500/20' : 'bg-amber-50/60 border-amber-900/10'}`}>
                <h2 className="text-xl sm:text-2xl font-extrabold">108 Naam Jaap Counter – Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {NAAM_JAAP_SEO_FAQS.map((faq, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#1F140E] border-amber-500/15' : 'bg-white border-amber-900/10'}`}>
                      <h3 className="font-bold text-sm text-[#EA580C]">{faq.q}</h3>
                      <p className={`text-xs mt-1.5 leading-relaxed ${darkMode ? 'text-amber-100/85' : 'text-[#78523A]'}`}>{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 108-Bead Naam Jaap Counter View */}
        {activeView === 'jaap' && (
          <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => { setActiveView('home'); if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-4 py-2.5 rounded-2xl border-2 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all ${
                  darkMode ? 'bg-[#22160F] border-amber-500/40 text-amber-200 hover:bg-[#EA580C] hover:text-white' : 'bg-white border-amber-900/20 text-[#2C1A12] hover:bg-[#EA580C] hover:text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Sacred Library (Home)</span>
              </button>
              <span className={`text-xs font-bold ${darkMode ? 'text-amber-300/80' : 'text-[#78523A]'}`}>🕉️ Sanatan Setu · 108-Bead Digital Mala Sanctuary</span>
            </div>

            <div className="bg-gradient-to-r from-amber-800 via-orange-600 to-amber-900 rounded-3xl p-6 text-white shadow-xl mb-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Current Mala Bead</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-100 mt-1">
                  {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} <span className="text-base font-normal text-amber-300">/ 108</span>
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Completed Malas</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-100 mt-1">{Math.floor(currentCount / 108)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Dhyana Time</div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">{formatDuration(meditationSeconds)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-amber-200">Lifetime Chants</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-300 mt-1">{lifetimeCount.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div className={`rounded-3xl p-6 border shadow-sm ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <SacredLotusIcon className="w-5 h-5 text-orange-500" />
                    <span>Select Sacred Mantra</span>
                  </h2>
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {JAAP_MANTRAS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setIsCustomMantra(false); setSelectedMantraId(m.id); }}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                          !isCustomMantra && selectedMantraId === m.id
                            ? darkMode ? 'bg-amber-500/20 border-[#EA580C]' : 'bg-amber-50 border-[#EA580C]'
                            : darkMode ? 'bg-[#22160F] border-amber-500/15' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <div className="font-bold text-sm">{m.name}</div>
                        <p className={`text-xs font-serif mt-1 line-clamp-1 ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>{m.sanskrit}</p>
                      </button>
                    ))}
                  </div>
                  <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-amber-500/20' : 'border-amber-900/10'}`}>
                    <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1.5">Or Enter Custom Mantra</label>
                    <input
                      type="text"
                      value={customMantraText}
                      onChange={(e) => { setCustomMantraText(e.target.value); setIsCustomMantra(true); }}
                      placeholder="e.g. ॐ नमो नारायणाय / श्री राधा"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`}
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <div className={`rounded-3xl p-8 border shadow-lg w-full text-center relative overflow-hidden ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                  <span className="text-xs font-bold text-[#EA580C] uppercase tracking-widest">{activeMantra.deity}</span>
                  <h2 className="text-2xl font-black mt-1">{activeMantra.name}</h2>
                  <p className={`font-serif text-lg mt-2 font-medium px-4 ${darkMode ? 'text-amber-300' : 'text-[#9A3412]'}`}>&ldquo;{activeMantra.sanskrit}&rdquo;</p>

                  <div className="my-6 flex justify-center relative items-center">
                    <svg viewBox="0 0 340 340" className="w-80 h-80 sm:w-96 sm:h-96 absolute pointer-events-none">
                      <circle cx="170" cy="170" r="154" fill="none" stroke="#f59e0b" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 6" />
                      {Array.from({ length: 27 }).map((_, idx) => {
                        const angle = (idx / 27) * 2 * Math.PI - Math.PI / 2;
                        const cx = 170 + 154 * Math.cos(angle);
                        const cy = 170 + 154 * Math.sin(angle);
                        const activeBeadIndex = Math.floor(((currentCount % 108) / 108) * 27);
                        const isLit = (currentCount % 108) > 0 && idx <= activeBeadIndex;
                        return <circle key={idx} cx={cx} cy={cy} r={idx === 0 ? 8 : 5.5} fill={isLit ? '#fbbf24' : idx === 0 ? '#ea580c' : '#78350f'} stroke="#fef08a" strokeWidth="1.5" />;
                      })}
                    </svg>
                    {chantParticles.map((pt) => (
                      <span key={pt.id} style={{ left: `calc(50% + ${pt.offset}px)` }} className="animate-chant-particle pointer-events-none absolute top-16 z-20 text-lg font-black text-amber-200">+1 ॐ</span>
                    ))}
                    <button
                      onClick={handleIncrementJaap}
                      className={`w-60 h-60 rounded-full bg-gradient-to-br from-[#EA580C] via-amber-600 to-amber-800 text-white shadow-2xl flex flex-col items-center justify-center transition-all active:scale-95 border-8 border-amber-300/60 relative z-10 animate-pulse-glow ${pulseEffect ? 'scale-105' : ''}`}
                    >
                      <div className="text-xs font-bold uppercase tracking-widest text-amber-200 mb-1">TAP BEAD TO CHANT</div>
                      <div className="text-5xl sm:text-6xl font-black">{currentCount}</div>
                      <div className="text-xs font-semibold text-amber-100 mt-2">Bead {currentCount % 108 === 0 && currentCount > 0 ? 108 : currentCount % 108} of 108</div>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                    <button onClick={() => setAutoJaapActive(!autoJaapActive)} className="px-5 py-3 rounded-2xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-2">
                      {autoJaapActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{autoJaapActive ? 'Pause Auto-Chanting' : 'Start Hands-Free Auto Jaap'}</span>
                    </button>
                    <button onClick={handleResetJaap} className="px-5 py-3 rounded-2xl bg-red-600 text-white text-xs font-bold flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      <span>Cancel Old Jaap &amp; Start New</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Content Moderation & Global Cross-Browser Sync Portal */}
        {activeView === 'admin' && (
          <div className="py-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-[#EA580C] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" /> Content Authenticity &amp; Global Sync
                </span>
                <h1 className="text-2xl sm:text-4xl font-black">Admin Approval Dashboard</h1>
                <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-amber-200/75' : 'text-[#78523A]'}`}>
                  Approve visitor uploads &amp; edit proposals and sync every update globally across all browsers &amp; devices.
                </p>
              </div>
              {isAdminAuthenticated && (
                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => fetchGlobalItems(true)} className="px-3.5 py-2.5 rounded-xl bg-emerald-600/20 text-emerald-500 text-xs font-bold">
                    🔄 Refresh Queue
                  </button>
                  <button onClick={() => setIsUploadOpen(true)} className="px-4 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1.5 shadow">
                    <Plus className="w-4 h-4" /> Add Verified Scripture
                  </button>
                  <button onClick={handleRestoreDefaults} className="px-3.5 py-2.5 rounded-xl border border-amber-500/30 text-xs font-bold">
                    Restore Defaults
                  </button>
                  <button onClick={handleAdminLogout} className="px-3.5 py-2.5 rounded-xl bg-red-500/15 text-red-500 text-xs font-bold">
                    Logout
                  </button>
                </div>
              )}
            </div>

            {!isAdminAuthenticated ? (
              <div className={`max-w-md mx-auto rounded-3xl p-8 border shadow-xl text-center ${darkMode ? 'bg-[#18100B] border-amber-500/25' : 'bg-white border-amber-900/15'}`}>
                <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-[#EA580C] flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black">Admin Authentication Required</h2>
                <p className={`text-xs mt-1 mb-6 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                  Only the site administrator can approve uploaded scriptures or publish global edits.
                </p>
                <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                  <input
                    type="password"
                    value={adminPasscodeInput}
                    onChange={(e) => setAdminPasscodeInput(e.target.value)}
                    placeholder="Enter your secret Admin password"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#EA580C] ${darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'}`}
                  />
                  <button type="submit" className="w-full py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    Unlock Admin Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Admin Navigation Tabs (Now includes Green 🌍 Global Cross-Browser Sync tab!) */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-amber-500/20 pb-4">
                  <button
                    onClick={() => setAdminTab('pending')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${adminTab === 'pending' ? 'bg-[#EA580C] text-white shadow' : darkMode ? 'bg-[#18100B] text-amber-200' : 'bg-white text-[#78523A]'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Pending Approval Queue ({pendingItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('published')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${adminTab === 'published' ? 'bg-[#EA580C] text-white shadow' : darkMode ? 'bg-[#18100B] text-amber-200' : 'bg-white text-[#78523A]'}`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published Authentic Content ({approvedItems.length})</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('sync')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${adminTab === 'sync' ? 'bg-emerald-600 text-white shadow' : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'}`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌍 Global Cross-Browser Sync</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('seo')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 ${adminTab === 'seo' ? 'bg-[#EA580C] text-white shadow' : darkMode ? 'bg-[#18100B] text-amber-200' : 'bg-white text-[#78523A]'}`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>SEO Status &amp; Password</span>
                  </button>
                </div>

                {/* Tab 1: Pending Approval Queue */}
                {adminTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingItems.length === 0 ? (
                      <div className={`rounded-3xl p-10 text-center border ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold">All Uploaded Content Reviewed!</h3>
                        <p className={`text-xs mt-1 max-w-md mx-auto ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                          Any visitor upload or edit proposal waits right here until you click Approve &amp; Publish.
                        </p>
                      </div>
                    ) : (
                      pendingItems.map((item) => (
                        <div key={item.id} className={`rounded-2xl p-6 border shadow-md flex flex-col lg:flex-row gap-6 justify-between ${darkMode ? 'bg-[#18100B] border-amber-500/30' : 'bg-white border-amber-300'}`}>
                          <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <img
                              src={item.imageUrl || fallbackArtworkForItem(item)}
                              alt={item.title}
                              className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0"
                            />
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-bold">
                                  {item.isProposedEditFor ? '📝 PENDING EDIT PROPOSAL' : 'PENDING ADMIN APPROVAL'}
                                </span>
                                <span className="text-xs font-bold text-[#EA580C]">{item.category}</span>
                                <span className="text-xs opacity-70">By: {item.author || 'Contributor'}</span>
                              </div>
                              <h3 className="text-lg font-extrabold">{item.title}</h3>
                              <p className={`text-xs ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>{item.description}</p>
                            </div>
                          </div>
                          <div className="flex sm:flex-row lg:flex-col justify-end gap-2.5 shrink-0">
                            <button onClick={() => handleApproveItem(item.id)} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow">
                              <Check className="w-4 h-4" /> Approve &amp; Publish Globally
                            </button>
                            <button onClick={() => setEditingItem(item)} className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5">
                              <Edit3 className="w-4 h-4" /> Edit Content
                            </button>
                            <button onClick={() => handleDeleteItem(item.id)} className="px-4 py-2.5 rounded-xl bg-red-600/15 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5">
                              <Trash2 className="w-4 h-4" /> Reject &amp; Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab 2: Published Authentic Content */}
                {adminTab === 'published' && (
                  <div className="space-y-3">
                    {approvedItems.map((item) => (
                      <div key={item.id} className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                        <div className="flex items-center gap-3.5">
                          <img src={item.imageUrl || fallbackArtworkForItem(item)} alt={item.title} className="w-16 h-14 rounded-xl object-cover shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-[#EA580C]">{item.category}</span>
                            <h4 className="font-bold text-sm sm:text-base">{item.title}</h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button onClick={() => handleToggleFeatured(item.id)} className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-bold">{item.isFeatured ? 'Unfeature' : 'Feature'}</button>
                          <button onClick={() => setEditingItem(item)} className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-bold">Edit</button>
                          <button onClick={() => handleMoveToPending(item.id)} className="px-3 py-1.5 rounded-lg bg-orange-500/15 text-orange-400 text-xs font-bold">Unpublish</button>
                          <button onClick={() => handleDeleteItem(item.id)} className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-500 text-xs font-bold">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tab 3: 🌍 Global Cross-Browser Sync */}
                {adminTab === 'sync' && (
                  <div className={`rounded-3xl p-6 sm:p-8 border space-y-5 ${darkMode ? 'bg-[#18100B] border-emerald-500/30' : 'bg-white border-emerald-600/25'}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-lg font-extrabold text-emerald-500 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        <span>🌍 Global Cross-Browser Sync Engine (/api/sync → GitHub)</span>
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-500 text-xs font-bold">
                        Status: {globalSyncStatus === 'synced' ? `Connected${lastGlobalSyncTime ? ` (${lastGlobalSyncTime})` : ''}` : globalSyncStatus}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>
                      Every Admin approval, cover photo update, YouTube video link change, or text edit automatically posts to <code>/api/sync</code> and updates <code>public/sanatan-global-db.json</code> on GitHub, so visitors on any browser or phone immediately see your latest changes.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={async () => {
                          const ok = await pushGlobalSnapshot(items);
                          showToast(ok ? '🚀 All current edits & uploads pushed globally!' : 'Sync failed — check GITHUB_TOKEN & ADMIN_PASSWORD in Vercel.');
                        }}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow"
                      >
                        🚀 Push All Current Edits &amp; Uploads Globally Now
                      </button>
                      <button
                        onClick={handleDownloadGlobalJson}
                        className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow"
                      >
                        ⬇️ Download public/sanatan-global-db.json
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 4: SEO & Admin Password */}
                {adminTab === 'seo' && (
                  <div className={`rounded-3xl p-6 sm:p-8 border space-y-6 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleCopyText(SEO_INDEX_HTML_TEMPLATE, 'Copied index.html!')} className="px-3.5 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold">Copy index.html</button>
                      <button onClick={() => handleCopyText(generatedSitemapXml, 'Copied sitemap.xml!')} className="px-3.5 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold">Copy sitemap.xml</button>
                      <button onClick={() => handleCopyText(generatedRobotsTxt, 'Copied robots.txt!')} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Copy robots.txt</button>
                    </div>
                    <form onSubmit={handleUpdateAdminPasscode} className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="password"
                        value={newPasscodeInput}
                        onChange={(e) => setNewPasscodeInput(e.target.value)}
                        placeholder="Enter new Admin password (min 4 chars)"
                        className={`flex-1 px-4 py-2.5 rounded-xl border text-xs ${darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-white border-amber-900/20'}`}
                      />
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold">Update Password</button>
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
            <button onClick={() => setActiveView('home')} className="mb-6 px-4 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Sacred Library
            </button>
            <div className={`rounded-3xl p-8 border shadow-lg space-y-4 ${darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'}`}>
              {activeView === 'about' && (
                <>
                  <h1 className="text-3xl font-black">About Sanatan Setu Library</h1>
                  <p className="text-sm leading-relaxed">Sanatan Setu Library preserves and shares authentic, Admin-verified Hindu scriptures in 27 Indian and World languages.</p>
                </>
              )}
              {activeView === 'contact' && (
                <>
                  <h1 className="text-3xl font-black">Contact &amp; Seva Inquiries</h1>
                  <form onSubmit={(e) => { e.preventDefault(); showToast('Message received!'); setContactForm({ name: '', email: '', subject: '', message: '' }); }} className="space-y-4">
                    <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} placeholder="Your Name" className={`w-full px-4 py-3 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'}`} />
                    <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} placeholder="Your Email" className={`w-full px-4 py-3 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'}`} />
                    <textarea rows={4} required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} placeholder="Message..." className={`w-full px-4 py-3 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-amber-50/40 border-amber-900/15'}`} />
                    <button type="submit" className="px-6 py-3 rounded-xl bg-[#EA580C] text-white text-xs font-bold uppercase">Send Message</button>
                  </form>
                </>
              )}
              {activeView === 'privacy' && (
                <>
                  <h1 className="text-3xl font-black">Privacy Policy</h1>
                  <p className="text-sm leading-relaxed">Your personal Naam Jaap counts, bookmarks, and theme settings stay privately in your browser.</p>
                </>
              )}
              {activeView === 'disclaimer' && (
                <>
                  <h1 className="text-3xl font-black">Scriptural Disclaimer</h1>
                  <p className="text-sm leading-relaxed">All Vedic mantras, stotrams, and commentaries are shared respectfully for spiritual study and cultural preservation.</p>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Sacred Item Detail Reader Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={handleCloseItem}>
          <article onClick={(e) => e.stopPropagation()} className={`rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border shadow-2xl relative ${darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'}`}>
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button type="button" onClick={handleCloseItem} className="px-3.5 py-2 rounded-full bg-black/75 hover:bg-[#EA580C] text-white text-xs font-extrabold flex items-center gap-1.5 border border-white/20 shadow-lg">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button onClick={handleCloseItem} className="p-2.5 rounded-full bg-black/65 hover:bg-black text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-72 sm:h-96 relative bg-[#120A06]">
              <SacredImageFrame src={selectedItem.imageUrl || fallbackArtworkForItem(selectedItem)} fallbackSrc={selectedItem.fallbackImageUrl || fallbackArtworkForItem(selectedItem)} alt={selectedItem.title} mode={imageFitMode} className="w-full h-full" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/95 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-[#EA580C] text-xs font-bold uppercase">{selectedItem.sanskritBadge || selectedItem.category}</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600/90 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Admin Verified</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">{selectedItem.title}</h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${darkMode ? 'border-amber-500/20' : 'border-amber-900/10'}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  {['English', 'Hindi', 'Sanskrit', 'Odia', 'Tamil', 'Bengali'].map((l) => (
                    <button key={l} onClick={() => setDetailLang(l)} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${detailLang === l ? 'bg-[#EA580C] text-white' : darkMode ? 'bg-amber-500/15 text-amber-200' : 'bg-amber-100 text-[#78523A]'}`}>
                      {l}
                    </button>
                  ))}
                  <select value={detailLang} onChange={(e) => setDetailLang(e.target.value)} className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-100' : 'bg-amber-50 border-amber-900/20'}`}>
                    {SUPPORTED_LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button onClick={() => handleToggleSpeech(getBodyForLanguage(selectedItem, detailLang), detailLang)} className="px-3 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold flex items-center gap-1.5">
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
                  </button>
                  <button onClick={() => setReaderFontSize((p) => (p === 'base' ? 'lg' : p === 'lg' ? 'xl' : 'base'))} className="px-3 py-2 rounded-xl bg-amber-500/15 text-[#EA580C] text-xs font-bold">Aa</button>
                  <button onClick={() => openSacredPrintablePdf(selectedItem, detailLang)} className="px-3 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-1"><FileText className="w-4 h-4" /> PDF</button>
                  <button onClick={() => setEditingItem(selectedItem)} className="px-3 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold flex items-center gap-1"><Edit3 className="w-4 h-4" /> Edit</button>
                </div>
              </div>

              <SacredVideoPlayer item={selectedItem} darkMode={darkMode} lang={detailLang} />

              <div className={`max-w-none leading-relaxed whitespace-pre-line ${readerFontSize === 'xl' ? 'text-xl' : readerFontSize === 'lg' ? 'text-lg' : 'text-base'}`}>
                {getBodyForLanguage(selectedItem, detailLang)}
              </div>
            </div>
          </article>
        </div>
      )}

      {/* Upload Sacred Knowledge Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 border shadow-2xl relative max-h-[92vh] overflow-y-auto ${darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'}`}>
            <button onClick={() => setIsUploadOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/20">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs font-bold text-[#EA580C] uppercase mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin-Moderated Submission</span>
            </div>
            <h2 className="text-2xl font-black mb-1">Upload Sacred Content</h2>
            <p className={`text-xs mb-5 ${darkMode ? 'text-amber-300/75' : 'text-[#78523A]'}`}>
              Any user can upload content. Submissions enter the Admin Pending Approval Queue and appear globally once Admin approves them.
            </p>
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" required value={uploadForm.title} onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })} placeholder="Title *" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <input type="text" value={uploadForm.author} onChange={(e) => setUploadForm({ ...uploadForm, author: e.target.value })} placeholder="Source / Author" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.sanskrit})</option>)}
                </select>
                <select value={uploadForm.language} onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value })} className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`}>
                  {SUPPORTED_LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <input type="text" required value={uploadForm.description} onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })} placeholder="Short summary *" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" value={uploadForm.imageUrl.startsWith('data:') ? '' : uploadForm.imageUrl} onChange={(e) => setUploadForm({ ...uploadForm, imageUrl: e.target.value })} placeholder="Cover Image URL (optional)" className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, false)} className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EA580C] file:text-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input type="text" value={uploadForm.videoUrl} onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })} placeholder="YouTube Video Link (e.g. https://youtu.be/...)" className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                  {uploadForm.videoUrl.trim() && (
                    <div className={`text-[11px] font-bold ${extractYouTubeId(uploadForm.videoUrl) ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {extractYouTubeId(uploadForm.videoUrl) ? `✓ YouTube video ready (ID: ${extractYouTubeId(uploadForm.videoUrl)})` : '⚠️ Paste a valid YouTube link (youtube.com/watch?v=... or youtu.be/...)'}
                    </div>
                  )}
                </div>
                <input type="file" accept="application/pdf,.pdf" onChange={(e) => handlePdfFileChange(e, false)} className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white" />
              </div>
              <textarea rows={4} value={uploadForm.bodyEnglish} onChange={(e) => setUploadForm({ ...uploadForm, bodyEnglish: e.target.value })} placeholder="Full English content & meaning *" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea rows={3} value={uploadForm.bodyHindi} onChange={(e) => setUploadForm({ ...uploadForm, bodyHindi: e.target.value })} placeholder="Hindi text (हिन्दी)" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <textarea rows={3} value={uploadForm.bodySanskrit} onChange={(e) => setUploadForm({ ...uploadForm, bodySanskrit: e.target.value })} placeholder="Sanskrit verses (संस्कृतम्)" className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              </div>
              {isAdminAuthenticated && (
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 cursor-pointer">
                  <input type="checkbox" checked={uploadForm.publishDirectlyAsAdmin} onChange={(e) => setUploadForm({ ...uploadForm, publishDirectlyAsAdmin: e.target.checked })} />
                  <span>Admin Override: Approve &amp; publish globally right now</span>
                </label>
              )}
              <div className="pt-3 flex justify-end gap-3">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="px-5 py-2.5 rounded-xl border border-amber-500/30 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold shadow">
                  {isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin ? 'Approve & Publish Globally' : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sacred Content Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-2xl w-full p-6 sm:p-8 border shadow-2xl relative max-h-[92vh] overflow-y-auto ${darkMode ? 'bg-[#18100B] border-amber-500/30 text-amber-50' : 'bg-[#FFFBEB] border-amber-900/20 text-[#2C1A12]'}`}>
            <button onClick={() => setEditingItem(null)} className="absolute top-4 right-4 p-2 rounded-full bg-amber-500/20">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-1">Edit Sacred Content &amp; Media</h2>
            <p className={`text-xs mb-4 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
              {isAdminAuthenticated
                ? 'Logged in as Admin: Saving will update this cover image, video, and text globally across ALL browsers.'
                : 'Visitor Mode: Proposed edits are sent to the Admin Pending Queue until Admin approves them.'}
            </p>
            <form onSubmit={handleSaveEditedItem} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="text" required value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`}>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <input type="text" required value={editingItem.description} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <input type="text" value={editingItem.imageUrl?.startsWith('data:') ? '' : editingItem.imageUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })} placeholder="Cover Image URL" className={`w-full px-3 py-2 rounded-xl border text-xs ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <input type="file" accept="image/*" onChange={(e) => handleImageFileChange(e, true)} className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EA580C] file:text-white" />
              </div>
              <div className="space-y-1">
                <input type="text" value={editingItem.videoUrl || ''} onChange={(e) => setEditingItem({ ...editingItem, videoUrl: e.target.value })} placeholder="YouTube Video Link (e.g. https://youtu.be/...)" className={`w-full px-3.5 py-2 rounded-xl border text-xs ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                {editingItem.videoUrl && editingItem.videoUrl.trim() && (
                  <div className={`text-[11px] font-bold ${extractYouTubeId(editingItem.videoUrl) ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {extractYouTubeId(editingItem.videoUrl) ? `✓ YouTube video ready (ID: ${extractYouTubeId(editingItem.videoUrl)})` : '⚠️ Paste a valid YouTube link (youtube.com/watch?v=... or youtu.be/...)'}
                  </div>
                )}
              </div>
              <textarea rows={4} value={typeof editingItem.body === 'object' ? editingItem.body.English || '' : editingItem.body || ''} onChange={(e) => setEditingItem({ ...editingItem, body: { ...(typeof editingItem.body === 'object' ? editingItem.body : {}), English: e.target.value } })} className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <textarea rows={3} value={typeof editingItem.body === 'object' ? editingItem.body.Hindi || '' : ''} onChange={(e) => setEditingItem({ ...editingItem, body: { ...(typeof editingItem.body === 'object' ? editingItem.body : {}), Hindi: e.target.value } })} placeholder="Hindi Body" className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
                <textarea rows={3} value={typeof editingItem.body === 'object' ? editingItem.body.Sanskrit || '' : ''} onChange={(e) => setEditingItem({ ...editingItem, body: { ...(typeof editingItem.body === 'object' ? editingItem.body : {}), Sanskrit: e.target.value } })} placeholder="Sanskrit Body" className={`w-full px-3.5 py-2 rounded-xl border text-sm ${darkMode ? 'bg-[#22160F] border-amber-500/25' : 'bg-white border-amber-900/20'}`} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#EA580C] text-white text-xs font-bold shadow">
                  {isAdminAuthenticated ? 'Save & Sync Globally' : 'Submit Edit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Semantic Footer */}
      <footer role="contentinfo" className="bg-[#1C0F0A] text-amber-100/90 mt-16 border-t border-amber-500/20 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <SanatanSetuLogo size={38} />
            <div>
              <div className="font-bold text-sm text-white">Sanatan Setu Library</div>
              <p className="text-amber-300/70">© 2026 Sanatan Setu Library · Authentic Admin-Moderated Vedic Scripture Archive</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 font-semibold">
            <button onClick={() => setActiveView('home')} className="hover:text-amber-300">Library</button>
            <button onClick={() => setActiveView('jaap')} className="hover:text-amber-300">108 Naam Jaap</button>
            <button onClick={() => setActiveView('admin')} className="hover:text-amber-300">Admin Approval ({pendingItems.length})</button>
            <button onClick={() => setActiveView('about')} className="hover:text-amber-300">About Us</button>
            <button onClick={() => setActiveView('contact')} className="hover:text-amber-300">Contact</button>
            <button onClick={() => setActiveView('privacy')} className="hover:text-amber-300">Privacy Policy</button>
            <button onClick={() => setActiveView('disclaimer')} className="hover:text-amber-300">Disclaimer</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
