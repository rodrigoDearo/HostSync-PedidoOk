const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('node:path')

const { saveInfos, returnValueFromJson } = require('./utils/manageInfoUser.js')
const { createDependencies } = require('./utils/dependenciesFDB.js')
const { returnConfigToAccessDB } = require('./utils/auxFunctions.js')


var win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 650,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'ipc/preload.js')
    },
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    icon: path.join(__dirname, 'img/icon.jpg')
  })

  win.loadFile('../renderer/index.html')
}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(() => {
  createWindow()

  const icon = path.join(__dirname, 'img/icon.jpg')
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Abrir', click: function(){
      win.show()
    }},
    { label: 'Fechar', click: function(){
      app.quit() 
    }}
  ])
  
  tray.setContextMenu(contextMenu)
  tray.setToolTip('Hostsync')
})



// IPC

ipcMain.on('close', (events) => {
  events.preventDefault();
  app.quit()
})

ipcMain.on('minimize', (events) => {
  events.preventDefault();
  win.hide();
})

ipcMain.on('saveInfoHost', (events, args) => {
  events.preventDefault();
  saveInfos('host', args)
})

ipcMain.on('saveInfoPedidoOk', (events, args) => {
  events.preventDefault();
  saveInfos('pedidoOk', args)
})


ipcMain.handle('getInfoUser', async (events, args) => {
  const valueField = await returnValueFromJson(args)
  return valueField
})


ipcMain.handle('startProgram', async () => {
  await mainProcess()
  .then((response) => {
    return response
  })
})

async function mainProcess(){
  return new Promise(async (resolve, reject) => {
    await returnConfigToAccessDB()
    .then(async (config) => {
      await createDependencies(config)
      .then(response => {
        resolve(response)
      })
    })
  })
}


