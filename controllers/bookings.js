const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

exports.getBookings = async (req, res, next) => {
  let query;
  try {
    if (req.user.role !== "admin") {

      console.log(error);
      query = Booking.find({ user: req.user.id }).populate({
        path: "hotel",
        select: "name province tel",
      });

    } else {
      console.log(req.params.hotelId);
      if (req.params.hotelId) {
        console.log(req.params.hotelId);
        query = Booking.find({ hotel: req.params.hotelId }).populate({
          path: "hotel",
          select: "name province tel",
        });
      } else {
        query = Booking.find().populate({
          path: "hotel",
          select: "name province tel",
        });
      }
    }

    const bookings = await query;
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
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

    const booking = await Booking.create(req.body);

    res.status(201).json({ success: true, data: booking });
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
    const booking = await Booking.findById(req.params.id);
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

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
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
