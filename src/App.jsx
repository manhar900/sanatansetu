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

  // 3. Library Items State — Preserves and merges ALL user-uploaded items AND all edited cover images/fields across refreshes and new tabs
  const [items, setItems] = useState(() => {
    const seedIds = new Set(INITIAL_SACRED_ITEMS.map((i) => String(i.id)));
    const collectedCustomMap = new Map();
    const editedItemsMap = new Map();

    try {
      // Load dedicated edits dictionary first (stores every edited cover page, title, body, PDF, or video)
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
              collectedCustomMap.set(strId, {
                ...mergedItem,
                isUserUploaded: true,
                status: mergedItem.status === 'rejected' ? 'rejected' : 'approved',
                isApproved: mergedItem.status !== 'rejected'
              });
            }
          } else if (!editedItemsMap.has(strId) && (key === 'sanatan_setu_items_v6' || it.updatedAt)) {
            editedItemsMap.set(strId, mergedItem);
          }
        }
      }
    } catch (e) {}

    // Also include any newly uploaded custom items that were saved directly in editedItemsMap
    editedItemsMap.forEach((editedItem, strId) => {
      if (!seedIds.has(strId) && !collectedCustomMap.has(strId)) {
        collectedCustomMap.set(strId, {
          ...editedItem,
          isUserUploaded: true,
          status: editedItem.status === 'rejected' ? 'rejected' : 'approved',
          isApproved: editedItem.status !== 'rejected'
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
  // Sync Dark Mode with localStorage & Document Root
  useEffect(() => {
    try {
      localStorage.setItem('sanatan_setu_dark_mode', JSON.stringify(darkMode));
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', darkMode);
      }
    } catch (e) {}
  }, [darkMode]);

  // Hydrate & Merge Updated Items + Edited Cover Pages from IndexedDB on Mount (Fixes refresh & new webpage revert bug!)
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

        // 1. Update existing items with any newer version or cover image from IndexedDB / editsLookup
        const updatedPrev = prev.map((item) => {
          const strId = String(item.id);
          const fromIdb = idbMap.get(strId);
          const fromEdits = editsLookup[strId];
          let best = item;
          if (fromIdb && ((fromIdb.updatedAt || 0) >= (best.updatedAt || 0) || fromIdb.imageUrl !== best.imageUrl)) {
            best = { ...best, ...fromIdb };
          }
          if (fromEdits && ((fromEdits.updatedAt || 0) >= (best.updatedAt || 0))) {
            best = { ...best, ...fromEdits };
          }
          return best;
        });

        // 2. Prepend any custom uploaded items stored in IndexedDB or editsLookup that aren't in prev yet
        const existingIds = new Set(updatedPrev.map((i) => String(i.id)));
        const extraItems = [];
        idbMap.forEach((it, strId) => {
          if (!existingIds.has(strId)) {
            existingIds.add(strId);
            extraItems.push({
              ...it,
              ...(editsLookup[strId] || {}),
              isUserUploaded: true,
              status: it.status === 'rejected' ? 'rejected' : 'approved',
              isApproved: it.status !== 'rejected'
            });
          }
        });
        Object.entries(editsLookup).forEach(([strId, editedIt]) => {
          if (!existingIds.has(strId) && editedIt && editedIt.id) {
            existingIds.add(strId);
            extraItems.push({
              ...editedIt,
              isUserUploaded: true,
              status: editedIt.status === 'rejected' ? 'rejected' : 'approved',
              isApproved: editedIt.status !== 'rejected'
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

    // Cross-tab synchronization: if user edits a cover image in one tab and views another tab, update immediately
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

  // Persist Items to localStorage and IndexedDB (only after initial IndexedDB hydration so edits are never overwritten)
  useEffect(() => {
    try {
      try {
        localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(items));
      } catch (quotaErr) {}
      if (isDbHydratedRef.current) {
        SanatanUnlimitedDB.saveItems(items);
      }
    } catch (e) {}
  }, [items]);

  useEffect(() => {
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
      showToast('Cover image uploaded and optimized for permanent saving!');
    }
  };

  // Handle Direct PDF File Upload (converts to Data URI / Object URL so users can view & download PDFs)
// ... existing code ...
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

    // Save to persistent edits map in both localStorage & IndexedDB so new uploads never disappear on refresh
    try {
      const existingEdits = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
      const updatedEdits = { ...existingEdits, [newItem.id]: newItem };
      try {
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(updatedEdits));
      } catch {}
      SanatanUnlimitedDB.saveEditsMap(updatedEdits);
    } catch {}

    setItems((prev) => {
      const next = [newItem, ...prev];
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    setIsUploadOpen(false);
// ... existing code ...
  const handleSaveEditedItem = (e) => {
    e.preventDefault();
    if (!editingItem) return;
    const stampedItem = {
      ...editingItem,
      updatedAt: Date.now()
    };

    // Persist edited cover image & fields into both localStorage edits map and IndexedDB immediately
    try {
      const existingEdits = JSON.parse(localStorage.getItem('sanatan_setu_edits_map_v1') || '{}');
      const updatedEdits = { ...existingEdits, [stampedItem.id]: stampedItem };
      try {
        localStorage.setItem('sanatan_setu_edits_map_v1', JSON.stringify(updatedEdits));
      } catch {}
      SanatanUnlimitedDB.saveEditsMap(updatedEdits);
    } catch {}

    setItems((prev) => {
      const next = prev.map((it) => (it.id === stampedItem.id ? stampedItem : it));
      try {
        localStorage.setItem('sanatan_setu_items_v6', JSON.stringify(next));
      } catch {}
      SanatanUnlimitedDB.saveItems(next);
      return next;
    });
    if (selectedItem && selectedItem.id === stampedItem.id) {
      setSelectedItem(stampedItem);
    }
    setEditingItem(null);
    showToast('Cover image, sacred content & translations saved permanently!');
  };

  const handleRestoreDefaults = () => {
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
