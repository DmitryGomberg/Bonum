const Router = require('express');
const router = new Router();
const categoriesController = require('../controllers/categories.controller');

// создание категории
router.post('/create', categoriesController.createCategory);

// редактирование категории
router.put('/edit', categoriesController.editCategory);

// удаление категории
router.delete('/delete', categoriesController.deleteCategory);

// получение категории
router.get('/get', categoriesController.getCategory);

module.exports = router;