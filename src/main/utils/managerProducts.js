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



async function registerOrUpdateProduct(product){
    return new Promise(async (resaolve, reject) => {
        let productsDB = JSON.parse(fs.readFileSync('../../../config/products.json'))

        var productAlreadyRegister = productsDB[`${product.id_produto}`] ? true : false;
        var productIsActiveOnHost = product.status == 'ATIVO' ? true : false;
        var productIsActiveOnPedidoOK = () => {
            if(productAlreadyRegister){ return productsDB[`${product.id_produto}`].status }else{return null}
        } 
        
        if(!productAlreadyRegister&&productIsActiveOnHost){

        }else
        if(!productAlreadyRegister&&(!productIsActiveOnHost)){

        }else
        if(productAlreadyRegister&&productIsActiveOnHost){
            if(productIsActiveOnPedidoOK){

            }
            else{

            }
        }else
        if(productAlreadyRegister&&(!productIsActiveOnHost)){
            if(productIsActiveOnPedidoOK){

            }
            else{
                
            }
        }
        
    })
}


/*ESCOPO DE CADASTRO-DELETE-UPDATE 

IF PRODUTO NAO CADASTRADO E ATIVO NO HOST = CADASTRAR

IF PRODUTO NAO CADASTRADO E INATIVO NO HOST = NADA

IF PRODUTO CADASTRADO E ATIVO NO HOST = { 
    SE ESTIVER ATIVO NO PEDIDOOK = ATUALIZAR
    SE ESTIVER INATIVO NO PEDIDO OK = UNDELETE
}

IF PRODUTO CADASTRADO E INATIVO NO HOST { 
    SE ESTIVER ATIVO NO PEDIDO OK = DELETE
    SE ESTIVER INATIVO NO PEDIDO OK = NADA
}

*/


module.exports = {
    requireAllProducts
}
