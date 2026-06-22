export interface Translations {
  hi?: { name?: string; description?: string };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  parentId: Category | null;
  translations?: Translations;
  createdAt: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  active: boolean;
}

export interface Frame {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: Category;
  brandId: Brand;
  framePrice: number;
  material: string;
  gender: 'men' | 'women' | 'unisex' | 'kids';
  colors: string[];
  sizes: string[];
  images: string[];
  featured: boolean;
  active: boolean;
  requiresLens: boolean;
  inStock: boolean;
  translations?: Translations;
  createdAt: string;
}

export interface LensBrand {
  _id: string;
  name: string;
  logo: string;
  description: string;
  active: boolean;
}

export interface LensType {
  _id: string;
  name: string;
  description: string;
  image: string;
  extraPrice: number;
  active: boolean;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonUrl: string;
  sortOrder: number;
  active: boolean;
}

export interface EyePrescription {
  sph: string;
  cyl: string;
  axis: string;
}

export interface Inquiry {
  _id: string;
  frameId: Frame;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  selectedColor: string;
  selectedSize: string;
  powerRequired: boolean;
  prescriptionFile: string;
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  add: string;
  lensBrandId: LensBrand | null;
  lensTypes: LensType[];
  notes: string;
  status: 'new' | 'contacted' | 'quoted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Settings {
  _id: string;
  storeName: string;
  logo: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  googleMapsUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  termsContent: string;
  privacyContent: string;
  aboutContent: {
    heading: string;
    subheading: string;
    body: string;
    mission: string;
    vision: string;
    highlights: string[];
  };
  seoDefaults: {
    title: string;
    description: string;
    ogImage: string;
  };
}

export interface Testimonial {
  _id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
  active: boolean;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: Pagination;
  message?: string;
}

export interface DashboardStats {
  counts: {
    totalFrames: number;
    totalCategories: number;
    totalBrands: number;
    totalInquiries: number;
  };
  recentInquiries: Inquiry[];
  monthlyInquiries: { _id: { year: number; month: number }; count: number }[];
}

export interface Offer {
  _id: string;
  title: string;
  description: string;
  occasionName: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  productIds: { _id: string; name: string; slug: string; images: string[]; framePrice: number }[];
  bannerImage: string;
  bgColor: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  title: string;
  description: string;
  type: 'eye_checkup' | 'discount' | 'gift';
  discountType: 'percentage' | 'flat' | 'free_service';
  discountValue: number;
  validUntil?: string;
  maxUses: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

// Lens Wizard form state
export interface WizardFormData {
  frameId: string;
  frameName: string;
  selectedColor: string;
  selectedSize: string;
  powerRequired: boolean;
  prescriptionMethod: 'upload' | 'manual' | null;
  prescriptionFile: File | null;
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  add: string;
  lensBrandId: string;
  lensTypes: string[];
  notes: string;
  needsCheckup: boolean;
  customerName: string;
  phone: string;
  email: string;
  city: string;
}
