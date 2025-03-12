const conexao = require('node-firebird');

const { preparingGetSales } = require('./preparingRequests.js')
const { returnValueFromJson } = require('./manageInfoUser.js')
const { getActualDatetime, updateDatetimeOfLastRequest, returnCustomerIdHostFromIdPed, succesHandlingRequests } = require('./auxFunctions.js')
const { insertOrcamento } = require('./insertsHostFDB.js')

async function managementRequestsSales(config){
    return new Promise(async (resolve, reject) => {

        let actualTime = await getActualDatetime();
        let datetimeToRequest = await managementParameterLastRequest();
        let idMov;
        let haveMorePage = true;
        let page = 0;
     

        while (haveMorePage) {
            page++;
            await preparingGetSales(datetimeToRequest, page)
            .then(async (response) => {
                let sales = response[0];
                let nextPage = response[1];
                let products = sales.itens;

                await readingAllRecordsSales(sales, config)
                .then(async () => {
                    await readingAllRecordsItensOfSale(products, config)
                })

                haveMorePage = nextPage == null ? false : true
            })
        }

        await updateDatetimeOfLastRequest(actualTime)
        .then(() => {
            console.log(idMov)
        })
        .catch((error) => {
            resolve(error)
        })

    })
}


async function readingAllRecordsSales(sales, config){
    return new Promise(async (resolve, reject) => {
        const now = new Date();

        for(let i=0; i<sales.length; i++){
            let saleRead = sales[i];
            let customer;
            let dadosSale;
            let idSalePedOk = saleRead.id

            const [yearSale, monthSale, daySale] = (saleRead.emissao).split("-");
            let dateSaleFormated = `${daySale}-${monthSale}-${yearSale}`;

            let actualTime = String(now.getHours()).padStart(2, '0') + "." +
            String(now.getMinutes()).padStart(2, '0') + "." +
            String(now.getSeconds()).padStart(2, '0')

            dadosSale = {
                'ID_USUARIO': 1,
                'DATA_VENDA': dateSaleFormated,
                'HORA_VENDA': actualTime,
                'DESCONTO': 0,
                'ACRESCIMO': 0,
                'VALOR_FINAL': '',
                'TOTAL_PRODUTOS': '',
                'ACRESCIMO_ITENS': 0,
                'DESCONTO_ITENS': 0,
                'STATUS_VENDA': 'A',
                'CANCELADO': 'N',
                'SITUACAO': 'PENDENTE',
                'OBS': 'PEDIDOOK'
            };

            await returnCustomerInfos(saleRead.id_cliente)
            .then(async (response) => {
                customer = response;
                return await getTotalValueOfSale(saleRead.itens)
            })
            .then(async (response) => {
                dadosSale.VALOR_FINAL = `${response}`;
                dadosSale.TOTAL_PRODUTOS = `${response}`;
            })
            .then(async () => {
                await insertOrcamento(dadosSale, customer, config)
                .then(async (response) => {
                    await succesHandlingRequests('sale', null, response, idSalePedOk)
                })
            })
            .then(() => {
                resolve()
            })

        }

    })
}


async function readingAllRecordsItensOfSale(itensList, config){
    return new Promise(async (resolve, reject) => {
        for(let j=0; j<itensList.length; j++){
            let productRead = itensList[j];

            
        }
    })
}


async function managementParameterLastRequest(){
    return new Promise(async (resolve, reject)=> {
        await returnValueFromJson('lastrequest')
        .then((response) => {
            if(response.length == 0){
                resolve('2000-01-01T12:00:00')
            }
            else{
               resolve(response);
            }
        })
    }) 
}


async function returnCustomerInfos(customerIdPedOk){
    return new Promise(async (resolve, reject) => {
        await returnCustomerIdHostFromIdPed(customerIdPedOk)
        .then(async (response) => {
            conexao.attach(config, function (err, db){
                if (err)
                    throw err;
    
                let codigoSQL = `SELECT id_cliente, cliente, logradouro, numero, cep, fone, cpf_cnpj, municipio FROM CLIENTES WHERE ID_CLIENTE=${response}`;
    
                db.query(codigoSQL, async function (err, result){
                    if (err)
                        reject({code: 500, msg:'ERRO AO CONSULTAR CLIENTE NA TABELA DE CLIENTES, CONTATAR SUPORTE TECNICO'});
                    
                    let customer = result[0];

                    if(customer.LOGRADOURO==null){
                        customer.LOGRADOURO = "";
                    }

                    if(customer.NUMERO==null){
                        customer.NUMERO = "";
                    }

                    if(customer.CEP==null){
                        customer.CEP = "";
                    }

                    customer.ENDERECO_CLIENTE = customer.LOGRADOURO + ', ' + customer.NUMERO + ' - ' + customer.CEP;
                    delete customer.LOGRADOURO;
                    delete customer.NUMERO;
                    delete customer.CEP;

                    resolve(customer)
                });
              
                db.detach();
            })
        })
    })
}


async function getTotalValueOfSale(productsList){
    return new Promise(async (resolve, reject) => {
        let valueTotal = 0;

        for(let k=0; k<productsList.length; k++){
            let productRead = productsList[k];
            let valueProductOnSale = (productRead.preco_liquido*productRead.quantidade);

            valueTotal+=valueProductOnSale;
        }

        resolve(valueTotal.toFixed(2).replace(".", ",").padEnd(8, "0"))
    })
}


module.exports = {
    managementRequestsSales
}




/*
async function returnIdMovimento(config){
    return new Promise(async (resolve, reject) => {
        conexao.attach(config, async function (err, db){
            if (err)
                throw err;
            
            let biggestId = 0
            let codigoSQL = `SELECT id FROM MOVIMENTO WHERE STATUS_MOVIMENTO='A'`;
             
            db.query(codigoSQL, async function (err, result){
                if (err)
                    reject({code: 500, msg:'ERRO AO CONSULTAR TABELA DE MOVIMENTOS, CONTATAR SUPORTE TECNICO'});
                
                if (result.length>0){
                    for(let i=0; i<result.length; i++){
                        if(result[i].ID>biggestId){
                                biggestId = result[i].ID;
                        }
                    }
    
                    resolve(biggestId)
                }
                else{
                    resolve(null)
                }
            });
            
            db.detach();

        })
    })
}


const getIdMov = async () => {
            idMov = await returnIdMovimento(config)
            if(idMov==null){
                await insertMovimento(config)
                .then(async () => {
                    await returnIdMovimento(config)
                    .then(response => {
                        idMov = response
                    })
                })
            }
        }

        await getIdMov()

*/