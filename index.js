//impoting libraries and configuring them
const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const path = require('path');
const ejsMate = require('ejs-mate');
const e = require("express");
app.use(express.urlencoded({encoded: true}))
app.engine('ejs',ejsMate)
// Declaring Folders for css and image files
app.use( express.static( "public" ) );
app.use( express.static("views/CSS") );


// User Authentication via Hashing and Salting
const hashpassword = async(pw)=>{
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pw, salt);
    console.log(salt);
    console.log(hash);
}
const login = async(pw, hashpassword)=>{
    const result = await bcrypt.compare(pw, hashpassword)
    if(result){
        console.log("Match");
    }else{
        console.log("TRY AGAIN");
    }
}
login("monkey","$2b$10$1V5zFenClUv1S80NL80Nx.3fi.G7/shWdVRzLPFE0poXdDM8RFFce")

// Routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/Login', (req,res)=>{
    res.render('login')
})
app.post('/SignUp',(req,res)=>{
    console.log(req.body)
    res.render('login')
})
app.get('/SignUp',(req,res)=>{
    res.render('signup')
})
app.listen(3000, ()=>{
    console.log("Server Started!")
})