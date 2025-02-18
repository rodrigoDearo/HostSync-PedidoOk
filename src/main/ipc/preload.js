const { contextBridge, ipcRenderer } = require('electron/renderer')

const WINDOW_API = {
    closeApp: () => ipcRenderer.send('close'),
    minimizeApp: () => ipcRenderer.send('minimize'),
    saveHost: (pathdb) => ipcRenderer.send('saveInfoHost', pathdb),
    savePedidoOk: (idpartner) => ipcRenderer.send('saveInfoPedidoOk', idpartner)
}

contextBridge.exposeInMainWorld('api', WINDOW_API)