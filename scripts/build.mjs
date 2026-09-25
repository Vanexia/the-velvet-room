import { build } from "esbuild";
import { cp, mkdir } from "node:fs/promises";
await mkdir("dist/assets", { recursive: true });
await cp("public", "dist", { recursive: true });
await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2022"],
  outfile: "dist/assets/app.js",
  legalComments: "eof",
});
console.log("Built static site in dist/");
