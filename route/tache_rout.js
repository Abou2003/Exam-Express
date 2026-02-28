const express = require("express");
const routeur = express.Router();
const db = require("../config/db");

routeur.post("/", (req, res) => {
    const { titre, description, priorite, date_limite, responsable } = req.body;
    const requete = "INSERT INTO tache(titre, description, priorite, date_limite, responsable) VALUES(?, ?, ?, ?, ?)";
    db.query(requete, [titre, description, priorite, date_limite, responsable], (err, resultat) => {
        if (err) return res.status(500).json(err);
        res.redirect('/tache/accueil');  // ← rediriger vers la page après ajout
    });
});

routeur.get('/accueil', (req, res) => {
    db.query('SELECT * FROM tache', (err, taches) => {
        if (err) return res.status(500).json(err);
        res.render('index', { taches });   // envoie les tâches à index.ejs
    });
});

routeur.get("/", (req, res) => {
    db.query("SELECT * FROM tache", (err, resultat) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(resultat);
    });
});

routeur.get('/statut/:id', (req, res) => {
    const { id } = req.params;
    const { next } = req.query;

    const statutsValides = ['en cours', 'terminer'];
    if (!statutsValides.includes(next)) return res.redirect('/tache/accueil');

    db.query('UPDATE tache SET statut = ? WHERE id = ?', [next, id], (err) => {
        if (err) return res.status(500).json(err);
        res.redirect('/tache/accueil');
    });
});

routeur.get("/:id", (req, res) => {
    db.query("SELECT * FROM tache WHERE id = ?", [req.params.id], (err, resultat) => {
        if (err) return res.status(500).json(err);
        if (resultat.length === 0) return res.status(404).json({ message: "Tache introuvable" });
        return res.status(200).json(resultat[0]);
    });
});

routeur.post('/modifier/:id', (req, res) => {
    const { titre, description, priorite, statut, date_limite, responsable } = req.body;
    const requete = 'UPDATE tache SET titre=?, description=?, priorite=?, statut=?, date_limite=?, responsable=? WHERE id=?';
    db.query(requete, [titre, description, priorite, statut, date_limite, responsable, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.redirect('/tache/accueil');
    });
});

routeur.put("/:id", (req, res) => {
    const { titre, description, priorite, statut, date_limite, responsable } = req.body;
    const requete = "UPDATE tache SET titre=?, description=?, priorite=?, statut=?, date_limite=?, responsable=? WHERE id=?";
    db.query(requete, [titre, description, priorite, statut, date_limite, responsable, req.params.id], (err, resultat) => {
        if (err) return res.status(500).json(err);
        if (resultat.affectedRows === 0) return res.status(404).json({ message: "Tache introuvable" });
        return res.status(200).json({ message: "Tache modifiee avec succes" });
    });
});

routeur.get('/supprimer/:id', (req, res) => {
    db.query('DELETE FROM tache WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.redirect('/tache/accueil');
    });
});

routeur.delete("/:id", (req, res) => {
    db.query("DELETE FROM tache WHERE id = ?", [req.params.id], (err, resultat) => {
        if (err) return res.status(500).json(err);
        if (resultat.affectedRows === 0) return res.status(404).json({ message: "Tache introuvable" });
        return res.status(200).json({ message: "Tache supprimee avec succes" });
    });
});
module.exports = routeur;