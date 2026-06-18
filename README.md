# 👓 OptiVision — Optical Store Website

A full-stack web application for an optical store that allows customers to browse eyewear, customize lenses through a guided wizard, and send inquiries directly via WhatsApp. The admin panel provides complete control over all store content.

> **Note:** "OptiVision" is a placeholder brand name. Replace it with your real store name before going live.

---

## 🌐 Purpose

This website is built for an **optical/eyewear retail store** to:

- Showcase their collection of frames, sunglasses, and eyewear online
- Let customers customize lenses (power, brand, type) through a step-by-step wizard
- Redirect customer inquiries directly to WhatsApp — **no payment gateway, no cart**
- Allow the store owner to manage all content through a secure admin panel

---

## ✨ Key Features

### 👤 Customer Side (Public Website)
| Feature | Description |
|---|---|
| 🏠 Home Page | Hero banners, category grid, featured products, brands, testimonials, FAQs |
| 🔍 Product Browsing | Browse all frames with filters (category, brand, gender, material, price) |
| 🔎 Search | Full-text search across frame names and descriptions |
| 📦 Product Detail | Image gallery, frame details, pricing, and "Customize Lens" button |
| 🧙 Lens Wizard | 8-step guided lens customization (power → prescription → lens brand → lens type → customer info) |
| 💬 WhatsApp Inquiry | On wizard completion, customer is redirected to WhatsApp with a pre-filled message |
| 📱 Fully Responsive | Works on mobile, tablet, and desktop |

### 🔐 Admin Panel (`/admin`)
| Section | What you can manage |
|---|---|
| 📊 Dashboard | Total frames, categories, brands, inquiries at a glance |
| 🖼️ Banners | Homepage hero slider images with title, subtitle, and CTA button |
| 🏷️ Categories | Eyewear categories with images (Men, Women, Kids, Sunglasses, etc.) |
| 🏆 Brands | Frame brands with logos |
| 👓 Frames | Full product management — images, price, material, gender, colors, sizes |
| 🔬 Lens Brands | Brands available for lens customization |
| 📋 Lens Types | Lens types with extra pricing (Single Vision, Bifocal, Progressive, etc.) |
| 📩 Inquiries | View all customer inquiries, update status (New → Contacted → Quoted → Completed) |
| ⭐ Testimonials | Add/manage customer reviews (admin-only, shown on homepage) |
| ❓ FAQs | Manage frequently asked questions shown on homepage |
| ⚙️ Settings | Store name, logo, WhatsApp number, address, social links, SEO defaults |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **MongoDB Atlas** | Cloud database |
| **Mongoose** | ODM for MongoDB |
| **Cloudinary** | Image storage and delivery |
| **JWT (jsonwebtoken)** | Admin authentication |
| **Multer** | File upload handling |
| **bcryptjs** | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Shadcn UI** | Pre-built accessible components |
| **TanStack React Query** | Server state management + caching |
| **Zustand** | Admin auth state |
| **Axios** | HTTP client with auth interceptor |
| **Sonner** | Toast notifications |

---

## 📁 Project Structure

```
Optical_website/
├── backend/                        # Node.js + Express API
│   ├── src/
│   │   ├── config/                 # DB + Cloudinary config
│   │   ├── controllers/            # Route handlers
│   │   ├── middleware/             # Auth, upload, error handler
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express routes
│   │   └── utils/                  # Seed scripts, WhatsApp builder
│   ├── server.js
│   └── package.json
│
└── frontend/                       # Next.js 15 app
    ├── src/
    │   ├── app/
    │   │   ├── (public)/           # Public pages (Home, Products, etc.)
    │   │   └── admin/              # Admin panel pages
    │   ├── components/
    │   │   ├── home/               # Homepage sections
    │   │   ├── lens-wizard/        # 8-step lens wizard components
    │   │   ├── layout/             # Navbar, Footer, AdminSidebar
    │   │   └── products/           # Product cards and filters
    │   ├── hooks/                  # React Query data hooks
    │   ├── lib/                    # Axios instance, query client, utils
    │   ├── store/                  # Zustand auth store
    │   └── types/                  # TypeScript interfaces
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/Yogesh8427/Optical_website.git
cd Optical_website
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@yourstore.com
ADMIN_PASSWORD=YourStrongPassword
```

Seed the database:
```bash
npm run seed          # Creates admin user, lens brands, lens types
npm run seed:dummy    # Adds sample frames, categories, banners with images
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

Start the frontend:
```bash
npm run dev
```

### 4. Access the app
| URL | Description |
|---|---|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin panel |
| `http://localhost:5001/api` | Backend API |

---

## 🔐 Admin Login

Default credentials (set via seed script):
```
Email:    admin@yourstore.com
Password: YourStrongPassword
```

> Change these in your `.env` file before going live.

---

## 📡 API Overview

```
POST   /api/auth/login
GET    /api/auth/me

GET    /api/banners
GET    /api/categories
GET    /api/brands
GET    /api/frames              # supports ?search, ?category, ?brand, ?gender, ?page
GET    /api/frames/:slug
GET    /api/lens-brands
GET    /api/lens-types
GET    /api/testimonials
GET    /api/faqs
GET    /api/settings

POST   /api/inquiries           # Creates inquiry + returns WhatsApp redirect URL

# Admin protected routes (require Bearer token)
POST/PUT/DELETE  /api/banners/:id
POST/PUT/DELETE  /api/categories/:id
POST/PUT/DELETE  /api/brands/:id
POST/PUT/DELETE  /api/frames/:id
POST/PUT/DELETE  /api/lens-brands/:id
POST/PUT/DELETE  /api/lens-types/:id
POST/PUT/DELETE  /api/testimonials/:id
POST/PUT/DELETE  /api/faqs/:id
GET/PUT          /api/inquiries
PUT              /api/settings
GET              /api/dashboard/stats
```

---

## 🧙 Lens Wizard Flow

```
Step 1 → Does customer need power lenses?
Step 2 → How to provide prescription? (Upload or Manual entry)
Step 3 → Upload prescription image / Enter power manually
Step 4 → Choose lens brand
Step 5 → Choose lens type
Step 6 → Add special notes
Step 7 → Enter customer details (name, phone, city)
         ↓
    Inquiry saved to DB
         ↓
    WhatsApp opens with pre-filled message
```

---

## 🌍 Deployment

| Layer | Recommended Platform |
|---|---|
| Frontend | [Vercel](https://vercel.com) |
| Backend | VPS (DigitalOcean / AWS EC2) or Railway |
| Database | MongoDB Atlas (cloud) |
| Images | Cloudinary (cloud) |

---

## 📄 License

This project is private and built for a specific optical store business.

---

## 👨‍💻 Built With

- [Next.js](https://nextjs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Cloudinary](https://cloudinary.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
