const ProductCategory = require("../../models/product-category.model")
const systemConfig = require("../../config/system")
const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const createTreeHelper = require("../../helpers/create-tree")

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    //filter status
    const filterStatus = filterStatusHelper(req.query)
    if (req.query.status) {
        //thêm vào object
        find.status = req.query.status
    }

    //search
    const objectSearch = searchHelper(req.query)
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    //pagination
    const countProductCategory = await ProductCategory.countDocuments(find)

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    }, req.query, countProductCategory)
    //End pagination

    //Sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        {
            sort.position = "desc"
        }
    }
    //End Sort

    const records = await ProductCategory.find(find)
        .sort(sort)
    const newRecords = createTreeHelper.tree(records)

    res.render('admin/pages/products-category/index', {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records)

    res.render('admin/pages/products-category/create', {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    })
}

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
   const permissions = res.locals.role.permissions
   //Dùng điều kiện để kiểm tra nếu ko có quyền ko thực hiện đc thêm dữ liệu
   if(permissions.includes("products-category_create")) {
        if (req.body.position == "") {
            const countProducts = await ProductCategory.countDocuments()
            req.body.position = countProducts + 1
        } else {
            req.body.position = parseInt(req.body.position)
        }

        const record = new ProductCategory(req.body)
        await record.save()

        req.flash('success', `Tạo mới danh mục thành công`);
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    } else {
        return
    }
}

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id =req.params.id

        const data = await ProductCategory.findOne({_id: id}, {deleted: false})

        const records = await ProductCategory.find({deleted: false})
        const newRecords = createTreeHelper.tree(records)

        res.render('admin/pages/products-category/edit', {
            pageTitle: "Chỉnh sủa danh mục sản phẩm",
            data: data,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`)
    }
    
}

//[PATCH] /admin/products-category/edit/:id
module.exports.editPost = async (req, res) => {
    const permissions = res.locals.role.permissions
    if(permissions) {
        try {
            const id =req.params.id
    
            req.body.position = parseInt(req.body.position)
            await ProductCategory.updateOne({_id: id}, req.body)
            req.flash('success', `Chỉnh sửa danh mục thành công`);
            res.redirect("back")
        } catch (error) {
            res.redirect(`${systemConfig.prefixAdmin}/products-category`)
        }
    } else {
        return
    }
}