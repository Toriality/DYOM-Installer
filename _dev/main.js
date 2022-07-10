const {
  app,
  screen,
  BrowserWindow,
  ipcMain,
  shell,
  dialog,
} = require("electron");

const path = require("path");

const fs = require("fs-extra");
const { fstatSync } = require("fs");

let icon = `${__dirname}\pages\img\icon.ico`;

let mainWindow = null;
let installWindow = null;
let uploadWindow = null;
let userJSON = null;

// Enable live-reload
app.isPackaged ||
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules/electron/dist/electron.exe"),
  });

function createUserJSON(jsonPath) {
  dialog.showMessageBoxSync(mainWindow, {
    title: "Path configuration",
    type: "warning",
    buttons: ["OK"],
    message: "Please select your GTA San Andreas USER FILES directory!",
  });
  const instDir1 = dialog.showOpenDialogSync(mainWindow, {
    title: "Locate your GTA SA User Files folder",
    properties: ["openDirectory"],
  });
  dialog.showMessageBoxSync(mainWindow, {
    title: "Path configuration",
    type: "warning",
    buttons: ["OK"],
    message: "Now please select your GTA San Andreas ROOT directory!",
  });
  const instDir2 = dialog.showOpenDialogSync(mainWindow, {
    title: "Locate your GTA SA root folder",
    properties: ["openDirectory"],
  });

  // If user cancels, quit app
  if (!instDir1 || !instDir2) return app.quit();

  fs.createFileSync(jsonPath);
  fs.writeJsonSync(jsonPath, {
    version: "8.1",
    instDir1: instDir1[0],
    instDir2: instDir2[0],
    addons: [],
    missions: [
      { slot: 1 },
      { slot: 2 },
      { slot: 3 },
      { slot: 4 },
      { slot: 5 },
      { slot: 6 },
      { slot: 7 },
      { slot: 8 },
    ],
  });
}

// Load user JSON
function loadUserJSON() {
  const jsonPath = path.join(".", "user.json");
  try {
    userJSON = fs.readJsonSync(jsonPath);
  } catch (err) {
    createUserJSON(jsonPath);
    loadUserJSON();
  }
}

app.whenReady().then(() => {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width * 0.5,
    height: height * 0.2,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
    },
    resizable: false,
    frame: false,
    icon: icon,
  });

  loadUserJSON();

  mainWindow.loadFile(__dirname + "/home/index.html");

  // Open developer console if in development mode
  app.isPackaged || mainWindow.webContents.toggleDevTools();

  mainWindow.on("closed", () => app.quit());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
    };
  });
});

ipcMain.handle("loadUserJSON", () => {});

ipcMain.handle("exit", () => {
  app.quit();
});

ipcMain.handle("run", () => {
  if (fs.pathExistsSync(path.join(userJSON.instDir2, "GTA_SA.exe")))
    return shell.openPath(path.join(userJSON.instDir2, "GTA_SA.exe"));
  if (fs.pathExistsSync(path.join(userJSON.instDir2, "GTA-SA.exe")))
    return shell.openPath(path.join(userJSON.instDir2, "GTA-SA.exe"));
});

ipcMain.handle("openInstall", () => {
  installWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
    },
    resizable: true,
    icon: icon,
  });
  installWindow.loadFile("./install/index.html");
  installWindow.setMenuBarVisibility(false);
  installWindow.webContents.openDevTools();
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

ipcMain.handle("install", async (event, file) => {
  const decompress = require("decompress");
  const copySchema = {
    dyomFiles: [],
    sdFolder: false,
    sdCodes: [],
    // modloaderFolder: Boolean,
    // modloaderFiles: [String],
    // readMe: Boolean,
    // dslFolder: Boolean,
    // dslFiles: [String],
  };
  const dyom = /DYOM\d.dat$/g;
  const sd = /([A-Z]|\d){5}\/$/;

  decompress(file, path.join(".", "/temp/")).then((files) => {
    let canBrowseSdCode = false;
    let canBrowseModloader = false;

    for (const key in files) {
      const filepath = files[key].path;
      const type = files[key].type;
      // Prepare files to copy
      if (dyom.exec(filepath) && type == "file") {
        copySchema.dyomFiles.push(filepath);
      }
      if (filepath.includes("SD/") && type == "directory") {
        copySchema.sdFolder = true;
      }
      if (sd.exec(filepath) && !copySchema.sdFolder) {
        let code = sd.exec(filepath)[0];
        code = code.substring(0, code.length - 1);
        copySchema.sdCodes.push(code);
      }
    }

    console.log(copySchema);

    fs.removeSync(path.join(".", "temp"));
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
