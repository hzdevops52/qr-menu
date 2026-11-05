# The Grand Table - QR Digital Menu

A static, mobile-first restaurant digital menu.

## Technology
- HTML
- CSS
- JavaScript
- JSON
- Python QR generator
- Cloudflare Pages

## Run locally

```bash
cd ~/qr-digital-menu
python3 -m http.server 8080
```

Open:
http://localhost:8080

## Update menu

Edit:
`data/menu.json`

Update the restaurant information, categories, food items, prices and images.

## Generate QR code

Install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

After deploying the website:

```bash
python scripts/generate_qr.py https://your-public-domain.com/
```

Generated files:
- qr/restaurant-menu-qr.png
- qr/restaurant-menu-qr.svg

## Deploy

Deploy this directory as a static website using Cloudflare Pages.

No build command is required.
The output directory is the project root.

## Important

The QR code must contain the public HTTPS URL.
A localhost URL is not accessible to restaurant customers.
