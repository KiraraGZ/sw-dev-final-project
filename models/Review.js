const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // Assuming you have a User model
      required: true,
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