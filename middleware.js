module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){

        // RedirectURL

        // req.session.redirect = req.originalUrl;
        
        req.flash("error","you must be logged in to create listing");
       return res.redirect("/login");
    }
    next()
}


// module.exports.saveRedirectUrl=(req,res,next)=>{
//     if(res.session.redirect){
//         req.locals.redirect = res.session.redirect;

//     }
//     next();
// }