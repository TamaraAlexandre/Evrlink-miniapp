import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { recipientAddress } = await req.json();

    if (!recipientAddress) {
      return NextResponse.json({ error: "Missing recipientAddress" }, { status: 400 });
    }

    const apiKey = process.env.BASE_NOTIFICATIONS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Notifications not configured" }, { status: 500 });
    }

    const res = await fetch("https://dashboard.base.org/api/v1/notifications/send", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_url: "https://evrlinkapp.com",
        wallet_addresses: [recipientAddress],
        title: "You've got a card! 💌",
        message: "Someone just sent you a greeting card on Evrlink. Tap to open it!",
        target_path: "/received",
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
