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
    { handle: "openFolder" }
  );

  const btn_upload = document.getElementById("btn-upload");
  const overlay = document.getElementById("overlay");
  btn_upload.addEventListener("click", showUploadModal);
  overlay.addEventListener("click", closeOverlay);
  handleModalDesc(...descriptions);
});

function showUploadModal() {
  document.getElementById("overlay").removeAttribute("style");
}

function closeOverlay() {
  document.getElementById("overlay").setAttribute("style", "visibility:hidden");
}
