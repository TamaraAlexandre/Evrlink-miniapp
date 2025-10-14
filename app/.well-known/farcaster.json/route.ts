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
    "header": "eyJmaWQiOjEzNjg3MDYsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgzOTNiNTdiODljNjczNDllMGZjMTg0YjdiNTdFNDRlMjhlRjNiMjlDIn0",
    "payload": "eyJkb21haW4iOiJldnJsaW5rYXBwLmNvbSJ9",
    "signature": "MHg4OGYzYTE2YzMwZjYwZDE5NTg2ZGNiNTYxMGFjYjZkMTEyNGFmZGFjMmQ4MjVmMGIzNTE4ZWIzMDhmNDA4MTkwMjk0NmY2ZWFkN2IzNWI1ZDdlY2M4YjFlMjJhYmM4YjYzMjJmYWM0NTg0MTM4ZjZkZjdhOGVkYjE4NWMyN2MzZjAx"
  },
  "baseBuilder": {
    "allowedAddresses": ["0x393b57b89c67349e0fc184b7b57e44e28ef3b29c", "0xCD0D091030D3D4809e7c08a135B5ECae30537104"]
  },
  "miniapp": {
    "version": "1",
    "name": "Evrlink",
    "homeUrl": "https://evrlink-miniapp.vercel.app/",
    "iconUrl": "https://ex.co/i.png",
    "splashImageUrl": "https://ex.co/l.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://evrlink-miniapp.vercel.app/api/webhook",
    "subtitle": "Greeting Cards",
    "description": "New and better greeting cards.",
    "screenshotUrls": [
      "https://ex.co/s1.png",
      "https://ex.co/s2.png",
      "https://ex.co/s3.png"
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
