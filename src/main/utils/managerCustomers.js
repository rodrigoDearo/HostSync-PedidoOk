const conexao = require('node-firebird');
const fs = requrie ('fs')

async function requireAllCustomers(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT id_cliente, cliente FROM CLIENTES`;
  
            db.query(codigoSQL, function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA CLIENTES, CONTATAR SUPORTE TECNICO'});
  
                resolve(result);
            });
          
            db.detach();

            resolve({code: 200, msg:'CLIENTES CONSULTADOS COM SUCESSO'});
        });
  
      } catch (error) {
        reject(error);
      }
    })
}


async function registerOrUpdateCustomer(customer){
    
}



module.exports = {
    requireAllCustomers
}
