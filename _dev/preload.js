const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
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
    ipcRenderer.send("btn-openfolder");
  }

  const btn_run = document.getElementById("btn-run");
  btn_run.addEventListener("click", run);
  function run(e) {
    ipcRenderer.send("btn-run");
  }
});
