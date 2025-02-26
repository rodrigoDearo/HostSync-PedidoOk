const { postProduct, patchProduct, deleteProduct, undeleteProduct, postCustomer, patchCustomer, deleteCustomer, undeleteCustomer, getSales } = require('./requestsPedidoOk');
const { returnValueFromJson } = require('./manageInfoUser');
const { returnInfo } = require('../envManager');

async function preparingPostProduct(product){
    return new Promise(async (resolve, reject) => {
        let body, header

        await returnHeader()
        .then(async (response) => {
            header = response;
            product.id_parceiro  = await returnValueFromJson('idparceiro');

            delete product.status
            return product
        })
        .then(async (response) => {
            body = response
            await postProduct(body, header)
        }) 
        .then(() => {
        
        })

    })  
}


async function preparingUpdateProduct(product, idproduct){
    return new Promise(async (resolve, reject) => {
        let body, header;

        await returnHeader()
        .then(async (response) => {
            header = response;

            delete product.embalagem
            delete product.codigo
            delete product.status
            return product
        })
        .then(async (response) => {
            body = response
            await patchProduct(body, header, idproduct);
        })
        .then(() => {
        
        })
    })
}


async function preparingDeleteProduct(idproduct){
    return new Promise(async (resolve, reject) => {
        let header;

        await returnHeader()
        .then(async (response) => {
            header = response
        })
        .then(async () => {
            await deleteProduct(header, idproduct)
        })
        .then(() => {
        
        })
    })
}


async function preparingUndeleteProduct(idproduct){
    return new Promise(async (resolve, reject) => {
        let header;

        await returnHeader()
        .then(async (response) => {
            header = response
        })
        .then(async () => {
            await undeleteProduct(header, idproduct)
        })
        .then(() => {
        
        })
    })
}


async function preparingPostCustomer(customer){
    return new Promise(async (resolve, reject) => {
        let body, header

        await returnHeader()
        .then(async (response) => {
            header = response;
            customer.id_parceiro  = await returnValueFromJson('idparceiro');

            delete customer.status
            return customer
        })
        .then(async (response) => {
            body = response
            await postCustomer(body, header)
        }) 
        .then(() => {
     
        })

    })  
}


async function preparingUpdateCustomer(customer, idcustomer){
    return new Promise(async (resolve, reject) => {
        let body, header;

        await returnHeader()
        .then(async (response) => {
            header = response;

            delete customer.codigo
            delete customer.status
            return customer
        })
        .then(async (response) => {
            body = response
            await patchCustomer(body, header, idcustomer);
        })
        .then(() => {
        
        })
    })
}


async function preparingDeleteCustomer(idcustomer){
    return new Promise(async (resolve, reject) => {
        let header;

        await returnHeader()
        .then(async (response) => {
            header = response
        })
        .then(async () => {
            await deleteCustomer(header, idcustomer)
        })
        .then(() => {
        
        })
    })
}


async function preparingUndeleteCustomer(idcustomer){
    return new Promise(async (resolve, reject) => {
        let header;

        await returnHeader()
        .then(async (response) => {
            header = response
        })
        .then(async () => {
            await undeleteProduct(header, idcustomer)
        })
        .then(() => {
        
        })
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

        const config = {
            headers: {
                'token_parceiro': 'c4feeb6f-a967-4315-abe7-453269b24dfb',
                'token_pedidook': '616457fa-80e7-4e77-802c-38f92e65ef3c',
                'Content-Type': 'application/json'
            }       
        }

        resolve(config)
    })
}



module.exports = {
    preparingPostProduct,
    preparingUpdateProduct,
    preparingDeleteProduct,
    preparingUndeleteProduct,
    preparingPostCustomer,
    preparingUpdateCustomer,
    preparingDeleteCustomer,
    preparingUndeleteCustomer,
}