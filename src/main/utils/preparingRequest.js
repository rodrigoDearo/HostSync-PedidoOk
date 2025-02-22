const { postProduct, putProduct, deleteProduct, undeleteProduct, postCustomer, putCustomer, deleteCustomer, undeleteCustomer, getSales } = require('./requestsPedidoOk');
const { returnValueFromJson } = require('./manageInfoUser');
const { returnInfo } = require('../envManager');

async function preparingPostProduct(product){
    return new Promise(async (resolve, reject) => {
        let body, header

        await returnHeader()
        .then(async (response) => {
            header = response;
            let i  = await returnBody(product);
            return i
        })
        .then(async (response) => {
            body = response
            await postProduct(body, header)
        }) 

        
    })  
}


async function preparingPutProduct(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingDeleteProduct(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingUndeleteProduct(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingPostCustomer(){
    return new Promise(async (resolve, reject) => {

    })
}


async function preparingPutCustomer(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingDeleteCustomer(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingUndeleteCustomer(){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function returnHeader(){
    return new Promise(async (resolve, reject) => {
        let tokenParceiro, tokenPedidoOk;

        await returnInfo('token_partner')
        .then(response => {
            tokenParceiro = response
        })

        await returnValueFromJson('tokenpedidook')
        .then(response => {
            tokenPedidoOk = response
        })

        const header = {
            'token_parceiro': `${tokenParceiro}}`,
            'token_pedidooK': `${tokenPedidoOk}`,
            'Content-Type': 'application/json'
        }

        resolve(header)
    })
}


async function returnBody(productHost){
    return new Promise(async (resolve, reject) => {
        let productToPediodoOk = {

        }
    })
}