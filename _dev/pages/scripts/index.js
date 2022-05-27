const { ipcRenderer } = require("electron");
const fs = require("fs-extra");

window.addEventListener("DOMContentLoaded", () => {
  let isModalOpen = false;
  let userJSON;
  loadMissions();

  const btn_upload = document.getElementById("btn-upload");
  btn_upload.addEventListener("click", showUploadModal, false);
  function showUploadModal() {
    document.getElementById("overlay").removeAttribute("style");
    isModalOpen = true;
    if (isModalOpen) {
      modalFunctions();
    }
  }

  const btn_delete = document.getElementById("btn-delete");
  btn_delete.addEventListener("click", handleDelete, false);
  function handleDelete() {
    let array = document
      .querySelector("option:checked")
      .getAttribute("class")
      .split(" ");
    let type = array[0];
    let name = array[1];

    let shouldDelete = ipcRenderer.sendSync("del", type, name);
    console.log(shouldDelete);
    if (shouldDelete === 0) {
      if (type === "storyline") {
        // Delete DSL
        fs.removeSync(`${userJSON.instDir}\\DSL\\`);
        // Delete SD folders
        if (userJSON.dsl.sdFoldersArray.length > 0) {
          for (var i = 0; i < userJSON.dsl.sdFoldersArray.length; i++) {
            fs.removeSync(
              `${userJSON.instDir}\\SD\\${userJSON.dsl.sdFoldersArray[i]}`
            );
          }
        }
        // Delete modloader folders
        if (userJSON.dsl.modloaderFolderName !== null) {
          fs.removeSync(
            `${userJSON.instDir2}\\modloader\\${userJSON.dsl.modloaderFolderName}`
          );
        }
        // Update json
        userJSON.dsl = undefined;
      }

      if (type === "MP") {
        // Delete DYOM files
        for (var i = 0; i < userJSON.mp.missionFilesArray.length; i++) {
          fs.removeSync(
            `${userJSON.instDir}\\${userJSON.mp.missionFilesArray[i]}`
          );
        }
        // SD folders
        if (userJSON.mp.sdFoldersArray.length > 0) {
          for (var i = 0; i < userJSON.mp.sdFoldersArray.length; i++) {
            fs.removeSync(
              `${userJSON.instDir}\\SD\\${userJSON.mp.sdFoldersArray[i]}`
            );
          }
        }
        // Modloader folder
        if (userJSON.mp.modloaderFolderName.length !== null) {
          fs.removeSync(
            `${userJSON.instDir2}\\modloader\\${userJSON.mp.modloaderFolderName}`
          );
        }
        // Update json
        userJSON.mp = undefined;
      }

      if (type === "mission") {
        // Find
        for (var i = 0; i < userJSON.missions.length; i++) {
          if (userJSON.missions[i].name === name) {
            // Delete DYOM file
            fs.removeSync(
              `${userJSON.instDir}\\${userJSON.missions[i].missionFileName}`
            );
            // Delete SD folder
            if (userJSON.missions[i].sdFolderName !== null) {
              fs.removeSync(
                `${userJSON.instDir}\\SD\\${userJSON.missions[i].sdFolderName}`
              );
            }
            // Delete modloader folder
            if (userJSON.missions[i].modloaderFolderName !== null) {
              fs.removeSync(
                `${userJSON.instDir2}\\modloader\\${userJSON.missions[i].modloaderFolderName}`
              );
            }
            // Update user json
            userJSON.missions[i] = { slot: i + 1 };
          }
        }
      }

      // Update json and remove option
      fs.writeJsonSync("./INST.json", userJSON);
      document.querySelector(`.${name}`).remove();
    }
  }

  function loadMissions() {
    userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
    const installedMission = document.getElementById("sel-missions");
    if (userJSON.dsl !== undefined) {
      installedMission.innerHTML =
        installedMission.innerHTML +
        `<option class="storyline ${userJSON.dsl.name}">${userJSON.dsl.name} (Storyline)</option>`;
    }
    if (userJSON.mp !== undefined) {
      installedMission.innerHTML =
        installedMission.innerHTML +
        `<option class="MP ${userJSON.mp.name}">${userJSON.mp.name} (MP)</option>`;
    }
    for (var i = 0; i < userJSON.missions.length; i++) {
      if (userJSON.missions[i].name !== undefined) {
        installedMission.innerHTML =
          installedMission.innerHTML +
          `<option class="mission ${userJSON.missions[i].name}">${userJSON.missions[i].name} (${userJSON.missions[i].missionFileName})</option>`;
      }
    }
  }

  function modalFunctions() {
    const modal_desc = document.getElementById("modal-desc");
    document
      .getElementById("single-mission")
      .addEventListener(
        "mouseenter",
        () =>
          changeDesc(
            "Upload a single mission file. Useful for MOTW entries and simple missions",
            "single-mission"
          ),
        false
      );
    document
      .getElementById("storyline")
      .addEventListener(
        "mouseenter",
        () => changeDesc("Upload a DYOM storyline", "storyline"),
        false
      );
    document
      .getElementById("mission-pack")
      .addEventListener(
        "mouseenter",
        () =>
          changeDesc(
            "Upload up to 8 mission files. Useful for making Mission Packs (each chapter containing 8 missions, for example)",
            "mission-pack"
          ),
        false
      );

    document
      .getElementById("overlay")
      .addEventListener("click", closeOverlay, false);

    function closeOverlay() {
      document
        .getElementById("overlay")
        .setAttribute("style", "visibility:hidden");
    }

    function changeDesc(str, id = "") {
      modal_desc.innerText = str;
      if (id !== "") {
        document
          .getElementById(id)
          .addEventListener("mouseleave", () =>
            changeDesc("Select one of the options bellow:")
          );
      }
    }
  }
});
