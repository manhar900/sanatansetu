from django.core.management.base import BaseCommand
from library.models import Category, SacredContent

CATEGORIES_DATA = [
    ("VED", "Vedas", "वेद", "The eternal shruti — Rigveda, Yajurveda, Samaveda, Atharvaveda", 1),
    ("UPN", "Upanishads", "उपनिषद्", "Philosophical teachings on Brahman, Atman, and liberation", 2),
    ("BG", "Bhagavad Gita", "श्रीमद्भगवद्गीता", "Krishna's teachings to Arjuna on dharma, karma, and bhakti", 3),
    ("RM", "Ramayana", "रामायण", "The epic of Lord Rama by Sage Valmiki", 4),
    ("MB", "Mahabharata", "महाभारत", "The great epic featuring the Pandavas, Kauravas, and Lord Krishna", 5),
    ("PUR", "Puranas", "पुराण", "Eighteen sacred texts narrating the deeds of Vishnu, Shiva, Devi", 6),
    ("MTR", "Mantras", "मन्त्र", "Sacred chants and invocations from the Vedic and Tantric traditions", 7),
    ("BHJ", "Bhajans", "भजन", "Devotional songs glorifying the divine in many forms", 8),
    ("UTS", "Festivals", "उत्सव", "Sacred celebrations — Diwali, Holi, Navaratri, Janmashtami, and more", 9),
    ("MDR", "Temples", "मन्दिर", "Sacred shrines, their history, architecture, and significance", 10),
    ("DRS", "Philosophy", "दर्शन", "Darshanas — Yoga, Vedanta, Samkhya, Nyaya, Vaisheshika, Mimamsa", 11),
    ("SNT", "Sant Teachings", "सन्त", "Wisdom of saints — Tulsidas, Mirabai, Kabir, Ramakrishna, Vivekananda", 12),
]

SACRED_ITEMS_DATA = [
    ("Jagannath Temple (Puri): The Eastern Abode of the Lord of the Universe", "Temples", "The ultimate guide to Jagannath Puri Dham. Discover the mystery of the wooden deities, the world-famous Rath Yatra, the grand Kalinga architecture, and the sacred Mahaprasad.", 68, 1, "English", "https://i.postimg.cc/9MvdM5j8/jagannath-puri.jpg", ["jagannath", "puri", "char-dham"], True),
    ("Kamakhya Temple: The Womb of the Cosmic Mother (Maha Shaktipeeth)", "Temples", "A comprehensive guide to the Kamakhya Temple in Assam. Discover the deep Tantric roots, the legend of Sati's sacrifice, and the mysteries of the Ambubachi Mela at this supreme Shaktipeeth.", 50, 0, "Sanskrit", "https://i.postimg.cc/3w9hKgV4/kamakhya-temple.jpg", ["kamakhya", "shaktipeeth", "assam"], False),
    ("Badrinath Dham: The Supreme Himalayan Abode of Lord Vishnu", "Temples", "The ultimate guide to Badrinath Dham, the most prominent of the Char Dhams. Explore its ancient origins, the legend of Nar-Narayan, the Tapt Kund, and the mystery of the 6-month Akhand Jyoti.", 48, 1, "Sanskrit", "https://i.postimg.cc/8c3KzDkL/badrinath-dham.jpg", ["badrinath", "vishnu", "char-dham"], False),
    ("Sri Ranganathaswamy Temple: The Largest Functioning Hindu Temple in the World", "Temples", "The ultimate, comprehensive guide to the Sri Ranganathaswamy Temple in Srirangam. Explore its 156-acre architecture, the legend of Vibhishana, the 7 Prakaras, historical invasions, and unique divine rituals.", 70, 0, "English", "https://i.postimg.cc/9F7K7W1N/sri-ranganathaswamy.jpg", ["srirangam", "ranganatha", "vishnu"], True),
    ("Angkor Wat: The Cosmic Temple of Lord Vishnu (Cambodia)", "Temples", "Discover Angkor Wat, the largest religious monument in the world. Explore its stunning Khmer architecture, its dedication to Lord Vishnu, and the ancient Hindu epics carved into its stone walls.", 44, 0, "English", "https://i.postimg.cc/B63wB8g4/angkor-wat.jpg", ["angkor-wat", "vishnu", "cambodia"], False),
    ("Sant Teachings: The Bhakti Movement and the Path of Divine Love", "Sant Teachings", "Explore the rich Sant Parampara of Sanatan Dharma. Discover the Bhakti movement, the poetry of divine love, and the core teachings of mystics like Kabir, Tulsidas, and Mirabai.", 45, 0, "English", "https://i.postimg.cc/K8J75Z6C/sant-teachings.jpg", ["bhakti", "tulsidas", "mirabai", "kabir"], False),
    ("Hindu Philosophy: The Six Orthodox Schools (Shad Darshana)", "Philosophy", "Explore the deep philosophical roots of Sanatan Dharma. Discover the Shad Darshana (the six orthodox systems of Indian philosophy), including Vedanta, Yoga, and Nyaya.", 53, 0, "English", "https://i.postimg.cc/0jK8fX5B/shad-darshana.jpg", ["darshana", "vedanta", "yoga"], False),
    ("Hindu Temples: The Sacred Architecture of the Divine (Mandir)", "Temples", "Explore the spiritual significance, ancient architectural styles (Nagara and Dravida), and the profound philosophical meaning behind the design of Hindu temples.", 41, 0, "Sanskrit", "https://i.postimg.cc/Hn04ZpXn/hindu-temples.jpg", ["mandir", "architecture"], False),
    ("Hindu Festivals: The Cycle of Devotion, Seasons, and Dharma (Utsav & Vrat)", "Festivals", "Discover the spiritual significance of the major festivals in Sanatan Dharma. Explore how Utsav (celebration) and Vrat (fasting) connect devotion, nature, and community.", 44, 0, "English", "https://i.postimg.cc/k4G6Vp7b/hindu-festivals.jpg", ["diwali", "holi", "navaratri"], False),
    ("The Puranas: Introduction and Guide to the 18 Maha Puranas", "Puranas", "Explore the Puranas, the vast encyclopedias of Sanatan Dharma. Discover the meaning, the five characteristics, and a summary of the 18 Maha Puranas.", 52, 0, "English", "https://i.postimg.cc/J0v0wT4z/puranas-guide.jpg", ["puranas", "vedavyasa"], False),
    ("The Mahabharata: Introduction, Epic Summary, and Core Teachings", "Mahabharata", "Explore the Mahabharata, the greatest epic of Sanatan Dharma. Learn about the story of the Pandavas and Kauravas, the Kurukshetra War, and the profound teachings of Dharma.", 68, 1, "English", "https://i.postimg.cc/SNwP99G1/mahabharata-summary.jpg", ["mahabharata", "pandavas", "krishna"], True),
    ("The Upanishads: Introduction and Guide to the 10 Principal Texts", "Upanishads", "Discover the profound philosophy of the Upanishads (Vedanta). Explore the meaning, themes, and summaries of the 10 Principal (Mukhya) Upanishads of Sanatan Dharma.", 48, 0, "English", "https://i.postimg.cc/7ZhM3hT5/upanishads-guide.jpg", ["upanishads", "vedanta"], False),
    ("Maa Ambe Ki Sarv Kamna Siddh Prarthana: Full Lyrics + Meaning", "Mantras", "Read the powerful Maa Ambe Ki Sarv Kamna Siddh Prarthana. This sacred prayer invokes the various forms of the Goddess to fulfill all virtuous desires and grant spiritual devotion.", 104, 5, "English", "https://i.postimg.cc/xT3xvvb6/maa-ambe-prarthana.jpg", ["🙏", "maa-ambe", "durga"], True),
    ("Ambe Tu Hai Jagdambe Kali Aarti: Full Lyrics (Hindi & English) + Meaning", "Bhajans", "Read the powerful Ambe Tu Hai Jagdambe Kali Aarti. Includes the complete lyrics in Hindi, English transliteration, and detailed spiritual meaning for your daily worship.", 107, 3, "English", "https://i.postimg.cc/NjYw98w0/ambe-tu-hai-jagdambe.jpg", ["aarti", "jagdambe", "kali"], False),
    ("Shri Hanuman Chalisa: Full Lyrics (Hindi & English) + Meaning", "Mantras", "Read the complete Shri Hanuman Chalisa with lyrics in Hindi and English. Discover the line-by-line meaning, spiritual benefits, and history of this powerful hymn.", 121, 4, "English", "https://i.postimg.cc/BZ24xKx2/hanuman-chalisa.jpg", ["hanuman-chalisa", "tulsidas"], True),
    ("Jai Ambe Gauri Aarti: Full Lyrics (Hindi & English) + Meaning", "Bhajans", "Read the complete Jai Ambe Gauri Aarti dedicated to Goddess Durga. Features full lyrics in Hindi and English, along with the deep spiritual meaning of each verse.", 90, 4, "Hindi", "https://i.postimg.cc/44N91P3b/jai-ambe-gauri.jpg", ["maa❣️", "jai-ambe-gauri"], False),
    ("Om (Aum) Mantra: Deep Meaning, Significance, and Benefits", "Vedas", "Discover the profound meaning of Om (ॐ), the most sacred syllable in Sanatan Dharma. Learn the philosophy of A-U-M, how to chant it, and its spiritual benefits.", 127, 6, "English", "https://i.postimg.cc/8zQ0ZcR6/om-mantra.jpg", ["🕉️", "om", "pranava"], True),
    ("Mahalakshmi Ashtakam", "Mantras", "An eight-verse hymn glorifying Goddess Lakshmi, the deity of wealth and prosperity.", 61, 24, "Sanskrit", "https://i.postimg.cc/C1bCgcvR/mahalakshmi-ashtakam.jpg", ["lakshmi", "wealth", "prosperity"], True),
    ("The Four Vedas - An Introduction", "Vedas", "A brief introduction to the four foundational scriptures of Hinduism.", 61, 2, "English", "https://i.postimg.cc/0j59mSkg/four-vedas.jpg", ["vedas", "rigveda", "yajurveda"], False),
    ("The Story of Rama's Exile", "Ramayana", "An overview of the Ayodhya Kanda from the Ramayana - the exile of Lord Rama.", 72, 1, "English", "https://i.postimg.cc/PqbhYWW0/rama-exile.jpg", ["rama", "ayodhya", "exile"], False),
    ("Mahamrityunjaya Mantra", "Mantras", "The death-conquering mantra dedicated to Lord Shiva for healing and protection.", 169, 25, "Sanskrit", "https://i.postimg.cc/mD8T117T/mahamrityunjaya.jpg", ["shiva", "healing", "protection"], True),
    ("Bhagavad Gita - Chapter 2, Verse 47", "Bhagavad Gita", "The defining verse on Karma Yoga - the yoga of selfless action.", 87, 4, "Sanskrit", "https://i.postimg.cc/50Sry93y/gita-ch2-v47.jpg", ["karma", "duty", "gita"], True),
    ("Gayatri Mantra", "Mantras", "The most sacred mantra from the Rigveda dedicated to Savitr, the Sun deity.", 84, 22, "Sanskrit", "https://i.postimg.cc/fLNQx82H/gayatri-mantra.jpg", ["rigveda", "sun", "wisdom"], True),
]

class Command(BaseCommand):
    def handle(self, *args, **options):
        cat_map = {}
        for code, name, sanskrit, desc, order in CATEGORIES_DATA:
            cat, _ = Category.objects.update_or_create(
                name=name, defaults={"code": code, "sanskrit": sanskrit, "description": desc, "display_order": order}
            )
            cat_map[name] = cat
        for title, cat_name, desc, views, likes, lang, img, tags, feat in SACRED_ITEMS_DATA:
            SacredContent.objects.update_or_create(
                title=title,
                defaults={"category": cat_map[cat_name], "description": desc, "views": views, "likes": likes, "language": lang, "image_url": img, "tags": tags, "featured": feat},
            )
        self.stdout.write(self.style.SUCCESS("Seeded 12 categories and 23 sacred items!"))
