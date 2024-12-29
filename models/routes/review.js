const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
     
     if(error) {
        throw new ExpressError(400, result.error);
     } else{
        next();
     }
};


//reviews
//post route
router.post(
    "/",
     validateReview , 
     wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();


 res.redirect(`/listings/${listing._id}`);
})
);

//delete route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;

        // Pull the review ID from the listing's reviews array
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review document from the Review model
        await Review.findByIdAndDelete(reviewId);

        // Redirect to the listing's page after the review is deleted
        res.redirect(`/listings/${id}`);
    })
);
module.exports = router;