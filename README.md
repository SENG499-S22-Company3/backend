# backend

## Getting Started

1. Install a Node.js 14 or higher (16 is recommended)
2. Install dependencies with `npm ci`
3. Run `npm run setup`. It will:
   - Start Postgres using Docker
   - Create a database called `postgres`
   - Create a user called `postgres` with password `postgres`
   - Setup Husky pre-commit hooks (`npm run husky`)
   - Create Prisma client from Prisma (`npm run db:generate`)
   - Run migrations (`npx prisma migrate deploy`)
   - Seed the database (`npm run db:seed`)
   - **It will likely fail the first few times as the database isn't ready yet**
4. Run `npm start` to start the backend. By default it will run on port 4000. This can be changed by passing in a port as environment variable.
   - Navigate to http://localhost:4000/graphql to test the backend using Apollo Studio. See the [README](#apollo-studio) for more information about Apollo Studio configuration.

### Development Credentials

In the file [seed script](./prisma/seed.ts) you can find the credentials for the development database.

```
// user
username: testuser
password: testpassword

// admin user
username: testadmin
password: testpassword
```

## Development

Make sure you run `npm ci` and `npm run setup` frequently. If you switch branches and dependencies change you must run `npm ci` to make sure your dependencies are up to date. `npm run setup` will update the Prisma files and setup Husky. Make sure you run these frequently as well to make sure you're running on the latest changes.

## Hosting

## Apollo Studio

**IMPORTANT**

In order to have cookies work within Apollo Studio during development, please make sure your Apollo Studio configuration matches the following:

![apollo_config](/docs/apollo_config.png)

Connection settings can be found gear icon near the top left of Apollo Studio.
