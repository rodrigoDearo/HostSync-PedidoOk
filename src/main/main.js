const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 650,
    height: 400,
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    frame: false
  })

  win.loadFile('../renderer/index.html')
}

app.whenReady().then(() => {
  createWindow()
})