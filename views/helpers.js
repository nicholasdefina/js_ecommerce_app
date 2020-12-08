module.exports = {
     getError (errors, field) {
        try {
            return errors.mapped()[field].msg;
        } catch (err) {
            return '';
        }
    }
}