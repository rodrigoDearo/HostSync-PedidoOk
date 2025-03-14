🚀 HostSync - PedidoOk

📌 Visão Geral

HostSync - PedidoOk é um software integrador entre o sistema Host e o sistema PedidoOk, sincronizando produtos, clientes e vendas. Esta documentação fornece informações essenciais para instalação, configuração e resolução de problemas.

🛠 Instalação

O software possui um instalador executável que automatiza o processo.

Não necessita de dependências adicionais, desde que instalado na máquina servidora do banco de dados Host.

⚙️ Configuração

🔹 Host

O caminho do banco HOST.FDB deve ser definido, geralmente C:\TSD\Host.

🔹 PedidoOk

Acesse o software PedidoOk.

No menu, selecione "Integrações" > "Host" > "Configurar a Integração".

Obtenha o token e insira no integrador.

🔄 Ciclo de Execução

Limpeza de registros antigos de erro.

Criação de tabelas e triggers no banco do Host.

Sincronização de produtos e clientes.

Timeout de 10 minutos para otimização.

Importação de vendas do PedidoOk.

Monitoramento de notificações e ajustes conforme necessidade.

🔍 Dados Sincronizados

🛒 Produtos

ID, Nome, Categoria, Marca, Estoque, Preço de venda, Custo, Código de barras, etc.

👥 Clientes

ID, Nome, Telefone, Endereço completo, CNPJ/CPF, etc.

📦 Vendas

ID, Data, Valor final, Status, Cliente associado, Itens da venda.

📁 Logs e Bancos de Dados

📍 Arquivos armazenados em:

{disco}:\Users\{usuario}\AppData\Roaming\hostsync-pedidook\ConfigFiles

📝 Logs ajudam na identificação de problemas.

🚨 Diagnóstico de Erros

⚠️ O arquivo errorsDB.json armazena falhas nas requisições de sincronização.

📂 Caso ocorra falha, verificar os arquivos JSON auxiliares: products.json, customers.json, sales.json.

🆘 Suporte

❌ Se o erro for operacional (ex: dados inconsistentes no Host ou PedidoOk), ajuste os registros.

✅ Se houver erro no integrador, execute via cmd para depuração:

cd "{disco}\Users\{usuario}\AppData\Local\Programs\hostsync-pedidook"
HostSync-PedOk

💡 Se um erro crítico for encontrado, contate o desenvolvedor com os logs anexados.

✍️ Autor: Rodrigo Dearo - 📅 2025

