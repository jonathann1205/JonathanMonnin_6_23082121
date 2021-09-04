const passwordSchema = require('../models/password');

module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.status(400).json({ message: 'The password must be at least 8 characters long, with at least a capital, a min and 2 digits.' });
    } else {
        next();
    }
};