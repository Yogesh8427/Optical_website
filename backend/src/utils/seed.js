require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Settings = require('../models/Settings');
const LensBrand = require('../models/LensBrand');
const LensType = require('../models/LensType');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Admin user
  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
    console.log('Admin user created:', process.env.ADMIN_EMAIL);
  } else {
    console.log('Admin user already exists');
  }

  // Default settings
  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({ storeName: 'OptiVision', whatsappNumber: process.env.WHATSAPP_NUMBER || '' });
    console.log('Default settings created');
  }

  // Default lens brands
  const lensBrandsCount = await LensBrand.countDocuments();
  if (!lensBrandsCount) {
    await LensBrand.insertMany([
      { name: 'Zeiss', description: 'Premium German optics', active: true },
      { name: 'Crizal', description: 'Anti-reflective lenses by Essilor', active: true },
      { name: 'Hoya', description: 'Japanese precision optics', active: true },
      { name: 'Essilor', description: 'World leader in ophthalmic optics', active: true },
    ]);
    console.log('Lens brands seeded');
  }

  // Default lens types
  const lensTypesCount = await LensType.countDocuments();
  if (!lensTypesCount) {
    await LensType.insertMany([
      { name: 'Single Vision', description: 'One prescription throughout', extraPrice: 0, active: true },
      { name: 'Progressive', description: 'Multiple focal zones', extraPrice: 1500, active: true },
      { name: 'Bifocal', description: 'Two distinct zones', extraPrice: 800, active: true },
      { name: 'Blue Cut', description: 'Filters blue light', extraPrice: 500, active: true },
      { name: 'Anti Glare', description: 'Reduces reflections', extraPrice: 300, active: true },
      { name: 'Photochromic', description: 'Darkens in sunlight', extraPrice: 1200, active: true },
      { name: 'Driving Lens', description: 'Optimized for driving', extraPrice: 700, active: true },
    ]);
    console.log('Lens types seeded');
  }

  await mongoose.disconnect();
  console.log('Seed complete');
}

seed().catch((err) => { console.error(err); process.exit(1); });
