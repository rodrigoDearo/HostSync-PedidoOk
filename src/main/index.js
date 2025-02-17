const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'ipc/preload.js')
    }
    /*movable: false,
    resizable: false,
    autoHideMenuBar: true,
    frame: false*/
  })

  win.loadFile('../renderer/index.html')
}

app.whenReady().then(() => {
  createWindow()
})

ipcMain.on('greet', (events, args) => {
  console.log(args)
})