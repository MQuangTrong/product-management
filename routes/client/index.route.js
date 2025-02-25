const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")

module.exports = (app) => {
    //Tại bên clint không cần bảo mật như admin nên ghi như này được
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    
    app.use('/', homeRouter);

    app.use('/products', productRouter);

    app.use('/search', searchRouter);

    app.use('/cart', cartRouter);
    
}
