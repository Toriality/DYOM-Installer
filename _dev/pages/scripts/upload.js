const fs = require("fs-extra");
const archiver = require("archiver");

// Full path to files and folders uploaded by user
let missionFile = null; // (ex: C:\GTA User Files\DYOM1.dat)
let sdFolder = null; // (ex: C:\GTA User Files\SD\ABCDE\)
let modloaderFolder = null; // (ex: C:\GTA SA\modloader\MyMission\)

// Names of the files and folders
let missionFileName = null; // (ex: DYOM1.dat)
let sdFolderName = null; // (ex: ABCDE)
let modloaderFolderName = null; // (ex: MyMission)

// Other
let name = null;
let author = null;

window.addEventListener("DOMContentLoaded", () => {
  // Read INST.json
  fs.readFile("./INST.json", "utf-8", (err, instJSON) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }
    try {
      const jsonFile = JSON.parse(instJSON);
      // Checks which addons are installed
      // For each addons installed, create checkbox
      jsonFile.addons.forEach((element) => {
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
          <label for="machine-gun">${element}</label>
        </div>
        `
        );
      });
    } catch (err) {
      console.log("Error parsing JSON object: ", err);
    }
  });

  // Handle mission file upload
  const input_mission = document.getElementById("mission");
  input_mission.addEventListener("change", handleMission, false);
  function handleMission() {
    document.getElementById(
      "sel-mission"
    ).innerHTML = `<option>${this.files[0].name}</option>`;
    missionFile = this.files[0].path;

    setMissionFileName(missionFile);
  }

  // Handle SD folder and files upload
  const input_sd = document.getElementById("sd");
  input_sd.addEventListener("change", handleSD, false);
  function handleSD() {
    document.getElementById("sel-sd").innerHTML = "";
    Array.from(input_sd.files).forEach((file) => {
      document
        .getElementById("sel-sd")
        .insertAdjacentHTML("beforeend", `<option>${file.name}</option>`);
    });
    sdFolder = this.files[0].path;

    setSdFolderName(sdFolder);
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

  // Create .rar archive for the mission
  const btn_upload = document.getElementById("btn-upload");
  btn_upload.addEventListener("click", handleUpload, false);

  function handleUpload() {
    // Set mission name and autor
    name = document.getElementById("name").value;
    author = document.getElementById("author").value;

    // Copy files to a temp folder
    fs.copySync(`${missionFile}\\`, `${__dirname}\\temp\\${missionFileName}`);
    fs.copySync(`${sdFolder}\\`, `${__dirname}\\temp\\SD\\${sdFolderName}`);
    fs.copySync(
      `${modloaderFolder}\\`,
      `${__dirname}\\temp\\modloader\\${modloaderFolderName}`
    );

    // Write mission's INST.json
    let json = {
      name,
      author,
      missionFileName,
      sdFolderName,
      modloaderFolderName,
    };
    json = JSON.stringify(json);
    fs.writeFileSync(`${__dirname}\\temp\\INST.json`, json);

    // Write ReadMe.txt
    fs.writeFileSync(
      `${__dirname}\\temp\\README.txt`,
      `
======================================================
### ${name.toUpperCase()}
### By: ${author}
======================================================

### How to install it?

If you have DYOM Installer, simply open the program and click on "Install a Mission" button. Select this file and click"Install". That's it, you can now run the game and start playing!

If you do not have the installer in your computer, you can download it here: LINK

Or, if you prefer, you can manually move the folders inside their respective places. These are:

"modloader" folder goes to your GTA San Andreas root folder.
"SD" folder goes to your GTA San Andreas User Files folder
${missionFileName} also goes to your GTA San Andreas User Files folder.

If you have any questions or issues head to our Discord server, we have an #support channel, you are very welcome there:
https://discordapp.com/invite/XzqxyV7

Have fun!!!
;)
`
    );

    // create a file to stream archive data to.
    const output = fs.createWriteStream(`${__dirname}\\${name}.zip`);
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

    // pipe archive data to the file
    archive.pipe(output);

    // Archive files and folders
    archive.directory(`${__dirname}\\temp\\`, false);

    // finalize the archive (ie we are done appending files but streams have to finish yet)
    // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
    archive.finalize().then(() => {
      console.log("Finalized, deleting temp");
      fs.removeSync(`${__dirname}\\temp\\`);
      console.log("Deleted");
    });
  }

  function setMissionFileName(path) {
    // The mission file name aways is formed by DYOMX.dat
    // Where X is equal the mission number (1-8)
    // To get the name, just slice the 9 last letters of the full path
    missionFileName = path.slice(path.length - 9);
  }

  function setSdFolderName(path) {
    // Gets the missionaudio code, in this case we get the full path of the first encountered file
    // and set its parent directory as the SD folder name
    path = path.split("\\");
    sdFolderName = path[path.length - 2];
    // Set sdFolder to a valid directory
    sdFolder = sdFolder.substr(
      0,
      sdFolder.lastIndexOf(sdFolderName) + sdFolderName.length
    );
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
