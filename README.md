# Pedigree Backend

A part of [pedigree app](https://github.com/Rizki36/pedigree) that handles the backend part

## Prerequisites

- Node.js ^20.19.1
- Bun ^1.2.11
- Docker ^28.1.1

## Installation

- Clone this repository
- Run `cp .env.example .env`
- Create google client id & secret. [see](https://developers.google.com/identity/sign-in/web/sign-in)
- Fill the client id & secret to the .env
- Run `docker compose up`
- Run `bun install`
- Run `bun dev`

> [!IMPORTANT]
> If you change frontend port, you need to adjust GOOGLE_REDIRECT_URI & FRONTEND_URL

## Related links

- https://github.com/Rizki36/pedigree
- https://github.com/Rizki36/pedigree-fe