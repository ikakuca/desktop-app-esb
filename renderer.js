const { ipcRenderer } = require("electron");

// ipcRenderer.on("create-list", () => {
//   document.querySelector(".createList").click();
// });

// global.pingHost = () => {
//   // ipcRenderer.sendToHost('ping')
//   console.log('radim')
// }

// ipcRenderer.addListener('kidam', (event, data) => {
//   console.log('jajjajajakidam', data)
// })


ipcRenderer.on('card-info', (e, card) => {
  global.cardData = card;
  console.log('card-info', e, card)
})