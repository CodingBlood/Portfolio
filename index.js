//impoting libraries and configuring them
const express = require("express");
const session = require('express-session')
const app = express();
let alert = require('alert');
const bcrypt = require('bcrypt');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require("mongoose");
const User = require('./views/models/users')
const BlogPost = require('./views/models/post')
app.use(express.urlencoded({encoded: true}))
app.engine('ejs',ejsMate)
// Declaring Folders for css and image files
app.use( express.static( "public" ) );
app.use( express.static("views/CSS") );
app.use(session({secret : "Portfolio"}))
//Setting Up DataBase Connections
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://CodingBlood:K@rtik2002@cluster0.yi3ow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("Portfolio").collection("UserData");
  // perform actions on the collection object
});

// User Authentication via Hashing and Salting
// const hashpassword = async(pw)=>{
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(pw, salt);
// }
// const login = async(pw, hashpassword)=>{
//     const result = await bcrypt.compare(pw, hashpassword)
//     if(result){
//         console.log("Match");
//     }else{
//         console.log("TRY AGAIN");
//     }
// }
// login("monkey","$2b$10$1V5zFenClUv1S80NL80Nx.3fi.G7/shWdVRzLPFE0poXdDM8RFFce")

// Routes
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'))
app.get('/', (req,res)=>{
    res.render('index')
})
app.post('/Login', async(req,res)=>{
    const {uname, pass} = req.body;
    const query = {
        username: uname,
    };
    const collection = client.db("Portfolio").collection("UserData");
    const udetail = await collection.findOne(query);
    const login = async(pw, hashpassword)=>{
        const result = await bcrypt.compare(pw, hashpassword)
        if(result){
            req.session.username=uname;
            res.redirect('/Secret/' + uname)
        }else{
            console.log("TRY AGAIN");  
            alert("Wrong UserID or Password");
        }
    }
    login(req.body.pass,udetail.password);
})
app.get('/Login', (req,res)=>{
    res.render('login')
})
app.post('/SignUp', async(req,res)=>{
    const {fname , lname, email, uname, pass} = req.body;
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(pass, salt);
    const user = new User({
        username: uname,
        password : hash,
        fname: fname,
        lname: lname,
        email: email
    })
    const collection = client.db("Portfolio").collection("UserData");
    const result = await collection.insertOne(user);
    req.session.username=uname;
    res.redirect('/Secret/' + uname)
})
app.get('/SignUp',(req,res)=>{
    res.render('signup')
})
app.post('/SignOut',(req,res)=>{
    req.session.username=null;
    res.redirect('/');
})
app.get('/Secret/:username',async(req,res)=>{
    if(!req.session.username){
        res.redirect('/Login');
    }else{
        const query = {
            username: req.params.username,
        };
        const collection = client.db("Portfolio").collection("UserData");
        const udetail = await collection.findOne(query);
        const post_collection = client.db("Portfolio").collection("BlogPost");
        const post_query = {
            visibility : 'v'
        };
        const post_details = await post_collection.find({});
        const allValues = await post_details.toArray();
        console.log(allValues)
        // while (await post_details.hasNext()) {
        //     await post_details.next();
        // }
        // const data= {}
        // await post_details.forEach(data = data + console.dir());
        res.render('ControlCenter',{fname:udetail.fname,lname:udetail.lname,uname:udetail.username,postdetail:allValues.reverse()});
    }
})

app.post('/Post/:username', async(req,res)=>{
    const {desc , tittle} = req.body;
    console.log("yooo"+req.body)
    const blogpost = new BlogPost({
        username: req.params.username,
        Tittle : tittle,
        Description: desc,
        Stars : 0,
        visibility : 'v'
    })
    const collection = client.db("Portfolio").collection("BlogPost");
    const result = await collection.insertOne(blogpost);
    const add= '/Secret/'+req.params.username
    res.redirect(add)
})
app.listen(3000, ()=>{
    console.log("Server Started!")
})