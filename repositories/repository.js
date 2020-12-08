// WRITING DATA STORE FOR JS PRACTICE. not a good prod solution bc 
// 1) wont run on multiple servers. 
// 2) will error if multiple copies of same file open. 
// 3) have to write to file system every time

const fs = require('fs');
const crypto = require('crypto');

module.exports = class Repository {
    constructor(fileName) {
        if (!fileName) {
            throw new Error('Need a file name to create a repository!');
        }
        this.fileName = fileName;
        try {
            fs.accessSync(fileName);
        } catch (error) {
            fs.writeFileSync(this.fileName, '[]');
        }
    }

    async create(attrs) {
        attrs.id = this.randomId();        
        records.push(attrs);
        await this.writeAll(records);
        return attrs;
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.fileName)); // default encoding is utf8
    }

    async writeAll(records) {
        await fs.promises.writeFile(this.fileName, JSON.stringify(records, null, 2));
    }

    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }

    async getOne(id) {
        const records = await this.getAll();
        return records.find((record) => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter((record) => record.id === id);
        await this.writeAll(filteredRecords);
    }

    async update(id, newAttrs) {
        const records = await this.getAll();
        const record = records.find((record) => record.id === id);
        if (!record) {
            throw Error(`Could not find record for id: ${id}`)
        }
        Object.assign(record, newAttrs);
        await this.writeAll(records);
    }

    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;
            for (let key in filters) {
                if (record[key] !== filters[key])
                    found = false;
                break;
            }
            if (found) {
                return record;
            }
        }
    }
};