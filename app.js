const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override"); 
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema } = require("./schema.js");
const Review = require("./models/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
     
     if(error) {
        throw new ExpressError(400, result.error);
     } else{
        next();
     }
}





app.get("/", (req, res) => {
    res.send("HI i am root");
});

//index route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await  Listing.find({});
  res.render("./listings/index.ejs", {allListings});
}));

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
   });
   

//show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post(
    "/listings", validateListing,
    wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save(); 
    res.redirect("/listings");   
})
);

//edit route
app.get("/listings/:id/edit",wrapAsync(async (req, res) => {
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
app.put("/listings/:id", 
    wrapAsync(async (req, res) =>{
    if(!req.body.listing){
        throw new ExpressError(404, "send valid data for listing")
    }
    let { id } = req.params;
   await Listing.findByIdAndUpdate(id, { ...req.body.listing});
   res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

//reviews
//post route
app.post("/listings/:id/reviews", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();


 res.redirect(`/listings/${listing._id}`);
});




// app.get("/testListing", async (req, res)=>{
//  let sampleListing = new Listing({
//     title: "My New Villa",
//     descriptipn: "By the beach",
//     price: 1200,
//     location: "Calangate, Goa",
//     country:"India",
//  });

//  await sampleListing.save();
//  console.log("sample was saved");
//  res.send("successfull testing");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
    let{ statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
 //res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening to post 8080");
});

