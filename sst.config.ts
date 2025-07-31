/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "spracker",
      removal: "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.StaticSite("SprackerWebsite", {
      build: {
        command: "pnpm build",
        output: "dist",
      },
      domain: "spracker.com",
    });
  },
});
