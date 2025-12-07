import { app, BrowserWindow, safeStorage } from "electron";
import path from "node:path";
import crypto from "node:crypto";
import started from "electron-squirrel-startup";
import Store from "electron-store";
import { themes } from "./styles/theme";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const USER_TOKEN_KEY = "token";
const store = new Store<{ [USER_TOKEN_KEY]: string }>();

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 420,
    titleBarStyle: "hidden",
    show: false,
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // prevents window from appearing before content is loaded
  // if the app grows too large this should be removed
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.setBackgroundColor(themes.default.appBackground);

  // Create a user token when app is first opened.
  // The token is shared with the renderer via a bridge interface.
  //
  // Note: since there is no server verification, you could spam the
  // server with new users at will. This should be replaced with a
  // remote auth API.
  mainWindow.webContents.once("did-finish-load", () => {
    let userToken = store.get(USER_TOKEN_KEY);
    if (!userToken) {
      userToken = safeStorage.encryptString(crypto.randomUUID()).toString("base64");
      store.set(USER_TOKEN_KEY, userToken);
    }
    const initialData = {
      token: safeStorage.decryptString(Buffer.from(userToken, "base64")),
    };
    mainWindow.webContents.send("initial-data", initialData);
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
