#!/usr/bin/env python3

import argparse
from pathlib import Path
import qrcode
from qrcode.image.svg import SvgPathImage

PROJECT_DIR = Path(__file__).resolve().parent.parent
QR_DIR = PROJECT_DIR / "qr"

parser = argparse.ArgumentParser(
    description="Generate a QR code for the restaurant digital menu."
)

parser.add_argument(
    "url",
    help="Public website URL, for example https://yourdomain.com/"
)

args = parser.parse_args()

url = args.url.strip()

if not url.startswith(("https://", "http://")):
    parser.error("Please provide a valid HTTP or HTTPS URL.")

QR_DIR.mkdir(parents=True, exist_ok=True)

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=4
)

qr.add_data(url)
qr.make(fit=True)

png = qr.make_image(
    fill_color="black",
    back_color="white"
)

png_path = QR_DIR / "restaurant-menu-qr.png"
png.save(png_path)

svg = qrcode.make(url, image_factory=SvgPathImage)
svg_path = QR_DIR / "restaurant-menu-qr.svg"
svg.save(svg_path)

print("\nQR codes generated successfully!")
print(f"PNG: {png_path}")
print(f"SVG: {svg_path}")
print(f"URL: {url}")
