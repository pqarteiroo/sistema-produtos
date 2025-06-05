const db = require('./database');
console.log('Testando conexão com o banco...');

//Testar se as tabelas foram criadas 
db.all ("SELECT name FROM  sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('Erro:',err);
        } else {
            console.log('Tabelas encontradas:',  tables);
        }

        //Fechar conexão
        db.close();
});
