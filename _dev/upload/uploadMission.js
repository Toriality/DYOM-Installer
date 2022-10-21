import {
  handleMission,
  handleModloader,
  handleSD,
  handleInfo,
  handleUpload,
} from "../functions/uploader.js";
import buttonSound from "../functions/buttonSound.js";

let project = {
  info: {
    name: null,
    author: null,
  },
  mission: {
    files: null,
    path: null,
  },
  sd: {
    code: null,
    path: null,
  },
  modloader: {
    path: null,
  },
};

window.addEventListener("DOMContentLoaded", () => {
  buttonSound();
  project.mission = handleMission("mission");
  project.sd = handleSD("mission");
  project.modloader = handleModloader();
  project.info = handleInfo();
  handleUpload(project, "mission");
});
