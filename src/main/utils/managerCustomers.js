const conexao = require('node-firebird');
const fs = require ('fs')

const { preparingPostCustomer , preparingUpdateCustomer, preparingDeleteCustomer, preparingUndeleteCustomer } = require('./preparingRequests.js');
const { undeleteCustomer } = require('./requestsPedidoOk.js');

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
    return new Promise(async (resolve, reject) => {
        let customersDB = JSON.parse(fs.readFileSync('../../../config/customer.json'))

        var customerAlreadyRegister = customersDB[`${customer.id_cliente}`] ? true : false;
        var customerIsActiveOnHost = customer.status == 'ATIVO' ? true : false;

        const functionReturnStatusOnPedOk = () => {if(customerAlreadyRegister){ return customersDB[`${customer.id_cliente}`].status }else{return null}} 
        const functionReturnIdCustomerOnPedOk = () => {if(customerAlreadyRegister){ return customersDB[`${customer.id_cliente}`].idPedidoOk }else{return null}}

        var customerIsActiveOnPedidoOK =  functionReturnStatusOnPedOk()
        var idCustomerOnPedidoOk = functionReturnIdCustomerOnPedOk()

        if(!customerAlreadyRegister&&customerIsActiveOnHost){
            await preparingPostCustomer(customer)
        }else
        if(!customerAlreadyRegister&&(!customerIsActiveOnHost)){
            resolve()
        }else
        if(customerAlreadyRegister&&customerIsActiveOnHost){
            if(customerIsActiveOnPedidoOK){
                await preparingUpdateCustomer(customer, idCustomerOnPedidoOk)
            }
            else{
                await preparingUndeleteCustomer(idCustomerOnPedidoOk)
            }
        }else
        if(customerAlreadyRegister&&(!customerIsActiveOnHost)){
            if(customerIsActiveOnPedidoOK){
                await preparingDeleteCustomer(idCustomerOnPedidoOk)
            }
            else{
                resolve()
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
