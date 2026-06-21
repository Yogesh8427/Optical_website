# Frontend — Optical Store

Next.js 15 (App Router) frontend for the optical store website.

## Stack

- **Next.js 15** — App Router, server + client components
- **TypeScript** — full type coverage
- **Tailwind CSS** — utility-first styling with CSS custom properties for theming
- **Shadcn UI** — accessible component primitives
- **Framer Motion** — page animations, carousels, floating orbs
- **TanStack React Query** — data fetching, caching, mutations
- **Zustand** — admin JWT auth state
- **Axios** — HTTP client with auth interceptor

## Setup

```bash
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
```

```bash
npm run dev       # development server on :3000
npm run build     # production build
npm run lint      # ESLint check
```

## Key Directories

```
src/
├── app/
│   ├── (public)/           # Public pages — Home, Products, Product detail, Contact, Coupons
│   ├── admin/              # Admin panel pages (protected by middleware.ts)
│   └── globals.css         # Global styles, CSS keyframes, theme utilities
├── components/
│   ├── home/               # Homepage sections (Hero, CategoryGrid, FeaturedProducts, etc.)
│   ├── layout/             # Navbar, Footer, AdminSidebar
│   ├── lens-wizard/        # 8-step lens customisation wizard
│   └── products/           # ProductCard, ProductGrid, Filters
├── hooks/                  # useFrames, useSettings, useCoupons, etc.
├── lib/
│   ├── api.ts              # Axios instance (auto-attaches Bearer token)
│   └── queryClient.ts      # TanStack Query client
├── store/
│   └── authStore.ts        # Zustand store — admin JWT
└── types/
    └── index.ts            # Shared TypeScript interfaces
```

## Theming

The site colour is controlled by a single CSS custom property:

```css
var(--theme-primary, #2563eb)
```

This is set from the store's Settings via the admin panel. Every component reads this variable so changing the theme colour in Settings updates the entire site instantly.

## Admin Auth

1. Admin logs in at `/admin/login` → receives JWT
2. JWT stored in Zustand (`authStore`) → persisted to `localStorage`
3. `middleware.ts` redirects unauthenticated `/admin/*` requests to `/admin/login`
4. Axios interceptor attaches `Authorization: Bearer <token>` automatically

## Image Handling (Frames)

Each frame colour has its own image slot. Each slot may contain multiple comma-separated Cloudinary URLs. When displaying:

```ts
// First image of first colour
frame.images?.[0]?.split(',')[0]?.trim()

// All images for active colour
frame.images[activeColor].split(',').map(u => u.trim()).filter(Boolean)
```
