const express = require("express");
const router = express.Router()
const multer = require('multer')
const storageMulter = require('../../helpers/storeageMulter')
const upload = multer({ storage: storageMulter()})

const controller = require("../../controllers/admin/product.controller")
const controllerDeleted = require("../../controllers/admin/productDeleted.controller")
const validate = require("../../validates/admin/product.validate")

router.get('/', controller.index);

//:status: truyen status động
router.patch('/change-status/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti)

//Delete
router.delete('/delete/:id', controller.deleteItem)

//Create
router.get("/create", controller.create);
router.post(
    "/create", 
    upload.single('thumbnail'), 
    validate.createPost,
    controller.createPost
);

//Edit
router.get("/edit/:id", controller.edit);
router.patch(
    "/edit/:id", 
    upload.single('thumbnail'), 
    validate.createPost,
    controller.editPatch
);

//Detail
router.get("/detail/:id", controller.detail);

//router restore product deleted
router.get('/products-deleted', controllerDeleted.productsDeleted);
router.patch('/products-deleted/restore/:id', controllerDeleted.restoreItem);
router.patch('/products-deleted/change-multi', controllerDeleted.changeMulti)
//end router router restore product deleted

module.exports = router

