# SolidJS TypeScript starter template

Template for building performant web apps.

Features included:

- 💬 Translations
- 🎨 Themes
- 🌗 Color schemes

This template is configured with:

- [SolidJS](https://www.solidjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sass](https://sass-lang.com/)
- [pnpm](https://pnpm.io/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)

## Architecture

```
src/
├─ assets/              Static assets
├─ components/          Components
├─ lib/                 Utility library
├─ locales/             Translations
│  ├─ {language}.ts     Dictionary for {language}
│  └─ index.ts          List of languages and their names
├─ pages/               Page components
├─ providers/           Context providers
│  ├─ color-scheme.tsx  Provides color scheme context
│  ├─ locale.tsx        Provides translation support
│  └─ theme.tsx         Provides theming support
├─ themes/              Themes
│  ├─ {theme}/index.ts  Collection of styles for {theme}
│  └─ index.ts          List of themes and their names
├─ App.tsx              Root app component
├─ config.tsx           Configuration provider
├─ index.scss           Root styles
└─ index.tsx            Root script
eslint.config.js        Linter configuration
index.html              Entry point
package.json            Node.js package configuration
pnpm-lock.yaml          pnpm lock file
prettier.config.js      Formatter configuration
tsconfig.json           TypeScript configuration
vite.config.ts          Vite & Vitest configuration
vitest-setup.ts         Vitest setup file
```

## Installation

Install dependencies:

```bash
pnpm install
```

## Usage

Run the app in development mode:

```bash
pnpm run dev
```

Build the app for production to the `dist` folder:

```bash
pnpm run build
```

## License

[AGPL-3.0-only](https://www.gnu.org/licenses/agpl-3.0.html)
