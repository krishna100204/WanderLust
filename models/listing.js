const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");



const listingSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },   
    description: String,
    image: {
        type: String,
        set: (v) => v === "" ? "https://media.istockphoto.com/id/1740583164/photo/ocean-sunrise-over-the-tropical-sea-shore-and-exotic-island-beach.jpg?s=1024x1024&w=is&k=20&c=EbKvGRbF5v_fMvIv-m2rX3Q5WPCcm1lhes8ry2WIvvI=" : v,
    },
    price: String,
    location: String,
    country: String,
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review",
        }
    ]
});
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
