const {
  app,
  BrowserWindow,
  ipcMain,
  nativeImage,
  globalShortcut,
} = require("electron");
const path = require("path");

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 300,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  // Listen for the close event to gracefully handle quitting the app.
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide(); // Hide the window instead of closing
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  const shortcut = process.platform === "darwin" ? "Command+K" : "Control+K";
  globalShortcut.register(shortcut, () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Quit the app when all windows are closed
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});

ipcMain.on("start-drag", (event, filePaths) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const icon = nativeImage
    .createFromPath(filePaths[0])
    .resize({ width: 50, height: 50 });
  win.webContents.startDrag({ files: filePaths, icon });
});

// Unregister global shortcuts before quitting the app
app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
