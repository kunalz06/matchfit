# MatchFit - Tailoring Order Management System

A full-stack web application for managing tailoring orders, built with React frontend and Express.js backend with MySQL database.

## Features

- **Admin Dashboard**: Full order management, tailor management, status overview
- **Tailor Dashboard**: View assigned orders, update order status
- **Customer Portal**: Track orders by order number
- **Dark/Light Theme**: Responsive design with theme toggle

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router 6, Axios |
| Backend | Express.js 5, Node.js |
| Database | MySQL |
| Auth | bcrypt for password hashing |

## Project Structure

```
matchfit/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/          # Page Components
│   │   ├── components/     # Reusable Components
│   │   └── styles/         # CSS Styles
│   └── package.json
│
└── server/                  # Express.js Backend
    ├── server.js           # Main Server Entry
    ├── db.js               # MySQL Connection
    ├── routes/             # API Routes
    └── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or bun

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/kunalz06/matchfit.git
cd matchfit
```

### 2. Set up the database

Create a MySQL database named `matchfit`:

```sql
CREATE DATABASE matchfit;

USE matchfit;

CREATE TABLE orders (
  orderNo VARCHAR(50) PRIMARY KEY,
  type ENUM('stitching', 'alteration', 'designing') NOT NULL,
  tailor VARCHAR(100),
  dueDate DATE,
  status ENUM('in progress', 'completed', 'delivered') DEFAULT 'in progress',
  orderDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tailors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE admin_users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(255) NOT NULL
);

-- Insert default admin (password: admin123)
INSERT INTO admin_users (username, password) VALUES 
('admin', '$2b$10$YourHashedPasswordHere');
```

### 3. Configure environment variables

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_DATABASE=matchfit

# CORS Configuration (comma-separated)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Run the application

**Terminal 1 - Start the server:**
```bash
cd server
npm start
# or with nodemon for development
npx nodemon server.js
```

**Terminal 2 - Start the client:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/admin` | Admin login |
| POST | `/api/auth/tailor` | Tailor login |
| GET | `/api/auth/tailors` | Get all tailors |
| POST | `/api/auth/add-tailor` | Add new tailor |
| PUT | `/api/auth/update-tailor/:id` | Update tailor |
| DELETE | `/api/auth/delete-tailor/:id` | Delete tailor |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders/all` | Get all orders |
| GET | `/api/orders/tailor/:name` | Get tailor's orders |
| GET | `/api/orders/:orderNo` | Get single order |
| POST | `/api/orders/add` | Create new order |
| PUT | `/api/orders/update/:orderNo` | Update order |
| DELETE | `/api/orders/delete/:orderNo` | Delete order |

### Customer

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/customer/track/:order_no` | Track order status |

## User Roles

| Role | Access | Capabilities |
|------|--------|--------------|
| Admin | Username + Password | Full order & tailor management |
| Tailor | Password only | View & update assigned orders |
| Customer | No login | Track orders by number |

## CORS Configuration

The server supports flexible CORS configuration:

**Option 1: Specific Origins (Recommended for Production)**
```env
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com
```

**Option 2: Allow All (Development Only)**
```env
CORS_ALLOW_ALL=true
```

**Default Origins** (if not configured):
- http://localhost:3000
- http://localhost:3001
- http://127.0.0.1:3000
- http://127.0.0.1:3001

## License

ISC

## Author

kunalz06
