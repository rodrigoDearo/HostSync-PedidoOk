
async function getInfoUserFromJSON(fieldRequire){
    let fieldValue = await window.api.getInfoUser(fieldRequire);
    return fieldValue
}

function buttonCloseApp(){
    window.api.closeApp()
}

function buttonMinimizeApp(){
    window.api.minimizeApp()
}

function saveInfoHost(){
    let pathdb = document.getElementById('pathdb-input').value;
    window.api.saveHost(pathdb)
}

function saveInfoPedidoOk(){
    let token = document.getElementById('token-input').value;
    window.api.savePedidoOk(token)
}