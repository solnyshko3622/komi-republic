/**
 * Database seeding script for Komi Republic attractions
 * This script populates the database with initial data
 *
 * Run with: npm run strapi seed
 */

import { categories, places, reviews } from './seed-data';

async function seed(strapi: any) {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    
    await strapi.db.query('api::review.review').deleteMany({});
    await strapi.db.query('api::place.place').deleteMany({});
    await strapi.db.query('api::category.category').deleteMany({});
    
    console.log('✅ Existing data cleared');

    // Seed categories
    console.log('📁 Seeding categories...');
    const createdCategories = [];
    
    for (const category of categories) {
      const created = await strapi.db.query('api::category.category').create({
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
      const created = await strapi.db.query('api::place.place').create({
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
        await strapi.db.query('api::review.review').create({
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
        console.log(`  ✓ Created review by ${review.author} for ${place.nameRu}`);
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
    throw error;
  }
}

export default seed;
