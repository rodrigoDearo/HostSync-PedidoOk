const axios = require('axios');
const { succesHandlingRequests, errorHandlingRequest, } = require('./auxFunctions')

function postProduct(body, header){
    return new Promise(async (resolve, reject) => {
        await axios.post('https://api.pedidook.com.br/v1/produtos/', body, header)
        .then((answer) => {
            console.log('CADASTRADO COM SUCESSO PRODUTO ' + body.nome)
            
        })
        .catch((error) => {
            console.log(error.response.data)
        })
        .finally(() => {
           
        })    
    })
}


function patchProduct(body, header, idproduct){
    return new Promise(async (resolve, reject) => {
        await axios.patch(`https://api.pedidook.com.br/v1/produtos/${idproduct}`, body, header)
        .then((response) => {
            console.log('ATUALIZADO COM SUCESSO PRODUTO ' + body.nome)
        })
        .catch((error) => {
            console.log(error.response.data)
        })
        .finally(() => {

        })    
    })
}


function deleteProduct(header, idproduct){
    return new Promise(async (resolve, reject) => {
        await axios.delete(`https://api.pedidook.com.br/v1/produtos/${idproduct}`, header)
        .then((response) => {
            console.log('DELETADO PRODUTO COM SUCESSO')
        })
        .catch((error) => {
            console.log(error.response.data)
        })
        .finally(() => {

        })    
    })
}


function undeleteProduct(header, idproduct){
    return new Promise(async (resolve, reject) => {
        await axios.patch(`https://api.pedidook.com.br/v1/produtos/${idproduct}/undelete`, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}


// ---------------------------------------------------------------------


function postCustomer(body, header){
    return new Promise(async (resolve, reject) => {
        await axios.post('https://api.pedidook.com.br/v1/clientes/', body, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}


function patchCustomer(body, header, idcustomer){
    return new Promise(async (resolve, reject) => {
        await axios.put(`https://api.pedidook.com.br/v1/clientes/${idcustomer}`, body, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}


function deleteCustomer(header, idcustomer){
    return new Promise(async (resolve, reject) => {
        await axios.delete(`https://api.pedidook.com.br/v1/clientes/${idcustomer}`, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}


function undeleteCustomer(header, idcustomer){
    return new Promise(async (resolve, reject) => {
        await axios.patch(`https://api.pedidook.com.br/v1/clientes/${idcustomer}/undelete`, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}


// ---------------------------------------------------------------------


function getSales(header){
    return new Promise(async (resolve, reject) => {
        await axios.patch(`https://api.pedidook.com.br/v1/pedidos/`, header)
        .then((response) => {

        })
        .catch((error) => {

        })
        .finally(() => {

        })    
    })
}



module.exports = {
    postProduct,
    patchProduct,
    deleteProduct,
    undeleteProduct,
    postCustomer,
    patchCustomer,
    deleteCustomer,
    undeleteCustomer,
    getSales
}