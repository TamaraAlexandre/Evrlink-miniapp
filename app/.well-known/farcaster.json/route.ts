function withValidProperties(
  properties: Record<string, undefined | string | string[] | boolean>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== undefined
    )
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string | undefined;

  const accountHeader = process.env.FARCASTER_ACCOUNT_HEADER;
  const accountPayload = process.env.FARCASTER_ACCOUNT_PAYLOAD;
  const accountSignature = process.env.FARCASTER_ACCOUNT_SIGNATURE;

  const miniappVersion = process.env.FARCASTER_MINIAPP_VERSION;
  const miniappName = process.env.FARCASTER_MINIAPP_NAME;
  const miniappHomeUrl = process.env.FARCASTER_MINIAPP_HOME_URL ?? URL;
  const miniappIconUrl = process.env.FARCASTER_MINIAPP_ICON_URL;
  const miniappSplashImageUrl = process.env.FARCASTER_MINIAPP_SPLASH_IMAGE_URL;
  const miniappSplashBackgroundColor =
    process.env.FARCASTER_MINIAPP_SPLASH_BACKGROUND_COLOR;
  const miniappWebhookUrl = process.env.FARCASTER_MINIAPP_WEBHOOK_URL;
  const miniappSubtitle = process.env.FARCASTER_MINIAPP_SUBTITLE;
  const miniappDescription = process.env.FARCASTER_MINIAPP_DESCRIPTION;
  const miniappScreenshotUrls = (
    process.env.FARCASTER_MINIAPP_SCREENSHOT_URLS ?? ""
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const miniappPrimaryCategory = process.env.FARCASTER_MINIAPP_PRIMARY_CATEGORY;
  const miniappTags = (process.env.FARCASTER_MINIAPP_TAGS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const miniappHeroImageUrl = process.env.FARCASTER_MINIAPP_HERO_IMAGE_URL;
  const miniappTagline = process.env.FARCASTER_MINIAPP_TAGLINE;
  const miniappOgTitle = process.env.FARCASTER_MINIAPP_OG_TITLE;
  const miniappOgDescription = process.env.FARCASTER_MINIAPP_OG_DESCRIPTION;
  const miniappOgImageUrl = process.env.FARCASTER_MINIAPP_OG_IMAGE_URL;
  const miniappNoIndex =
    process.env.FARCASTER_MINIAPP_NOINDEX === "true" ? true : undefined;

  const manifest = {
    accountAssociation: {
      header: accountHeader,
      payload: accountPayload,
      signature: accountSignature,
    },
    miniapp: withValidProperties({
      version: miniappVersion,
      name: miniappName,
      homeUrl: miniappHomeUrl,
      iconUrl: miniappIconUrl,
      splashImageUrl: miniappSplashImageUrl,
      splashBackgroundColor: miniappSplashBackgroundColor,
      webhookUrl: miniappWebhookUrl,
      subtitle: miniappSubtitle,
      description: miniappDescription,
      screenshotUrls: miniappScreenshotUrls,
      primaryCategory: miniappPrimaryCategory,
      tags: miniappTags,
      heroImageUrl: miniappHeroImageUrl,
      tagline: miniappTagline,
      ogTitle: miniappOgTitle,
      ogDescription: miniappOgDescription,
      ogImageUrl: miniappOgImageUrl,
      noindex: miniappNoIndex,
    }),
  };

  return Response.json(manifest);
}

