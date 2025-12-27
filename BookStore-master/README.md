# 📚 BookStore Management System

A full-stack web application for managing an online bookstore with robust admin and customer features, automated stock management, and comprehensive reporting.

---

## ✨ Features

### Customer Features
- **User Registration & Login:** Secure authentication, profile management, password hashing
- **Book Browsing & Search:** Filter/search by title, author, ISBN, publisher, or category
- **Book Details:** View book info, authors, publisher, stock, and ratings
- **Shopping Cart:** Add/remove books, update quantities, view cart summary
- **Order Placement:** Checkout, shipping info, order history, order details
- **Profile Management:** Update personal info, view past orders

### Admin Features
- **Book Management:** Add, edit, delete books; manage stock, price, threshold, authors, publisher
- **Publisher Management:** Add, edit, delete publishers
- **Customer Management:** View, edit, delete customers
- **Order Management:** View all customer orders, order details, accept/decline orders
- **Publisher Orders (Replenishment):** Auto/manual creation, confirm receipt, prevent duplicate pending orders
- **Stock Alerts:** Low/out-of-stock notifications, quick replenishment
- **Reports:**
  - Total sales (last month, by day)
  - Top 5 customers (last 3 months)
  - Top 10 selling books (last 3 months)
  - Book replenishment count
- **User-Friendly Error Handling:** All endpoints return clear, descriptive error messages

### System Features
- **Automatic Stock Management:** Triggers handle stock updates and auto-ordering
- **Low Stock Alerts:** Automatic publisher orders when stock falls below threshold
- **Role-Based Access:** Admin/customer separation, protected routes
- **Responsive Design:** Works on desktop and mobile devices

---

## 🗄 Entity-Relationship Diagram (ERD)

```
CUSTOMER (customer_id PK, firstname, lastname, email, phone_no, shipping_address, avatar)
   | 1
   |<-------------------+ 0..N
ORDER (order_id PK, customer_id FK, admin_id FK, order_date, total_amount)
   | 1
   |<-------------------+ 0..N
ORDER_ITEM (order_item_id PK, order_id FK, ISBN FK, quantity, price)
   | N
   |------------------->| 1
BOOK (ISBN PK, Title, Category, Threshold, Stock_Quantity, Price, Publisher_id FK)
   | N
   |------------------->| 1
PUBLISHER (publisher_id PK, name, contact_info)
   | 1
   |<-------------------+ N
ORDER_PUB (order_pub_id PK, admin_id FK, publisher_id FK, status, constant_quantity)
   | 1
   |<-------------------+ N
ORDER_PUB_ITEM (order_pub_item_id PK, order_pub_id FK, ISBN FK, quantity)
   | N
   |------------------->| 1
BOOK_AUTHOR (ISBN FK, author_id FK) [junction]
   | N
   |------------------->| 1
AUTHOR (author_id PK, name)
   | 1
   |<-------------------+ N
CART (cart_id PK, customer_id FK)
   | 1
   |<-------------------+ N
CART_ITEM (cart_item_id PK, cart_id FK, ISBN FK, quantity)
   | N
   |------------------->| 1
ADMIN (admin_id PK, name, email, password)
```

---

## 📝 Main Entities & Attributes

- **CUSTOMER:** customer_id, firstname, lastname, email, phone_no, shipping_address, avatar
- **ADMIN:** admin_id, name, email, password
- **BOOK:** ISBN, Title, Category, Threshold, Stock_Quantity, Price, Publisher_id
- **AUTHOR:** author_id, name
- **BOOK_AUTHOR:** ISBN, author_id (many-to-many)
- **PUBLISHER:** publisher_id, name, contact_info
- **ORDER:** order_id, customer_id, admin_id, order_date, total_amount
- **ORDER_ITEM:** order_item_id, order_id, ISBN, quantity, price
- **ORDER_PUB:** order_pub_id, admin_id, publisher_id, status, constant_quantity
- **ORDER_PUB_ITEM:** order_pub_item_id, order_pub_id, ISBN, quantity
- **CART:** cart_id, customer_id
- **CART_ITEM:** cart_item_id, cart_id, ISBN, quantity

---

## 🔄 Business Logic & User Flows

- **Registration/Login:** Customers and admins register/login with hashed passwords. JWT tokens for session management.
- **Book Management:** Admins can add, edit, delete books, assign authors, set thresholds, and manage stock.
- **Publisher Orders:** When a book's stock drops below its threshold, a trigger creates a pending publisher order (if none exists for that book/publisher). Admins can also create manual orders.
- **Order Placement:** Customers add books to cart, checkout, and place orders. Stock is decremented, and order history is saved.
- **Order Management:** Admins can view all orders, accept/decline, and see order details.
- **Replenishment Confirmation:** Admins confirm receipt of publisher orders, which increases book stock.
- **Reports:** Admins can view sales, top customers, top books, and replenishment counts.
- **Error Handling:** All endpoints return clear, user-friendly error messages for invalid or missing data.

---

## 📊 Key SQL/Report Queries

### Total Sales Last Month
```sql
SELECT SUM(total_amount) as total_sales
FROM `ORDER`
WHERE MONTH(order_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
  AND YEAR(order_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
```

### Total Sales by Specific Date
```sql
SELECT SUM(total_amount) AS daily_sales
FROM `ORDER`
WHERE DATE(order_date) = ?
```

### Top 5 Customers (Last 3 Months)
```sql
SELECT c.firstname, c.lastname, SUM(o.total_amount) as total_spent
FROM `ORDER` o
JOIN CUSTOMER c ON o.customer_id = c.customer_id
WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY c.customer_id
ORDER BY total_spent DESC
LIMIT 5
```

### Top 10 Selling Books (Last 3 Months)
```sql
SELECT b.Title, SUM(oi.quantity) AS total_copies_sold
FROM ORDER_ITEM oi
JOIN `ORDER` o ON oi.order_id = o.order_id
JOIN BOOK b ON oi.ISBN = b.ISBN
WHERE o.order_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
GROUP BY b.ISBN
ORDER BY total_copies_sold DESC
LIMIT 10
```

### Book Replenishment Order Count
```sql
SELECT COUNT(opi.order_pub_id) AS times_replenished
FROM ORDER_PUB_ITEM opi
WHERE opi.ISBN = ?
```

---

## 🖥️ User Interface Screens

- **Login/Register:** Secure authentication for customers and admins
- **Dashboard:** Quick stats (books, sales, orders, alerts), navigation
- **Books:** List/search, add/edit/delete, assign authors, manage stock
- **Authors:** List, add, edit, delete authors
- **Publishers:** List, add, edit, delete publishers
- **Customers:** List, view, edit, delete customers
- **Cart:** Add/remove/update books, view summary
- **Orders:** Place/view orders, order details, order history
- **Admin Orders:** View all customer orders, accept/decline, see details
- **Publisher Orders:** View/confirm replenishment, create manual orders
- **Reports:** Sales, top customers, top books, replenishment count
- **Error Handling:** All screens display clear error messages for invalid/missing data

---

## 🚀 Getting Started

1. **Clone the repository**
2. **Install dependencies** for both backend and frontend
3. **Configure your database** using the provided schema and triggers
4. **Run backend and frontend servers**

---

## 📢 Notes
- All admin and customer actions are protected and validated.
- Publisher orders are created automatically by triggers when stock falls below threshold (no duplicates for pending orders).
- All reports return user-friendly error messages for missing or invalid data.

---

*For more details, see the full documentation and the ERD diagram in the project files.*
