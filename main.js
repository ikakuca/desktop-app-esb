const { app, BrowserWindow, Menu } = require("electron");

const { Devices } = require("smartcard");
const EvrcCard = require("./card-reader/EvrcCard");
const updater = require("./updater");

let mainWindow;

function createWindow() {
  setTimeout(updater, 3000);

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 670,
    webPreferences: {
      nodeIntegration: true,
      preload: `${__dirname}/renderer.js`,
    },
  });

  // mainWindow.loadFile('index.html')
  mainWindow.loadURL("https://mystifying-liskov-9df921.netlify.app/");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  const devices = new Devices();
  devices.on("device-activated", onDeviceActivated);
}

const onDeviceActivated = ({ device }) => {
  if (!mainWindow) {
    return null;
  }

  mainWindow.webContents.send("device-activated", { device });

  device.on("card-inserted", (e) => {
    if (!mainWindow) {
      return null;
    }

    const { card } = e;
    const evrcCard = new EvrcCard(card);

    mainWindow.webContents.send("card-inserted", { card });

    evrcCard
      .fetchEvrcInfo()
      .then((info) => {
        mainWindow.webContents.send("card-info", { card: { ...card, info } });

        return info;
      })
      .catch((error) => {
        mainWindow.webContents.send("card-error", { error });
      });
  });

  device.on("card-removed", ({ card }) => {
    if (!mainWindow) {
      return null;
    }

    mainWindow.webContents.send("card-removed", { card });
  });

  return device;
};

// function createMainMenu() {
//   const template = [
//     {
//       label: 'Tests',
//       submenu: [
//         {
//           label: 'Create new list',
//           accelerator: 'CommandOrControl+N',
//           click() {
//             mainWindow.webContents.send('kidam', {data: 'ovo je data'});
//           }
//         }
//       ]
//     }
//   ];

//   const menu = Menu.buildFromTemplate(template);
//   Menu.setApplicationMenu(menu);
// }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // createMainMenu();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can
