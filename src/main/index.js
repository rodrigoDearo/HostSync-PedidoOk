const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('node:path')

const { saveInfos, returnValueFromJson } = require('./utils/manageInfoUser.js')
const { createDependencies, limparTabela } = require('./utils/dependenciesFDB.js')
const { returnConfigToAccessDB, gravarLog, deleteErrorsRecords } = require('./utils/auxFunctions.js')
const { requireAllProducts } = require('./utils/managerProducts.js')
const { requireAllCustomers } = require('./utils/managerCustomers.js')
const { readNewRecords } = require('./utils/managerHostTableNotify.js')
const { managementRequestsSales } = require('./utils/managerSales.js')

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
    { label: 'Minimizar', click: function(){
      win.hide();
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
  gravarLog(' . . . Starting HostSync  . . .')

  await mainProcess()
  .then((response) => {
    return response
  })
})

async function mainProcess(){
  return new Promise(async (resolve, reject) => {
    await returnConfigToAccessDB()
    .then(async (config) => {
      await deleteErrorsRecords()
      let mensageReturn = await createDependencies(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    })/*
    .then(async (config) => {
      let mensageReturn = await limparTabela(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    })
    .then(async (config) => {
      let mensageReturn = await requireAllProducts(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    })
    .then(async (config) => {
      let mensageReturn = await requireAllCustomers(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    }) 
    .then(async (config) => {
      let mensageReturn = await readNewRecords(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    }) */
    .then(async (config) => {
      let mensageReturn = await managementRequestsSales(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      console.log('to aqui')
      return config
    })
  })
}


/*


AGUARDA 5 MINUTOS PARA INICIAR LEITURA DA TABELA NOTIFICAÇÕES
DEPOIS DE LER TABELA NOTIFICAÇÕES E CADASTRAR
AGUARDA 10 MINUTOS PARA INICIAR LEITURA DAS NOVAS VENDAS

AJEITAR ENV ARQUIVO
ARRUMAR POP UP E FAZER COMO PROMISE O IPC MAIN (MUDAR PRA HANDLE)
MELHORAR TELA INICIAL


*/ 