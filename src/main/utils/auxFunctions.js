const fs = require('fs')
const path = require('node:path')

const { returnInfo } = require('../envManager');
const { returnValueFromJson } = require('./manageInfoUser');
const { error } = require('node:console');

async function returnConfigToAccessDB(){
    return new Promise(async (resolve, reject) => {
        await returnValueFromJson('pathdbhost')
        .then(async (response) => {
            config = {
                host: 'localhost',
                port: 3050,
                database: `${response}/HOST.FDB`,
                charset: 'UTF8'
            }
        })
        .then(async () => {
            let envInfo = await returnInfo('user_database')
            config.user = `${envInfo}`;
        })
        .then(async () => {
            let envInfo = await returnInfo('password_database')
            config.password = `${envInfo}`;
        })
        .finally(() => {
            resolve(config)
        })
    })
}


function gravarLog(mensagem) {
    if (!fs.existsSync('../logs')) {
      fs.mkdirSync('../logs');
    }
    const data = new Date();
    data.setHours(data.getHours() - 3);
    const dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
    const logMessage = `[${data.toISOString()}]: ${mensagem}\n`;
    const logFileName = `../../../logs/log_${dataFormatada}.txt`;
    const logFilePath = path.join(__dirname, logFileName);
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Erro ao gravar o log:', err);
      } else {
        console.log('Log gravado com sucesso!');
      }
    });
  }
  


async function incrementIdRequestPost(){
  return new Promise(async (resolve, reject) => {
    const configApp = JSON.parse(fs.readFileSync('./config/configApp.json', 'utf-8'));
    configApp.pedidoOk.idRequestPost++;
    fs.writeFileSync('./config/configApp.json', JSON.stringify(configApp), 'utf-8')
    resolve()
  })
}



async function succesHandlingRequests(destiny, resource, idHost, idPedOk){
  return new Promise(async (resolve, reject) => {

    if(destiny=="product"){
      let productsDB = JSON.parse(fs.readFileSync('./config/products.json'))

      switch (resource) {
        case "post":
          productsDB[`${idHost}`] = {
            "idPedidoOk": `${idPedOk}`,
            "status": "ATIVO"
          }
          await incrementIdRequestPost();
          break;

        case "update":
          
          break;

        case "delete":
          productsDB[`${idHost}`].status = "INATIVO";
          break;

        case "undelete":
          productsDB[`${idHost}`].status = "ATIVO";
          break;
      }

      fs.writeFileSync('./config/products.json', JSON.stringify(productsDB), 'utf-8')
      resolve()
    }else
    if(destiny=="customer"){
      let customersDB = JSON.parse(fs.readFileSync('./config/customers.json'))

      switch (resource) {
        case "post":
          customersDB[`${idHost}`] = {
            "idPedidoOk": `${idPedOk}`,
            "status": "ATIVO"
          }
          await incrementIdRequestPost();
          break;

          case "update":
          
          break;

        case "delete":
          customersDB[`${idHost}`].status = "INATIVO";
          break;

        case "undelete":
          customersDB[`${idHost}`].status = "ATIVO";
          break;
      }

      fs.writeFileSync('./config/customers.json', JSON.stringify(customersDB), 'utf-8')
      gravarLog('Gravado registro no banco de ' + destiny);
      resolve()
    }else
    if(destiny=="sales"){
      let configDB = JSON.parse(fs.readFileSync('./config/configApp.json'))
      // ATUALIZAR DATA REQUEST

      fs.writeFileSync('./config/configApp.json', JSON.stringify(configDB), 'utf-8')
      
    }

  })
}



async function errorHandlingRequest(destiny, resource, Identifier, idPedidoOk, errors, body){
  return new Promise(async (resolve, reject) => {
      let errorsDB = JSON.parse(fs.readFileSync('./config/errorsDB.json'))

      const data = new Date();
      data.setHours(data.getHours() - 3);
      const dataFormatada = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;

      errorsDB[destiny][Identifier] = {
        "typeRequest": resource,
        "idPedidoOk": idPedidoOk,
        "timeRequest": dataFormatada,
        "returnRequest": errors,
        "bodyRequest": body
      }

      fs.writeFileSync('./config/errorsDB.json', JSON.stringify(errorsDB), 'utf-8')
      gravarLog('Gravado registro no banco de erros')
      resolve()
  })
}



module.exports = {
    returnConfigToAccessDB,
    incrementIdRequestPost,
    succesHandlingRequests,
    errorHandlingRequest,
    gravarLog
}
