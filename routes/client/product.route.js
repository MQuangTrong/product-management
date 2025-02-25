const express = require("express");
const router = express.Router()

const controller = require("../../controllers/client/product.controller")

//Trang chủ
router.get('/', controller.index);

router.get("/:slugCategory", controller.category)

//Detail
router.get('/detail/:slugProduct', controller.detail)

module.exports = router

