const fs = require("fs");

window.addEventListener("DOMContentLoaded", () => {
  fs.readFile("./INST.json", "utf-8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      const jsonFile = JSON.parse(jsonString);
      console.log("DYOM Version is: ", jsonFile);
    } catch (err) {
      console.log("Error parsing JSON object: ", err);
    }
  });

  const input_mission = document.getElementById("mission");
  input_mission.addEventListener("change", handleMission, false);
  function handleMission() {
    document.getElementById(
      "sel-mission"
    ).innerHTML = `<option>${this.files[0].name}</option>`;
  }

  const input_sd = document.getElementById("sd");
  input_sd.addEventListener("change", handleSD, false);
  function handleSD() {
    document.getElementById("sel-sd").innerHTML = "";
    Array.from(input_sd.files).forEach((file) => {
      document
        .getElementById("sel-sd")
        .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
    });
  }

  const input_mods = document.getElementById("mods");
  input_mods.addEventListener("change", handleMods, false);
  function handleMods() {
    document.getElementById("sel-mods").innerHTML = "";
    Array.from(input_mods.files).forEach((file) => {
      document
        .getElementById("sel-mods")
        .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
    });
  }
});
