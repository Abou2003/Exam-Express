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

/*
routeur.get('/', async(req,res)=>{
     const requette = 'select * from tache';
     await db.query(requette,(err, resultat)=>{
        if (err){
            return res.status(500).json(err);
        }
        else{
            return res.json(resultat);
        }
     })
})
// GET - Récupérer une tâche par ID
// ===================================
routeur.get('/:id', (req, res) => {
    const requette = 'SELECT * FROM taches WHERE id = ?';
    
    db.query(requette, [req.params.id], (err, resultat) => {
        if (err) {
            console.error('Erreur GET by ID:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (resultat.length === 0) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        
        res.json(resultat[0]);
    });
});


// PUT - Modifier une tâche
// ===================================
routeur.put('/:id', (req, res) => {
    const { titre, description, responsable, priorite, statut } = req.body;
    const id = req.params.id;
    
    const requette = `
        UPDATE taches 
        SET titre = ?, 
            description = ?, 
            responsable = ?, 
            priorite = ?, 
            statut = ?
        WHERE id = ?
    `;
    
    db.query(requette, [titre, description, responsable, priorite, statut, id], (err, resultat) => {
        if (err) {
            console.error('Erreur PUT:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // Vérifier si la tâche existe
        if (resultat.affectedRows === 0) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        
        res.json({ 
            message: 'Tâche modifiée avec succès',
            id: id
        });
    });
});

routeur.delete('/:id', async(req,res)=>{
    await db.query('delete from tache where id=?',[req.params.id]);
    res.sendStatus(200);
})

// DELETE - Supprimer une tâche
// ===================================
routeur.delete('/:id', (req, res) => {
    // ❌ ERREUR CORRIGÉE: "tache" au lieu de "taches" (incohérence de nom de table)
    const requette = 'DELETE FROM taches WHERE id = ?';
    
    // ❌ ERREUR CORRIGÉE: Pas besoin de "async/await" avec callback
    db.query(requette, [req.params.id], (err, resultat) => {
        if (err) {
            console.error('❌ Erreur DELETE:', err);
            return res.status(500).json({ error: err.message });
        }
        
        // Vérifier si la tâche existait
        if (resultat.affectedRows === 0) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        
        res.json({ 
            message: 'Tâche supprimée avec succès',
            id: req.params.id
        });
    });
});*/