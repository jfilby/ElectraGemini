# Install

## Infrastructure setup

1. Install PostgreSQL.
2. Install PgBouncer.
3. Create a database and role name named electra.
4. Install Node.js.
5. Install Nginx and configure domain and subdomains.


## Code setup (Production)

1. Source the code.
2. Setup the Next.js server project:
   Go to the relevant source directory.
   Edit ./scripts/production to set the database connection string.
   Source ./scripts/production.sh
   Run `npm install` for both the client and server projects.
   Run `npx prisma db push` on the server
   Run `npx next build` to build.
3. Setup the Next.js client project:
   Go to the relevant source directory.
   Edit ./scripts/production to set the database connection string.
   Source ./scripts/production.sh
   Run `npm install` for both the client and server projects.
   Run `npx prisma generate` on the server
   Run `npx next build` to build.


## Manual DDL

Run manual DDL scripts under docs/sql/ddl.


## Web app setup

1. Visit the landing page and click Sign in on the top right.
2. Sign-in with email.
3. Locate the user_profile table's record for the signed-in user, typically by
   looking up the email address in the User table (see user_id on
   user_profile).
4. Set the relevant user_profile record's isAdmin field to true.
5. Go to /admin/setup and click Setup.
6. Start the process watch/start script.


## Hardhat (for dev only)

Ref: https://docs.web3js.org/guides/hardhat_tutorial/

Install Hardhat:
1. Go to the server nextjs path.
2. Run:
```bash
mkdir hardhat
npx hardhat init
# Select Typescript project
# Type in the directory of `the server path`/hardhat
```

Run Hardhat:
```bash
cd hardhat
npx hardhat node
```

Update .env.development with the network URL.

