const {
  app,
  screen,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
  ipcRenderer,
} = require("electron");

const path = require("path");

const fs = require("fs-extra");

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

  require("electron").globalShortcut.register("CommandOrControl+Alt+D", () => {
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

ipcMain.on("json-not-found-1", (event) => {
  dialog.showMessageBoxSync(mainWindow, {
    title: "Path configuration",
    type: "warning",
    buttons: ["OK"],
    message: "Please select your GTA San Andreas USER FILES directory!",
  });
  event.returnValue = dialog.showOpenDialogSync(mainWindow, {
    title: "Locate your GTA SA User Files folder",
    properties: ["openDirectory"],
  });
});

ipcMain.on("json-not-found-2", (event) => {
  dialog.showMessageBoxSync(mainWindow, {
    title: "Path configuration",
    type: "warning",
    buttons: ["OK"],
    message: "Now please select your GTA San Andreas ROOT directory!",
  });
  event.returnValue = dialog.showOpenDialogSync(mainWindow, {
    title: "Locate your GTA SA root folder",
    properties: ["openDirectory"],
  });
});

ipcMain.on("json-error", (event, arg) => {
  dialog.showMessageBoxSync(mainWindow, {
    title: "Error creating INST.json",
    type: "error",
    buttons: ["OK"],
    message: `Something went wrong while trying to configurate the paths. Error log bellow:\n\n${arg}`,
  });
  app.quit();
});

ipcMain.on("install-error-instjson", (event) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    title: "Installation error",
    type: "error",
    buttons: ["OK"],
    message:
      "This mission wasn't uploaded using this tool. Automatically installing missions that weren't made utilizing DYOM.exe tools is a feature still working in progress.",
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
  installWindow.setMenuBarVisibility(false);
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
  uploadWindow.setMenuBarVisibility(false);
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
  uploadWindow.setMenuBarVisibility(false);
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
  uploadWindow.setMenuBarVisibility(false);
});

ipcMain.on("btn-exit", () => {
  app.quit();
});

ipcMain.on("btn-openfolder", (event, userJSON) => {
  shell.openPath(path.join(userJSON.instDir));
  console.log(path.join(userJSON.instDir));
});

ipcMain.on("btn-run", (event, userJSON) => {
  if (fs.pathExistsSync(path.join(userJSON.instDir2, "GTA_SA.exe")))
    return shell.openPath(path.join(userJSON.instDir2, "GTA_SA.exe"));
  if (fs.pathExistsSync(path.join(userJSON.instDir2, "GTA-SA.exe")))
    return shell.openPath(path.join(userJSON.instDir2, "GTA-SA.exe"));
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
      "Cancel",
    ],
    defaultId: 0,
    cancelId: 8,
    title: "DYOM Mission slot selection",
  });
});

ipcMain.on("inst-success", (event) => {
  event.returnValue = dialog.showMessageBoxSync(installWindow, {
    message: `Installation completed successfully!`,
    type: "none",
    buttons: ["OK"],
    defaultId: 0,
    title: "Done!",
    cancelId: 0,
  });
  mainWindow.reload();
});

ipcMain.on("upload-success", (event) => {
  event.returnValue = dialog.showMessageBoxSync(uploadWindow, {
    message: `Upload completed successfully!`,
    type: "none",
    buttons: ["Open folder", "Continue"],
    defaultId: 0,
    title: "Done!",
    cancelId: 1,
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
