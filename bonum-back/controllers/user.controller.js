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
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const user = await db.query(
                `SELECT * FROM users WHERE id = $1`,
                [parseInt(id, 10)]
            );

            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user.rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }

    async updateUser(req, res) {
        const {id, email, password} = req.body;
        const user = await db.query('UPDATE users SET email = $1, password = $2 WHERE id = $3 RETURNING *', [email, password, id])
        res.json(user.rows[0])
    }

    async updateUserInitials(req, res) {
        const {id, name, surname, username} = req.body;
        const user = await db.query('UPDATE users SET name = $1, surname = $2, username = $3 WHERE id = $4 RETURNING *', [name, surname, username, id])
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
                return res.status(400).json({ error: 'User not cd found' });
            }

            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if (!validPassword) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            const accessToken = jwt.sign({ email, id: user.rows[0].id }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            console.log('Сгенерированный токен:', accessToken);
            const refreshToken = jwt.sign({ email, id: user.rows[0].id }, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

            refreshTokens.push(refreshToken);
            res.cookie('accessToken', accessToken, { httpOnly: false, secure: false, sameSite: 'Strict', path: '/' });
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
                'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
                [email, hashedPassword, email]
            );

            const userId = newPerson.rows[0].id;

            // Define parent categories
            const parentCategories = [
                { name: 'Еда' },
                { name: 'Транспорт' },
                { name: 'Доход' },
            ];

            // Insert parent categories and store their IDs
            const parentCategoryIds = {};
            for (const category of parentCategories) {
                const insertedCategory = await db.query(
                    'INSERT INTO categories (name, user_id, parent_id) VALUES ($1, $2, $3) RETURNING id',
                    [category.name, userId, null]
                );
                parentCategoryIds[category.name] = insertedCategory.rows[0].id;
            }

            // Define child categories with their parent names
            const childCategories = [
                { name: 'Продукты', parent_name: 'Еда' },
                { name: 'Рестораны', parent_name: 'Еда' },
                { name: 'Мойка', parent_name: 'Транспорт' },
                { name: 'Заправка', parent_name: 'Транспорт' },
                { name: 'Зарплата', parent_name: 'Доход' },
                { name: 'Алименты', parent_name: 'Доход' },
            ];

            // Insert child categories using parent IDs
            for (const category of childCategories) {
                const parentId = parentCategoryIds[category.parent_name];
                await db.query(
                    'INSERT INTO categories (name, user_id, parent_id) VALUES ($1, $2, $3)',
                    [category.name, userId, parentId]
                );
            }

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