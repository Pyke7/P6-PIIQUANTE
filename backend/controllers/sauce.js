const Sauce = require('../models/Sauce');
const fs = require('fs');
const { error } = require('console');

exports.createSauce = (req, res, next) => { //Ajoute une nouvelle sauce à la DB
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; //evite les erreurs d'id dans la DB
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //format de l'url des images
    });
    sauce.save()
      .then(() => res.status(201).json({ message: 'Sauce ajoutée !' }))
      .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res, next) => { //Renvoie un tableau de toutes les sauces
    Sauce.find()
      .then (sauces => res.status(200).json(sauces))
      .catch (error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => { //Renvoie une seul sauce en fonction de son id
    Sauce.findOne({ _id: req.params.id})
      .then (sauce => res.status(200).json(sauce))
      .catch (error => res.status(404).json({ error }));
};

exports.updateSauce = (req, res, next) => { //Modifie la sauce en focntion de son id
  Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
      if (!sauce) {
        return res.status(404).json({
          error: new Error('Sauce non trouvée !')
        })
      }
      if (sauce.userId !== req.auth.userId) { //Vérifie que l'utilisateur qui modifie et celui qui à crée cette sauce
        return res.status(401).json({
          error: new Error('Requête non autorisée')
        })
      } else {
        const sauceObject = req.file ?
        {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        if (req.file) {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => { // supprime l'ancienne image enregistrée dans la DB
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Sauce modifiée!'}))
              .catch(error => res.status(400).json({ error }));
          })
        } else {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!'}))
          .catch(error => res.status(400).json({ error }));
        }
      }
    })
};

exports.deleteSauce = (req, res, next) => { //supprime la sauce (ID) de la DB
    Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
        if(!sauce) {
          return res.status(404).json({
            error: new Error('Sauce non trouvée !')
          })
        }
        if (sauce.userId !== req.auth.userId) {
          return res.status(401).json({
            error: new Error('Requête non authorisée !')
          });
        }
        
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { //supprime l'image du dossier images
          Sauce.deleteOne({ _id: req.params.id })
          .then (() => res.status(200).json({ message: 'Sauce supprimée !' }))
          .catch (error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
};

exports.likeOrDislike = (req, res, next) => { //permet à l'utilisateur de liker ou disliker
   const userId = req.body.userId;
   const like = req.body.like;
   const sauceId = req.params.id;
   
  if (like === 1) {

    Sauce.findOne({ _id: sauceId})
      .then(sauce => {
        sauce.likes++;
        sauce.usersLiked.push(userId);
        sauce.save();
      })

      .then(() => res.status(200).json({ message: 'J\'aime'}))
      .catch(error => res.status(400).json({ error }));
  } else if (like === 0) {

     Sauce.findOne({ _id: sauceId})
      .then(sauce => {
        if (sauce.usersLiked.includes(userId)) { //si l'utilisateur à déjà like...
          const userIdIndex = sauce.usersLiked.indexOf(userId);
          sauce.usersLiked.splice(userIdIndex, 1);
          sauce.likes--;
          sauce.save();
        }
        else if (sauce.usersDisliked.includes(userId)) { //si l'utilisateur à déjà dislike...
          const userIdIndex = sauce.usersDisliked.indexOf(userId);
          sauce.usersDisliked.splice(userIdIndex, 1);
          sauce.dislikes--;
          sauce.save();
        }
      })

      .then (() => res.status(200).json({ message: 'Neutre' }))
      .catch (error => res.status(400).json({ error }));
  } else if (like === -1) {

     Sauce.findOne({ _id: sauceId})
      .then(sauce => {
        sauce.dislikes++;
        sauce.usersDisliked.push(userId);
        sauce.save();
      })

      .then(() => res.status(200).json({ message: 'Je n\'aime pas'}))
      .catch(error => res.status(400).json({ error }));
  } else {
    res.status(400).json({ error });
  }
};