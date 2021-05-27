//impoting libraries and configuring them
const express = require("express");
const BSON = require('bson');
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
const secret = process.env.SECRET || "Portfolio";
app.use(session({secret : secret}))
//Setting Up DataBase Connections
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_URL || "mongodb+srv://CodingBlood:K@rtik2002@cluster0.yi3ow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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
app.get('/SignOut',(req,res)=>{
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
            username: req.params.username
        };
        const post_details = await post_collection.find(post_query).sort({"Stars": 1});
        const allValues = await post_details.toArray();
        res.render('ControlCenter',{fname:udetail.fname,lname:udetail.lname,uname:udetail.username,postdetail:allValues.reverse()});
    }
})
app.get('/Secret',async(req,res)=>{
    if(!req.session.username){
        res.redirect('/Login');
    }else{
        res.redirect('/Secret/' + req.session.username)
    }
})

app.get('/TBlogs',async(req,res)=>{
    const post_collection = client.db("Portfolio").collection("BlogPost");
    const post_details = await post_collection.find({}).sort({"Stars": 1});
    const allValues = await post_details.toArray();
    res.render('TBlogs',{uname:req.session.username,postdetail:allValues.reverse()});
})
app.get('/GBlogs',async(req,res)=>{
    const post_collection = client.db("Portfolio").collection("BlogPost");
    const post_details = await post_collection.find({})
    const allValues = await post_details.toArray();
    res.render('TBlogs',{uname:req.session.username,postdetail:allValues.reverse()});
})
app.post('/Star/:id/:username',async(req,res)=>{
    if(!req.session.username){
        res.redirect('/Login');
    }else{
        const post_collection = client.db("Portfolio").collection("BlogPost");
        post_collection.updateOne({_id:BSON.ObjectId(req.params.id)},{
            $inc: {
                Stars: +1
            }
        }, (err,result) => {
            if(err) console.log(err);
            console.log(result)
        });
        //
        // post_collection.findOne({_id:BSON.ObjectId(req.params.id)}, (err, post) => {
        //     if(post){
        //         console.log("*VVHBK&*T^%", post)
        //     }
        //     if(err){
        //         console.log(err)
        //     }
        // });
        // itemsCollection.updateOne(query, update, options)
        // const allValues = await post_details.toArray();
        // console.log(allValues)
        // res.redirect('/Secret/' + req.params.username)
        res.redirect('back')
    }
})
app.post('/DownStar/:id/:username',async(req,res)=>{
    if(!req.session.username){
        res.redirect('/Login');
    }else{
        const post_collection = client.db("Portfolio").collection("BlogPost");
        post_collection.updateOne({_id:BSON.ObjectId(req.params.id)},{
            $inc: {
                DownStars: +1
            }
        }, (err,result) => {
            if(err) console.log(err);
            console.log(result)
        });
        //
        // post_collection.findOne({_id:BSON.ObjectId(req.params.id)}, (err, post) => {
        //     if(post){
        //         console.log("*VVHBK&*T^%", post)
        //     }
        //     if(err){
        //         console.log(err)
        //     }
        // });
        // itemsCollection.updateOne(query, update, options)
        // const allValues = await post_details.toArray();
        // console.log(allValues)
        // res.redirect('/Secret/' + req.params.username)
        res.redirect('back')
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
        DownStars : 0,
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