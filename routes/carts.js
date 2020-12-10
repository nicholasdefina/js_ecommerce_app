const express = require('express');
const router = express.Router();

const cartsRepo = require('../repositories/carts')
const productsRepo = require('../repositories/products')
const { getOrCreateCart } = require('./helpers');

const showCartItemsTemplate = require('../views/carts/show')

router.post('/cart/products', async(req, res) => {
    const productId = req.body.productId;
    // create cart if not one, store to session
    const cart = await getOrCreateCart(req);
    const existingItem = cart.items.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.items.push({id: productId, quantity: 1})
    }

    await cartsRepo.update(cart.id, {items: cart.items});

    res.redirect('/cart'); // TODO: not ideal workflow. just doing this for lazy demo.
});

router.get('/cart', async(req, res) => {
    const cart = await getOrCreateCart(req);
    for (let item of cart.items) {
        item['product'] = await productsRepo.getOne(item.id);
    }
    res.send(showCartItemsTemplate({ items: cart.items }));
});

router.post('/cart/products/:id/delete', async(req, res) => {
    const productId = req.params.id;
    const cart = await getOrCreateCart(req);
    const items = cart.items.filter((item) => item.id !== productId);
    await cartsRepo.update(cart.id, {items});
    res.redirect('/cart');
});

module.exports = router;