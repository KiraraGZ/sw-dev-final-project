const Review = require("../models/Review");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");

exports.getReviews = async (req, res, next) => {
  let query;
  if(req.user.role !== 'admin'){
      query=Review.find({user:req.user.id}).populate({
          path:'hotel',
          select: 'name province tel'
      });
  }else {
      query=Review.find().populate({
          path:'hotel',
          select: 'name province tel'
      });
  }
  try {
      const reviews = await query;

      res.status(200).json({
          success:true,
          count: reviews.length,
          data:reviews
      });
  } catch (err) {
      console.log(err.stack);
      return res.status(500).json({
          success:false,
          message:"Cannot find Review"
      });
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

      const booking = await Booking.findById(req.body.booking)

      if((Date.now() - booking.bookDate) / (1000 * 60 * 60 * 24) > 3) {
        return res.status(404).json({success: false, message: `Exceed 3 days with the booking id of ${req.body.booking}`});
      }

      if(req.user.id != booking.user && req.user.role != "admin") {
        return res.status(404).json({success: false, message: `Unauthorized access to booking id ${req.body.booking}`});
      }

      const isreviewed = await Review.find({ booking: req.body.booking });

      if (isreviewed.length > 0) {
        return res.status(404).json({success: false, message: `You have already reviewed the booking id ${req.body.booking}`});
      }

      const review = await Review.create(req.body);
  
      res.status(201).json({ success: true, data: review });

    } catch (error) {
      console.log(error);
  
      return res.status(500).json({ success: false, message: "Cannot create Review" });
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

  exports.getAverageRating = async (req, res, next) => {
    try {
      const reviews = await Review.find({ hotel: req.params.id });
  
      if (reviews.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No reviews found for the hotel with id ${req.params.id}`,
        });
      }
  
      const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRatings / reviews.length;
  
      res.status(200).json({
        success: true,
        data: {
          hotelId: req.params.id,
          averageRating: averageRating.toFixed(1),
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: `Error while calculating average rating`,
      });
    }
  };
  