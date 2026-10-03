# TodoApp

A full-stack TODO dashboard built with React, Express, and MySQL. It supports creating, editing, completing, searching, filtering, and deleting tasks.

## Project Structure

```text
TodoApp/
├── client/   React frontend
└── server/   Express API and MySQL persistence
```

## Prerequisite

- Node.js and npm
- MySQL Server
## Quick Start

1. Create the database and table by running [`server/config/databasemigration.sql`](server/config/databasemigration.sql) in MySQL Workbench or another MySQL client.
2. Create `server/.env` with your MySQL connection settings:

	```env
	PORT=5000
	DB_HOST=localhost
	DB_USER=your_mysql_user
	DB_PASSWORD=your_mysql_password
	DATABASE=todo_db
	```

3. In a terminal, install and start the backend:

	```bash
	cd server
	npm install
	npm start
	```

4. In a second terminal, install and start the frontend:

	```bash
	cd client
	npm install
	npm start
	```

The frontend runs at [http://localhost:3000](http://localhost:3000), and the API runs at `http://localhost:5000`.

## Documentation

- [Frontend setup, scripts, and limitations](client/README.md)
- [Backend setup, MySQL configuration, and API routes](server/README.md)
