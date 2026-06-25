# Vercel UI Deployment

Folder ini adalah frontend statis untuk Vercel. OpenEMR penuh tetap perlu backend PHP, database, dan web server sendiri.

## Deploy dari root repository

1. Import repository ini ke Vercel.
2. Biarkan Root Directory tetap di root repository.
3. Set environment variable:

```text
OPENEMR_BACKEND_URL=https://domain-backend-openemr-anda.com
OPENEMR_APP_NAME=OpenEMR
```

4. Deploy. Vercel akan menjalankan `node vercel-ui/build.mjs` dan publish `vercel-ui/dist`.

## Local check

```shell
node vercel-ui/build.mjs
```

Output akan dibuat di `vercel-ui/dist`.
