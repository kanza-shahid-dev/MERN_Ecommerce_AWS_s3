# 🛍️ MERN Ecommerce (AWS S3 + Cloudflare CDN)

A full-stack **Ecommerce web application** built with the **MERN stack (MongoDB, Express, React, Node.js)** — featuring **secure image uploads to AWS S3**, global asset delivery via **Cloudflare CDN**, and a fully functional shopping experience with authentication, cart, payments, and admin management.

---


### 🪣 AWS S3 Storage
All product images and user uploads are securely stored in **Amazon S3**.


### 🧑‍💻 Frontend (React + Vite / CRA)
- Responsive UI for all devices
- Product listing, filtering, and search
- Files are uploaded using the **AWS SDK**.
- S3 bucket policies are configured for controlled access.
- Each upload returns a public CDN URL.
- Cart management and checkout
- User authentication (JWT-based)
- Profile management and order history
- Admin dashboard for managing products, users, and orders


### ⚙️ Backend (Node.js + Express)
- AWS S3 integration for media uploads
- Cloudflare CDN for optimized image delivery
- RESTful API with Express
- MongoDB (Mongoose) for data storage
- Secure JWT authentication & role-based access control
- Order management and inventory handling

---
