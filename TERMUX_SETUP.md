
# Setup Telegram Bot di Termux

Panduan ini akan membantu Anda menginstal dan menjalankan bot Telegram di Termux pada perangkat Android.

## Prasyarat

Pastikan Anda telah menginstal Termux dari F-Droid (disarankan) atau Google Play Store.

## Langkah-langkah Instalasi

1. Buka Termux dan jalankan perintah berikut untuk mengupdate paket:

```bash
pkg update && pkg upgrade -y
```

2. Instal paket yang diperlukan:

```bash
pkg install nodejs python git -y
```

3. Instal Telethon (library Python untuk Telegram):

```bash
pip install telethon
```

4. Clone repositori ini:

```bash
git clone https://github.com/username/telegram-bot.git
cd telegram-bot
```

5. Instal dependensi npm:

```bash
npm install
```

6. Instal ts-node secara global:

```bash
npm install -g ts-node
```

## Menjalankan Bot

1. Edit informasi akun di file `src/utils/termuxRunner.ts`:
   - Ganti `sampleAccount` dengan informasi akun Telegram Anda
   - Tambahkan grup target di `sampleGroups`
   - Sesuaikan pesan di `sampleMessage`

2. Jalankan bot dengan perintah:

```bash
npm start
```

## Jika "Missing script start"

Jika Anda mendapatkan error "missing script start", tambahkan script berikut di package.json:

1. Buka file package.json:

```bash
nano package.json
```

2. Temukan bagian "scripts" dan tambahkan baris "start":

```json
"scripts": {
  "start": "ts-node src/scripts/start.ts",
  ... script lainnya ...
}
```

3. Simpan dengan menekan Ctrl+O, Enter, kemudian Ctrl+X untuk keluar.

4. Jalankan kembali bot:

```bash
npm start
```

## Untuk Sinkronisasi dengan GitHub

Setelah melakukan perubahan, Anda dapat mengirim perubahan kembali ke GitHub:

```bash
git add .
git commit -m "Update untuk support Termux"
git push
```

