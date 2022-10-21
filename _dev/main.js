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
const decompress = require("decompress");

let icon = `${__dirname}\pages\img\icon.ico`;

let mainWindow = null;
let installWindow = null;
let uploadWindow = null;
let userJSON = null;
let s_width,
  s_height = null;

// Enable live-reload
app.isPackaged ||
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules/electron/dist/electron.exe"),
  });

// If tool is installed separately from original installer, this will make sure correct
// paths are inserted to make mission installations
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
  s_width = width;
  s_height = height;

  mainWindow = new BrowserWindow({
    width: width * 0.5,
    height: height * 0.4,
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

  mainWindow.on("closed", () => app.quit());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: "allow",
    };
  });
});

ipcMain.handle("getJSON", () => {
  return userJSON;
});

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
    width: s_width * 0.3,
    height: s_height * 0.2,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
    },
    resizable: true,
    icon: icon,
  });
  installWindow.loadFile("./install/index.html");
  installWindow.setMenuBarVisibility(false);
});

ipcMain.handle("decompress", async (event, filepath) => {
  await decompress(
    filepath,
    path.join(".", "/temp").then((files) => {
      return files;
    })
  );
});

ipcMain.handle("install", async (event, file) => {
  const { getFiles, installFiles } = require("./functions/installer");

  // Get all the files from the archive
  const mission = await getFiles(file);

  // Install files by moving them to their proper location
  const result = installFiles(mission, userJSON.instDir1, userJSON.instDir2);

  // Alert dialog
  if (result !== undefined) {
    dialog.showMessageBoxSync(installWindow, {
      title: "Something went wrong.",
      type: "error",
      buttons: ["OK"],
      message: result,
    });
    fs.removeSync(path.join(".", "temp"));
    return;
  }

  // If no alerts were found, continue installation
  // Moving DYOM.dat files to userfiles location
  for (const key in mission.dyomdat_files) {
    fs.copySync(
      path.join("temp", mission.dyomdat_files[key]),
      userJSON.instDir1 + "\\" + mission.dyomdat[key]
    );
    fs.removeSync(path.join("temp", mission.dyomdat_files[key]));
  }

  // // Moving SD folders
  if (mission.sd_folders) {
    for (const key in mission.sd_folders) {
      fs.copySync(
        path.join("temp", mission.sd_folders[key]),
        userJSON.instDir1 + "/SD/" + mission.sd_folders[key].slice(-6)
      );
      fs.removeSync(path.join("temp", mission.sd_folders[key]));
    }
  }

  // // Move the rest of the files to modloader folder
  fs.copySync(
    path.join(".", "/temp"),
    userJSON.instDir2 +
      "/modloader/" +
      file.name.substring(0, file.name.indexOf("."))
  );

  // // Clear temp folder
  fs.removeSync(path.join(".", "temp"));
});

ipcMain.handle("openUpload", (event, type) => {
  uploadWindow = new BrowserWindow({
    width: s_width * 0.45,
    height: s_width * 0.25,
    webPreferences: {
      preload: __dirname + "/preload.js",
      contextIsolation: true,
    },
    resizable: true,
    icon: icon,
  });
  uploadWindow.loadFile(`./upload/${type}.html`);
  uploadWindow.setMenuBarVisibility(false);
});

ipcMain.handle("upload", (event, operation, project) => {
  if (project == null) return;
  switch (operation) {
    case "start":
      return "mission";
    case "start-mp":
      return "mp";
    case "mp":
      for (var i = 0; i < project.mission.path.length; i++) {
        fs.copySync(
          `${project.mission.path[i]}`,
          `.\\temp\\${project.mission.files[i]}`
        );
      }
      if (project.sd?.path.length) return "sd-mp";
      if (project.modloader?.path) return "modloader";
      return "package";
    case "sd-mp":
      for (var i = 0; i < project.sd.path.length; i++) {
        if (fs.pathExistsSync(`${project.sd.path[i]}\\`)) {
          fs.copySync(
            `${project.sd.path[i]}\\`,
            `.\\temp\\SD\\${project.sd.codes[i]}\\`
          );
        }
      }
      if (project.modloader?.path) return "modloader";
      return "package";
    case "mission":
      fs.copySync(
        `${project.mission.path}`,
        `.\\temp\\${project.mission.files}`
      );
      if (project.sd?.path) return "sd";
      if (project.modloader?.path) return "modloader";
      return "package";
    case "sd":
      fs.copySync(`${project.sd.path}`, `.\\temp\\SD\\${project.sd.code}`);
      if (project.modloader?.path) return "modloader";
      return "package";
    case "modloader":
      fs.copySync(
        `${project.modloader?.path}`,
        `.\\temp\\modloader\\${project.info.name}`
      );
      return "package";
    case "package":
      const archiver = require("archiver");
      const output = fs.createWriteStream(
        `${userJSON.instDir1}\\MyMissions\\${project.info.name}.zip`
      );
      const archive = archiver("zip", {
        zlib: { level: 0 },
      });
      archive.on("error", function (err) {
        throw err;
      });
      if (!fs.existsSync(userJSON.instDir1 + "/MyMissions")) {
        fs.mkdirSync(userJSON.instDir1 + "/MyMissions");
      }
      archive.pipe(output);
      archive.directory(`.\\temp\\`, false);
      archive.finalize().then(() => {
        fs.removeSync(`.\\temp\\`);
      });
      return "end";
    case "end":
      return "end";
  }
});

ipcMain.handle("openFolder", () => {
  return shell.openPath(userJSON.instDir1);
});

ipcMain.handle("openMissionsFolder", () => {
  return shell.openPath(path.join(userJSON.instDir1, "/MyMissions/"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
