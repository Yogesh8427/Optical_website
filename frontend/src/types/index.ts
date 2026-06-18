export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
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
  email: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  googleMapsUrl: string;
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
  customerName: string;
  phone: string;
  email: string;
  city: string;
}
