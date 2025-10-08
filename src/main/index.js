const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('node:path')
const fs = require('fs')

const { saveInfos, returnValueFromJson } = require('./utils/manageInfoUser.js')
const { createDependencies, limparTabela } = require('./utils/dependenciesFDB.js')
const { copyJsonFilesToUserData, returnConfigToAccessDB, gravarLog, deleteErrorsRecords, registerProductInDatabase, registerCustomerInDatabase } = require('./utils/auxFunctions.js')
const { requireAllProducts } = require('./utils/managerProducts.js')
const { requireAllCustomers } = require('./utils/managerCustomers.js')
const { readNewRecords } = require('./utils/managerHostTableNotify.js')
const { managementRequestsSales } = require('./utils/managerSales.js')
const { preparingGetProducts, preparingGetCustomers } = require('./utils/preparingRequests.js')

const userDataPath = path.join(app.getPath('userData'), 'ConfigFiles');
const pathProducts = path.join(userDataPath, 'products.json');
const pathCustomers = path.join(userDataPath, 'customers.json');

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
    autoHideMenuBar: false,
    frame: false,
    icon: path.join(__dirname, 'img/icon.jpg')
  })

  win.loadFile(path.join(__dirname, '../renderer/index.html'))
}

app.on('window-all-closed', () => {
  app.quit()
})

app.whenReady().then(() => {
  copyJsonFilesToUserData()
  createWindow()

  const icon = path.join(__dirname, 'img/icon.png')
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
  tray.setToolTip('Hostsync - PedOk')
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

ipcMain.handle('saveInfoHost', async (events, args) => {
  events.preventDefault();
  await saveInfos('host', args)
  .then(() => {
    return
  })
})

ipcMain.handle('saveInfoPedidoOk', async (events, args) => {
  events.preventDefault();
  await saveInfos('pedidoOk', args)
  .then(() => {
    return
  })
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


ipcMain.handle('startSyncNewRegisters', async () => {
  gravarLog(' . . . Starting Sync New Registers  . . .')
  var config;

    await returnConfigToAccessDB()
    .then(async (response) => {
      config = response

      await deleteErrorsRecords()

      await managementRequestsSales(config)
      .then(async () => {
        await limparTabela(config)
      })
      .then(async () => {
        setInterval(async () => {
          await readNewRecords(config)
          .then(async () => {
              await managementRequestsSales(config)
          })
          .then(() => {
            gravarLog('REALIZADO A LEITURA PERIODICA DA TABELA DE NOTIFICACOES E DAS VENDAS')
          })
          }, 600000)
      })
    })
    
})


ipcMain.handle('startAlignProductAndCustomerssDatabase', async () => {
  gravarLog(' . . . Starting Align Products Database  . . .')
  let productsDB = JSON.parse(fs.readFileSync(pathProducts))
  let customersDB = JSON.parse(fs.readFileSync(pathCustomers))
    
  await alignProductsDatabase(0, productsDB)
  .then((productsJSON) => {
    fs.writeFileSync(pathProducts, JSON.stringify(productsJSON), 'utf-8');
  })
  .then(async () => {
    return await alignCustomersDatabase(0, customersDB)
  })
  .then((customersJSON) => {
    fs.writeFileSync(pathCustomers, JSON.stringify(customersJSON), 'utf-8');
  })
})


async function alignProductsDatabase(page, productsDB){
  return new Promise(async (resolve, reject) => {

    page++  

    console.log('Lendo pagina ' + page)
    await preparingGetProducts(page)
    .then(async (response) => {

      let products = response.data.produtos;

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      for (const produto of products) {
        await registerProductInDatabase(produto.codigo, produto.id, produto.excluido, productsDB);
        await delay(100);
      }

      if (response.data.href_proxima_pagina == null) {
        resolve(productsDB);
      } else {
        await delay(3000);
        await alignProductsDatabase(page, productsDB)
        .then((response) => {
          resolve(response)
        })
        .catch(reject);
      }

    })
    .catch(reject);

  })
}


async function alignCustomersDatabase(page, customersDB){
  return new Promise(async (resolve, reject) => {

    page++  

    console.log('Lendo pagina ' + page)
    await preparingGetCustomers(page)
    .then(async (response) => {

      let customers = response.data.clientes;

      const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

      for (const customer of customers) {
        await registerCustomerInDatabase(customer.codigo, customer.id, customer.excluido, customersDB);
        await delay(100);
      }

      if (response.data.href_proxima_pagina == null) {
        resolve(customersDB);
      } else {
        await delay(3000);
        await alignCustomersDatabase(page, customersDB)
        .then((response) => {
          resolve(response)
        })
        .catch(reject);
      }

    })
    .catch(reject);

  })
}


async function mainProcess(){
  return new Promise(async (resolve, reject) => {
    var config;

    await returnConfigToAccessDB()
    .then(async (response) => {
      config = response;
      await deleteErrorsRecords()
      let mensageReturn = await createDependencies(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
    })
    .then(async () => {
      let mensageReturn = await limparTabela(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
    })
    .then(async () => {
      let mensageReturn = await requireAllProducts(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
    })
    .then(async () => {
      let mensageReturn = await requireAllCustomers(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
    }) 
    .then(async () => {
        await managementRequestsSales(config)
    })
    .then(async () => {
      setInterval(async () => {
        await readNewRecords(config)
        .then(async () => {
            await managementRequestsSales(config)
        })
        .then(() => {
          gravarLog('---------------------------------------------------------------------')
          gravarLog('REALIZADO A LEITURA PERIODICA DA TABELA DE NOTIFICACOES E DAS VENDAS')
          gravarLog('---------------------------------------------------------------------')
        })
      
      }, 600000);
    })
  })
}


/*

ARRUMAR POP UP E FAZER COMO PROMISE O IPC MAIN (MUDAR PRA HANDLE)
MELHORAR TELA INICIAL


*/ 