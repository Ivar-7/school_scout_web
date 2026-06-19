/**
 * Backfills `coverImage` on the seeded `schools` docs using real, freely-
 * licensed photos from Wikimedia Commons (Category:Schools in Kenya and
 * each university's own category). Most are not photos of that exact
 * school — they're generic Kenyan school/campus photos, picked per school
 * type, since the goal is just a realistic-looking cover image per listing.
 * Run: node updateCoverImages.js
 */
const admin = require('firebase-admin')
const coverImages = require('./coverImages.json')

const serviceAccount = require('../react-abcederian-firebase-adminsdk.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

const filePathUrl = (filename) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`

async function run() {
  const snapshot = await db.collection('schools').get()
  const batch = db.batch()
  let updated = 0

  snapshot.forEach((docSnap) => {
    const name = docSnap.data().name
    const filename = coverImages[name]
    if (!filename) {
      console.warn(`No cover image mapped for "${name}", skipping.`)
      return
    }
    batch.update(docSnap.ref, { coverImage: filePathUrl(filename) })
    updated += 1
  })

  await batch.commit()
  console.log(`Updated coverImage on ${updated} schools.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Update failed:', err)
    process.exit(1)
  })
