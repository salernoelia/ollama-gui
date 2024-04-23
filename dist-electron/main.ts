"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const e = require("electron"),
  n = require("node:path");
process.env.APP_ROOT = n.join(__dirname, "..");
const i = n.join(process.env.APP_ROOT, "dist-electron"),
  s = n.join(process.env.APP_ROOT, ".output/public");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? n.join(process.env.APP_ROOT, "public")
  : s;
let o;
function t() {
  (o = new e.BrowserWindow({
    webPreferences: { preload: n.join(i, "preload.js") },
  })),
    process.env.VITE_DEV_SERVER_URL
      ? (o.loadURL(process.env.VITE_DEV_SERVER_URL),
        o.webContents.openDevTools())
      : o.loadFile(n.join(process.env.VITE_PUBLIC, "index.html"));
}
function r() {
  e.ipcMain.handle("app-start-time", () => new Date().toLocaleString());
}
e.app.on("window-all-closed", () => {
  process.platform !== "darwin" && (e.app.quit(), (o = null));
});
e.app.on("activate", () => {
  e.BrowserWindow.getAllWindows().length === 0 && t();
});
e.app.whenReady().then(() => {
  r(), t();
});
exports.MAIN_DIST = i;
exports.RENDERER_DIST = s;