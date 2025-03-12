require('dotenv').config({ path: __dirname + '/.env' });

function returnInfo(infoRequired){
    return new Promise((resolve, reject) => {
        switch (infoRequired) {
            case 'user_database':
                resolve(process.env.USR_DATABASE) 
                break;
        
            case 'password_database':
                resolve(process.env.PSW_DATABASE) 
                break;

            case 'token_partner':
                resolve(process.env.TOKEN_PARTNER) 
                break;
        }
    })
}

module.exports = {
    returnInfo
}