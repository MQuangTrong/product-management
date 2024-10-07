const express = require('express')
const methodOverride = require("method-override")
const bodyParser = require('body-parser')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()

const database = require("./config/database")
const systemCofig = require("./config/system")

const routeAdmin = require("./routes/admin/index.route")
const route = require("./routes/client/index.route")

database.connect()

const app = express()
const port = process.env.PORT

app.use(methodOverride("_method"))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Flash
app.use(cookieParser('ABABABABAB'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End Flash

//App locals variable
app.locals.prefixAdmin = systemCofig.prefixAdmin

app.use(express.static(`${__dirname}/public`));

//Route
routeAdmin(app)
route(app);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})