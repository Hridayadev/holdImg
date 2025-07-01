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
    width: 400,
    height: 400,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "assets", "icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
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

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
