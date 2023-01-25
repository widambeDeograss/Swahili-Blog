const express = require("express");
const isauth = require("../middleware/is_auth")
const router = express.Router();
const {HomeView, getAbout, getContact, getComposeBlogpost, composeBlogpost, SearchBlog,
    getAblogpost, postComment, register_user, registerView, loginView, LogoutView , login_user} = require("../controllers/blogControler")

router.get("/" , HomeView );

router.get("/about", getAbout);
  
router.get("/contact", getContact);
  
router.get("/compose", isauth, getComposeBlogpost);

router.post("/compose", composeBlogpost);

router.post("/findBlogPost", SearchBlog);

router.get ("/posts/:postName", getAblogpost)

router.post("/posts", postComment);

router.get("/register", registerView);

router.post("/register", register_user);

router.get("/login", loginView);

router.post("/login", login_user);

router.post("/logout", LogoutView);

module.exports = router;