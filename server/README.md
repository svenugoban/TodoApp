# TODO App - Backend

## Tech Stack
- Node.js
- Express.js
- MySQL (`mysql2` library with promise support)

## Prerequisites
- Node.js and npm
- A running MySQL server

## Database Setup
Run [`config/databasemigration.sql`](config/databasemigration.sql) using your MySQL client or MySQL Workbench. It creates the `todo_db` database and `todos` table.

Create a `server/.env` file with credentials for a MySQL user that can access the database:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DATABASE=todo_db
```

Keep database credentials out of source control. The server loads `.env` from its working directory.

## Install and Run
From the repository root:

```bash
cd server
npm install
npm start
```

For development with automatic restarts, use `npm run dev`. The API listens on `http://localhost:5000` by default; set `PORT` to change it.

## API
- `GET /api/todos` - list TODOs
- `POST /api/todos` - create a TODO
- `PUT /api/todos/:id` - update the supplied title and/or description
- `PATCH /api/todos/:id/done` - toggle completion
- `DELETE /api/todos/:id` - delete a TODO

## Assumptions and Limitations
- MySQL is used instead of MongoDB, which is permitted by the assessment.
- The database and table must be created before starting the API.
- This backend does not include authentication or per-user TODO ownership.