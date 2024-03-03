var User = require("../../model/User");
var Token = require("../../model/Token");
var bcrypt = require("bcrypt");
var multer = require('multer');
var jwt = require('jsonwebtoken');
const { authorization, checkAdmin } = require('../../middleware/index');
const author = require("../../model/author");
const article = require("../../model/article");
var slugify = require('slugify')

module.exports = function(app, objJson,isEmailValid){
    // const newAuthor = new author({
    //     name:"minh Tien",
    //     email:"tien123@gmail.com",
    //     password:"1234",
    //     dateOfBirth:Date.now(),
    //     // articleID: 123
    // })
    // newAuthor.save().then(()=>{
    //     console.log("luu thanh cong author ");
    // })
    app.get("/index1", (req, res)=>{
        res.render("pages/index.ejs");
    })
    app.get("/index", authorization, (req, res)=>{
        return res.render("pages/index1.ejs", {Avatar: req.avt})
    })
    app.get("/login", (req, res)=>{
         res.render("pages/login.ejs")
            // .json({ user: { id: req.userId, Avatar: req.avt } });
    })
    app.get("/signup",(req, res)=>{
        res.render("pages/signup.ejs");
    })
    app.get("/bmcntt",(req, res)=>{
        res.render("masters.ejs",{page:"bmcntt"});
    })
    app.post("/Register",(req,res)=>{
        var email = req.body.Email;
        var password = req.body.Password;
        var name = req.body.Name;
        var address = req.body.address;
        var mobile = req.body.mobile;
        if(!email || !password){
            // res.json({result:0,message:"Register wrong parameters"});
            console.log("error");
        }else{
            User.findOne({Email:email}).then((data)=>{
                if(data!=null){
                    res.json({result:0,message:"User is not availble."});
                }else{
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(password, salt, function(err, hash) {
                            if(err){
                                res.json({result:0,message:"Password hash error."});
                            }else{
                                const NewUser = new User({
                                    Email:email,
                                    Password:hash,
                                
                                    Avatar:"avatar.png",
                                    Name:name,
                                    address:address,
                                    mobile:mobile,
                                    Active:true,
                                    RegisterDate:Date.now(),
                                    userType:0 // 0 user , 1 admin
                                });
                                NewUser.save().then((data)=>{
                                    res.json({result:1,message:"User Register Succesfully!",data:data});
                                    // console.log("User Register Succesfully!",data);
                                }).catch((err)=>{
                                    // res.json({result:0,message:"User Register Error.",error:err});
                                    console.log("User Register Error.",err);
                                })
                            }
                        });
                    });
                }
            }).catch((Err)=>{
                res.json({result:0,message:"Find error."});
            })
        }
    });
    app.post("/login",(req, res)=>{
        if(!req.body.Email||!req.body.Password){
            res.json({result:0, message:"Loi thong so!!!"});
        }else{
            var email = req.body.Email;
            var password = req.body.Password;
            User.findOne({Email:email})
            .then((user)=>{
                if(user !=null){
                    bcrypt.compare(password, user.Password, function(err, result) {
                        if(err){
                            res.json({result:0,message:"Kiem tra thong so khong hop le!!!"});
                        }else{
                            console.log(result);
                            if(result===true){
                                user.Password = "tim cc!!!";
                                jwt.sign({
                                    UserId: user._id,email, avatar: user.Avatar, userType: user.userType
                                  }, objJson.secretKey, { expiresIn: 60*60 },function(errT, token){
                                        if(errT){
                                            res.json({result:0, message:"Token khong hop le!!!"});
                                        }else{
                                            const data = jwt.verify(token, "jkasdhfu!#@$&$^@#!$!@#$1234");
                                            var newToken = new Token({
                                                Email:email,
                                                Token:token,
                                                Status:true,
                                                RegisterDate:Date.now(),
                                            });
                                            res.cookie('jwt', token, { secure: false });
                                            newToken.save()
                                            .then(()=>{
                                                res.json({result:1, message:"login thanh cong!!!",token:token, userType: data.userType});
                                            })
                                            .catch((err)=>{
                                                res.json({result:0, message:"luu token that bai",err})
                                            })
                                        }
                                  });
                            }
                        }
                    });
                }else{
                    res.json({result:0, message:"chua dang ky tai khoan!!!!"});
                }
            })
            .catch((err)=>{
                res.json({result:0, message:"khong tim thay tai khoan!!!!", err});
            })
        }
    })
    app.post("/Logout",(req,res)=>{
        var token = req.body.Token;
        if(!token){
            res.json({result:0,message:"Token in parameter"});
        }else{
            Token.findOneAndDelete({Token:token},{Status:false}).then(()=>{
                res.json({result:1,message:"Logout is successfully!"});
            }).catch((e)=>{
                res.json({result:0,message:"Logout is failed!"});
            })
        }
    });
    //munlter
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, randomIntFromInterval(0, 10000000) + "-" + file.originalname)
        }
    });
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file);
            if (file.mimetype == "image/bmp" || file.mimetype == "image/png"
                || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
                || file.mimetype == "image/git"
            ) {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("avatar");

     // show list views admin
     app.post("/listuser",(req,res)=>{
        User.find({userType:0}).then((data)=>{
            res.json({
                result:1,
                userdata:data
            })
        }).catch((e)=>{
            res.json({
                result:0
            })
        })
    });
    app.get("/admin", checkAdmin, (req,res,next)=>{
        res.render("./admin/index",{page:"home"});
    });
    app.get("/users",(req,res)=>{
        res.render("./admin/index",{page:"users"});
    });
    app.get("/lienhe",(req,res)=>{
        res.render("./pages/lienhe");
    });
    
    //author 
     // show list views authors
     app.post("/listauthor",(req,res)=>{
        author.find().then((data)=>{
            res.json({
                result:1,
                userdata:data
            })
        }).catch((e)=>{
            res.json({
                result:0
            })
        })
    });
    app.get("/authors", (req, res) => {
        res.render("./admin/index", {page: "authors"});
    });

    //bai viet
    app.get("/insertArticle", (req, res) => {
        res.render("./admin/index", {page: "addArticle"});
    });

    app.post("/addArticle", (req, res) => {
        upload(req, res, function (err) {
            console.log(req.body);
            var newArticle = new article({
                article_name:req.body.article_name,
                describe:req.body.describe,
                images: req.body.images,
                slug: slugify(req.body.article_name)
            });
            newArticle.save().then(()=>{
                console.log("save succes");
            })
            .catch((e)=>{
                console.log("save failed"+e);
            })
        });
    });

    app.get("article", (req, res) => {
        res.render("./admin/index", {page: "article"});
    });
    app.post("/listarticle",(req,res)=>{
        article.find().then((data)=>{
            res.json({
                result:1,
                userdata:data
            })
        }).catch((e)=>{
            res.json({
                result:0
            })
        })
    });

     // upload files
    //multer
    //random number
    function randomXToY(minVal, maxVal) {
        var randVal = minVal + (Math.random() * (maxVal - minVal));
        return Math.round(randVal);
    }
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/upload')
        },
        filename: function (req, file, cb) {
            cb(null, randomXToY(10, 999) + "-" + file.originalname)
        }
    });
    var upload = multer({
        storage: storage,
        fileFilter: function (req, file, cb) {
            console.log(file);
            if (file.mimetype == "image/bmp"
                || file.mimetype == "image/png"
                || file.mimetype == "image/gif"
                || file.mimetype == "image/jpg"
                || file.mimetype == "image/jpeg"
            ) {
                cb(null, true)
            } else {
                return cb(new Error('Only image are allowed!'))
            }
        }
    }).single("avatar");

    app.post("/uploadfile", function (req, res) {

        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({ result: 0, message: "A Multer error occurred when uploading." });
            } else if (err) {
                res.json({ result: 0, message: "An unknown error occurred when uploading." });
            } else {
                console.log(req.file); // Thông tin file đã upload
                res.json({ result: 1, message: "Upload is okay", info: req.file });
            }

        });
    });
}