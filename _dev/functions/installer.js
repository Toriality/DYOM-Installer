const decompress = require("decompress");
const unrar = require("node-unrar-js");

const path = require("path");

// Returns a list of files from archive
async function getFiles(file) {
  // Arrays for storing the paths of files and directories
  const directories = [];
  const files_names = [];
  const sd_folders = [];
  const dyomdat_files = [];
  const dyomdat = [];
  const sl_files = [];
  let dyomdat_folder = "";
  let isMP = false;
  // Regular expressions to find specific filepaths
  const r_dyom = /DYOM\d.dat$/i;
  const r_dsl = /(^|\/)DSL\/$/;
  const r_sd = /(^|\/)([A-Z]|\d){5}\/$/;

  // Get file type (rar or zip)
  const filetype = file.path.slice(-3);

  // node-unrar-js
  if (filetype == "rar") {
    const extractor = await unrar.createExtractorFromFile({
      filepath: file.path,
      targetPath: path.join(".", "/temp"),
    });

    const files = [...extractor.getFileList().fileHeaders];

    for (const key in files) {
      files[key].flags.directory
        ? directories.push(files[key].name)
        : files_names.push(files[key].name);
    }

    [...extractor.extract().files];
  }

  // decompress js
  if (filetype == "zip") {
    await decompress(file.path, path.join(".", "/temp")).then((files) => {
      for (const key in files) {
        files[key].type == "directory"
          ? directories.push(files[key].path)
          : files_names.push(files[key].path);
      }
    });
  }

  // Identify SD folder(s)
  for (const key in directories) {
    if (directories[key].match(r_sd) !== null) {
      sd_folders.push(directories[key].match(r_sd)["input"]);
    }
  }

  // Identify DYOM dat files
  for (const key in files_names) {
    if (files_names[key].match(r_dyom) !== null) {
      // Returns the full path name of DYOM(x).dat file
      fullpath = files_names[key].match(r_dyom)["input"];
      // Return the matched name of DYOM(x).dat file (normally DYOM1.dat)
      dyomdat.push(files_names[key].match(r_dyom)[0]);
      // Assign the folder and add DYOM files
      const new_dyomdat_folder = fullpath.substring(
        0,
        fullpath.indexOf(dyomdat[key])
      );
      // Identify if it is a complex MP/project
      if (dyomdat_folder) {
        if (dyomdat_folder !== new_dyomdat_folder) {
          isMP = true;
          break;
        }
      }

      dyomdat_folder = new_dyomdat_folder;
      dyomdat_files.push(files_names[key].match(r_dyom)["input"]);
    }
  }

  // Identify if it is a SL
  for (const key in directories) {
    if (directories[key].match(r_dsl) !== null) {
      sl_files.push(directories[key].match(r_dsl)[0]);
    }
  }

  return { dyomdat_files, dyomdat, sd_folders, isMP };
}

// Move identified files to their correct location and return the alert message to
// be displayed for the user in the installer remote method dialog box
function installFiles(mission) {
  let alert = "";
  // Check if there is any DYOM file
  if (!mission.dyomdat_files.length) {
    alert =
      "The archive you entered has no DYOM.dat files. You might be trying to install a archive that contains only SD and modifications. Installation has aborted and no files in your computer were affected, please install it manually.";
    return alert;
  }
  if (mission.isMP) {
    alert =
      "The archive you are trying to install has DYOM.dat files in multiple directories, meaning it is probably huge Mission Pack or some other complex DYOM project. Installation has aborted and no files in your computer were affected, please install it manually.";
    return alert;
  }
}

module.exports = { getFiles, installFiles };
