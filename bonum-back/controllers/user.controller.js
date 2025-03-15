const db = require('../db.js');

class UserController {
    async createUser(req, res) {
        const { name, password } = req.body;

        try {
            console.log('Creating user with name:', name, 'and password:', password);
            const newPerson = await db.query(
                `INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *`,
                [name, password]
            );
            res.json(newPerson.rows[0]);
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async getUser(req, res) {
        const users = await db.query('SELECT * FROM users')
        res.json(users.rows)
    }

    async getOneUser(req, res) {
        const id = req.params.id;
        const user = await db.query('SELECT * FROM users WHERE id=$1', [id])
        res.json(user.rows[0])
    }

    async updateUser(req, res) {
        const {id, name, password} = req.body;
        const user = await db.query('UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *', [name, password, id])
        res.json(user.rows[0])
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM users WHERE id=$1', [id])
        res.json('successfully deleted')
    }
}

module.exports = new UserController();