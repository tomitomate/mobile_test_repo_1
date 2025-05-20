# MiniBoard

MiniBoard is a lightweight example of a Monday-style board application. It uses
an Express API with Prisma and a placeholder React client. Shared TypeScript
types and Zod schemas live alongside both.

## Structure
- `client/` – React SPA (Vite) – empty scaffold for now.
- `server/` – Express server with Prisma ORM.
- `shared/` – shared type definitions and validation schemas.

## Running the project
1. Install dependencies for the server:
   ```bash
   cd server && npm install
   ```
2. Prepare the database and generate the Prisma client:
   ```bash
   npx prisma db push
   ```
3. Start the API server:
   ```bash
   npm run dev
   ```
4. In another terminal, start the React client (after you set it up):
   ```bash
   cd ../client && npm run dev
   ```

See the root `README.md` for an overview of this repository.
