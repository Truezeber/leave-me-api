# Leave Me A Note - API

<div align="left">
  <img src="https://cdn.simpleicons.org/typescript/3178C6" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/mongodb/47A248" height="40" alt="mongodb logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/jest/C21325" height="40" alt="jest logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/express/000000" height="40" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.simpleicons.org/socketdotio/010101" height="40" alt="socketio logo"  />
</div>

---

This repository contains backend of the [Leave Me A Note project](https://github.com/Truezeber/leave-me-a-note-desc).

Leave Me A Note API is a backend of the https://leavemeanote.site/ social app whose main concept is to leave a note on friends profile. Users cannot post on their own profiles. They can add friends, reject their invites, block them, change their credentials or report them to administration.

---

## Features
- e-mail confirmations before registering
- user authentication and remember me functionality
- posting, commenting and liking
- inviting, rejecting, blocking and deleting friends
- changing credentials
- contact staff by writing support tickets
- real-time notifications system
- admin only endpoints

---

## Tech stack
- Node.js
- TypeScript
- Express.js
- MongoDB
- Socket.io
- Jest
- Resend
- Zod
- Swagger

---

## Security
User authentication is done using JWT tokens and stored in cookies. Refresh token is generated using random bytes sequence. Passwords stored in database are hashed. Every inputs from endpoints and cookies are parsed to their desire type to prevent NoSQL incjection.

---

## What can (and will!) be done better?
- [ ] Better refresh tokens managment (deleting them, hashing them before saving in database, rotation)
- [ ] Unified naming convention for variables
- [ ] E2E tests
- [ ] Better DRY implementation (especially by moving `ObjectId` constructions, permission checks, and user fetching to `/utils`)
- [ ] E-mails on login from new IP, ban, unban and ticket responses
- [ ] Better optimalization in [./src/utils/relations.utils.ts](https://github.com/Truezeber/leave-me-api/blob/main/src/utils/relations.utils.ts) (the current code often causes multiple database fetches for the same data)
- [ ] Better swagger documentation (the current one is missing many descriptions, some are written incorrectly, and auth is not configured)
- [ ] The app should be containerized with Docker
- [ ] Redis for caching

---

## Quick start

### Requirements

- Node.js 18+
- MongoDB running locally or in the cloud
- npm
- [Resend.com](https://resend.com/emails) API key with configured domain

### Environment

Create `.env` file in root directory and fill it with the following secrets:
```env
PORT=3000
MONGO_URI=mongodb+srv://XXXXX
JWT_SECRET=secretjwt
RESEND_KEY=re_XXXXXXXXXXXXX
ENVIRONMENT=development
```

### Installation

```bash
git clone https://github.com/Truezeber/leave-me-api.git
cd leave-me-api
npm install
npm run start
```

### Running tests

```bash
npm run test
```

---

## Usage terms

You can do whatever you want with this code. I would appreciate being mentioned in your codebase, though.
However, I strongly prohibit using the *Leave Me A Note* name for any purpose.

That’s all – have fun!
