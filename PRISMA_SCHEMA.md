# BeanCode POS – Prisma Data Model

## Core Models

### User

- id
- name
- email
- role (CASHIER | BARISTA | ADMIN)
- createdAt

### Product

- id
- name
- category
- price
- imageUrl
- isActive

### Order

- id
- orderNumber
- status
- totalAmount
- paymentMethod
- createdAt
- cashierId

### OrderItem

- id
- orderId
- productId
- quantity
- price

### Category

- id
- name

---

## Relationships

- User → Orders (1:N)
- Order → OrderItems (1:N)
- Product → OrderItems (1:N)
- Category → Products (1:N)

---

## Enum Types

- Role
- OrderStatus
- PaymentMethod

---

## Notes

- All monetary values stored as integers (cents)
- Orders are immutable after payment
- Soft delete via `isActive`
