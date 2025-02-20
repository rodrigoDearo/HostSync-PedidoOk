
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

async function startSync(){
    
    await loadingPage(true)
    await window.api.start()
    .then(async (message) => {
        alert(message)
        await loadingPage(false)
    })
}






async function loadingPage(status){
    let buttons = document.getElementsByClassName('btn');
    let gifLoading = document.getElementById('gif-loading');
    let backgroundLoading = document.getElementById('background-loading')

    if(status){
        for(let i=0; i<buttons.length; i++){
            buttons[i].disabled = true
        }
        gifLoading.src = './assets/loading.gif'
        backgroundLoading.style.width = '100vw';
        backgroundLoading.style.height = '100vh' 
    }
    else{
        for(let i=0; i<buttons.length; i++){
            buttons[i].disabled = false
        }
        gifLoading.src = '';
        backgroundLoading.style.width = '0';
        backgroundLoading.style.height = '0' 
    }
}