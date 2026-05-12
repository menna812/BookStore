# BookStore

A full-stack online bookstore application with customer and admin functionalities.

## Project Structure

- **Backend** - Node.js/Express server with MySQL database
- **Frontend** - React/TypeScript application with Vite

## Getting Started

### Prerequisites
- Node.js and npm installed
- MySQL server running (via XAMPP or local installation)

### Installation

1. **Backend Setup**
   ```bash
   cd BookStore-master/Backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd BookStore-master/Frontend
   npm install
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Features

- User authentication (customer and admin login)
- Browse and search books
- Shopping cart functionality
- Order management
- Admin dashboard
- User profile management

## Database

The database schema is located in the root directory:
- `online_bookstore (1).sql` - Database schema
- `triggers.sql` - Database triggers

## Documentation

See [BookStore-master/README.md](./BookStore-master/README.md) for more detailed documentation.

## License

ISC
