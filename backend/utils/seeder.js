// Run with: node utils/seeder.js
// Seeds default admin + regular user accounts + sample services

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
dotenv.config();

const User    = require('../models/User.model');
const Service = require('../models/Service.model');

const sampleServices = [
  {
    title: 'CCTV Camera Installation',
    shortDescription: 'Professional installation of CCTV cameras for homes & businesses.',
    description: 'We provide end-to-end CCTV installation services including site survey, cable routing, DVR/NVR setup, and remote-view configuration.',
    icon: 'fa-camera',
    startingPrice: 2500,
    features: ['Site Survey', 'Cable Routing', 'DVR/NVR Setup', 'Remote View Config', '1-Year Support'],
    order: 1,
  },
  {
    title: 'IP / PTZ / Full HD Camera',
    shortDescription: 'Advanced IP, PTZ and Full HD cameras for superior coverage.',
    description: 'Upgrade to IP-based surveillance with pan-tilt-zoom (PTZ) cameras and Full HD resolution.',
    icon: 'fa-video',
    startingPrice: 4000,
    features: ['IP Camera Setup', 'PTZ Configuration', 'Full HD Clarity', 'PoE Support', 'Cloud Storage'],
    order: 2,
  },
  {
    title: 'Computer Service & Gaming PC Build',
    shortDescription: 'Expert computer repairs, upgrades and custom gaming PC builds.',
    description: 'From hardware repair and OS reinstallation to building a beast gaming rig from scratch.',
    icon: 'fa-desktop',
    startingPrice: 300,
    features: ['Hardware Repair', 'OS Installation', 'Custom PC Build', 'Performance Tuning', 'Data Recovery'],
    order: 3,
  },
  {
    title: 'Printer Service & Cartridge Refilling',
    shortDescription: 'All-brand printer repair, maintenance and cartridge refilling.',
    description: 'We service all major printer brands. Cartridge refilling, head cleaning, and full printer maintenance.',
    icon: 'fa-print',
    startingPrice: 150,
    features: ['All Brand Support', 'Cartridge Refilling', 'Head Cleaning', 'Paper Jam Fix', 'Driver Install'],
    order: 4,
  },
  {
    title: 'Laptop Service & Sales',
    shortDescription: 'Complete laptop repair, screen replacement, battery service and sales.',
    description: 'Screen replacement, battery swap, keyboard repair, and motherboard-level fixes.',
    icon: 'fa-laptop',
    startingPrice: 500,
    features: ['Screen Replacement', 'Battery Service', 'Keyboard Repair', 'Motherboard Fix', 'Sales'],
    order: 5,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding...');

    // Clear existing
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing users & services');

    // Create superadmin
    await User.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL    || 'admin@gatewaycomputers.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'superadmin',
      phone: '9591064356',
    });
    console.log('👤 Superadmin created');

    // Create a sample regular user
    await User.create({
      name: 'Test User',
      email: 'user@example.com',
      password: 'User@1234',
      role: 'user',
      phone: '9876543210',
    });
    console.log('👤 Sample user created');

    // Seed services
    await Service.insertMany(sampleServices);
    console.log('🛠️  Sample services seeded');

    console.log('\n✅ Seeding complete!');
    console.log('─────────────────────────────────');
    console.log('  SUPERADMIN');
    console.log(`  Email    : ${process.env.ADMIN_EMAIL || 'admin@gatewaycomputers.com'}`);
    console.log(`  Password : ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
    console.log('─────────────────────────────────');
    console.log('  SAMPLE USER');
    console.log('  Email    : user@example.com');
    console.log('  Password : User@1234');
    console.log('─────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
