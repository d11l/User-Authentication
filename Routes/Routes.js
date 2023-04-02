const Router  = require('express').Router();
const userModel = require('../Models/user');
const bcrypt = require('bcrypt');


const isAuth = (req, res, next) => req.session.isAuth ? next() : res.redirect('/login');
  
    
Router.get('/login'    , (req, res) => res.render("login"))   
Router.get('/register' , (req, res) => res.render("register"));
Router.get('/home'     , isAuth, (req, res) => res.render("home"));
Router.get('/'         , (req, res) => res.redirect("/home"));

Router.get('/logout', (req, res) => {
    
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect("/login");
    })
    
});
    

Router.post('/register' , async (req, res) =>{
       
const {username, email, password} = req.body ;
    
    let user = await userModel.findOne({email})
    if(user) return res.redirect('/register');
     
    const hashPassword = await bcrypt.hash(password, 12);
    
    user = new userModel({
    username,
    email,
    password: hashPassword
    }); 
    
    await user.save();
    
    res.redirect("/login");
});
    
    
Router.post('/login' ,async (req, res) => {
    
    const {username , password} = req.body ;
    let user = await userModel.findOne({username})
    if(!user) return res.redirect('/login');
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch) return res.redirect('/login');
        
    req.session.isAuth = true;
    res.redirect("/home")
})
        

module.exports = Router;