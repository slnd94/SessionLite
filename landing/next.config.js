module.exports = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  target: "serverless",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_LANDING_URL: process.env.LANDING_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_WEB_URL: process.env.WEB_BASE_URL,
    NEXT_APP_NAME: process.env.APP_NAME,
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY
  },
};
