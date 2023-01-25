const mongoose  = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

class mongodb {
    constructor(){
        this.userSchema = mongoose.Schema({
          username :{
                type:String,
                required:true
            },
            userProfile :{
                type:String,
                required:false
            },
            userdetails :{
              type:String,
              required:false
          },
            userEmail :{
                type:String,
                required:true
            },
           userpassword:{
            type:String,
            required:true
        }
        });
        this.userSchema.plugin(passportLocalMongoose);

        this.blogCommentsSchema = mongoose.Schema({
            name:String,
            comment:String
          });

        this.blogschema = mongoose.Schema( {
            author:{
              type:String,
            },
            postDate:{
              type:String,
            },
            postTitle:{
              type:String,
              required:true
            },
            postPic:{
              type:String,
              required:true
            },
            postsubTitle:{
              type:String,
              required:true
            },
            postbody:{
              type:String,
              required:true
            },
            blogPostComments:[this.blogCommentsSchema]
          });
 
          this.user = mongoose.model("user", this.userSchema);
          passport.use(this.user.createStrategy());

          this.blogPost = mongoose.model("blogPost", this.blogschema);
          this.blogComment = mongoose.model("comment", this.blogCommentsSchema);
    }

    save(){

    };

 
}


module.exports = mongodb;