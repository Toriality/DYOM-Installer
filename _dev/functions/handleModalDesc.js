export default function handleModalDesc(...objects) {
  const modal_desc = document.getElementById("modal-desc");
  objects.forEach((object) => {
    document.getElementById(object.id).addEventListener("mouseover", () => {
      modal_desc.innerText = object.description;
    });
    document.getElementById(object.id).addEventListener("mouseleave", () => {
      modal_desc.innerText = "Select one of the options below:\n\n";
    });
    document.getElementById(object.id).addEventListener("click", () => {
      window.dyom.openUpload(object.id);
    });
  });
}
