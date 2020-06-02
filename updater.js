const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "silly";
autoUpdater.autoDownload = false;

module.exports = () => {
  autoUpdater.checkForUpdates();
};

autoUpdater.on("update-available", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update avaliable",
      message: "Nova verzija je dostupna",
      buttons: ["Skini sad", "Skini kasnije"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on("update-downloaded", () => {
  dialog
    .showMessageBox({
      type: "info",
      title: "Update downloaded",
      message: "Instalirajte novu verziju",
      buttons: ["Instaliraj", "Kasnije"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall(false, true);
      }
    });
});
