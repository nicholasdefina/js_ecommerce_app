const { validationResult } = require('express-validator');

module.exports = {
    handleErrors(templateFunc, dataCallback) {
        return async (req, res, next) => {
            const errors = validationResult(req); // express-validation gets attached to the req
            if (!errors.isEmpty()) {
                let data = {} ;
                if(dataCallback) {
                    data = await dataCallback(req);
                }
                return res.send(templateFunc({ errors, ...data }));
            }
            next(); // next is middleware func to basically say it is finished/done
        };
    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect('/signin')
        }
        next();
    },
}