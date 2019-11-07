const express = require('express')
const bodyParser= require('body-parser')
const Post = require('./models/post');
const mongoose = require("mongoose");
const multer = require("multer");
const User = require('./models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("./middleware/check-auth");


const MIME_TYPE_MAP ={
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}


const app = express()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb (null, name + '-' + Date.now() + '.' + ext);
  }
});

mongoose.connect("mongodb+srv://muqriz:Wua4LxlPKZpVXjVx@cluster0-sanqr.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to database");
  })
  .catch (() => {
    console.log("Connection failed");

  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,DELETE,PATCH,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

app.post('/api/posts',checkAuth,multer({storage: storage}).single("image"),(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    console.log(post);
    res.status(200).json({
      message: "Post added successfully",
      postId: createdPost._id
    });
  });

});


app.delete('/api/posts/:id',checkAuth, (req,res,next)=> {
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({message: "Post deleted!"});

  })
});

app.put('/api/posts/:id', checkAuth, (req,res,next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id},post).then(result =>{
    console.log(result);
    res.status(200).json({message: "Update successful!"});
  });
});

app.get('/api/posts/:id', (req,res,next)=>{
  Post.findById(req.params.id).then(post => {
    if (post){
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found'});
    }
    })
})

app.use('/api/posts',(req,res,next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Post fetched successfully",
      posts: documents
    });
  })
});

app.post('/api/user/login', (req, res, next) => {
  let fetchedUser; //let is used because no value is assigned
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user){
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result){
        return res.status(401).json({
          message: 'Wrong password'
        });
      }
      const token = jwt.sign(
        {email: fetchedUser.email, userId: fetchedUser._id},
        'secret_this_should_be_longer',
        {expiresIn: '1h'}
      );
      res.status(200).json({
        token: token
      })
    })
    .catch (err => {
      return res.status(401).json({
        message: 'Auth failed'
      })
    })
})

app.post('/api/user/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: 'User created',
            result:result
          });
        })
        .catch(err => {
          res.status(500).json({
            error:err
          });
        });
    });
});




module.exports = app;
