const fs = require('fs')
const path = require('node:path')

const { returnInfo } = require('../envManager');
const { returnValueFromJson } = require('./manageInfoUser');

async function returnConfigToAccessDB(){
    return new Promise(async (resolve, reject) => {
        await returnValueFromJson('pathdbhost')
        .then(async (response) => {
            config = {
                host: 'localhost',
                port: 3050,
                database: `${response}/HOST.FDB`,
                charset: 'UTF8',
                encoding: 'UTF8'
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
  


async function incrementidRequestPost(){
  return new Promise(async (resolve, reject) => {
    const configApp = JSON.parse(fs.readFileSync('./config/configApp.json', 'utf-8'));
    configApp.pedidoOk.idparceiro++;
    fs.writeFileSync('./config/configApp.json', JSON.stringify(configApp))

    resolve()
  })
}


async function errorHandling(){

}


async function succesHandling(){
// considerar colocar função incrementiRequestPost aqw tmb com switch case
}

module.exports = {
    returnConfigToAccessDB,
    incrementIdParceiro,
    gravarLog
}
