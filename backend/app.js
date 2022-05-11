const dotenv = require('dotenv').config();
const limiter = require('./middleware/express-rate-limit');
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

app.use(express.json()); //rend les données json reçues exploitables

//CONNEXION A LA BASE DE DONNEES MONGODB
mongoose.connect(`mongodb+srv://${process.env.USER_MONGODB}:${process.env.PASSWORD_MONGODB}@clustersandbox.hkprr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true 
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//EVITE LES ERREURS CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
   
app.use(limiter); //limite les requête envoyées à l'API
app.use('/images', express.static(path.join(__dirname, 'images'))); //rend le dossier /images statique

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
