import buttonSound from "../functions/buttonSound.js";
import electronHandler from "../functions/electronHandler.js";
import handleModalDesc from "../functions/handleModalDesc.js";
import descriptions from "./descriptions.js";

window.addEventListener("DOMContentLoaded", () => {
  buttonSound();

  electronHandler(
    { handle: "exit" },
    { handle: "run" },
    { handle: "openInstall" },
    //{ handle: "openUpload" },
    { handle: "openFolder" }
    //{ handle: "delete" }
  );

  const btn_upload = document.getElementById("btn-upload");
  const btn_delete = document.getElementById("btn-delete");
  const overlay = document.getElementById("overlay");
  btn_upload.addEventListener("click", showUploadModal);
  btn_delete.addEventListener("click", handleDelete);
  overlay.addEventListener("click", closeOverlay);
});

function showUploadModal() {
  document.getElementById("overlay").removeAttribute("style");
  document.getElementById("modal_desc");

  handleModalDesc(...descriptions);
}

function closeOverlay() {
  document.getElementById("overlay").setAttribute("style", "visibility:hidden");
}

function handleDelete() {
  let array = document
    .querySelector("option:checked")
    .getAttribute("class")
    .split(" ");
}

//   const btn_install = document.getElementById("btn-install");
//   btn_install.addEventListener("click", install);
//   function install(e) {
//     ipcRenderer.send("btn-install");
//   }

//   const single_mission = document.getElementById("single-mission");
//   single_mission.addEventListener("click", uploadMission);
//   function uploadMission(e) {
//     ipcRenderer.send("single-mission");
//   }

//   const mission_pack = document.getElementById("mission-pack");
//   mission_pack.addEventListener("click", uploadMP, false);
//   function uploadMP() {
//     ipcRenderer.send("mission-pack");
//   }

//   const storyline = document.getElementById("storyline");
//   storyline.addEventListener("click", uploadStoryline, false);
//   function uploadStoryline() {
//     ipcRenderer.send("storyline");
//   }

//   const btn_exit = document.getElementById("btn-exit");
//   btn_exit.addEventListener("click", exit);
//   function exit(e) {
//     ipcRenderer.send("btn-exit");
//   }

//   const btn_openfolder = document.getElementById("btn-openfolder");
//   btn_openfolder.addEventListener("click", openFolder);
//   function openFolder(e) {
//     ipcRenderer.send("btn-openfolder", userJSON);
//   }

//   const btn_run = document.getElementById("btn-run");
//   btn_run.addEventListener("click", run);
//   function run(e) {
//     ipcRenderer.send("btn-run", userJSON);
//   }
// });
//   }
// });
//   const btn_delete = document.getElementById("btn-delete");
//   btn_delete.addEventListener("click", handleDelete, false);
//   function handleDelete() {
//     let array = document
//       .querySelector("option:checked")
//       .getAttribute("class")
//       .split(" ");
//     let type = array[0];
//     let name = array[1];

//     let shouldDelete = ipcRenderer.sendSync("del", type, name);
//     console.log(shouldDelete);
//     if (shouldDelete === 0) {
//       if (type === "storyline") {
//         // Delete DSL
//         fs.removeSync(`${userJSON.instDir}\\DSL\\`);
//         fs.mkdirSync(`${userJSON.instDir}\\DSL\\`);
//         // Delete SD folders
//         if (userJSON.dsl.sdFoldersArray.length > 0) {
//           for (var i = 0; i < userJSON.dsl.sdFoldersArray.length; i++) {
//             fs.removeSync(
//               `${userJSON.instDir}\\SD\\${userJSON.dsl.sdFoldersArray[i]}`
//             );
//           }
//         }
//         // Delete modloader folders
//         if (userJSON.dsl.modloaderFolderName !== null) {
//           fs.removeSync(
//             `${userJSON.instDir2}\\modloader\\${userJSON.dsl.modloaderFolderName}`
//           );
//         }
//         // Update json
//         userJSON.dsl = undefined;
//       }

//       if (type === "MP") {
//         // Delete DYOM files
//         for (var i = 0; i < userJSON.mp.missionFilesArray.length; i++) {
//           fs.removeSync(
//             `${userJSON.instDir}\\${userJSON.mp.missionFilesArray[i]}`
//           );
//         }
//         // SD folders
//         if (userJSON.mp.sdFoldersArray.length > 0) {
//           for (var i = 0; i < userJSON.mp.sdFoldersArray.length; i++) {
//             fs.removeSync(
//               `${userJSON.instDir}\\SD\\${userJSON.mp.sdFoldersArray[i]}`
//             );
//           }
//         }
//         // Modloader folder
//         if (userJSON.mp.modloaderFolderName !== null) {
//           fs.removeSync(
//             `${userJSON.instDir2}\\modloader\\${userJSON.mp.modloaderFolderName}`
//           );
//         }
//         // Update json
//         userJSON.mp = undefined;
//       }

//       if (type === "mission") {
//         // Find
//         for (var i = 0; i < userJSON.missions.length; i++) {
//           if (userJSON.missions[i].name === name) {
//             // Delete DYOM file
//             fs.removeSync(
//               `${userJSON.instDir}\\${userJSON.missions[i].missionFileName}`
//             );
//             // Delete SD folder
//             if (userJSON.missions[i].sdFolderName !== null) {
//               fs.removeSync(
//                 `${userJSON.instDir}\\SD\\${userJSON.missions[i].sdFolderName}`
//               );
//             }
//             // Delete modloader folder
//             if (userJSON.missions[i].modloaderFolderName !== null) {
//               fs.removeSync(
//                 `${userJSON.instDir2}\\modloader\\${userJSON.missions[i].modloaderFolderName}`
//               );
//             }
//             // Update user json
//             userJSON.missions[i] = { slot: i + 1 };
//           }
//         }
//       }

//       // Update json and remove option
//       fs.writeJsonSync("./INST.json", userJSON);
//       document.querySelector(`.${name}`).remove();
//     }
//   }

//   function loadMissions() {
//     userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
//     const installedMission = document.getElementById("sel-missions");
//     if (userJSON.dsl !== undefined) {
//       installedMission.innerHTML =
//         installedMission.innerHTML +
//         `<option class="storyline ${userJSON.dsl.name}">${userJSON.dsl.name} (Storyline)</option>`;
//     }
//     if (userJSON.mp !== undefined) {
//       installedMission.innerHTML =
//         installedMission.innerHTML +
//         `<option class="MP ${userJSON.mp.name}">${userJSON.mp.name} (MP)</option>`;
//     }
//     for (var i = 0; i < userJSON.missions.length; i++) {
//       if (userJSON.missions[i].name !== undefined) {
//         installedMission.innerHTML =
//           installedMission.innerHTML +
//           `<option class="mission ${userJSON.missions[i].name}">${userJSON.missions[i].name} (${userJSON.missions[i].missionFileName})</option>`;
//       }
//     }
//   }
