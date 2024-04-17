const Review = require("../models/Review");
const Hotel = require("../models/Hotel");

exports.getReviews = async (req, res, next) => {
    let query;
    try {
      if (req.user.role !== "admin") {
  
        console.log(error);
        query = Review.find({ user: req.user.id }).populate({
          path: "hotel",
          select: "name province tel",
        });
  
      } else {
        console.log(req.params.hotelId);
        if (req.params.hotelId) {
          console.log(req.params.hotelId);
          query = Review.find({ hotel: req.params.hotelId }).populate({
            path: "hotel",
            select: "name province tel",
          });
        } else {
          query = Review.find().populate({
            path: "hotel",
            select: "name province tel",
          });
        }
      }
  
      const reviews = await query;
      res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  exports.addReview = async (req, res, next) => {
    try {
      req.body.hotel = req.params.hotelId;
  
      req.body.user = req.user.id;
  
      const hotel = await Hotel.findById(req.params.hotelId);
  
      if (!hotel) {
        return res.status(404).json({success: false, message: `No hotel with the id of ${req.params.hotelId}`});
      }
  
      const review = await Review.create(req.body);
  
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({ success: false, message: "Cannot create Booking" });
    }
  };
  
  exports.getReview = async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id).populate({
        path: "hotel",
        select: "name description tel",
      });
      if (!review) {
        return res.status(404).json({
          success: false,
          message: `No review with this id of ${req.params.id} `,
        });
      }
      res.status(200).json({
        success: true,
        data: review,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: `Cannot find review `,
      });
    }
  };