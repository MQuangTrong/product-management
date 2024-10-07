const express = require("express");
const router = express.Router()

const controller = require("../../controllers/client/product.controller")

//Trang chủ
router.get('/', controller.index);

//Detail
router.get('/:slug', controller.detail)

module.exports = router

