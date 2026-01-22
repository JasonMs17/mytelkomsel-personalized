import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { getDdb } from './ddb'

const CATALOG_DATA = [
  { id: 'R01', name: 'Reguler 5GB Mingguan', type: 'REGULAR', price: 15000, days: 7, main: 5, video: 0, game: 0 },
  { id: 'R02', name: 'Reguler 10GB Mingguan', type: 'REGULAR', price: 25000, days: 7, main: 10, video: 0, game: 0 },
  { id: 'R03', name: 'Reguler 15GB 14 Hari', type: 'REGULAR', price: 35000, days: 14, main: 15, video: 0, game: 0 },
  { id: 'R04', name: 'Reguler 25GB Bulanan', type: 'REGULAR', price: 60000, days: 30, main: 25, video: 0, game: 0 },
  { id: 'R05', name: 'Reguler 40GB Bulanan', type: 'REGULAR', price: 85000, days: 30, main: 40, video: 0, game: 0 },
  { id: 'R06', name: 'Reguler 60GB Bulanan', type: 'REGULAR', price: 120000, days: 30, main: 60, video: 0, game: 0 },

  { id: 'A01', name: 'Conference 10GB Bulanan', type: 'APP_ONLY', price: 30000, days: 30, main: 0, video: 0, game: 0 },
  { id: 'A02', name: 'Conference 20GB Bulanan', type: 'APP_ONLY', price: 50000, days: 30, main: 0, video: 0, game: 0 },
  { id: 'A03', name: 'Game 10GB 14 Hari', type: 'APP_ONLY', price: 25000, days: 14, main: 0, video: 0, game: 10 },
  { id: 'A04', name: 'Game 25GB Bulanan', type: 'APP_ONLY', price: 55000, days: 30, main: 0, video: 0, game: 25 },
  { id: 'A05', name: 'Video 15GB Bulanan', type: 'APP_ONLY', price: 45000, days: 30, main: 0, video: 15, game: 0 },
  { id: 'A06', name: 'Social 20GB Bulanan', type: 'APP_ONLY', price: 40000, days: 30, main: 0, video: 0, game: 0 },

  { id: 'C01', name: 'Combo 15GB + Video 10GB', type: 'COMBO', price: 55000, days: 30, main: 15, video: 10, game: 0 },
  { id: 'C02', name: 'Combo 20GB + Social 15GB', type: 'COMBO', price: 60000, days: 30, main: 20, video: 0, game: 0 },
  { id: 'C03', name: 'Combo 20GB + Work 10GB', type: 'COMBO', price: 65000, days: 30, main: 20, video: 0, game: 0 },
  { id: 'C04', name: 'Combo 25GB + Game 15GB', type: 'COMBO', price: 75000, days: 30, main: 25, video: 0, game: 15 },
  { id: 'C05', name: 'Combo 30GB + Video 20GB', type: 'COMBO', price: 95000, days: 30, main: 30, video: 20, game: 0 },
  { id: 'C06', name: 'Combo 35GB + Social 25GB', type: 'COMBO', price: 100000, days: 30, main: 35, video: 0, game: 0 },
]

export async function seedPackageCatalog() {
  try {
    const ddb = getDdb()
    const TABLE_PACKAGE_CATALOG = process.env.TABLE_PACKAGE_CATALOG!

    console.log('Seeding package catalog...')

    for (const pkg of CATALOG_DATA) {
      await ddb.send(
        new PutCommand({
          TableName: TABLE_PACKAGE_CATALOG,
          Item: {
            id: pkg.id,
            name: pkg.name,
            type: pkg.type,
            price: pkg.price,
            days: pkg.days,
            main: pkg.main,
            video: pkg.video,
            game: pkg.game,
            created_at: new Date().toISOString(),
          },
        })
      )
      console.log(`✓ Seeded ${pkg.id} - ${pkg.name}`)
    }

    console.log('✅ Package catalog seeding complete!')
    return { success: true, count: CATALOG_DATA.length }
  } catch (error) {
    console.error('Error seeding package catalog:', error)
    throw error
  }
}
