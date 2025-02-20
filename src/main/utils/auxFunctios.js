const { returnInfo } = require('../envManager');
const { returnValueFromJson } = require('./manageInfoUser');

async function returnConfigToAccessDB(){
    return new Promise(async (resolve, reject) => {
        await returnValueFromJson('pathdbhost')
        .then(async (response) => {
            config = {
                host: 'localhost',
                port: 3050,
                database: `${response}/HOST.FDB`,
                charset: 'UTF8'
            }
        })
        .then(async () => {
            //let envInfo = await returnInfo('user_database')
            let envInfo = 'SYSDBA'
            config.user = `${envInfo}`;
        })
        .then(async () => {
            //let envInfo = await returnInfo('password_database')
            let envInfo = 'masterkey'
            config.password = `${envInfo}`;
        })
        .finally(() => {
            resolve(config)
        })
    })
}

module.exports = {
    returnConfigToAccessDB
}
