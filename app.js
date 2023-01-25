const express = require("express");
const bodyParser = require("body-parser");
const mongoose  = require("mongoose")
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const approuter = require("./routes/routes");
const authrouter = require("./routes/auth");
const path = require("path");
const multer = require("multer");
const {db} = require("./controllers/blogControler")

const port = 3030;
const fileStorage = multer.diskStorage({
  destination:(req,file,cb) =>{
    cb(null, "images")
  },
  filename:(req, file, cb) => {
    cb(null, new Date().toDateString() + "-" + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" ||file.mimetype === "image/jpeg"  ){
    cb(null, true)
  }else{
    cb(null, false)
  }
}

const app = express();
// const db = new mongodb();
const store = new MongoDBStore({
    uri:"mongodb://localhost:27017/blogdb" ,
    collection: 'sessions'
  });

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage}).single("postPic"));
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.set("view engine", "ejs");

app.use(session({
    secret:" the secret cey for sessions",
    resave:false,
    saveUninitialized:false,
    store:store,
    // cookie:{secure:true}
}))

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
     db.user.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(err));
  });
  
  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();
  });

mongoose.connect("mongodb://localhost:27017/blogdb", {useNewUrlParser:true})
.then( () => {console.log("succesfully connected to mongodb");})
.catch(err => console.log(err));

app.use("", approuter);
// app.use("", authrouter);

app.listen(port, ()=> {
    console.log("the app is running on port " + port);
})