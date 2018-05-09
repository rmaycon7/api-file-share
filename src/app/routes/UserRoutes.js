const express = require("express");
const router = express.Router();
const UserControl = require('../controllers/UserController')
const auth = require('../middlewares/auth')

router.get('/', auth, UserControl.getAll)
router.get('/:userId', auth, UserControl.getById)
router.post('/', auth, UserControl.create)
router.patch('/:userId', auth, UserControl.update)
router.delete('/:userId', auth, UserControl.delete)


module.exports = app => app.use("/users", router);