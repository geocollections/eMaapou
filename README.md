# eMaapõu

eMaapõu is a geological data portal for exploring records in the SARV geoscience data management system. It brings together geological collections, research data and localities in Estonian and English.

The portal includes search and detail pages for specimens, samples, analyses, localities, drillcores, stratigraphy, photographs and datasets.

Use **Node.js 22.23.3**, as specified in [.nvmrc](.nvmrc). With nvm installed:

```bash
nvm install
nvm use
```

Without nvm, install the Node.js version specified in `.nvmrc` using your preferred version manager.

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open the address printed in the terminal, usually **http://localhost:3000**. Changes reload automatically.

To use another port:

```bash
npm run dev -- --port 3100
```

Run a specific test:

```bash
npm run test -- --run app/composables/useFilter.test.ts
```

Check a file with ESLint:

```bash
npx eslint app/components/PortalPagination.vue
```

Before submitting changes, run:

```bash
npm run typecheck
npm run test -- --run
npm run build
```
