const { contextBridge, ipcRenderer } = require('electron/renderer')

const WINDOW_API = {
    closeApp: () => ipcRenderer.send('close'),
    minimizeApp: () => ipcRenderer.send('minimize'),

    saveHost: (pathdb) => ipcRenderer.invoke('saveInfoHost', pathdb),
    savePedidoOk: (token) => ipcRenderer.invoke('saveInfoPedidoOk', token),
    getInfoUser: (field) => ipcRenderer.invoke('getInfoUser', field),
    start: () => ipcRenderer.invoke('startProgram'),
    alignProducts: () => ipcRenderer.invoke('startAlignProductsDatabase')
}

contextBridge.exposeInMainWorld('api', WINDOW_API)