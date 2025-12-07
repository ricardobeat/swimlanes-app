## Electron / ESM

I used a recommended starter kit from the Electron docs that includes electron-forge. This may have been a bit overkill, and let to some tooling issues as it's not fully migrated to ESM (which I understand is possible in the latest electron versions). The `script: "module"` field is not present in the root `package.json`.

## Drag & Drop

As I didn't want to bring the complexity of a D&D framework, implemented drag and drop with each column as a target. This means items are not sortable, which is a bit of a UX gap. Ideally it would use each existing item as a drop zone, and allow dropping before/after any position in the list.

This also means I'm not storing item positions in the server, each column is implicitly sorted by last update (bottom-up).

## Go framework

While initially I wrote this to use a plain `net/http` server, I decided to switch to Echo for better control of HTTP methods and CORS and a simpler SSE implementation.

## Authentication

Proper authentication is missing. The app generates a user ID; we accept requests with a `X-User-ID` header, and use it to set the author for tasks, but it is not validated on the server. To do this properly we need user accounts in the server, and an access-token based API (JWT, refresh tokens, etc).

## CORS

CORS is enabled for all domains for the sole purpose of demonstration. For a production app it should only allow the correct Origin set by Electron.

## Invite codes

Currently the login key is simply the board ID, which is a random UUID. Ideally this would be a randomly generated invite code which we keep track of along each board, and could have an expiry policy or be revoked.
