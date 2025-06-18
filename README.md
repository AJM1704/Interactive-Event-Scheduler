## Overview

- **Google Maps API integration** for displaying event locations.
- **Geolocation + Directions** functionality.
- **Slideshow** with image transitions.
- A **new stock.html page** that fetches real-time stock quotes using the [Alpha Vantage API](https://www.alphavantage.co).

---

## Directory Structure

```
yourx500id-hw3/
│
├── static/
│   ├── css/
│   │   ├── styles.css
│   ├── js/
│   │   ├── map.js
│   │   ├── slideshow.js
│   │   ├── stocks.js
│   ├── img/
│   │   ├── goldy.png
│   │   ├── event1.jpg
│   │   ├── event2.jpg
│   │   └── ... (other images)
│
├── templates/
│   ├── myschedule.html
│   ├── stock.html
│
├── server.py
├── README.md
└── yourx500id_hw3.zip
```

---

## How to Run

1. **Install Python dependencies (if needed):**
   ```bash
   pip install flask
   ```

2. **Run the server:**
   ```bash
   python3 server.py
   ```

3. **Access the site:**
   Open your browser and go to `http://localhost:port/` (check your server log for the correct port).

---

## Features

### Google Maps (myschedule.html)
- Maps loads with center at UMN coordinates.
- Dynamically adds **custom markers** (Goldy image) using event table addresses.
- Each marker displays **info windows** with event name, location, and description.
- Uses Google **Geocoding API** (no hardcoded lat/lng).
- Responsive layout.

### Directions
- Input: Destination address and travel mode (DRIVING, WALKING, TRANSIT).
- Automatically fetches user’s current location.
- Displays directions on the map and in a **scrollable side panel**.

### Slideshow
- Start/Stop buttons under the large image.
- Automatically cycles through event images every 5 seconds with 500ms fade transitions.
- Hovering over event rows still updates image dynamically.

### Stock Quotes (stock.html)
- Input: Ticker symbol.
- Fetches and displays stock data using **Alpha Vantage API**.
- Result is shown in a text area.

---

## API Keys

### Google Maps API

### Alpha Vantage API
- Free key with [limited daily queries (25/day)](https://www.alphavantage.co/support/#api-key).

---

## Notes

- Do **not** hardcode lat/lng anywhere – use Geocoding API.
- Ensure all `.css` and `.js` files are **externally linked**.
- All pages must be **responsive**.
- Navigation bar must link to `stock.html`.
- Ensure server routes for both pages and static files are correctly set.

---
