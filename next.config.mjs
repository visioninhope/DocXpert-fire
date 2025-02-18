// @ts-expect-error
import { withGlobalCss } from "next-global-css";

await import("./src/env.mjs");

const withConfig = withGlobalCss();

const config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

export default withConfig(config);
