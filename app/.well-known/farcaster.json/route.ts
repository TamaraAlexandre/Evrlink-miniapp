function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL;

  return Response.json({
  "accountAssociation": {
    "header": "eyJmaWQiOjEzNjg3MDYsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhiNzAyNjEwMWEzNjIyNmY2RTE0MzU5ZTRDNEI2YjRCMWQ0YzBkNEZEIn0",
    "payload": "eyJkb21haW4iOiJ3d3cuZXZybGlua2FwcC5jb20ifQ",
    "signature": "MHgxZDhjMmM5OGI4MTkwNjczZjZkNGY4OTdhZWRjMThlZjc1ZTI1YjRiNGIzYmQ2YTU0NTExMTU1ZDNmNDI4OGM4MWE5OTI4ODI3OWJhNjVlNjAyMjA4YzNlMWJiMzE5ZjAyNjc5MjM3YTRhOGRiY2FiMDFjYzY5MDlkNjZmZGYyZTFj"
  },
  "baseBuilder": {
    "allowedAddresses": ["0xCD0D091030D3D4809e7c08a135B5ECae30537104"]
  },
  "miniapp": {
    "name": "Evrlink",
    "version": "1",
    "iconUrl": "https://www.evrlinkapp.com/icon.png",
    "homeUrl": "https://www.evrlinkapp.com",
    "imageUrl": "https://www.evrlinkapp.com/image.png",
    "splashImageUrl": "https://i.imgur.com/nhm1ph1.png",
    "splashBackgroundColor": "#FFFFFF",
    "webhookUrl": "https://www.evrlinkapp.com/api/webhook",
    "description": "Greeting Cards ",
    "subtitle": "Instant greeting cards",
    "primaryCategory": "social",
    "screenshotUrls": [
      "https://i.imgur.com/nhm1ph1.png"
    ],
    "heroImageUrl": "https://i.imgur.com/nhm1ph1.png",
    "tags": [
      "social",
      "cards"
    ],
    "tagline": "Instant Greeting Cards",
    "noindex": true
  }
  });
}
