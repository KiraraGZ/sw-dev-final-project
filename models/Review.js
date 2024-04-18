const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a Booking model
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // Assuming you have a Booking model
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking", // Assuming you have a Booking model
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    rating: {
        type: Number,
        required: true,
        validate: {
          validator: function(value) {
            return Number.isInteger(value) && value >= 1 && value <= 5;
          },
          message: props => `${props.value} is not a valid rating. Rating must be an integer between 1 and 5.`,
        },
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  module.exports = mongoose.model("Review", ReviewSchema)