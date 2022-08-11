const path = require("path");
const { i18n } = require("./next-i18next.config");
const withTM = require('next-transpile-modules')(['@fvilers/disable-react-devtools']);

module.exports = withTM({
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    NEXT_PUBLIC_LANDING_URL: process.env.LANDING_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_WEB_URL: process.env.WEB_BASE_URL,
    NEXT_APP_NAME: process.env.APP_NAME,
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    NEXT_FILESTACK_API_KEY: process.env.FILESTACK_API_KEY,
    NEXT_PADDLE_ENV: process.env.PADDLE_ENV,
    NEXT_PADDLE_VENDOR_ID: process.env.PADDLE_VENDOR_ID,
    NEXT_PADDLE_API_BASE_URL: process.env.PADDLE_API_BASE_URL
  },
  i18n,
});
