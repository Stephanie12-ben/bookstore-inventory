📚 Bookstore Inventory Management System
A comprehensive MERN stack application for managing bookstore inventory with authentication, CRUD operations and stock monitoring.

✅ Core Features

User Authentication: Secure admin login with JWT tokens
Book Management: Complete CRUD operations for book inventory
Inventory Tracking: Real-time stock quantity monitoring
Search & Filter: Advanced search by title, author, ISBN, and category
Low Stock Alerts: Visual indicators for books with quantity < 5

📊 Dashboard Features

Total books count
Low stock books alert
Highest priced book display
Category count summary
Quick action buttons

🔧 Technical Features

JWT-based authentication
MongoDB database with Mongoose ODM
RESTful API design
Input validation and error handling
Responsive Bootstrap UI
Font Awesome icons

🛠 Tech Stack
Frontend - React 18, React Router, Bootstrap 5, React Bootstrap
Backend - Node.js, Express.js
Database - MongoDB with Mongoose
Authentication - JWT, bcrypt

⚡ Quick Setup

1. Clone Repository
git clone <https://github.com/Stephanie12-ben/bookstore-inventory.git>
cd bookstore-inventory

2. Backend Setup:
cd backend, npm install

Create .env file:
envMONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=G7&kP9!mR2zVq#yX4tWuZ8LpJhSd0BnQ
PORT=5000

Start backend server:
npm run dev or npm start

3. Frontend Setup:
cd ../frontend, npm install, npm start

⚡ Admin Access

Email: admin@bookstore.com
Password: password
