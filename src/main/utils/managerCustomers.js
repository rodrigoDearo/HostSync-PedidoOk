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

        if(i == customersRecords.length){
            resolve()
        }
        else{
            let customer = {
                "codigo": record.ID_CLIENTE,
                "telefone": record.FONE,
                "observacao": record.OBS,
                "endereco": {
                        "uf": record.UF,
                        "cidade": record.MUNICIPIO,
                        "complemento": record.COMPLEMENTO,
                        "numero": record.NUMERO,
                        "logradouro": record.LOGRADOURO, //max 30
                        "bairro": record.BAIRRO,
                        "cep": record.CEP //char SEMPRE COMPLETAR 8
                },
                "fantasia": record.CLIENTE,
                "razao_social": record.RAZ_SOCIAL,
                "cnpj_cpf": record.CPF_CNPJ, //sempre completar 11, char()
                "status": record.STATUS
            }
    
            if(record.RAZ_SOCIAL==null){
                await readingAllRecord(customersRecords, i)
                .then(() => {
                    resolve()
                })
            }
            else if((record.RAZ_SOCIAL).length==0){
                await readingAllRecord(customersRecords, i)
                .then(() => {
                    resolve()
                })
            }
            else{
                registerOrUpdateCustomer(customer)
                .then(async() => {
                    await readingAllRecord(customersRecords, i)
                    .then(() => {
                        resolve()
                    })
                })
            }
        }

    })
}


async function registerOrUpdateCustomer(customer){
    return new Promise(async (resolve, reject) => {
        let customersDB = JSON.parse(fs.readFileSync('./config/customers.json'))

        var customerAlreadyRegister = customersDB[`${customer.codigo}`] ? true : false;
        var customerIsActiveOnHost = customer.status == 'ATIVO' ? true : false;

        const functionReturnStatusOnPedOk = async () => {if(customerAlreadyRegister){ return customersDB[`${customer.codigo}`].status }else{return null}} 
        const functionReturnIdCustomerOnPedOk = async () => {if(customerAlreadyRegister){ return customersDB[`${customer.codigo}`].idPedidoOk }else{return null}}
       
        var customerIsActiveOnPedidoOK =  await functionReturnStatusOnPedOk()
        var idCustomerOnPedidoOk = await functionReturnIdCustomerOnPedOk()

        if(!customerAlreadyRegister&&customerIsActiveOnHost){
            await preparingPostCustomer(customer)
            .then(() => {
                resolve()
            })
        }else
        if(!customerAlreadyRegister&&(!customerIsActiveOnHost)){
            resolve()
        }else
        if(customerAlreadyRegister&&customerIsActiveOnHost){
            if(customerIsActiveOnPedidoOK){
                resolve()
               /* await preparingUpdateCustomer(customer, idCustomerOnPedidoOk)
                .then(() => {
                    resolve()
                })*/
            }
            else{
                await preparingUndeleteCustomer(idCustomerOnPedidoOk, customer.codigo)
                .then(() => {
                    resolve()
                })
            }
        }else
        if(customerAlreadyRegister&&(!customerIsActiveOnHost)){
            if(customerIsActiveOnPedidoOK){
                await preparingDeleteCustomer(idCustomerOnPedidoOk, customer.codigo)
                .then(() => {
                    resolve()
                })
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
