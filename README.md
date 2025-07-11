# 📚 Webtoon Scraper – Fullstack Episode Downloader

This is a fullstack web scraping tool built to fetch and download episode images from [webtoons.com](https://www.webtoons.com). It includes a modern, clean frontend and an Express + Cheerio backend. Users can enter a Webtoon series URL, view all episodes, and download them directly with a click.

> ✅ Version: **v1.0.0**
> 🔐 Current status: Basic scraping and episode downloading is fully functional. Webtoon and episode cover images are disabled for now due to access restrictions.

---

## 🔧 Tech Stack

| Layer       | Stack                               |
| ----------- | ----------------------------------- |
| Frontend    | HTML, CSS, JavaScript (Vanilla)     |
| Backend     | Node.js, Express.js, Axios, Cheerio |
| File System | Node `fs` and `path` modules        |

---

## 🚀 Features

* 🔍 Scrape all episodes of a Webtoon series across multiple pages
* 📄 Display episodes with clean episode cards in the frontend
* 📥 Download individual episodes to local disk (`F:/webtoons/{webtoon}/{episode}`)
* 🧠 Automatic handling of pagination, episode numbering, and delays to prevent blocking
* 🛠️ Neatly separated routes, controller, and service logic

---

## 📁 Folder Structure

```
.
├── backend/
│   ├── controllers/
│   │   ├── download.controller.js
│   │   └── scrape.controller.js
│   ├── routes/
│   │   └── scraper.routes.js
│   ├── services/
│   │   └── downloader.service.js
│   ├── server.js
│   └── app.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
└── README.md
```

---

## 📦 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

> Your backend should now be running at `http://localhost:3000`

### 2. Frontend

Just open the `public/index.html` file in a browser. It will connect to the backend automatically.

> Make sure backend is running first for fetch/download actions to work.

---

## 🛠️ API Routes

### `GET /api/scrape?url=WEBTOON_LIST_URL`

Scrapes metadata and all episodes from the given Webtoon URL.

#### Response

```json
{
  "title": "Webtoon Name",
  "episodes": [
    {
      "number": 1,
      "title": "Episode 1",
      "url": "https://webtoons.com/..."
    },
    ...
  ]
}
```

---

### `POST /api/download`

Downloads images from one or more episodes.

#### Request body

```json
{
  "title": "Webtoon Name",
  "episodes": [
    {
      "number": 1,
      "title": "Episode 1",
      "url": "https://webtoons.com/..."
    }
  ]
}
```

> Downloads are saved to: `F:/webtoons/{title}/{episode}`

---

## ⚠️ Notes

* Webtoon image servers may block direct access to images. Currently, cover images are disabled.
* `User-Agent`, `Referer`, and other headers are spoofed to bypass light scraping protection.
* A 1.5 second delay between page scrapes is used to prevent rate limiting (HTTP 429 errors).

---

## 🧠 Future Plans

* ✅ Add a "Download All" button
* ❌ Show cover images (requires advanced image proxy handling)
* 🔒 Optionally support login to access restricted series
* 💡 CLI tool version

---

## 🙌 Credits

* Scraping logic powered by **Cheerio** and **Axios**
* Design and frontend built by **Louis**
* Inspired by a real-world need to backup and browse webtoons offline
  ---
