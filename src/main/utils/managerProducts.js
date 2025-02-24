const conexao = require('node-firebird');
const fs = require ('fs')

const { preparingPostProduct } = require('./preparingRequest.js')

async function requireAllProducts(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT id_produto, obs, barras, PRODUTOS_GRUPO.grupo, produto, estoque, PRODUTOS_MARCA.marca, valor_venda, custo FROM PRODUTOS LEFT JOIN PRODUTOS_GRUPO on PRODUTOS.grupo = PRODUTOS_GRUPO.id LEFT JOIN PRODUTOS_MARCA on PRODUTOS.marca = PRODUTOS_MARCA.id`;
  
            db.query(codigoSQL, async function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA PRODUTOS, CONTATAR SUPORTE TECNICO'});
                
                for (const record of result) {
                    let product = {
                        "codigo": record.ID_PRODUTO,
                        "observacao": record.OBS,
                        "codigo_barra": record.BARRAS,
                        "categoria": record.GRUPO,
                        "nome": record.PRODUTO,
                        "estoque": record.ESTOQUE,
                        "marca": record.MARCA,
                        "venda": record.VALOR_VENDA,
                        "custo": record.CUSTO,
                        "embalagem": null
                    }

                    await preparingPostProduct(product)
                }
                
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
