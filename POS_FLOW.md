# BeanCode POS – User & Transaction Flow

## Roles

- Cashier
- Barista
- Manager / Admin

---

## 1. Authentication Flow

1. User opens POS app
2. Login screen displayed
3. Credentials validated
4. Session stored via NextAuth
5. Redirect based on role

---

## 2. Mobile POS Flow (Cashier)

### Menu Browsing

1. Search or select category
2. Tap product card
3. Item added to order
4. Quantity adjustable

### Checkout

1. Review order list
2. Subtotal calculated
3. VAT applied
4. Total displayed
5. Select payment method
6. Process transaction
7. Order sent to kitchen

---

## 3. Desktop POS Flow

1. Category selection (left panel)
2. Product selection (center grid)
3. Order summary updates (right panel)
4. Process Order
5. Receipt generated
6. Inventory updated

---

## 4. Barista Flow

1. View incoming orders
2. Mark item as:
   - Preparing
   - Ready
   - Completed

---

## 5. Admin / Manager Flow

1. View sales reports
2. Filter by date / product
3. Manage:
   - Products
   - Users
   - Inventory
4. Export daily reports

---

## Transaction States

- PENDING
- PAID
- VOIDED
- REFUNDED
