const express = require("express");
const multer = require('multer')
const router = express.Router()

const upload = multer()

const controller = require("../../controllers/admin/my-account.controller")
const uploadCLoud = require("../../middlewares/admin/uploadCloud.middleware")

router.get('/', controller.index);

router.get('/edit', controller.edit);

router.patch(
    '/edit', 
    upload.single('avatar'),
    uploadCLoud.upload,
    controller.editPatch);

module.exports = router

