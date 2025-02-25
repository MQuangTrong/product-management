const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ],
        description: String,
    }, {
    timestamps: true
}
);
const Cart = mongoose.model('Cart', cartSchema, "carts"); //Biến 3 là tên bảng trong sql

module.exports = Cart