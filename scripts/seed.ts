import { db } from '../src/lib/db'

const seedData = [
  {
    title: "Gayatri Mantra",
    description: "The most sacred mantra from the Rigveda dedicated to Savitr, the Sun deity.",
    body: `Om Bhur Bhuvas Svaha\nTat Savitur Varenyam\nBhargo Devasya Dhimahi\nDhiyo Yo Nah Prachodayat\n\nThe Gayatri Mantra is one of the oldest and most powerful mantras in Hinduism, found in the Rigveda (Mandala 3.62.10). It is addressed to Savitr, the Sun deity, representing the divine light of consciousness that illuminates the mind. The sage Vishwamitra is credited with revealing this mantra. Regular chanting of the Gayatri is believed to purify the mind, grant wisdom, and lead the seeker toward spiritual enlightenment. It is traditionally chanted at dawn, noon, and dusk, and is considered the essence of the Vedas.`,
    category: "Mantras",
    type: "text",
    author: "Sage Vishwamitra",
    language: "Sanskrit",
    tags: "rigveda,sun,wisdom,daily",
    featured: true,
  },
  {
    title: "Bhagavad Gita - Chapter 2, Verse 47",
    description: "The defining verse on Karma Yoga - the yoga of selfless action.",
    body: `Karmanye Vadhikaraste Ma Phaleshu Kadachana\nMa Karma Phala Hetur Bhur Ma Te Sangostvakarmani\n\nTranslation: You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.\n\nThis single verse from the Bhagavad Gita encapsulates the essence of Karma Yoga. Lord Krishna instructs Arjuna on the battlefield of Kurukshetra to perform his duty without attachment to the results. This teaching forms the philosophical foundation of selfless service (seva) in Hindu thought and has influenced thinkers worldwide, including Mahatma Gandhi who considered it his guiding principle.`,
    category: "Bhagavad Gita",
    type: "text",
    author: "Lord Krishna",
    language: "Sanskrit",
    tags: "karma,duty,gita,krishna",
    featured: true,
  },
  {
    title: "Mahamrityunjaya Mantra",
    description: "The death-conquering mantra dedicated to Lord Shiva for healing and protection.",
    body: `Om Tryambakam Yajamahe\nSugandhim Pushtivardhanam\nUrvarukamiva Bandhanan\nMrityor Mukshiya Mamritat\n\nThe Mahamrityunjaya Mantra is found in the Rigveda (7.59.12) and the Yajurveda. It is addressed to Lord Shiva in his three-eyed form as Tryambaka. The mantra is chanted for healing, protection from untimely death, and ultimate liberation. The imagery compares spiritual liberation to a cucumber falling effortlessly from its vine when ripe - symbolizing natural, peaceful release from the bondage of mortality. Sage Markandeya received this mantra and overcame death through its power.`,
    category: "Mantras",
    type: "text",
    author: "Sage Markandeya",
    language: "Sanskrit",
    tags: "shiva,healing,protection,rigveda",
    featured: true,
  },
  {
    title: "The Story of Rama's Exile",
    description: "An overview of the Ayodhya Kanda from the Ramayana - the exile of Lord Rama.",
    body: `The Ramayana, attributed to Sage Valmiki, begins with the Ayodhya Kanda, which narrates the events leading to Lord Rama's fourteen-year exile. When Queen Kaikeyi, reminded of King Dasharatha's two boons, demands Rama's exile and the coronation of her son Bharata, the king is heartbroken. Rama, the embodiment of dharma, accepts the decree without resentment, accompanied by his devoted wife Sita and loyal brother Lakshmana.\n\nThis episode illustrates the Hindu ideal of filial duty (pitru-vakya-paripalan) and selfless surrender to dharma. Rama's conduct in the face of injustice exemplifies equanimity, detachment, and righteousness - qualities celebrated throughout Hindu scripture as marks of a true dharmic soul. The exile also sets in motion the events that will lead to the defeat of Ravana and the restoration of dharma on earth.`,
    category: "Ramayana",
    type: "text",
    author: "Sage Valmiki",
    language: "English",
    tags: "rama,ayodhya,exile,dharma",
    featured: false,
  },
  {
    title: "Hanuman Chalisa - Opening Verses",
    description: "The opening dohas of Tulsidas's devotional hymn dedicated to Lord Hanuman.",
    body: `Shri Guru Charan Saroj Raj, Nij Man Mukar Sudhari\nBarnau Raghuvar Bimal Jasu, Jo Dayaku Phal Chari\n\nBuddhi Hin Tanu Janike, Sumirau Pavan Kumar\nBal Buddhi Vidya Dehu Mohi, Harahu Kalesh Vikar\n\nComposed by Sant Tulsidas in Awadhi language, the Hanuman Chalisa is one of the most recited devotional hymns in Hinduism. The opening verses invoke the guru's lotus feet to purify the mind, then seek the blessings of Lord Hanuman - the son of Vayu (the wind god) - for strength, wisdom, and removal of all afflictions. The 40 chaupais that follow extol Hanuman's devotion to Lord Rama, his boundless strength, and his role as the ultimate refuge for seekers.`,
    category: "Bhajans",
    type: "text",
    author: "Sant Tulsidas",
    language: "Awadhi",
    tags: "hanuman,tulsidas,devotion,chalisa",
    featured: true,
  },
  {
    title: "The Four Vedas - An Introduction",
    description: "A brief introduction to the four foundational scriptures of Hinduism.",
    body: `The Vedas are the oldest sacred texts of Hinduism, believed to be eternal revelations (shruti) heard by ancient sages in deep meditation. They are four in number:\n\n1. Rigveda - The oldest, containing 1,028 hymns (suktas) praising various deities like Agni, Indra, Varuna, and Surya. It is the foundation of Vedic literature.\n\n2. Yajurveda - The book of rituals, providing the prose formulas used by priests during yajnas (fire ceremonies). It has two branches: Shukla (white) and Krishna (black).\n\n3. Samaveda - The Veda of melodies, containing verses from the Rigveda set to musical notation. It is the source of Indian classical music.\n\n4. Atharvaveda - Contains hymns, spells, and incantations for daily life, healing, and protection. It also includes philosophical hymns that anticipate later Upanishadic thought.\n\nEach Veda is further divided into four parts: Samhitas (hymns), Brahmanas (ritual commentaries), Aranyakas (forest treatises), and Upanishads (philosophical teachings). The Vedas form the bedrock of Hindu dharma, ritual, philosophy, and culture.`,
    category: "Vedas",
    type: "text",
    author: "Vedic Sages",
    language: "English",
    tags: "vedas,rigveda,yajurveda,samaveda,atharvaveda",
    featured: true,
  },
  {
    title: "Mahalakshmi Ashtakam",
    description: "An eight-verse hymn glorifying Goddess Lakshmi, the deity of wealth and prosperity.",
    body: `Namastestu Mahamaye Shripithe Surapujite\nShankha Chakra Gadahaste Mahalakshmi Namostute\n\nThe Mahalakshmi Ashtakam is a sacred hymn composed by Lord Indra in praise of Goddess Lakshmi. Each verse glorifies a different aspect of the Divine Mother - her four-armed form holding the conch, discus, and mace, her role as the source of all wealth and abundance, and her power to remove all sorrows. Reciting this ashtakam on Fridays and during Diwali is believed to invoke the goddess's blessings for material prosperity and spiritual wellbeing. The hymn reminds devotees that true wealth includes devotion, virtue, and wisdom - not merely material accumulation.`,
    category: "Mantras",
    type: "text",
    author: "Lord Indra",
    language: "Sanskrit",
    tags: "lakshmi,wealth,prosperity,ashtakam",
    featured: false,
  },
  {
    title: "The Meaning of Om (Pranava)",
    description: "An exploration of the most sacred sound in Hinduism and its philosophical significance.",
    body: `Om (also written as AUM) is the primal sound of creation, known as Pranava - "the cosmic sound." It is composed of three syllables: A (creation), U (preservation), and M (dissolution), representing the three states of consciousness (waking, dreaming, deep sleep) and the trimurti (Brahma, Vishnu, Shiva).\n\nThe Mandukya Upanishad is entirely devoted to explaining Om. It describes the fourth state - Turiya - which transcends the three syllables and represents pure consciousness, the ultimate reality (Brahman). The silence that follows the chanting of Om is considered as sacred as the sound itself.\n\nOm appears at the beginning of most Hindu mantras, scriptures, and prayers. The Yoga Sutras of Patanjali state that chanting Om with contemplation of its meaning removes all obstacles and turns the mind inward. It is both a symbol and a sound - the audible representation of the inexpressible divine.`,
    category: "Upanishads",
    type: "text",
    author: "Vedic Tradition",
    language: "English",
    tags: "om,pranava,upanishad,consciousness",
    featured: true,
  },
]

async function main() {
  console.log('Seeding database with Hindu religious content...')
  
  await db.content.deleteMany({})
  
  for (const item of seedData) {
    await db.content.create({
      data: item,
    })
  }
  
  const count = await db.content.count()
  console.log(`Seeded ${count} content items.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
