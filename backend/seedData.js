const mongoose = require('mongoose');
const Product = require('./models/Product');
const Shop = require('./models/Shop');
const User = require('./models/User');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Sample products (without shop requirement - let it be optional)
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        categoryId: 'ELECTRONICS',
        pricing: { basePrice: 5999, finalPrice: 5999, discountPercentage: 0 },
        inventory: { quantity: 50 },
        image: 'https://via.placeholder.com/500x500?text=Wireless+Headphones',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Headphones+1', alt: 'Front View', isPrimary: true }
        ],
        rating: 4.5,
        views: 245,
        sales: 32
      },
      {
        name: 'Casual T-Shirt',
        description: 'Comfortable 100% cotton casual t-shirt available in multiple colors',
        categoryId: 'CLOTHING',
        pricing: { basePrice: 499, finalPrice: 499, discountPercentage: 0 },
        inventory: { quantity: 120 },
        image: 'https://via.placeholder.com/500x500?text=T-Shirt',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=TShirt+1', alt: 'Front', isPrimary: true }
        ],
        rating: 4.2,
        views: 512,
        sales: 84
      },
      {
        name: 'Coffee Maker',
        description: 'Automatic drip coffee maker with programmable timer and thermal carafe',
        categoryId: 'HOME_DECOR',
        pricing: { basePrice: 2499, finalPrice: 2499, discountPercentage: 0 },
        inventory: { quantity: 35 },
        image: 'https://via.placeholder.com/500x500?text=Coffee+Maker',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Coffee+1', alt: 'Full View', isPrimary: true }
        ],
        rating: 4.7,
        views: 389,
        sales: 67
      },
      {
        name: 'Sports Shoes',
        description: 'High-performance athletic shoes designed for running and sports',
        categoryId: 'SPORTS',
        pricing: { basePrice: 3499, finalPrice: 3499, discountPercentage: 0 },
        inventory: { quantity: 60 },
        image: 'https://via.placeholder.com/500x500?text=Sports+Shoes',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Shoes+1', alt: 'Side', isPrimary: true }
        ],
        rating: 4.4,
        views: 456,
        sales: 78
      },
      {
        name: 'JavaScript Guide',
        description: 'Comprehensive guide to modern JavaScript programming and best practices',
        categoryId: 'BOOKS',
        pricing: { basePrice: 599, finalPrice: 599, discountPercentage: 0 },
        inventory: { quantity: 45 },
        image: 'https://via.placeholder.com/500x500?text=JS+Book',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Book+1', alt: 'Cover', isPrimary: true }
        ],
        rating: 4.8,
        views: 234,
        sales: 42
      },
      {
        name: 'Toy Robot',
        description: 'Interactive robot toy with voice commands and programmable movements',
        categoryId: 'TOYS',
        pricing: { basePrice: 1999, finalPrice: 1999, discountPercentage: 0 },
        inventory: { quantity: 25 },
        image: 'https://via.placeholder.com/500x500?text=Robot+Toy',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Toy+1', alt: 'Full', isPrimary: true }
        ],
        rating: 4.6,
        views: 378,
        sales: 56
      },
      {
        name: 'Face Cream',
        description: 'Moisturizing face cream with vitamin E and natural ingredients',
        categoryId: 'PHARMACY',
        pricing: { basePrice: 799, finalPrice: 799, discountPercentage: 0 },
        inventory: { quantity: 80 },
        image: 'https://via.placeholder.com/500x500?text=Face+Cream',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Cream+1', alt: 'Product', isPrimary: true }
        ],
        rating: 4.3,
        views: 567,
        sales: 125
      },
      {
        name: 'Organic Coffee Beans',
        description: '100% organic premium coffee beans from plantations in India',
        categoryId: 'GROCERIES',
        pricing: { basePrice: 449, finalPrice: 449, discountPercentage: 0 },
        inventory: { quantity: 100 },
        image: 'https://via.placeholder.com/500x500?text=Coffee+Beans',
        images: [
          { url: 'https://via.placeholder.com/500x500?text=Beans+1', alt: 'Bag', isPrimary: true }
        ],
        rating: 4.9,
        views: 423,
        sales: 89
      }
    ];

    // Insert products
    for (const product of products) {
      const exists = await Product.findOne({ name: product.name });
      if (!exists) {
        await Product.create(product);
        console.log(`Product created: ${product.name}`);
      } else {
        console.log(`Product already exists: ${product.name}`);
      }
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
