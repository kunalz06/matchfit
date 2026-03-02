# Gopika (MatchFit) Application Documentation

## 1. Application Architecture
The application is a full-stack web application designed to manage tailoring orders. It serves three main user roles: Admin, Tailor, and Customer.

### Tech Stack:
- **Frontend (Client):** React.js with React Router (`react-router-dom`) and Axios for HTTP requests.
- **Backend (Server):** Node.js, Express.js.
- **Database:** MySQL (`mysql2` library).

### Key Features & Routing
- **Admin:**
  - Login via `/admin-login` (Backend: `POST /api/auth/admin` - uses bcrypt for password hashing).
  - Dashboard (`/admin-dashboard`) allows the admin to view all orders for the current month, add new orders, edit existing orders, and delete orders.
  - Backend uses `GET /api/orders/all`, `POST /api/orders/add`, `PUT /api/orders/update/:orderNo`, `DELETE /api/orders/delete/:orderNo`.
- **Tailor:**
  - Login via `/tailor-login` (Backend: `POST /api/auth/tailor` - plain text password check).
  - Dashboard (`/tailor-dashboard`) allows a tailor to view orders assigned to them and update their status (e.g., in progress, completed, delivered).
- **Customer:**
  - Customer Portal (`/customer`) providing information.
  - Track Order (`/track-order`) allows customers to see the current status of their order using their `orderNo` (Backend: `GET /api/customer/track/:order_no`).

---

## 2. Resolved Errors & Fixed Issues

### A. Frontend (React Client) Fixes
1. **Login Navigation:** Removed problematic `onLogin` props causing crashes. Implemented `useNavigate` from `react-router-dom` in `AdminLogin.js` and `TailorLogin.js` for safe redirections.
2. **Dashboard State Management:** Implemented `localStorage` to securely store `tailorName` upon login so `TailorDashboard.js` can correctly fetch assigned orders without relying on lost props.

### B. Backend (Node/Express Server) Fixes
1. **Routing Cleanup:** Deleted the unused and broken `routes/tailor.js` file, as the frontend correctly uses `orders.js` endpoints for tailor operations. 
2. **Schema Case-Sensitivity:** Fixed DB column queries involving `order_no` by correcting them to `orderNo` in `customer.js` to prevent query mismatches.
3. **Admin Dashboard Logic:** Removed the `MONTH(dueDate)` filter in the admin `orders/all` route, ensuring all orders are properly visible to the administrator regardless of the month.
4. **Enhanced Security:** Upgraded tailor authentication to support `bcrypt` password hashing alongside legacy plaintext fallbacks in `auth.js`.

---

## 3. Possible Future Upgrades

1. **Authentication Improvements:** Look into adopting JSON Web Tokens (JWT) for secure, stateless sessions instead of relying purely on `localStorage` strings. Add username/email fields to Tailor logins to uniquely identify users instead of shared passwords.
2. **Database Framework:** Add an ORM like Sequelize or Prisma to enforce strong SQL typing and simplify schema migrations compared to raw string queries.
3. **State Management:** Utilize Context API or Redux on the frontend to manage user sessions and global application state more robustly.
4. **Request Validation:** Add payload validation using `Joi` or `express-validator` to ensure all backend routes receive properly formatted data (dates, tailor assignments, status strings) before executing database queries.
