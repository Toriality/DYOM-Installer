window.require = require;
const electron = require("electron");
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("dyom", {
  getJSON: () => electron.ipcRenderer.invoke("getJSON"),
  exit: () => electron.ipcRenderer.invoke("exit"),
  run: (arg) => electron.ipcRenderer.invoke("run", arg),
  openInstall: () => electron.ipcRenderer.invoke("openInstall"),
  openUpload: (arg) => electron.ipcRenderer.invoke("openUpload", arg),
  openFolder: () => electron.ipcRenderer.invoke("openFolder"),
  install: (file) => electron.ipcRenderer.invoke("install", file),
  openMissionsFolder: () => electron.ipcRenderer.invoke("openMissionsFolder"),
  upload: (operation, project) =>
    electron.ipcRenderer.invoke("upload", operation, project),
  decompress: (arg) => electron.ipcRenderer.invoke("decompress"),
});
