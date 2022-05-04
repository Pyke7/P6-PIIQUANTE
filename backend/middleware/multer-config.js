const multer = require('multer'); // récupération du module

const MIME_TYPES = { //Dictionnaire MIME pour obtenir une extension
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //multer a besoin de deux éléments: la destination du fichier (le dossier 'images') et le nom du fichier que l'on custom ici pour le rendre unique
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image'); // exportation de multer complétement configuré indiquant d'un fichier 'image' uniquement