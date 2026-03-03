// import { watch } from "fs";
// import { EventEmitter } from "events";

// export const buildEvents = new EventEmitter();

// export async function buildStaticAssets() {
//   console.log("Building static assets...");
//   try {
//     const result = await Bun.build({
//       entrypoints: ["src/web/public/index.tsx"],
//       outdir: "dist/web",
//       naming: "app.js",
//       minify: true,
//       sourcemap: "none",
//     });

//     if (!result.success) {
//       console.error("Build failed", result.logs);
//       throw new Error("Build failed");
//     }
//     console.log("Build successful!");
//     buildEvents.emit("built");
//   } catch (e) {
//     console.error("Error building static assets", e);
//     throw e;
//   }
// }

// let isWatching = false;
// export function watchStaticAssets() {
//   if (isWatching) return;
//   isWatching = true;
//   console.log("Watching src/web for changes...");
  
//   let timeout: Timer;
//   watch("src/web", { recursive: true }, (event, filename) => {
//     // Debounce to prevent multiple builds on a single save
//     clearTimeout(timeout);
//     timeout = setTimeout(async () => {
//       console.log(`File changed: ${filename}, rebuilding...`);
//       await buildStaticAssets();
//     }, 100);
//   });
// }

// if (import.meta.main) {
//   buildStaticAssets();
// }
