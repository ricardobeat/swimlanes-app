Swimlanes is an Electron app to manage todo lists.

## Tech

- Electron + electron-forge
- npm
- vite
- Svelte 5 for UI
- remote HTTP API

## Styles

- Custom layout framework in `styles/layout.css` inspired by SwiftUI stack views.
- Global styles are in `styles/*` and loaded via `app.css`
- Variables and theming are defined in `styles/theme.css` and always preferred over inline sizing and color values
- Local styles are scoped to Svelte components and kept to a minimum
