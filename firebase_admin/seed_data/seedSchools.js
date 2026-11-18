/**
 * Upserts the Kenyan school directory and its cover images into Firestore.
 * Existing seeded school document IDs are preserved so saved references keep
 * working. New entries use stable slug IDs, making repeated runs idempotent.
 * Run from the repository root: npm --prefix firebase_admin run seed
 */
const admin = require('firebase-admin')
const schools = require('./schools.json')
const coverImages = require('./coverImages.json')
const serviceAccount = require('../schoolfinder-97617-firebase-adminsdk-fbsvc-38213ff99f.json')

const PROJECT_ID = 'schoolfinder-97617'
const SCHOOLS_COLLECTION = 'schools'

if (serviceAccount.project_id !== PROJECT_ID) {
  throw new Error(`Expected Firebase Admin credentials for ${PROJECT_ID}.`)
}

const missingCoverImages = schools
  .filter(
    (school) => typeof coverImages[school.name] !== 'string' || !coverImages[school.name].trim()
  )
  .map((school) => school.name)

if (missingCoverImages.length > 0) {
  throw new Error(`Missing cover image mappings for: ${missingCoverImages.join(', ')}`)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: PROJECT_ID,
})

const db = admin.firestore()

// Ministry of Education published fee-cap guideline tiers (KES per term).
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

const filePathUrl = (filename) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`

async function seed() {
  const collection = db.collection(SCHOOLS_COLLECTION)
  const snapshot = await collection.get()
  const existingByName = new Map()
  const existingById = new Map(snapshot.docs.map((doc) => [doc.id, doc]))

  for (const doc of snapshot.docs) {
    const name = doc.data().name
    if (!schools.some((school) => school.name === name)) continue
    const matches = existingByName.get(name) ?? []
    matches.push(doc)
    existingByName.set(name, matches)
  }

  const duplicates = [...existingByName.entries()]
    .filter(([, docs]) => docs.length > 1)
    .map(([name]) => name)

  if (duplicates.length > 0) {
    throw new Error(`Duplicate seeded school documents found for: ${duplicates.join(', ')}`)
  }

  const idCollisions = schools.filter((school) => {
    if (existingByName.has(school.name)) return false
    const collision = existingById.get(slugify(school.name))
    return collision !== undefined && collision.data().name !== school.name
  })

  if (idCollisions.length > 0) {
    throw new Error(
      `Stable school IDs already belong to other records: ${idCollisions.map((school) => school.name).join(', ')}`
    )
  }

  const batch = db.batch()
  const now = admin.firestore.Timestamp.now()

  for (const school of schools) {
    const existing = existingByName.get(school.name)?.[0]
    const docRef = existing?.ref ?? collection.doc(slugify(school.name))
    const fees = feesFor(school)

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
      coverImage: filePathUrl(coverImages[school.name]),
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
      createdAt: existing?.data().createdAt ?? now,
      updatedAt: now,
    })
  }

  await batch.commit()
  console.log(`Seeded ${schools.length} schools with cover images into ${PROJECT_ID}.`)
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Seeding failed:', error)
    process.exit(1)
  })
