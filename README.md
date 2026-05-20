# BoxFlow

## Subscription Box Management Platform

A scalable SaaS platform enabling businesses to launch and manage subscription-based product boxes with customizable plans, automated billing, shipment tracking, customer segmentation, and operational analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Vite |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Payments | Stripe |
| Charts | Recharts |
| Calendar | React Big Calendar |
| State | Redux Toolkit |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test mode)

### Installation

```bash
# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run install:all
```

### Environment Setup

```bash
# Copy environment template
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and Stripe keys
```

### Seed Database

```bash
cd server
npm run seed
```

### Development

```bash
# Run both client and server
npm run dev

# Or separately:
npm run dev:server  # Backend on :5000
npm run dev:client  # Frontend on :5173
```

### Default Users (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@boxflow.com | password123 |
| Operator | operator@boxflow.com | password123 |
| Customer | customer@boxflow.com | password123 |

## Project Structure

```
boxflow/
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level pages
│   │   ├── store/       # Redux Toolkit store
│   │   ├── services/    # API service layer
│   │   ├── hooks/       # Custom hooks
│   │   ├── context/     # React contexts
│   │   ├── routes/      # Route definitions
│   │   └── utils/       # Utilities
│   └── package.json
├── server/          # Node.js backend (Express)
│   ├── src/
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # Express routes
│   │   ├── middleware/  # Auth, RBAC, validation
│   │   ├── services/    # Business logic
│   │   ├── config/      # DB, Stripe config
│   │   ├── utils/       # Helpers
│   │   └── jobs/        # Cron jobs
│   └── package.json
└── package.json     # Root workspace
```

## Features

- 🔐 JWT Authentication with RBAC
- 📦 Subscription plan management
- 🎨 Product box CMS with drag-and-drop builder
- 💳 Stripe billing integration
- 🚚 Shipment tracking with Kanban board
- 📊 Analytics dashboard with Recharts
- 👥 Customer segmentation
- 📅 Operations calendar
- 🔔 Notification system
- 🌓 Dark/Light theme

## License

MIT
