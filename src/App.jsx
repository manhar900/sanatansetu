import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, Upload, BookOpen, Sparkles, Heart, Bookmark,
  Eye, Volume2, VolumeX, RotateCcw, Play, Pause,
  ArrowLeft, X, Flame, Award, Clock
} from 'lucide-react';

export const SanatanSetuLogo = ({ size = 44, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={`shrink-0 shadow-md rounded-xl ${className}`}
  >
    <defs>
      <linearGradient id="sanatanBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="14" fill="url(#sanatanBg)" />
    <g fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M44 12c-2.2 0-4 1.6-4 3.8 0 2 1.6 3.4 3.6 3.4 1.4 0 2.5-0.9 2.5-2.3 0-1.3-0.9-2.2-2.2-2.2-0.6 0-1.2 0.2-1.5 0.5" />
      <circle cx="40" cy="23" r="1.5" fill="#ffffff" stroke="none" />
      <path d="M48 29c2.3 2.3 3.6 5.3 3.6 8.2 0 5.5-4.2 9.2-9.2 9.2-3.7 0-6.4-1.8-7.8-4.6-1.7 2.8-4.6 4.6-8.3 4.6-4.6 0-8.2-3.7-8.2-8.2 0-3.5 2-6.6 5.2-7.8" />
      <path d="M14 31c1.8-3.1 5-5 8.6-5 4.2 0 7.7 2.4 8.8 6.4" />
      <path d="M52 27c-2.8-1.8-6.4-2.2-9.2 0" />
    </g>
  </svg>
);

export const CATEGORIES = [
  { id: 'Vedas', code: 'VED', name: 'Vedas', sanskrit: 'वेद', description: 'The eternal shruti — Rigveda, Yajurveda, Samaveda, Atharvaveda', count: 2 },
  { id: 'Upanishads', code: 'UPN', name: 'Upanishads', sanskrit: 'उपनिषद्', description: 'Philosophical teachings on Brahman, Atman, and liberation', count: 1 },
  { id: 'Bhagavad Gita', code: 'BG', name: 'Bhagavad Gita', sanskrit: 'श्रीमद्भगवद्गीता', description: "Krishna's teachings to Arjuna on dharma, karma, and bhakti", count: 1 },
  { id: 'Ramayana', code: 'RM', name: 'Ramayana', sanskrit: 'रामायण', description: 'The epic of Lord Rama by Sage Valmiki', count: 1 },
  { id: 'Mahabharata', code: 'MB', name: 'Mahabharata', sanskrit: 'महाभारत', description: 'The great epic featuring the Pandavas, Kauravas, and Lord Krishna', count: 1 },
  { id: 'Puranas', code: 'PUR', name: 'Puranas', sanskrit: 'पुराण', description: 'Eighteen sacred texts narrating the deeds of Vishnu, Shiva, Devi', count: 1 },
  { id: 'Mantras', code: 'MTR', name: 'Mantras', sanskrit: 'मन्त्र', description: 'Sacred chants and invocations from the Vedic and Tantric traditions', count: 5 },
  { id: 'Bhajans', code: 'BHJ', name: 'Bhajans', sanskrit: 'भजन', description: 'Devotional songs glorifying the divine in many forms', count: 2 },
  { id: 'Festivals', code: 'UTS', name: 'Festivals', sanskrit: 'उत्सव', description: 'Sacred celebrations — Diwali, Holi, Navaratri, Janmashtami, and more', count: 1 },
  { id: 'Temples', code: 'MDR', name: 'Temples', sanskrit: 'मन्दिर', description: 'Sacred shrines, their history, architecture, and significance', count: 6 },
  { id: 'Philosophy', code: 'DRS', name: 'Philosophy', sanskrit: 'दर्शन', description: 'Darshanas — Yoga, Vedanta, Samkhya, Nyaya, Vaisheshika, Mimamsa', count: 1 },
  { id: 'Sant Teachings', code: 'SNT', name: 'Sant Teachings', sanskrit: 'सन्त', description: 'Wisdom of saints — Tulsidas, Mirabai, Kabir, Ramakrishna, Vivekananda', count: 1 }
];

export const INITIAL_SACRED_ITEMS = [
  {
    id: 'jagannath-temple-puri',
    title: 'Jagannath Temple (Puri): The Eastern Abode of the Lord of the Universe',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate guide to Jagannath Puri Dham. Discover the mystery of the wooden deities, the world-famous Rath Yatra, the grand Kalinga architecture, and the sacred Mahaprasad.',
    views: 68, likes: 1, language: 'English', author: 'Skanda Purana & Temple Chronicles',
    imageUrl: 'https://i.postimg.cc/9MvdM5j8/jagannath-puri.jpg',
    tags: ['jagannath', 'puri', 'char-dham', 'odisha'], featured: true,
    body: {
      English: 'Shree Jagannath Temple in Puri, Odisha, is one of the four sacred Char Dham pilgrimage sites of Sanatan Dharma. Dedicated to Lord Jagannath along with Balabhadra and Subhadra, it is famous for its wooden Daru Brahma deities, the annual Rath Yatra, the Nila Chakra atop the 214-foot Kalinga spire, and the sacred Mahaprasad.',
      Hindi: 'पुरी (ओडिशा) स्थित श्री जगन्नाथ मंदिर सनातन धर्म के चार धामों में से एक है। यहाँ की रथ यात्रा, दारु ब्रह्म विग्रह और महाप्रसाद विश्वप्रसिद्ध हैं।',
      Sanskrit: 'नीलाचलनिवासाय नित्याय परमात्मने । बलभद्रसुभद्राभ्यां जगन्नाथाय ते नमः ॥'
    }
  },
  {
    id: 'kamakhya-temple-assam',
    title: 'Kamakhya Temple: The Womb of the Cosmic Mother (Maha Shaktipeeth)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: "A comprehensive guide to the Kamakhya Temple in Assam. Discover the deep Tantric roots, the legend of Sati's sacrifice, and the mysteries of the Ambubachi Mela at this supreme Shaktipeeth.",
    views: 50, likes: 0, language: 'Sanskrit', author: 'Kalika Purana & Yogini Tantra',
    imageUrl: 'https://i.postimg.cc/3w9hKgV4/kamakhya-temple.jpg',
    tags: ['kamakhya', 'shaktipeeth', 'assam', 'devi'], featured: false,
    body: {
      English: 'Situated atop Nilachal Hill in Guwahati, Assam, Kamakhya Temple is the supreme Maha Shaktipeeth honoring the creative feminine power (Shakti) and the annual Ambubachi Mela.',
      Hindi: 'असम के नीलाचल पर्वत पर स्थित कामाख्या मंदिर 51 शक्तिपीठों में सर्वोच्च महाशक्तिपीठ है।',
      Sanskrit: 'कामाख्ये वरदे देवि नीलपर्वतवासिनि । त्वं देवि जगतां मातर्योनिमुद्रे नमोऽस्तु ते ॥'
    }
  },
  {
    id: 'badrinath-dham-himalaya',
    title: 'Badrinath Dham: The Supreme Himalayan Abode of Lord Vishnu',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate guide to Badrinath Dham, the most prominent of the Char Dhams. Explore its ancient origins, the legend of Nar-Narayan, the Tapt Kund, and the mystery of the 6-month Akhand Jyoti.',
    views: 48, likes: 1, language: 'Sanskrit', author: 'Skanda Purana',
    imageUrl: 'https://i.postimg.cc/8c3KzDkL/badrinath-dham.jpg',
    tags: ['badrinath', 'vishnu', 'char-dham'], featured: false,
    body: {
      English: 'Located along the Alaknanda River in Uttarakhand between the Nar and Narayan peaks, Badrinath Dham houses the Swayambhu Shaligram murti of Lord Badri Vishal and the sacred Akhand Jyoti.',
      Hindi: 'उत्तराखंड में अलकनंदा तट पर स्थित बद्रीनाथ धाम भगवान विष्णु का परम हिमालयी धाम है।',
      Sanskrit: 'तप्तकुण्डे विशुद्धात्मा बदरीवनमध्यगः । नारायणं नमस्कृत्य नरो मुच्येत बन्धनात् ॥'
    }
  },
  {
    id: 'sri-ranganathaswamy-temple',
    title: 'Sri Ranganathaswamy Temple: The Largest Functioning Hindu Temple in the World',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'The ultimate, comprehensive guide to the Sri Ranganathaswamy Temple in Srirangam. Explore its 156-acre architecture, the legend of Vibhishana, the 7 Prakaras, historical invasions, and unique divine rituals.',
    views: 70, likes: 0, language: 'English', author: 'Divya Prabandham',
    imageUrl: 'https://i.postimg.cc/9F7K7W1N/sri-ranganathaswamy.jpg',
    tags: ['srirangam', 'ranganatha', 'vishnu'], featured: true,
    body: {
      English: 'Spanning 156 acres in Srirangam, Tamil Nadu, with 7 concentric Prakaras and 21 Gopurams, Sri Ranganathaswamy Temple is the foremost of the 108 Divya Desams of Lord Vishnu.',
      Hindi: 'श्रीरंगम में 156 एकड़ में फैला श्री रंगनाथस्वामी मंदिर विश्व का सबसे बड़ा कार्यरत हिंदू मंदिर है।',
      Sanskrit: 'कावेरीविरजा सेयं वैकुण्ठं रङ्गमन्दिरम् । स वासुदेवो रङ्गेशः प्रत्यक्षं परमं पदम् ॥'
    }
  },
  {
    id: 'angkor-wat-vishnu-temple',
    title: 'Angkor Wat: The Cosmic Temple of Lord Vishnu (Cambodia)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Discover Angkor Wat, the largest religious monument in the world. Explore its stunning Khmer architecture, its dedication to Lord Vishnu, and the ancient Hindu epics carved into its stone walls.',
    views: 44, likes: 0, language: 'English', author: 'Khmer Epigraphy',
    imageUrl: 'https://i.postimg.cc/B63wB8g4/angkor-wat.jpg',
    tags: ['angkor-wat', 'vishnu', 'cambodia'], featured: false,
    body: {
      English: 'Built in the 12th century by King Suryavarman II in Cambodia and consecrated to Lord Vishnu, Angkor Wat features Mount Meru towers and vast bas-reliefs of the Samudra Manthan, Ramayana, and Mahabharata.',
      Hindi: 'कंबोडिया में सम्राट सूर्यवर्मन द्वितीय द्वारा निर्मित अंकोरवाट भगवान विष्णु को समर्पित विश्व का सबसे बड़ा धार्मिक स्मारक है।',
      Sanskrit: 'परमविष्णुलोकाय मेरुशिखररूपिणे । समुद्रमन्थनगाथायै नमोऽस्तु विश्वकर्मणे ॥'
    }
  },
  {
    id: 'sant-teachings-bhakti-movement',
    title: 'Sant Teachings: The Bhakti Movement and the Path of Divine Love',
    category: 'Sant Teachings',
    sanskritBadge: 'सन्त · Sant Teachings',
    contentType: 'Text',
    description: 'Explore the rich Sant Parampara of Sanatan Dharma. Discover the Bhakti movement, the poetry of divine love, and the core teachings of mystics like Kabir, Tulsidas, and Mirabai.',
    views: 45, likes: 0, language: 'English', author: 'Sant Parampara Anthology',
    imageUrl: 'https://i.postimg.cc/K8J75Z6C/sant-teachings.jpg',
    tags: ['bhakti', 'tulsidas', 'mirabai', 'kabir'], featured: false,
    body: {
      English: 'The Sant Parampara—including Goswami Tulsidas, Mirabai, Kabir, Tukaram, Ramakrishna Paramahamsa, and Swami Vivekananda—illuminated the path of direct devotional love (Bhakti).',
      Hindi: 'संत परम्परा में तुलसीदास, मीराबाई, कबीरदास, रामकृष्ण परमहंस और स्वामी विवेकानंद की वाणी आत्मा का मार्गदर्शन करती है।',
      Sanskrit: 'सा विद्या या विमुक्तये । भक्तेः परतरं न हि किञ्चिदस्ति ॥'
    }
  },
  {
    id: 'hindu-philosophy-shad-darshana',
    title: 'Hindu Philosophy: The Six Orthodox Schools (Shad Darshana)',
    category: 'Philosophy',
    sanskritBadge: 'दर्शन · Philosophy',
    contentType: 'Text',
    description: 'Explore the deep philosophical roots of Sanatan Dharma. Discover the Shad Darshana (the six orthodox systems of Indian philosophy), including Vedanta, Yoga, and Nyaya.',
    views: 53, likes: 0, language: 'English', author: 'Vedic Darshana Tradition',
    imageUrl: 'https://i.postimg.cc/0jK8fX5B/shad-darshana.jpg',
    tags: ['darshana', 'vedanta', 'yoga', 'nyaya'], featured: false,
    body: {
      English: 'The Six Orthodox Schools (Shad Darshana) are Samkhya (Kapila), Yoga (Patanjali), Nyaya (Gautama), Vaisheshika (Kanada), Purva Mimamsa (Jaimini), and Vedanta (Badarayana Vyasa).',
      Hindi: 'षड्दर्शन भारतीय आस्तिक दर्शन की छह प्रमुख शाखाएँ हैं — सांख्य, योग, न्याय, वैशेषिक, मीमांसा और वेदान्त।',
      Sanskrit: 'योगश्चित्तवृत्तिनिरोधः । तदा द्रष्टुः स्वरूपेऽवस्थानम् ॥'
    }
  },
  {
    id: 'hindu-temples-sacred-architecture',
    title: 'Hindu Temples: The Sacred Architecture of the Divine (Mandir)',
    category: 'Temples',
    sanskritBadge: 'मन्दिर · Temples',
    contentType: 'Text',
    description: 'Explore the spiritual significance, ancient architectural styles (Nagara and Dravida), and the profound philosophical meaning behind the design of Hindu temples.',
    views: 41, likes: 0, language: 'Sanskrit', author: 'Shilpa Shastra & Agama Tradition',
    imageUrl: 'https://i.postimg.cc/Hn04ZpXn/hindu-temples.jpg',
    tags: ['mandir', 'architecture', 'nagara', 'dravida'], featured: false,
    body: {
      English: 'Designed according to Vastu Purusha Mandala and Shilpa Shastra in Nagara, Dravida, and Vesara styles, the Mandir maps the human body and the cosmos around the Garbhagriha.',
      Hindi: 'हिंदू मंदिर वास्तुकला (नागर और द्रविड़ शैली) ब्रह्माण्ड और मानव देह का दिव्य प्रतीक है।',
      Sanskrit: 'देहो देवालयः प्रोक्तः जीवो देवः सनातनः ॥'
    }
  },
  {
    id: 'hindu-festivals-utsav-vrat',
    title: 'Hindu Festivals: The Cycle of Devotion, Seasons, and Dharma (Utsav & Vrat)',
    category: 'Festivals',
    sanskritBadge: 'उत्सव · Festivals',
    contentType: 'Text',
    description: 'Discover the spiritual significance of the major festivals in Sanatan Dharma. Explore how Utsav (celebration) and Vrat (fasting) connect devotion, nature, and community.',
    views: 44, likes: 0, language: 'English', author: 'Smriti & Panchanga Tradition',
    imageUrl: 'https://i.postimg.cc/k4G6Vp7b/hindu-festivals.jpg',
    tags: ['diwali', 'holi', 'navaratri', 'janmashtami'], featured: false,
    body: {
      English: 'Utsav (celebration) and Vrat (sacred observance) harmonize human life with cosmic rhythms through Diwali, Navaratri, Maha Shivaratri, Janmashtami, Rama Navami, and Holi.',
      Hindi: 'दीपावली, नवरात्रि, महाशिवरात्रि, जन्माष्टमी और होली धर्म, प्रकृति और भक्ति के पावन पर्व हैं।',
      Sanskrit: 'तमसो मा ज्योतिर्गमय । सर्वे भवन्तु सुखिनः ॥'
    }
  },
  {
    id: 'puranas-18-maha-puranas',
    title: 'The Puranas: Introduction and Guide to the 18 Maha Puranas',
    category: 'Puranas',
    sanskritBadge: 'पुराण · Puranas',
    contentType: 'Text',
    description: 'Explore the Puranas, the vast encyclopedias of Sanatan Dharma. Discover the meaning, the five characteristics, and a summary of the 18 Maha Puranas.',
    views: 52, likes: 0, language: 'English', author: 'Maharishi Vedavyasa',
    imageUrl: 'https://i.postimg.cc/J0v0wT4z/puranas-guide.jpg',
    tags: ['puranas', 'vedavyasa', 'bhagavata'], featured: false,
    body: {
      English: 'Compiled by Maharishi Vedavyasa, the 18 Maha Puranas expound Vedic truth through the five characteristics (Pancha Lakshana): creation, re-creation, divine genealogies, cosmic cycles, and royal lineages.',
      Hindi: 'महर्षि वेदव्यास रचित 18 महापुराण वैदिक सत्य को कथाओं और भक्ति के माध्यम से स्पष्ट करते हैं।',
      Sanskrit: 'सर्गश्च प्रतिसर्गश्च वंशो मन्वन्तराणि च । वंशानुचरितं चैव पुराणं पञ्चलक्षणम् ॥'
    }
  },
  {
    id: 'mahabharata-epic-summary',
    title: 'The Mahabharata: Introduction, Epic Summary, and Core Teachings',
    category: 'Mahabharata',
    sanskritBadge: 'महाभारत · Mahabharata',
    contentType: 'Text',
    description: 'Explore the Mahabharata, the greatest epic of Sanatan Dharma. Learn about the story of the Pandavas and Kauravas, the Kurukshetra War, and the profound teachings of Dharma.',
    views: 68, likes: 1, language: 'English', author: 'Maharishi Vedavyasa',
    imageUrl: 'https://i.postimg.cc/SNwP99G1/mahabharata-summary.jpg',
    tags: ['mahabharata', 'pandavas', 'krishna', 'dharma'], featured: true,
    body: {
      English: 'Spanning 100,000 verses across 18 Parvas, Maharishi Vedavyasa’s Mahabharata chronicles the Pandavas and Kauravas, contains the Bhagavad Gita, and proclaims: Yato Dharmastato Jayah.',
      Hindi: 'महर्षि वेदव्यास रचित महाभारत धर्म और कर्म का महान ग्रंथ है जिसका उद्घोष है — यतो धर्मस्ततो जयः।',
      Sanskrit: 'यतो धर्मस्ततो जयः ॥'
    }
  },
  {
    id: 'upanishads-10-principal-texts',
    title: 'The Upanishads: Introduction and Guide to the 10 Principal Texts',
    category: 'Upanishads',
    sanskritBadge: 'उपनिषद् · Upanishads',
    contentType: 'Text',
    description: 'Discover the profound philosophy of the Upanishads (Vedanta). Explore the meaning, themes, and summaries of the 10 Principal (Mukhya) Upanishads of Sanatan Dharma.',
    views: 48, likes: 0, language: 'English', author: 'Vedic Rishis',
    imageUrl: 'https://i.postimg.cc/7ZhM3hT5/upanishads-guide.jpg',
    tags: ['upanishads', 'vedanta', 'brahman', 'atman'], featured: false,
    body: {
      English: 'The 10 Mukhya Upanishads (Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka) form the philosophical summit of the Vedas (Vedanta).',
      Hindi: 'दस मुख्य उपनिषद् आत्मा और परब्रह्म की एकता (तत्त्वमसि, अहं ब्रह्मास्मि) का बोध कराते हैं।',
      Sanskrit: 'ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ॥'
    }
  },
  {
    id: 'maa-ambe-sarv-kamna-siddh-prarthana',
    title: 'Maa Ambe Ki Sarv Kamna Siddh Prarthana: Full Lyrics + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Mantras',
    contentType: 'Text',
    description: 'Read the powerful Maa Ambe Ki Sarv Kamna Siddh Prarthana. This sacred prayer invokes the various forms of the Goddess to fulfill all virtuous desires and grant spiritual devotion.',
    views: 104, likes: 5, language: 'English', author: 'Shakta Devotional Tradition',
    imageUrl: 'https://i.postimg.cc/xT3xvvb6/maa-ambe-prarthana.jpg',
    tags: ['🙏', 'maa-ambe', 'durga', 'prarthana'], featured: true,
    body: {
      English: 'Sarva Mangala Mangalye Shive Sarvartha Sadhike, Sharanye Tryambake Gauri Narayani Namostute — sacred prayer to Mother Ambe for devotion, peace, and fulfillment of righteous wishes.',
      Hindi: 'सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      Sanskrit: 'या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता । नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः ॥'
    }
  },
  {
    id: 'ambe-tu-hai-jagdambe-kali-aarti',
    title: 'Ambe Tu Hai Jagdambe Kali Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Bhajans',
    contentType: 'Text',
    description: 'Read the powerful Ambe Tu Hai Jagdambe Kali Aarti. Includes the complete lyrics in Hindi, English transliteration, and detailed spiritual meaning for your daily worship.',
    views: 107, likes: 3, language: 'English', author: 'Traditional Devi Aarti',
    imageUrl: 'https://i.postimg.cc/NjYw98w0/ambe-tu-hai-jagdambe.jpg',
    tags: ['aarti', 'jagdambe', 'kali', 'durga'], featured: false,
    body: {
      English: 'Ambe Tu Hai Jagdambe Kali, Jai Durge Khappar Wali, Tere Hi Gun Gaaye Bharati, O Maiya Hum Sab Utarey Teri Aarti!',
      Hindi: 'अम्बे तू है जगदम्बे काली, जय दुर्गे खप्पर वाली, तेरे ही गुण गाए भारती, ओ मैया हम सब उतारे तेरी आरती॥',
      Sanskrit: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके ॥'
    }
  },
  {
    id: 'shri-hanuman-chalisa-full',
    title: 'Shri Hanuman Chalisa: Full Lyrics (Hindi & English) + Meaning',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Mantras',
    contentType: 'Text',
    description: 'Read the complete Shri Hanuman Chalisa with lyrics in Hindi and English. Discover the line-by-line meaning, spiritual benefits, and history of this powerful hymn.',
    views: 121, likes: 4, language: 'English', author: 'Goswami Tulsidas',
    imageUrl: 'https://i.postimg.cc/BZ24xKx2/hanuman-chalisa.jpg',
    tags: ['hanuman-chalisa', 'tulsidas', 'bajrangbali'], featured: true,
    body: {
      English: 'Jai Hanuman Gyan Gun Sagar, Jai Kapis Tihun Lok Ujagar! Composed by Goswami Tulsidas in 40 verses invoking Lord Hanuman for strength, wisdom, and fearlessness.',
      Hindi: 'श्रीगुरु चरन सरोज रज, निज मनु मुकुरु सुधारि... जय हनुमान ज्ञान गुन सागर, जय कपीस तिहुँ लोक उजागर॥',
      Sanskrit: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् ॥'
    }
  },
  {
    id: 'jai-ambe-gauri-aarti',
    title: 'Jai Ambe Gauri Aarti: Full Lyrics (Hindi & English) + Meaning',
    category: 'Bhajans',
    sanskritBadge: 'भजन · Bhajans',
    contentType: 'Text',
    description: 'Read the complete Jai Ambe Gauri Aarti dedicated to Goddess Durga. Features full lyrics in Hindi and English, along with the deep spiritual meaning of each verse.',
    views: 90, likes: 4, language: 'Hindi', author: 'Traditional Shakta Aarti',
    imageUrl: 'https://i.postimg.cc/44N91P3b/jai-ambe-gauri.jpg',
    tags: ['maa❣️', 'jai-ambe-gauri', 'durga-aarti'], featured: false,
    body: {
      English: 'Jai Ambe Gauri, Maiya Jai Shyama Gauri, Tumko Nishadin Dhyavat, Hari Brahma Shivri!',
      Hindi: 'जय अम्बे गौरी, मैया जय श्यामा गौरी। तुमको निशिदिन ध्यावत, हरि ब्रह्मा शिवरी॥',
      Sanskrit: 'सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते । भयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते ॥'
    }
  },
  {
    id: 'om-aum-mantra-meaning',
    title: 'Om (Aum) Mantra: Deep Meaning, Significance, and Benefits',
    category: 'Vedas',
    sanskritBadge: 'वेद · Vedas',
    contentType: 'Text',
    description: 'Discover the profound meaning of Om (ॐ), the most sacred syllable in Sanatan Dharma. Learn the philosophy of A-U-M, how to chant it, and its spiritual benefits.',
    views: 127, likes: 6, language: 'English', author: 'Mandukya Upanishad',
    imageUrl: 'https://i.postimg.cc/8zQ0ZcR6/om-mantra.jpg',
    tags: ['🕉️', 'om', 'pranava', 'meditation'], featured: true,
    body: {
      English: 'Om (ॐ / Pranava) is the primordial sound of Brahman representing waking (A), dream (U), deep sleep (M), and transcendental Turiya silence.',
      Hindi: 'ॐ (प्रणव) सनातन धर्म का सर्वोच्च और अनादि नाद है जो परब्रह्म चेतना का बोध कराता है।',
      Sanskrit: 'ओमित्येतदक्षरमिदं सर्वं तस्योपव्याख्यानम् ॥'
    }
  },
  {
    id: 'mahalakshmi-ashtakam',
    title: 'Mahalakshmi Ashtakam',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Mantras',
    contentType: 'Text',
    description: 'An eight-verse hymn glorifying Goddess Lakshmi, the deity of wealth and prosperity.',
    views: 61, likes: 24, language: 'Sanskrit', author: 'Padma Purana (Lord Indra)',
    imageUrl: 'https://i.postimg.cc/C1bCgcvR/mahalakshmi-ashtakam.jpg',
    tags: ['lakshmi', 'wealth', 'prosperity'], featured: true,
    body: {
      English: 'Namastestu Mahamaye Shreepeethe Surapoojite, Shankha Chakra Gadahaaste Mahalakshmi Namostute!',
      Hindi: 'हे महामाये! श्रीपीठ पर स्थित, शंख, चक्र और गदा धारण करने वाली माँ महालक्ष्मी, आपको नमस्कार है।',
      Sanskrit: 'नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते । शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥'
    }
  },
  {
    id: 'the-four-vedas-introduction',
    title: 'The Four Vedas - An Introduction',
    category: 'Vedas',
    sanskritBadge: 'वेद · Vedas',
    contentType: 'Text',
    description: 'A brief introduction to the four foundational scriptures of Hinduism.',
    views: 61, likes: 2, language: 'English', author: 'Apaurusheya Shruti',
    imageUrl: 'https://i.postimg.cc/0j59mSkg/four-vedas.jpg',
    tags: ['vedas', 'rigveda', 'yajurveda'], featured: false,
    body: {
      English: 'The four Vedas—Rigveda, Yajurveda, Samaveda, and Atharvaveda—are the foundational Shruti scriptures of Sanatan Dharma.',
      Hindi: 'ऋग्वेद, यजुर्वेद, सामवेद और अथर्ववेद सनातन धर्म के चार अपौरुषेय मूल ग्रंथ हैं।',
      Sanskrit: 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् ॥'
    }
  },
  {
    id: 'story-of-ramas-exile',
    title: "The Story of Rama's Exile",
    category: 'Ramayana',
    sanskritBadge: 'रामायण · Ramayana',
    contentType: 'Text',
    description: 'An overview of the Ayodhya Kanda from the Ramayana - the exile of Lord Rama.',
    views: 72, likes: 1, language: 'English', author: 'Maharishi Valmiki',
    imageUrl: 'https://i.postimg.cc/PqbhYWW0/rama-exile.jpg',
    tags: ['rama', 'ayodhya', 'exile'], featured: false,
    body: {
      English: 'In the Ayodhya Kanda of Valmiki Ramayana, Sri Rama upholds his father King Dasharatha’s word with serene equanimity and enters the forest for fourteen years with Sita and Lakshmana.',
      Hindi: 'वाल्मीकि रामायण के अयोध्या काण्ड में श्री राम सत्य और धर्म की रक्षा हेतु चौदह वर्ष का वनवास स्वीकार करते हैं।',
      Sanskrit: 'रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ॥'
    }
  },
  {
    id: 'mahamrityunjaya-mantra',
    title: 'Mahamrityunjaya Mantra',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Mantras',
    contentType: 'Text',
    description: 'The death-conquering mantra dedicated to Lord Shiva for healing and protection.',
    views: 169, likes: 25, language: 'Sanskrit', author: 'Rishi Markandeya (Rigveda 7.59.12)',
    imageUrl: 'https://i.postimg.cc/mD8T117T/mahamrityunjaya.jpg',
    tags: ['shiva', 'healing', 'protection'], featured: true,
    body: {
      English: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam, Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat.',
      Hindi: 'हम त्रिनेत्रधारी भगवान शिव की आराधना करते हैं, वे हमें मृत्यु और भय के बंधनों से मुक्त कर अमृतत्व प्रदान करें।',
      Sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥'
    }
  },
  {
    id: 'bhagavad-gita-ch2-v47',
    title: 'Bhagavad Gita - Chapter 2, Verse 47',
    category: 'Bhagavad Gita',
    sanskritBadge: 'श्रीमद्भगवद्गीता · Bhagavad Gita',
    contentType: 'Text',
    description: 'The defining verse on Karma Yoga - the yoga of selfless action.',
    views: 87, likes: 4, language: 'Sanskrit', author: 'Lord Sri Krishna',
    imageUrl: 'https://i.postimg.cc/50Sry93y/gita-ch2-v47.jpg',
    tags: ['karma', 'duty', 'gita'], featured: true,
    body: {
      English: 'Karmany-evadhikaraste Ma Phaleshu Kadachana, Ma Karma-phala-hetur-bhur Ma Te Sango’stv-akarmani.',
      Hindi: 'तेरा कर्म करने में ही अधिकार है, उसके फलों में कभी नहीं।',
      Sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥ २-४७ ॥'
    }
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    category: 'Mantras',
    sanskritBadge: 'मन्त्र · Mantras',
    contentType: 'Text',
    description: 'The most sacred mantra from the Rigveda dedicated to Savitr, the Sun deity.',
    views: 84, likes: 22, language: 'Sanskrit', author: 'Brahmarshi Vishwamitra (Rigveda 3.62.10)',
    imageUrl: 'https://i.postimg.cc/fLNQx82H/gayatri-mantra.jpg',
    tags: ['rigveda', 'sun', 'wisdom'], featured: true,
    body: {
      English: 'Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dhimahi Dhiyo Yo Nah Prachodayat.',
      Hindi: 'उस प्राणस्वरूप, तेजस्वी परमात्मा सवितृ का हम ध्यान करते हैं, वे हमारी बुद्धि को सन्मार्ग में प्रेरित करें।',
      Sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥'
    }
  }
];

export const JAAP_MANTRAS = [
  { id: 'om-namah-shivaya', name: 'Om Namah Shivaya', sanskrit: 'ॐ नमः शिवाय', transliteration: 'Oṁ Namaḥ Śivāya', deity: 'Lord Shiva' },
  { id: 'hare-krishna', name: 'Hare Krishna Maha Mantra', sanskrit: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे । हरे राम हरे राम राम राम हरे हरे ॥', transliteration: 'Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare, Hare Rāma Hare Rāma Rāma Rāma Hare Hare', deity: 'Sri Radha-Krishna' },
  { id: 'jai-shri-ram', name: 'Shri Ram Jai Ram Jai Jai Ram', sanskrit: 'श्री राम जय राम जय जय राम', transliteration: 'Śrī Rāma Jaya Rāma Jaya Jaya Rāma', deity: 'Lord Sri Rama' },
  { id: 'radhe-radhe', name: 'Radha Naam Jaap', sanskrit: 'राधा राधा / राधे राधे', transliteration: 'Rādhe Rādhe', deity: 'Srimati Radharani' },
  { id: 'gayatri-jaap', name: 'Gayatri Mantra', sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', transliteration: 'Oṁ Bhūr Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt', deity: 'Veda Mata Gayatri' },
  { id: 'mahamrityunjaya-jaap', name: 'Mahamrityunjaya Mantra', sanskrit: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥', transliteration: 'Oṁ Tryambakaṁ Yajāmahe Sugandhiṁ Puṣṭivardhanam...', deity: 'Lord Shiva' },
  { id: 'om-namo-bhagavate', name: 'Om Namo Bhagavate Vasudevaya', sanskrit: 'ॐ नमो भगवते वासुदेवाय', transliteration: 'Oṁ Namo Bhagavate Vāsudevāya', deity: 'Lord Vishnu' },
  { id: 'om-gan-ganapataye', name: 'Om Gan Ganapataye Namaha', sanskrit: 'ॐ गं गणपतये नमः', transliteration: 'Oṁ Gaṁ Gaṇapataye Namaḥ', deity: 'Lord Ganesha' }
];

function playSacredSound(type = 'bead') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    if (type === 'bead') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.065);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } else {
      [528, 1056, 1584].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);
        gain.gain.setValueAtTime(0.18 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.85);
      });
    }
  } catch {}
}

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLang, setDetailLang] = useState('English');
  const [items, setItems] = useState(INITIAL_SACRED_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [likedIds, setLikedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: '', description: '', category: 'Mantras', contentType: 'Text / Scripture',
    body: '', imageUrl: '', author: '', language: 'Sanskrit', tags: '', featured: false
  });

  // Naam Jaap State
  const [selectedMantraId, setSelectedMantraId] = useState(JAAP_MANTRAS[0].id);
  const [customMantraText, setCustomMantraText] = useState('');
  const [isCustomMantra, setIsCustomMantra] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);
  const [lifetimeCount, setLifetimeCount] = useState(1080);
  const [dailyGoal, setDailyGoal] = useState(108);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [meditationSeconds, setMeditationSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [autoJaapActive, setAutoJaapActive] = useState(false);
  const [autoJaapIntervalSec, setAutoJaapIntervalSec] = useState(3);
  const [jaapHistory, setJaapHistory] = useState([
    { id: 1, mantra: 'Om Namah Shivaya', count: 108, malas: 1, date: 'Today, Morning Sadhana', duration: '06:12' }
  ]);
  const [pulseEffect, setPulseEffect] = useState(false);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  }, []);

  // Fetch from Django API if running, seamlessly merging with seed items
  useEffect(() => {
    fetch('/api/contents/')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setItems(
            data.map((d) => ({
              id: d.slug || String(d.id),
              title: d.title,
              category: d.category_name || 'Mantras',
              sanskritBadge: d.sanskrit_badge || d.category_name,
              contentType: d.content_type || 'Text',
              description: d.description,
              views: d.views || 0,
              likes: d.likes || 0,
              language: d.language || 'Sanskrit',
              author: d.author || 'Traditional Sanatan Shruti',
              imageUrl: d.image_url || 'https://i.postimg.cc/8zQ0ZcR6/om-mantra.jpg',
              tags: d.tags || [],
              featured: d.featured,
              body: {
                English: d.body_english || d.description,
                Hindi: d.body_hindi || d.description,
                Sanskrit: d.body_sanskrit || 'ॐ तत्सत् ॥'
              }
            }))
          );
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setMeditationSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const currentMantra = useMemo(() => {
    if (isCustomMantra && customMantraText.trim()) {
      return {
        id: 'custom', name: customMantraText.trim(), sanskrit: customMantraText.trim(),
        transliteration: 'Custom Sankalpa Mantra', deity: 'Ishta Devata'
      };
    }
    return JAAP_MANTRAS.find((m) => m.id === selectedMantraId) || JAAP_MANTRAS[0];
  }, [selectedMantraId, isCustomMantra, customMantraText]);

  const handleIncrementJaap = useCallback(() => {
    if (!isTimerRunning) setIsTimerRunning(true);
    setPulseEffect(true);
    setTimeout(() => setPulseEffect(false), 180);
    setCurrentCount((prev) => {
      const next = prev + 1;
      const isMalaDone = next % 108 === 0;
      if (soundEnabled) playSacredSound(isMalaDone ? 'malaComplete' : 'bead');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(isMalaDone ? [80, 50, 120] : 18);
      }
      if (isMalaDone) showToast(`🕉️ 1 Mala (108 chants) of ${currentMantra.name} completed!`);
      return next;
    });
    setLifetimeCount((prev) => prev + 1);
  }, [isTimerRunning, soundEnabled, currentMantra.name, showToast]);

  useEffect(() => {
    if (!autoJaapActive) return;
    const timer = setInterval(handleIncrementJaap, autoJaapIntervalSec * 1000);
    return () => clearInterval(timer);
  }, [autoJaapActive, autoJaapIntervalSec, handleIncrementJaap]);

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const handleSaveAndResetJaap = () => {
    if (currentCount > 0) {
      const entry = {
        id: Date.now(), mantra: currentMantra.name, count: currentCount,
        malas: Math.floor(currentCount / 108), date: 'Today', duration: formatDuration(meditationSeconds)
      };
      setJaapHistory((prev) => [entry, ...prev]);
      fetch('/api/jaap-sessions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mantra_name: currentMantra.name,
          mantra_sanskrit: currentMantra.sanskrit,
          chants_count: currentCount,
          daily_goal: dailyGoal,
          duration_seconds: meditationSeconds
        })
      }).catch(() => {});
      showToast(`Saved ${currentCount} chants to Sadhana log!`);
    }
    setCurrentCount(0);
    setMeditationSeconds(0);
    setIsTimerRunning(false);
    setAutoJaapActive(false);
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = items.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
    if (sortBy === 'views') return [...list].sort((a, b) => b.views - a.views);
    if (sortBy === 'likes') return [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [items, selectedCategory, searchQuery, sortBy]);

  const beadInCurrentMala = currentCount % 108;
  const completedMalas = Math.floor(currentCount / 108);
  const dailyGoalPercent = Math.min(100, Math.round((currentCount / dailyGoal) * 100));

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C1A12] font-sans">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-[#3B1910] text-amber-50 px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/40">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FDFBF7]/90 border-b border-amber-900/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <button onClick={() => setActiveView('home')} className="flex items-center gap-3.5 text-left">
            <SanatanSetuLogo size={46} />
            <div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#8B261D] via-[#C84B11] to-[#D97706] bg-clip-text text-transparent">
                Sanatan Setu Library
              </span>
              <p className="text-xs sm:text-sm text-[#78523A] font-medium">Bridge to Eternal Wisdom · सनातन सेतु</p>
            </div>
          </button>

          <nav className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 ${
                activeView === 'home' ? 'bg-amber-100 text-[#9A3412] border border-amber-300' : 'text-[#5C3A28]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Library</span>
            </button>
            <button
              onClick={() => setActiveView('jaap')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                activeView === 'jaap'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white'
                  : 'bg-amber-500/15 text-[#9A3412] border border-orange-300'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Naam Jaap Counter (108)</span>
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#6B1D14] text-amber-50 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </button>
          </nav>
        </div>
      </header>

      {activeView === 'jaap' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-[#4A1810] via-[#6B2414] to-[#9A3412] rounded-3xl p-6 sm:p-8 text-amber-50 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">🕉️ Naam Jaap & 108-Bead Digital Mala</h1>
              <p className="text-amber-100/90 text-sm">Tap the central Rudraksha bead or press Spacebar to count chants with sacred temple bell acoustics.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-black/25 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-extrabold text-amber-300">{completedMalas}</div>
                <div className="text-[11px] uppercase text-amber-100/80">Malas</div>
              </div>
              <div className="bg-black/25 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-extrabold text-white">{formatDuration(meditationSeconds)}</div>
                <div className="text-[11px] uppercase text-amber-100/80">Time</div>
              </div>
              <div className="bg-black/25 rounded-2xl p-3.5 text-center">
                <div className="text-2xl font-extrabold text-amber-300">{lifetimeCount}</div>
                <div className="text-[11px] uppercase text-amber-100/80">Total</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-amber-900/10 shadow-sm space-y-2.5">
                <h2 className="text-lg font-bold text-[#3B1910] mb-2">Select Sacred Mantra</h2>
                {JAAP_MANTRAS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setIsCustomMantra(false); setSelectedMantraId(m.id); }}
                    className={`w-full text-left p-3 rounded-2xl border ${
                      !isCustomMantra && selectedMantraId === m.id ? 'bg-amber-50 border-orange-500' : 'border-amber-900/10'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-sm">{m.name} <span className="text-xs text-amber-800">{m.deity}</span></div>
                    <p className="text-sm font-serif text-[#9A3412]">{m.sanskrit}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-md flex flex-col items-center text-center">
              <span className="px-3 py-1 rounded-full bg-amber-100 text-[#9A3412] text-xs font-bold mb-2">{currentMantra.deity}</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#6B1D14] mb-1">{currentMantra.sanskrit}</h2>
              <p className="text-xs text-[#78523A] italic mb-4">{currentMantra.transliteration}</p>

              <div className="relative w-72 h-72 flex items-center justify-center my-2">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
                  <circle cx="130" cy="130" r="112" fill="none" stroke="#F3E8D6" strokeWidth="3" />
                  {Array.from({ length: 54 }).map((_, i) => {
                    const angle = (i / 54) * 2 * Math.PI;
                    const cx = 130 + 112 * Math.cos(angle);
                    const cy = 130 + 112 * Math.sin(angle);
                    const isActive = beadInCurrentMala >= (i + 1) * 2;
                    return (
                      <circle
                        key={i} cx={cx} cy={cy} r={i === 0 ? 6.5 : 4.2}
                        fill={i === 0 ? '#D97706' : isActive ? '#EA580C' : '#E6D5B8'}
                      />
                    );
                  })}
                </svg>
                <button
                  onClick={handleIncrementJaap}
                  className={`w-48 h-48 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#EA580C] to-[#9A3412] text-white shadow-2xl flex flex-col items-center justify-center border-8 border-amber-100 transition-transform ${
                    pulseEffect ? 'scale-105' : ''
                  }`}
                >
                  <span className="text-xs uppercase tracking-widest text-amber-100">Tap to Chant</span>
                  <span className="text-5xl font-extrabold my-1">{currentCount}</span>
                  <span className="text-xs bg-black/25 px-3 py-1 rounded-full">Bead {beadInCurrentMala} / 108</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-600" /> : <VolumeX className="w-4 h-4" />}
                  <span>{soundEnabled ? 'Sound On' : 'Muted'}</span>
                </button>
                <button onClick={() => setAutoJaapActive(!autoJaapActive)} className="px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5">
                  {autoJaapActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{autoJaapActive ? 'Stop Auto' : 'Auto Jaap'}</span>
                </button>
                <button onClick={handleSaveAndResetJaap} className="px-4 py-2 rounded-xl bg-amber-100 text-[#9A3412] text-xs font-bold flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" />
                  <span>Save & Reset</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {activeView === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 text-[#9A3412] text-xs font-semibold">🕉️ Sanatan Dharma Digital Library</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold mt-4">Preserving the Eternal Wisdom of Sanatan Dharma</h1>
            <p className="mt-3 text-[#5C3A28]">A sacred digital library to upload, preserve, and explore Hindu religious content — mantras, scriptures, bhajans, Vedas, Upanishads, Puranas, and the timeless wisdom of the saints.</p>
            <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 font-serif text-[#6B1D14]">
              ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय । मृत्योर्मा अमृतं गमय ॥
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? 'All' : cat.id)}
                className={`text-left p-4 rounded-2xl border bg-white ${selectedCategory === cat.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-amber-900/10'}`}
              >
                <div className="flex justify-between text-xs font-bold text-[#9A3412] mb-1"><span>{cat.code}</span><span>{cat.sanskrit}</span></div>
                <div className="font-bold text-base">{cat.name}</div>
                <p className="text-xs text-[#78523A] line-clamp-2 mt-1">{cat.description}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <h2 className="text-2xl font-extrabold">Explore the Sacred Library ({filteredItems.length} items)</h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#78523A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mantras, temples, Vedas..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-amber-900/15 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                onClick={() => { setSelectedItem(item); setActiveView('detail'); }}
                className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-48 bg-amber-100">
                  <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 text-amber-200 text-xs font-semibold">{item.sanskritBadge}</span>
                  <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold text-base line-clamp-2">{item.title}</h3>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs sm:text-sm text-[#5C3A28] line-clamp-3">{item.description}</p>
                  <div className="mt-4 pt-3 border-t border-amber-900/10 flex justify-between text-xs text-[#78523A]">
                    <span>👁️ {item.views} · ❤️ {item.likes}</span>
                    <span className="font-semibold text-[#6B1D14]">{item.language}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {activeView === 'detail' && selectedItem && (
        <main className="max-w-4xl mx-auto px-4 py-8">
          <button onClick={() => setActiveView('home')} className="inline-flex items-center gap-2 text-sm font-bold text-[#9A3412] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Library
          </button>
          <article className="bg-white rounded-3xl overflow-hidden border border-amber-900/10 shadow-lg p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{selectedItem.title}</h1>
            <p className="text-xs text-[#78523A] mb-4">{selectedItem.sanskritBadge} · Author: {selectedItem.author}</p>
            <div className="flex gap-2 mb-6">
              {['English', 'Hindi', 'Sanskrit'].map((lang) => (
                <button
                  key={lang} onClick={() => setDetailLang(lang)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${detailLang === lang ? 'bg-[#6B1D14] text-white' : 'bg-amber-50 text-[#6B1D14]'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-amber-900/10 font-serif text-lg whitespace-pre-line">
              {selectedItem.body?.[detailLang] || selectedItem.description}
            </div>
          </article>
        </main>
      )}
    </div>
  );
}
