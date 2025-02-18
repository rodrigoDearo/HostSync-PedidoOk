const util = require('util');
const fs = require('fs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


async function saveInfos(systemSave, infos) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await readFileAsync('./config/configApp.json', 'utf-8');
      let dadosApp = JSON.parse(data);

      switch (systemSave) {
        case 'host':
          dadosApp.host.pathdb = infos;
          break;

        case 'pedidoOk':
          dadosApp.pedidoOk.idpartner = infos;
          break;
      }

      let novoJson = JSON.stringify(dadosApp, null, 2);

      await writeFileAsync('./config/configApp.json', novoJson, 'utf-8');
      resolve();
    } catch (err) {
      reject('Erro ao atualizar dados');
      console.error('Erro ao processar o arquivo JSON:', err);
    }
  });
}


function returnInfos() {
  return new Promise((resolve, reject) => {
    fs.readFile('./config/configApp.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        let dados = JSON.parse(data);
        var dadosRetorno = {
          "pathdbhost": dados.host.pathdb,
          "idpartnerpedidook": dados.pedidoOk.idpartner
        };
        resolve(dadosRetorno);
      }
    });
  });
}


async function returnValueFromJson(campo){
  return new Promise((resolve, reject) => {
    fs.readFile('./config/configApp.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        let dados = JSON.parse(data);
        switch (campo) {
          case 'pathdbhost':
            resolve(dados.host.pathdb);
            break;
          
          case 'idpartnerpedidook':
            resolve(dados.pedidoOk.idpartner);
            break;
        }
      }
    });
  });
}


module.exports = { 
    saveInfos,
    returnInfos,
    returnValueFromJson
}