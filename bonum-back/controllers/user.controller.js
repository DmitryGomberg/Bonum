const db = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = 'vasilukmother';
const REFRESH_TOKEN_SECRET = 'vasilukmother';
let refreshTokens = [];

class UserController {
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
        const {id, email, password} = req.body;
        const user = await db.query('UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *', [email, password, id])
        res.json(user.rows[0])
    }

    async deleteUser(req, res) {
        const id = req.params.id;
        await db.query('DELETE FROM users WHERE id=$1', [id])
        res.json('successfully deleted')
    }

    async loginUser(req, res)  {
        const { email, password } = req.body;

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: 'Email and password must be strings' });
        }

        try {
            const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (user.rows.length === 0) {
                return res.status(400).json({ error: 'User not found' });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
            refreshTokens.push(refreshToken);
            res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.json({ message: 'Login successful' });
        } catch (err) {
            console.error('Error logging in user:', err);
            res.status(500).json({ error: err.message });
        }
    }

    async registrUser(req, res) {
        const { email, password } = req.body;
        try {
            const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newPerson = await db.query(
                'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
                [email, hashedPassword]
            );

            const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });
            refreshTokens.push(refreshToken);
            res.cookie('refreshToken', refreshToken, { httpOnly: true });
            res.json({ accessToken });
        } catch (err) {
            console.error('Error creating user:', err);
            res.status(500).json({ error: err.message });
        }
    }

    tokenUser(req, res) {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return res.sendStatus(403);
        }
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign({ email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.json({ accessToken });
        });
    }

}

module.exports = new UserController();