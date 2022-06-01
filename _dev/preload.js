const { ipcRenderer } = require("electron");
const fs = require("fs-extra");

window.addEventListener("DOMContentLoaded", () => {
  let userJSON;
  if (fs.existsSync("./INST.json")) {
    userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
  } else {
    try {
      let newJSON = {
        version: "8.1",
        instDir: ipcRenderer.sendSync("json-not-found-1")[0],
        instDir2: ipcRenderer.sendSync("json-not-found-2")[0],
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
      };
      fs.writeFileSync("./INST.json", JSON.stringify(newJSON));
      userJSON = JSON.parse(fs.readFileSync("./INST.json", "utf-8"));
    } catch (err) {
      ipcRenderer.sendSync("json-error", err);
    }
  }

  const btn_install = document.getElementById("btn-install");
  btn_install.addEventListener("click", install);
  function install(e) {
    ipcRenderer.send("btn-install");
  }

  const single_mission = document.getElementById("single-mission");
  single_mission.addEventListener("click", uploadMission);
  function uploadMission(e) {
    ipcRenderer.send("single-mission");
  }

  const mission_pack = document.getElementById("mission-pack");
  mission_pack.addEventListener("click", uploadMP, false);
  function uploadMP() {
    ipcRenderer.send("mission-pack");
  }

  const storyline = document.getElementById("storyline");
  storyline.addEventListener("click", uploadStoryline, false);
  function uploadStoryline() {
    ipcRenderer.send("storyline");
  }

  const btn_exit = document.getElementById("btn-exit");
  btn_exit.addEventListener("click", exit);
  function exit(e) {
    ipcRenderer.send("btn-exit");
  }

  const btn_openfolder = document.getElementById("btn-openfolder");
  btn_openfolder.addEventListener("click", openFolder);
  function openFolder(e) {
    ipcRenderer.send("btn-openfolder", userJSON);
  }

  const btn_run = document.getElementById("btn-run");
  btn_run.addEventListener("click", run);
  function run(e) {
    ipcRenderer.send("btn-run", userJSON);
  }
});
