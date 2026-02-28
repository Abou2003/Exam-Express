const express = require("express");
const cors = require("cors");
const path = require("path");
const liste = require('./route/tache_rout');
const app = express();

app.set('view engine', 'ejs');        // dire à Express d'utiliser EJS
app.set('views', path.join(__dirname, 'views'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // pour lire les formulaires
app.use(express.static('public'));//permet de lancer le fichier html qui ce trouve dans le fichier public
app.use('/tache',liste);
app.get('/', (req, res) => {
    res.redirect('/tache/accueil');
});
app.listen(3000, ()=> {"port 3000"})