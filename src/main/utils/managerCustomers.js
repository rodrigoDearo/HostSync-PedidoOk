const conexao = require('node-firebird');
const fs = require ('fs')

const { postCustomer, putCustomer, deleteCustomer, undeleteCustomer } = require('./requestsPedidoOk')

async function requireAllCustomers(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT id_cliente, cliente, status FROM CLIENTES`;
  
            db.query(codigoSQL, function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA CLIENTES, CONTATAR SUPORTE TECNICO'});
  
                console.log(result);
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
    return new Promise(async (resaolve, reject) => {
        let customersDB = JSON.parse(fs.readFileSync('../../../config/customer.json'))

        var customerAlreadyRegister = customersDB[`${customer.id_cliente}`] ? true : false;
        var customerIsActiveOnHost = customer.status == 'ATIVO' ? true : false;
        var customerIsActiveOnPedidoOK = () => {
            if(customerAlreadyRegister){ return customersDB[`${customer.id_cliente}`].status }else{return null}
        } 
        
        if(!customerAlreadyRegister&&customerIsActiveOnHost){

        }else
        if(!customerAlreadyRegister&&(!customerIsActiveOnHost)){

        }else
        if(customerAlreadyRegister&&customerIsActiveOnHost){
            if(customerIsActiveOnPedidoOK){

            }
            else{

            }
        }else
        if(customerAlreadyRegister&&(!customerIsActiveOnHost)){
            if(customerIsActiveOnPedidoOK){

            }
            else{
                
            }
        }
        
    })
}


/*ESCOPO DE CADASTRO-DELETE-UPDATE 

IF CLIENTE NAO CADASTRADO E ATIVO NO HOST = CADASTRAR

IF CLIENTE NAO CADASTRADO E INATIVO NO HOST = NADA

IF CLIENTE CADASTRADO E ATIVO NO HOST = { 
    SE ESTIVER ATIVO NO PEDIDOOK = ATUALIZAR
    SE ESTIVER INATIVO NO PEDIDO OK = UNDELETE
}

IF CLIENTE CADASTRADO E INATIVO NO HOST { 
    SE ESTIVER ATIVO NO PEDIDO OK = DELETE
    SE ESTIVER INATIVO NO PEDIDO OK = NADA
}

*/


module.exports = {
    requireAllCustomers
}
