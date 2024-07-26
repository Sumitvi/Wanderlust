require('dotenv').config()
// console.log(process.env)

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./Models/listings.js");
const listing = require("./Models/listings.js");
const path = require("path");
const { count } = require("console");
const methodOverride = require("method-override");
const engine = require('ejs-mate');
const multer  = require('multer')
const {storage} = require("./cloudConfig.js")
const upload = multer({ storage })
const MongoStore = require('connect-mongo');


const wrapAsyanc = require("./utility/wrapAsync.js")
const ExpressError = require("./utility/ExpressError.js");
const Joi = require('joi');  //To Validate Schema We Use Joi Node Package
const ListingSchema = require("./schema.js");
const reviewSchema = require("./schema.js");
const Review = require("./Models/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./Models/user.js");
const { isLoggedIn} = require("./middleware.js")
const conrollers= require("./controllers/listings.js");
const reviewConrollers= require("./controllers/review.js");

app.use(methodOverride("_method"));

const MongoDB = process.env.ATLASDB_URL;

main().then(() => {
    console.log("Connected Sucessfully");
})
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MongoDB);
}

app.listen(port, () => {
    console.log("Server has Started");
})


// app.get("/testListing", async(req,res)=>{
//     let samplelisting = new Listing({
//         title:"Rooms for Family",
//         description:"2BHK",
//         price:15000,
//         location:"Pune",
//         contry:"india"
//     })

//    await samplelisting.save();
//    console.log(samplelisting);
//    res.send("Tested Sucessfully");
// })

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));  //GETTING MAJOR ERROR IN THIS FOR "SET" INSTEAD OF "USE"

// for Ejs Mate
app.engine('ejs', engine);


// way of using static file from public folder
app.use(express.static(path.join(__dirname, "/public")));


// ===============USING SESSION==============



let store = MongoStore.create({
    mongoUrl:MongoDB,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600 ,
})

store.on("error",()=>{
    console.log("Error On Mongo Session Store", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



// app.get("/", (req, res) => {
//     res.send("Welcome Sumit BHai");
// })



app.use(session(sessionOptions));
app.use(flash());

// PASSPORT IS AN NPM PACKAGE USED FOR AUTHENTICATE AND ALSO INITIALIZE AFTER SESSIONS
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.done = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


// Creating Demo USER For Authentication

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "Sumit@gmail.com",
        username: "Sumit",
    })

    let registerUser = await User.register(fakeUser, "Sumit");
    res.send(registerUser);


})


// INDEX ROUTE
app.get("/listings", wrapAsyanc(conrollers.index));

// CREATE ROUTE

app.get("/listings/new", isLoggedIn, conrollers.newForm )

// READ ROUTE

app.get("/listings/:id", wrapAsyanc(conrollers.readListing))




app.use(express.json());

const ValidateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body); //This Is Using Joi Validation

    if (error) {
        // throw new ExpressError("400", "Something Went Wrong!");
        // console.log(error.details);
        // console.log(req.body);
        next();
    } else {
        next();
    }
}

const Validatereview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    console.log(req.body);

    if (error) {
        // throw new ExpressError("400", "Something Went Wrong");
        next()
        // console.log(error);

    } else {
        next();
    }

}

app.post("/listings", upload.single('listing[image]'),ValidateListing, wrapAsyanc(conrollers.creatingNewListing));
// app.post("/listings", upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })




// app.use((err, req, res, next) => {
//     let { statuscode, message } = err;
//     res.status(statuscode).send(message);
//     console.log("Something Went Wrong!");
//     // res.render("error.ejs", {err});
// })

// Edit Route

app.get("/listings/:id/edit", isLoggedIn, wrapAsyanc(conrollers.findingListingtoedit))


// Update Route

app.put("/listings/:id", upload.single('listing[image]'), ValidateListing, wrapAsyanc(conrollers.editListing))

// DELETE ROUTE

app.delete("/listings/:id", isLoggedIn, wrapAsyanc(conrollers.deletingListing));






// Review - POST Route

app.post("/listings/:id/reviews", isLoggedIn, Validatereview, wrapAsyanc(reviewConrollers.creatingReview))


// Middleware For Unlisted page
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
//     // res.render("error.ejs");
// })



// Deleting Reviews

app.delete("/listings/:id/reviews/:reviewId", isLoggedIn, wrapAsyanc(reviewConrollers.deletingReview))

// await Listing.findByIdAndUpdate( id ,{$pull : {reviews : reviewId}});
// await Review.findByIdAndDelete(reviewId);



//============ Signup Form For User authentication===============

// For SignUp
app.get("/signup", (req, res) => {
    res.render("./user/signup.ejs")
})


app.post("/signup", wrapAsyanc(async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        req.login(registerUser, (err) => {
            if ((err) => {
                return next(err);
            })
                req.flash("success", "User Registered!!");
                res.redirect("/listings");

        })

        // req.flash("success", "User Registered!!");

        // Login Functionality After SignUp







    } catch (err) {
        // res.send("Error While SignUp");
        req.flash("error", err.message);
        res.redirect("/signup");
    }


}))



// For Login

app.get("/login", (req, res) => {
    res.render("./user/login.ejs");
})

app.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {

    req.flash("success", "Welcome To WanderLust You Are Login");
    res.redirect( "/listings");


})


app.get("/logout", (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "you are logged out");
        res.redirect("/listings");




    })


})


// <% if( currUser && currUser._id.equals(listingdata.owner._id)) {  %> 

