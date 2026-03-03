import { buildStaticAssets } from "../src/http/static/build-static-assets";

await buildStaticAssets();
console.log("Built static assets: static/globals.css, static/app.js");
