const { contextBridge, ipcRenderer } = require('electron/renderer')

const WINDOW_API = {
    closeApp: () => ipcRenderer.send('close'),
    minimizeApp: () => ipcRenderer.send('minimize'),
    saveHost: (pathdb) => ipcRenderer.send('saveInfoHost', pathdb),
    savePedidoOk: (token) => ipcRenderer.send('saveInfoPedidoOk', token),

    getInfoUser: (field) => ipcRenderer.invoke('getInfoUser', field)
}

contextBridge.exposeInMainWorld('api', WINDOW_API)