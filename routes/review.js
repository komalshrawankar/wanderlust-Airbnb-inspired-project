const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema, reviewSchema}= require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
//const flash = require("connect-flash");
const{validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js");
const { createReview } = require("../controllers/reviews.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/reviews.js");






//create review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//delete review

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));
module.exports = router;
