# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

---

## Gacha (Undian) API Endpoints

Aplikasi undian dengan sistem gacha. Semua endpoint menggunakan prefix `/api/gacha`.

### 1. Draw Gacha (Tarik Gacha)

Endpoint utama untuk melakukan gacha.

- **URL:** `POST /api/gacha/draw`
- **Content-Type:** `application/json`
- **Request Body:**

| Parameter | Tipe   | Wajib | Keterangan           |
| --------- | ------ | ----- | -------------------- |
| `userId`  | String | Ya    | ID atau nama user    |

- **Response Sukses (200):**

```json
{
  "success": true,
  "message": "Selamat! Anda memenangkan: Smartphone X",
  "prize": "Smartphone X",
  "attemptId": "664abc..."
}
```

- **Response Tidak Menang (200):**

```json
{
  "success": true,
  "message": "Maaf, Anda tidak memenangkan hadiah kali ini. Coba lagi!",
  "prize": null,
  "attemptId": "664abc..."
}
```

- **Response Error - Batas Harian Tercapai (403):**

```json
{
  "statusCode": 403,
  "error": "FORBIDDEN_ERROR",
  "description": "Access forbidden",
  "message": "Anda sudah mencapai batas maksimal 5 kali gacha hari ini."
}
```

**Aturan:**
- Setiap user hanya bisa melakukan gacha **maksimal 5 kali dalam 1 hari**.
- Kuota hadiah bersifat **per periode undian** (bukan per hari).

### 2. Gacha History (Riwayat Gacha) — Bonus 1

Menampilkan riwayat gacha yang sudah dilakukan oleh user beserta hadiah yang dimenangkan.

- **URL:** `GET /api/gacha/history?userId={userId}`
- **Query Parameter:**

| Parameter | Tipe   | Wajib | Keterangan           |
| --------- | ------ | ----- | -------------------- |
| `userId`  | String | Ya    | ID atau nama user    |

- **Response Sukses (200):**

```json
{
  "userId": "John Doe",
  "totalAttempts": 3,
  "history": [
    {
      "attemptId": "664abc...",
      "prize": "Voucher Rp100.000",
      "createdAt": "2025-05-20T10:30:00.000Z"
    },
    {
      "attemptId": "664abd...",
      "prize": null,
      "createdAt": "2025-05-20T10:25:00.000Z"
    }
  ]
}
```

### 3. Prize List (Daftar Hadiah & Kuota) — Bonus 2

Menampilkan daftar hadiah beserta kuota pemenang yang tersisa.

- **URL:** `GET /api/gacha/prizes`
- **Response Sukses (200):**

```json
{
  "prizes": [
    {
      "name": "Emas 10 gram",
      "maxWinners": 1,
      "currentWinners": 0,
      "remainingQuota": 1
    },
    {
      "name": "Smartphone X",
      "maxWinners": 5,
      "currentWinners": 2,
      "remainingQuota": 3
    }
  ]
}
```

### 4. Winners List (Daftar Pemenang) — Bonus 3

Menampilkan daftar user yang memenangkan hadiah. Nama user **disamarkan secara acak**.

- **URL:** `GET /api/gacha/winners`
- **Response Sukses (200):**

```json
{
  "winners": {
    "Smartphone X": [
      {
        "userId": "J*h* **e",
        "wonAt": "2025-05-20T10:30:00.000Z"
      }
    ],
    "Voucher Rp100.000": [
      {
        "userId": "*an* D*e",
        "wonAt": "2025-05-20T09:15:00.000Z"
      }
    ]
  }
}
```

### Daftar Hadiah dan Kuota Pemenang

| No | Hadiah             | Kuota Pemenang |
| -- | ------------------ | -------------- |
| 1  | Emas 10 gram       | 1              |
| 2  | Smartphone X       | 5              |
| 3  | Smartwatch Y       | 10             |
| 4  | Voucher Rp100.000  | 100            |
| 5  | Pulsa Rp50.000     | 500            |

> **Catatan:** Kuota hadiah di atas bukan kuota per hari, melainkan kuota dalam 1 periode undian.
