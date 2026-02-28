const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password: 'XXXXXXXXXX',
    database: 'projet_exam'
});

db.connect(err => {
    if (err){
        console.log('Erreur ',err);
        return;
    }
    console.log('Connecter a MySQL');
    
})

module.exports = db;