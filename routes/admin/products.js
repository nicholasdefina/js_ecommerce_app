const express = require('express');
const productsRepo = require('../../repositories/products')
const { validationResult } = require('express-validator');

const productsNewTemplate = require('../../views/admin/products/new')
const { requireProductPrice, requireProductTitle } = require('./validators')

const router = express();

// router.get('/admin/products', (req, res) => {
//     res.send(productsNewTemplate({ req }))
// });


router.get('/admin/products/new', (req, res) => {
    res.send(productsNewTemplate({}))
});

router.post('/admin/products/new', 
[requireProductTitle, requireProductPrice],
 async (req, res) => {
    const errors = validationResult(req); // express-validation gets attached to the req
    if (!errors.isEmpty()) {
        return res.send(productsNewTemplate({ req, errors }))
    }
    res.send(productsNewTemplate({}))
});



module.exports = router;