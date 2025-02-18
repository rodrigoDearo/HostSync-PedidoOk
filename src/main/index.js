const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('node:path')

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

// IPC CONTROL

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

ipcMain.on('close', (events) => {
  events.preventDefault();
  app.quit()
})

ipcMain.on('minimize', (events) => {
  events.preventDefault();
  win.hide();
})