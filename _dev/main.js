const { app, screen, BrowserWindow, ipcMain, shell } = require("electron");

let icon = `${__dirname}\pages\img\icon.ico`;

let mainWindow = null;
let installWindow = null;
let uploadWindow = null;

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width * 0.5,
    height: height * 0.2,
    webPreferences: {
      preload: `${__dirname}/preload.js`,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    resizable: false,
    frame: false,
    icon: icon,
  });

  require("electron").globalShortcut.register("CommandOrControl+D", () => {
    require("electron").dialog.showMessageBox({
      icon: icon,
      title: "DYOM Message",
      message: "DYOM is awesome!",
    });
  });

  mainWindow.loadFile("./pages/index.html");
  //mainWindow.removeMenu();
  mainWindow.on("closed", () => app.quit());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
    };
  });
});

ipcMain.on("btn-install", () => {
  installWindow = new BrowserWindow({
    width: 500,
    height: 200,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: true,
    icon: icon,
  });
  installWindow.loadFile("./pages/install.html");
});

ipcMain.on("single-mission", () => {
  uploadWindow = new BrowserWindow({
    width: mainWindow.width,
    height: mainWindow.height,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    icon: icon,
  });
  uploadWindow.loadFile("./pages/uploadMission.html");
});

ipcMain.on("mission-pack", () => {
  uploadWindow = new BrowserWindow({
    width: mainWindow.width,
    height: mainWindow.height,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    icon: icon,
  });
  uploadWindow.loadFile("./pages/uploadMP.html");
});

ipcMain.on("storyline", () => {
  uploadWindow = new BrowserWindow({
    width: mainWindow.width,
    height: mainWindow.height,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
    icon: icon,
  });
  uploadWindow.loadFile("./pages/uploadStoryline.html");
});

ipcMain.on("btn-exit", () => {
  app.quit();
});

ipcMain.on("btn-openfolder", () => {
  shell.openPath(__dirname);
});

ipcMain.on("btn-run", () => {
  shell.openPath(`${__dirname}\"Start GTA.lnk`);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
