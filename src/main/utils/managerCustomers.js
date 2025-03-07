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
  
            let codigoSQL = `SELECT id_cliente, fone, obs, uf, municipio, complemento, numero, logradouro, bairro, cep, cliente, raz_social, cpf_cnpj, status FROM CLIENTES`;
  
            db.query(codigoSQL, async function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA CLIENTES, CONTATAR SUPORTE TECNICO'});

                console.log(result.length)
                await readingAllRecord(result, 0)
                .then(() => {
                    resolve({code: 200, msg:'CLIENTES CONSULTADOS COM SUCESSO'});
                })

            });
        
        db.detach();
        });
  
      } catch (error) {
        reject(error);
      }
    })
}


async function readingAllRecord(customersRecords, index){
    return new Promise(async (resolve, reject) => {
        let record = customersRecords[index]
        let i = index + 1;

        let customer = {
            "codigo": record.ID_CLIENTE,
            "telefone": record.FONE,
            "observacao": record.OBS,
            "endereco": {
                    "uf": record.UF,
                    "cidade": record.MUNICIPIO,
                    "complemento": record.COMPLEMENTO,
                    "numero": record.NUMERO,
                    "logradouro": record.LOGRADOURO,
                    "bairro": record.BAIRRO,
                    "cep": record.CEP
            },
            "fantasia": record.CLIENTE,
            "razao_social": record.RAZ_SOCIAL,
            "cnpj_cpf": record.CPF_CNPJ,
            "status": record.STATUS
        }
        
        if(i == customersRecords.length){
            resolve()
        }

        registerOrUpdateCustomer(customer)
        .then(async() => {
            await readingAllRecord(customersRecords, i)
            .then(() => {
                resolve()
            })
        })


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


module.exports = {
    requireAllCustomers
}
