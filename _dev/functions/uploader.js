import { setStatus } from "../upload/loading.js";

export function makeLoadingScreen() {
  document.querySelector("body").insertAdjacentHTML(
    "beforeend",
    `
        <div id="overlay">
          <div id="overlay-text">
            <h1>LOADING</h1>
            <h2 id="status">Creating mission...</h2>
          </div>
  
        </div>
      `
  );
}

export function handleMission(type) {
  const project = { mission: {} };

  const input_mission = document.getElementById("mission");

  input_mission.addEventListener("change", () => {
    if (!input_mission.files[0]) {
      return (document.getElementById("sel-mission").innerHTML =
        "<options></options>");
    }
    if (type == "mission") {
      document.getElementById(
        "sel-mission"
      ).innerHTML = `<option>${input_mission.files[0].name}</option>`;
      project.mission.path = input_mission.files[0].path;
      project.mission.files = project.mission.path.substring(
        project.mission.path.lastIndexOf("\\") + 1,
        project.mission.path.length
      );
    }
    if (type == "mp") {
      project.mission.path = [];
      project.mission.files = [];
      const sel_mission = document.getElementById("sel-mission");
      for (var i = 0; i < input_mission.files.length; i++) {
        project.mission.path.push(input_mission.files[i].path);
        sel_mission.innerHTML = `${sel_mission.innerHTML} <option>${input_mission.files[i].name}</option>`;
      }
      for (var i = 0; i < project.mission.path.length; i++) {
        project.mission.files.push(
          project.mission.path[i].slice(project.mission.path[i].length - 9)
        );
      }
    }
  });

  return project.mission;
}

export function handleSD(type) {
  const project = { sd: {} };

  if (type == "mission") {
    const input_sd = document.getElementById("sd");
    input_sd.addEventListener("change", () => {
      document.getElementById("sel-sd").innerHTML = "";
      Array.from(input_sd.files).forEach((file) => {
        document
          .getElementById("sel-sd")
          .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
      });
      if (!input_sd.files[0]) return;

      const path = input_sd.files[0].path;
      project.sd.path = path.substring(0, path.lastIndexOf("\\")) + "\\";
      project.sd.code = project.sd.path.substring(
        project.sd.path.lastIndexOf("\\") - 5,
        project.sd.path.length - 1
      );
    });
  }

  if (type == "mp") {
    project.sd.path = [];
    project.sd.codes = [];
    let userJSON;
    window.dyom.getJSON().then((res) => {
      userJSON = res;
      console.log(userJSON);
    });
    for (var i = 1; i <= 8; i++) {
      let input_sd = document.getElementById(`sd${i}`);
      input_sd.addEventListener("change", () => {
        project.sd.path.push(`${userJSON.instDir1}\\SD\\${input_sd.value}`);
        project.sd.codes.push(`${input_sd.value}`);
      });
    }
  }

  return project.sd;
}

export function handleModloader() {
  const project = { modloader: {} };
  const input_mods = document.getElementById("mods");
  input_mods.addEventListener("change", () => {
    document.getElementById("sel-mods").innerHTML = "";
    Array.from(input_mods.files).forEach((file) => {
      document
        .getElementById("sel-mods")
        .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
    });
    if (!input_mods.files[0]) return;
    let path = input_mods.files[0].path.split("\\");
    let modname = null;
    path.forEach((val, index) => {
      if (val == "modloader") modname = path[index + 1];
    });
    path = path.join("\\");
    path = path.substring(0, path.indexOf(modname) + modname.length) + "\\";
    project.modloader.path = path;

    return project.modloader;
  });
}

export function handleInfo() {
  const project = { info: {} };
  const txt_name = document.getElementById("name");
  const txt_author = document.getElementById("author");
  txt_name.addEventListener("change", () => {
    project.info.name = txt_name.value;
  });
  txt_author.addEventListener("change", () => {
    project.info.author = txt_author.value;
  });

  return project.info;
}

export function handleUpload(project, type) {
  document.getElementById("btn-upload").addEventListener("click", async () => {
    await upload();
  });

  async function upload() {
    makeLoadingScreen();

    let operation = type == "mission" ? "start" : "start-mp";
    let response = null;
    const audio_pop = new Audio("../sounds/pop.wav");
    const audio_finish = new Audio("../sounds/success.wav");

    while (response !== "end") {
      await window.dyom.upload(operation, project).then(async (res) => {
        audio_pop.play();
        await setStatus(operation, project);
        operation = res;
        response = res;
      });
    }

    document.getElementById("overlay").remove();
    audio_finish.play();
    window.dyom.openMissionsFolder();
  }
}
