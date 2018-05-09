const express = require("express");
const router = express.Router();
const FileControl = require('../controllers/FileControler')
const auth = require('../middlewares/auth')

router.get('/list', FileControl.listAll)
router.get('/list/:nameType', FileControl.listCategory)
router.get('/download/:fileId', FileControl.download)
router.post('/upload', FileControl.upload)
router.delete('/delete/:fileId', auth, FileControl.delete)


module.exports = app => app.use("/files", router);