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
    "header": "eyJmaWQiOjEzNjg3MDYsInR5cGUiOiJhdXRoIiwia2V5IjoiMHgwMjhGNWRCOEJDRDI2RmQ1NzZiRTJBODMzRTZmNkEyMTM5MDQ4QTcxIn0",
    "payload": "eyJkb21haW4iOiJ3d3cuZXZybGlua2FwcC5jb20ifQ",
    "signature": "OmxCv2MRGV2JmLNk2bl/OScI5DgNJ24bj3CpIxupzXU3YSm/HjnM6smyP92lKLDSiIuraU+rhCxYBJ3XoKSEhBw="
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
