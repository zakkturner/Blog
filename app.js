var bodyParser  = require("body-parser"),
methodOverride  = require("method-override"),
expressSanitizer= require("express-sanitizer"),
express         = require("express"),
mongoose        = require("mongoose"),
app             = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/ MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model ("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1475710534222-6165a8b45449?dpr=1&auto=compress,format&fit=crop&w=767&h=511&q=80&cs=tinysrgb&crop=",
//     body: "Hello"
// });


//Restful Routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});
//Index Route
app.get("/blogs", function(req, res){
    //retreive blogs
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error");
        } else {
            //render index with data
            res.render("index", {blogs : blogs});
        }
    });
});
// New Route
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//Create Route
app.post("/blogs", function(req,res){
    //create blog
    console.log(req.body);
    req.body.blog.body = req.sanitize( req.body.blog.body);
     console.log("==================");
    console.log(req.body);
    Blog.create(req.body.blog,function (err, newBlog) {
        if(err){
        res.render("new");
            
        } else {
            //redirect
            res.redirect("/blogs");
        }
    });
});

//SHOw Route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
        
        
    });
});

//EDIT Route
app.get("/blogs/:id/edit",function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if(err){
            res.redirect("/blogs")
        } else{
            res.render("edit", {blog: foundBlog})
        }
    })
});

//Update Route
app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize( req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});


//Delete Route
app.delete("/blogs/:id", function (req, res) {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs")
        }
    })
    //redirect
})

app.listen(process.env.PORT, process.env.IP, function () {
    console.log("Server is running bro");
})