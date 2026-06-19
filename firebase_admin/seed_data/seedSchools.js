/**
 * Seeds the `schools` Firestore collection with real, publicly-documented
 * Kenyan schools (see schools.json). Unconfirmed per-school details (phone,
 * email, exact address, images, head teacher) are left blank rather than
 * invented. Run: node seedSchools.js
 */
const admin = require('firebase-admin')
const schools = require('./schools.json')

const serviceAccount = require('../react-abcederian-firebase-adminsdk-pe237-016500133e.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

// Ministry of Education published fee-cap guideline tiers (KES per term).
// Private/international schools and universities set their own fees, which
// aren't publicly standardised, so those are left at 0 rather than guessed.
const FEE_TIERS = {
  national: { minTermFee: 45000, maxTermFee: 53554, admissionFee: 2000, uniformEstimate: 8000 },
  extraCounty: { minTermFee: 35000, maxTermFee: 40535, admissionFee: 1500, uniformEstimate: 6000 },
  publicDay: { minTermFee: 0, maxTermFee: 0, admissionFee: 500, uniformEstimate: 3000 },
  unset: { minTermFee: 0, maxTermFee: 0, admissionFee: 0, uniformEstimate: 0 },
}

const NATIONAL_SCHOOLS = new Set([
  'Alliance High School',
  'Alliance Girls High School',
  "Mang'u High School",
  "Starehe Boys' Centre",
  'Kenya High School',
  'Nairobi School',
  'Lenana School',
  'Maseno School',
  'Friends School Kamusinga',
  'Moi Girls High School Nairobi',
  'Loreto High School Limuru',
  'Kakamega High School',
])

const EXTRA_COUNTY_SCHOOLS = new Set([
  'Precious Blood Riruta',
  'Cardinal Otunga High School',
  "St. Mary's School Yala",
])

const feesFor = (school) => {
  if (school.type !== 'secondary') return FEE_TIERS.unset
  if (NATIONAL_SCHOOLS.has(school.name)) return FEE_TIERS.national
  if (EXTRA_COUNTY_SCHOOLS.has(school.name)) return FEE_TIERS.extraCounty
  if (school.boardingOptions === 'day') return FEE_TIERS.publicDay
  return FEE_TIERS.unset
}

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

async function seed() {
  const batch = db.batch()
  const collection = db.collection('schools')
  const now = admin.firestore.Timestamp.now()

  for (const school of schools) {
    const fees = feesFor(school)
    const docRef = collection.doc()
    batch.set(docRef, {
      ownerId: null,
      name: school.name,
      slug: slugify(school.name),
      description: school.description,
      county: school.county,
      town: school.town,
      address: `${school.town}, ${school.county} County, Kenya`,
      latitude: school.latitude,
      longitude: school.longitude,
      type: school.type,
      curriculum: school.curriculum,
      gender: school.gender,
      religion: school.religion,
      boardingOptions: school.boardingOptions,
      isVerified: false,
      isFeatured: false,
      subscriptionTier: 'free',
      coverImage: '',
      logoImage: '',
      gallery: [],
      ratingAverage: 0,
      reviewCount: 0,
      foundedYear: school.foundedYear,
      headTeacher: '',
      motto: school.motto,
      registrationNumber: '',
      teacherStudentRatio: '',
      totalStudents: 0,
      specialNeedsSupport: false,
      facilities: [],
      website: '',
      phone: '',
      email: '',
      whatsapp: '',
      socialMedia: { facebook: '', instagram: '', twitter: '' },
      fees: { ...fees, paymentMethods: ['M-Pesa', 'Bank Transfer'] },
      transport: { available: false, routes: '', monthlyCost: 0 },
      createdAt: now,
      updatedAt: now,
    })
  }

  await batch.commit()
  console.log(`Seeded ${schools.length} schools into Firestore.`)
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
