const fs = require("fs-extra");
const decompress = require("decompress");

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
      "Click here to select the .rar file to install";
  }
}

function install() {
  decompress(location, __dirname + "\\temp\\").then((files) => {
    readJSONFiles();
    // Copy files
    if (missionJSON.type === "mission") {
      try {
        fs.copySync(
          `${__dirname}\\temp\\${missionJSON.missionFileName}`,
          `${userJSON.instDir}\\${missionJSON.missionFileName}`
        );
      } catch (err) {
        console.log(err);
      }
      if (missionJSON.sdFolderName !== null) {
        fs.copySync(
          `${__dirname}\\temp\\SD\\${missionJSON.sdFolderName}`,
          `${userJSON.instDir}\\SD\\${missionJSON.sdFolderName}`
        );
      }
      if (missionJSON.modloaderFolderName !== null) {
        fs.copySync(
          `${__dirname}\\temp\\modloader\\${missionJSON.modloaderFolderName}`,
          `${userJSON.instDir2}\\modloader\\${missionJSON.modloaderFolderName}`
        );
      }
      if (missionJSON.requiredAddons.length > 0) {
        let folder = null;
        for (var i = 0; i < missionJSON.requiredAddons.length; i++) {
          switch (missionJSON.requiredAddons[i]) {
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
            `${__dirname}\\temp\\modloader\\${folder}`,
            `${userJSON.instDir2}\\modloader\\${folder}`
          );
        }
      }
    }
  });
}

function readJSONFiles() {
  // Read mission's json
  missionJSON = JSON.parse(
    fs.readFileSync(__dirname + "/temp/INST.json", "utf-8")
  );
  console.log(missionJSON);

  // Read user's json
  userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
  console.log(userJSON);
}
