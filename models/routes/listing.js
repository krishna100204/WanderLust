const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
   if(error) {
        throw new ExpressError(400, error.details[0].message);
     } else{
        next();
     }
};


//index route
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await  Listing.find({});
  res.render("./listings/index.ejs", {allListings});
}));

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
   });
   

//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//create route
router.post(
    "/", validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 
    res.redirect("/listings");   
})
);

//edit route
router.get("/:id/edit",wrapAsync(async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Remove leading/trailing whitespace
    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit.ejs", { listing });
    } catch (err) {
        res.status(500).send("Error finding listing");
    }
}));

//update route
router.put("/:id", 
    wrapAsync(async (req, res) =>{
    if(!req.body.listing){
        throw new ExpressError(404, "send valid data for listing")
    }
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id, { ...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;