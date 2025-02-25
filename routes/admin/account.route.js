const express = require("express");
const router = express.Router()
const multer = require('multer')

const upload = multer()

const controller = require("../../controllers/admin/account.controller")
const uploadCLoud = require("../../middlewares/admin/uploadCloud.middleware")
const validate = require("../../validates/admin/account.validate")

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    '/create', 
    upload.single('avatar'),
    uploadCLoud.upload,
    validate.createPost,
    controller.createPost);

router.get('/edit/:id', controller.edit);

router.patch(
    '/edit/:id', 
    upload.single('avatar'),
    uploadCLoud.upload,
    validate.editPatch,
    controller.editPatch);

module.exports = router

