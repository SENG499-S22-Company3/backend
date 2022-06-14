# backend

## Building and running

```bash
# install dependencies and build
npm install
npm run build

# database
docker-compose up -d

# run with database (cannot start without database)
DATABASE_URL="postgres://admin@admin@localhost/postgresql?sslmode=disable" npm run start
```

## Apollo Studio

In order to have cookies work within Apollo Studio during development, please make sure your Apollo Studio configuration matches the following:

![apollo_config](/docs/apollo_config.png)

Connection settings can be found gear icon near the top left of Apollo Studio.
