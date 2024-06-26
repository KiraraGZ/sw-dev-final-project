const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

exports.getBookings = async (req, res, next) => {
  let query;
  if(req.user.role !== 'admin'){
      query=Booking.find({user:req.user.id}).populate({
          path:'hotel',
          select: 'name province tel'
      });
  }else {
      query=Booking.find().populate({
          path:'hotel',
          select: 'name province tel'
      });
  }
  try {
      const bookings = await query;

      res.status(200).json({
          success:true,
          count: bookings.length,
          data:bookings
      });
  } catch (err) {
      console.log(err.stack);
      return res.status(500).json({
          success:false,
          message:"Cannot find Booking"
      });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;

    req.body.user = req.user.id;

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({success: false, message: `No hotel with the id of ${req.params.hotelId}`});
    }

    //Check fpr existed appointment
    const existedBookings = await Booking.find({user:req.user.id});
        
    //If the user is not an admin, they can only create 3 bookings.
    if(existedBookings.length >=3 && req.user.role !== 'admin'){
        return res.status(400).json({success:false, message:`The user with ID ${req.user.id} has already made 3 bookings`});
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({ success: true, data: booking, message: `Booking Succesful`});
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: "Cannot create Booking" });
  }
};

exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "hotel",
      select: "name description tel",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with this id of ${req.params.id} `,
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot find booking `,
    });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with this id of ${req.params.id} `,
      });
    }
    // here
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot update booking `,
    });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;

    const booking = await Booking.findByIdAndDelete(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id} `,
      });
    }
    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot delete booking `,
    });
  }
};
