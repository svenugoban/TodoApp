# TODO App - Frontend

## Overview

The React client provides a responsive TODO dashboard for creating, editing, searching, filtering, completing, and deleting tasks. It communicates with the Express API over HTTP.

## Prerequisites

- Node.js and npm
- The backend running at `http://localhost:5000`
- MySQL configured and running for the backend

## Install and Run

From the repository root:

```bash
cd client
npm install
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000). Start the backend in a separate terminal by following [the server setup guide](../server/README.md).

The API client currently uses `http://localhost:5000/api/todos`. If the backend uses another host or port, update `API_BASE_URL` in `src/api/todoApi.js`.

## Available Scripts

- `npm start` - start the development server
- `npm test -- --watchAll=false` - run the client tests once
- `npm run build` - create a production build

## Assumptions and Limitations

- Tasks are shared through one backend and are not scoped to a user.
- The API URL is configured in source code rather than through an environment variable.
- Authentication and account management are not included.
