import { build } from "esbuild";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
await mkdir("dist/assets", { recursive: true });
await cp("public", "dist", { recursive: true });
await cp("content/metaphor-schedule.md", "dist/metaphor-schedule.md");
await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "esm",
  target: ["es2022"],
  outfile: "dist/assets/app.js",
  legalComments: "eof",
});
let html = await readFile("dist/index.html", "utf8");
for (const asset of ["assets/app.js", "velvet.css"]) {
  const hash = createHash("sha256")
    .update(await readFile(`dist/${asset}`))
    .digest("hex")
    .slice(0, 12);
  html = html.replace(`"./${asset}"`, `"./${asset}?v=${hash}"`);
}
await writeFile("dist/index.html", html);
console.log("Built static site in dist/");
