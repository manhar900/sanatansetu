import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Award, Clock, Sun, Moon,
  ShieldCheck, CheckCircle2, XCircle, Edit3, Trash2,
  Share2, Copy, Globe, Lock, Unlock, Plus, ChevronRight,
  Check, AlertCircle, FileText
} from 'lucide-react';

// Robust safety guard against "ReferenceError: tailwind is not defined" in sandboxed compiler previews
if (typeof globalThis !== 'undefined' && typeof globalThis.tailwind === 'undefined') {
  globalThis.tailwind = { config: { darkMode: 'class', theme: { extend: {} } } };
}
if (typeof window !== 'undefined' && typeof window.tailwind === 'undefined') {
  window.tailwind = globalThis.tailwind;
}
if (typeof document !== 'undefined' && typeof document.tailwind === 'undefined') {
  document.tailwind = globalThis.tailwind;
}

// Change your default Admin Password here (or set VITE_ADMIN_PASSWORD in Vercel Environment Variables)
export const DEFAULT_ADMIN_PASSCODE = 'admin108';

// Traditional Handcrafted Vedic 8-Petal Lotus (Padma) Emblem — Zero AI Symbols
// ... existing code ...
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
