const { contextBridge, ipcRenderer } = require('electron/renderer')

const WINDOW_API = {
    greet: (message) => ipcRenderer.send('greet', message)
}

contextBridge.exposeInMainWorld('api', WINDOW_API)