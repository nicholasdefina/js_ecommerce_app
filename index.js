const express = require('express');
const bodyParser = require('body-parser'); // middleware to process reqs
const cookieSession = require('cookie-session'); // middleware to handle cookies
const authRouter = require('./routes/admin/auth'); 
const adminProductsRouter = require('./routes/admin/products'); 
const userProductsRouter = require('./routes/products'); 
const cartsRouter = require('./routes/carts'); 

const app = express();


app.use(express.static('public')); // give express access to public folder

// applying middlewares
app.use(bodyParser.urlencoded({extended: true})); // auto apply to all routes
app.use(cookieSession({keys: ['nfli32wf8an82h3nfaie934adsf567f']})); 

// add sub routers
app.use(authRouter);
app.use(adminProductsRouter); 
app.use(userProductsRouter); 
app.use(cartsRouter); 


// listen for incoming on port 3000
app.listen(3000, () => {
    console.log('I\'m doctor Frasier Crane, and I\'m listening');
})
