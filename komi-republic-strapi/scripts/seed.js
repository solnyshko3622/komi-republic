/**
 * Script to run database seeding
 * Usage: node scripts/seed.js
 */

const Strapi = require('@strapi/strapi');
const { categories, places, reviews } = require('../src/seed-data');

async function main() {
  console.log('🌱 Starting database seeding...');
  
  const appContext = await Strapi.compile();
  const app = await Strapi(appContext).load();
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    
    await app.db.query('api::review.review').deleteMany({});
    await app.db.query('api::place.place').deleteMany({});
    await app.db.query('api::category.category').deleteMany({});
    
    console.log('✅ Existing data cleared');

    // Seed categories
    console.log('📁 Seeding categories...');
    const createdCategories = [];
    
    for (const category of categories) {
      const created = await app.db.query('api::category.category').create({
        data: {
          ...category,
          publishedAt: new Date()
        }
      });
      createdCategories.push(created);
      console.log(`  ✓ Created category: ${category.nameRu}`);
    }
    
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Seed places
    console.log('📍 Seeding places...');
    const createdPlaces = [];
    
    for (const place of places) {
      const created = await app.db.query('api::place.place').create({
        data: {
          ...place,
          publishedAt: new Date()
        }
      });
      createdPlaces.push(created);
      console.log(`  ✓ Created place: ${place.nameRu}`);
    }
    
    console.log(`✅ Created ${createdPlaces.length} places`);

    // Seed reviews
    console.log('⭐ Seeding reviews...');
    let reviewCount = 0;
    
    for (const review of reviews) {
      const place = createdPlaces[review.placeIndex];
      if (place) {
        await app.db.query('api::review.review').create({
          data: {
            author: review.author,
            rating: review.rating,
            comment: review.comment,
            date: review.date,
            place: place.id,
            publishedAt: new Date()
          }
        });
        reviewCount++;
        console.log(`  ✓ Created review by ${review.author}`);
      }
    }
    
    console.log(`✅ Created ${reviewCount} reviews`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\nSummary:`);
    console.log(`  - Categories: ${createdCategories.length}`);
    console.log(`  - Places: ${createdPlaces.length}`);
    console.log(`  - Reviews: ${reviewCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
  
  await app.destroy();
  process.exit(0);
}

main();
