const rateLimit = require("express-rate-limit")


//   limite le nombres de tentative de connection
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: "Trop de tentatives de connexion. Compte bloqué pour 5 minutes"
})

module.exports = { limiter }