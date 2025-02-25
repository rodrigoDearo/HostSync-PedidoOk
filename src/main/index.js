const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const path = require('node:path')

const { saveInfos, returnValueFromJson } = require('./utils/manageInfoUser.js')
const { createDependencies, limparTabela } = require('./utils/dependenciesFDB.js')
const { returnConfigToAccessDB, gravarLog } = require('./utils/auxFunctions.js')
const { requireAllProducts } = require('./utils/managerProducts.js')
const { requireAllCustomers } = require('./utils/managerCustomers.js')

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
      let mensageReturn = await createDependencies(config)
      if(mensageReturn.code == 500){
        reject(mensageReturn)
      }
      return config
    })
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
    }) 
  })
}


/*

LAST_IDPARCEIRO
LAST_REQUEST 

LIGA GERADOR:

LIMPA TABELA NOTIFICAÇÃO

PEGA TABELA PRODUTOS:
PRODUTO EXISTE?
ATUALIZA
PRODUTO NÃO EXISTE?
CADASTRA

PEGA TABELA CLIENTE
CLIENTE EXISTE?
ATUALIZA
CLIENTE NÃO EXISTE?
CADASTRA

REQUISITA VENDAS A PARTIR DO ULTIMA LAST_REQUEST
LE TODAS AS VENDAS <============================ )
VENDA EXISTE?				                          	||
ATUALIZA			                              		||
VENDA NÃO EXISTE? 			                       	||
CADASTRA				      	                        ||
TEM MAIS PAG?				      	                    ||
REQUISITA VENDAS A PARTIR DA NOVA PROXIMA PAG _	||
NÃO TEM MAIS VENDAS?
ATUALIZA LAST_REQUEST

AGUARDA 5 MINUTOS PARA INICIAR LEITURA DA TABELA NOTIFICAÇÕES
DEPOIS DE LER TABELA NOTIFICAÇÕES E CADASTRAR
AGUARDA 10 MINUTOS PARA INICIAR LEITURA DAS NOVAS VENDAS

CRIAR UM TRATATAMENTO DE ERROS E TACAR EM TODOS OS REQUESTS
AJEITAR ENV ARQUIVO
ENVIAR ERROS PRO LOG
VER OQ VAI NO LOG
ENVIAR ERROS COMO POP UP
ARRUMAR POP UP E FAZER COMO PROMISE O IPC MAIN (MUDAR PRA HANDLE)
CASO DE ERRO NA REQUISIÇÃO POR CAUSA DO ID PARCEIRO APENAS ADICIONAR MAIS UM NO ID PARCEIRO E TENTAR DNV, CASO CONTRARIO ANUNCIAR NO LOG MOTIVO
MELHORAR TELA INICIAL

SOBRE TABELA NOTIFICACAO
- CRIAR FUNÇÃO QUE PEGA REGISTROS DA TABELA
- LE UM POR UM
- SE PRODUTO LER O REGISTRO NA TABELA PRODUTOS E MANDA PRO MANAGERPRODUCT
- SE CLIENTE LER O REGISTRO NA TABELA CLIENTES E MANDA PRO MANAGERCUSTOMER
- SE DER ERRO EM ALGUM ANUNCIAR NO LOG E NÃO DELETAR O REGISTRO
 
SOBRE AS VENDAS
- CRIAR FUNÇÃO QUE CADASTRA A VENDA COM BASE NAS INFO
- CRIAR FUNÇAO QUE TRABALHA COM OS REQUEST BASEADO NO ULTIMO REQUEST FEITO
- VERIFICA VENDA POR VENDA E VERIFICA ATE HREF_PAGINA SER IGUAL NULL
- SEMPRE ADICIONAR UM NO ID_PARCEIRO

*/ 