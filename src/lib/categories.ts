// Categories for Sanatan Dharma content
export type Category = {
  name: string
  description: string
  sanskrit: string
  icon: string // emoji-style glyph
  accent: string // tailwind bg class
}

export const CATEGORIES: Category[] = [
  {
    name: "Vedas",
    description: "The eternal shruti — Rigveda, Yajurveda, Samaveda, Atharvaveda",
    sanskrit: "वेद",
    icon: "VED",
    accent: "from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40",
  },
  {
    name: "Upanishads",
    description: "Philosophical teachings on Brahman, Atman, and liberation",
    sanskrit: "उपनिषद्",
    icon: "UPN",
    accent: "from-rose-100 to-red-100 dark:from-rose-950/40 dark:to-red-950/40",
  },
  {
    name: "Bhagavad Gita",
    description: "Krishna's teachings to Arjuna on dharma, karma, and bhakti",
    sanskrit: "श्रीमद्भगवद्गीता",
    icon: "BG",
    accent: "from-yellow-100 to-amber-100 dark:from-yellow-950/40 dark:to-amber-950/40",
  },
  {
    name: "Ramayana",
    description: "The epic of Lord Rama by Sage Valmiki",
    sanskrit: "रामायण",
    icon: "RM",
    accent: "from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40",
  },
  {
    name: "Mahabharata",
    description: "The great epic featuring the Pandavas, Kauravas, and Lord Krishna",
    sanskrit: "महाभारत",
    icon: "MB",
    accent: "from-orange-100 to-red-100 dark:from-orange-950/40 dark:to-red-950/40",
  },
  {
    name: "Puranas",
    description: "Eighteen sacred texts narrating the deeds of Vishnu, Shiva, Devi",
    sanskrit: "पुराण",
    icon: "PUR",
    accent: "from-purple-100 to-fuchsia-100 dark:from-purple-950/40 dark:to-fuchsia-950/40",
  },
  {
    name: "Mantras",
    description: "Sacred chants and invocations from the Vedic and Tantric traditions",
    sanskrit: "मन्त्र",
    icon: "MTR",
    accent: "from-saffron-100 to-amber-100 dark:from-amber-950/40 dark:to-orange-950/40",
  },
  {
    name: "Bhajans",
    description: "Devotional songs glorifying the divine in many forms",
    sanskrit: "भजन",
    icon: "BHJ",
    accent: "from-pink-100 to-rose-100 dark:from-pink-950/40 dark:to-rose-950/40",
  },
  {
    name: "Festivals",
    description: "Sacred celebrations — Diwali, Holi, Navaratri, Janmashtami, and more",
    sanskrit: "उत्सव",
    icon: "UTS",
    accent: "from-lime-100 to-emerald-100 dark:from-lime-950/40 dark:to-emerald-950/40",
  },
  {
    name: "Temples",
    description: "Sacred shrines, their history, architecture, and significance",
    sanskrit: "मन्दिर",
    icon: "MDR",
    accent: "from-stone-100 to-amber-100 dark:from-stone-950/40 dark:to-amber-950/40",
  },
  {
    name: "Philosophy",
    description: "Darshanas — Yoga, Vedanta, Samkhya, Nyaya, Vaisheshika, Mimamsa",
    sanskrit: "दर्शन",
    icon: "DRS",
    accent: "from-sky-100 to-cyan-100 dark:from-sky-950/40 dark:to-cyan-950/40",
  },
  {
    name: "Sant Teachings",
    description: "Wisdom of saints — Tulsidas, Mirabai, Kabir, Ramakrishna, Vivekananda",
    sanskrit: "सन्त",
    icon: "SNT",
    accent: "from-indigo-100 to-blue-100 dark:from-indigo-950/40 dark:to-blue-950/40",
  },
]

export const LANGUAGES = [
  "Sanskrit",
  "Hindi",
  "English",
  "Awadhi",
  "Tamil",
  "Telugu",
  "Bengali",
  "Marathi",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Pali",
  "Prakrit",
]

export const CONTENT_TYPES = [
  { value: "text", label: "Text / Scripture", description: "Mantra, verse, article, or commentary" },
  { value: "image", label: "Image", description: "Sacred image, deity photo, or temple picture" },
  { value: "audio", label: "Audio", description: "Chanting, bhajan, or lecture recording" },
  { value: "video", label: "Video", description: "Discourse, ritual, or documentary" },
  { value: "link", label: "External Link", description: "Link to external resource" },
] as const

export type ContentType = (typeof CONTENT_TYPES)[number]["value"]

// Helper to get the category object by name
export function getCategoryName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.name === name)
}

// Helper to get the native display name for a content language string
export function getLanguageNativeName(language: string): string {
  const found = LANGUAGES.find((l) => l === language)
  return found ?? language
}

// Helper to look up a content type by value
export function getContentType(value: string) {
  return CONTENT_TYPES.find((t) => t.value === value)
}
