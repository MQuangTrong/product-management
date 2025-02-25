const express = require("express");
const router = express.Router()
const multer = require('multer')

const upload = multer()

const controller = require("../../controllers/admin/product-category.controller")
const validate = require("../../validates/admin/product-category.validate")
const uploadCLoud = require("../../middlewares/admin/uploadCloud.middleware")

router.get('/', controller.index);

router.get('/create', controller.create);

router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCLoud.upload,
    validate.createPost,
    controller.createPost
);

router.get('/edit/:id', controller.edit);

router.patch(
    "/edit/:id",
    upload.single('thumbnail'),
    uploadCLoud.upload,
    validate.createPost,
    controller.editPost
);

module.exports = router

