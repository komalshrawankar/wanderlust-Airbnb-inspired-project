const { listingSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
    let { search } = req.query;
    let listings;
    
    if (search) {
        listings = await Listing.find({ title: { $regex: search, $options: 'i' } });
    } else {
        listings = await Listing.find({});
    }

    res.render("listings/index", {allListings :  listings });
};
module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
};
module.exports.showListings = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing = async (req, res, next) => {
    console.log("🛠️ Received POST /listings");
    console.log(" req.body: ", req.body);
    console.log(" req.file: ", req.file);

    const result = listingSchema.validate(req.body);
    if (result.error) {
        console.log("Validation Error: ", result.error);
        throw new ExpressError(400, result.error);
    }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
        const { path: url, filename } = req.file;
        newListing.image = { url, filename };
    }

    await newListing.save();
    console.log("✅ Listing saved");

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

   module.exports.renderEditForm = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist!");
        res.redirect("/listings");
    }
    req.flash("success","Listing updated!")
    res.render("listings/edit.ejs",{listing});

};
//const Listing = require("../models/listing");

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    // Update listing fields from form
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;

    // Check if a new image is uploaded
    if (req.file) {
        const { path: url, filename } = req.file;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async(req,res)=>{
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!")
    res.redirect("/listings");
};