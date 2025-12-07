import { app, BrowserWindow, safeStorage, protocol, net } from "electron";
import path from "node:path";
import crypto from "node:crypto";
import started from "electron-squirrel-startup";
import Store from "electron-store";
import { themes } from "./styles/theme";
import { pathToFileURL } from "node:url";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const customScheme = "swimapp";

protocol.registerSchemesAsPrivileged([
  {
    scheme: customScheme,
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
    },
  },
]);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const USER_TOKEN_KEY = "token";
const store = new Store<{ [USER_TOKEN_KEY]: string }>();

type InitialData = { token: string };
const getInitialData = (): InitialData => {
  // Create a user token when app is first opened.
  // The token is shared with the renderer via a bridge interface.
  //
  // Note: since there is no server verification, you could spam the
  // server with new users at will. This should be replaced with a
  // remote auth API.
  let userToken = store.get(USER_TOKEN_KEY);
  const initialData: InitialData = { token: "" };

  if (userToken) {
    try {
      initialData.token = safeStorage.decryptString(Buffer.from(userToken, "base64"));
    } catch (e) {
      console.warn("Could not encrypt user data", e);
      initialData.token = userToken;
    }
  } else {
    const uuid = crypto.randomUUID();
    if (safeStorage.isEncryptionAvailable()) {
      userToken = safeStorage.encryptString(uuid).toString("base64");
    }
    store.set(USER_TOKEN_KEY, userToken);
    initialData.token = uuid;
  }
  return initialData;
};

const createWindow = (initialData: InitialData): void => {
  const mainWindow = new BrowserWindow({
    width: 720,
    height: 420,
    titleBarStyle: "hidden",
    show: false,
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "icons/icon.icns"),
  });

  // prevents window from appearing before content is loaded
  // if the app grows too large this should be removed
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.setBackgroundColor(themes.default.appBackground);

  mainWindow.webContents.once("did-finish-load", () => {
    mainWindow.webContents.send("initial-data", initialData);
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // mainWindow.loadURL(`swimapp://bundle/renderer/${MAIN_WINDOW_VITE_NAME}/index.html`);
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  if (process.env.OPEN_DEVTOOLS) {
    mainWindow.webContents.openDevTools();
  }
};

app.setAsDefaultProtocolClient(customScheme);

app.whenReady().then(() => {
  app.setName("Swimlanes");
  protocol.handle("swimapp", (req) => {
    const { host, pathname } = new URL(req.url);
    if (host === "bundle") {
      if (pathname === "/index.html") {
        return net.fetch(pathToFileURL("index.html").toString());
      }
      const pathToServe = path.resolve(__dirname, pathname);
      const relativePath = path.relative(__dirname, pathToServe);
      const isSafe =
        relativePath && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
      console.log({ pathToServe, relativePath, isSafe });
      if (!isSafe) {
        return new Response(`<pre>${JSON.stringify({ pathname }, null, 2)}</pre>`, {
          status: 400,
          headers: { "content-type": "text/html" },
        });
      }

      return net.fetch(pathToFileURL(pathToServe).toString());
    }
  });
  const initialData = getInitialData();
  // if (!process.env.CI) {
  createWindow(initialData);
  // }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// app.on("ready", createWindow);

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
