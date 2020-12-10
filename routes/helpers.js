const cartsRepo = require('../repositories/carts')


module.exports = {
    async getOrCreateCart (req) {
        if(!req.session.cartId) {
            req.session.cartId = cart.id;
            return await cartsRepo.create({items: []});
        } 
        return await cartsRepo.getOne(req.session.cartId);  
   }
}