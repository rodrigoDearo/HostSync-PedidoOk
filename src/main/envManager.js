require('dotenv').config

function returnInfo(infoRequired){
    return new Promise((resolve, reject) => {
        switch (infoRequired) {
            case 'user_database':
                //resolve(process.env.USR_DATABASE) 
                resolve('SYSDBA') 
                break;
        
            case 'password_database':
                //resolve(process.env.PSW_DATABASE) 
                resolve('masterkey') 
                break;

            case 'token_partner':
                //resolve(process.env.TOKEN_PARTNER) 
                resolve('c4feeb6f-a967-4315-abe7-453269b24dfb') 
                break;
        }
    })
}

module.exports = {
    returnInfo
}