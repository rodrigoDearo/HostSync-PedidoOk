const conexao = require('node-firebird');
const fs = require ('fs')

const { preparingPostProduct , preparingUpdateProduct, preparingDeleteProduct, preparingUndeleteProduct } = require('./preparingRequests.js');

async function requireAllProducts(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT id_produto, obs, barras, PRODUTOS_GRUPO.grupo, produto, estoque, PRODUTOS_MARCA.marca, valor_venda, custo, status FROM PRODUTOS LEFT JOIN PRODUTOS_GRUPO on PRODUTOS.grupo = PRODUTOS_GRUPO.id LEFT JOIN PRODUTOS_MARCA on PRODUTOS.marca = PRODUTOS_MARCA.id`;
  
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
                        "embalagem": 0,
                        "status": record.STATUS
                    }

                    await registerOrUpdateProduct(product)
                }
                
            });
          
        // FIX IT! JUST RUN THAT CODE WHEN ALL RECORD HAD BE READ
        //  db.detach();
        //  resolve({code: 200, msg:'PRODUTOS CONSULTADOS COM SUCESSO'});
        });
  
      } catch (error) {
        reject(error);
      }
    })
}


async function registerOrUpdateProduct(product){
    return new Promise(async (resolve, reject) => {
        let productsDB = JSON.parse(fs.readFileSync('../../../config/products.json'))

        var productAlreadyRegister = productsDB[`${product.id_produto}`] ? true : false;
        var productIsActiveOnHost = product.status == 'ATIVO' ? true : false;

        const functionReturnStatusOnPedOk = () => {if(productAlreadyRegister){ return productsDB[`${product.id_produto}`].status }else{return null}}
        const functionReturnIdProductOnPedOk = () => {if(productAlreadyRegister){ return productsDB[`${product.id_produto}`].idPedidoOk }else{return null}}

        var productIsActiveOnPedidoOK =  functionReturnStatusOnPedOk()
        var idProductOnPedidoOk = functionReturnIdProductOnPedOk()
        
        if(!productAlreadyRegister&&productIsActiveOnHost){
            await preparingPostProduct(product)
        }else
        if(!productAlreadyRegister&&(!productIsActiveOnHost)){
            resolve()
        }else
        if(productAlreadyRegister&&productIsActiveOnHost){
            if(productIsActiveOnPedidoOK){
                await preparingUpdateProduct(product, idProductOnPedidoOk)
            }
            else{
                await preparingUndeleteProduct(idProductOnPedidoOk)
            }
        }else
        if(productAlreadyRegister&&(!productIsActiveOnHost)){
            if(productIsActiveOnPedidoOK){
                await preparingDeleteProduct(idProductOnPedidoOk)
            }
            else{
                resolve()
            }
        }
        
    })
}



module.exports = {
    requireAllProducts
}
