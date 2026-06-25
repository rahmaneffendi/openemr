# OpenEMR Vercel UI

Folder ini berisi frontend statis yang aman untuk Vercel. Tampilannya adalah modern redesign dari flow OpenEMR: login, dashboard, calendar, patient chart, encounter, documents, billing, reports, admin, dan message center dengan data dummy tanpa backend.

Lihat juga panduan root repo di `DEPLOYMENT.md`.

## Deploy

1. Import repository ini ke Vercel.
2. Biarkan Root Directory tetap di root repository.
3. Environment variable tidak wajib untuk mode prototype. Opsional:

```text
OPENEMR_APP_NAME=OpenEMR
```

4. Deploy. Vercel akan menjalankan `node vercel-ui/build.mjs` lalu publish `vercel-ui/dist`.

## Cek lokal

```shell
node vercel-ui/build.mjs
```

Output dibuat di `vercel-ui/dist` dan tidak perlu di-commit.
