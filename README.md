# Work-Hub

Work-Hub is a freelancing marketplace platform that connects clients with freelancers. Clients can browse and request services, while freelancers can publish services and communicate with clients through marketplace workflows.

## Project Status

This repository started as a graduation project and is currently being refactored into an interview-ready backend/database portfolio project. The current focus is backend and database architecture. The frontend still exists in the repository, but the active improvement phase is focused on the API, data model, security, maintainability, and migration planning.

The active backend still uses MongoDB with Mongoose. A Prisma/PostgreSQL foundation exists, but the full backend has not yet been migrated to PostgreSQL.

## Main Features

The repository includes backend modules for:

- Authentication and user account flows.
- Clients, freelancers, and admins.
- Services/gigs and categories.
- Requests and orders.
- Reviews.
- Conversations and messages.
- Communities and posts.
- Courses and professors from the original graduation-project scope.

Some modules are legacy and still being reviewed as part of the backend refactor.

## Tech Stack

**Backend**
- Node.js
- Express.js
- JavaScript ES modules

**Database**
- Current implementation: MongoDB
- Current data access: Mongoose
- Target refactor direction: PostgreSQL

**ORM**
- Current active models: Mongoose models
- Planned/in-progress foundation: Prisma ORM

**Frontend**
- React.js
- React Router
- Sass
- Material UI and supporting UI/chart libraries

**Tooling**
- Nodemon
- dotenv
- Joi validation
- Prisma CLI

## Repository Structure

```text
Work-Hub/
  API/
    app.js
    server.js
    DB/
    prisma/
    src/
  Front-End/
  README.md
  AGENTS.md
```

## Backend Setup

```bash
cd API
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, you can copy it with:

```powershell
Copy-Item .env.example .env
```

Then start the backend:

```bash
npm run start
```

## Environment Variables

Real secrets must stay local and must not be committed.

The backend environment is documented in `API/.env.example`:

- `PORT`: Express server port.
- `CONNECTION_URL`: MongoDB connection string used by the current Mongoose implementation.
- `TOKEN_SECRETkEY`: existing JWT secret variable name used by the current auth code.
- `BEARER_KEY`: token prefix expected by current auth middleware.
- `SALT_ROUND`: password hashing salt rounds.
- `DATABASE_URL`: PostgreSQL connection string for Prisma work.

## Database Notes

The legacy implementation uses MongoDB/Mongoose models in `API/DB/models`. Prisma is present in `API/prisma/schema.prisma` with a PostgreSQL datasource, but models and migrations are still expected to be added incrementally after the relational schema is reviewed.

The migration goal is to move toward a cleaner PostgreSQL schema with Prisma while preserving existing backend behavior in small, reviewable steps.