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
    "header": "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
    "payload": "eyJkb21haW4iOiJhcHAuZXhhbXBsZS5jb20ifQ",
    "signature": "MHgxMGQwZGU4ZGYwZDUwZTdmMGIxN2YxMTU2NDI1MjRmZTY0MTUyZGU4ZGU1MWU0MThiYjU4ZjVmZmQxYjRjNDBiNGVlZTRhNDcwNmVmNjhlMzQ0ZGQ5MDBkYmQyMmNlMmVlZGY5ZGQ0N2JlNWRmNzMwYzUxNjE4OWVjZDJjY2Y0MDFj"
  },
  "baseBuilder": {
    "allowedAddresses": ["0x400384b6CA843519223eFE99c8899d363782f80c"]
  },
  "miniapp": {
    "version": "1",
    "name": "Crypto Portfolio Tracker",
    "homeUrl": "https://ex.co",
    "iconUrl": "https://ex.co/i.png",
    "splashImageUrl": "https://ex.co/l.png",
    "splashBackgroundColor": "#000000",
    "webhookUrl": "https://ex.co/api/webhook",
    "subtitle": "Easy to manage",
    "description": "Track and manage your cryptocurrency portfolio.",
    "screenshotUrls": [
      "https://ex.co/s1.png",
      "https://ex.co/s2.png",
      "https://ex.co/s3.png"
    ],
    "primaryCategory": "finance",
    "tags": ["finance"],
    "heroImageUrl": "https://ex.co/og.png",
    "tagline": "Save instantly",
    "ogTitle": "Example Mini App",
    "ogDescription": "Easy to manage portfolio.",
    "ogImageUrl": "https://ex.co/og.png",
    "noindex": true
  }
  });
}
