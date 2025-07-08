# Auth SDK

This repository provides a small authentication SDK built with Node.js, Express and JWT. It can be used as a starting point for adding authentication to your applications.

## Features

- Register and login endpoints using Express router
- Passwords hashed with bcrypt
- JWT token generation and verification
- Middleware to protect routes

## Usage

Install dependencies:

```bash
npm install
```

Start the example server:

```bash
npm start
```

The server exposes the following endpoints:

- `POST /auth/register` – create a new user
- `POST /auth/login` – login and receive a JWT token
- `GET /profile` – example protected route (requires `Authorization: Bearer <token>` header)

You can import the SDK and mount the router in your own Express app:

```javascript
const express = require('express');
const AuthSDK = require('path/to/src/index');

const app = express();
const auth = new AuthSDK();

app.use(express.json());
app.use('/auth', auth.router());
```

Then use `auth.authenticate` as middleware for protected routes.

## Frontend client

This repository also includes a small React client under the `client` folder.
Start the server and open `client/index.html` in your browser to try it out.
