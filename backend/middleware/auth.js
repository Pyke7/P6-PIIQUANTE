const jwt = require('jsonwebtoken'); //package pour former un token 

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //récupération du token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //décodage de celui ci avec la clé secrète
        const userId = decodedToken.userId; //récupération du userId encodé dans le token
        req.auth = { userId }; //ajout d'une propriété "auth" avec une paire clé/valeur userId
        if (req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(403).json({ error: error | 'Requête non authentifiée !' });
    }
};