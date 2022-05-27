const {
  app,
  screen,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
} = require("electron");

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
      contextIsolation: false,
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

ipcMain.on("del", (event, type, name) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `The ${type} of the name "${name}" and all its data will be deleted. Continue?`,
    type: "warning",
    buttons: ["Yes", "Cancel"],
    defaultId: 0,
    title: "Are you sure you want to delete?",
    cancelId: 1,
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

ipcMain.on("dsl-exists", (event, arg) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `The storyline ${arg} and all its data will be deleted. Continue?`,
    type: "warning",
    buttons: ["Yes", "Cancel"],
    defaultId: 0,
    title: "Existing storyline detected",
    cancelId: 1,
  });
});

ipcMain.on("mp-warning", (event, arg) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `Installing an MP will delete all other DYOM missions and their data. Continue?`,
    type: "warning",
    buttons: ["Yes", "Cancel"],
    defaultId: 0,
    title: "Mission Pack warning",
    cancelId: 1,
  });
});

ipcMain.on("mp-exists", (event, arg) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `This will delete the MP "${arg}" and all its data. Delete it?`,
    type: "warning",
    buttons: ["Yes", "Cancel"],
    defaultId: 0,
    title: "Delete existing Mission Pack?",
    cancelId: 1,
  });
});

ipcMain.on("mission-exists", (event, arg) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `This slot is already occupied by the mission "${arg}". Delete it?`,
    type: "warning",
    buttons: ["Yes", "Cancel"],
    defaultId: 0,
    title: "Existing mission detected",
    cancelId: 1,
  });
});

ipcMain.on("slot", (event, arg) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `Select the mission slot:`,
    type: "warning",
    buttons: [
      "Slot 1",
      "Slot 2",
      "Slot 3",
      "Slot 4",
      "Slot 5",
      "Slot 6",
      "Slot 7",
      "Slot 8",
    ],
    defaultId: 0,
    title: "DYOM Mission slot selection",
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
