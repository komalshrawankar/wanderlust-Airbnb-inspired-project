const express = require("express");
const router = express.Router();
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const Listing = require("../models/listing.js");
//const flash = require("connect-flash");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js")
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})


// Index routes
router.get("/", wrapAsync(listingController.index));
//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);
//show routes
router.get("/:id",wrapAsync(listingController.showListings));
//create route
//router.post("/",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.createListing)
//);
router.post(
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
);
//serch bar
//  Correct one
//router.get("/", wrapAsync(listingController.index));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
//update routes
router.put("/:id",isLoggedIn,isOwner, upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));
//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports= router;