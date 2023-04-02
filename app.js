const express  = require('express');
const session  = require('express-session');
const DBsession = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const Router = require('./Routes/Routes');

const app	= express();

const DBuri = "";// Ex: mongodb://127.0.0.1:27017/DB name

mongoose.connect(DBuri,{
    useNewUrlParser: true,
    useCreateIndex: true ,
    useUnifiedTopology: true
}).then(() => console.log("Mongodb Connected"))


const store = new DBsession({uri:DBuri , collection: "sessions"}) 

app.use('/public', express.static('public'));
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true}));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store ,//
    cookie:{maxAge:  1000 * 60 * 60 * 24} // 24h 
}));

app.use(Router);


app.listen(3000, () => console.log("Listening on port 3000"));
