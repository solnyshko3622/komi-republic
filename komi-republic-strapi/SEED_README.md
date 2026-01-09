# Database Seeding Guide

This guide explains how to populate your Strapi database with initial data for the Komi Republic tourist attractions application.

## What Gets Seeded

The seeding script will populate your database with:

- **5 Categories**: Nature, Museums, Architecture, Parks, Cultural Sites
- **10 Places**: Tourist attractions across the Komi Republic including:
  - Manpupuner Rock Formations (Маньпупунёр)
  - Pechora-Ilych Nature Reserve (Печоро-Илычский заповедник)
  - National Museum of Komi Republic (Национальный музей Республики Коми)
  - Stephen of Perm Cathedral (Стефановский собор)
  - Syktyvkar City Park (Центральный парк культуры и отдыха)
  - Komi Republican Drama Theatre (Коми республиканский театр драмы)
  - Yugyd Va National Park (Национальный парк Югыд ва)
  - Finno-Ugric Ethnopark (Финно-угорский этнопарк)
  - Ust-Vym Historical and Cultural Complex (Историко-культурный комплекс Усть-Вымь)
  - Syktyvkar Art Museum (Национальная галерея Республики Коми)
- **12 Reviews**: Sample reviews for various attractions

## Prerequisites

1. Make sure Strapi is installed and configured
2. Ensure your database is set up and accessible
3. Make sure you have created the content types (Place, Category, Review)

## How to Seed the Database

### Step 1: Start Strapi (if not already running)

```bash
cd komi-republic-strapi
npm run develop
```

Wait for Strapi to fully start and be accessible.

### Step 2: Run the Seed Script

Open a new terminal window and run:

```bash
cd komi-republic-strapi
npm run seed
```

The script will:
1. Clear existing data (Categories, Places, Reviews)
2. Create 5 categories
3. Create 10 places with full details
4. Create 12 reviews linked to the places
5. Publish all content automatically

### Expected Output

You should see output similar to:

```
🌱 Starting database seeding...
🗑️  Clearing existing data...
✅ Existing data cleared
📁 Seeding categories...
  ✓ Created category: Природа
  ✓ Created category: Музеи
  ...
✅ Created 5 categories
📍 Seeding places...
  ✓ Created place: Маньпупунёр
  ✓ Created place: Печоро-Илычский заповедник
  ...
✅ Created 10 places
⭐ Seeding reviews...
  ✓ Created review by Иван Петров
  ...
✅ Created 12 reviews

🎉 Database seeding completed successfully!

Summary:
  - Categories: 5
  - Places: 10
  - Reviews: 12
```

## Verify the Data

After seeding, you can verify the data in several ways:

1. **Strapi Admin Panel**: 
   - Go to http://localhost:1337/admin
   - Check Content Manager → Categories, Places, Reviews

2. **API Endpoints**:
   - Categories: http://localhost:1337/api/categories
   - Places: http://localhost:1337/api/places
   - Reviews: http://localhost:1337/api/reviews

## Customizing the Data

To customize the seed data:

1. Edit [`src/seed-data.js`](src/seed-data.js)
2. Modify the `categories`, `places`, or `reviews` arrays
3. Run `npm run seed` again

## Troubleshooting

### Error: "Cannot find module"
Make sure you're in the `komi-republic-strapi` directory when running the seed command.

### Error: "Connection refused"
Ensure Strapi is running before executing the seed script.

### Error: "Permission denied"
Make sure your Strapi user has permission to create and delete content.

### Data not appearing in frontend
1. Check that all content is published (not in draft state)
2. Verify API permissions in Strapi Settings → Users & Permissions → Roles → Public
3. Make sure the frontend is pointing to the correct API URL

## Re-seeding

To re-seed the database (this will delete all existing data):

```bash
npm run seed
```

**Warning**: This will delete ALL existing categories, places, and reviews before creating new ones.

## Files

- [`src/seed-data.js`](src/seed-data.js) - Contains all seed data
- [`scripts/seed.js`](scripts/seed.js) - Seeding script
- [`package.json`](package.json) - Contains the `seed` npm script

## Next Steps

After seeding:
1. Start the frontend application
2. Browse the attractions at http://localhost:5173
3. Test the search and filter functionality
4. Add more content through the Strapi admin panel if needed
