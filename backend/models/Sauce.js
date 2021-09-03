const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema({
    
    name: {type: String, require: true},
    manufacturer: {type: String, require: true},
    description: {type: String, require: true},
    mainPepper: {type: String, require: true},
    imageUrl: {type: String,require: true },
    heat: {type: String, require: true},
    userId: {type: String, require: true},
    likes: {type: Number},
    dislikes:{type: Number},
    usersLiked :{type: [String]},
    usersDisliked: {type: [String]},
});

module.exports = mongoose.model('Sauce', sauceSchema);