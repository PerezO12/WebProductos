const { Router } = require('express');
const path = require('path');


const router = Router();



router.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, '..', 'public', 'store.html') );
});


router.get('/crearProducto', (req, res) => {
    res.sendFile( path.join(__dirname, '..', 'public', 'crearProducto.html') );
});





module.exports = router