
# Swimlanes ToDo app

Electron desktop app implemented with Svelte. Server written in Golang.

> Requires: Go, Node.js

## How to run

Use `./run.sh` to install dependencies for both client app and server.

- `npm run start`: starts a new dev instance of the Electron desktop app
- `npm run server:start`: starts a server instance
- `npm run start:all`: starts both using the `concurrently` package, used by the run script

## Electron app

```sh
src/
  api         # API layer
  components  # UI components
  pages       # app routes
  stores      # data stores
  styles      # base styles & theming
```

The entry point for the client is the `renderer.ts` file.

### Testing

Run `npm run start` at the project root. You can start multiple instances by running the command in multiple terminals, this will allow testing the synchronization features.

To run the [Playwright](http://playwright.dev) test suite, make sure you have a running server instance, then run:

```sh
npm run test
# or: npx playwright test
```

This will execute a minimal test suite. 

## Server

The server in `/server` uses the Echo HTTP framework and an SSE module that handles client subscriptions. Data is kept in memory only, restarting the server wipes it out.

To apply modifications you can run the server directly:

```sh
cd server
go run .
```

## Other notes

See [NOTES.md](./NOTES.md)
