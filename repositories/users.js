const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);

const Repository = require('./repository');

class UsersRepository extends Repository {
    async create(attrs) {
        attrs.id = this.randomId();
        // handling hash/salting here
        const salt = crypto.randomBytes(8).toString('hex');
        const hashed = await this.generateHashedPassword(attrs.password, salt);
        const records = await this.getAll();
        attrs.password = `${hashed}.${salt}`
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }

    async generateHashedPassword(password, salt) {
        return (await scrypt(password, salt, 64)).toString('hex');
    }

    async compareHashedPasswords(dbPassword, inputPassword) {
        const [hash, salt] = dbPassword.split('.');
        const hashedInput = await this.generateHashedPassword(inputPassword, salt);
        return hash === hashedInput;
    }
}

module.exports = new UsersRepository('users.json'); // create instance for when imported elsewhere
