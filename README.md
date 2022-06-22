# backend

## Development
Make sure you run `npm ci` and `npm run setup` frequently. If you switch branches and dependencies change you must run `npm ci` to make sure your dependencies are up to date. `npm run setup` will update the Prisma files and setup Husky. Make sure you run these frequently as well to make sure you're running on the latest changes. 

## Apollo Studio

In order to have cookies work within Apollo Studio during development, please make sure your Apollo Studio configuration matches the following:

![apollo_config](/docs/apollo_config.png)

Connection settings can be found gear icon near the top left of Apollo Studio.
