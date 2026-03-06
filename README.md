# Tic Tac Toe

A lightweight Tic-Tac-Toe web app built with Vite and vanilla JavaScript.

Features include a title screen, configurable local or computer opponents, difficulty levels,
persistent lifetime stats, a round-end replay flow, and lightweight sound effects.

## Scripts

- `pnpm dev` starts the development server
- `pnpm build` creates a production build
- `pnpm preview` previews the production build
- `pnpm test` runs the core game tests

## Deployment

GitHub Pages deployment is configured through [main.yml](C:\Users\joshs\Projects\tictactoe\.github\workflows\main.yml).

To publish from GitHub:

1. Open the repository settings on GitHub.
2. Under Pages, set the source to `GitHub Actions`.
3. Push to `main` and the workflow will build and deploy `dist/`.
