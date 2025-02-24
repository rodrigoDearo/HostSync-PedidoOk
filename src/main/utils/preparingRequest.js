const { postProduct, putProduct, deleteProduct, undeleteProduct, postCustomer, putCustomer, deleteCustomer, undeleteCustomer, getSales } = require('./requestsPedidoOk');
const { returnValueFromJson } = require('./manageInfoUser');
const { returnInfo } = require('../envManager');

async function preparingPostProduct(product){
    return new Promise(async (resolve, reject) => {
        let body, header

        await returnHeader()
        .then(async (response) => {
            header = response;
            product.id_parceiro  = await returnValueFromJson('idparceiro');
            return product
        })
        .then(async (response) => {
            body = response
            await postProduct(body, header)
        }) 
        .then(() => {
            resolve()
        })

        
    })  
}


async function preparingPutProduct(product, idproduct){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingDeleteProduct(idproduct){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingUndeleteProduct(idproduct){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingPostCustomer(customer){
    return new Promise(async (resolve, reject) => {

    })
}


async function preparingPutCustomer(customer, idcustomer){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingDeleteCustomer(idcustomer){
    return new Promise(async (resolve, reject) => {
        
    })
}


async function preparingUndeleteCustomer(idcustomer){
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


module.exports = {
    preparingPostProduct,
    preparingPutProduct,
    preparingDeleteProduct,
    preparingUndeleteProduct,
    preparingPostCustomer,
    preparingPutCustomer,
    preparingDeleteCustomer,
    preparingUndeleteCustomer,
}