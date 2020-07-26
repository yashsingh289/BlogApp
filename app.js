var express =require("express"),
    mongoose =require("mongoose"),
    bodyParser=require("body-parser"),
    app      =express(),
    methodOverride =require("method-override"),
    expressSanitizer =require("express-sanitizer");
//app config
mongoose.connect("mongodb://localhost/restful_blog_app",{useNewUrlParser:true});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
//mongoose/model config
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);



//RESTful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//INDEX
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index",{blogs:blogs});
        }
    });
});
//NEW ROUTE
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            res.render("new");
        }
        else{
            //then,redirect to index
            res.redirect("/blogs");
        }
    });
    
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs")
        }
        else{
            res.render("show",{blog:foundBlog});
        }
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
        res.redirect("/blogs");
    } 
    else{
        res.render("edit",{blog:foundBlog});
    }
    });
});
//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBog){
     if(err){
         res.redirect("/blogs");
     }   
     else{
         res.redirect("/blogs/"+req.params.id);
     }
    });

});
//DESTROY ROUTE
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndDelete(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});




app.listen(4000,function(){
    console.log("Blog server working")
});

