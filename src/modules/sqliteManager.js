const sqlite3 = require('sqlite3').verbose();

const sqltManager = (function() {
    // Conectar ao banco de dados SQLite
    const db = new sqlite3.Database('./facu.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });

    // Função para buscar dados da tabela 'itens'
    function getItems(callback) {
        const query = 'SELECT * FROM arquivos';
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err.message);
                callback(err, null);
            } else {
                callback(null, rows);
            }
        });
    }
    function insertItem(nome, payload, tags, callback) {
        const tagsJson = JSON.stringify(tags)
        const query = 'INSERT INTO arquivos (nome, payload, tags) VALUES (?, ?, ?)';
        db.run(query, [nome, payload, tagsJson], function(err) {
            if (err) {
                console.error('Erro ao inserir item:', err.message);
                callback(err);
            } else {
                console.log(`Item inserido com sucesso, ID: ${this.lastID}`);
                callback(null, this.lastID);
            }
        });
    }
    function deleteItem(id,callback){
        const query = 'DELETE FROM arquivos WHERE id = ?';
        db.run(query, [id], function(err) {
            if (err) {
                console.error('Erro ao deletar item:', err.message);
                callback(err);
            } else {
                console.log(`Item com ID ${id} deletado com sucesso`);
                callback(null, { message: 'Item deletado com sucesso', changes: this.changes });
            }
        });
    }
    // Fechar a conexão com o banco de dados
    function close() {
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }
        });
    }

    // Retornar os métodos públicos
    return {
        getItems: getItems,
        insertItem: insertItem,
        deleteItem: deleteItem,
        close: close
    };
})();

module.exports = sqltManager;
