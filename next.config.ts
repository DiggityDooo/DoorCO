import type { NextConfig } from "next";

const config: NextConfig = {
  eslint: {
    // This repository also contains a retired Vite surface under src/. Keep the
    // Next production gate focused on the application it actually builds.
    dirs: ["app", "components", "data", "lib", "tests"],
  },
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
};

export default config;
