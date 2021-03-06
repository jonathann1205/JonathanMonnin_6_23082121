const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
require('dotenv').config(); 
const User = require('../models/User');


//  enregistrement utilisateur
exports.signup = (req, res, next) => {
    const protectEmail = cryptoJs.HmacSHA512(req.body.email,process.env.cleToken).toString(cryptoJs.enc.Base64);
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: protectEmail,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };



//  connexion de l'utilisateur
exports.login = (req, res, next) => {
  const protectEmail = cryptoJs.HmacSHA512(req.body.email, process.env.cleToken).toString(cryptoJs.enc.Base64)
    User.findOne({ email: protectEmail })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };