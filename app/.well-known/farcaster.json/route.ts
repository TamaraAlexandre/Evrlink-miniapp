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
    "signature": "HYwsmLgZBnP21PiXrtwY73XiW0tLO9alRREVXT9CiMgamSiCebpl5gIgjD4bsxnwJnkjekqNvKsBzGkJ1m/fLhw="
  },
  "baseBuilder": {
    "allowedAddresses": ["0xCD0D091030D3D4809e7c08a135B5ECae30537104"]
  },
  "miniapp": {
    "version": "1",
    "name": "Evrlink",
    "homeUrl": "https://evrlinkapp.com/",
    "iconUrl": "https://i.imgur.com/nhm1ph1.png",
    "splashImageUrl": "https://i.imgur.com/nhm1ph1.png",
    "splashBackgroundColor": "#FFFFFF",
    "webhookUrl": "https://evrlinkapp.com/webhook",
    "subtitle": "Greeting Cards",
    "description": "New and better greeting cards.",
    "screenshotUrls": [
      "https://i.imgur.com/nhm1ph1.png",
      "https://i.imgur.com/nhm1ph1.png",
      "https://i.imgur.com/nhm1ph1.png"
    ],
    "primaryCategory": "Consumer",
    "tags": ["Consumer"],
    "heroImageUrl": "https://ex.co/og.png",
    "tagline": "Create a Meep",
    "ogTitle": "Example Mini App",
    "ogDescription": "Easy to manage portfolio.",
    "ogImageUrl": "https://ex.co/og.png",
    "noindex": true
  }
  });
}
