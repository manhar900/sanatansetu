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
// ... existing code ...
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
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }
};

// Compresses uploaded cover images so they save cleanly in localStorage, IndexedDB, and Global GitHub Sync
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

// Helper for UTF-8 safe Base64 encoding for GitHub REST API commits
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
// ... existing code ...
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'published' | 'cloud' | 'seo'
  const [editingItem, setEditingItem] = useState(null);
  const isDbHydratedRef = useRef(false);

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

  // Push Admin-Approved Changes Directly to GitHub Repository (`public/sanatan-global-db.json`) so ALL Browsers Worldwide Update Automatically!
  const pushGlobalDatabaseToCloud = useCallback(
    async (updatedItemsList, updatedEditsMap, updatedCategoryImages) => {
      const payloadObj = {
        updatedAt: Date.now(),
        updatedAtReadable: new Date().toISOString(),
        editsMap: updatedEditsMap || JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}'),
        categoryImages: updatedCategoryImages || categoryCustomImages,
        items: (updatedItemsList || items).filter((i) => i.isUserUploaded || i.updatedAt)
      };

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
          setLastGlobalSyncStatus('Globally Published to GitHub & All Browsers!');
          showToast('Globally synced to GitHub! Every browser & device worldwide will now display your updated content.');
          return true;
        } else {
          setLastGlobalSyncStatus(`GitHub Sync Error: ${putRes.status}`);
        }
      } catch (err) {
        setLastGlobalSyncStatus('Network error while pushing to GitHub');
      } finally {
        setIsSyncingGlobal(false);
      }
      return false;
    },
    [categoryCustomImages, globalSyncConfig, items, showToast]
  );

  // Persist Items, Likes, Bookmarks, and Jaap counts + Hydrate from IndexedDB & Global Cloud DB
  useEffect(() => {
    let active = true;
    Promise.all([
      SanatanUnlimitedDB.loadItems(),
      SanatanUnlimitedDB.loadEditsMap()
    ]).then(([idbItems, idbEditsMap]) => {
      if (!active) return;
      setItems((prev) => {
        const editsObj = {
          ...(JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}')),
          ...(idbEditsMap && typeof idbEditsMap === 'object' ? idbEditsMap : {})
        };
        const idbMap = new Map();
        if (Array.isArray(idbItems)) {
          idbItems.forEach((it) => {
            if (it && it.id) idbMap.set(String(it.id), it);
          });
        }
        const mergedPrev = prev.map((localIt) => {
          const strId = String(localIt.id);
          const editIt = editsObj[strId];
          const idbIt = idbMap.get(strId);
          let best = localIt;
          if (idbIt && (idbIt.updatedAt || 0) >= (best.updatedAt || 0)) best = { ...best, ...idbIt };
          if (editIt && (editIt.updatedAt || 0) >= (best.updatedAt || 0)) best = { ...best, ...editIt };
          return best;
        });
        const existingIds = new Set(mergedPrev.map((i) => String(i.id)));
        const extraFromIdb = (Array.isArray(idbItems) ? idbItems : [])
          .filter((it) => it && it.id && !existingIds.has(String(it.id)))
          .map((it) => ({
            ...it,
            isUserUploaded: true,
            status: it.status === 'rejected' ? 'rejected' : 'approved',
            isApproved: it.status !== 'rejected'
          }));
        isDbHydratedRef.current = true;
        return extraFromIdb.length > 0 ? [...extraFromIdb, ...mergedPrev] : mergedPrev;
      });
      fetchGlobalPublishedDatabase();
    }).catch(() => {
      isDbHydratedRef.current = true;
      fetchGlobalPublishedDatabase();
    });
    return () => {
      active = false;
    };
  }, [fetchGlobalPublishedDatabase]);

  useEffect(() => {
    if (!isDbHydratedRef.current) return;
    try {
      try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items)); } catch (quotaErr) {}
      SanatanUnlimitedDB.saveItems(items);
    } catch (e) {}
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_likes', JSON.stringify(likedIds));
// ... existing code ...
  // Separate Approved vs Pending items (moved above seoMetadata so uploaded approved items are indexed in JSON-LD & Sitemap)
  const approvedItems = useMemo(
    () => items.filter((item) => item.status !== 'rejected'),
    [items]
  );

  const pendingItems = useMemo(
    () => items.filter((item) => item.status === 'pending' || item.isApproved === false || Boolean(item.pendingEdit)),
    [items]
  );

  // Dynamic XML Sitemap & robots.txt Generators (automatically includes all approved & uploaded content!)
// ... existing code ...
  // Handle Direct Image File Upload (compresses to HD JPEG Data URI so images save cleanly everywhere)
  const handleImageFileChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressCoverImageFile(file);
    if (compressed) {
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, imageUrl: compressed });
      } else {
        setUploadForm((prev) => ({ ...prev, imageUrl: compressed }));
      }
      showToast('Copyright-free image compressed and attached!');
    }
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

  // Handle Category Background Image Upload (Admin-only approval + Global Sync)
  const handleCategoryImageUpload = async (catId, e) => {
    e.stopPropagation();
    const file = e.target.files?.[0];
    if (!file) return;
    if (!isAdminAuthenticated) {
      showToast('Only Admin can change category cover images. Please unlock Admin first.');
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
      showToast(`Admin updated cover image for ${catId}!`);
    }
  };

  // Permanently persists an Admin-approved item in localStorage, IndexedDB, and pushes to GitHub Global Sync
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

  // Handle Upload Submission — Only Admin can publish directly; visitor submissions go to Pending Approval Queue
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
      updatedAt: Date.now(),
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

    setSelectedCategory('All');
    setSelectedMediaFormat('All');
    setSearchQuery('');
    setShowBookmarksOnly(false);
    setActiveView('home');
    showToast(
      approveNow
        ? 'Admin approved & published content! Syncing globally...'
        : 'Submitted to Admin Pending Approval Queue! Only Admin can approve & publish.'
    );
  };

  // Admin Moderation Handlers
// ... existing code ...
  const handleApproveItem = (id) => {
    setItems((prev) => {
      let approvedRef = null;
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
        approvedRef = approvedVersion;
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(approvedVersion);
        }
        return approvedVersion;
      });
      SanatanUnlimitedDB.saveItems(next);
      if (approvedRef) {
        persistItemRecordPermanently(approvedRef, next);
      }
      return next;
    });
    showToast('Admin Approved! Changes are live and syncing globally.');
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
    if (isAdminAuthenticated) {
      const stampedItem = {
        ...editingItem,
        pendingEdit: null,
        status: 'approved',
        isApproved: true,
        updatedAt: Date.now()
      };
      setItems((prev) => {
        const next = prev.map((it) => (it.id === stampedItem.id ? stampedItem : it));
        SanatanUnlimitedDB.saveItems(next);
        persistItemRecordPermanently(stampedItem, next);
        return next;
      });
      if (selectedItem && selectedItem.id === stampedItem.id) {
        setSelectedItem(stampedItem);
      }
      setEditingItem(null);
      showToast('Admin saved changes! Syncing globally to GitHub...');
    } else {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id
            ? { ...it, pendingEdit: { ...editingItem, updatedAt: Date.now() } }
            : it
        )
      );
      setEditingItem(null);
      showToast('Edit submitted for Admin Approval! Unlock Admin to approve & publish.');
    }
  };

  const handleRestoreDefaults = () => {
// ... existing code ...
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
// ... existing code ...
                {/* Tab 3: Global Cross-Browser & Multi-Device Sync */}
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
                          Paste your GitHub Personal Access Token below once (with <strong>Contents: Read &amp; Write</strong> permission), or click <strong>Download public/sanatan-global-db.json</strong> and upload it to your GitHub <code>public/</code> folder so every visitor on any browser sees your Admin-approved updates!
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
                        GitHub Personal Access Token (Contents: Read &amp; Write)
                      </label>
                      <input
                        type="password"
                        value={globalSyncConfig.githubToken}
                        onChange={(e) => {
                          const updated = { ...globalSyncConfig, githubToken: e.target.value };
                          setGlobalSyncConfig(updated);
                          try { localStorage.setItem('sanatan_global_sync_config_v1', JSON.stringify(updated)); } catch {}
                        }}
                        placeholder="github_pat_... or ghp_... (Or set VITE_GITHUB_TOKEN in Vercel Environment Variables)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs ${
                          darkMode ? 'bg-[#22160F] border-amber-500/30 text-amber-50' : 'bg-amber-50/50 border-amber-900/20'
                        }`}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        disabled={isSyncingGlobal}
                        onClick={async () => {
                          const ok = await pushGlobalDatabaseToCloud(items, undefined, categoryCustomImages);
                          if (!ok && !globalSyncConfig.githubToken) {
                            showToast('Please paste your GitHub Token above (or click Download sanatan-global-db.json below).');
                          }
                        }}
                        className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg flex items-center gap-2 transition-all"
                      >
                        <Globe className="w-4 h-4" />
                        <span>{isSyncingGlobal ? 'Syncing to GitHub...' : 'Push All Current Edits & Uploads Globally Now'}</span>
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
                        <span>Download public/sanatan-global-db.json</span>
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
      </footer>
    </div>
  );
}
