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
export const DEFAULT_ADMIN_PASSCODE = 'admin108';

// Global Cloud & GitHub Repository Configuration (Enables cross-browser, worldwide sync for Admin edits & uploads)
export const GLOBAL_SYNC_DEFAULT_REPO = 'manhar900/sanatansetu';
export const GLOBAL_SYNC_DEFAULT_BRANCH = 'main';
export const GLOBAL_SYNC_FILE_PATH = 'public/sanatan-global-db.json';

// Traditional Handcrafted Vedic 8-Petal Lotus (Padma) Emblem — Zero AI Symbols
export const SacredLotusIcon = ({ className = 'w-4 h-4' }) => (
// ... existing code ...
//Compresses uploaded cover images so they save instantaneously in both localStorage, IndexedDB, and Global Cloud Sync
export function compressCoverImageFile(file, maxWidth = 1000, quality = 0.82) {
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

// Helper for UTF-8 safe Base64 encoding/decoding for GitHub REST API commits
export function encodeUtf8Base64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// Verified Copyright-Free (CC / Public Domain) Wikimedia Commons Photographs for Categories & Sacred Items
export const COPYRIGHT_FREE_CATEGORY_PHOTOS = {
// ... existing code ...
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'published' | 'cloud' | 'seo'
  const [editingItem, setEditingItem] = useState(null);
  const [inlineAdminPasscode, setInlineAdminPasscode] = useState('');

  // Global Cross-Browser Sync Settings (GitHub Auto-Commit or Custom JSON Cloud Endpoint)
  const [globalSyncConfig, setGlobalSyncConfig] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sanatan_global_sync_config_v1') || '{}');
      const envToken = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_TOKEN) || '';
      const envRepo = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GITHUB_REPO) || GLOBAL_SYNC_DEFAULT_REPO;
      return {
        githubRepo: saved.githubRepo || envRepo,
        githubBranch: saved.githubBranch || GLOBAL_SYNC_DEFAULT_BRANCH,
        githubToken: saved.githubToken || envToken,
        customCloudUrl: saved.customCloudUrl || ''
      };
    } catch {
      return {
        githubRepo: GLOBAL_SYNC_DEFAULT_REPO,
        githubBranch: GLOBAL_SYNC_DEFAULT_BRANCH,
        githubToken: '',
        customCloudUrl: ''
      };
    }
  });
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);
  const [lastGlobalSyncStatus, setLastGlobalSyncStatus] = useState('');

  const [uploadForm, setUploadForm] = useState({
// ... existing code ...
  // Sync Dark Mode with localStorage & Document Root
  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', darkMode);
      }
    } catch (e) {}
  }, [darkMode]);

  // Global Cross-Browser Fetch Engine: Fetches `/sanatan-global-db.json` (and GitHub raw live file) so EVERY visitor on ANY browser/device sees Admin's latest edits, cover images, PDFs & YouTube videos!
  const fetchGlobalPublishedDatabase = useCallback(async () => {
    const urlsToTry = [];
    if (globalSyncConfig.customCloudUrl && globalSyncConfig.customCloudUrl.startsWith('http')) {
      urlsToTry.push(`${globalSyncConfig.customCloudUrl}${globalSyncConfig.customCloudUrl.includes('?') ? '&' : '?'}t=${Date.now()}`);
    }
    if (globalSyncConfig.githubRepo) {
      const rawHost = ['raw', 'githubusercontent', 'com'].join('.');
      urlsToTry.push(
        `${SECURE_PROTO}${rawHost}/${globalSyncConfig.githubRepo}/${globalSyncConfig.githubBranch || 'main'}/${GLOBAL_SYNC_FILE_PATH}?t=${Date.now()}`
      );
    }
    if (typeof window !== 'undefined' && window.location.origin.startsWith('http')) {
      urlsToTry.push(`${window.location.origin}/sanatan-global-db.json?t=${Date.now()}`);
    }

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) continue;
        const data = await res.json();
        if (data && (Array.isArray(data.items) || typeof data.editsMap === 'object')) {
          if (data.categoryImages && typeof data.categoryImages === 'object') {
            setCategoryCustomImages((prev) => ({ ...prev, ...data.categoryImages }));
          }
          setItems((prev) => {
            const remoteItems = Array.isArray(data.items) ? data.items : [];
            const remoteEdits = data.editsMap && typeof data.editsMap === 'object' ? data.editsMap : {};
            const remoteMap = new Map();
            remoteItems.forEach((it) => {
              if (it && it.id) remoteMap.set(String(it.id), it);
            });
            Object.entries(remoteEdits).forEach(([id, it]) => {
              if (it && it.id) {
                const existing = remoteMap.get(String(id));
                if (!existing || (it.updatedAt || 0) >= (existing.updatedAt || 0)) {
                  remoteMap.set(String(id), it);
                }
              }
            });

            const mergedPrev = prev.map((localIt) => {
              const strId = String(localIt.id);
              const remoteIt = remoteMap.get(strId);
              if (!remoteIt) return localIt;
              if ((remoteIt.updatedAt || 0) >= (localIt.updatedAt || 0)) {
                return { ...localIt, ...remoteIt };
              }
              return localIt;
            });

            const existingIds = new Set(mergedPrev.map((i) => String(i.id)));
            const newRemoteItems = [];
            remoteMap.forEach((remIt, strId) => {
              if (!existingIds.has(strId)) {
                existingIds.add(strId);
                newRemoteItems.push({
                  ...remIt,
                  isUserUploaded: true,
                  status: remIt.status === 'pending' ? 'pending' : 'approved',
                  isApproved: remIt.status !== 'pending'
                });
              }
            });

            const finalList = newRemoteItems.length > 0 ? [...newRemoteItems, ...mergedPrev] : mergedPrev;
            SanatanUnlimitedDB.saveItems(finalList);
            return finalList;
          });
          setLastGlobalSyncStatus(`Synced with global database (${new Date().toLocaleTimeString()})`);
          return true;
        }
      } catch (e) {}
    }
    return false;
  }, [globalSyncConfig.customCloudUrl, globalSyncConfig.githubRepo, globalSyncConfig.githubBranch]);

  // Push Admin-Approved Changes Directly to GitHub Repository (`public/sanatan-global-db.json`) or Custom Cloud Endpoint so ALL Browsers Worldwide Update Automatically!
  const pushGlobalDatabaseToCloud = useCallback(
    async (updatedItemsList, updatedEditsMap, updatedCategoryImages) => {
      const payloadObj = {
        updatedAt: Date.now(),
        updatedAtReadable: new Date().toISOString(),
        editsMap: updatedEditsMap || JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}'),
        categoryImages: updatedCategoryImages || categoryCustomImages,
        items: (updatedItemsList || items).filter((i) => i.isUserUploaded || i.updatedAt)
      };

      // 1. Optional Custom Cloud Webhook/REST URL
      if (globalSyncConfig.customCloudUrl && globalSyncConfig.customCloudUrl.startsWith('http')) {
        try {
          setIsSyncingGlobal(true);
          const res = await fetch(globalSyncConfig.customCloudUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadObj)
          });
          if (res.ok) {
            setLastGlobalSyncStatus('✅ Published to Global Cloud Endpoint!');
          }
        } catch (e) {} finally {
          setIsSyncingGlobal(false);
        }
      }

      // 2. Direct GitHub Repository Commit (`public/sanatan-global-db.json`) via GitHub Token
      const token = (globalSyncConfig.githubToken || '').trim();
      const repo = (globalSyncConfig.githubRepo || GLOBAL_SYNC_DEFAULT_REPO).trim();
      const branch = (globalSyncConfig.githubBranch || GLOBAL_SYNC_DEFAULT_BRANCH).trim();
      if (!token || !repo) {
        return false;
      }

      try {
        setIsSyncingGlobal(true);
        const apiHost = ['api', 'github', 'com'].join('.');
        const apiUrl = `${SECURE_PROTO}${apiHost}/repos/${repo}/contents/${GLOBAL_SYNC_FILE_PATH}`;
        let existingSha = undefined;

        const getRes = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json'
          }
        });
        if (getRes.ok) {
          const fileMeta = await getRes.json();
          existingSha = fileMeta.sha;
        }

        const contentBase64 = encodeUtf8Base64(JSON.stringify(payloadObj, null, 2));
        const putRes = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Admin Global Sync: update sacred library content & media (${new Date().toISOString()})`,
            content: contentBase64,
            branch,
            ...(existingSha ? { sha: existingSha } : {})
          })
        });

        if (putRes.ok) {
          setLastGlobalSyncStatus('✅ Globally Published to GitHub & All Browsers!');
          showToast('🌍 Globally synced to GitHub! Every browser & device worldwide will now display your updated content.');
          return true;
        } else {
          const errText = await putRes.text();
          setLastGlobalSyncStatus(`⚠️ GitHub Sync Error: ${putRes.status}`);
          console.warn('GitHub sync response:', errText);
        }
      } catch (err) {
        setLastGlobalSyncStatus('⚠️ Network error while pushing to GitHub');
      } finally {
        setIsSyncingGlobal(false);
      }
      return false;
    },
    [categoryCustomImages, globalSyncConfig, items, showToast]
  );

  // Hydrate & Merge Admin-Approved Edits from IndexedDB + Global Cloud Database on Mount
  useEffect(() => {
    let active = true;
    Promise.all([
      SanatanUnlimitedDB.loadItems(),
      SanatanUnlimitedDB.loadEditsMap()
    ]).then(([idbItems, idbEditsMap]) => {
      if (!active) return;
      setItems((prev) => {
// ... existing code ...
        isDbHydratedRef.current = true;
        const finalMerged = extraItems.length > 0 ? [...extraItems, ...updatedPrev] : updatedPrev;
        SanatanUnlimitedDB.saveItems(finalMerged);
        return finalMerged;
      });
      // Immediately fetch global published database so any visitor on a brand-new browser gets Admin's latest changes
      fetchGlobalPublishedDatabase();
    }).catch(() => {
      isDbHydratedRef.current = true;
      fetchGlobalPublishedDatabase();
    });

    // Cross-tab synchronization: when Admin approves an edit in one tab, all other open tabs update immediately
    const handleStorageSync = (e) => {
// ... existing code ...
  // Handle Category Background Image Upload (Admin-only approval required + Global Cloud Sync)
  const handleCategoryImageUpload = async (catId, e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAdminAuthenticated) {
      showToast('🔒 Only Admin can change category cover images. Please unlock Admin first.');
      setActiveView('admin');
      return;
    }
    const compressed = await compressCoverImageFile(file);
    if (compressed) {
      setCategoryCustomImages((prev) => {
        const updated = { ...prev, [catId]: compressed };
        try {
          localStorage.setItem('sanatan_setu_category_images_v1', JSON.stringify(updated));
        } catch {}
        pushGlobalDatabaseToCloud(items, undefined, updated);
        return updated;
      });
      showToast(`Admin updated cover image for ${catId} permanently!`);
    }
  };

  // Helper to permanently persist an item in localStorage, IndexedDB, AND push to Global Cloud/GitHub so other browsers see it too!
  const persistItemRecordPermanently = useCallback((itemRecord, updatedFullList) => {
    try {
      const existingEdits = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
      const updatedEdits = { ...existingEdits, [itemRecord.id]: itemRecord };
      try {
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(updatedEdits));
      } catch {}
      SanatanUnlimitedDB.saveEditsMap(updatedEdits);
      if (itemRecord.status === 'approved' && itemRecord.isApproved !== false) {
        pushGlobalDatabaseToCloud(updatedFullList || items, updatedEdits, categoryCustomImages);
      }
    } catch {}
  }, [categoryCustomImages, items, pushGlobalDatabaseToCloud]);

  // Handle Upload Submission — Only Admin can approve directly; visitor uploads go to Admin Pending Queue
  const handleUploadSubmit = (e) => {
// ... existing code ...
      submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: uploadForm.description.trim(),
      body: bodyMap
    };

    setItems((prev) => {
      const next = [newItem, ...prev];
      SanatanUnlimitedDB.saveItems(next);
      persistItemRecordPermanently(newItem, next);
      return next;
    });
    setIsUploadOpen(false);
    setInlineAdminPasscode('');
    setUploadForm({
// ... existing code ...
  // Admin Moderation Handlers
// ... existing code ...
  const handleApproveItem = (id) => {
    setItems((prev) => {
      let approvedItemRef = null;
      const next = prev.map((it) => {
        if (it.id !== id) return it;
        const approvedVersion = it.pendingEdit
          ? {
              ...it,
              ...it.pendingEdit,
              pendingEdit: null,
              status: 'approved',
              isApproved: true,
              updatedAt: Date.now()
            }
          : {
              ...it,
              status: 'approved',
              isApproved: true,
              updatedAt: Date.now()
            };
        approvedItemRef = approvedVersion;
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(approvedVersion);
        }
        return approvedVersion;
      });
      SanatanUnlimitedDB.saveItems(next);
      if (approvedItemRef) {
        persistItemRecordPermanently(approvedItemRef, next);
      }
      return next;
    });
    showToast('✅ Admin Approved! Changes & content are now permanently live.');
  };

  const handleRejectPendingEdit = (id) => {
// ... existing code ...
    if (canApproveDirectly) {
      const stampedItem = {
        ...editingItem,
        pendingEdit: null,
        status: 'approved',
        isApproved: true,
        updatedAt: Date.now()
      };
      setItems((prev) => {
        const next = prev.map((it) => (it.id === stampedItem.id ? stampedItem : it));
        try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(next)); } catch {}
        SanatanUnlimitedDB.saveItems(next);
        persistItemRecordPermanently(stampedItem, next);
        return next;
      });
      if (selectedItem && selectedItem.id === stampedItem.id) {
        setSelectedItem(stampedItem);
      }
      setEditingItem(null);
      setInlineAdminPasscode('');
      showToast('✅ Admin Approved: Cover image, YouTube video & content saved!');
    } else {
      // Non-admin user: stage edits in `pendingEdit` so the public page stays unchanged until Admin approves!
// ... existing code ...
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
                    onClick={() => setAdminTab('cloud')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      adminTab === 'cloud'
                        ? 'bg-emerald-600 text-white shadow'
                        : darkMode
                        ? 'bg-[#18100B] text-emerald-300 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌍 Global Cross-Browser Sync (GitHub / Cloud)</span>
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
                    <FileText className="w-4 h-4" />
                    <span>SEO Status &amp; index.html</span>
                  </button>
                </div>

                {/* Tab 1: Pending Approval Queue (Both New Uploads & Proposed Edits to Existing Items) */}
// ... existing code ...
                {/* Tab 2: Published Content Manager */}
// ... existing code ...
                    ))}
                  </div>
                )}

                {/* Tab 3: Global Cross-Browser & Multi-Device Sync (Fixes "changes only visible in my current browser"!) */}
                {adminTab === 'cloud' && (
                  <div
                    className={`rounded-3xl p-6 sm:p-8 border space-y-6 ${
                      darkMode ? 'bg-[#18100B] border-emerald-500/30' : 'bg-white border-emerald-600/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-extrabold uppercase">
                          Worldwide Browser &amp; Device Sync
                        </span>
                        <h3 className="text-xl font-black mt-1">
                          Make Admin Edits, Cover Images &amp; YouTube Videos Live on Every Browser
                        </h3>
                        <p className={`text-xs mt-1 leading-relaxed ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>
                          Why did changes only appear on one browser before? Because browsers isolate <code>localStorage</code> and <code>IndexedDB</code> per device. Connect your GitHub Personal Access Token once below (or download &amp; commit <code>public/sanatan-global-db.json</code>), and every Admin edit you make will automatically push to your repository and appear on **all browsers, phones, and computers worldwide**!
                        </p>
                      </div>
                      {lastGlobalSyncStatus && (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 text-xs font-bold shrink-0">
                          {lastGlobalSyncStatus}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                          GitHub Repository (owner/repo)
                        </label>
                        <input
                          type="text"
                          value={globalSyncConfig.githubRepo}
                          onChange={(e) => {
                            const updated = { ...globalSyncConfig, githubRepo: e.target.value };
                            setGlobalSyncConfig(updated);
                            try { localStorage.setItem('sanatan_global_sync_config_v1', JSON.stringify(updated)); } catch {}
                          }}
                          placeholder="manhar900/sanatansetu"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                            darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                          Branch Name
                        </label>
                        <input
                          type="text"
                          value={globalSyncConfig.githubBranch}
                          onChange={(e) => {
                            const updated = { ...globalSyncConfig, githubBranch: e.target.value };
                            setGlobalSyncConfig(updated);
                            try { localStorage.setItem('sanatan_global_sync_config_v1', JSON.stringify(updated)); } catch {}
                          }}
                          placeholder="main"
                          className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                            darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-[#EA580C] mb-1">
                        GitHub Personal Access Token (Fine-Grained or Classic with &ldquo;Contents: Read &amp; Write&rdquo; permission)
                      </label>
                      <input
                        type="password"
                        value={globalSyncConfig.githubToken}
                        onChange={(e) => {
                          const updated = { ...globalSyncConfig, githubToken: e.target.value };
                          setGlobalSyncConfig(updated);
                          try { localStorage.setItem('sanatan_global_sync_config_v1', JSON.stringify(updated)); } catch {}
                        }}
                        placeholder="ghp_... or github_pat_... (Or set VITE_GITHUB_TOKEN in Vercel Environment Variables)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                          darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'
                        }`}
                      />
                      <p className={`text-[11px] mt-1 ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                        💡 Tip: You can also add <code>VITE_GITHUB_TOKEN</code> in your Vercel Project Settings → Environment Variables so you never have to type it again.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isSyncingGlobal}
                        onClick={async () => {
                          const ok = await pushGlobalDatabaseToCloud(items, undefined, categoryCustomImages);
                          if (!ok && !globalSyncConfig.githubToken) {
                            showToast('Please enter your GitHub Token above (or click Download sanatan-global-db.json below).');
                          }
                        }}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{isSyncingGlobal ? 'Syncing to GitHub...' : '🚀 Push All Current Edits & Uploads Globally Now'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const payloadObj = {
                            updatedAt: Date.now(),
                            updatedAtReadable: new Date().toISOString(),
                            editsMap: JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}'),
                            categoryImages: categoryCustomImages,
                            items: items.filter((i) => i.isUserUploaded || i.updatedAt)
                          };
                          const blob = new Blob([JSON.stringify(payloadObj, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'sanatan-global-db.json';
                          a.click();
                          URL.revokeObjectURL(url);
                          showToast('Downloaded sanatan-global-db.json! Upload it into your GitHub public/ folder.');
                        }}
                        className="px-4 py-3 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow flex items-center gap-2 transition-all"
                      >
                        <FileText className="w-4 h-4" />
                        <span>⬇️ Download public/sanatan-global-db.json</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fetchGlobalPublishedDatabase()}
                        className={`px-4 py-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                          darkMode ? 'border-amber-500/30 text-amber-200' : 'border-amber-900/20 text-[#2C1A12]'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4" /> Pull Latest Global Data
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab 4: Live SEO Status & index.html Helper */}
                {adminTab === 'seo' && (
// ... existing code ...
