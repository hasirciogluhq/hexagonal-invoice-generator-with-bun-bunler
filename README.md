# Hexagonal Invoice Generator (Bun + Elysia)

## Mimari

- `src/core`: domain/usecase/ports/adapters
- `src/http`: Elysia HTTP layer
- `static`: client entry (`app.tsx`) + build edilmiş static assetler

## Tailwind + PostCSS

Tailwind CDN kullanılmaz.

- `postcss.config.mjs`
- `static/globals.input.css` -> `static/globals.css`

Build komutu:

```bash
bun run build:static
```

## Çalıştırma

```bash
bun run start
```

Port override:

```bash
PORT=3107 bun run start
```

## Endpointler

- `GET /health`
- `GET /api/invoice` -> invoice JSON
- `GET /` -> HTML shell (client app yüklenir)
- `GET /static/*` -> publish edilen static dosyalar

`static/app.tsx`, sayfa yüklenince `/api/invoice` çağırır, loading bar gösterir ve gelen veriyi render eder.

## Static Build Davranışı

- `NODE_ENV=development`: `/` ve `/static/*` requestlerinde static assetler her request öncesi tekrar build edilir.
- Production (development değil): build yapılmaz; `static/app.js` veya `static/globals.css` yoksa server 500 döner.
