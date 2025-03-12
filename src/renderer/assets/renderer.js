
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

async function saveInfoHost(){
    let pathdb = document.getElementById('pathdb-input').value;
    let returnOfApi = await window.api.saveHost(pathdb)
    
    if(returnOfApi=='success'){
        alert("Informações salvas com sucesso!")
    }
}

async function saveInfoPedidoOk(){
    let token = document.getElementById('token-input').value;
    let returnOfApi = await window.api.savePedidoOk(token)

    if(returnOfApi=='success'){
        alert("Informações salvas com sucesso!")
    }
}

async function startSync(){
    await loadingPage(true)
    await window.api.start()
    .then(async () => {
        await loadingPage(false)
    })
  //  alert(mensage)
}

