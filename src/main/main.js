const { app, BrowserWindow } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    movable: false,
    resizable: false,
    autoHideMenuBar: true,
    frame: false
  })

  win.loadFile('../renderer/login.html')
}

app.whenReady().then(() => {
  createWindow()
})