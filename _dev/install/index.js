window.addEventListener("DOMContentLoaded", () => {
  const input_install = document.getElementById("input-install");
  const btn_install = document.getElementById("btn-install");
  const txt_install = document.getElementById("txt-install");

  input_install.addEventListener("change", handleInstall);
  btn_install.addEventListener("click", install);

  function setInstallState(state) {
    switch (state) {
      case "waiting":
        setDisabled();
        break;
      case "ready":
        setEnabled();
        changeText();
        break;
      case "installing":
        setDisabled("Installing...");
        break;
      case "installed":
        clearFile();
        setEnabled();
        changeText();
        break;
      default:
        break;
    }
  }

  function handleInstall() {
    if (input_install.files.length > 0) {
      setInstallState("ready");
    } else {
      setInstallState("waiting");
    }
  }

  function install() {
    const file = input_install.files[0].path;
    window.dyom.install(file).then((res) => {
      setInstallState("installed");
      console.log(res);
    });
    setInstallState("installing");
  }

  function setDisabled(text = "Install") {
    btn_install.setAttribute("disabled", "true");
    btn_install.innerText = text;
  }

  function setEnabled(text = "Install") {
    btn_install.removeAttribute("disabled");
    btn_install.innerText = text;
  }

  function changeText() {
    if (input_install.files.length > 0) {
      txt_install.innerText = input_install.files[0].name;
    } else {
      txt_install.innerText = "Click here to select the .zip file to install";
    }
  }

  function clearFile() {
    input_install.value = null;
  }
});
