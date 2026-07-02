// ============================================================================
// i18n.ts — Internationalization for Sanatan Setu
// Supports 15 UI languages with full English + Hindi dictionaries and
// partial dictionaries for the rest, all merged over an English base.
// ============================================================================

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'ta'
  | 'te'
  | 'mr'
  | 'sa'
  | 'gu'
  | 'pa'
  | 'kn'
  | 'ml'
  | 'or'
  | 'as'
  | 'ur'
  | 'ne'

export type Language = {
  code: LanguageCode
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', direction: 'ltr' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', direction: 'ltr' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', direction: 'ltr' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', direction: 'ltr' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', direction: 'ltr' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', nativeName: 'اُردُو', direction: 'rtl' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', direction: 'ltr' },
]

export const DEFAULT_LANGUAGE: LanguageCode = 'en'

// ----------------------------------------------------------------------------
// English dictionary — the canonical source. All keys live here.
// ----------------------------------------------------------------------------
const en = {
  brandTagline: 'Bridge to Eternal Wisdom',
  searchPlaceholder: 'Search mantras, scriptures, bhajans…',
  sacredItems: 'Sacred Items',
  upload: 'Upload',
  toggleTheme: 'Toggle theme',
  search: 'Search',

  heroBadge: 'Sanatan Dharma Digital Library',
  heroTitle: 'Preserving the Eternal Wisdom of Sanatan Dharma',
  heroDescription:
    'A sacred digital library to upload, preserve, and explore Hindu religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and the timeless wisdom of the saints.',
  uploadSacredContent: 'Upload Sacred Content',
  exploreLibrary: 'Explore Library',

  statSacredItems: 'Sacred Items',
  statCategories: 'Categories',
  statEternalWisdom: 'Eternal Wisdom',

  categoriesBadge: 'Sacred Categories',
  browseByCategory: 'Browse by Category',
  categoriesSubtitle: 'Journey through the eternal streams of Sanatan Dharma',
  itemCount: 'item',
  itemsCount: 'items',

  libraryBadge: 'The Library',
  libraryTitle: 'Explore the Sacred Library',
  librarySubtitle: 'Discover mantras, scriptures, bhajans, and timeless wisdom',
  searchLibraryPlaceholder: 'Search the library…',
  all: 'All',
  allTypes: 'All Types',
  sortNewest: 'Newest',
  sortOldest: 'Oldest',
  sortPopular: 'Most Viewed',
  sortLiked: 'Most Liked',
  showing: 'Showing',
  inCategory: 'in category',
  ofType: 'of type',
  loadingContent: 'Loading sacred content…',
  noMatchesTitle: 'No matches found',
  noMatchesDesc: 'Try adjusting your search or filters to discover more sacred content.',
  emptyTitle: 'The library awaits',
  emptyDesc: 'Be the first to upload sacred content and share eternal wisdom with the world.',

  typeText: 'Text',
  typeImage: 'Image',
  typeAudio: 'Audio',
  typeVideo: 'Video',
  typeLink: 'Link',

  featured: 'Featured',
  views: 'views',
  likes: 'likes',
  justNow: 'just now',
  minutesAgo: 'min ago',
  hoursAgo: 'hours ago',
  daysAgo: 'days ago',

  bless: 'Bless',
  remove: 'Remove',
  confirmRemove: 'Remove this sacred content? This cannot be undone.',
  yesRemove: 'Yes, remove',
  cancel: 'Cancel',
  openExternal: 'Open external link',

  author: 'Author',
  source: 'Source',
  language: 'Language',

  uploadTitle: 'Upload Sacred Content',
  uploadSubtitle: 'Share mantras, scriptures, bhajans, and devotional wisdom with the world',
  titleLabel: 'Title',
  titleRequired: 'Title is required',
  descriptionLabel: 'Description',
  descriptionRequired: 'Description is required',
  descriptionPlaceholder: 'A brief summary of this sacred content…',
  categoryLabel: 'Category',
  contentTypeLabel: 'Content Type',
  bodyLabel: 'Body / Content',
  bodyPlaceholder: 'The full text of the mantra, verse, article, or commentary…',
  bodyHint: 'For text content, include the full scripture or commentary here.',
  mediaUrlLabel: 'Media URL',
  coverImageLabel: 'Cover Image URL',
  coverImageOptional: 'Optional — shown as the card thumbnail',
  descriptionLyricsLabel: 'Description / Lyrics',
  descriptionLyricsPlaceholder: 'Lyrics or description for this audio…',
  authorLabel: 'Author / Source',
  authorPlaceholder: 'e.g. Sage Valmiki, Tulsidas, Traditional',
  tagsLabel: 'Tags',
  tagsHint: 'Comma-separated keywords to help discovery',
  tagsPlaceholder: 'mantra, peace, meditation',
  markFeatured: 'Mark as featured',

  translationsSection: 'Translations',
  translationHint: 'Add translations for other languages. These will be shown when a user selects that language.',
  addTranslation: 'Add Translation',
  removeTranslation: 'Remove',
  translationLangLabel: 'Language',
  availableIn: 'Available in',
  primaryLang: 'Primary',
  originalLang: 'Original',

  admin: 'Admin',
  adminLogin: 'Admin Login',
  adminLogout: 'Logout',
  adminPassword: 'Admin Password',
  adminPasswordHint: 'Enter the admin password to publish content directly',
  adminLoginButton: 'Login',
  adminLoginFailed: 'Invalid admin password',
  adminLoggedIn: 'Admin logged in',
  adminLoggedOut: 'Logged out',

  editContent: 'Edit Content',
  editButton: 'Edit',
  saveChanges: 'Save Changes',
  saving: 'Saving…',
  contentUpdated: 'Content updated',
  updateFailed: 'Failed to update content',
  editSubtitle: 'Update the sacred content',
  unauthorized: 'Unauthorized — admin access required',

  gallerySection: 'Media Gallery',
  galleryHint: 'Add images or videos to enrich this content',
  addImage: 'Add Image',
  addVideo: 'Add Video',
  imageUrlLabel: 'Image URL',
  videoUrlLabel: 'Video URL',
  captionLabel: 'Caption',
  removeMedia: 'Remove',
  imagePlaceholder: 'https://…',
  videoPlaceholder: 'https://youtube.com/watch?v=…',

  selectChant: 'Select Chant',
  audioNowPlaying: 'Now Playing',
  audioChantingOn: 'Chanting On',
  audioChantingOff: 'Chanting Off',
  audioChantingPlaying: 'Sacred chant playing',
  audioChantingClickToPlay: 'Click to play sacred chant',
  audioVolume: 'Volume',

  blessed: 'Blessed',
  blessedFailed: 'Failed to bless',
  removed: 'Content removed',
  removeFailed: 'Failed to remove content',
  loadFailed: 'Failed to load content',

  autoTranslated: 'Auto-translated',
  translating: 'Translating…',

  footerDescription:
    'A sacred digital library dedicated to preserving and sharing the eternal wisdom of Sanatan Dharma — Vedas, Upanishads, Puranas, mantras, bhajans, and the teachings of the saints.',
  sacredStreams: 'Sacred Streams',
  contribute: 'Contribute',
  uploadContent: 'Upload Content',
  suggestCategory: 'Suggest Category',
  aboutSanatanSetu: 'About Sanatan Setu',
  madeWithDevotion: 'Made with devotion',
  footerCopyright: '© {year} Sanatan Setu. All sacred content belongs to the eternal tradition.',

  // Approval system
  pendingApproval: 'Pending Approval',
  pendingCount: '{count} pending',
  approveButton: 'Approve',
  rejectButton: 'Reject',
  approved: 'Content approved and published',
  rejected: 'Content rejected',
  pendingContent: 'Pending Content',
  submittedBy: 'Submitted by',
  awaitingApproval: 'Awaiting approval',
  contentPublished: 'Content published',
  uploadSuccessPending: 'Content submitted — awaiting admin approval',
}

// ----------------------------------------------------------------------------
// Hindi dictionary — fully translated
// ----------------------------------------------------------------------------
const hi = {
  brandTagline: 'सनातन ज्ञान का सेतु',
  searchPlaceholder: 'मन्त्र, शास्त्र, भजन खोजें…',
  sacredItems: 'पवित्र वस्तुएँ',
  upload: 'अपलोड',
  toggleTheme: 'थीम बदलें',
  search: 'खोज',

  heroBadge: 'सनातन धर्म डिजिटल पुस्तकालय',
  heroTitle: 'सनातन धर्म के शाश्वत ज्ञान का संरक्षण',
  heroDescription:
    'पवित्र डिजिटल पुस्तकालय — हिन्दू धार्मिक सामग्री को अपलोड, संरक्षित और खोजने के लिए — मन्त्र, शास्त्र, भजन, वेद, उपनिषद, पुराण और सन्तों के शाश्वत ज्ञान।',
  uploadSacredContent: 'पवित्र सामग्री अपलोड करें',
  exploreLibrary: 'पुस्तकालय देखें',

  statSacredItems: 'पवित्र वस्तुएँ',
  statCategories: 'श्रेणियाँ',
  statEternalWisdom: 'शाश्वत ज्ञान',

  categoriesBadge: 'पवित्र श्रेणियाँ',
  browseByCategory: 'श्रेणी अनुसार देखें',
  categoriesSubtitle: 'सनातन धर्म के शाश्वत स्रोतों की यात्रा',
  itemCount: 'वस्तु',
  itemsCount: 'वस्तुएँ',

  libraryBadge: 'पुस्तकालय',
  libraryTitle: 'पवित्र पुस्तकालय में विचरण करें',
  librarySubtitle: 'मन्त्र, शास्त्र, भजन और शाश्वत ज्ञान खोजें',
  searchLibraryPlaceholder: 'पुस्तकालय में खोजें…',
  all: 'सभी',
  allTypes: 'सभी प्रकार',
  sortNewest: 'सबसे नया',
  sortOldest: 'सबसे पुराना',
  sortPopular: 'सर्वाधिक देखा',
  sortLiked: 'सर्वाधिक पसंद',
  showing: 'दिखा रहे हैं',
  inCategory: 'श्रेणी में',
  ofType: 'प्रकार के',
  loadingContent: 'पवित्र सामग्री लोड हो रही है…',
  noMatchesTitle: 'कोई परिणाम नहीं मिला',
  noMatchesDesc: 'अधिक पवित्र सामग्री खोजने के लिए अपनी खोज या फ़िल्टर बदलें।',
  emptyTitle: 'पुस्तकालय प्रतीक्षा कर रहा है',
  emptyDesc: 'पवित्र सामग्री अपलोड करने वाले पहले बनें और शाश्वत ज्ञान साझा करें।',

  typeText: 'पाठ',
  typeImage: 'चित्र',
  typeAudio: 'ऑडियो',
  typeVideo: 'वीडियो',
  typeLink: 'लिंक',

  featured: 'विशेष',
  views: 'दृश्य',
  likes: 'पसंद',
  justNow: 'अभी',
  minutesAgo: 'मिनट पहले',
  hoursAgo: 'घंटे पहले',
  daysAgo: 'दिन पहले',

  bless: 'आशीर्वाद',
  remove: 'हटाएँ',
  confirmRemove: 'इस पवित्र सामग्री को हटाएँ? यह वापस नहीं होगा।',
  yesRemove: 'हाँ, हटाएँ',
  cancel: 'रद्द करें',
  openExternal: 'बाहरी लिंक खोलें',

  author: 'लेखक',
  source: 'स्रोत',
  language: 'भाषा',

  uploadTitle: 'पवित्र सामग्री अपलोड करें',
  uploadSubtitle: 'मन्त्र, शास्त्र, भजन और भक्तिमय ज्ञान संसार के साथ साझा करें',
  titleLabel: 'शीर्षक',
  titleRequired: 'शीर्षक आवश्यक है',
  descriptionLabel: 'विवरण',
  descriptionRequired: 'विवरण आवश्यक है',
  descriptionPlaceholder: 'इस पवित्र सामग्री का संक्षिप्त विवरण…',
  categoryLabel: 'श्रेणी',
  contentTypeLabel: 'सामग्री प्रकार',
  bodyLabel: 'मुख्य सामग्री',
  bodyPlaceholder: 'मन्त्र, श्लोक, लेख या टीका का पूरा पाठ…',
  bodyHint: 'पाठ सामग्री के लिए पूरा शास्त्र या टीका यहाँ दें।',
  mediaUrlLabel: 'मीडिया URL',
  coverImageLabel: 'कवर चित्र URL',
  coverImageOptional: 'वैकल्पिक — कार्ड थंबनेल के रूप में दिखेगा',
  descriptionLyricsLabel: 'विवरण / गीत',
  descriptionLyricsPlaceholder: 'इस ऑडियो के गीत या विवरण…',
  authorLabel: 'लेखक / स्रोत',
  authorPlaceholder: 'जैसे महर्षि वाल्मीकि, तुलसीदास, पारंपरिक',
  tagsLabel: 'टैग',
  tagsHint: 'खोज में सहायता के लिए अल्पविराम से विभाजित कीवर्ड',
  tagsPlaceholder: 'मन्त्र, शांति, ध्यान',
  markFeatured: 'विशेष रूप से चिह्नित करें',

  translationsSection: 'अनुवाद',
  translationHint: 'अन्य भाषाओं के लिए अनुवाद जोड़ें। जब कोई उपयोगकर्ता वह भाषा चुनेगा तो ये दिखेंगे।',
  addTranslation: 'अनुवाद जोड़ें',
  removeTranslation: 'हटाएँ',
  translationLangLabel: 'भाषा',
  availableIn: 'उपलब्ध भाषाएँ',
  primaryLang: 'मुख्य',
  originalLang: 'मूल',

  admin: 'व्यवस्थापक',
  adminLogin: 'व्यवस्थापक लॉगिन',
  adminLogout: 'लॉगआउट',
  adminPassword: 'व्यवस्थापक पासवर्ड',
  adminPasswordHint: 'सामग्री सीधे प्रकाशित करने के लिए पासवर्ड दर्ज करें',
  adminLoginButton: 'लॉगिन',
  adminLoginFailed: 'गलत व्यवस्थापक पासवर्ड',
  adminLoggedIn: 'व्यवस्थापक लॉगिन हो गया',
  adminLoggedOut: 'लॉगआउट हो गया',

  editContent: 'सामग्री संपादित करें',
  editButton: 'संपादित करें',
  saveChanges: 'परिवर्तन सहेजें',
  saving: 'सहेजा जा रहा है…',
  contentUpdated: 'सामग्री अपडेट हो गई',
  updateFailed: 'सामग्री अपडेट करने में विफल',
  editSubtitle: 'पवित्र सामग्री अपडेट करें',
  unauthorized: 'अनधिकृत — व्यवस्थापक पहुँच आवश्यक',

  gallerySection: 'मीडिया गैलरी',
  galleryHint: 'इस सामग्री को समृद्ध करने के लिए चित्र या वीडियो जोड़ें',
  addImage: 'चित्र जोड़ें',
  addVideo: 'वीडियो जोड़ें',
  imageUrlLabel: 'चित्र URL',
  videoUrlLabel: 'वीडियो URL',
  captionLabel: 'कैप्शन',
  removeMedia: 'हटाएँ',
  imagePlaceholder: 'https://…',
  videoPlaceholder: 'https://youtube.com/watch?v=…',

  selectChant: 'चयन करें',
  audioNowPlaying: 'अभी बज रहा है',
  audioChantingOn: 'चलन चालू',
  audioChantingOff: 'चलन बंद',
  audioChantingPlaying: 'पवित्र चलन चल रहा है',
  audioChantingClickToPlay: 'पवित्र चलन चलाने के लिए क्लिक करें',
  audioVolume: 'ध्वनि',

  blessed: 'आशीर्वाद दिया',
  blessedFailed: 'आशीर्वाद देने में विफल',
  removed: 'सामग्री हटा दी गई',
  removeFailed: 'सामग्री हटाने में विफल',
  loadFailed: 'सामग्री लोड करने में विफल',

  autoTranslated: 'स्वतः अनुवादित',
  translating: 'अनुवाद हो रहा है…',

  footerDescription:
    'एक पवित्र डिजिटल पुस्तकालय — सनातन धर्म के शाश्वत ज्ञान को संरक्षित और साझा करने के लिए — वेद, उपनिषद, पुराण, मन्त्र, भजन और सन्तों के उपदेश।',
  sacredStreams: 'पवित्र स्रोत',
  contribute: 'योगदान दें',
  uploadContent: 'सामग्री अपलोड करें',
  suggestCategory: 'श्रेणी सुझाएँ',
  aboutSanatanSetu: 'सनातन सेतु के बारे में',
  madeWithDevotion: 'भक्ति से बनाया गया',
  footerCopyright: '© {year} सनातन सेतु। सभी पवित्र सामग्री शाश्वत परंपरा की है।',

  // Approval system
  pendingApproval: 'स्वीकृति की प्रतीक्षा',
  pendingCount: '{count} प्रतीक्षारत',
  approveButton: 'स्वीकृत करें',
  rejectButton: 'अस्वीकृत करें',
  approved: 'सामग्री स्वीकृत और प्रकाशित',
  rejected: 'सामग्री अस्वीकृत',
  pendingContent: 'प्रतीक्षारत सामग्री',
  submittedBy: 'प्रस्तुतकर्ता',
  awaitingApproval: 'स्वीकृति की प्रतीक्षा',
  contentPublished: 'सामग्री प्रकाशित',
  uploadSuccessPending: 'सामग्री प्रस्तुत — व्यवस्थापक स्वीकृति की प्रतीक्षा',
}

// ----------------------------------------------------------------------------
// Partial dictionaries for other languages.
// brandTagline is always provided; some also have heroTitle translated.
// ----------------------------------------------------------------------------
const bn = {
  brandTagline: 'চিরন্তন জ্ঞানের সেতু',
  heroTitle: 'সনাতন ধর্মের চিরন্তন জ্ঞান সংরক্ষণ',
}

const ta = {
  brandTagline: 'நித்திய ஞானத்தின் பாலம்',
  heroTitle: 'சனாதன தர்மத்தின் நித்திய ஞானத்தைப் பாதுகாத்தல்',
}

const te = {
  brandTagline: 'శాశ్వత జ్ఞాన వారధి',
  heroTitle: 'సనాతన ధర్మం యొక్క శాశ్వత జ్ఞానం సంరక్షణ',
}

const mr = {
  brandTagline: 'शाश्वत ज्ञानाचा सेतू',
  heroTitle: 'सनातन धर्माचे शाश्वत ज्ञान जपणे',
}

const sa = {
  brandTagline: 'सनातनज्ञानसेतुः',
  heroTitle: 'सनातनधर्मस्य शाश्वतज्ञानरक्षणम्',
}

const gu = { brandTagline: 'શાશ્વત જ્ઞાનનો પુલ' }
const pa = { brandTagline: 'ਸਦੀਵੀ ਗਿਆਨ ਦਾ ਪੁਲ' }
const kn = { brandTagline: 'ಶಾಶ್ವತ ಜ್ಞಾನದ ಸೇತುವೆ' }
const ml = { brandTagline: 'ശാശ്വത ജ്ഞാനത്തിന്റെ പാലം' }
const or = { brandTagline: 'ଶାଶ୍ୱତ ଜ୍ଞାନର ସେତୁ' }
const as = { brandTagline: 'চিৰন্তন জ্ঞানৰ সেতু' }
const ur = { brandTagline: 'ابدی حکمت کا پل' }
const ne = { brandTagline: 'शाश्वत ज्ञानको पुल' }

// ----------------------------------------------------------------------------
// TRANSLATIONS — typed as Record<LanguageCode, Partial<Dict>>.
// Cast `en` to the canonical Dict type so consumers get full typing.
// ----------------------------------------------------------------------------
export type Dict = typeof en

export const TRANSLATIONS: Record<LanguageCode, Partial<Dict>> = {
  en,
  hi: hi as Partial<Dict>,
  bn: bn as Partial<Dict>,
  ta: ta as Partial<Dict>,
  te: te as Partial<Dict>,
  mr: mr as Partial<Dict>,
  sa: sa as Partial<Dict>,
  gu: gu as Partial<Dict>,
  pa: pa as Partial<Dict>,
  kn: kn as Partial<Dict>,
  ml: ml as Partial<Dict>,
  or: or as Partial<Dict>,
  as: as as Partial<Dict>,
  ur: ur as Partial<Dict>,
  ne: ne as Partial<Dict>,
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

/** Get the Language object for a given code (falls back to English). */
export function getLanguage(code: string | undefined | null): Language {
  if (!code) return LANGUAGES[0]
  const found = LANGUAGES.find((l) => l.code === code)
  return found ?? LANGUAGES[0]
}

/** Merge a partial dictionary over the English base so all keys exist. */
export function getDict(code: string | undefined | null): Dict {
  const lang = getLanguage(code)
  const partial = TRANSLATIONS[lang.code] ?? {}
  return { ...en, ...partial } as Dict
}

// Map a UI language code to the content language string used in the DB
// (matching the LANGUAGES array in src/lib/categories.ts).
export function uiLangToContentLang(uiLang: LanguageCode): string {
  const map: Record<LanguageCode, string> = {
    en: 'English',
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi',
    sa: 'Sanskrit',
    gu: 'Gujarati',
    pa: 'Punjabi',
    kn: 'Kannada',
    ml: 'Malayalam',
    or: 'Odia',
    as: 'Assamese',
    ur: 'Urdu',
    ne: 'Nepali',
  }
  return map[uiLang] ?? 'English'
}

// ----------------------------------------------------------------------------
// Sacred quotes — shown in the QuoteBanner.
// ----------------------------------------------------------------------------
export const quotes: { text: string; trans: string }[] = [
  {
    text: 'ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥',
    trans: 'Oṁ. Lead me from the unreal to the real, from darkness to light, from death to immortality.',
  },
  {
    text: 'वसुधैव कुटुम्बकम्',
    trans: 'The whole world is one family.',
  },
  {
    text: 'सत्यं शिवं सुन्दरम्',
    trans: 'Truth, Auspiciousness, Beauty — the threefold nature of the Divine.',
  },
  {
    text: 'योगः कर्मसु कौशलम्',
    trans: 'Yoga is skill in action. — Bhagavad Gita 2.50',
  },
]
