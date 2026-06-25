# Deployment Guide

Repo ini punya dua bagian deploy:

1. **Vercel UI**: frontend statis ringan yang ada di `vercel-ui/`.
2. **OpenEMR backend**: aplikasi PHP + MariaDB yang harus berjalan di server/container terpisah.

OpenEMR penuh tidak bisa dijalankan sebagai static site di Vercel karena halaman utamanya dirender oleh PHP dan membutuhkan database.

## 1. Deploy Vercel UI

Import repository ini ke Vercel dan biarkan Root Directory tetap di root repository.

Vercel akan membaca `vercel.json`, menjalankan:

```shell
node vercel-ui/build.mjs
```

lalu mem-publish output:

```text
vercel-ui/dist
```

Set environment variable di Vercel:

```text
OPENEMR_BACKEND_URL=https://domain-backend-openemr-anda.com
OPENEMR_APP_NAME=OpenEMR
```

Deploy ulang setelah environment variable disimpan.

## 2. Deploy Backend OpenEMR

Backend OpenEMR bisa dideploy di server yang mendukung Docker Compose. Repo ini sudah menyediakan contoh production compose di:

```text
docker/production/docker-compose.yml
```

Di server backend:

```shell
docker compose -f docker/production/docker-compose.yml up -d
```

Sebelum production sungguhan, ganti credential default di compose:

```text
MYSQL_ROOT_PASSWORD
MYSQL_USER
MYSQL_PASS
OE_USER
OE_PASS
```

Jangan gunakan credential default `admin/pass`, `root`, atau `openemr/openemr` untuk public deployment.

## 3. Hubungkan Vercel ke Backend

Set `OPENEMR_BACKEND_URL` di Vercel ke domain backend yang sudah online, misalnya:

```text
https://openemr.example.com
```

Setelah itu, Vercel UI akan menampilkan tombol ke:

```text
/
/interface/login/login.php?site=default
/portal/index.php
/swagger/
```

## Checklist Production

- Backend punya HTTPS.
- Credential default sudah diganti.
- Volume database dan site OpenEMR dipersist.
- Backup database disiapkan.
- Domain backend sudah bisa diakses dari browser.
- `OPENEMR_BACKEND_URL` di Vercel memakai domain backend yang benar.
