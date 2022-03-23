const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllBooking = catchAsync(async (req, res, next) => {
  const params = {};
  if (req.query.doctor) params.doctor = req.query.doctor;
  if (req.query.user) params.user = req.query.user;
  const bookings = await Booking.find(params).sort("-slot");
  res.status(200).json({
    status: "success",
    data: {
      results: bookings.length,
      data: bookings
    }
  });
});
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
