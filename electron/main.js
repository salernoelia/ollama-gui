const { app, BrowserWindow } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const waitOn = require("wait-on");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 1050,
    title: "Ollama",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadURL("http://localhost:3000");

  // Uncomment to open DevTools
  // win.webContents.openDevTools();
}

app.on("ready", () => {
  // Determine the path to the server script
  const serverPath = path.join(app.getAppPath(), ".output/server/index.mjs");
  console.log("Server path:", serverPath); // Log the server path for debugging

  // Start Nuxt server
  const nuxtServer = exec(`node ${serverPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });

  nuxtServer.on("close", (code) => {
    console.log(`Nuxt server process exited with code ${code}`);
  });

  // Wait for the Nuxt server to be ready and then create the window
  waitOn({ resources: ["http://localhost:3000"], timeout: 30000 }, (err) => {
    if (err) {
      console.error("Nuxt server did not start in time");
      nuxtServer.kill();
      app.quit();
    } else {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
