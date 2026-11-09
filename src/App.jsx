import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Upload, BookOpen, Heart, Bookmark,
// ... existing code ...
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
// ... existing code ...
  // Custom Category Background Images State (allows uploading real images for any category)
  const [categoryCustomImages, setCategoryCustomImages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sanatan_setu_category_images_v1') || '{}');
    } catch {
      return {};
    }
  });

  // Tracks whether IndexedDB hydration has completed so initial mount never overwrites IndexedDB with stale data
  const isDbHydratedRef = useRef(false);

  // 3. Library Items State — Preserves and merges ALL Admin-approved edits, cover images, and pending queue items across refreshes and new tabs
  const [items, setItems] = useState(() => {
    const seedIds = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));
    const collectedCustomMap = new Map();
    const editedItemsMap = new Map();

    try {
      const savedEditsRaw = localStorage.getItem('sanatan_setu_edits_map_v1');
      if (savedEditsRaw) {
        const parsedEdits = JSON.parse(savedEditsRaw);
        if (parsedEdits && typeof parsedEdits === 'object') {
          Object.entries(parsedEdits).forEach(([id, editedItem]) => {
            if (editedItem && typeof editedItem === 'object') {
              editedItemsMap.set(String(id), editedItem);
            }
          });
        }
      }

      const storageKeys = [
        'sanatan_setu_items_v6',
        'sanatan_setu_items_v5',
        'sanatan_setu_items_v4',
        'sanatan_setu_items_v3',
        'sanatan_setu_items_v2',
        'sanatan_setu_items'
      ];
      for (const key of storageKeys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) continue;
        for (const it of parsed) {
          if (!it || !it.id) continue;
          const strId = String(it.id);
          const latestEdit = editedItemsMap.get(strId);
          const mergedItem = latestEdit ? { ...it, ...latestEdit } : it;

          if (!seedIds.has(strId)) {
            const existing = collectedCustomMap.get(strId);
            if (!existing || (mergedItem.updatedAt || 0) > (existing.updatedAt || 0)) {
              const isExplicitlyPending = mergedItem.status === 'pending' || mergedItem.isApproved === false;
              collectedCustomMap.set(strId, {
                ...mergedItem,
                isUserUploaded: true,
                status: isExplicitlyPending ? 'pending' : mergedItem.status === 'rejected' ? 'rejected' : 'approved',
                isApproved: !isExplicitlyPending && mergedItem.status !== 'rejected'
              });
            }
          } else if (!editedItemsMap.has(strId) && (key === 'sanatan_setu_items_v6' || it.updatedAt || it.pendingEdit)) {
            editedItemsMap.set(strId, mergedItem);
          }
        }
      }
    } catch (e) {}

    editedItemsMap.forEach((editedItem, strId) => {
      if (!seedIds.has(strId) && !collectedCustomMap.has(strId)) {
        const isExplicitlyPending = editedItem.status === 'pending' || editedItem.isApproved === false;
        collectedCustomMap.set(strId, {
          ...editedItem,
          isUserUploaded: true,
          status: isExplicitlyPending ? 'pending' : editedItem.status === 'rejected' ? 'rejected' : 'approved',
          isApproved: !isExplicitlyPending && editedItem.status !== 'rejected'
        });
      }
    });

    const mergedSeeds = INITIAL_SACRED_ITEMS.map((seed) => {
      const strId = String(seed.id);
      return editedItemsMap.has(strId) ? { ...seed, ...editedItemsMap.get(strId) } : seed;
    });
    return [...Array.from(collectedCustomMap.values()), ...mergedSeeds];
  });

  // 4. Filter, Search, Likes, Bookmarks State
// ... existing code ...
  const [newPasscodeInput, setNewPasscodeInput] = useState('');
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'published' | 'seo'
  const [editingItem, setEditingItem] = useState(null);
  const [inlineAdminPasscode, setInlineAdminPasscode] = useState('');

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

  // Hydrate & Merge Admin-Approved Edits + Pending Changes from IndexedDB on Mount (Fixes refresh & new webpage revert bug!)
  useEffect(() => {
    let active = true;
    Promise.all([
      SanatanUnlimitedDB.loadItems(),
      SanatanUnlimitedDB.loadEditsMap()
    ]).then(([idbItems, idbEditsMap]) => {
      if (!active) return;
      setItems((prev) => {
        const editsLookup = idbEditsMap && typeof idbEditsMap === 'object' ? idbEditsMap : {};
        const idbMap = new Map();
        if (Array.isArray(idbItems)) {
          for (const it of idbItems) {
            if (it && it.id) {
              idbMap.set(String(it.id), it);
            }
          }
        }

        const updatedPrev = prev.map((item) => {
          const strId = String(item.id);
          const fromIdb = idbMap.get(strId);
          const fromEdits = editsLookup[strId];
          let best = item;
          if (fromIdb && ((fromIdb.updatedAt || 0) >= (best.updatedAt || 0) || fromIdb.imageUrl !== best.imageUrl || fromIdb.pendingEdit)) {
            best = { ...best, ...fromIdb };
          }
          if (fromEdits && ((fromEdits.updatedAt || 0) >= (best.updatedAt || 0))) {
            best = { ...best, ...fromEdits };
          }
          return best;
        });

        const existingIds = new Set(updatedPrev.map((i) => String(i.id)));
        const extraItems = [];
        idbMap.forEach((it, strId) => {
          if (!existingIds.has(strId)) {
            existingIds.add(strId);
            const merged = { ...it, ...(editsLookup[strId] || {}) };
            const isExplicitlyPending = merged.status === 'pending' || merged.isApproved === false;
            extraItems.push({
              ...merged,
              isUserUploaded: true,
              status: isExplicitlyPending ? 'pending' : merged.status === 'rejected' ? 'rejected' : 'approved',
              isApproved: !isExplicitlyPending && merged.status !== 'rejected'
            });
          }
        });
        Object.entries(editsLookup).forEach(([strId, editedIt]) => {
          if (!existingIds.has(strId) && editedIt && editedIt.id) {
            existingIds.add(strId);
            const isExplicitlyPending = editedIt.status === 'pending' || editedIt.isApproved === false;
            extraItems.push({
              ...editedIt,
              isUserUploaded: true,
              status: isExplicitlyPending ? 'pending' : editedIt.status === 'rejected' ? 'rejected' : 'approved',
              isApproved: !isExplicitlyPending && editedIt.status !== 'rejected'
            });
          }
        });

        isDbHydratedRef.current = true;
        const finalMerged = extraItems.length > 0 ? [...extraItems, ...updatedPrev] : updatedPrev;
        SanatanUnlimitedDB.saveItems(finalMerged);
        return finalMerged;
      });
    }).catch(() => {
      isDbHydratedRef.current = true;
    });

    // Cross-tab synchronization: when Admin approves an edit in one tab, all other open tabs update immediately
    const handleStorageSync = (e) => {
      if (e.key === 'sanatan_setu_edits_map_v1' && e.newValue) {
        try {
          const newEdits = JSON.parse(e.newValue);
          setItems((prev) =>
            prev.map((it) => (newEdits[it.id] ? { ...it, ...newEdits[it.id] } : it))
          );
        } catch {}
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageSync);
    }
    return () => {
      active = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageSync);
      }
    };
  }, []);

  // Persist Items to localStorage and IndexedDB (only after initial IndexedDB hydration so Admin-approved edits never revert)
  useEffect(() => {
    try {
      try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items)); } catch (quotaErr) {}
      if (isDbHydratedRef.current) {
        SanatanUnlimitedDB.saveItems(items);
      }
    } catch (e) {}
  }, [items]);

  useEffect(() => {
// ... existing code ...
  // Separate Admin-Approved Public Items vs Pending Uploads & Pending Edits (Only Admin-approved items or changes appear publicly!)
  const approvedItems = useMemo(
    () => items.filter((item) => item.status === 'approved' && item.isApproved !== false),
    [items]
  );

  // Pending Queue includes BOTH new unapproved uploads AND existing items that have unapproved edits (`pendingEdit`)
  const pendingItems = useMemo(
    () =>
      items.filter(
        (item) =>
          item.status === 'pending' ||
          item.isApproved === false ||
          Boolean(item.pendingEdit)
      ),
    [items]
  );

  // Dynamic XML Sitemap & robots.txt Generators (automatically includes all approved & uploaded content!)
// ... existing code ...
  // Handle Direct Image File Upload (compresses high-res photos so they persist across refreshes & new tabs without exceeding quota!)
  const handleImageFileChange = async (e, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressedDataUrl = await compressCoverImageFile(file);
    if (compressedDataUrl) {
      if (isEdit && editingItem) {
        setEditingItem((prev) => (prev ? { ...prev, imageUrl: compressedDataUrl, updatedAt: Date.now() } : prev));
      } else {
        setUploadForm((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
      }
      showToast('Cover image uploaded and optimized!');
    }
  };

  // Handle Direct PDF File Upload (converts to Data URI / Object URL so users can view & download PDFs)
// ... existing code ...
  // Handle Category Background Image Upload (Admin-only approval required)
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
        return updated;
      });
      showToast(`Admin updated cover image for ${catId} permanently!`);
    }
  };

  // Helper to permanently persist an item in both localStorage edits map and IndexedDB
  const persistItemRecordPermanently = useCallback((itemRecord) => {
    try {
      const existingEdits = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
      const updatedEdits = { ...existingEdits, [itemRecord.id]: itemRecord };
      try {
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(updatedEdits));
      } catch {}
      SanatanUnlimitedDB.saveEditsMap(updatedEdits);
    } catch {}
  }, []);

  // Handle Upload Submission — Only Admin can approve directly; visitor uploads go to Admin Pending Queue
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

    const activePass = (customAdminPasscode || DEFAULT_ADMIN_PASSCODE).trim();
    const enteredInlinePass = inlineAdminPasscode.trim();
    const hasValidInlineAdmin =
      enteredInlinePass && (enteredInlinePass === activePass || enteredInlinePass === DEFAULT_ADMIN_PASSCODE);

    if (hasValidInlineAdmin && !isAdminAuthenticated) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch {}
    }

    // Only approved immediately if Admin is authenticated (or entered valid Admin passcode)
    const approveNow = Boolean(
      (isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin) || hasValidInlineAdmin
    );

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
      updatedAt: Date.now(),
      status: approveNow ? 'approved' : 'pending',
      isApproved: approveNow,
      submittedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: uploadForm.description.trim(),
      body: bodyMap
    };

    persistItemRecordPermanently(newItem);

    setItems((prev) => {
      const next = [newItem, ...prev];
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    setIsUploadOpen(false);
    setInlineAdminPasscode('');
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
      publishDirectlyAsAdmin: true
    });

    if (approveNow) {
      setSelectedCategory('All');
      setSelectedMediaFormat('All');
      setSearchQuery('');
      setShowBookmarksOnly(false);
      setActiveView('home');
      showToast('✅ Approved by Admin and published permanently to All Sacred Knowledge!');
    } else {
      showToast('⏳ Submitted to Admin Approval Queue! Content will be published once Admin approves it.');
    }
  };

  // Admin Moderation Handlers
// ... existing code ...
  const handleApproveItem = (id) => {
    setItems((prev) => {
      const next = prev.map((it) => {
        if (it.id !== id) return it;
        // If this item has a pending edit, apply the pending edit upon approval; otherwise approve the item itself
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
        persistItemRecordPermanently(approvedVersion);
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(approvedVersion);
        }
        return approvedVersion;
      });
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    showToast('✅ Admin Approved! Changes & content are now permanently live across the site.');
  };

  const handleRejectPendingEdit = (id) => {
    setItems((prev) => {
      const next = prev.map((it) => {
        if (it.id !== id) return it;
        const cleaned = { ...it, pendingEdit: null, updatedAt: Date.now() };
        persistItemRecordPermanently(cleaned);
        return cleaned;
      });
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    showToast('Rejected proposed edit — original verified content kept.');
  };

  const handleMoveToPending = (id) => {
    setItems((prev) => {
      const next = prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, status: 'pending', isApproved: false, updatedAt: Date.now() };
        persistItemRecordPermanently(updated);
        return updated;
      });
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    showToast('Item moved to Pending Moderation Queue');
  };

  const handleToggleFeatured = (id) => {
    setItems((prev) => {
      const next = prev.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, isFeatured: !it.isFeatured, updatedAt: Date.now() };
        persistItemRecordPermanently(updated);
        return updated;
      });
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    showToast('Updated Featured status');
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    if (selectedItem && selectedItem.id === id) setSelectedItem(null);
    showToast('Item removed from repository');
  };

  // Save Edited Item — If Admin is authenticated (or enters Admin Passcode), applies & saves permanently; otherwise stages as a Pending Edit for Admin Approval!
  const handleSaveEditedItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const activePass = (customAdminPasscode || DEFAULT_ADMIN_PASSCODE).trim();
    const enteredInlinePass = inlineAdminPasscode.trim();
    const hasValidInlineAdmin =
      enteredInlinePass && (enteredInlinePass === activePass || enteredInlinePass === DEFAULT_ADMIN_PASSCODE);

    if (hasValidInlineAdmin && !isAdminAuthenticated) {
      setIsAdminAuthenticated(true);
      try { localStorage.setItem('sanatan_admin_auth', 'true'); } catch {}
    }

    const canApproveDirectly = isAdminAuthenticated || hasValidInlineAdmin;

    if (canApproveDirectly) {
      const stampedItem = {
        ...editingItem,
        pendingEdit: null,
        status: 'approved',
        isApproved: true,
        updatedAt: Date.now()
      };
      persistItemRecordPermanently(stampedItem);
      setItems((prev) => {
        const next = prev.map((it) => (it.id === stampedItem.id ? stampedItem : it));
        try { localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(next)); } catch {}
        SanatanUnlimitedDB.saveItems(next);
        return next;
      });
      if (selectedItem && selectedItem.id === stampedItem.id) {
        setSelectedItem(stampedItem);
      }
      setEditingItem(null);
      setInlineAdminPasscode('');
      showToast('✅ Admin Approved: Cover image & content changes saved permanently!');
    } else {
      // Non-admin user: stage edits in `pendingEdit` so the public page stays unchanged until Admin approves!
      const proposedChanges = {
        title: editingItem.title,
        category: editingItem.category,
        description: editingItem.description,
        imageUrl: editingItem.imageUrl,
        pdfUrl: editingItem.pdfUrl,
        pdfFileName: editingItem.pdfFileName,
        videoUrl: editingItem.videoUrl,
        body: editingItem.body,
        submittedAt: new Date().toLocaleString('en-IN')
      };
      setItems((prev) => {
        const next = prev.map((it) => {
          if (it.id !== editingItem.id) return it;
          const withPendingEdit = {
            ...it,
            pendingEdit: proposedChanges,
            updatedAt: Date.now()
          };
          persistItemRecordPermanently(withPendingEdit);
          return withPendingEdit;
        });
        SanatanUnlimitedDB.saveItems(next);
        return next;
      });
      setEditingItem(null);
      setInlineAdminPasscode('');
      showToast('🔒 Edit submitted for Admin Approval! Changes will appear publicly once Admin approves them.');
    }
  };

  const handleRestoreDefaults = () => {
// ... existing code ...
                {/* Tab 1: Pending Approval Queue (Both New Uploads & Proposed Edits to Existing Items) */}
                {adminTab === 'pending' && (
                  <div className="space-y-4">
                    {pendingItems.length === 0 ? (
                      <div
                        className={`rounded-3xl p-10 text-center border ${
                          darkMode ? 'bg-[#18100B] border-amber-500/20' : 'bg-white border-amber-900/10'
                        }`}
                      >
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold">All Uploaded Content &amp; Edits Reviewed!</h3>
                        <p className={`text-xs mt-1 max-w-md mx-auto ${darkMode ? 'text-amber-300/70' : 'text-[#78523A]'}`}>
                          New community uploads and any proposed edits/cover changes are held here until you verify and approve them.
                        </p>
                      </div>
                    ) : (
                      pendingItems.map((item) => {
                        const displayVersion = item.pendingEdit ? { ...item, ...item.pendingEdit } : item;
                        const isPendingEdit = Boolean(item.pendingEdit);
                        return (
                          <div
                            key={item.id}
                            className={`rounded-2xl p-6 border shadow-md flex flex-col lg:flex-row gap-6 justify-between ${
                              darkMode ? 'bg-[#18100B] border-amber-500/30' : 'bg-white border-amber-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                              <img
                                src={displayVersion.imageUrl || fallbackArtworkForItem(displayVersion)}
                                alt={displayVersion.title}
                                className="w-full sm:w-40 h-32 object-cover rounded-xl shrink-0 border border-amber-500/30"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = fallbackArtworkForItem(displayVersion);
                                }}
                              />
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-bold">
                                    {isPendingEdit ? '📝 PENDING EDIT / COVER CHANGE APPROVAL' : '🆕 PENDING NEW UPLOAD APPROVAL'}
                                  </span>
                                  <span className="text-xs font-bold text-[#EA580C]">{displayVersion.category}</span>
                                  <span className="text-xs opacity-70">By: {displayVersion.author || 'Contributor'}</span>
                                </div>
                                <h3 className="text-lg font-extrabold">{displayVersion.title}</h3>
                                <p className={`text-xs ${darkMode ? 'text-amber-200/80' : 'text-[#78523A]'}`}>
                                  {displayVersion.description}
                                </p>
                                <div
                                  className={`p-3 rounded-xl text-xs max-h-40 overflow-y-auto whitespace-pre-line border ${
                                    darkMode ? 'bg-[#110B07] border-amber-500/15 text-amber-100/90' : 'bg-amber-50/70 border-amber-900/10 text-[#2C1A12]'
                                  }`}
                                >
                                  {getBodyForLanguage(displayVersion, 'English')}
                                </div>
                              </div>
                            </div>

                            <div className="flex sm:flex-row lg:flex-col justify-end gap-2.5 shrink-0">
                              <button
                                onClick={() => handleApproveItem(item.id)}
                                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                              >
                                <Check className="w-4 h-4" /> {isPendingEdit ? 'Approve Edit & Publish' : 'Approve & Publish'}
                              </button>
                              <button
                                onClick={() => setEditingItem(displayVersion)}
                                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center gap-1.5"
                              >
                                <Edit3 className="w-4 h-4" /> Edit Content
                              </button>
                              {isPendingEdit ? (
                                <button
                                  onClick={() => handleRejectPendingEdit(item.id)}
                                  className="px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5"
                                >
                                  <XCircle className="w-4 h-4" /> Reject Edit
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleDeleteItem(item.id)}
                                  className="px-4 py-2.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-500 text-xs font-bold flex items-center justify-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" /> Reject &amp; Delete
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Tab 2: Published Content Manager */}
// ... existing code ...
              {isAdminAuthenticated ? (
                <label className="flex items-center gap-2 text-xs font-bold text-emerald-500 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={uploadForm.publishDirectlyAsAdmin}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, publishDirectlyAsAdmin: e.target.checked })
                    }
                    className="rounded"
                  />
                  <span>Admin Authenticated: Approve &amp; publish immediately to public library</span>
                </label>
              ) : (
                <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-amber-50 border-amber-300'}`}>
                  <label className="block text-xs font-bold text-[#EA580C] mb-1">
                    🔒 Admin Approval Required (Optional: Enter Admin Passcode to Approve &amp; Publish Immediately)
                  </label>
                  <input
                    type="password"
                    value={inlineAdminPasscode}
                    onChange={(e) => setInlineAdminPasscode(e.target.value)}
                    placeholder="Leave blank to send to Admin Pending Queue, or enter Admin Passcode..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
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
                  {(isAdminAuthenticated && uploadForm.publishDirectlyAsAdmin) || inlineAdminPasscode.trim()
                    ? 'Approve & Publish Now (Admin)'
                    : 'Submit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Sacred Content Modal (Only Admin Can Approve Changes to Go Live) */}
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
              {isAdminAuthenticated
                ? '✅ Admin Mode Active: Your edits and cover image changes will be approved and saved permanently.'
                : '🔒 Only Admin can approve edits. Changes submitted here will enter the Admin Pending Queue (or enter your Admin Passcode below to approve & save immediately).'}
            </p>
            <form onSubmit={handleSaveEditedItem} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// ... existing code ...
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

              {/* Admin Verification Gate inside Edit Modal */}
              {!isAdminAuthenticated && (
                <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-[#22160F] border-amber-500/30' : 'bg-amber-50 border-amber-300'}`}>
                  <label className="block text-xs font-bold text-[#EA580C] mb-1">
                    🔒 Admin Passcode (Enter to Approve &amp; Publish Edit Immediately, or leave blank to send to Admin Pending Queue)
                  </label>
                  <input
                    type="password"
                    value={inlineAdminPasscode}
                    onChange={(e) => setInlineAdminPasscode(e.target.value)}
                    placeholder="Enter Admin Passcode to approve this edit immediately..."
                    className={`w-full px-3 py-2 rounded-xl border text-xs ${
                      darkMode ? 'bg-[#160F0A] border-amber-500/30 text-amber-50' : 'bg-white border-amber-900/20'
                    }`}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setInlineAdminPasscode('');
                  }}
                  className="px-4 py-2 rounded-xl border border-amber-500/30 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-orange-700 text-white text-xs font-bold shadow"
                >
                  {isAdminAuthenticated || inlineAdminPasscode.trim()
                    ? 'Approve & Save Changes Permanently'
                    : 'Submit Edit for Admin Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEO-Friendly Semantic Footer */}
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
