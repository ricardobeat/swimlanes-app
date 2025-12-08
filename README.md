
# Swimlanes ToDo app

Electron desktop app implemented with Svelte. Server written in Golang.

> Requires: Go, Node.js

## How to run

The `./run.sh` script will install dependencies for both client app and server, then start them in parallel.

Other commands:

- `npm run start`: starts a new dev instance of the Electron desktop app
- `npm run server:start`: starts a server instance
- `npm run start:all`: starts both using the `concurrently` package, used by the run script
- `npm run test`: runs the [Playwright](http://playwright.dev) test suite

To test synchronization, you can start extra app instances by running `npm run start` in a separate terminal.

*Note* that the `npm test` command requires a server instance to be running on port 3002. In CI it would have its own dedicated instance.

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

## Server

The server in `/server` uses the Echo HTTP framework and an SSE module that handles client subscriptions. Data is kept in memory only, restarting the server wipes it out.

```sh
# run 
cd server
go run .

# build
go build .
./swimlanes-server
```

## Other notes

See [NOTES.md](./NOTES.md)
