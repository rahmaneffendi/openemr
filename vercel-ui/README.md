# OpenEMR Vercel UI

Folder ini berisi frontend statis yang aman untuk Vercel. OpenEMR penuh tetap perlu backend PHP, database, dan web server sendiri.

Lihat juga panduan root repo di `DEPLOYMENT.md`.

## Deploy

1. Import repository ini ke Vercel.
2. Biarkan Root Directory tetap di root repository.
3. Set environment variable berikut:

```text
OPENEMR_BACKEND_URL=https://domain-backend-openemr-anda.com
OPENEMR_APP_NAME=OpenEMR
```

4. Deploy. Vercel akan menjalankan `node vercel-ui/build.mjs` lalu publish `vercel-ui/dist`.

## Cek lokal

```shell
node vercel-ui/build.mjs
```

Output dibuat di `vercel-ui/dist` dan tidak perlu di-commit.
