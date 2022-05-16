const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const btn_install = document.getElementById("btn-install");
  btn_install.addEventListener("click", install);
  function install(e) {
    ipcRenderer.send("btn-install");
  }

  // const btn_upload = document.getElementById("btn-upload");
  // btn_upload.addEventListener("click", upload);
  // function upload(e) {
  //   ipcRenderer.send("btn-upload");
  // }

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
