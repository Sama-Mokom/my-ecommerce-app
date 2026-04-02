# 🛒 My E-Commerce App

A small but scalable full-stack e-commerce web application built with **Vue 3** on the frontend and a **Node.js** REST API backend. The project supports product listing, cart management, image storage, and a database-backed inventory system — all running locally with a single setup command.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Frontend Dependencies](#2-install-frontend-dependencies)
  - [3. Install Backend Dependencies](#3-install-backend-dependencies)
  - [4. Create the PostgreSQL Database](#4-create-the-postgresql-database)
  - [5. Run the Setup Script](#5-run-the-setup-script)
  - [6. Start the Backend Server](#6-start-the-backend-server)
  - [7. Start the Frontend Dev Server](#7-start-the-frontend-dev-server)
- [Database Management](#-database-management)
- [Image Migration](#-image-migration)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## 📌 Project Overview

This is a full-stack e-commerce platform where users can browse products, manage a shopping cart, and view product details. The application is structured with a clear separation between the Vue 3 frontend and a Node.js backend API. The backend manages product data, image storage, and database operations through a suite of utility scripts that make local setup straightforward.

Key capabilities:
- Product listing and detail views
- Shopping cart with state management via Pinia
- Image upload and migration support
- Database setup, seeding, and reset via npm scripts
- Decoupled frontend and backend that communicate over a local API

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Vue 3 |
| Build Tool | Vite |
| State Management | Pinia |
| Backend | Node.js (Express) |
| Database | PostgreSQL |
| Database GUI | pgAdmin |
| Styling | CSS |
| Package Manager | npm |

---

## 🗂 Project Structure

```
my-ecommerce-app/
├── Backend/               # Node.js backend API server
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Main API entry point
├── public/                # Static assets (images, favicon, etc.)
├── scripts/               # Utility scripts (DB setup, image migration)
├── src/                   # Vue 3 frontend source
│   ├── components/        # Reusable Vue components
│   ├── views/             # Page-level Vue components
│   ├── router/            # Vue Router configuration
│   └── main.js            # Frontend entry point
├── stores/                # Pinia state management stores
├── index.html             # HTML entry point for Vite
├── vite.config.js         # Vite configuration
└── package.json           # Root frontend dependencies and scripts
```

---

## ✅ Prerequisites

Before you begin, make sure the following are installed on your machine:

| Tool | Minimum Version | Download |
|---|---|---|
| Node.js | v16.x or higher | https://nodejs.org |
| npm | v7.x or higher | Comes with Node.js |
| Git | Any recent version | https://git-scm.com |
| PostgreSQL | v13.x or higher | https://www.postgresql.org/download |
| pgAdmin 4 | Any recent version | https://www.pgadmin.org/download |

To verify your installations, run:

```bash
node --version
npm --version
git --version
psql --version
```

---

## 🚀 Getting Started

Follow these steps in order to get the full application running on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/Sama-Mokom/my-ecommerce-app.git
cd my-ecommerce-app
```

### 2. Install Frontend Dependencies

From the root of the project, install the Vue 3 / Vite frontend dependencies:

```bash
npm install
```

### 3. Install Backend Dependencies

Navigate into the `Backend/` folder and install its own dependencies separately:

```bash
cd Backend
npm install
cd ..
```

> The frontend and backend have independent `package.json` files and must each be installed separately.

### 4. Create the PostgreSQL Database

The application requires a running PostgreSQL instance with a dedicated database. You can create it via **pgAdmin** or the **psql** command line.

**Option A — Using pgAdmin:**
1. Open pgAdmin and connect to your local PostgreSQL server
2. Right-click **Databases** → **Create** → **Database**
3. Set the name to `ecommerce` (or your preferred name) and save

**Option B — Using psql:**
```bash
psql -U postgres
```
```sql
CREATE DATABASE ecommerce;
CREATE USER ecommerce_user WITH PASSWORD 'yourpassword';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;
\q
```

Then update your database credentials in `Backend/.env` (see [Environment Variables](#-environment-variables)) before proceeding.

### 5. Run the Setup Script

From the **project root**, run the setup script. This initialises the PostgreSQL schema, seeds default data, and prepares the project for development:

```bash
npm run setup
```

This only needs to be run **once** on a fresh clone. If you ever need to reset the project back to a clean state (clearing all existing data), run:

```bash
npm run setup-clear
```

> ⚠️ `setup-clear` will **delete all existing database records and seeded data**. Only use this when you want a full reset.

### 6. Start the Backend Server

Open a **new terminal window**, navigate to the `Backend/` directory, and start the API server:

```bash
cd Backend
npm run server
```

The backend server will start and listen for API requests. Keep this terminal window open while you use the app.

> By default the backend runs on **http://localhost:3000** (check `Backend/server.js` to confirm or change the port).

### 7. Start the Frontend Dev Server

In a **separate terminal window**, from the project root, start the Vite development server:

```bash
npm run dev
```

Vite will print a local URL in the terminal — typically:

```
  VITE v4.x.x  ready in Xms

  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser. The app should be fully running with both frontend and backend connected.

---

## 🗄 Database Management

The project ships with dedicated scripts for managing the database schema and data.

### Update the Database Schema

If the project's database structure has changed (e.g., after pulling new commits), run:

```bash
npm run update-database
```

This applies any structural updates without touching your existing data.

### Update the Database and Clear Existing Data

If you want to apply schema changes while also wiping all pre-existing records:

```bash
npm run update-database-clear
```

> ⚠️ This is destructive. All existing product and order data will be removed.

### Recommended Workflow After Pulling New Changes

```bash
git pull
npm install          # in case new frontend packages were added
cd Backend && npm install && cd ..   # in case new backend packages were added
npm run update-database
```

---

## 🖼 Image Migration

If you have product images stored in a directory outside the project (e.g., from a previous installation or an older folder structure), you can move them into the backend's expected file directory by running:

```bash
npm run migrate-images
```

This script copies or moves image files from their existing location into the directory the backend server uses to serve static images. Run this once after setup if you have pre-existing image assets.

---

## 📜 Available Scripts

All scripts are run from the **project root** unless otherwise stated.

| Script | Command | Description |
|---|---|---|
| Start Frontend Dev Server | `npm run dev` | Starts the Vite dev server with hot module reload |
| Initial Project Setup | `npm run setup` | Initialises database and seeds default data |
| Setup (Clean) | `npm run setup-clear` | Clears existing data and re-runs full setup |
| Migrate Images | `npm run migrate-images` | Moves images from an external folder to the server directory |
| Update Database | `npm run update-database` | Applies schema updates while preserving existing data |
| Update Database (Clean) | `npm run update-database-clear` | Applies schema updates and clears existing data |
| Start Backend Server | `npm run server` *(from `Backend/`)* | Starts the Node.js API server |

---

## 🔧 Environment Variables

The project may require environment variables for configuring ports, API base URLs, or other settings. Create a `.env` file in the **project root** and in the **`Backend/`** directory if they do not already exist.

**Frontend (`/.env`):**

```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend (`/Backend/.env`):**

```env
PORT=3000

# PostgreSQL connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=yourpassword
```

> If `.env.example` files are present in the repository, copy them and fill in the values:
> ```bash
> cp .env.example .env
> cp Backend/.env.example Backend/.env
> ```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is open source. See the repository for license details.

---

*Built with Vue 3 + Vite + Node.js + PostgreSQL**