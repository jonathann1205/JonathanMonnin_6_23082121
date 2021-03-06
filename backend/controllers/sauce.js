
const Sauce = require('../models/Sauce');

//   creation d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    
    name: sauceObject.name ,
    manufacturer: sauceObject.manufacturer ,
    description: sauceObject.description ,
    mainPepper: sauceObject.mainPepper ,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    heat:sauceObject.heat ,
    userId:sauceObject.userId ,  
    likes: 0 ,
    dislikes: 0,
    usersLiked :[],
    usersDisliked:[] ,    
    });
    sauce.save().then(
        () => {
            res.status(201).json({
              message: 'Sauce saved successfully!'
            });
          }
    ).catch(
        (error) => {
            res.status(400).json({
              error: error
            });
          } 
    )
};


//  recuperer  toute les sauces
exports.getAllSauce = (req, res, next) => {
   Sauce.find().then(
       (sauces) => {
        res.status(200).json(sauces); 
       }
   ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );

};


// //  recuperer une sauce 
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) =>{
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
          res.status(404).json({
            error: error
          });
        }
      );

};


//  modifier la sauce 
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
  .then(() => res.status(200).json({ message: 'Objet modifié !'}))
  .catch(error => res.status(400).json({ error }));
};



//   supprimé la sauce 
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id}).then(
        () => {
            res.status(200).json({
              message: 'Deleted!'
            });
          }
    ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );

};


exports.likeOrNotSauce = (req, res, next) => {
  if (req.body.like === 1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
          .catch(error => res.status(400).json({ error }))
  } else if (req.body.like === -1) {
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
          .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
          .catch(error => res.status(400).json({ error }))
  } else {
      Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
              if (sauce.usersLiked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Like supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              } else if (sauce.usersDisliked.includes(req.body.userId)) {
                  Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                      .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                      .catch(error => res.status(400).json({ error }))
              }
          })
          .catch(error => res.status(400).json({ error }))
  }
}