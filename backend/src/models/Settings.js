const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'OptiVision' },
    logo: { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    googleMapsUrl: { type: String, default: '' },
    phone: { type: String, default: '' },
    businessHours: { type: String, default: '' },
    aboutContent: {
      heading: { type: String, default: 'About Us' },
      subheading: { type: String, default: '' },
      body: { type: String, default: '' },
      mission: { type: String, default: '' },
      vision: { type: String, default: '' },
      highlights: [{ type: String }],
    },
    seoDefaults: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      ogImage: { type: String, default: '' },
    },
    primaryColor: { type: String, default: "#2563eb" },
    secondaryColor: { type: String, default: "#64748b" },
    termsContent: { type: String, default: '' },
    privacyContent: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
