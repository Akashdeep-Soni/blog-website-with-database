//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-akash:Test123@cluster0.znf1v.mongodb.net/blogDB", { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "Welcome to the blog website. Composing a post is just a button away. Press Compose Post button.";
const aboutContent = "I am a student pursuing my degree in computer science from Pranveer Singh Institure of Technology.";
const contactContent = "My Email: akashcomputer04@gmail.com";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){

  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if(!err) {
      res.redirect("/");
    }
  });

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post) { 
    res.render("post", {
      id: post._id,
      title: post.title,
      content: post.content
    });
  });
});

app.post("/delete", function(req, res) {
  const postId = req.body.delPostId;

  Post.findOneAndRemove({_id: postId}, function(err, result) {
    if(!err) {
      res.redirect("/");
    }
  })
})

const port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});


// Heroku Link
// https://vast-falls-24378.herokuapp.com/