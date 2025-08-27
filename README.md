# 🚌 UniBus Connect

A modern bus route discovery platform built with React, Node.js, and MongoDB. 
Users can search university bus routes by location, while admins can upload official route PDFs to parse and update schedules.

## ✨ Features

### For Users
- 🔎 Search routes by stop/location (case-insensitive)
- 🧭 Type-ahead suggestions for locations
- 🔄 View route details including stops, dates, times
- ⚡ Fast, responsive UI with toast notifications

### For Admins
- 📄 Upload and parse bus route PDFs (server-side extraction)
- 🧠 Automatic deduplication/upsert of routes
- 🗂️ Recent uploads list
- 📍 Fetch unique locations for dropdowns
- 🔐 Protected routes with role-based access (admin)

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios, Motion, React Hot Toast
- **Backend:** Node.js, Express 5, MongoDB, Mongoose 8, JWT, Multer, pdf-parse, pdfjs-dist, express-validator, bcryptjs, dotenv, CORS

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database (local or cloud)

### 1) Clone the repository
```bash
git clone <repository-url>
cd "UniBus Connect"
```

### 2) Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```


### 4) Run the application
```bash
# Start server (from server directory)
npm run server   # uses nodemon
# or
npm start        # node server.js

# Start client (from client directory)
npm run dev
```

**Happy Coding! 🚌✨**