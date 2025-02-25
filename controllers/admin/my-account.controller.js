const md5 = require("md5")
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system")

// [GET] /admin/my-account
module.exports.index = (req, res) => {
    res.render('admin/pages/my-account/index', {
        pageTitle: "Thông tin cá nhân"
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = (req, res) => {
    res.render('admin/pages/my-account/edit', {
        pageTitle: "Thông tin cá nhân"
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    try {
        const id = res.locals.user.id
        const emailExist = await Account.findOne({
            _id: { $ne: id},
            email: req.body.email,
            deleted: false
        })
        
        if(emailExist) {
            req.flash("error", `Email ${req.body.email} đã tồn tại`)
            res.redirect("back")
        } else {
            if (req.body.password) {
                req.body.password = md5(parseInt(req.body.pasword))
            } else {
                delete req.body.password
            }
        
            await Account.updateOne({_id: id}, req.body)
            req.flash("success", "Cập nhật thành công")
            res.redirect("back")
        }
    } catch (error) {
        console.log(error)
        res.redirect(`${systemConfig.prefixAdmin}/my-account`)
    }
}