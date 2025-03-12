const conexao = require('node-firebird');

const { gravarLog } = require('./auxFunctions.js')




async function insertOrcamento(dadosSale, dadosCustomer, config){
    return new Promise(async (resolve, reject) => {

        conexao.attach(config, function (err, db){
            if (err)
                throw err;

            let codigoSQL = `INSERT INTO ORCAMENTO (ID_CLIENTE, ID_USUARIO, DATA_VENDA, HORA_VENDA, DESCONTO, ACRESCIMO, VALOR_FINAL, TOTAL_PRODUTOS, ACRESCIMO_ITENS, STATUS_VENDA, NOME_CLIENTE, ENDERECO_CLIENTE, FONE_CLIENTE, CPF_CNPJ_CLIENTE, CANCELADO, SITUACAO, OBS, MUNICIPIO, UF) VALUES (${dadosCustomer.ID_CLIENTE}, ${dadosSale.ID_USUARIO}, ${dadosSale.DATA_VENDA}, ${dadosSale.HORA_VENDA}, ${dadosSale.DESCONTO}, ${dadosSale.ACRESCIMO}, ${dadosSale.VALOR_FINAL}, ${dadosSale.TOTAL_PRODUTOS}, ${dadosSale.ACRESCIMO_ITENS}, ${dadosSale.STATUS_VENDA}, ${dadosCustomer.NOME_CLIENTE}, ${dadosCustomer.ENDERECO_CLIENTE}, ${dadosCustomer.FONE_CLIENTE}, ${dadosCustomer.CPF_CNPJ_CLIENTE}, ${dadosSale.CANCELADO}, ${dadosSale.SITUACAO}, ${dadosSale.OBS}, ${dadosCustomer.MUNICIPIO}, ${dadosCustomer.UF})`;

            db.query(codigoSQL, async function (err, result){
                if (err)
                    reject({code: 500, msg:'ERRO AO TENTAR INSERIR REGISTRO NA TABELA ORCAMENTO, CONTATAR SUPORTE TECNICO'});
                
                let idInserido = result.insertId;
                gravarLog('REALIZADO INSERT NA TABELA DE ORCAMENTO COM SUCESSO, ID RETORNADO: ' + idInserido);
                resolve(insertId)
            });
          
            db.detach();
        })

    })
}


module.exports = {
    insertOrcamento
}




/*
async function insertMovimento(config){
    return new Promise(async (resolve, reject) => {
        const now = new Date();

        let dataAbertura = String(now.getDate()).padStart(2, '0') + "." +
        String(now.getMonth() + 1).padStart(2, '0') + "." +
        String(now.getFullYear()
        ) 

        let horaAbertura = String(now.getHours()).padStart(2, '0') + "." +
        String(now.getMinutes()).padStart(2, '0') + ".00";

        conexao.attach(config, function (err, db){
            if (err)
                throw err;


            let codigoSQL = `INSERT INTO MOVIMENTO (DATA_ABERTURA, HORA_ABERTURA, TOTAL_SUPRIMENTO, TOTAL_SANGRIA, TOTAL_NAO_FISCAL, TOTAL_VENDA, TOTAL_DESCONTO, TOTAL_ACRESCIMO, TOTAL_FINAL, TOTAL_RECEBIDO, TOTAL_TROCO, TOTAL_CANCELADO, STATUS_MOVIMENTO) VALUES ('${dataAbertura}', '${horaAbertura}', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'A')`;

            db.query(codigoSQL, async function (err, result){
                if (err)
                    reject({code: 500, msg:'ERRO AO CONSULTAR TABELA DE MOVIMENTOS, CONTATAR SUPORTE TECNICO'});
                
                gravarLog('REALIZADO INSERT NA TABELA DE MOVIMENTO COM SUCESSO');
                resolve()
            });
          
            db.detach();
        })
    })
}*/
