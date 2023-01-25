const _ = require("lodash")
const mongodb = require("../model/models")
const bcrypt = require("bcryptjs");
const { response } = require("express");
const salt_rounds = 10;

const db = new mongodb();

const HomeView = (req, res) => { 
  db.blogPost.find({},(err, foundposts) =>{
        if (err) {
          console.log(err);
        } else {
          const foundpostss = foundposts.reverse() 
          res.render("home", {posts:foundpostss})
        }
      } ); 
};

const SearchBlog = (req, res) => { 
  db.blogPost.find({$text:{$search:req.body.searchterm}},(err, foundposts) =>{
        if (err) {
          console.log(err);
        } else {
          
          res.render("search", {posts:foundposts})
        }
      } ); 
};

const getContact = (req, res) => {
  res.render("contact")
};

const getAbout =  (req, res) => {
  res.render("about")
};

const getComposeBlogpost = (req, res) => {
    res.render("compose")
}

const composeBlogpost = (req, res) => {
  const image = req.file
  const  postPic = image.path
  db.user.findOne({username:req.body.author}, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      let blogPostcreated = new db.blogPost({
        author:req.body.author, 
        postDate:req.body.date,
        postTitle:req.body.title,
        postPic:postPic,
        postsubTitle:req.body.SubTitle,
        postbody:req.body.content,
      });
      blogPostcreated.save();
      console.log(blogPostcreated);
    }
  })
  res.redirect("/")
};

const getAblogpost =  (req, res) =>{
  let requestedtitle = _.lowerCase(req.params.postName)
  console.log(requestedtitle);

  db.blogPost.find({},(err, foundposts) => {
    if(err){
      console.log(err);
    }else{
    foundposts.forEach((post) => {
    const storedtitle = _.lowerCase(post.postTitle)
    if (requestedtitle === storedtitle) {
      res.render('blog', {requestedPost:post})
    }
  })
}
})
}

const postComment = (req, res) => {
  let CemmentedBlogId = req.body.commentblog

  const NewComment =new db.blogComment ({
    name:req.body.name,
    comment:req.body.comment
  });
  console.log(CemmentedBlogId);
  
  
  db.blogPost.findOne({_id:CemmentedBlogId}, (err, post) => {
    console.log(post);
    const blogPosTtle = post.postTitle
    if(err){
     console.log(err);
    }else{
      post.blogPostComments.push(NewComment);
      post.save()
    //   db.blogPost.update(
    //     { _id : CemmentedBlogId},
    //     { $set: {"blogPostComments":NewComment}}
    // )
      res.redirect("/posts/" + blogPosTtle)
    }
  })
}

const registerView =(req, res) => {
  res.render("register")
}

const loginView = (req, res) => {
res.render("login")
};

const LogoutView = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};


const register_user = (req, res) => {
   const username = req.body.username
   const userEmail = req.body.userEmail 
   const  userProfile = req.body.userProfile 
   const userdetails = req.body.userDetails
   const userpassword = req.body.password 

   db.user.findOne({userEmail:userEmail})
   .then(founduser => {
    if (founduser) {
      return res.redirect("/register")
    }
    return bcrypt
    .hash(userpassword, salt_rounds)
    .then(hashedpassword => {
      const newuser = new db.user({
        username:username,
        userEmail:userEmail,
        userProfile:userProfile,
        userdetails:userdetails,
        userpassword:hashedpassword
      })

      return newuser.save();
    })
    .then(result =>{
      res.redirect("/login")
    })
  }).catch(err => {
    console.log(err);
  })
      
}

const login_user = (req, res) => {
    username= req.body.username,
    password= req.body.password
    db.user.findOne({ username: username })
    .then(user => {
      if (!user) {
        // req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.userpassword)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/compose');
            });
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
}
module.exports ={HomeView, getAbout, getContact, getComposeBlogpost, composeBlogpost, SearchBlog,
                 getAblogpost, postComment, register_user, registerView, loginView, LogoutView , login_user, db};