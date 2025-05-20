# MiniBoard

This folder contains a minimalist implementation of the **MiniBoard** project.
It provides a typed Express server with Prisma ORM and shared Zod schemas for
the core models (Board, Group, Item).

## Structure
- `client/` – Vite/React SPA for the frontend.
- `server/` – Express server with Prisma setup.
- `shared/` – shared TypeScript types and Zod schemas.

The server exposes CRUD APIs for boards, groups, and items.

## Running the project

1. Install dependencies in both the `server` and `client` folders:

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

2. Generate the Prisma client and start the API server:

   ```bash
   cd server
   npx prisma migrate dev --name init
   npm start
   ```

3. In another terminal, start the React development server:

   ```bash
   cd client
   npm run dev
   ```

The client assumes the API is running on `http://localhost:3000`.
