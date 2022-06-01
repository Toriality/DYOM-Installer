const fs = require("fs-extra");
const decompress = require("decompress");
const { ipcRenderer, shell } = require("electron");
const path = require("path");

let location = null;

let missionJSON = null;
let userJSON = null;

window.addEventListener("DOMContentLoaded", () => {
  const input_install = document.getElementById("input-install");
  input_install.addEventListener("change", handleInstall, false);

  const btn_install = document.getElementById("btn-install");
  btn_install.addEventListener("click", install, false);
});

function handleInstall() {
  if (this.files.length > 0) {
    document.getElementById("btn-install").removeAttribute("disabled");
    document.getElementById("txt-install").innerText = this.files[0].name;
    location = this.files[0].path;
  } else {
    document.getElementById("btn-install").setAttribute("disabled", "true");
    document.getElementById("txt-install").innerText =
      "Click here to select the .zip file to install";
  }
}

function install() {
  document.querySelector("body").style.cursor = "wait";
  document.getElementById("btn-install").setAttribute("disabled", "true");

  decompress(location, `.\\temp\\`)
    .then((files) => {
      let result = null;
      let shouldRemove = false;
      let shouldRemoveMP = false;
      readJSONFiles();

      // Copy files
      if (missionJSON.type === "dsl") {
        if (userJSON.dsl !== undefined) {
          result = ipcRenderer.sendSync("dsl-exists", userJSON.dsl.name);
        } else {
          result = 0;
        }
        if (result === 0) {
          try {
            fs.removeSync(`${userJSON.instDir}\\DSL\\`);
            fs.copySync(`.\\temp\\DSL\\`, `${userJSON.instDir}\\DSL\\`);
          } catch (err) {
            console.log(err);
          }
          try {
            if (userJSON.dsl.sdFoldersArray.length > 0) {
              for (var i = 0; i < userJSON.dsl.sdFoldersArray.length; i++) {
                fs.removeSync(
                  `${userJSON.instDir}\\SD\\${userJSON.dsl.sdFoldersArray[i]}`
                );
              }
            }
          } catch (err) {
            console.log(err);
          }
          if (missionJSON.sdFoldersArray.length > 0) {
            for (var i = 0; i < missionJSON.sdFoldersArray.length; i++) {
              fs.copySync(
                `.\\temp\\SD\\${missionJSON.sdFoldersArray[i]}`,
                `${userJSON.instDir}\\SD\\${missionJSON.sdFoldersArray[i]}`
              );
            }
          }
          try {
            if (userJSON.dsl.modloaderFolderName !== null) {
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.dsl.modloaderFolderName}`
              );
            }
          } catch (err) {
            console.log(err);
          }
          if (missionJSON.modloaderFolderName !== null) {
            fs.copySync(
              `.\\temp\\modloader\\${missionJSON.modloaderFolderName}`,
              `${userJSON.instDir2}\\modloader\\${missionJSON.modloaderFolderName}`
            );
          }
          if (missionJSON.requiredAddons.length > 0) {
            copyRequiredAddons(missionJSON);
          }
          try {
            userJSON.dsl = {
              name: missionJSON.name,
              author: missionJSON.author,
              sdFoldersArray: missionJSON.sdFoldersArray,
              modloaderFolderName: missionJSON.modloaderFolderName,
              requiredAddons: missionJSON.requiredAddons,
            };
            for (var i = 0; i < missionJSON.requiredAddons.length; i++) {
              if (!userJSON.addons.includes(missionJSON.requiredAddons[i])) {
                userJSON.addons.push(missionJSON.requiredAddons[i]);
              }
            }
            fs.writeJsonSync("./INST.json", userJSON);
          } catch (err) {
            console.log(err);
          }
        }
        if (result === 1) return;
      }

      if (missionJSON.type === "mp") {
        let continueInstall = ipcRenderer.sendSync("mp-warning");
        if (continueInstall === 1) return;
        if (userJSON.mp !== undefined) {
          result = ipcRenderer.sendSync("mp-exists", userJSON.mp.name);
          shouldRemove = true;
        } else {
          result = 0;
        }
        if (result === 0) {
          // Remove all DYOM missions and its data
          try {
            for (var i = 0; i < userJSON.missions.length; i++) {
              fs.removeSync(
                `${userJSON.instDir}\\${userJSON.missions[i].missionFileName}`
              );
              fs.removeSync(
                `${userJSON.instDir}\\SD\\${userJSON.missions[i].sdFolderName}`
              );
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.missions[i].modloaderFolderName}`
              );
              userJSON.missions[i] = { slot: i + 1 };
            }
          } catch (err) {
            console.log(err);
          }

          if (shouldRemove) {
            // Remove DYOM missions
            try {
              for (i = 0; i < userJSON.mp.missionFilesArray.length; i++) {
                fs.removeSync(
                  `${userJSON.instDir}\\${userJSON.mp.missionFilesArray[i]}`
                );
              }
            } catch (err) {
              console.log(err);
            }
            // Remove SD folders
            try {
              for (i = 0; i < userJSON.mp.sdFoldersArray.length; i++) {
                fs.removeSync(
                  `${userJSON.instDir}\\SD\\${userJSON.mp.sdFoldersArray[i]}`
                );
              }
            } catch (err) {
              console.log(err);
            }
            // Remove modloader folders
            try {
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.mp.modloaderFolderName}`
              );
            } catch (err) {
              console.log(err);
            }
          }
          if (missionJSON.missionFilesArray.length > 0) {
            for (var i = 0; i < missionJSON.missionFilesArray.length; i++) {
              fs.copySync(
                `.\\temp\\${missionJSON.missionFilesArray[i]}`,
                `${userJSON.instDir}\\${missionJSON.missionFilesArray[i]}`
              );
            }
          }
          if (missionJSON.sdFoldersArray.length > 0) {
            for (var i = 0; i < missionJSON.sdFoldersArray.length; i++) {
              fs.copySync(
                `.\\temp\\SD\\${missionJSON.sdFoldersArray[i]}`,
                `${userJSON.instDir}\\SD\\${missionJSON.sdFoldersArray[i]}`
              );
            }
          }
          if (missionJSON.modloaderFolderName !== null) {
            fs.copySync(
              `.\\temp\\modloader\\${missionJSON.modloaderFolderName}`,
              `${userJSON.instDir2}\\modloader\\${missionJSON.modloaderFolderName}`
            );
          }
          if (missionJSON.requiredAddons.length > 0) {
            copyRequiredAddons(missionJSON);
          }
          try {
            userJSON.mp = {
              name: missionJSON.name,
              author: missionJSON.author,
              missionFilesArray: missionJSON.missionFilesArray,
              sdFoldersArray: missionJSON.sdFoldersArray,
              modloaderFolderName: missionJSON.modloaderFolderName,
              requiredAddons: missionJSON.requiredAddons,
            };
            for (var i = 0; i < missionJSON.requiredAddons.length; i++) {
              if (!userJSON.addons.includes(missionJSON.requiredAddons[i])) {
                userJSON.addons.push(missionJSON.requiredAddons[i]);
              }
            }
            fs.writeJsonSync("./INST.json", userJSON);
          } catch (err) {
            console.log(err);
          }
        }
      }
      if (result === 1) return;

      if (missionJSON.type === "mission") {
        let slot = ipcRenderer.sendSync("slot"); // 0 - 7 (8 slots)
        if (userJSON.missions[slot].name !== undefined) {
          result = ipcRenderer.sendSync(
            "mission-exists",
            userJSON.missions[slot].name
          );
          shouldRemove = true;
        } else {
          result = 0;
        }
        if (userJSON.mp !== undefined) {
          result = ipcRenderer.sendSync("mp-exists", userJSON.mp.name);
          shouldRemoveMP = true;
        }

        if (result === 0) {
          let DYOM = `DYOM${slot + 1}.dat`;

          if (shouldRemoveMP) {
            // Remove MP and all its data
            // DYOM.dat files
            try {
              for (i = 0; i < userJSON.mp.missionFilesArray.length; i++) {
                fs.removeSync(
                  `${userJSON.instDir}\\${userJSON.mp.missionFilesArray[i]}`
                );
              }
            } catch (err) {
              console.log(err);
            }
            // Remove SD folders
            try {
              for (i = 0; i < userJSON.mp.sdFoldersArray.length; i++) {
                fs.removeSync(
                  `${userJSON.instDir}\\SD\\${userJSON.mp.sdFoldersArray[i]}`
                );
              }
            } catch (err) {
              console.log(err);
            }
            // Remove modloader folders
            try {
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.mp.modloaderFolderName}`
              );
            } catch (err) {
              console.log(err);
            }
            // Remove mp in user json
            try {
              userJSON.mp = undefined;
            } catch (err) {
              console.log(err);
            }
          }

          if (shouldRemove) {
            // Remove DYOM mission slot
            try {
              fs.removeSync(`${userJSON.instDir}\\${DYOM}`);
            } catch (err) {
              console.log(err);
            }
            // Remove SD folder
            try {
              fs.removeSync(
                `${userJSON.instDir}\\SD\\${userJSON.missions[slot].sdFolderName}`
              );
            } catch (err) {
              console.log(err);
            }
            // Remove modloader folder
            try {
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.missions[slot].modloaderFolderName}`
              );
            } catch (err) {
              console.log(err);
            }
          }

          // Rename to correct DYOM mission slot .dat
          // and copy file
          try {
            fs.renameSync(
              `.\\temp\\${missionJSON.missionFileName}`,
              `.\\temp\\${DYOM}`
            );
            fs.copySync(`.\\temp\\${DYOM}`, `${userJSON.instDir}\\${DYOM}`);
          } catch (err) {
            console.log(err);
          }

          // Copy SD folder
          if (missionJSON.sdFolderName !== null) {
            fs.copySync(
              `.\\temp\\SD\\${missionJSON.sdFolderName}`,
              `${userJSON.instDir}\\SD\\${missionJSON.sdFolderName}`
            );
          }

          // Copy modloader folder
          if (missionJSON.modloaderFolderName !== null) {
            fs.copySync(
              `.\\temp\\modloader\\${missionJSON.modloaderFolderName}`,
              `${userJSON.instDir2}\\modloader\\${missionJSON.modloaderFolderName}`
            );
          }

          // Copy required addons
          if (missionJSON.requiredAddons.length > 0) {
            copyRequiredAddons(missionJSON);
          }

          // Update user json
          try {
            userJSON.missions[slot] = {
              slot: slot + 1,
              name: missionJSON.name,
              author: missionJSON.author,
              missionFileName: DYOM,
              sdFolderName: missionJSON.sdFolderName,
              modloaderFolderName: missionJSON.modloaderFolderName,
              requiredAddons: missionJSON.requiredAddons,
            };
            for (var i = 0; i < missionJSON.requiredAddons.length; i++) {
              if (!userJSON.addons.includes(missionJSON.requiredAddons[i])) {
                userJSON.addons.push(missionJSON.requiredAddons[i]);
              }
            }
            fs.writeJsonSync("./INST.json", userJSON);
          } catch (err) {
            console.log(err);
          }
        }
        if (result === 1) return;
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      fs.removeSync(`.\\temp\\`);
      document.getElementById("btn-install").removeAttribute("disabled");
      document.querySelector("body").style.cursor = "auto";
      // Refresh main window (to render the installed mission in InstalledMission selection)
      ipcRenderer.sendSync("inst-success");
    });
}

function readJSONFiles() {
  // Read mission's json
  try {
    missionJSON = JSON.parse(fs.readFileSync("./temp/INST.json", "utf-8"));
  } catch (err) {
    fs.removeSync(`.\\temp\\`);
    ipcRenderer.sendSync("install-error-instjson");
    return window.close();
  }

  // Read user's json
  userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
}

function copyRequiredAddons(json) {
  let folder = null;
  for (var i = 0; i < json.requiredAddons.length; i++) {
    switch (json.requiredAddons[i]) {
      case "MachineGun":
        folder = "Machine Gun";
        break;
      case "DarkEffect":
        folder = "Darkness Effect";
        break;
      case "WDynamites":
        folder = "Working Dynamites";
        break;
      case "RoadSpikes":
        folder = "Road Spikes";
        break;
      case "TeleportHealth":
        folder = "Disable TP health regen";
        break;
      case "CCTV":
        folder = "CCTV Camera";
        break;
      case "PhoneAnim":
        folder = "Phone animation";
        break;
      case "WeaponShops":
        folder = "Weapon Shops";
        break;
      case "SAMP":
        folder = "SAMP Objects";
        break;
      default:
        break;
    }
    fs.copySync(
      `.\\temp\\modloader\\${folder}`,
      `${userJSON.instDir2}\\modloader\\${folder}`
    );
  }
}
