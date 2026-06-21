# Optical Store Website

A full-stack web application for an optical/eyewear retail store. Customers can browse frames, customise lenses through a guided wizard, and send inquiries directly via WhatsApp. The store owner manages everything through a secure admin panel.

> **Brand name:** Replace the placeholder store name with your real store name in **Admin → Settings** before going live.

---

## What It Does

### Customer-facing website
- Hero banner slider with auto-play
- Browse frames by category, brand, gender, material, price range
- Full-text product search
- Product detail page with multi-image carousel (auto-advances, smooth slide transitions)
- Multiple colour variants per frame — each colour has its own image gallery
- **Add Power** button (shown only when the admin enables it per product) — opens an 8-step lens customisation wizard
- Quick inquiry form — sends all details to the store's WhatsApp
- Eye check-up at store option in the inquiry form
- Coupons & free offers page — customers can claim coupons and share via WhatsApp
- Contact page with Google Maps embed and all contact methods
- Fully responsive (mobile, tablet, desktop)

### Admin panel (`/admin`)
| Section | What you can manage |
|---|---|
| Dashboard | Frame count, inquiry count, recent activity |
| Banners | Hero slider images with title, subtitle, CTA button |
| Categories | Eyewear categories with images |
| Brands | Frame brands with logos |
| Frames | Full product management — multiple images per colour, price, material, gender, sizes, Add Power toggle |
| Lens Brands | Brands available in the lens wizard |
| Lens Types | Lens types with extra pricing |
| Coupons | Create discount / gift / free checkup coupons with usage limits and expiry |
| Inquiries | View all customer inquiries, update status |
| Testimonials | Customer reviews shown on the homepage |
| FAQs | Frequently asked questions |
| Settings | Store name, logo, WhatsApp number, phone, email, address, Google Maps URL, social links, theme colour |

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM |
| Cloudinary | Image storage (auto-deleted when removed from admin) |
| JWT | Admin authentication |
| Multer | File upload handling |
| bcryptjs | Password hashing |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Shadcn UI | Accessible component library |
| Framer Motion | Animations (carousels, floating orbs, transitions) |
| TanStack React Query | Data fetching and caching |
| Zustand | Admin auth state |
| Axios | HTTP client with auth interceptor |

---

## Project Structure

```
Optical_website/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB + Cloudinary setup
│   │   ├── controllers/     # Business logic for every resource
│   │   ├── middleware/      # JWT auth, Multer upload, error handler
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # Seed scripts, WhatsApp message builder
│   └── server.js
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (public)/    # Home, Products, Product detail, Contact, Coupons
        │   └── admin/       # All admin panel pages
        ├── components/
        │   ├── home/        # Hero, CategoryGrid, FeaturedProducts, ContactSection, etc.
        │   ├── layout/      # Navbar, Footer (with social icons), AdminSidebar
        │   ├── lens-wizard/ # 8-step lens customisation wizard
        │   └── products/    # ProductCard, ProductGrid, Filters
        ├── hooks/           # React Query data hooks
        ├── lib/             # Axios instance, query client, utils
        ├── store/           # Zustand auth store
        └── types/           # Shared TypeScript interfaces
```

---

## Getting Started

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (free tier works)
- Cloudinary account (free tier works)

### 1. Clone
```bash
git clone https://github.com/Yogesh8427/Optical_website.git
cd Optical_website
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
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

Seed the database (first time only):
```bash
npm run seed           # Creates admin user, lens brands, lens types
npm run seed:dummy     # Adds sample frames, categories, banners
```

Start:
```bash
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

Start:
```bash
npm run dev
```

### 4. Open
| URL | What |
|---|---|
| `http://localhost:3000` | Public website |
| `http://localhost:3000/admin` | Admin panel |
| `http://localhost:5001/api` | API base |

---

## Default Admin Login

```
Email:    admin@yourstore.com   (set in .env)
Password: YourStrongPassword    (set in .env)
```

Change these in your `.env` before going live.

---

## Key API Endpoints

```
# Public
GET  /api/banners
GET  /api/categories
GET  /api/brands
GET  /api/frames              ?search= &category= &brand= &gender= &page=
GET  /api/frames/:slug
GET  /api/lens-brands
GET  /api/lens-types
GET  /api/testimonials
GET  /api/faqs
GET  /api/settings
GET  /api/coupons/public
POST /api/coupons/:id/claim
POST /api/inquiries           # Returns WhatsApp redirect URL

# Admin (Bearer token required)
POST/PUT/DELETE  /api/banners/:id
POST/PUT/DELETE  /api/categories/:id
POST/PUT/DELETE  /api/brands/:id
POST/PUT/DELETE  /api/frames/:id
POST/PUT/DELETE  /api/lens-brands/:id
POST/PUT/DELETE  /api/lens-types/:id
POST/PUT/DELETE  /api/coupons/:id
GET/PUT          /api/inquiries
PUT              /api/settings
GET              /api/dashboard/stats
```

---

## Lens Wizard Flow

```
Customer clicks "Add Power" on a product
        ↓
Step 1  → Upload prescription or enter power manually
Step 2  → Choose lens brand
Step 3  → Choose lens type
Step 4  → Add notes
Step 5  → Enter name, phone, city
        ↓
Inquiry saved to database
        ↓
WhatsApp opens with full details pre-filled
```

If the customer doesn't need power lenses, they fill a quick inquiry form instead (name, phone, optional notes, optional eye check-up request at store).

---

## Image Handling

- Each frame colour has its own image slot
- Multiple images can be uploaded per colour
- Images are stored on Cloudinary
- When an image is removed in the admin panel, it is automatically deleted from Cloudinary — no storage waste

---

## Deployment

| Layer | Platform |
|---|---|
| Frontend | Vercel |
| Backend | VPS (DigitalOcean / Railway / AWS EC2) |
| Database | MongoDB Atlas |
| Images | Cloudinary |

For Vercel deployment set `NEXT_PUBLIC_API_URL` to your live backend URL in the Vercel environment variables dashboard.

---

## License

Private project — built for a specific optical store business.
