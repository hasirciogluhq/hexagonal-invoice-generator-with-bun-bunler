import { build } from "esbuild";

await build({
  entryPoints: ["index.ts"],
  outdir: "distz",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  jsx: "automatic", // React 17+ style
  jsxImportSource: "react",
  sourcemap: false,
  minify: true,
  external: ["react", "react-dom"]
});