const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Email = require("../utils/email");

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

exports.sendmail = catchAsync(async (req, res, next) => {
  const mailRes = await new Email(req.user, req.body).sendBookingConfirmation();
  console.log(mailRes);
  res.status(200).json({
    status: "success",
    data: {
      // message: `Booking confirmation mail sent to ${req.user.email}`,
      mailRes
    }
  });
});
