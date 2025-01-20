const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js")
const reviewContoller = require("../controllers/reviews.js");

//reviews
//post route
router.post(
    "/",
    isLoggedIn,
    validateReview, 
    wrapAsync(reviewContoller.createReview));

//delete route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor,
    wrapAsync(reviewContoller.destroyReview));
module.exports = router;