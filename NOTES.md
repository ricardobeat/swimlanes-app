Client
=======================================

## User authentication

A unique ID is generated and persisted (encrypted) on disk using the `electron-store` package. This is sent to the server as a `X-User-ID` header to server as a crude stand-in for an actual authentication mechanism (TBD).

## Streaming

The client receives a real-time stream of updates for the current board/list using Server-Sent Events. This keeps the implementation simpler and avoids possible networking issues over WebSockets.

Updates are sent via POST/PUT, with optimistic UI updates + rollback behaviour; events coming from the stream will override local state, so the server can rewrite IDs or any other properties and they will reflect immediately on the client.

## Electron / ESM

Despite using a [recommended](https://www.electronjs.org/docs/latest/tutorial/boilerplates-and-clis#electron-forge) starter kit from [Electron Forge](https://www.electronforge.io) it's still not very stable. The project is not migrated to ESM (script: module is missing) which creates all kind of issues with build and dependencies.

The main issue I had to set aside due to time, is that the build assets are for some reason missing from the packaged app.

## Drag & Drop

As I didn't want to bring the complexity of a D&D framework, implemented drag and drop with each column as a target. This means items are not sortable, which is a bit of a UX gap. Ideally it would use each existing item as a drop zone, and allow dropping before/after any position in the list.

This also means I'm not storing item positions in the server, each column is implicitly sorted by last update (bottom-up).

Server
=======================================

## Go framework

While initially I wrote this to use a plain `net/http` server, I decided to switch to Echo for better control of HTTP methods and CORS and a simpler SSE implementation.

## Authentication

Proper authentication is missing. The app generates a user ID; we accept requests with a `X-User-ID` header, and use it to set the author for tasks, but it is not validated on the server. To do this properly we need user accounts in the server, and an access-token based API (JWT, refresh tokens, etc).

## CORS

CORS is enabled for all domains for the sole purpose of demonstration. For a production app it should only allow the correct Origin set by Electron.

## Invite codes

Currently the login key is simply the board ID, which is a random UUID. Ideally this would be a randomly generated invite code which we keep track of along each board, and could have an expiry policy or be revoked.

## AI assistance

For the electron app, I did the initial setup and wrote the first version without AI usage, then used Claude Code to implement the skeleton for some of the features, the API wrapper, small changes and tests. Overall ~80% hand-written.

For the server, since Go is incredibly efficient for LLMs to work with, I generated a complete first draft, also using Claude Code, then rewrote it as necessary to fix errors and match my goals. I ended up rewriting a fair bit, as well as manually migrating to `Echo` and `r3labs/sse` as it kept making some mistakes. The go test suite is fully written by AI.
