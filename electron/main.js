const { app, BrowserWindow } = require("electron");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1400,
    height: 1050,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the index.html of the app.
  // Update the path below to where your Nuxt output is served
  win.loadURL("http://localhost:3000"); // Adjust port if your app is served differently

  // Open the DevTools.
  // win.webContents.openDevTools();
}
app.on("ready", createWindow);

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
