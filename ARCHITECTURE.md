# BeanCode POS – Architecture Guide

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + tRPC cache
- **Backend API:** tRPC
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** NextAuth
- **Deployment Ready:** Vercel / Docker compatible

---

## Monorepo Structure

src/
├── app/ # Next.js App Router
│ ├── (auth)/login/
│ ├── (pos)/mobile/
│ ├── (pos)/desktop/
│ ├── admin/
│ ├── api/
│ └── layout.tsx
│
├── components/
│ ├── ui/ # Reusable UI (Button, Card, Table)
│ ├── pos/ # POS-specific components
│ ├── layout/
│
├── server/
│ ├── api/ # tRPC routers
│ ├── auth/ # NextAuth config
│ ├── db.ts
│
├── styles/
│ └── globals.css
│
├── lib/
│ ├── utils.ts
│ └── constants.ts
│
└── prisma/
└── schema.prisma

---

## Application Layers

### UI Layer

- Stateless components
- Tailwind-based design system
- Touch-optimized POS components

### App Layer

- Page routing
- Server Components for data fetching
- Client Components for interaction

### API Layer

- tRPC procedures
- Auth-protected routes
- Input validation via Zod

### Data Layer

- Prisma models
- PostgreSQL database
- Transaction-safe operations

---

## Key Design Principles

- Mobile-first POS experience
- Offline-tolerant UI patterns
- Reusable components
- Clear cashier & admin separation
- Role-based access control
