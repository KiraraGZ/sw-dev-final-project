const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
        type: String,
        required: [true, "Please add an address"],
    },
    district: {
        type: String,
        required: [true, "Please add a district"],
    },
    province: {
        type: String,
        required: [true, "Please add a province"],
    },
    postalcode: {
        type: String,
        required: [true, "Please add a postal code"],
        maxlength: [5, "Postal Code can not be more than 5 digits"],
    },
    tel: {
        type: String,
    },
    region: {
        type: String,
        required: [true, "Please add a region"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HotelSchema.virtual("bookings", {
    ref: "Booking",
    localField: "_id",
    foreignField: "hotel",
    justOne: false,
});

HotelSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
    console.log(`Booking is being removed from hotel ${this._id}`);
    await this.model("Booking").deleteMany({ hotel: this._id });
    next();
});
module.exports = mongoose.model("Hotel", HotelSchema);