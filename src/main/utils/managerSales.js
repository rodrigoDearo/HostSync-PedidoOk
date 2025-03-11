const conexao = require('node-firebird');

const { preparingGetSales } = require('./preparingRequests.js')
const { returnValueFromJson } = require('./manageInfoUser.js')
const { getActualDatetime, updateDatetimeOfLastRequest } = require('./auxFunctions.js')

async function managementRequestsSales(){
    return new Promise(async (resolve, reject) => {
        
        let actualTime = await getActualDatetime();
        let datetimeToRequest = await managementParameterLastRequest();
        let haveMorePage = true;
        let page = 0;

        while (haveMorePage) {
            page++;
            await preparingGetSales(datetimeToRequest, page)
            .then(async (response) => {
                let sales = response[0];
                let nextPage = response[1];

                console.log(sales)

                haveMorePage = nextPage == null ? false : true
            })
        }

        await updateDatetimeOfLastRequest(actualTime)
        .then(() => {
            resolve({code: 200, msg:'VENDAS CONSULTADAS E CADASTRADAS COM SUCESSO'})
        })
        
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


module.exports = {
    managementRequestsSales
}