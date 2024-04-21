const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articlesSchema);

/////////////////////////////// Requests Targeting All Articles /////////////////////////

app.route("/articles")

.get(function(req,res){
  Article.find()
         .then(function(foundArticles){
           res.send(foundArticles);
         });
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save()
            .then(function(result){
              res.send("Successfully added the new article to the database.")
            })
            .catch(function(err){
              res.send(err);
            });
})

.delete(function(req,res){
  Article.deleteMany()
         .then(function(result){
           res.send("Successfully deleted all the articles.")
         })
         .catch(function(err){
           res.send(err);
         });
});

/////////////////////////////// Requests Targeting A Specific Article /////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){
    Article.findOne({ title: req.params.articleTitle })
           .then(function(foundArticle){
             if(foundArticle)
             {
               res.send(foundArticle);
             }
             else{
               res.send("No such article found!")
             }
           });
})

.put(function(req,res){
  Article.findOneAndUpdate(
     { title: req.params.articleTitle },
     { title: req.body.title, content: req.body.content},
     { overwrite : true}
   )
   .then(function(result){
     if(result){
       res.send("Successfully updated the article!");
     }
   });
})

.patch(function(req,res){
  Article.findOneAndUpdate(
    { title: req.params.articleTitle },
    { $set: req.body}
  )
  .then(function(result){
    if(result)
    {
      res.send("Successfully updated the article!");
    }
  });
})

.delete(function(req,res){
  Article.deleteOne({ title: req.params.articleTitle})
         .then(function(result){
           if(result){
             res.send("Successfully deleted the corresponding article!");
           }
         });
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
