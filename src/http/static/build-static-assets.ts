export async function buildStaticAssets() {
  console.log("Building static assets...");
  try {
    const result = await Bun.build({
      entrypoints: ["src/web/public/index.tsx"],
      outdir: "dist/web",
      naming: "app.sjs",
      minify: true,
      sourcemap: "none",
    });

    if (!result.success) {
      console.error("Build failed", result.logs);
      throw new Error("Build failed");
    }
    console.log("Build successful!");
  } catch (e) {
    console.error("Error building static assets", e);
    throw e;
  }
}

if (import.meta.main) {
  buildStaticAssets();
}
