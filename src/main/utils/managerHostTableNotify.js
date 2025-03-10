const conexao = require('node-firebird');
const fs = require ('fs')

const { readingAllRecordProducts } = require('./managerProducts.js')
const { readingAllRecordCustomers } = require('./managerCustomers.js')

async function requireAllRecordsNotifyTable(config){
    return new Promise(async(resolve, reject) => {
        try {
        conexao.attach(config, function (err, db){
            if (err)
                throw err;
  
            let codigoSQL = `SELECT 
                            NH.*,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.id_produto
                                ELSE C.id_cliente
                            END AS id, 
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.obs
                                ELSE C.obs
                            END AS obs,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.barras
                                ELSE NULL
                            END AS barras,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN PG.grupo
                                ELSE NULL
                            END AS grupo,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.produto
                                ELSE C.cliente
                            END AS nome,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.estoque
                                ELSE NULL
                            END AS estoque,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN PM.marca
                                ELSE NULL
                            END AS marca,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.valor_venda
                                ELSE NULL
                            END AS valor_venda,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN P.custo
                                ELSE NULL
                            END AS custo,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.fone
                                ELSE NULL
                            END AS fone,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.uf
                                ELSE NULL
                            END AS uf,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.municipio
                                ELSE NULL
                            END AS municipio,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.complemento
                                ELSE NULL
                            END AS complemento,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.numero
                                ELSE NULL
                            END AS numero,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.logradouro
                                ELSE NULL
                            END AS logradouro,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.bairro
                                ELSE NULL
                            END AS bairro,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.cep
                                ELSE NULL
                            END AS cep,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.raz_social
                                ELSE NULL
                            END AS raz_social,
                            CASE 
                                WHEN NH.tipo = 'CLIENTE' THEN C.cpf_cnpj
                                ELSE NULL
                            END AS cpf_cnpj,
                            CASE 
                                WHEN NH.tipo = 'PRODUTO' THEN 
                                    CASE 
                                        WHEN P.status = 'ATIVO' THEN 1
                                        WHEN P.status = 'INATIVO' THEN 0
                                        ELSE NULL
                                    END
                                WHEN NH.tipo = 'CLIENTE' THEN 
                                    CASE 
                                        WHEN C.status = 'ATIVO' THEN 1
                                        WHEN C.status = 'INATIVO' THEN 0
                                        ELSE NULL
                                    END
                            END AS status
                        FROM NOTIFICACOES_HOSTSYNC NH
                        LEFT JOIN PRODUTOS P ON NH.tipo = 'PRODUTO' AND NH.iditem = P.id_produto
                        LEFT JOIN PRODUTOS_GRUPO PG ON P.grupo = PG.id
                        LEFT JOIN PRODUTOS_MARCA PM ON P.marca = PM.id
                        LEFT JOIN CLIENTES C ON NH.tipo = 'CLIENTE' AND NH.iditem = C.id_cliente;
                        WHERE NH.iditem IN (
                            SELECT iditem 
                            FROM NOTIFICACOES_HOSTSYNC 
                            GROUP BY iditem 
                            HAVING COUNT(*) = 1
                        )
                        `;
  
            db.query(codigoSQL, async function (err, result){
                if (err)
                    resolve({code: 500, msg:'ERRO AO CONSULTAR TABELA NOTIFICACOES, CONTATAR SUPORTE TECNICO'});
                
                await readingAllRecordProducts(result, 0)
                .then(() => {
                    resolve({code: 200, msg:'NOTIFICACOES CONSULTADAS COM SUCESSO'});
                })
                
            });
          
        db.detach();
        });
  
      } catch (error) {
        reject(error);
      }
    })
}
