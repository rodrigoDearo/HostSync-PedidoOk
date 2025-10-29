const conexao = require('node-firebird');
const fs = require('fs');
const path = require('node:path')
const { app } = require('electron')

const { preparingGetSales } = require('./preparingRequests.js')
const { returnValueFromJson } = require('./manageInfoUser.js')
const { getActualDatetime, updateDatetimeOfLastRequest, returnCustomerIdHostFromIdPed, returnProductIdHostFromIdPed, succesHandlingRequests, gravarLog } = require('./auxFunctions.js')
const { insertOrcamento, insertItemOrcamento } = require('./insertsHostFDB.js');
const { Console } = require('console');

const userDataPath = path.join(app.getPath('userData'), 'ConfigFiles');
const pathSales = path.join(userDataPath, 'sales.json');

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

                await readingAllRecordsSales(sales, config)

                haveMorePage = nextPage == null ? false : true
            })
        }

        await updateDatetimeOfLastRequest(actualTime)
        .then(() => {
            console.log(idMov)
        })
        .then(() => {
            resolve()
        })
        .catch((error) => {
            resolve(error)
        })

    })
}


async function readingAllRecordsSales(sales, config) {
  const salesDB = JSON.parse(fs.readFileSync(pathSales));
  
  for (const saleRead of sales) {
    const idSalePedOk = saleRead.id;
    if (salesDB[idSalePedOk]) continue;

    const [year, month, day] = saleRead.emissao.split("-");
    const dateSaleFormated = `${day}.${month}.${year}`;
    const now = new Date();
    const horaVenda = `${String(now.getHours()).padStart(2, "0")}.${String(now.getMinutes()).padStart(2, "0")}.${String(now.getSeconds()).padStart(2, "0")}`;

    const dadosSale = {
      ID_USUARIO: 1,
      DATA_VENDA: dateSaleFormated,
      HORA_VENDA: horaVenda,
      DESCONTO: 0,
      ACRESCIMO: 0,
      VALOR_FINAL: "",
      TOTAL_PRODUTOS: "",
      ACRESCIMO_ITENS: 0,
      DESCONTO_ITENS: 0,
      STATUS_VENDA: "A",
      CANCELADO: "N",
      SITUACAO: "PENDENTE",
      OBS: "PEDIDOOK"
    };

    const customer = await returnCustomerInfos(saleRead.id_cliente, config);
    if (!customer) {
      console.log(`Cliente ${saleRead.id_cliente} não encontrado. Ignorando venda ${idSalePedOk}.`);
      continue;
    }

    const totalValue = await getTotalValueOfSale(saleRead.itens);
    dadosSale.VALOR_FINAL = totalValue;
    dadosSale.TOTAL_PRODUTOS = totalValue;

    try {
      await insertOrcamento(dadosSale, customer, config);
      const idOrcamentoHost = await returnIdLastOrcamento(config);
      console.log(`[idOrcamentoHost]: ${idOrcamentoHost} para venda ${idSalePedOk}`);

      await succesHandlingRequests("sale", null, idOrcamentoHost, idSalePedOk);
      await readingAllRecordsItensOfSale(saleRead.itens, idOrcamentoHost, config);

    } catch (error) {
      gravarLog(`[error insertOrcamento]: ${JSON.stringify(error)}`);
    }
  }
}




async function readingAllRecordsItensOfSale(itensList, idOrcamentoHost, config){
    return new Promise(async (resolve, reject) => {
        for(let j=0; j<itensList.length; j++){
            let productRead = itensList[j];
            let item = j+1;
            let totalItem = productRead.quantidade*productRead.preco_liquido;
            let valueTotalItemFormated = totalItem.toFixed(2).padEnd(8, "0")
    
            let product = {
                'ITEM': item,
                'ID_PRODUTO': 0,
                'ID_ORCAMENTO': idOrcamentoHost,
                'QUANTIDADE': productRead.quantidade,
                'VALOR_UNITARIO': productRead.preco_liquido,
                'VALOR_CUSTO': productRead.preco_custo,
                'VALOR_PRODUTOS': valueTotalItemFormated, 
                'TOTAL_ITEM': valueTotalItemFormated,
                'DESCONTO': 0,
                'ACRESCIMO': 0,
                'ACRESCIMO_RATEIO': 0,
                'DESCONTO_RATEIO': 0,
                'CANCELADO': 'N',
                'MOVIMENTA_ESTOQUE': 'S',
                'DESC_ACRES': '',
                'ID_GRADE_ITENS': 0,
                'VALOR_UNITARIO_APRAZO': 0,
                'TOTAL_ITEM_APRAZO': 0
            }

            await returnProductIdHostFromIdPed(productRead.id_produto)
            .then(async (response) => {
                product.ID_PRODUTO = parseInt(response);
                await insertItemOrcamento(product, config)
            })
            .then(() => {
                resolve()
            })
            
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


async function returnCustomerInfos(customerIdPedOk, config) {
  return new Promise((resolve) => {
    returnCustomerIdHostFromIdPed(customerIdPedOk)
      .then((response) => {
        conexao.attach(config, (err, db) => {
          if (err) return resolve(null);
          if (!/^\d+$/.test(String(response).trim())) {
            db.detach();
            return resolve(null);
          }

          const sql = `SELECT id_cliente, cliente, logradouro, numero, cep, fone, cpf_cnpj, municipio, uf
                       FROM CLIENTES WHERE ID_CLIENTE=${response}`;
          db.query(sql, (err, result) => {
            if (err || !result?.length) {
              db.detach();
              return resolve(null);
            }

            const c = result[0];
            const endereco = `${c.LOGRADOURO || ""}, ${c.NUMERO || ""} - ${c.CEP || ""}`;
            const customer = { ...c, ENDERECO: endereco };
            delete customer.LOGRADOURO;
            delete customer.NUMERO;
            delete customer.CEP;
            db.detach();
            resolve(customer);
          });
        });
      })
      .catch(() => resolve(null));
  });
}



async function returnIdLastOrcamento(config){
    return new Promise(async (resolve, reject) => {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;

            let codigoSQL = `SELECT MAX(ID) AS ULTIMO_ID FROM ORCAMENTO;`;

            db.query(codigoSQL, async function (err, result){
                if (err)
                    reject({code: 500, msg:'ERRO AO CONSULTAR ID_ORCAMENTO NA TABELA DE ORCAMENTOS, CONTATAR SUPORTE TECNICO'});
                
                resolve(result[0].ULTIMO_ID);
            });
          
            db.detach();
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

        resolve(valueTotal.toFixed(2).padEnd(8, "0"))
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