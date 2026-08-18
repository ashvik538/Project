# 🌐 Full-Stack Portfolio & Admin Management Portal

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It includes a public-facing portfolio website with a contact form, and a **JWT-secured admin dashboard** to manage all incoming messages.

> 🔗 **Live Demo:** [king-two-ivory.vercel.app](https://king-two-ivory.vercel.app)
> 
> 🖥️ **Backend API:** Hosted on [Render](https://render.com) | 🗄️ **Database:** MongoDB Atlas

---

## ✨ Features

### 🖥️ Public Portfolio
- **Home** — Landing page with introduction
- **About** — Personal information and background
- **Skills** — Skills & technologies overview
- **Projects** — Projects showcase
- **Contact** — Fully functional contact form that saves messages to MongoDB

### 🔐 Admin Dashboard (JWT Protected)
- Secure login with JWT token-based authentication
- View **all incoming messages** from the contact form
- **Search** messages by name, email, subject, phone, or message content
- **Filter** by: All / Unread / Read / Starred
- **Mark** messages as read/unread or starred
- **Delete** individual messages
- **Bulk actions** — bulk delete or bulk mark as read/unread
- **Live statistics** — Total, Unread, Starred, and Last 24h message counts

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| React Router v7 | Client-side routing & protected routes |
| Axios | HTTP requests to backend API |
| CSS3 | Custom styling & animations |
| Vite | Build tool & dev server |
| React Icons | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js v5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Token (JWT) | Admin authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin resource sharing |
| dotenv | Environment variable management |

### Deployment
| Service | Usage |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend (Node.js) hosting |
| MongoDB Atlas | Cloud database |

---

## 📁 Project Structure

```
Project/
├── backend/
│   ├── server1.js        # Express server, all API routes
│   ├── ashvik.js         # Helper/utility file
│   ├── .env              # Environment variables
│   └── package.json
│
└── vite-project/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx            # Landing page
    │   │   ├── About.jsx           # About section
    │   │   ├── Skills.jsx          # Skills section
    │   │   ├── Contact.jsx         # Contact page with form
    │   │   ├── ContactForm.jsx     # Projects page
    │   │   ├── AdminLogin.jsx      # Admin login page
    │   │   ├── AdminDashboard.jsx  # Admin management panel
    │   │   ├── ProtectedRoute.jsx  # JWT route guard
    │   │   └── Admin.css           # Admin dashboard styles
    │   ├── App.jsx                 # Root app with routing
    │   ├── Icon.jsx                # Social/contact icons
    │   ├── Navbar.css              # Navbar styles
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `/backend` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password
PORT=5000
```

Start the backend server:

```bash
npm start
```

Server will run at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd vite-project
npm install
```

Create a `.env` file in the `/vite-project` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

App will run at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/contact` | Submit a contact form message |

### Admin (🔒 JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login — returns JWT token |
| `GET` | `/api/admin/verify` | Verify token validity |
| `GET` | `/api/admin/stats` | Get dashboard statistics |
| `GET` | `/api/admin/messages` | Fetch messages (search & filter) |
| `PATCH` | `/api/admin/messages/:id` | Update read/starred status |
| `DELETE` | `/api/admin/messages/:id` | Delete a single message |
| `POST` | `/api/admin/messages/bulk-delete` | Bulk delete messages |
| `PATCH` | `/api/admin/messages/bulk-mark` | Bulk mark messages as read/unread |

---

## 🔒 Security

- Admin routes are protected by **JWT Bearer Token** authentication
- Tokens expire after **24 hours**
- Frontend uses **ProtectedRoute** component to guard the dashboard
- CORS policy restricts allowed origins
- Environment variables keep credentials out of source code

---

## 📦 Build for Production

```bash
cd vite-project
npm run build
```

The production-ready files will be generated in the `dist/` folder.

---

## 🙋‍♂️ Author

**Ashvik** — [@ashvik538](https://github.com/ashvik538)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
