window.addEventListener("DOMContentLoaded", () => {
  let isModalOpen = false;

  const btn_upload = document.getElementById("btn-upload");
  btn_upload.addEventListener("click", showUploadModal, false);
  function showUploadModal() {
    document.getElementById("overlay").removeAttribute("style");
    isModalOpen = true;
    if (isModalOpen) {
      modalFunctions();
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
