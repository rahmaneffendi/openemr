# Deployment Guide

Repo ini punya dua mode deploy:

1. **Vercel UI prototype**: frontend statis yang ada di `vercel-ui/`. Mode ini bisa diklik dan dieksplor tanpa backend.
2. **OpenEMR backend production**: aplikasi PHP + MariaDB yang harus berjalan di server/container terpisah jika ingin fitur klinis nyata.

OpenEMR penuh tidak bisa dijalankan sebagai static site di Vercel karena halaman utamanya dirender oleh PHP dan membutuhkan database. Karena itu Vercel build di repo ini adalah prototype frontend-only dengan data dummy.

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

Environment variable tidak wajib untuk prototype. Opsional:

```text
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

## 3. Hubungkan ke Backend Nyata

Jika nanti prototype mau diubah menjadi frontend yang bicara ke backend nyata, backend OpenEMR perlu online dulu. Domain backend contohnya:

```text
https://openemr.example.com
```

Saat ini Vercel UI tidak memanggil backend; semua flow memakai state dan data dummy di browser.

## Checklist Production

- Backend punya HTTPS.
- Credential default sudah diganti.
- Volume database dan site OpenEMR dipersist.
- Backup database disiapkan.
- Domain backend sudah bisa diakses dari browser jika mode production dipakai.
