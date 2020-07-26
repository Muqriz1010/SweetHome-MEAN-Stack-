const express = require ('express')
const bodyParser = require ('body-parser')
const Post = require('./models/post');
const mongoose = require("mongoose");
const multer = require("multer");
const path = require ("path");
const bcrypt = require ("bcrypt");
const User = require("./models/user");
const jwt = require('jsonwebtoken');
const checkAuth = require("./middleware/check-auth");
const Application = require("./models/application");

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

mongoose.connect("***")
  .then(() => {
    console.log('Connected to database');
  })
  .catch (() => {
    console.log('Connection failed');
  });



app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS, PUT");
  next();
});


app.post('/api/posts',checkAuth, multer({storage: storage}).single("image"),
 (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  const post = new Post({
    user: user,
    residencename: req.body.residencename,
    state: req.body.state,
    address: req.body.address,
    size: req.body.size,
    price: req.body.price,
    owner: req.user.email,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost =>{
    console.log(post);
    res.status(200).json({
    message: 'Post added successfully',
    post: {
      ...createdPost,
      id: createdPost._id,

    }
  });
  });
});
});

app.put(
  '/api/posts/:id',
  checkAuth,
  multer({storage: storage}).single("image"),
  (req,res,next) =>{
    const post = new Post({
      _id: req.body.id,
      residencename: req.body.residencename,
      state: req.body.state,
      address: req.body.address,
      size: req.body.size,
      price: req.body.price
    });

  Post.updateOne({_id: req.params.id},post)
    .then(result =>{
    res.status(200).json({message: 'Update successful!',
    result:result});
  });
});

app.put(
  '/api/view/:id',
  checkAuth,
  (req,res,next) =>{
  Application.updateOne({_id: req.params.id} ,{$set : {status: "Approved"}})
    .then(result =>{
    res.status(200).json({message: 'Update successful!',
    result:result});
  });
});

app.put(
  '/api/view/reject/:id',
  checkAuth,
  (req,res,next) =>{
  Application.updateOne({_id: req.params.id} ,{$set : {status: "Rejected"}})
    .then(result =>{
    res.status(200).json({message: 'Update successful!',
    result:result});
  });
});

app.get('/api/posts', checkAuth, (req, res,next)=>{
  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  Post.find({user: user}).then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: documents
    });
  })
})
});

app.get('/api/findhouses', checkAuth, (req, res,next)=>{
  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  Post.find({user: { $ne: user}}).then(documents => {
    res.status(200).json({
      message: 'Post fetched successfully',
      posts: documents
    });
  })
})
});

app.get('/api/viewapplications', checkAuth, (req, res,next)=>{
  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  Application.find({applicant: user}).populate('applicant')
  .populate('residence')
  .exec()
  .then(documents => {
    res.status(200).json({
      message: documents,
      applications: documents
    })
  })
  })
});

app.get('/api/viewrequests', checkAuth, (req, res,next)=>{
  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  Post.find({user: user})
    .then(post => {
      if (!post) throw new Error('No setup residence Found');
  Application.find({residence: post}).populate('applicant')
  .populate('residence')
  .exec()
  .then(documents => {
    res.status(200).json({
      message: documents,
      applications: documents
    })
  })
  })
  })
});




app.post('/api/applyhouse', checkAuth,(req, res, next)=> {

  User.findById(req.user.userId)
    .then(user => {
      if (!user) throw new Error('User not Found');
  Post.findById(req.body.postId)
    .then(post => {
      if (!post) throw new Error('Post not Found' + req.body.postId);
  const application = new Application({
    applicant: user,
    residence: post,
    applicationdate: '12/2/1994',
    stayfrom: req.body.from,
    stayto: req.body.to,
    status: 'pending',
  });
  application.save().then(createdApplication =>{
    console.log(application);
    res.status(200).json({
    message: 'Post added successfully',
    application: {
      ...createdApplication,
      id: createdApplication._id,

    }
  });
  });
  })
});
});


app.get('/api/posts/:id', (req,res,next)=>{
  Post.findById(req.params.id).then(post =>{
    if (post){
      res.status(200).json(post);
    } else{
      res.status(404).json({message: 'Post not found'});
    }
  })
})

app.get('/api/applyhouse/:id', (req,res,next)=>{
  Post.findById(req.params.id).then(post =>{
    if (post){
      res.status(200).json(post);
    } else{
      res.status(404).json({message: 'Post not found'});
    }
  })
})

app.delete(
  '/api/posts/:id',
  checkAuth,
  (req,res,next)=>{
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({message: "Post deleted!"});

  })

});

app.post('/api/user/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result =>{
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

app.post('/api/user/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user){
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      fetchedUser = user
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result){
        return res.status(401).json({
          message: 'Auth failed'
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
    });

})
})
//export for other module can import
module.exports = app;
