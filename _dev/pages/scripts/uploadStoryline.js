import { buildStatus, randomTimeout } from "./loading.js";

const { ipcRenderer, shell } = require("electron");
const fs = require("fs-extra");
const archiver = require("archiver");

// Full path to files and folders uploaded by user
let dslFolder = null; // (ex: C:\GTA User Files\DSL)
let sdFoldersLoc = []; // (ex: C:\GTA User Files\SD\ABCDE\, C:\GTA User Files\SD\FGHIJ\)
let modloaderFolder = null; // (ex: C:\GTA SA\modloader\MyMission\)

// Names of the files and folders
let sdFoldersArray = []; // (ex: ABCDE, FGHIJ)
let modloaderFolderName = null; // (ex: MyMission)

// Mission name and author name
let name = null;
let author = null;

// List of required add-ons
let requiredAddons = [];

// User Files location
let userFilesLoc = null;

let userJSON;

window.addEventListener("DOMContentLoaded", () => {
  // Read INST.json
  fs.readFile("./INST.json", "utf-8", (err, instJSON) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      userJSON = JSON.parse(instJSON);
      // User Files location
      userFilesLoc = userJSON.instDir; // gtasa userfiles dir
      // Checks which addons are installed
      // For each addons installed, create checkbox
      userJSON.addons.forEach((element) => {
        // The addons bellow aren't addons that the user needs to install to play any missions
        if (
          element === "DYOM_Sharp" ||
          element === "PhoneSkip" ||
          element === "TimeMs"
        )
          return;
        // Writes the checkboxes
        document.getElementById("required-addons").insertAdjacentHTML(
          "beforeend",
          `
        <div>
          <input type="checkbox" id="${element}" />
          <label for="${element}">${element}</label>
        </div>
        `
        );
      });
    } catch (err) {
      console.log("Error parsing JSON object: ", err);
    }
  });

  // Handle mission file upload
  const input_dsl = document.getElementById("dsl");
  input_dsl.addEventListener("change", handleDSL, false);
  function handleDSL() {
    const sel_dsl = document.getElementById("sel-dsl");
    for (var i = 0; i < this.files.length; i++) {
      sel_dsl.innerHTML = `${sel_dsl.innerHTML} <option>${this.files[i].name}</option>`;
    }
    dslFolder = `${userFilesLoc}\\DSL\\`;
  }

  // Handle SD folder and files upload
  for (var i = 1; i <= 26; i++) {
    let input_sd = document.getElementById(`sd${i}`);
    input_sd.addEventListener("change", handleSD, false);
  }
  function handleSD() {
    sdFoldersLoc.push(`${userFilesLoc}\\SD\\${this.value}`);
    sdFoldersArray.push(`${this.value}`);
  }

  // Handle modloader folder and files upload
  const input_mods = document.getElementById("mods");
  input_mods.addEventListener("change", handleMods, false);
  function handleMods() {
    document.getElementById("sel-mods").innerHTML = "";
    Array.from(input_mods.files).forEach((file) => {
      document
        .getElementById("sel-mods")
        .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
    });
    modloaderFolder = this.files[0].path;

    setModloaderFolderNmae(modloaderFolder);
  }

  // Create .zip archive for the mission
  const btn_upload = document.getElementById("btn-upload");
  btn_upload.addEventListener("click", handleUpload, false);

  async function handleUpload() {
    // Make loading screen
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

    // Set mission name and autor
    try {
      name = document.getElementById("name").value;
      author = document.getElementById("author").value;
      await setStatus("name-author-mp");
    } catch (err) {
      console.log("Got an error while setting name and author", err);
    }

    // Get List of required add-ons
    // Query for only the checked checkboxes and put the result in an array
    try {
      requiredAddons = document.querySelectorAll(
        "input[type='checkbox']:checked"
      );
      let newArray = [];
      for (var i = 0; i < requiredAddons.length; i++) {
        newArray.push(requiredAddons[i].id);
      }
      requiredAddons = newArray;
    } catch (err) {
      console.log("Got an error while getting list of required addons", err);
    }

    // Copy files to a temp folder
    // DSL
    try {
      await setStatus("mission-pack");
      fs.copySync(`${dslFolder}`, `.\\temp\\DSL`);
      //fs.copySync(`${missionFile}\\`, `.\\temp\\${missionFileName}`);
    } catch (err) {
      console.log("Got an error while copying DSL folder", err);
    }

    // SD folder
    if (sdFoldersLoc.length > 0) {
      try {
        await setStatus("sd-mp");
        for (var i = 0; i < sdFoldersLoc.length; i++) {
          fs.copySync(
            `${sdFoldersLoc[i]}\\`,
            `.\\temp\\SD\\${sdFoldersArray[i]}\\`
          );
        }
        //fs.copySync(`${sdFolder}\\`, `.\\temp\\SD\\${sdFolderName}`);
      } catch (err) {
        console.log("Got an error while copying SD folder", err);
      }
    }

    // Modloader folder
    if (modloaderFolder !== null) {
      try {
        await setStatus("modloader");
        fs.copySync(
          `${modloaderFolder}\\`,
          `.\\temp\\modloader\\${modloaderFolderName}`
        );
      } catch (err) {
        console.log("Got an error while copying modloader folder", err);
      }
    }

    // Required addons folder
    try {
      const instJSON = fs.readFileSync("./INST.json", "utf-8");

      try {
        const jsonFile = JSON.parse(instJSON);
        const instDir = jsonFile.instDir2; // gtasa root dir

        if (requiredAddons.includes("MachineGun")) {
          try {
            await setStatus("MachineGun");
            fs.copySync(
              `${instDir}\\modloader\\Machine Gun`,
              `.\\temp\\modloader\\Machine Gun`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("DarkEffect")) {
          try {
            await setStatus("DarkEfect");
            fs.copySync(
              `${instDir}\\modloader\\Darkness Effect`,
              `.\\temp\\modloader\\Darkness Effect`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("WDynamites")) {
          try {
            await setStatus("WDynamites");
            fs.copySync(
              `${instDir}\\modloader\\Working Dynamites`,
              `.\\temp\\modloader\\Working Dynamites`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("RoadSpikes")) {
          try {
            await setStatus("RoadSpikes");
            fs.copySync(
              `${instDir}\\modloader\\Road Spikes`,
              `.\\temp\\modloader\\Road Spikes`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("TeleportHealth")) {
          try {
            await setStatus("TeleportHealth");
            fs.copySync(
              `${instDir}\\modloader\\Disable TP health regen`,
              `.\\temp\\modloader\\Disable TP health regen`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("CCTV")) {
          try {
            await setStatus("CCTV");
            fs.copySync(
              `${instDir}\\modloader\\CCTV Camera`,
              `.\\temp\\modloader\\CCTV Camera`
            );
          } catch (er) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("PhoneAnim")) {
          try {
            await setStatus("PhoneAnim");
            fs.copySync(
              `${instDir}\\modloader\\Phone animation`,
              `.\\temp\\modloader\\Phone animation`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("WeaponShops")) {
          try {
            await setStatus("WeaponShops");
            fs.copySync(
              `${instDir}\\modloader\\Weapon Shops`,
              `.\\temp\\modloader\\Weapon Shops`
            );
          } catch (err) {
            console.log(err);
          }
        }

        if (requiredAddons.includes("SAMP")) {
          try {
            await setStatus("SAMP");
            fs.copySync(
              `${instDir}\\modloader\\SAMP Objects`,
              `.\\temp\\modloader\\SAMP Objects`
            );
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        console.log("Error parsing JSON object: ", err);
      }
    } catch (err) {
      console.log(err);
    }

    // Write mission's INST.json
    try {
      await setStatus("installation-data");
      let json = {
        type: "dsl",
        name,
        author,
        dslFolder,
        sdFoldersArray,
        modloaderFolderName,
        requiredAddons,
      };
      json = JSON.stringify(json);
      fs.writeFileSync(`.\\temp\\INST.json`, json);
    } catch (err) {
      console.log("Got an error while writing inst.json", err);
    }

    // Write ReadMe.txt
    try {
      await setStatus("readme");
      fs.writeFileSync(
        `.\\temp\\README.txt`,
        `
======================================================
### ${name.toUpperCase()}
### By: ${author}
======================================================

### How to install it?

If you have DYOM Installer, simply open the program and click on "Install a Mission" button. Select this file and click "Install". That's it, you can now run the game and start playing!

If you do not have the installer in your computer, you can download it here: LINK

Or, if you prefer, you can manually move the folders inside their respective places. These are:

"modloader" folder goes to your GTA San Andreas root folder.
"SD" folder goes to your GTA San Andreas User Files folder
"DSL" folder also goesto your GTA San Andreas User Files folder

If you have any questions or issues head to our Discord server, we have an #support channel, you are very welcome there:
https://discordapp.com/invite/XzqxyV7

Have fun!!!
;)
`
      );
    } catch (err) {
      console.log("Got an error while writing README.txt", err);
    }

    // create a file to stream archive data to.
    try {
      await setStatus("package");
      const output = fs.createWriteStream(
        `${userJSON.instDir}\\MyMissions\\${name}.zip`
      );
      const archive = archiver("zip", {
        zlib: { level: 0 }, // Sets the compression level.
      });
      // listen for all archive data to be written
      // 'close' event is fired only when a file descriptor is involved
      output.on("close", function () {
        console.log(archive.pointer() + " total bytes");
        console.log(
          "archiver has been finalized and the output file descriptor has closed."
        );
      });

      // This event is fired when the data source is drained no matter what was the data source.
      // It is not part of this library but rather from the NodeJS Stream API.
      // @see: https://nodejs.org/api/stream.html#stream_event_end
      output.on("end", function () {
        console.log("Data has been drained");
      });

      // good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on("warning", function (err) {
        if (err.code === "ENOENT") {
          // log warning
        } else {
          // throw error
          throw err;
        }
      });

      // good practice to catch this error explicitly
      archive.on("error", function (err) {
        throw err;
      });

      // Make MyMissions dir
      try {
        if (!fs.existsSync(userJSON.instDir + "/MyMissions")) {
          fs.mkdirSync(userJSON.instDir + "/MyMissions");
        }
      } catch (err) {
        console.log(err);
      }

      // pipe archive data to the file
      try {
        await setStatus("processing");
        archive.pipe(output);
      } catch (err) {
        console.log(err);
      }

      // Archive files and folders
      try {
        await setStatus("almost-done");
        archive.directory(`.\\temp\\`, false);
      } catch (err) {
        console.log(err);
      }

      // finalize the archive (ie we are done appending files but streams have to finish yet)
      // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
      archive.finalize().then(() => {
        setStatus("temp");
        fs.removeSync(`.\\temp\\`);
        document.getElementById("overlay").remove();
        let result = ipcRenderer.sendSync("upload-success");
        if (result === 0)
          return shell.openPath(
            require("path").join(userJSON.instDir, "myMissions")
          );
      });
    } catch (err) {
      console.log(err);
    }
  }

  //---------------------------------
  // Setters
  //---------------------------------

  async function setStatus(type) {
    // Loading titles
    const status = buildStatus(author, name, "", "");
    const randomNumber = Math.random();
    let received = [];
    for (var i = 0; i < status.length; i++) {
      if (status[i].type === type) {
        for (var x = 0; x < status[i].data.length; x++) {
          var entry = status[i].data[x];
          if (randomNumber < entry.probability) {
            var stringsLength = entry.strings.length;
            var chosenString = Math.floor(Math.random() * stringsLength);
            received.push(entry.strings[chosenString]);
          }
        }
      }
    }
    const displayString = received[received.length - 1];
    document.getElementById("status").innerText = displayString;
    await randomTimeout();
  }

  function setModloaderFolderNmae(path) {
    // Finds the 'modloader' string and sets its next directory name as the modloader folder name
    path = path.split("\\");
    path.forEach((val, index) => {
      if (val === "modloader") return (modloaderFolderName = path[index + 1]);
    });
    // Set modloaderFolder to a valid directory
    modloaderFolder = modloaderFolder.substr(
      0,
      modloaderFolder.lastIndexOf(modloaderFolderName) +
        modloaderFolderName.length
    );
  }
});
