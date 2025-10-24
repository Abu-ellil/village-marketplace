const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const Service = require('../models/Service');
const mockData = require('../../data/mockData');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not set. Create a .env file or export the variable.');
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    // Clear existing products and services
    await Product.deleteMany({});
    await Service.deleteMany({});

    // Insert mock products and services if available
    if (Array.isArray(mockData.products) && mockData.products.length) {
      await Product.insertMany(mockData.products);
      console.log(`Inserted ${mockData.products.length} products`);
    }

    if (Array.isArray(mockData.services) && mockData.services.length) {
      await Service.insertMany(mockData.services);
      console.log(`Inserted ${mockData.services.length} services`);
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
