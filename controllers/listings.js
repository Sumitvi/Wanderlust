const listing = require("../Models/listings.js");


module.exports.index = async (req, res) => {
    let allListings = await listing.find({});

    res.render("./Listings/listings.ejs", { allListings });

    // res.send("working");

}


module.exports.newForm = (req, res) => {

    res.render("./Listings/new.ejs");

}



module.exports.readListing = async (req, res) => {
    let { id } = req.params;
    let listingdata = await listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing Not Exist!!");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./Listings/read.ejs", { listingdata });
}




module.exports.creatingNewListing = async (req, res, next) => {

    // let newdata = req.body;
    // console.log(newdata);

    // THIS IS THE OLD ONE METHOD
    //     let {title,description, image,price,location,country}=req.body;

    //     let newdata = new listing({
    //         title:title,
    //         description:description,
    //         image:image,
    //         price:price,
    //         location:location,
    //         country:country,

    //     })

    //    await newdata.save().then((res)=>{console.log(res)});

    //     res.redirect("/listings")


    // NEW METHOD


    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send Valid Data For Listing");
    // }


    
    

    
    let newListing = new listing(req.body.listing);
     
    let filename = req.file.filename;
    let url = req.file.path;
    console.log(url, "...." ,filename);



    // if(!newListing.title){
    //     throw new ExpressError(400,"Title Is Missing");
    // }
    // if(!newListing.price){
    //     throw new ExpressError(400,"Price Is Missing");
    // }
    // if(!newListing.description){
    //     throw new ExpressError(400,"Description Is Missing");
    // }
    // if(!newListing.country){
    //     throw new ExpressError(400,"Country Is Missing");
    // }
    // if(!newListing.location){
    //     throw new ExpressError(400,"Location Is Missing");
    // }
    newListing.save();
    // newListing.owner = req.user._id;
    newListing.image = {url,filename};
    req.flash("success", "New Listing Created!!");
    // console.log(newListing);
    res.redirect("/listings");

}



module.exports.findingListingtoedit = async (req, res) => {
    let { id } = req.params;
    let listingdata = await listing.findById(id);
    res.render("./Listings/edit.ejs", { listingdata });
}


module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let newValue = req.body;
    console.log(newValue);
    try {
        let update = await listing.findByIdAndUpdate(
            id,
            newValue,
            { runValidators: true, new: true }
        );

        if(typeof req.file!=="undefined"){
        let filename = req.file.filename;
        let url = req.file.path;
        update.image = {url,filename};
        await update.save();
        }

        console.log(update);
        req.flash("success", "Listing Has Updated!!");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.log(err);
    }
}



module.exports.deletingListing = async (req, res) => {
    let { id } = req.params;
    let dlt = await listing.findByIdAndDelete(id);
    console.log(dlt);
    req.flash("success", "Listing Has Been Deleted!!");
    res.redirect("/listings");
}