const sqlite3 = require('sqlite3').verbose();

const sqltManager = (function() {
    const db = new sqlite3.Database('./facu.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
        }
    });
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
                callback(null, { err: false, changes: this.changes });
            }
        });
    }
    function close() {
        db.close((err) => {
            if (err) {
                console.error('Erro ao fechar o banco de dados:', err.message);
            } else {
                console.log('Conexão com o banco de dados fechada.');
            }
        });
    }
    function updateItem(args,callback){
        const query = 'UPDATE arquivos SET nome = ?, payload = ?, tags = ? WHERE id = ?';

        db.run(query, [args.nome, args.payload, args.tags, args.id], function(err) {
            if (err) {
                console.error('Erro ao alterar item:', err.message);
                callback(err);
            } else {
                console.log(`Item alterado com sucesso`);
                callback(null, true);
            }
        });
    }
    return {
        getItems: getItems,
        insertItem: insertItem,
        updateItem: updateItem,
        deleteItem: deleteItem,
        close: close
    };
})();

module.exports = sqltManager;
