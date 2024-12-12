# Inventory Dashboard

This project is a dashboard that displays the inventory of a store. It is a simple project that uses a Postgres as a database (Prisma ORM). The dashboard is built using NextJS.

## Setup

1. Clone the repository
2. Run `npm install`
3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/database
    ```

4. Run `npx prisma migrate dev`

## Self Hosting

### Production

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Run `npm run start`

### Development

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
