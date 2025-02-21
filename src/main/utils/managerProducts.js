const conexao = require('node-firebird');

async function requireAllProducts(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT id_produto, produto FROM PRODUTOS`;
  
            db.query(codigoSQL, function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA PRODUTOS, CONTATAR SUPORTE TECNICO'});
  
                console.log(result);
            });
          
            db.detach();

            resolve({code: 200, msg:'PRODUTOS CONSULTADOS COM SUCESSO'});
        });
  
      } catch (error) {
        reject(error);
      }
    })
}

module.exports = {
    requireAllProducts
}
