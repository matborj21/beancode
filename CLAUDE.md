# BeanCode POS — Engineering & Build Guide

You are assisting in building a modern café Point-of-Sale (POS) system called **BeanCode POS**.

This document defines the **technical goals, architecture, constraints, and build order**.  
Follow this guide strictly while generating code, components, and logic.

---

## 1. Tech Stack (DO NOT CHANGE)

Framework:

- Next.js 15 (App Router)
- React 18
- TypeScript

Styling:

- Tailwind CSS v3 (NOT v4)
- shadcn/ui component library
- Utility-first styling (no CSS modules)

Backend:

- Prisma ORM
- PostgreSQL
- tRPC (no REST endpoints)

State Management:

- Local React state for cart
- Server Actions / tRPC for persistence

Authentication:

- NOT implemented initially
- POS is public during MVP
- Auth (Admin / Cashier) will be added later

---

## 2. Project Goal

Build a **production-ready café POS system** that supports:

- Fast order entry
- Touch-friendly UI (tablet / mobile)
- Real-time cart updates
- Accurate transaction & inventory tracking
- Simple daily reporting for managers

---

## 3. Target Users

- Cashiers (primary)
- Baristas
- Café Managers

---

## 4. Supported Platforms

- Mobile POS (phone / tablet)
- Desktop cashier web app
- Responsive design required

---

## 5. Visual & UX Design Rules

Theme:

- Warm café aesthetic
- Cream / off-white background
- Coffee brown primary color
- Muted green = success
- Soft red = destructive actions

UI Style:

- Rounded cards
- Subtle shadows
- Large touch targets
- Clean, readable typography
- Clear visual hierarchy

Accessibility:

- High color contrast
- Clear primary vs secondary actions
- Buttons must be easily tappable

---

## 6. Core Screens to Build

### 6.1 Mobile Login Screen (UI only for now)

- Full-screen coffee background image
- Centered logo
- Password input
- Primary "Sign In" button
- Minimal overlay design

(No authentication logic yet)

---

### 6.2 Mobile POS Menu Screen

- Search bar at top
- Horizontal category filters:
  - All
  - Espresso
  - Non-Caffeine
  - Pastry
- Menu items as cards:
  - Image
  - Name
  - Price
- Bottom navigation:
  - Home
  - History
  - Transaction
  - Profile

---

### 6.3 Mobile Order / Checkout Screen

- List of ordered items
- Quantity controls (+ / −)
- Price per item
- Summary section:
  - Subtotal
  - VAT
  - Total
- Payment options:
  - Cash
  - GCash
  - Card
- Primary action:
  - Process Transaction
- Secondary actions:
  - Void Transaction
  - Cancel Transaction

---

### 6.4 Desktop Cashier Screen

Layout:

- Left: category tabs
- Center: product grid (large clickable cards)
- Right: sticky order summary panel

Features:

- Order number
- Timestamp
- Total emphasized
- Large "Process Order" button

---

### 6.5 Admin / Reports Screen (Desktop)

Sidebar navigation:

- Products
- Sales
- Users
- Supplies

Sales Report Table:

- Product name
- Size
- Quantity
- Price
- Sales total

Summary:

- Total quantity sold
- Total sales amount

---

## 7. POS Functional Flow

1. Cashier selects products
2. Items added to cart
3. Quantity adjustments allowed
4. Checkout screen shows totals
5. Transaction processed
6. Inventory deducted
7. Transaction saved
8. Cart resets

---

## 8. Data Models (Prisma)

Expected models:

- Product
- Category
- Transaction
- TransactionItem
- Inventory

Inventory rules:

- Deduct stock on successful transaction
- Prevent checkout if stock is insufficient

---

## 9. Component Architecture Rules

- All UI must be componentized
- Reusable primitives:
  - Button
  - Card
  - Dialog
  - Table
- POS-specific components:
  - ProductCard
  - CartItem
  - OrderSummary
  - PaymentModal

Folder structure guideline:
src/
components/
ui/ → shadcn components
pos/ → POS-specific components
app/
page.tsx
layout.tsx
server/
api/
db/

---

## 10. Development Phases (STRICT ORDER)

Phase 1 — UI only

- POS layout
- Product grid
- Cart UI
- Checkout UI

Phase 2 — State logic

- Cart state
- Totals calculation
- Quantity updates

Phase 3 — Backend

- Prisma models
- Save transactions
- Inventory deduction

Phase 4 — Reports

- Sales reports
- Summary totals

Phase 5 — Authentication

- Roles (Admin / Cashier)
- Secure routes

---

## 11. Code Quality Rules

- TypeScript everywhere
- No `any`
- No inline magic numbers
- Clear variable naming
- Functions should be small and readable
- Prefer composition over inheritance

---

## 12. Output Expectations

When generating code:

- Use Next.js App Router conventions
- Use Tailwind classes (no CSS files)
- Use shadcn/ui components
- Ensure mobile responsiveness
- Output production-ready code

Do NOT:

- Introduce Tailwind v4
- Change project structure
- Add authentication early
- Use deprecated Next.js APIs

---

## End of Guide
