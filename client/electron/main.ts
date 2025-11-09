import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
// let studioTray: BrowserWindow | null;
let recordTray: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    minWidth: 1000,
    minHeight: 800,
    width: 1000,
    height: 800,
    hasShadow: false,
    transparent: false,
    frame: true,
    focusable: true,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: "#0a0a0a",
    //   symbolColor: "#fff"
    // hasShadow: true,
    // },
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // studioTray = new BrowserWindow({
  //   width: 70,
  //   height: 300,
  //   resizable: false,
  //   alwaysOnTop: true,
  //   hasShadow: true,
  //   frame: false,
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     devTools: true,
  //     preload: path.join(__dirname, "preload.mjs"),
  //   },
  // });

  recordTray = new BrowserWindow({
    width: 250,
    height: 340,
    resizable: false,
    frame: false,
    hasShadow: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });


  recordTray.setAlwaysOnTop(true, "screen-saver");
  // studioTray.setAlwaysOnTop(true, "screen-saver");
  // Menu.setApplicationMenu(null);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  console.log(import.meta.env.VITE_APP_URL);
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    recordTray.loadURL(`${import.meta.env.VITE_APP_URL}/record_studio.html`);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
