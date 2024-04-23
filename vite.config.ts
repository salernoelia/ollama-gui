import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { builtinModules } from "node:module";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: {
        index: "src/index.ts",
      },
      formats: ["cjs", "es"],
      fileName: (format) => (format === "es" ? "[name].mjs" : "[name].cjs"),
    },
    rollupOptions: {
      external: [
        "@nuxt/kit",
        "electron",
        "vite",
        "vite-plugin-electron",
        "vite-plugin-electron-renderer",
        ...builtinModules,
        ...builtinModules.map((m) => `node:${m}`),
      ],
      output: {
        exports: "named",
      },
    },
  },
  plugins: [
    {
      name: "generate-types",
      async closeBundle() {
        removeTypes();
        await generateTypes();
        moveTypesToDist();
        removeTypes();
      },
    },
  ],
});

function removeTypes() {
  fs.rmSync(path.join(__dirname, "types"), { recursive: true, force: true });
}

function generateTypes() {
  return new Promise((resolve) => {
    const cp = spawn(
      process.platform === "win32" ? "npm.cmd" : "npm",
      ["run", "types"],
      { stdio: "inherit" }
    );
    cp.on("exit", (code) => {
      !code && console.log("[types]", "declaration generated");
      resolve(code);
    });
    cp.on("error", process.exit);
  });
}

function moveTypesToDist() {
  const types = path.join(__dirname, "types");
  const dist = path.join(__dirname, "dist");
  const files = fs.readdirSync(types).filter((n) => n.endsWith(".d.ts"));
  for (const file of files) {
    fs.copyFileSync(path.join(types, file), path.join(dist, file));
    console.log("[types]", `types/${file} -> dist/${file}`);
  }
}
