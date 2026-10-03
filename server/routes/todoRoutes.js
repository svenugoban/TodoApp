const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/todos', todoController.getTodos);
router.post('/todos', todoController.createTodo);
router.put('/todos/:id', todoController.updateTodo);
router.patch('/todos/:id/done', todoController.toggleDone);
router.delete('/todos/:id', todoController.deleteTodo);

module.exports = router;