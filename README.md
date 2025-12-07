
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

### User authentication

A unique ID is generated and persisted (encrypted) on disk using the `electron-store` package. This is sent to the server as a `X-User-ID` header to server as a crude stand-in for an actual authentication mechanism (TBD).

### Streaming

The client receives a real-time stream of updates for the current board/list using Server-Sent Events. This keeps the implementation simpler and avoids possible networking issues over WebSockets.

Updates are sent via POST/PUT, with optimistic UI updates + rollback behaviour; events coming from the stream will override local state, so the server can rewrite IDs or any other properties and they will reflect immediately on the client.

### Testing

You can start multiple instances of the desktop app by running `npm run start` again in a separate terminal.

## Server

The server in `/server` uses the Echo HTTP framework and an SSE module that handles client subscriptions. Data is kept in memory only, restarting the server wipes it out.

To apply modifications you can run the server directly:

```sh
cd server
go run .
```

## Other notes

See [NOTES.md](./NOTES.md)
