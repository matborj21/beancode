# BeanCode POS – API Contract (tRPC)

## Auth

### getSession

- Returns current user session

---

## Products

### product.getAll

- Filters: category, search
- Returns active products

### product.create (Admin)

- Input: name, price, category
- Output: Product

---

## Orders

### order.create

- Input:
  - items[]
  - paymentMethod
- Output:
  - orderId
  - totalAmount

### order.getById

- Input: orderId
- Output: Order + Items

### order.list

- Filters:
  - date range
  - status

---

## Reports

### report.dailySales

- Input: date
- Output:
  - totalSales
  - totalOrders
  - productBreakdown[]

---

## Security Rules

- Cashier: create orders
- Barista: view orders
- Admin: full access
- All mutations validated via Zod
