require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Frame = require('../models/Frame');
const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');
const FAQ = require('../models/FAQ');
const Settings = require('../models/Settings');

// Upload image from URL to Cloudinary
async function uploadFromUrl(url, folder, label) {
  try {
    const result = await cloudinary.uploader.upload(url, {
      folder: `optical-store/${folder}`,
      public_id: label,
      overwrite: true,
    });
    console.log(`  ✓ Uploaded: ${label}`);
    return result.secure_url;
  } catch (e) {
    console.log(`  ✗ Failed ${label}: ${e.message}`);
    return url; // fallback to original URL
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB\n');

  // ─── BANNERS ────────────────────────────────────────────────────────────────
  console.log('📸 Seeding Banners...');
  await Banner.deleteMany({});
  const bannerData = [
    { title: 'See the World in Style', subtitle: 'Premium eyewear for every face shape', buttonText: 'Shop Now', buttonUrl: '/products', sortOrder: 1, url: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&h=500&fit=crop', label: 'banner-1' },
    { title: 'New Arrivals 2025', subtitle: 'Discover the latest frames from top brands', buttonText: 'Explore', buttonUrl: '/products', sortOrder: 2, url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&h=500&fit=crop', label: 'banner-2' },
    { title: 'Customize Your Lenses', subtitle: 'Zeiss, Crizal, Hoya & more — personalized for you', buttonText: 'Learn More', buttonUrl: '/about', sortOrder: 3, url: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1200&h=500&fit=crop', label: 'banner-3' },
  ];
  for (const b of bannerData) {
    const image = await uploadFromUrl(b.url, 'banners', b.label);
    await Banner.create({ title: b.title, subtitle: b.subtitle, image, buttonText: b.buttonText, buttonUrl: b.buttonUrl, sortOrder: b.sortOrder, active: true });
  }

  // ─── CATEGORIES ─────────────────────────────────────────────────────────────
  console.log('\n📂 Seeding Categories...');
  await Category.deleteMany({});
  const categoryData = [
    { name: "Men's Glasses",    slug: 'mens-glasses',    description: 'Stylish frames for men',         url: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=300&fit=crop', label: 'cat-men' },
    { name: "Women's Glasses",  slug: 'womens-glasses',  description: 'Elegant frames for women',       url: 'https://images.unsplash.com/photo-1512275595979-ab5ec55ef823?w=400&h=300&fit=crop', label: 'cat-women' },
    { name: 'Kids Glasses',     slug: 'kids-glasses',    description: 'Fun & durable frames for kids',  url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop', label: 'cat-kids' },
    { name: 'Sunglasses',       slug: 'sunglasses',      description: 'UV protection sunglasses',       url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop', label: 'cat-sun' },
    { name: 'Computer Glasses', slug: 'computer-glasses',description: 'Blue light blocking lenses',     url: 'https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?w=400&h=300&fit=crop', label: 'cat-computer' },
    { name: 'Sports Eyewear',   slug: 'sports-eyewear',  description: 'Durable sports frames',         url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop', label: 'cat-sports' },
  ];
  const categories = {};
  for (const c of categoryData) {
    const image = await uploadFromUrl(c.url, 'categories', c.label);
    const doc = await Category.create({ name: c.name, slug: c.slug, description: c.description, image, active: true });
    categories[c.slug] = doc._id;
  }

  // ─── BRANDS ─────────────────────────────────────────────────────────────────
  console.log('\n🏷️  Seeding Brands...');
  await Brand.deleteMany({});
  const brandData = [
    { name: 'Ray-Ban',  slug: 'ray-ban',  description: 'Iconic American eyewear brand',          url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Ray-Ban_logo.svg/320px-Ray-Ban_logo.svg.png', label: 'brand-rayban' },
    { name: 'Titan',    slug: 'titan',    description: 'India\'s most trusted eyewear brand',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Titan_logo.svg/320px-Titan_logo.svg.png', label: 'brand-titan' },
    { name: 'Oakley',   slug: 'oakley',   description: 'Premium sports & performance eyewear',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Oakley_logo.svg/320px-Oakley_logo.svg.png', label: 'brand-oakley' },
    { name: 'Vogue',    slug: 'vogue',    description: 'Fashion-forward eyewear for women',       url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Vogue_Eyewear_logo.svg/320px-Vogue_Eyewear_logo.svg.png', label: 'brand-vogue' },
    { name: 'Fastrack', slug: 'fastrack', description: 'Trendy youth eyewear brand',              url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop', label: 'brand-fastrack' },
    { name: 'Lenskart', slug: 'lenskart', description: 'India\'s largest eyewear brand',          url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop', label: 'brand-lenskart' },
  ];
  const brands = {};
  for (const b of brandData) {
    const logo = await uploadFromUrl(b.url, 'brands', b.label);
    const doc = await Brand.create({ name: b.name, slug: b.slug, description: b.description, logo, active: true });
    brands[b.slug] = doc._id;
  }

  // ─── FRAMES ─────────────────────────────────────────────────────────────────
  console.log('\n👓 Seeding Frames...');
  await Frame.deleteMany({});

  const frameData = [
    // Men's
    { name: 'Ray-Ban Aviator Classic', slug: 'ray-ban-aviator-classic', brandSlug: 'ray-ban', catSlug: 'mens-glasses', price: 8500, material: 'Metal', gender: 'men', colors: ['Gold', 'Silver', 'Black'], sizes: ['M', 'L'], featured: true, urls: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=500&fit=crop', 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=500&fit=crop'] },
    { name: 'Ray-Ban Wayfarer', slug: 'ray-ban-wayfarer', brandSlug: 'ray-ban', catSlug: 'mens-glasses', price: 7200, material: 'Acetate', gender: 'men', colors: ['Black', 'Tortoise'], sizes: ['S', 'M', 'L'], featured: true, urls: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=500&fit=crop', 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=500&fit=crop'] },
    { name: 'Titan Rimless Pro', slug: 'titan-rimless-pro', brandSlug: 'titan', catSlug: 'mens-glasses', price: 4500, material: 'Titanium', gender: 'men', colors: ['Silver', 'Gunmetal'], sizes: ['M', 'L'], featured: false, urls: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=500&fit=crop'] },
    { name: 'Oakley Holbrook', slug: 'oakley-holbrook', brandSlug: 'oakley', catSlug: 'mens-glasses', price: 11000, material: 'O-Matter', gender: 'men', colors: ['Matte Black', 'Brown'], sizes: ['M', 'L', 'XL'], featured: true, urls: ['https://images.unsplash.com/photo-1556305115-2a8fc8b54544?w=600&h=500&fit=crop'] },

    // Women's
    { name: 'Vogue Cat Eye Glam', slug: 'vogue-cat-eye-glam', brandSlug: 'vogue', catSlug: 'womens-glasses', price: 5800, material: 'Acetate', gender: 'women', colors: ['Rose Gold', 'Black', 'Purple'], sizes: ['S', 'M'], featured: true, urls: ['https://images.unsplash.com/photo-1512275595979-ab5ec55ef823?w=600&h=500&fit=crop', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=500&fit=crop'] },
    { name: 'Ray-Ban Round Metal', slug: 'ray-ban-round-metal', brandSlug: 'ray-ban', catSlug: 'womens-glasses', price: 9200, material: 'Metal', gender: 'women', colors: ['Gold', 'Copper', 'Silver'], sizes: ['S', 'M'], featured: true, urls: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=500&fit=crop'] },
    { name: 'Fastrack Oval Frame', slug: 'fastrack-oval-frame', brandSlug: 'fastrack', catSlug: 'womens-glasses', price: 2200, material: 'Plastic', gender: 'women', colors: ['Pink', 'Blue', 'Black'], sizes: ['S', 'M'], featured: false, urls: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=500&fit=crop'] },

    // Sunglasses
    { name: 'Ray-Ban Clubmaster', slug: 'ray-ban-clubmaster', brandSlug: 'ray-ban', catSlug: 'sunglasses', price: 10500, material: 'Metal + Acetate', gender: 'unisex', colors: ['Black', 'Gold', 'Havana'], sizes: ['M', 'L'], featured: true, urls: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=500&fit=crop', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=500&fit=crop'] },
    { name: 'Oakley Radar EV', slug: 'oakley-radar-ev', brandSlug: 'oakley', catSlug: 'sunglasses', price: 14500, material: 'O-Matter', gender: 'unisex', colors: ['Matte Black', 'White'], sizes: ['M', 'L'], featured: false, urls: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&h=500&fit=crop'] },

    // Kids
    { name: 'Titan Kids Flex', slug: 'titan-kids-flex', brandSlug: 'titan', catSlug: 'kids-glasses', price: 1800, material: 'Flexible TR90', gender: 'kids', colors: ['Red', 'Blue', 'Green', 'Pink'], sizes: ['XS', 'S'], featured: false, urls: ['https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=500&fit=crop'] },

    // Computer
    { name: 'Lenskart Blue Shield', slug: 'lenskart-blue-shield', brandSlug: 'lenskart', catSlug: 'computer-glasses', price: 1500, material: 'TR90', gender: 'unisex', colors: ['Black', 'Brown', 'Transparent'], sizes: ['S', 'M', 'L'], featured: false, urls: ['https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?w=600&h=500&fit=crop'] },
    { name: 'Fastrack Screen Guard', slug: 'fastrack-screen-guard', brandSlug: 'fastrack', catSlug: 'computer-glasses', price: 1200, material: 'Plastic', gender: 'unisex', colors: ['Black', 'Grey'], sizes: ['M', 'L'], featured: false, urls: ['https://images.unsplash.com/photo-1587613991119-fbbe8e90531d?w=600&h=500&fit=crop'] },
  ];

  for (const f of frameData) {
    const images = [];
    for (let i = 0; i < f.urls.length; i++) {
      const url = await uploadFromUrl(f.urls[i], 'frames', `${f.slug}-${i + 1}`);
      images.push(url);
    }
    await Frame.create({
      name: f.name, slug: f.slug,
      description: `Premium ${f.material} frame by ${f.name.split(' ')[0]}. Available in ${f.colors.join(', ')}. Lightweight and durable for all-day comfort.`,
      categoryId: categories[f.catSlug],
      brandId: brands[f.brandSlug],
      framePrice: f.price,
      material: f.material,
      gender: f.gender,
      colors: f.colors,
      sizes: f.sizes,
      images,
      featured: f.featured,
      active: true,
    });
    console.log(`  ✓ Frame: ${f.name}`);
  }

  // ─── TESTIMONIALS ────────────────────────────────────────────────────────────
  console.log('\n⭐ Seeding Testimonials...');
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    { name: 'Rahul Sharma', text: 'Amazing experience! Got my progressive lenses customized perfectly. The WhatsApp consultation was super convenient.', rating: 5, active: true },
    { name: 'Priya Mehta', text: 'Love my new Ray-Ban frames. The team helped me choose the perfect size and the Zeiss lenses are crystal clear.', rating: 5, active: true },
    { name: 'Amit Patel', text: 'Great collection of frames at reasonable prices. The blue cut lenses have really reduced my eye strain during long work hours.', rating: 4, active: true },
    { name: 'Sneha Joshi', text: 'Ordered Vogue cat-eye frames with Crizal anti-glare lenses. Delivery was fast and the quality exceeded my expectations!', rating: 5, active: true },
    { name: 'Vikram Singh', text: 'Best optical store in town! The staff is knowledgeable and helped me pick the right frame for my face shape.', rating: 5, active: true },
    { name: 'Ananya Reddy', text: 'My daughter\'s kids glasses from Titan are so durable. She\'s dropped them multiple times and they\'re still perfect!', rating: 4, active: true },
  ]);
  console.log('  ✓ 6 testimonials added');

  // ─── FAQs ────────────────────────────────────────────────────────────────────
  console.log('\n❓ Seeding FAQs...');
  await FAQ.deleteMany({});
  await FAQ.insertMany([
    { question: 'How do I submit my prescription?', answer: 'You can upload a photo of your prescription directly on the product page using our Customize Lens wizard, or enter the power manually (SPH, CYL, AXIS values).', sortOrder: 1, active: true },
    { question: 'How does the WhatsApp inquiry work?', answer: 'After selecting your frame and customizing your lenses, your details are sent to us via WhatsApp. Our team will respond with a detailed quote within a few hours.', sortOrder: 2, active: true },
    { question: 'What lens brands do you offer?', answer: 'We offer premium lens brands including Zeiss, Crizal (Essilor), Hoya, and more. Each brand offers different coatings and lens types to suit your needs.', sortOrder: 3, active: true },
    { question: 'Do you offer home delivery?', answer: 'Yes! Once your order is confirmed via WhatsApp, we process and deliver your eyewear to your doorstep across India.', sortOrder: 4, active: true },
    { question: 'What is the turnaround time for prescription lenses?', answer: 'Standard single vision lenses take 3–5 working days. Progressive and specialty lenses may take 5–7 working days.', sortOrder: 5, active: true },
    { question: 'Can I get my existing frame fitted with new lenses?', answer: 'Absolutely! Bring your frame to our store or contact us via WhatsApp. We can fit new lenses in most standard frames.', sortOrder: 6, active: true },
    { question: 'Do you offer a warranty on frames?', answer: 'Yes, all frames come with a manufacturer warranty of 6–12 months against manufacturing defects. Lens warranty varies by brand.', sortOrder: 7, active: true },
  ]);
  console.log('  ✓ 7 FAQs added');

  // ─── SETTINGS UPDATE ─────────────────────────────────────────────────────────
  console.log('\n⚙️  Updating Settings...');
  await Settings.findOneAndUpdate({}, {
    storeName: 'OptiVision',
    whatsappNumber: process.env.WHATSAPP_NUMBER || '919876543210',
    email: 'info@optivision.com',
    address: '123, Vision Plaza, MG Road, Bangalore - 560001',
    socialLinks: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', twitter: '', youtube: '' },
    seoDefaults: {
      title: 'OptiVision — Premium Eyewear Store',
      description: 'Browse our collection of premium eyewear frames. Customize lenses with Zeiss, Crizal & Hoya. Get a WhatsApp quote instantly.',
    },
  }, { upsert: true });
  console.log('  ✓ Settings updated');

  await mongoose.disconnect();
  console.log('\n✅ All dummy data seeded successfully!');
}

seed().catch((err) => { console.error('Seed error:', err); process.exit(1); });
